import { NextRequest, NextResponse } from "next/server";
import { cookieMaxAge, cookieName, createToken, verifyPassword } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: { password?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  if (!verifyPassword(body.password)) {
    return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: cookieMaxAge,
  });
  return response;
}
