import { describe, expect, it } from "vitest";

import { createPageMetadata } from "@/lib/metadata/site";

describe("createPageMetadata", () => {
    it("always carries the site share image and language alternates", () => {
        const meta = createPageMetadata({
            title: "서열표",
            description: "설명",
            path: "/ko/tiers",
        });
        expect(meta.alternates?.languages).toEqual({
            ko: "/ko/tiers",
            ja: "/ja/tiers",
            en: "/en/tiers",
            "x-default": "/tiers",
        });
        expect(meta.openGraph).toMatchObject({
            locale: "ko_KR",
            alternateLocale: ["ja_JP", "en_US"],
            url: "/ko/tiers",
            title: "서열표 | NosLog",
            images: [
                expect.objectContaining({
                    url: "/opengraph-image",
                    width: 1200,
                    height: 630,
                }),
            ],
        });
        expect(meta.twitter).toMatchObject({
            card: "summary_large_image",
            images: [expect.objectContaining({ url: "/opengraph-image" })],
        });
        expect(meta.robots).toBeUndefined();
    });
    it("uses a page image and the small card when given", () => {
        const meta = createPageMetadata({
            title: "곡 Real",
            path: "/en/music/abc/real",
            image: { url: "/bg/abc.webp", alt: "곡 jacket" },
            imageCard: "summary",
            type: "profile",
        });
        expect(meta.openGraph).toMatchObject({
            type: "profile",
            locale: "en_US",
            images: [{ url: "/bg/abc.webp", alt: "곡 jacket" }],
        });
        expect(meta.twitter).toMatchObject({
            card: "summary",
            images: [{ url: "/bg/abc.webp", alt: "곡 jacket" }],
        });
    });
    it("points the home x-default at the root", () => {
        const meta = createPageMetadata({ path: "/ja", noIndex: true });
        expect(meta.alternates?.languages).toMatchObject({ "x-default": "/" });
        expect(meta.robots).toMatchObject({ index: false, follow: false });
    });
});
