// Pure helpers shared by the server service, the card component, and tests.

export type OfficialXPostLink = {
    /** The t.co URL exactly as it appears in the post text. */
    url: string;
    expandedUrl: string;
    displayUrl: string;
    /** Set when the link only points at the post's own attached media. */
    isMedia: boolean;
};

export type OfficialXPostImage = {
    url: string;
    width: number;
    height: number;
    alt: string | null;
};

export type OfficialXPostTranslations = { ko: string; en: string };

export type OfficialXPostContent = {
    id: string;
    url: string;
    text: string;
    createdAt: string;
    author: { name: string; username: string; avatarUrl: string | null };
    image: OfficialXPostImage | null;
    links: OfficialXPostLink[];
    /** Machine translations of `text`; null when unavailable. Links keep their t.co form. */
    translations: OfficialXPostTranslations | null;
};

/**
 * Swaps every t.co URL for an opaque placeholder so a translator cannot
 * rewrite it, and returns the inverse mapping to put the URLs back.
 */
export function maskOfficialXPostLinks(
    text: string,
    links: OfficialXPostLink[]
) {
    let masked = text;
    const placeholders: [string, string][] = [];
    links.forEach((link, index) => {
        if (!masked.includes(link.url)) return;
        const placeholder = `[[LINK_${index + 1}]]`;
        placeholders.push([placeholder, link.url]);
        masked = masked.split(link.url).join(placeholder);
    });
    const restore = (value: string) =>
        placeholders.reduce(
            (result, [placeholder, url]) => result.split(placeholder).join(url),
            value
        );
    return { masked, restore };
}

export type OfficialXPostSegment =
    | { type: "text"; value: string }
    | { type: "link"; href: string; label: string };

/**
 * Splits the post text into plain runs and links. Every t.co URL is replaced
 * by its readable display form pointing at the expanded destination, and the
 * trailing link that X appends for the attached photo is dropped because the
 * card shows the photo itself.
 */
export function buildOfficialXPostSegments(
    text: string,
    links: OfficialXPostLink[]
): OfficialXPostSegment[] {
    const segments: OfficialXPostSegment[] = [];
    const pushText = (value: string) => {
        if (value) segments.push({ type: "text", value });
    };
    let rest = text;
    const ordered = [...links].sort(
        (a, b) => text.indexOf(a.url) - text.indexOf(b.url)
    );
    for (const link of ordered) {
        const at = rest.indexOf(link.url);
        if (at < 0) continue;
        pushText(rest.slice(0, at));
        if (!link.isMedia) {
            segments.push({
                type: "link",
                href: link.expandedUrl,
                label: link.displayUrl,
            });
        }
        rest = rest.slice(at + link.url.length);
    }
    pushText(rest);
    // Trim the whitespace X leaves around the removed media link.
    const last = segments.at(-1);
    if (last?.type === "text") {
        last.value = last.value.replace(/\s+$/, "");
        if (!last.value) segments.pop();
    }
    return segments;
}
