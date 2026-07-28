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
    type MessageKey,
    type Messages,
} from "@/lib/i18n/messages";
import { getLocalizedHref, type Locale } from "@/lib/i18n/routing";

interface LocaleContextValue {
    locale: Locale;
    messages: Messages;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
    children,
    locale,
    messages,
}: {
    children: ReactNode;
    locale: Locale;
    messages: Messages;
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
