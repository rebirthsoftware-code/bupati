import { NextRequest, NextResponse } from "next/server";
import { startConversation } from "@/lib/chat/store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: { name?: string; contact?: string; topic?: string } = {};
  try {
    body = await request.json();
  } catch {
    /* boş gövde kabul edilir */
  }

  const result = await startConversation(body);
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
