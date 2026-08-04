import { NextResponse } from "next/server";
import { getSettings } from "@/lib/chat/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(
    {
      online: settings.online,
      widgetEnabled: settings.widgetEnabled,
      agentName: settings.agentName,
      welcomeMessage: settings.welcomeMessage,
      awayMessage: settings.awayMessage,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
