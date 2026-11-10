import { enMessages } from "./message-catalogs/en";
import { jaMessages } from "./message-catalogs/ja";
import { koMessages } from "./message-catalogs/ko";
import type { MessageKey, Messages } from "./message-types";
import { type Locale, resolveLocale } from "./routing";
import { createTranslator } from "./translator";

const messagesByLocale: Record<Locale, Messages> = {
    ko: koMessages,
    ja: jaMessages,
    en: enMessages,
};

export function getMessages(locale: Locale): Messages {
    return messagesByLocale[locale];
}

export function translatorFor(requestedLocale: unknown) {
    return createTranslator(getMessages(resolveLocale(requestedLocale)));
}

export { createTranslator };

export type { MessageKey, Messages };
