import { describe, expect, it, vi } from "vitest";

import { attachTierChangeImage } from "@/features/announcements/lib/attach-tier-change-image";
import {
    appendTierChangeImage,
    layoutTierChangeImage,
    tierChangeImageAlt,
    tierChangeImageTitle,
} from "@/features/announcements/lib/tier-change-image";
import { ANNOUNCEMENT_CONTENT_MAX_LENGTH } from "@/features/announcements/schemas/announcement-schema";
import {
    tierChangeImageSchema,
    type TierChangeImageData,
} from "@/features/announcements/schemas/tier-change-image-schema";

const data: TierChangeImageData = {
    mode: "basic",
    goal: "pianist",
    date: "2026-09-26",
    rows: [
        {
            musicIndex: "sample-sonatine",
            title: "ソナチネ Op.20−1",
            difficulty: "Expert",
            level: 11,
            before: 11,
            after: 11.5,
        },
        {
            musicIndex: "sample-stray",
            title: "ストレイ・マーチ",
            difficulty: "Expert",
            level: 12,
            before: 11.8,
            after: 11.5,
        },
    ],
};
const measure = (text: string) => [...text].length * 22;
describe("tier-change announcement image", () => {
    it("accepts the reference and uses the existing tier value contract", () => {
        expect(
            tierChangeImageSchema.parse({
                ...data,
                rows: data.rows.map((row) => ({
                    ...row,
                    before: String(row.before),
                    after: String(row.after),
                })),
            })
        ).toEqual(data);
        for (const value of ["", "11.55", 0, 15, NaN])
            expect(
                tierChangeImageSchema.safeParse({
                    ...data,
                    rows: [{ ...data.rows[0], after: value }],
                }).success
            ).toBe(false);
    });
    it("rejects unchanged and duplicate charts, invalid dates and empty input", () => {
        for (const input of [
            { ...data, date: "2026-02-30" },
            { ...data, rows: [] },
            { ...data, rows: [{ ...data.rows[0], after: 11 }] },
            { ...data, rows: [data.rows[0], data.rows[0]] },
        ])
            expect(tierChangeImageSchema.safeParse(input).success).toBe(false);
    });
    it("supports Basic goals and the single Recital scope", () => {
        expect(tierChangeImageTitle({ mode: "basic", goal: "990k" })).toBe(
            "Basic 990k Tier"
        );
        expect(tierChangeImageTitle({ mode: "recital", goal: "pianist" })).toBe(
            "Recital Tier"
        );
        expect(
            tierChangeImageSchema.safeParse({
                ...data,
                mode: "recital",
                goal: "s",
            }).success
        ).toBe(false);
    });
    it("reproduces the 1200×706 reference frame and groups changes by direction", () => {
        const layout = layoutTierChangeImage(
            { ...data, rows: [...data.rows].reverse() },
            measure
        );
        expect([layout.width, layout.height]).toEqual([1200, 706]);
        expect(
            layout.groups.map((group) => ({
                direction: group.direction,
                titles: group.rows.map((row) => row.data.title),
            }))
        ).toEqual([
            { direction: "up", titles: [data.rows[0].title] },
            { direction: "down", titles: [data.rows[1].title] },
        ]);
        expect(layout.footerBaseline).toBe(660);
    });
    it("keeps long international song titles complete and reserves their lines", () => {
        const title = "長いタイトル🙂日本語 한국어 English ".repeat(8);
        const layout = layoutTierChangeImage(
            { ...data, rows: [{ ...data.rows[0], title }] },
            measure
        );
        const row = layout.groups[0].rows[0];
        expect(row.lines.join("").replaceAll(" ", "")).toBe(
            title.replaceAll(" ", "")
        );
        expect(row.height).toBeGreaterThan(132);
        expect(row.lines.every((line) => measure(line) <= 760)).toBe(true);
    });
    it("omits an empty direction and preserves order inside a group", () => {
        const rows = data.rows.map((row) => ({
            ...row,
            before: 11,
            after: 12,
        }));
        const layout = layoutTierChangeImage({ ...data, rows }, measure);
        expect(layout.groups).toHaveLength(1);
        expect(layout.groups[0].rows.map((row) => row.data.title)).toEqual(
            rows.map((row) => row.title)
        );
    });
    it("provides complete change text in all three image alternatives and escapes markdown labels", () => {
        for (const locale of ["ko", "ja", "en"] as const) {
            const alt = tierChangeImageAlt(data, locale);
            expect(alt).toContain("11.0 → 11.5");
            expect(alt).toContain("11.8 → 11.5");
            expect(alt).toContain(data.rows[0].title);
        }
        expect(
            appendTierChangeImage(
                "본문",
                "https://example.com/image.png",
                "곡 [제목]\\\n설명"
            )
        ).toBe(
            "본문\n\n![곡 \\[제목\\]\\\\ 설명](https://example.com/image.png)\n"
        );
    });
});

describe("generated image attachment", () => {
    const file = new File(["image"], "changes.png", { type: "image/png" });
    it("attaches to the captured locale using content edited during the upload", async () => {
        let resolve!: (url: string) => void;
        const upload = vi.fn(
            () =>
                new Promise<string>((done) => {
                    resolve = done;
                })
        );
        const contents = { ko: "첫 본문", ja: "別の本文" };
        const attach = attachTierChangeImage({
            file,
            data,
            locale: "ko",
            upload,
            getContent: () => contents.ko,
            setContent: (next) => {
                contents.ko = next;
            },
        });
        contents.ko += "\n추가 편집";
        resolve("https://example.com/changes.png");
        await attach;
        expect(contents.ko).toContain("첫 본문\n추가 편집\n\n![서열 변경:");
        expect(contents.ja).toBe("別の本文");
        expect(upload).toHaveBeenCalledOnce();
    });
    it("keeps the body when uploads fail or no image fits", async () => {
        const setContent = vi.fn();
        const upload = vi.fn().mockRejectedValue(new Error("업로드 실패"));
        await expect(
            attachTierChangeImage({
                file,
                data,
                locale: "ko",
                upload,
                getContent: () => "본문",
                setContent,
            })
        ).rejects.toThrow("업로드 실패");
        expect(setContent).not.toHaveBeenCalled();
        upload.mockClear();
        await expect(
            attachTierChangeImage({
                file,
                data,
                locale: "ko",
                upload,
                getContent: () => "a".repeat(ANNOUNCEMENT_CONTENT_MAX_LENGTH),
                setContent,
            })
        ).rejects.toThrow("글자 수 제한");
        expect(upload).not.toHaveBeenCalled();
    });
});
