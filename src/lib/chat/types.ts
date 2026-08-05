export type Sender = "user" | "agent" | "system";

export type ChatMessage = {
  id: string;
  conversationId: string;
  sender: Sender;
  text: string;
  createdAt: number;
};

export type Conversation = {
  id: string;
  name: string;
  contact: string;
  topic: string;
  createdAt: number;
  updatedAt: number;
  status: "open" | "closed";
  /** Ziyaretçinin okumadığı (hekimden gelen) mesaj sayısı */
  unreadForUser: number;
  /** Paneldeki hekimin okumadığı (ziyaretçiden gelen) mesaj sayısı */
  unreadForAgent: number;
  lastMessage: string;
};

export type ChatSettings = {
  /** Panelden açılıp kapatılan canlı destek durumu */
  online: boolean;
  agentName: string;
  welcomeMessage: string;
  awayMessage: string;
  /** Widget'ın sitede görünüp görünmeyeceği */
  widgetEnabled: boolean;
};

export type ChatDB = {
  conversations: Record<string, Conversation>;
  messages: Record<string, ChatMessage[]>;
  settings: ChatSettings;
};

export const defaultSettings: ChatSettings = {
  online: true,
  agentName: "BuPati Destek",
  welcomeMessage:
    "Merhaba! 🐾 Ben BuPati destek ekibinden. Dostunuzla ilgili sorunuzu yazın, hemen yanıtlayalım.",
  awayMessage:
    "Şu an çevrimdışıyız 🌙 Mesajınızı bırakın, klinik açılır açılmaz size dönüş yapalım. Acil durumlar için lütfen telefonla arayın.",
  widgetEnabled: true,
};

export function emptyDB(): ChatDB {
  return { conversations: {}, messages: {}, settings: { ...defaultSettings } };
}
