import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { deleteConversation, setConversationStatus } from "@/lib/chat/store";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  let body: { conversationId?: string; status?: "open" | "closed" } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  if (!body.conversationId || (body.status !== "open" && body.status !== "closed")) {
    return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
  }

  const conversation = await setConversationStatus(body.conversationId, body.status);
  if (!conversation) {
    return NextResponse.json({ error: "Sohbet bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ conversation });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const conversationId = request.nextUrl.searchParams.get("conversationId") ?? "";
  if (!conversationId) {
    return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
  }

  await deleteConversation(conversationId);
  return NextResponse.json({ ok: true });
}
