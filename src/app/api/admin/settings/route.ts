import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { updateSettings } from "@/lib/chat/store";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const settings = await updateSettings(body);
  return NextResponse.json({ settings }, { headers: { "Cache-Control": "no-store" } });
}
