"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/chat/types";
import { site, whatsappLink } from "@/data/site";
import { PawIcon, WhatsAppIcon } from "@/components/icons";

const STORAGE_KEY = "patican.chat.conversation";
const POLL_OPEN = 3000;
const POLL_IDLE = 20000;

/**
 * GitHub Pages gibi sunucusuz ortamlarda API uçları bulunmaz. Bu modda balon
 * tanıtım amaçlı çalışır: tasarım görünür, mesajlar yerel kalır ve ziyaretçi
 * WhatsApp'a yönlendirilir. Vercel yayınında bu değişken tanımlı olmadığı için
 * sohbet gerçek panelle çift taraflı çalışır.
 */
const DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";

const demoSettings: PublicSettings = {
  online: true,
  widgetEnabled: true,
  agentName: "PatiCan Destek",
  welcomeMessage:
    "Merhaba! 🐾 Bu sayfa sitenin önizlemesi olduğu için mesajlarınız henüz kliniğe ulaşmıyor. Tasarımı rahatça deneyebilirsiniz.",
  awayMessage: "",
};

const demoReply =
  "Bu bir önizleme sohbeti 🐾 Canlı destek yayına alındığında mesajınız doğrudan kliniğe düşecek. Şimdilik WhatsApp'tan yazabilirsiniz.";

type PublicSettings = {
  online: boolean;
  widgetEnabled: boolean;
  agentName: string;
  welcomeMessage: string;
  awayMessage: string;
};

const topics = [
  "Randevu almak istiyorum",
  "Aşı / parazit sorusu",
  "Ürün & sipariş",
  "Acil bir durum",
  "Diğer",
];

function timeLabel(ts: number) {
  return new Date(ts).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [topic, setTopic] = useState(topics[0]);
  const [starting, setStarting] = useState(false);
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState("");

  const lastSeen = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);
  openRef.current = open;

  /* --- ayarlar --- */
  useEffect(() => {
    if (DEMO) {
      setSettings(demoSettings);
      return;
    }
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/chat/settings", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as PublicSettings;
        if (alive) setSettings(data);
      } catch {
        /* sessizce geç */
      }
    };
    load();
    const timer = setInterval(load, 30000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  /* --- kayıtlı sohbet --- */
  useEffect(() => {
    if (DEMO) return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setConversationId(saved);
  }, []);

  const mergeMessages = useCallback((incoming: ChatMessage[]) => {
    if (!incoming.length) return;
    setMessages((prev) => {
      const seen = new Set(prev.map((m) => m.id));
      const merged = [...prev, ...incoming.filter((m) => !seen.has(m.id))];
      merged.sort((a, b) => a.createdAt - b.createdAt);
      return merged;
    });
  }, []);

  /* --- yoklama (polling) --- */
  const poll = useCallback(async () => {
    if (DEMO || !conversationId) return;
    try {
      const url = `/api/chat/messages?conversationId=${conversationId}${
        openRef.current ? `&since=${lastSeen.current}` : ""
      }`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.status === 404) {
        window.localStorage.removeItem(STORAGE_KEY);
        setConversationId(null);
        setMessages([]);
        return;
      }
      if (!res.ok) return;
      const data = (await res.json()) as { messages: ChatMessage[]; settings: PublicSettings };
      setSettings((prev) => ({ ...(prev ?? data.settings), ...data.settings }));

      if (openRef.current) {
        if (data.messages.length) {
          lastSeen.current = Math.max(...data.messages.map((m) => m.createdAt));
          mergeMessages(data.messages);
        }
      } else {
        const fresh = data.messages.filter((m) => m.sender !== "user" && m.createdAt > lastSeen.current);
        if (fresh.length) {
          setUnread(fresh.length);
          setMessages(data.messages);
        }
      }
    } catch {
      /* ağ hatasını sessizce yut */
    }
  }, [conversationId, mergeMessages]);

  useEffect(() => {
    if (!conversationId) return;
    poll();
    const timer = setInterval(poll, open ? POLL_OPEN : POLL_IDLE);
    return () => clearInterval(timer);
  }, [conversationId, open, poll]);

  /* --- otomatik kaydırma --- */
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      if (messages.length) lastSeen.current = Math.max(...messages.map((m) => m.createdAt));
    }
  }, [open, messages]);

  const startChat = async (event: React.FormEvent) => {
    event.preventDefault();
    setStarting(true);
    setError("");

    if (DEMO) {
      const now = Date.now();
      setConversationId(`demo-${now}`);
      setMessages([
        {
          id: `demo-welcome-${now}`,
          conversationId: `demo-${now}`,
          sender: "system",
          text: demoSettings.welcomeMessage,
          createdAt: now,
        },
      ]);
      setStarting(false);
      return;
    }

    try {
      const res = await fetch("/api/chat/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, topic }),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as {
        conversation: { id: string };
        messages: ChatMessage[];
        settings: PublicSettings;
      };
      window.localStorage.setItem(STORAGE_KEY, data.conversation.id);
      setConversationId(data.conversation.id);
      setMessages(data.messages);
      setSettings(data.settings);
      lastSeen.current = data.messages.length ? Math.max(...data.messages.map((m) => m.createdAt)) : Date.now();
    } catch {
      setError("Sohbet başlatılamadı. Lütfen tekrar deneyin.");
    } finally {
      setStarting(false);
    }
  };

  const send = async (text: string) => {
    const body = text.trim();
    if (!body || !conversationId || sending) return;
    setSending(true);
    setDraft("");

    const optimistic: ChatMessage = {
      id: `local-${Date.now()}`,
      conversationId,
      sender: "user",
      text: body,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, optimistic]);

    if (DEMO) {
      window.setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `demo-reply-${Date.now()}`,
            conversationId,
            sender: "agent",
            text: demoReply,
            createdAt: Date.now(),
          },
        ]);
      }, 700);
      setSending(false);
      return;
    }

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, text: body }),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { message: ChatMessage };
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? data.message : m)));
      lastSeen.current = Math.max(lastSeen.current, data.message.createdAt);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setError("Mesaj gönderilemedi. İnternet bağlantınızı kontrol edin.");
      setDraft(body);
    } finally {
      setSending(false);
    }
  };

  const resetChat = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setConversationId(null);
    setMessages([]);
    setDraft("");
    lastSeen.current = 0;
  };

  const statusText = useMemo(() => {
    if (DEMO) return "Önizleme modu · tasarımı deneyebilirsiniz";
    if (!settings) return "Bağlanıyor…";
    return settings.online ? "Şu an çevrimiçi · genelde 2 dk içinde yanıt" : "Şu an çevrimdışı · mesaj bırakın";
  }, [settings]);

  if (settings && !settings.widgetEnabled) return null;

  return (
    <>
      {/* Yüzen butonlar */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {!open && (
          <a
            href={whatsappLink("Merhaba, bilgi almak istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp ile yaz"
            className="group flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lift transition hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="h-5 w-5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Canlı desteği kapat" : "Canlı destek sohbetini aç"}
          className="relative grid h-14 w-14 place-items-center rounded-full bg-mint-500 text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-mint-600"
        >
          {!open && settings?.online && (
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-mint-400" aria-hidden />
          )}
          {open ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          ) : (
            <PawIcon className="relative h-7 w-7" />
          )}
          {!open && unread > 0 && (
            <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-coral-500 px-1.5 text-xs font-extrabold text-white">
              {unread}
            </span>
          )}
        </button>
      </div>

      {/* Sohbet paneli */}
      {open && (
        <div className="fixed inset-x-3 bottom-24 z-50 animate-pop-in sm:inset-x-auto sm:right-5 sm:w-[380px]">
          <div className="flex max-h-[70vh] flex-col overflow-hidden rounded-4xl border border-white bg-cream-50 shadow-lift">
            {/* Başlık */}
            <div className="relative bg-mint-600 px-5 py-4 text-white">
              <div className="paw-pattern absolute inset-0 opacity-30" aria-hidden />
              <div className="relative flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/15">
                  <PawIcon className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-bold leading-tight">
                    {settings?.agentName ?? "PatiCan Destek"}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-mint-100">
                    <span
                      className={`h-2 w-2 rounded-full ${settings?.online ? "bg-green-300" : "bg-cream-300"}`}
                      aria-hidden
                    />
                    {statusText}
                  </p>
                </div>
                {conversationId && (
                  <button
                    type="button"
                    onClick={resetChat}
                    className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold transition hover:bg-white/25"
                  >
                    Yeni sohbet
                  </button>
                )}
              </div>
            </div>

            {!conversationId ? (
              /* Sohbet öncesi form */
              <form onSubmit={startChat} className="space-y-3 p-5">
                <p className="text-sm text-ink-600">
                  Merhaba! 🐾 Size daha hızlı yardımcı olabilmemiz için birkaç bilgi alalım.
                </p>
                <div>
                  <label className="mb-1 block text-xs font-bold text-ink-600" htmlFor="chat-name">
                    Adınız
                  </label>
                  <input
                    id="chat-name"
                    className="field"
                    placeholder="Örn. Ayşe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={60}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-ink-600" htmlFor="chat-contact">
                    Telefon <span className="font-normal text-ink-400">(isteğe bağlı)</span>
                  </label>
                  <input
                    id="chat-contact"
                    className="field"
                    placeholder="05xx xxx xx xx"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    maxLength={30}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-ink-600" htmlFor="chat-topic">
                    Konu
                  </label>
                  <select
                    id="chat-topic"
                    className="field"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  >
                    {topics.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                {error && <p className="text-xs font-bold text-coral-600">{error}</p>}
                <button type="submit" className="btn-primary w-full" disabled={starting}>
                  {starting ? "Bağlanıyor…" : "Sohbeti Başlat"}
                </button>
                <p className="text-center text-[11px] text-ink-400">
                  Acil durumlarda lütfen {site.phoneDisplay} numarasını arayın.
                </p>
              </form>
            ) : (
              <>
                {/* Mesajlar */}
                <div ref={listRef} className="chat-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {messages.map((m) => {
                    const mine = m.sender === "user";
                    const system = m.sender === "system";
                    return (
                      <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[82%] rounded-3xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                            mine
                              ? "rounded-br-lg bg-mint-500 text-white"
                              : system
                                ? "rounded-bl-lg border border-cream-200 bg-cream-100 text-ink-600"
                                : "rounded-bl-lg border border-white bg-white text-ink-800"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{m.text}</p>
                          <p
                            className={`mt-1 text-[10px] ${mine ? "text-mint-100" : "text-ink-400"}`}
                          >
                            {timeLabel(m.createdAt)}
                            {!mine && !system ? ` · ${settings?.agentName ?? "Destek"}` : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Hızlı yanıtlar */}
                {messages.filter((m) => m.sender === "user").length === 0 && (
                  <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
                    {["Randevu almak istiyorum", "Aşı takvimi nasıl?", "Ürün fiyatı öğrenebilir miyim?"].map(
                      (q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => send(q)}
                          className="shrink-0 rounded-full border-2 border-mint-200 bg-white px-3 py-1.5 text-xs font-bold text-mint-700 transition hover:bg-mint-50"
                        >
                          {q}
                        </button>
                      )
                    )}
                  </div>
                )}

                {DEMO && (
                  <div className="mx-4 mb-2 flex items-center gap-2 rounded-2xl bg-cream-100 px-3 py-2">
                    <p className="flex-1 text-[11px] leading-snug text-ink-600">
                      Önizlemede mesajlar kliniğe iletilmez. Gerçek iletişim için:
                    </p>
                    <a
                      href={whatsappLink("Merhaba, bilgi almak istiyorum.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp shrink-0 !px-3 !py-1.5 !text-[11px]"
                    >
                      <WhatsAppIcon className="h-3.5 w-3.5" />
                      WhatsApp
                    </a>
                  </div>
                )}

                {/* Giriş */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(draft);
                  }}
                  className="flex items-end gap-2 border-t border-cream-200 bg-white p-3"
                >
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send(draft);
                      }
                    }}
                    rows={1}
                    maxLength={2000}
                    placeholder="Mesajınızı yazın…"
                    className="max-h-28 flex-1 resize-none rounded-2xl border-2 border-cream-200 px-4 py-2.5 text-sm outline-none transition focus:border-mint-300"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || sending}
                    aria-label="Gönder"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint-500 text-white transition hover:bg-mint-600 disabled:opacity-40"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2v6.4Z" />
                    </svg>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
