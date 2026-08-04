import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { addMessage, getConversationState, markRead } from "@/lib/chat/store";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401, headers: noStore });
  }

  const conversationId = request.nextUrl.searchParams.get("conversationId") ?? "";
  const state = await getConversationState(conversationId);
  if (!state) {
    return NextResponse.json({ error: "Sohbet bulunamadı" }, { status: 404, headers: noStore });
  }

  if (state.conversation.unreadForAgent > 0) {
    await markRead(conversationId, "agent");
  }

  return NextResponse.json(
    { conversation: state.conversation, messages: state.messages, serverTime: Date.now() },
    { headers: noStore }
  );
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401, headers: noStore });
  }

  let body: { conversationId?: string; text?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400, headers: noStore });
  }

  if (!body.conversationId || !body.text) {
    return NextResponse.json({ error: "Eksik alan" }, { status: 400, headers: noStore });
  }

  const message = await addMessage(body.conversationId, "agent", body.text);
  if (!message) {
    return NextResponse.json({ error: "Mesaj gönderilemedi" }, { status: 400, headers: noStore });
  }

  return NextResponse.json({ message }, { headers: noStore });
}
