import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { transformSync } from 'esbuild';

const paths = ['src/app/api/account/withdraw/route.ts', 'app/api/account/withdraw/route.ts'];
const path = paths.find((p) => fs.existsSync(p));
const source = transformSync(fs.readFileSync(path, 'utf8'), { loader: 'ts', format: 'cjs', target: 'es2022' }).code;

function setup({ authenticated = true, failure = false, owned = false, lastAdmin = false, shared = false } = {}) {
  const calls = [];
  const user = authenticated ? { id: 'self', userId: 'self', uid: 'self', role: lastAdmin ? 'ADMIN' : 'USER', email: 'self@example.invalid' } : null;
  const tx = new Proxy({}, { get: (_, model) => {
    if (model === '$executeRaw') return async () => { calls.push(['raw']); if (failure) throw new Error('database unavailable'); return 1; };
    return new Proxy({}, { get: (_, method) => async (args) => {
      calls.push([model, method, args]);
      if (failure) throw new Error('database unavailable');
      if (method === 'findUnique') return user;
      if (method === 'upsert') return { id: 'withdrawn-member' };
      if (method === 'count') return model === 'membership' && owned ? 1 : model === 'chatUser' && lastAdmin ? 0 : 0;
      return {};
    } });
  } });
  const prisma = new Proxy(tx, { get: (target, key) => key === '$transaction' ? async (fn) => {
    calls.push(['begin']);
    try { const result = await fn(tx); calls.push(['commit']); return result; } catch (error) { calls.push(['rollback']); throw error; }
  } : target[key] });
  const connection = {
    beginTransaction: async () => calls.push(['begin']), commit: async () => calls.push(['commit']), rollback: async () => calls.push(['rollback']), release: () => calls.push(['release']),
    execute: async (sql, values) => {
      calls.push(['sql', sql, values]);
      if (failure) throw new Error('database unavailable');
      if (sql.startsWith('SELECT uid FROM ab_users')) return [[{ uid: 'self' }]];
      if (sql.startsWith('SELECT uid FROM ab_books')) return [[{ uid: 'own-book' }]];
      if (sql.startsWith('SELECT user_uid')) return [shared ? [{ user_uid: 'other-member' }] : []];
      return [[]];
    },
  };
  const NextResponse = { json: (body, options = {}) => ({ status: options.status || 200, body, cookies: { set: (...args) => calls.push(['cookie', ...args]) } }) };
  const module = { exports: {} };
  const require = (name) => {
    if (name === 'next/server') return { NextResponse };
    if (name === 'next-auth') return { getServerSession: async () => ({ user }) };
    if (name.endsWith('/db')) return { __esModule: true, default: { getConnection: async () => connection }, db: prisma, prisma };
    if (name.endsWith('/prisma')) return { __esModule: true, default: prisma, prisma };
    if (name.endsWith('/account-auth')) return { getCurrentUser: async () => user };
    if (name.endsWith('/app-auth')) return { getAuthorizedAppUser: async () => user, memberUserId: (id) => `member:${id}` };
    if (name.endsWith('/session-cookies')) return { clearSessionCookie: (response) => response };
    return { getCurrentUser: async () => user, authOptions: {}, auth: async () => ({ user }) };
  };
  vm.runInNewContext(source, { module, exports: module.exports, require, console: { error() {} }, URL });
  const request = (body = { confirmation: 'DELETE' }, headers = {}) => new Request('https://example.huzy.net/api/account/withdraw', { method: 'POST', headers: { host: 'example.huzy.net', origin: 'https://example.huzy.net', 'content-type': 'application/json', cookie: '__Secure-next-auth.session-token.0=x; next-auth.session-token=y; unrelated=z', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
  return { calls, post: module.exports.POST, request };
}

test('rejects absent and foreign origins before touching the database', async () => {
  for (const origin of ['', 'https://attacker.invalid', 'null']) {
    const { calls, post, request } = setup();
    assert.equal((await post(request(undefined, { origin }))).status, 403);
    assert.equal(calls.length, 0);
  }
});
test('requires JSON and an exact deliberate confirmation', async () => {
  for (const body of ['{', {}, { confirmation: 'delete' }]) {
    const { calls, post, request } = setup();
    assert.equal((await post(request(body))).status, 400);
    assert.equal(calls.length, 0);
  }
  const { post, request } = setup();
  assert.equal((await post(request({}, { 'content-type': 'text/plain' }))).status, 415);
});
test('rejects unauthenticated requests with no data changes', async () => {
  const { calls, post, request } = setup({ authenticated: false });
  assert.equal((await post(request())).status, 401);
  assert.equal(calls.length, 0);
});
test('uses the session identity instead of a submitted victim id and commits atomically', async () => {
  const { calls, post, request } = setup();
  const result = await post(request({ confirmation: 'DELETE', id: 'victim', uid: 'victim', userId: 'victim' }));
  assert.equal(result.status, 200);
  assert.ok(calls.some((c) => c[0] === 'commit'));
  assert.ok(!JSON.stringify(calls).includes('victim'));
  assert.ok(!calls.some((c) => c[0] === 'cookie' && c[1] === 'unrelated'));
});
test('database failure rolls back and does not expire the login session', async () => {
  const { calls, post, request } = setup({ failure: true });
  assert.equal((await post(request())).status, 500);
  assert.ok(calls.some((c) => c[0] === 'rollback'));
  assert.ok(!calls.some((c) => c[0] === 'commit' || c[0] === 'cookie'));
});
if (fs.existsSync('database/schema.sql')) test('shared account books transfer to another member without deleting shared entries', async () => {
  const { calls, post, request } = setup({ shared: true });
  assert.equal((await post(request())).status, 200);
  assert.ok(calls.some((c) => c[0] === 'sql' && c[1].startsWith('UPDATE ab_books SET owner_uid') && c[2][0] === 'other-member'));
  assert.ok(!calls.some((c) => c[0] === 'sql' && c[1].startsWith('DELETE FROM ab_transactions')));
});
if (fs.existsSync('src/components/console-header-nav.tsx')) test('project owners must transfer ownership first', async () => {
  const { calls, post, request } = setup({ owned: true });
  assert.equal((await post(request())).status, 409);
  assert.ok(calls.some((c) => c[0] === 'rollback'));
  assert.ok(!calls.some((c) => c[0] === 'commit'));
});

test('bounds confirmation request size before accessing account data', async () => {
  const { calls, post, request } = setup();
  assert.equal((await post(request({ confirmation: 'DELETE' }, { 'content-length': '1025' }))).status, 413);
  assert.equal((await post(request({ confirmation: 'DELETE', extra: 'x'.repeat(1025) }))).status, 413);
  assert.equal(calls.length, 0);
});

test('the last administrator must remain and no data is deleted', async () => {
  const { calls, post, request } = setup({ lastAdmin: true });
  const result = await post(request());
  assert.equal(result.status, 409);
  assert.equal(result.body.code, 'LAST_ADMIN');
  assert.ok(!calls.some((call) => call[1] === 'delete' || call[0] === 'commit'));
});
