import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = (request.headers.get("host") || request.headers.get("x-forwarded-host") || new URL(request.url).host).split(",")[0].trim();
  try {
    if (!origin || new URL(origin).host !== host || !["https:", "http:"].includes(new URL(origin).protocol)) return NextResponse.json({ code: "INVALID_ORIGIN" }, { status: 403 });
  } catch { return NextResponse.json({ code: "INVALID_ORIGIN" }, { status: 403 }); }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 415 });
  if (Number(request.headers.get("content-length") || 0) > 1024) return NextResponse.json({ code: "REQUEST_TOO_LARGE" }, { status: 413 });
  const text = await request.text();
  if (text.length > 1024) return NextResponse.json({ code: "REQUEST_TOO_LARGE" }, { status: 413 });
  let body;
  try { body = JSON.parse(text); } catch { return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400 }); }
  if (body?.confirmation !== "DELETE") return NextResponse.json({ code: "CONFIRMATION_REQUIRED" }, { status: 400 });
  const user = await getCurrentUser();
  const id = user?.id;
  if (!id) return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401 });
  try {
    await prisma.$transaction(async (tx) => {
      const current = await tx.user.findUnique({ where: { id }, select: { role: true } });
      if (!current) return;
      if (current.role === "ADMIN" && await tx.user.count({ where: { role: "ADMIN", id: { not: id } } }) === 0) throw new Error("LAST_ADMIN");
      await tx.user.delete({ where: { id } });
    }, { isolationLevel: "Serializable" });
    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    for (const part of (request.headers.get("cookie") || "").split(";")) {
      const name = part.trim().split("=")[0];
      if (/^(?:(?:__Secure-)?next-auth\.session-token|(?:__Secure-)?authjs\.session-token)(?:\.\d+)?$/.test(name) || name === "huzy_chat_session") response.cookies.set(name, "", { path: "/", maxAge: 0, httpOnly: true, secure: name.startsWith("__Secure-"), sameSite: "lax" });
    }
    return response;
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "LAST_ADMIN") return NextResponse.json({ code }, { status: 409 });
    console.error("Account withdrawal failed", error);
    return NextResponse.json({ code: "DELETE_FAILED" }, { status: 500 });
  }
}
