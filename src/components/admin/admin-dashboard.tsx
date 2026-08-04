"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage, ChatSettings, Conversation } from "@/lib/chat/types";
import { PawIcon } from "@/components/icons";
import { site } from "@/data/site";

const POLL_LIST = 4000;
const POLL_THREAD = 2500;

function relativeTime(ts: number) {
  const diff = Date.now() - ts;
  const min = Math.round(diff / 60000);
  if (min < 1) return "az önce";
  if (min < 60) return `${min} dk önce`;
  const hour = Math.round(min / 60);
  if (hour < 24) return `${hour} sa önce`;
  return new Date(ts).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
}

function clock(ts: number) {
  return new Date(ts).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

export function AdminDashboard({ storageMode }: { storageMode: string }) {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [settings, setSettings] = useState<ChatSettings | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"sohbetler" | "ayarlar">("sohbetler");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef<string | null>(null);
  activeIdRef.current = activeId;

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadForAgent, 0),
    [conversations]
  );

  /* --- sohbet listesi --- */
  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/conversations", { cache: "no-store" });
      if (res.status === 401) {
        router.refresh();
        return;
      }
      if (!res.ok) return;
      const data = (await res.json()) as { conversations: Conversation[]; settings: ChatSettings };
      setConversations(data.conversations);
      setSettings((prev) => prev ?? data.settings);
    } catch {
      /* yoksay */
    }
  }, [router]);

  useEffect(() => {
    loadConversations();
    const timer = setInterval(loadConversations, POLL_LIST);
    return () => clearInterval(timer);
  }, [loadConversations]);

  /* --- açık sohbet --- */
  const loadThread = useCallback(async () => {
    const id = activeIdRef.current;
    if (!id) return;
    try {
      const res = await fetch(`/api/admin/messages?conversationId=${id}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { messages: ChatMessage[] };
      setMessages(data.messages);
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, unreadForAgent: 0 } : c))
      );
    } catch {
      /* yoksay */
    }
  }, []);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    loadThread();
    const timer = setInterval(loadThread, POLL_THREAD);
    return () => clearInterval(timer);
  }, [activeId, loadThread]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  /* --- eylemler --- */
  const reply = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || !activeId) return;
    setDraft("");
    const optimistic: ChatMessage = {
      id: `local-${Date.now()}`,
      conversationId: activeId,
      sender: "agent",
      text,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, optimistic]);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeId, text }),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { message: ChatMessage };
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? data.message : m)));
      loadConversations();
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setDraft(text);
      setNotice("Mesaj gönderilemedi.");
    }
  };

  const saveSettings = async (patch: Partial<ChatSettings>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { settings: ChatSettings };
      setSettings(data.settings);
      setNotice("Ayarlar kaydedildi ✓");
      setTimeout(() => setNotice(""), 2500);
    } catch {
      setNotice("Ayarlar kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (status: "open" | "closed") => {
    if (!activeId) return;
    await fetch("/api/admin/conversation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: activeId, status }),
    });
    loadConversations();
  };

  const removeConversation = async () => {
    if (!activeId) return;
    if (!window.confirm("Bu sohbet kalıcı olarak silinsin mi?")) return;
    await fetch(`/api/admin/conversation?conversationId=${activeId}`, { method: "DELETE" });
    setActiveId(null);
    loadConversations();
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  const visible = conversations.filter((c) => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return true;
    return (
      c.name.toLocaleLowerCase("tr").includes(q) ||
      c.topic.toLocaleLowerCase("tr").includes(q) ||
      c.lastMessage.toLocaleLowerCase("tr").includes(q)
    );
  });

  const active = conversations.find((c) => c.id === activeId) ?? null;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Üst bar */}
      <header className="sticky top-0 z-30 border-b border-cream-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-mint-500 text-white">
              <PawIcon className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-lg font-extrabold">{site.shortName} Panel</p>
              <p className="text-[11px] text-ink-400">
                {totalUnread > 0 ? `${totalUnread} okunmamış mesaj` : "Tüm mesajlar okundu"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {settings && (
              <button
                type="button"
                onClick={() => saveSettings({ online: !settings.online })}
                disabled={saving}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition ${
                  settings.online ? "bg-mint-100 text-mint-700" : "bg-cream-200 text-ink-600"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${settings.online ? "bg-mint-500" : "bg-ink-400"}`}
                  aria-hidden
                />
                {settings.online ? "Çevrimiçi" : "Çevrimdışı"}
              </button>
            )}
            <Link href="/" className="hidden rounded-full px-3 py-2 text-xs font-bold text-ink-600 hover:text-mint-600 sm:block">
              Siteye dön
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border-2 border-cream-200 px-4 py-2 text-xs font-bold text-ink-600 hover:border-coral-200 hover:text-coral-600"
            >
              Çıkış
            </button>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-7xl gap-1 px-4 sm:px-6">
          {(["sohbetler", "ayarlar"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-bold capitalize transition ${
                tab === t ? "border-mint-500 text-mint-700" : "border-transparent text-ink-400 hover:text-ink-600"
              }`}
            >
              {t === "sohbetler" ? "Sohbetler" : "Ayarlar"}
              {t === "sohbetler" && totalUnread > 0 && (
                <span className="ml-2 rounded-full bg-coral-500 px-2 py-0.5 text-[10px] text-white">
                  {totalUnread}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {notice && (
        <div className="mx-auto mt-4 w-full max-w-7xl px-4 sm:px-6">
          <p className="rounded-2xl bg-mint-100 px-4 py-2.5 text-sm font-bold text-mint-700">{notice}</p>
        </div>
      )}

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {tab === "sohbetler" ? (
          <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
            {/* Sohbet listesi */}
            <aside className="card flex max-h-[76vh] flex-col overflow-hidden p-0">
              <div className="border-b border-cream-200 p-4">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Sohbetlerde ara…"
                  className="field !py-2.5 !text-sm"
                />
              </div>
              <div className="chat-scroll flex-1 divide-y divide-cream-200 overflow-y-auto">
                {visible.length === 0 && (
                  <p className="p-6 text-center text-sm text-ink-400">Henüz sohbet yok.</p>
                )}
                {visible.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveId(c.id)}
                    className={`flex w-full flex-col gap-1 p-4 text-left transition ${
                      activeId === c.id ? "bg-mint-50" : "hover:bg-cream-100"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 truncate text-sm font-extrabold text-ink-900">
                        {c.name}
                        {c.status === "closed" && (
                          <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[10px] font-bold text-ink-400">
                            kapalı
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 text-[11px] text-ink-400">{relativeTime(c.updatedAt)}</span>
                    </div>
                    <span className="truncate text-xs text-ink-600">{c.lastMessage || "—"}</span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-cream-100 px-2 py-0.5 text-[10px] font-bold text-ink-400">
                        {c.topic}
                      </span>
                      {c.unreadForAgent > 0 && (
                        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-coral-500 px-1.5 text-[10px] font-extrabold text-white">
                          {c.unreadForAgent}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {/* Sohbet penceresi */}
            <section className="card flex max-h-[76vh] min-h-[60vh] flex-col overflow-hidden p-0">
              {!active ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
                  <PawIcon className="h-12 w-12 text-mint-200" />
                  <p className="font-display text-xl font-bold">Bir sohbet seçin</p>
                  <p className="max-w-sm text-sm text-ink-600">
                    Soldaki listeden bir ziyaretçi seçtiğinizde mesajlaşma burada açılır. Yeni mesajlar
                    otomatik olarak düşer.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3 border-b border-cream-200 p-4">
                    <div className="min-w-0">
                      <p className="truncate font-display text-lg font-bold">{active.name}</p>
                      <p className="truncate text-xs text-ink-400">
                        {active.topic}
                        {active.contact ? ` · ${active.contact}` : ""} · {relativeTime(active.createdAt)} başladı
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {active.contact && (
                        <a
                          href={`tel:${active.contact.replace(/\s/g, "")}`}
                          className="rounded-full bg-mint-100 px-3 py-1.5 text-xs font-bold text-mint-700"
                        >
                          Ara
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => changeStatus(active.status === "open" ? "closed" : "open")}
                        className="rounded-full bg-cream-200 px-3 py-1.5 text-xs font-bold text-ink-600"
                      >
                        {active.status === "open" ? "Kapat" : "Aç"}
                      </button>
                      <button
                        type="button"
                        onClick={removeConversation}
                        className="rounded-full bg-coral-100 px-3 py-1.5 text-xs font-bold text-coral-700"
                      >
                        Sil
                      </button>
                    </div>
                  </div>

                  <div ref={listRef} className="chat-scroll flex-1 space-y-3 overflow-y-auto bg-cream-100/50 p-4">
                    {messages.map((m) => {
                      const mine = m.sender === "agent";
                      const system = m.sender === "system";
                      return (
                        <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[70%] rounded-3xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                              mine
                                ? "rounded-br-lg bg-mint-500 text-white"
                                : system
                                  ? "rounded-bl-lg border border-cream-200 bg-cream-100 text-ink-600"
                                  : "rounded-bl-lg bg-white text-ink-800"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{m.text}</p>
                            <p className={`mt-1 text-[10px] ${mine ? "text-mint-100" : "text-ink-400"}`}>
                              {system ? "otomatik · " : mine ? "siz · " : `${active.name} · `}
                              {clock(m.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-cream-200 bg-white p-3">
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {[
                        "Merhaba, size nasıl yardımcı olabilirim? 🐾",
                        "Bugün 15:00 ve 17:30 için yerimiz var.",
                        "Bu ürün stoğumuzda mevcut, klinikten teslim alabilirsiniz.",
                        "Acil durumlar için lütfen bizi hemen arayın.",
                      ].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setDraft(q)}
                          className="rounded-full bg-cream-100 px-3 py-1.5 text-[11px] font-bold text-ink-600 hover:bg-cream-200"
                        >
                          {q.length > 34 ? `${q.slice(0, 34)}…` : q}
                        </button>
                      ))}
                    </div>
                    <form onSubmit={reply} className="flex items-end gap-2">
                      <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            reply();
                          }
                        }}
                        rows={2}
                        maxLength={2000}
                        placeholder="Yanıtınızı yazın… (Enter ile gönder)"
                        className="max-h-32 flex-1 resize-none rounded-2xl border-2 border-cream-200 px-4 py-2.5 text-sm outline-none focus:border-mint-300"
                      />
                      <button type="submit" disabled={!draft.trim()} className="btn-primary !px-5 disabled:opacity-40">
                        Gönder
                      </button>
                    </form>
                  </div>
                </>
              )}
            </section>
          </div>
        ) : (
          /* Ayarlar */
          <div className="grid gap-5 lg:grid-cols-2">
            {settings && (
              <>
                <div className="card p-6">
                  <h2 className="font-display text-xl font-bold">Canlı destek durumu</h2>
                  <p className="mt-1 text-sm text-ink-600">
                    Buradaki anahtarlar sitedeki sohbet balonunu doğrudan etkiler.
                  </p>

                  <div className="mt-6 space-y-4">
                    <ToggleRow
                      label="Çevrimiçi görün"
                      description="Kapattığınızda ziyaretçiler 'çevrimdışı' uyarısı görür, mesaj bırakabilir."
                      checked={settings.online}
                      onChange={(v) => saveSettings({ online: v })}
                    />
                    <ToggleRow
                      label="Sohbet balonunu göster"
                      description="Kapatırsanız canlı destek widget'ı sitede hiç görünmez."
                      checked={settings.widgetEnabled}
                      onChange={(v) => saveSettings({ widgetEnabled: v })}
                    />
                  </div>
                </div>

                <SettingsForm settings={settings} onSave={saveSettings} saving={saving} />

                <div className="card p-6 lg:col-span-2">
                  <h2 className="font-display text-xl font-bold">Sistem bilgisi</h2>
                  <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-cream-100 p-4">
                      <dt className="text-xs font-bold text-ink-400">Depolama modu</dt>
                      <dd className="mt-1 font-display text-lg font-bold">{storageMode}</dd>
                    </div>
                    <div className="rounded-2xl bg-cream-100 p-4">
                      <dt className="text-xs font-bold text-ink-400">Toplam sohbet</dt>
                      <dd className="mt-1 font-display text-lg font-bold">{conversations.length}</dd>
                    </div>
                    <div className="rounded-2xl bg-cream-100 p-4">
                      <dt className="text-xs font-bold text-ink-400">Okunmamış</dt>
                      <dd className="mt-1 font-display text-lg font-bold">{totalUnread}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-xs leading-relaxed text-ink-400">
                    Vercel gibi sunucusuz ortamlarda sohbetlerin kalıcı olması için{" "}
                    <code className="rounded bg-cream-200 px-1.5 py-0.5">UPSTASH_REDIS_REST_URL</code> ve{" "}
                    <code className="rounded bg-cream-200 px-1.5 py-0.5">UPSTASH_REDIS_REST_TOKEN</code> ortam
                    değişkenlerini tanımlayın. Tanımlıysa mod otomatik olarak “upstash” olur.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-cream-100 p-4">
      <div>
        <p className="text-sm font-extrabold text-ink-900">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-ink-600">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-mint-500" : "bg-ink-400/40"}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function SettingsForm({
  settings,
  onSave,
  saving,
}: {
  settings: ChatSettings;
  onSave: (patch: Partial<ChatSettings>) => void;
  saving: boolean;
}) {
  const [agentName, setAgentName] = useState(settings.agentName);
  const [welcome, setWelcome] = useState(settings.welcomeMessage);
  const [away, setAway] = useState(settings.awayMessage);

  return (
    <form
      className="card p-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ agentName, welcomeMessage: welcome, awayMessage: away });
      }}
    >
      <h2 className="font-display text-xl font-bold">Mesaj metinleri</h2>
      <p className="mt-1 text-sm text-ink-600">Ziyaretçinin sohbeti açtığında göreceği metinler.</p>

      <label className="mt-6 mb-1.5 block text-xs font-bold text-ink-600" htmlFor="s-agent">
        Panelde görünen isim
      </label>
      <input
        id="s-agent"
        className="field"
        value={agentName}
        onChange={(e) => setAgentName(e.target.value)}
        maxLength={60}
      />

      <label className="mt-4 mb-1.5 block text-xs font-bold text-ink-600" htmlFor="s-welcome">
        Karşılama mesajı (çevrimiçiyken)
      </label>
      <textarea
        id="s-welcome"
        className="field min-h-[90px] resize-y"
        value={welcome}
        onChange={(e) => setWelcome(e.target.value)}
        maxLength={400}
      />

      <label className="mt-4 mb-1.5 block text-xs font-bold text-ink-600" htmlFor="s-away">
        Çevrimdışı mesajı
      </label>
      <textarea
        id="s-away"
        className="field min-h-[90px] resize-y"
        value={away}
        onChange={(e) => setAway(e.target.value)}
        maxLength={400}
      />

      <button type="submit" className="btn-primary mt-5 w-full" disabled={saving}>
        {saving ? "Kaydediliyor…" : "Kaydet"}
      </button>
    </form>
  );
}
