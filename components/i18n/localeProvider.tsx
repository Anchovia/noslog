"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    type ReactNode,
} from "react";

import {
    createTranslator,
    type ClientMessages,
    type MessageKey,
} from "@/lib/i18n/messages";
import { getLocalizedHref, type Locale } from "@/lib/i18n/routing";

interface LocaleContextValue {
    locale: Locale;
    messages: ClientMessages;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
    children,
    locale,
    messages,
}: {
    children: ReactNode;
    locale: Locale;
    messages: ClientMessages;
}) {
    return (
        <LocaleContext.Provider value={{ locale, messages }}>
            {children}
        </LocaleContext.Provider>
    );
}

function useLocaleContext() {
    const context = useContext(LocaleContext);

    if (!context) {
        throw new Error("LocaleProvider 안에서 사용해야 합니다.");
    }

    return context;
}

export function useLocale() {
    return useLocaleContext().locale;
}

export function useTranslations() {
    const { messages } = useLocaleContext();
    return useMemo(() => createTranslator(messages), [messages]);
}

export function useLocalizedHref() {
    const locale = useLocale();

    return useCallback(
        (href: string) => getLocalizedHref(href, locale),
        [locale]
    );
}

export type { MessageKey };
