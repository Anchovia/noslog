import type { koMessages } from "./message-catalogs/ko";

export type MessageKey = keyof typeof koMessages;
export type Messages = Record<MessageKey, string>;
export type ClientMessages = Partial<Messages>;
