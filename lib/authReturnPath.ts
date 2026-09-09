import { getLocalizedHref, stripLocaleFromPath } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/routing";

export function getSafeAuthReturnPath(value: string | undefined) {
    if (
        !value?.startsWith("/") ||
        value.startsWith("//") ||
        value.includes("\\") ||
        /[\u0000-\u001f\u007f]/.test(value)
    )
        return null;
    const base = "https://noslog.invalid";
    try {
        const target = new URL(value, base);
        if (target.origin !== base) return null;
        const pathname = decodeURIComponent(target.pathname);
        if (pathname.includes("\\") || /[\u0000-\u001f\u007f]/.test(pathname))
            return null;
        const path = stripLocaleFromPath(pathname);
        if (
            path !== "/" &&
            !/^\/(music|rankings|tiers|bingo|exams|arcades|bookmarklet|profile|settings|feedback|privacy|announcements)(?:\/|$)/.test(
                path
            )
        )
            return null;
        return `${target.pathname}${target.search}${target.hash}`;
    } catch {
        return null;
    }
}

export function getAuthReturnPath(value: string | undefined, locale: Locale) {
    return getLocalizedHref(getSafeAuthReturnPath(value) ?? "/", locale);
}
