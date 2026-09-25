import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
    eligibleAnnouncements,
    localizeAnnouncement,
    publicAnnouncementSchema,
    selectHomeAnnouncements,
    selectArchivePage,
    adjacentAnnouncements,
    announcementCategoryFromQuery,
    announcementsQuery,
    ANNOUNCEMENTS_PAGE_SIZE,
} from "@/features/announcements/schemas/publicAnnouncementSchema";
import AnnouncementBody, {
    announcementLink,
} from "@/features/announcements/components/announcementBody";

const now = new Date("2026-09-07T12:00:00Z");
const record = () => ({
    id: 1,
    publicSlug: "notice-1",
    isPublished: true as const,
    publishedAt: new Date("2026-09-01T00:00:00Z"),
    placement: "ROUTINE" as const,
    category: "UPDATE" as const,
    priority: 0,
    activeFrom: null,
    expiresAt: null,
    translations: (["ko", "ja", "en"] as const).map((locale) => ({
        locale,
        title: `${locale} title`,
        content: `${locale} body`,
        modifiedAt: null,
    })),
});

describe("P11 public announcement eligibility", () => {
    it("keeps legacy, untranslated, draft and scheduled notices private", () => {
        const good = record();
        expect(
            eligibleAnnouncements(
                [
                    { ...good, publicSlug: null },
                    { ...good, translations: good.translations.slice(0, 2) },
                    { ...good, isPublished: false },
                    { ...good, publishedAt: null },
                    { ...good, publishedAt: new Date("2026-10-01T00:00:00Z") },
                ],
                now
            )
        ).toEqual([]);
    });
    it("rejects duplicate locale translations and blank content", () => {
        const good = record();
        expect(
            publicAnnouncementSchema.safeParse({
                ...good,
                translations: [
                    good.translations[0],
                    good.translations[0],
                    good.translations[2],
                ],
            }).success
        ).toBe(false);
        good.translations[1].content = " ";
        expect(publicAnnouncementSchema.safeParse(good).success).toBe(false);
    });
    it("accepts cache-serialized dates and enforces 80/5000 code point limits", () => {
        const good = record();
        good.translations[0].title = "🎹".repeat(80);
        good.translations[0].content = "あ".repeat(5000);
        expect(
            eligibleAnnouncements([JSON.parse(JSON.stringify(good))], now)
        ).toHaveLength(1);
        good.translations[0].title += "x";
        expect(publicAnnouncementSchema.safeParse(good).success).toBe(false);
        good.translations[0].title = "Valid";
        good.translations[0].content += "x";
        expect(publicAnnouncementSchema.safeParse(good).success).toBe(false);
    });
    it("uses original publication and stable ID ordering", () => {
        expect(
            eligibleAnnouncements(
                [
                    {
                        ...record(),
                        id: 3,
                        publishedAt: new Date("2026-08-01T00:00:00Z"),
                    },
                    record(),
                    { ...record(), id: 2 },
                ],
                now
            ).map((item) => item.id)
        ).toEqual([2, 1, 3]);
    });
    it("localizes identity and modification date without falling back", () => {
        const a = publicAnnouncementSchema.parse(record());
        a.translations[0].modifiedAt = now;
        expect(localizeAnnouncement(a, "ko").modifiedAt).toBe(
            now.toISOString()
        );
        expect(localizeAnnouncement(a, "ko").category).toBe("UPDATE");
        expect(
            eligibleAnnouncements(
                [{ ...record(), category: undefined }],
                now
            )[0]?.category
        ).toBe("NOTICE");
        expect(localizeAnnouncement(a, "ja")).toMatchObject({
            slug: "notice-1",
            title: "ja title",
            modifiedAt: null,
        });
    });
    it("keeps expired critical history as a plain row and removes its Home prominence", () => {
        const a = {
            ...record(),
            placement: "SERVICE_CRITICAL",
            activeFrom: new Date("2026-09-01T00:00:00Z"),
            expiresAt: now,
        };
        const eligible = eligibleAnnouncements([a], now);
        expect(eligible).toHaveLength(1);
        const result = selectHomeAnnouncements(eligible, now);
        expect(result.critical).toBeNull();
        expect(
            result.list.map((item) => [item.record.id, item.pinned])
        ).toEqual([[1, false]]);
    });
    it("selects one critical item deterministically and pins active critical rows above routine ones", () => {
        const records = Array.from({ length: 6 }, (_, id) => ({
            ...record(),
            id: id + 1,
        }));
        const critical = [1, 2].map((priority) => ({
            ...record(),
            id: priority + 10,
            placement: "SERVICE_CRITICAL",
            priority,
            activeFrom: new Date("2026-09-01T00:00:00Z"),
        }));
        const result = selectHomeAnnouncements(
            eligibleAnnouncements([...records, ...critical], now),
            now
        );
        expect(result.critical?.id).toBe(12);
        expect(
            result.list.map((item) => [item.record.id, item.pinned])
        ).toEqual([
            [12, true],
            [11, true],
            [6, false],
        ]);
    });
});
describe("공지 목록 B1 · 상세 이전/다음 (2026-09-18)", () => {
    const day = (n: number) => new Date(Date.UTC(2026, 8, n));
    const make = (
        id: number,
        category: "UPDATE" | "NOTICE",
        critical = false
    ) => ({
        ...record(),
        id,
        publicSlug: `notice-${id}`,
        publishedAt: day(id),
        category,
        ...(critical
            ? { placement: "SERVICE_CRITICAL" as const, activeFrom: day(id) }
            : {}),
    });
    it("pins active critical notices on page 1 only and keeps them out of the dated list", () => {
        const records = eligibleAnnouncements(
            [make(1, "UPDATE"), make(2, "NOTICE", true), make(3, "UPDATE")],
            now
        );
        const first = selectArchivePage(records, now, null, 1)!;
        expect(first.pinned.map((item) => item.id)).toEqual([2]);
        expect(first.list.map((item) => item.id)).toEqual([3, 1]);
    });
    it("filters by category, including the pinned rows", () => {
        const records = eligibleAnnouncements(
            [make(1, "UPDATE"), make(2, "NOTICE", true), make(3, "UPDATE")],
            now
        );
        const updates = selectArchivePage(records, now, "UPDATE", 1)!;
        expect(updates.pinned).toEqual([]);
        expect(updates.list.map((item) => item.id)).toEqual([3, 1]);
        const notices = selectArchivePage(records, now, "NOTICE", 1)!;
        expect(notices.pinned.map((item) => item.id)).toEqual([2]);
        expect(notices.list).toEqual([]);
    });
    it("counts pages without the pinned rows and rejects pages past the end", () => {
        const records = eligibleAnnouncements(
            Array.from({ length: ANNOUNCEMENTS_PAGE_SIZE + 1 }, (_, index) =>
                make(index + 1, "UPDATE", index === 0)
            ),
            new Date(Date.UTC(2026, 11, 1))
        );
        const result = selectArchivePage(
            records,
            new Date(Date.UTC(2026, 11, 1)),
            null,
            1
        )!;
        expect(result.totalPages).toBe(1);
        expect(result.list).toHaveLength(ANNOUNCEMENTS_PAGE_SIZE);
        expect(
            selectArchivePage(records, new Date(Date.UTC(2026, 11, 1)), null, 2)
        ).toBeNull();
    });
    it("links older and newer notices in publication order across categories", () => {
        const records = eligibleAnnouncements(
            [make(1, "UPDATE"), make(2, "NOTICE"), make(3, "UPDATE")],
            now
        );
        expect(adjacentAnnouncements(records, 2)).toMatchObject({
            older: { id: 1 },
            newer: { id: 3 },
        });
        expect(adjacentAnnouncements(records, 3).newer).toBeNull();
        expect(adjacentAnnouncements(records, 1).older).toBeNull();
    });
    it("reads the category filter from lowercase query values only", () => {
        expect(announcementCategoryFromQuery(undefined)).toBeNull();
        expect(announcementCategoryFromQuery("update")).toBe("UPDATE");
        expect(announcementCategoryFromQuery("UPDATE")).toBeUndefined();
        expect(announcementCategoryFromQuery("event")).toBeUndefined();
        expect(announcementsQuery(null, 1)).toBe("");
        expect(announcementsQuery("DATA", 3)).toBe("?category=data&page=3");
    });
});

describe("P11 restricted Markdown", () => {
    const render = (content: string) =>
        renderToStaticMarkup(
            createElement(AnnouncementBody, {
                content,
                locale: "ja",
                siteUrl: "https://noslog.app",
                externalLabel: "外部サイト",
            })
        );
    it("renders approved native semantics and localizes internal links", () => {
        const html = render(
            "## Section\n\n### Subsection\n\nA **strong** word.\n\n- One\n- Two\n\n1. First\n\n[Music](/ko/music)\n\n[Discord](https://discord.com)"
        );
        for (const element of [
            "<h2",
            "<h3",
            "<p",
            "<ul",
            "<ol",
            "<li",
            "<strong",
            "<a",
        ])
            expect(html).toContain(element);
        expect(html).toContain('href="/ja/music"');
        expect(html).toContain("外部サイト");
        expect(html).not.toContain('target="_blank"');
    });
    it("renders only images uploaded to our public store for announcements or events", () => {
        const ours =
            "https://abc.public.blob.vercel-storage.com/events/2/image-x.png";
        const html = render(
            `![지도](${ours})\n\n![밖](https://example.com/a.png)\n\n![쿼리](${ours}?t=1)\n\n![다른 폴더](https://abc.public.blob.vercel-storage.com/avatars/2/a.png)`
        );
        expect(html.match(/<img /g)).toHaveLength(1);
        expect(html).toContain(`src="${ours}"`);
        expect(html).toContain('alt="지도"');
        expect(html).not.toContain("example.com");
    });
    it("never renders executable HTML, outside images, H1 or unsafe URLs", () => {
        const html = render(
            '# Hidden\n\n<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">\n\n![image](https://example.com/a.png)\n\n[attack](javascript:alert%281%29)'
        );
        for (const unsafe of [
            "<script",
            "<img",
            "<h1",
            "javascript:",
            "onerror=",
        ])
            expect(html).not.toContain(unsafe);
    });
    // 2026-09-23 T-c — 인용 · 코드 · 표 · 취소선 · 구분선까지 그린다
    it("renders quotes, code, tables, strikethrough and rules", () => {
        const html = render(
            "> 인용\n\n줄이 `내 Grd` 로 바뀌고 *기울임* · ~~취소선~~ 도 남는다\n\n```\nnpm run build\n```\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n---"
        );
        for (const element of [
            "<blockquote",
            "<code",
            "<em",
            "<del",
            "<pre",
            "<table",
            "<th",
            "<td",
            "<hr",
        ])
            expect(html).toContain(element);
        expect(html).toContain('class="nl-announcement-body__table"');
    });
    // 라벨 항목(2026-09-26 L2) — 「**라벨:** 설명」 문단이 둘 이상 이어지면 라벨(dt) + 설명(dd) 목록
    it("renders consecutive bold-label paragraphs as a label list", () => {
        const html = render(
            "## 새 기능\n\n**채보 뷰어:** 16:9로 고정했습니다.\n\n**전체화면 · 조작:** 스페이스로 [재생](/ko/music)합니다.\n\n고친 것: 번역 문제를 고쳤습니다."
        );
        expect(html).toContain(
            '<dl class="nl-announcement-body__items"><dt class="nl-component-title">채보 뷰어</dt><dd>16:9로 고정했습니다.</dd>'
        );
        expect(html).toContain(
            '<dt class="nl-component-title">전체화면 · 조작</dt><dd>스페이스로 <a href="/ja/music">재생</a>합니다.</dd></dl>'
        );
        expect(html).toContain("<p>고친 것: 번역 문제를 고쳤습니다.</p>");
        expect(html).toContain('class="nl-announcement-body nl-body-reading"');
    });
    it("keeps a single bold-label paragraph and bold words without a colon as paragraphs", () => {
        const html = render(
            "**주의:** 점검 중에는 동기화할 수 없습니다.\n\n**굵은 말** 뒤 문장.\n\n**라벨만:**"
        );
        expect(html).not.toContain("<dl");
        expect(html).toContain("<p><strong>주의:</strong> 점검 중에는");
    });
    it("keeps the text of disallowed elements instead of dropping it", () => {
        const html = render("# 큰 제목은 태그만 벗긴다");
        expect(html).toContain("큰 제목은 태그만 벗긴다");
        expect(html).not.toContain("<h1");
    });
    it.each([
        "javascript:alert(1)",
        "data:text/html,x",
        "file:///tmp/a",
        "\\\\evil.test",
        " https://evil.test",
    ])("rejects unsafe destination %s", (url) =>
        expect(announcementLink(url, "ko", "https://noslog.app")).toBeNull()
    );
});
