import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    musicFindMany: vi.fn(),
    translationDeleteMany: vi.fn(),
    translationUpsert: vi.fn(),
    transaction: vi.fn(),
    revalidatePath: vi.fn(),
    updateTag: vi.fn(),
}));

vi.mock("@/lib/admin", () => ({
    requireAdmin: mocks.requireAdmin,
}));

vi.mock("@/lib/db", () => ({
    default: {
        $transaction: mocks.transaction,
        music: { findMany: mocks.musicFindMany },
        musicTranslation: {
            deleteMany: mocks.translationDeleteMany,
            upsert: mocks.translationUpsert,
        },
    },
}));

vi.mock("next/cache", () => ({
    revalidatePath: mocks.revalidatePath,
    updateTag: mocks.updateTag,
}));

import {
    createMusicTranslationCsvExport,
    importMusicTranslationsCsv,
    saveMusicTranslation,
    validateMusicTranslationsCsv,
} from "@/features/music/server/musicTranslationAdminService";

function translationForm(title: string, status = "draft") {
    const formData = new FormData();
    formData.set("musicIndex", "music-1");
    formData.set("locale", "ko");
    formData.set("title", title);
    formData.set("status", status);
    return formData;
}

describe("관리자 악곡 번역 액션", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.musicFindMany.mockResolvedValue([
            { index: "music-1", title: "Original title" },
        ]);
        mocks.translationDeleteMany.mockResolvedValue({ count: 1 });
        mocks.translationUpsert.mockResolvedValue({ id: 10 });
        mocks.transaction.mockImplementation(async (operations) =>
            Promise.all(operations)
        );
    });

    it("번역 제목과 승인 상태를 정규화해 저장한다", async () => {
        await expect(
            saveMusicTranslation(translationForm("  번역 제목  ", "approved"))
        ).resolves.toEqual({
            success: true,
            message: "악곡 번역을 저장했습니다.",
        });

        expect(mocks.translationUpsert).toHaveBeenCalledWith({
            where: {
                musicIndex_locale: {
                    musicIndex: "music-1",
                    locale: "ko",
                },
            },
            create: {
                musicIndex: "music-1",
                locale: "ko",
                title: "번역 제목",
                status: "approved",
                reviewedAt: expect.any(Date),
            },
            update: {
                title: "번역 제목",
                status: "approved",
                reviewedAt: expect.any(Date),
            },
        });
        expect(mocks.updateTag).toHaveBeenCalledWith("music-catalog");
        expect(mocks.updateTag).toHaveBeenCalledWith("music-details");
    });

    it("빈 번역 제목은 해당 언어 번역을 삭제한다", async () => {
        await expect(
            saveMusicTranslation(translationForm(" "))
        ).resolves.toEqual({
            success: true,
            message: "악곡 번역을 삭제했습니다.",
        });

        expect(mocks.translationDeleteMany).toHaveBeenCalledWith({
            where: { musicIndex: "music-1", locale: "ko" },
        });
        expect(mocks.translationUpsert).not.toHaveBeenCalled();
    });

    it("허용 길이를 넘는 번역 제목은 저장하지 않는다", async () => {
        await expect(
            saveMusicTranslation(translationForm("가".repeat(301)))
        ).resolves.toMatchObject({
            success: false,
            fieldErrors: {
                title: ["번역 제목은 300자 이하로 입력해주세요."],
            },
        });

        expect(mocks.translationDeleteMany).not.toHaveBeenCalled();
        expect(mocks.translationUpsert).not.toHaveBeenCalled();
    });

    it("CSV를 검증하고 원제를 포함한 미리보기를 반환한다", async () => {
        const csv = "index,locale,title,status\nmusic-1,ko,번역 제목,draft";

        await expect(validateMusicTranslationsCsv(csv)).resolves.toEqual({
            success: true,
            message: "1개 번역을 반영할 수 있습니다.",
            previews: [
                {
                    index: "music-1",
                    locale: "ko",
                    title: "번역 제목",
                    status: "draft",
                    originalTitle: "Original title",
                },
            ],
            totalCount: 1,
        });
    });

    it("존재하지 않는 악곡이 포함된 CSV는 반영하지 않는다", async () => {
        mocks.musicFindMany.mockResolvedValue([]);
        const csv = "index,locale,title,status\nmissing,ko,번역 제목,draft";

        await expect(importMusicTranslationsCsv(csv)).resolves.toEqual({
            success: false,
            message: "검증 오류가 있어 번역을 반영하지 않았습니다.",
            fieldErrors: {
                csv: ["2행: 존재하지 않는 악곡 index입니다. (missing)"],
            },
        });
        expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("검증된 CSV 행을 한 트랜잭션으로 반영한다", async () => {
        const csv = [
            "index,locale,title,status",
            "music-1,ko,번역 제목,draft",
            "music-1,en,English title,approved",
        ].join("\n");

        await expect(importMusicTranslationsCsv(csv)).resolves.toEqual({
            success: true,
            message: "2개 번역을 반영했습니다.",
            count: 2,
        });
        expect(mocks.translationUpsert).toHaveBeenCalledTimes(2);
        expect(mocks.transaction).toHaveBeenCalledTimes(1);
    });

    it("언어와 상태에 맞는 다운로드 CSV와 파일명을 만든다", async () => {
        mocks.musicFindMany.mockResolvedValue([
            {
                index: "music-1",
                title: "Original title",
                title_kana: "オリジナル",
                translations: [
                    {
                        locale: "en",
                        title: "English title",
                        status: "approved",
                    },
                ],
            },
        ]);

        const result = await createMusicTranslationCsvExport("en", "approved");

        expect(result.filename).toBe(
            "noslog-music-translations-en-approved.csv"
        );
        expect(result.csv).toContain('"English title","approved"');
    });
});
