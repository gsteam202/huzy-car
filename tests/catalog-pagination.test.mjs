import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),ts=require(process.env.TYPESCRIPT_PATH||'typescript');
const root=new URL('../',import.meta.url),jsx=(type,props)=>({type,props});
const code=path=>ts.transpileModule(fs.readFileSync(new URL(path,root),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
function evaluate(path,mocks){const exports={};vm.runInNewContext(code(path),{exports,URLSearchParams,require:id=>{assert.ok(id in mocks,id);return mocks[id];}});return exports;}
const basic={'react/jsx-runtime':{jsx,jsxs:jsx},react:{Fragment:'fragment'},'next/link':{__esModule:true,default:'a'},'next/cache':{unstable_cache:f=>f},'next/navigation':{notFound:()=>{throw Error('404');}},'lucide-react':new Proxy({},{get:(_,key)=>key})};
const pagination=evaluate('src/lib/catalog-pagination.ts',basic);
const nav=evaluate('src/components/common/catalog-pagination.tsx',{...basic,'@/lib/catalog-pagination':pagination});
const nodes=t=>!t||typeof t!=='object'?[]:typeof t.type==='function'?nodes(t.type(t.props)):[t,...[t.props?.children].flat(Infinity).flatMap(nodes)];
for(const category of ['community','used-cars'])test(`${category}: actual page links cover every row after the first thirty`,async()=>{
 const rows=Array.from({length:97},(_,i)=>({id:String(i+1),title:'Title '+i,content:'Content',createdAt:new Date(),board:{name:'Board'},author:{nickname:'Public nickname'},brand:{slug:'brand',nameKo:'Brand'},model:{slug:String(i+1)},mileageKm:10000,price:1000000}));
 const calls=[];const model={count:async()=>rows.length,findMany:async q=>{calls.push(q);return rows.slice(q.skip,q.skip+q.take);}};
 const mocks={...basic,'@/lib/catalog-pagination':pagination,'@/components/common/catalog-pagination':nav,'@/lib/db':{prisma:{post:model,usedCarListing:model,board:{findMany:async()=>[]},carBrand:{findMany:async()=>[]}}},'@/lib/finance':{formatKoreanMoney:String},'@/components/ads/ad-banner':{__esModule:true,default:'aside'},'@/components/cars/car-image':{CarImage:'img'}};
 const app=evaluate(`src/app/${category}/page.tsx`,mocks);let page=1;const found=[];
 do{
  const tree=await app.default({searchParams:Promise.resolve({page:String(page)})});const links=nodes(tree).filter(n=>n.type==='a').map(n=>n.props.href);
  found.push(...links.filter(h=>h.startsWith('/'+category+'/')&&!h.endsWith('/write')).map(h=>h.split('/').pop()));
  const next=links.find(h=>new URL(h,'https://car.huzy.net').searchParams.get('page')===String(page+1));
  if(!next)break;assert.ok(++page<10);
 }while(true);
 assert.deepEqual(found,rows.map(r=>r.id));assert.ok(calls.every(q=>q.take===30));
 await assert.rejects(()=>app.default({searchParams:Promise.resolve({page:'5'})}),/404/);
 const meta=await app.generateMetadata({searchParams:Promise.resolve({page:'2'})});assert.equal(meta.alternates.canonical,`https://car.huzy.net/${category}?page=2`);
});
test('invalid pages are rejected and filters survive navigation',()=>{
 for(const x of ['0','-1','2.5','bad',['2'],'9999999999999999999'])assert.equal(pagination.catalogPage(x),null);
 assert.equal(pagination.catalogPage(undefined),1);
 const href=pagination.catalogPageHref('/community',2,{board:'free',q:'엔진 & 정비'}),url=new URL(href,'https://car.huzy.net');assert.equal(url.searchParams.get('q'),'엔진 & 정비');assert.equal(url.searchParams.get('board'),'free');assert.equal(url.searchParams.get('page'),'2');
});
