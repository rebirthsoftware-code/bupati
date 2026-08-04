import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { getSettings, listConversations } from "@/lib/chat/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const [conversations, settings] = await Promise.all([listConversations(), getSettings()]);
  return NextResponse.json(
    { conversations, settings, serverTime: Date.now() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
