export const SUPPORTED_LOCALES = ["ko", "ja", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ko";
export const LOCALE_COOKIE_NAME = "noslog-locale";
export const LOCALE_REQUEST_HEADER = "x-noslog-locale";

const NON_LOCALIZED_PATH_PREFIXES = [
    "/admin",
    "/api",
    "/discord",
    "/_next",
    "/fonts",
    "/icons",
] as const;

const NON_LOCALIZED_PATHS = new Set([
    "/apple-icon",
    "/favicon.ico",
    "/icon",
    "/manifest.webmanifest",
    "/opengraph-image",
    "/robots.txt",
    "/sitemap.xml",
    "/twitter-image",
]);

export function isLocale(value: string | null | undefined): value is Locale {
    return SUPPORTED_LOCALES.includes(value as Locale);
}

export function localeFromCountry(country: string | null | undefined): Locale {
    if (country === "ja-JP") return "ja";
    if (country === "global") return "en";
    return "ko";
}

export function localeFromAcceptLanguage(
    acceptLanguage: string | null | undefined
): Locale {
    const preferences = (acceptLanguage ?? "")
        .split(",")
        .map((entry) => {
            const [languageTag, ...parameters] = entry.trim().split(";");
            const qualityParameter = parameters.find((parameter) =>
                parameter.trim().startsWith("q=")
            );
            const quality = qualityParameter
                ? Number(qualityParameter.trim().slice(2))
                : 1;

            return {
                language: languageTag.toLowerCase().split("-")[0],
                quality: Number.isFinite(quality) ? quality : 0,
            };
        })
        .filter(({ language, quality }) => language && quality > 0)
        .sort((left, right) => right.quality - left.quality);

    for (const preference of preferences) {
        if (preference.language === "ko") return "ko";
        if (preference.language === "ja") return "ja";
        if (preference.language === "en") return "en";
    }

    return "en";
}

export function getPathLocale(pathname: string): Locale | null {
    const firstSegment = pathname.split("/")[1];
    return isLocale(firstSegment) ? firstSegment : null;
}

export function stripLocaleFromPath(pathname: string) {
    const locale = getPathLocale(pathname);
    if (!locale) return pathname;

    const strippedPath = pathname.slice(locale.length + 1);
    return strippedPath || "/";
}

export function localizePath(pathname: string, locale: Locale) {
    const barePath = stripLocaleFromPath(pathname);
    return barePath === "/" ? `/${locale}` : `/${locale}${barePath}`;
}

export function getLocalizedHref(href: string, locale: Locale) {
    if (
        href.startsWith("#") ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
    ) {
        return href;
    }

    const [pathWithQuery, hash = ""] = href.split("#", 2);
    const [pathname, query = ""] = pathWithQuery.split("?", 2);
    const barePath = stripLocaleFromPath(pathname || "/");

    if (isNonLocalizedPath(barePath)) return href;

    const localizedPath = localizePath(pathname || "/", locale);
    const querySuffix = query ? `?${query}` : "";
    const hashSuffix = hash ? `#${hash}` : "";

    return `${localizedPath}${querySuffix}${hashSuffix}`;
}

export function isNonLocalizedPath(pathname: string) {
    if (NON_LOCALIZED_PATHS.has(pathname)) return true;

    return NON_LOCALIZED_PATH_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
}
