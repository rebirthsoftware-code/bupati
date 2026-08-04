import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import {
  ChatDB,
  ChatMessage,
  ChatSettings,
  Conversation,
  defaultSettings,
  emptyDB,
  Sender,
} from "./types";

/* -------------------------------------------------------------------------- */
/*  Depolama katmanı                                                          */
/*                                                                            */
/*  Üç mod desteklenir:                                                       */
/*   1. memory  → hiçbir ayar gerekmez (yerel geliştirme, sunucu yeniden      */
/*                başlayınca sıfırlanır)                                      */
/*   2. file    → .data/chat.json (yerelde kalıcı)                            */
/*   3. upstash → UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN tanımlıysa*/
/*                otomatik devreye girer. Vercel'de kalıcı depolama budur.    */
/* -------------------------------------------------------------------------- */

interface Adapter {
  read(): Promise<ChatDB>;
  write(db: ChatDB): Promise<void>;
}

const g = globalThis as unknown as { __paticanChatDB?: ChatDB };

class MemoryAdapter implements Adapter {
  async read() {
    if (!g.__paticanChatDB) g.__paticanChatDB = emptyDB();
    return g.__paticanChatDB;
  }
  async write(db: ChatDB) {
    g.__paticanChatDB = db;
  }
}

class FileAdapter implements Adapter {
  private file: string;
  constructor(file: string) {
    this.file = file;
  }
  async read(): Promise<ChatDB> {
    try {
      const raw = await fs.readFile(this.file, "utf8");
      const parsed = JSON.parse(raw) as ChatDB;
      return {
        conversations: parsed.conversations ?? {},
        messages: parsed.messages ?? {},
        settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
      };
    } catch {
      return emptyDB();
    }
  }
  async write(db: ChatDB) {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    await fs.writeFile(this.file, JSON.stringify(db), "utf8");
  }
}

class UpstashAdapter implements Adapter {
  private url: string;
  private token: string;
  private key = "patican:chat:db";

  constructor(url: string, token: string) {
    this.url = url.replace(/\/$/, "");
    this.token = token;
  }

  private async command(cmd: unknown[]): Promise<unknown> {
    const res = await fetch(this.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cmd),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Upstash hatası: ${res.status}`);
    const json = (await res.json()) as { result?: unknown };
    return json.result;
  }

  async read(): Promise<ChatDB> {
    try {
      const result = await this.command(["GET", this.key]);
      if (typeof result !== "string" || !result) return emptyDB();
      const parsed = JSON.parse(result) as ChatDB;
      return {
        conversations: parsed.conversations ?? {},
        messages: parsed.messages ?? {},
        settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
      };
    } catch {
      return emptyDB();
    }
  }

  async write(db: ChatDB) {
    await this.command(["SET", this.key, JSON.stringify(db)]);
  }
}

function createAdapter(): Adapter {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return new UpstashAdapter(url, token);

  const driver = process.env.CHAT_STORAGE ?? (process.env.VERCEL ? "memory" : "file");
  if (driver === "file") {
    const file = process.env.CHAT_DATA_FILE ?? path.join(process.cwd(), ".data", "chat.json");
    return new FileAdapter(file);
  }
  return new MemoryAdapter();
}

const adapter = createAdapter();

export const storageMode = process.env.UPSTASH_REDIS_REST_URL
  ? "upstash"
  : process.env.CHAT_STORAGE ?? (process.env.VERCEL ? "memory" : "file");

/* -------------------------------------------------------------------------- */
/*  Yardımcılar                                                               */
/* -------------------------------------------------------------------------- */

const MAX_TEXT = 2000;
const MAX_MESSAGES_PER_CONVERSATION = 500;
const MAX_CONVERSATIONS = 300;

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function prune(db: ChatDB) {
  const ids = Object.values(db.conversations)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(MAX_CONVERSATIONS)
    .map((c) => c.id);
  for (const id of ids) {
    delete db.conversations[id];
    delete db.messages[id];
  }
}

/* -------------------------------------------------------------------------- */
/*  Genel API                                                                 */
/* -------------------------------------------------------------------------- */

export async function getSettings(): Promise<ChatSettings> {
  const db = await adapter.read();
  return db.settings;
}

export async function updateSettings(patch: Partial<ChatSettings>): Promise<ChatSettings> {
  const db = await adapter.read();
  db.settings = {
    ...db.settings,
    ...(typeof patch.online === "boolean" ? { online: patch.online } : {}),
    ...(typeof patch.widgetEnabled === "boolean" ? { widgetEnabled: patch.widgetEnabled } : {}),
    ...(patch.agentName !== undefined ? { agentName: clean(patch.agentName, 60) || "PatiCan Destek" } : {}),
    ...(patch.welcomeMessage !== undefined ? { welcomeMessage: clean(patch.welcomeMessage, 400) } : {}),
    ...(patch.awayMessage !== undefined ? { awayMessage: clean(patch.awayMessage, 400) } : {}),
  };
  await adapter.write(db);
  return db.settings;
}

export async function startConversation(input: {
  name?: string;
  contact?: string;
  topic?: string;
}): Promise<{ conversation: Conversation; messages: ChatMessage[]; settings: ChatSettings }> {
  const db = await adapter.read();
  const now = Date.now();
  const id = randomUUID();

  const conversation: Conversation = {
    id,
    name: clean(input.name, 60) || "Ziyaretçi",
    contact: clean(input.contact, 60),
    topic: clean(input.topic, 80) || "Genel danışma",
    createdAt: now,
    updatedAt: now,
    status: "open",
    unreadForUser: 0,
    unreadForAgent: 0,
    lastMessage: "",
  };

  const greeting: ChatMessage = {
    id: randomUUID(),
    conversationId: id,
    sender: "system",
    text: db.settings.online ? db.settings.welcomeMessage : db.settings.awayMessage,
    createdAt: now,
  };

  db.conversations[id] = conversation;
  db.messages[id] = [greeting];
  conversation.lastMessage = greeting.text;
  prune(db);
  await adapter.write(db);

  return { conversation, messages: [greeting], settings: db.settings };
}

export async function addMessage(
  conversationId: string,
  sender: Sender,
  text: string
): Promise<ChatMessage | null> {
  const db = await adapter.read();
  const conversation = db.conversations[conversationId];
  if (!conversation) return null;

  const body = clean(text, MAX_TEXT);
  if (!body) return null;

  const message: ChatMessage = {
    id: randomUUID(),
    conversationId,
    sender,
    text: body,
    createdAt: Date.now(),
  };

  const list = db.messages[conversationId] ?? [];
  list.push(message);
  db.messages[conversationId] = list.slice(-MAX_MESSAGES_PER_CONVERSATION);

  conversation.updatedAt = message.createdAt;
  conversation.lastMessage = body;
  conversation.status = "open";
  if (sender === "user") conversation.unreadForAgent += 1;
  if (sender === "agent") conversation.unreadForUser += 1;

  await adapter.write(db);
  return message;
}

export async function getConversationState(
  conversationId: string,
  since = 0
): Promise<{
  conversation: Conversation;
  messages: ChatMessage[];
  settings: ChatSettings;
} | null> {
  const db = await adapter.read();
  const conversation = db.conversations[conversationId];
  if (!conversation) return null;
  const all = db.messages[conversationId] ?? [];
  return {
    conversation,
    messages: since ? all.filter((m) => m.createdAt > since) : all,
    settings: db.settings,
  };
}

export async function listConversations(): Promise<Conversation[]> {
  const db = await adapter.read();
  return Object.values(db.conversations).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function markRead(conversationId: string, by: "user" | "agent") {
  const db = await adapter.read();
  const conversation = db.conversations[conversationId];
  if (!conversation) return;
  if (by === "user") conversation.unreadForUser = 0;
  else conversation.unreadForAgent = 0;
  await adapter.write(db);
}

export async function setConversationStatus(conversationId: string, status: "open" | "closed") {
  const db = await adapter.read();
  const conversation = db.conversations[conversationId];
  if (!conversation) return null;
  conversation.status = status;
  conversation.updatedAt = Date.now();
  await adapter.write(db);
  return conversation;
}

export async function deleteConversation(conversationId: string) {
  const db = await adapter.read();
  delete db.conversations[conversationId];
  delete db.messages[conversationId];
  await adapter.write(db);
}
