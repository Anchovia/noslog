import { enMessages } from "./message-catalogs/en";
import { jaMessages } from "./message-catalogs/ja";
import { koMessages } from "./message-catalogs/ko";
import type { ClientMessages, MessageKey, Messages } from "./message-types";
import type { Locale } from "./routing";

const messagesByLocale: Record<Locale, Messages> = {
    ko: koMessages,
    ja: jaMessages,
    en: enMessages,
};

export function getMessages(locale: Locale): Messages {
    return messagesByLocale[locale];
}

export { createTranslator } from "./translator";

export type { ClientMessages, MessageKey, Messages };
