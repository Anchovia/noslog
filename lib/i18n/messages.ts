import { enMessages } from "./messageCatalogs/en";
import { jaMessages } from "./messageCatalogs/ja";
import { koMessages } from "./messageCatalogs/ko";
import type { ClientMessages, MessageKey, Messages } from "./messageTypes";
import type { Locale } from "./routing";

const messagesByLocale: Record<Locale, Messages> = {
    ko: koMessages,
    ja: jaMessages,
    en: enMessages,
};

export function getMessages(locale: Locale): Messages {
    return messagesByLocale[locale];
}

export function createTranslator(messages: ClientMessages) {
    return (
        key: MessageKey,
        parameters?: Record<string, string | number>
    ): string => {
        const message = messages[key];
        if (!message) {
            if (process.env.NODE_ENV !== "production") {
                console.warn(`Missing client translation: ${key}`);
            }
            return key;
        }

        if (!parameters) return message;

        return Object.entries(parameters).reduce(
            (result, [name, value]) =>
                result.replaceAll(`{${name}}`, String(value)),
            message
        );
    };
}

export type { ClientMessages, MessageKey, Messages };
