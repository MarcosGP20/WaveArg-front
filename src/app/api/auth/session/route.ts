import { NextRequest, NextResponse } from "next/server";
import { authCookieOptions } from "@/lib/auth-cookie";
import { decodeJWT } from "@/lib/jwt";

function getTokenMaxAge(token: string): number {
  const payload = decodeJWT(token) as { exp?: number } | null;
  if (!payload?.exp) return 0;

  return Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
}

export async function POST(req: NextRequest) {
  const { token } = (await req.json().catch(() => ({}))) as { token?: string };

  if (!token) {
    return NextResponse.json({ error: "Token requerido" }, { status: 400 });
  }

  const maxAge = getTokenMaxAge(token);
  if (maxAge <= 0) {
    return NextResponse.json({ error: "Token invalido o expirado" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({ ...authCookieOptions(maxAge), value: token });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({ ...authCookieOptions(0), value: "" });

  return response;
}
