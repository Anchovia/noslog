import type { ClientMessages, MessageKey } from "./message-types";

// 카탈로그를 import 하지 않는 번역 함수 — 클라 번들에 세 언어 카탈로그가 실리지 않게 따로 둠
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
