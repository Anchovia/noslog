import { headers } from "next/headers";

import { createTranslator, getMessages, type Messages } from "./messages";
import {
    DEFAULT_LOCALE,
    isLocale,
    LOCALE_REQUEST_HEADER,
    type Locale,
} from "./routing";

export async function getRequestLocale(): Promise<Locale> {
    const requestLocale = (await headers()).get(LOCALE_REQUEST_HEADER);
    return isLocale(requestLocale) ? requestLocale : DEFAULT_LOCALE;
}

export async function getServerI18n(): Promise<{
    locale: Locale;
    messages: Messages;
    t: ReturnType<typeof createTranslator>;
}> {
    const locale = await getRequestLocale();
    const messages = getMessages(locale);

    return {
        locale,
        messages,
        t: createTranslator(messages),
    };
}
