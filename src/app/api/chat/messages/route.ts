import { NextRequest, NextResponse } from "next/server";
import { addMessage, getConversationState, markRead } from "@/lib/chat/store";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  const conversationId = request.nextUrl.searchParams.get("conversationId") ?? "";
  const since = Number(request.nextUrl.searchParams.get("since") ?? 0) || 0;

  const state = await getConversationState(conversationId, since);
  if (!state) {
    return NextResponse.json({ error: "Sohbet bulunamadı" }, { status: 404, headers: noStore });
  }

  if (state.conversation.unreadForUser > 0) {
    await markRead(conversationId, "user");
  }

  return NextResponse.json(
    {
      messages: state.messages,
      settings: state.settings,
      status: state.conversation.status,
      serverTime: Date.now(),
    },
    { headers: noStore }
  );
}

export async function POST(request: NextRequest) {
  let body: { conversationId?: string; text?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400, headers: noStore });
  }

  if (!body.conversationId || !body.text) {
    return NextResponse.json({ error: "Eksik alan" }, { status: 400, headers: noStore });
  }

  const message = await addMessage(body.conversationId, "user", body.text);
  if (!message) {
    return NextResponse.json({ error: "Mesaj gönderilemedi" }, { status: 400, headers: noStore });
  }

  return NextResponse.json({ message }, { headers: noStore });
}
