import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    announcementCreate: vi.fn(),
    announcementFindUnique: vi.fn(),
    announcementUpdate: vi.fn(),
    announcementDelete: vi.fn(),
    updateTag: vi.fn(),
    revalidatePath: vi.fn(),
    logServerError: vi.fn(),
}));

vi.mock("@/lib/admin", () => ({
    requireAdmin: mocks.requireAdmin,
}));

vi.mock("@/lib/db", () => ({
    default: {
        announcement: {
            create: mocks.announcementCreate,
            findUnique: mocks.announcementFindUnique,
            update: mocks.announcementUpdate,
            delete: mocks.announcementDelete,
        },
    },
}));

vi.mock("next/cache", () => ({
    updateTag: mocks.updateTag,
    revalidatePath: mocks.revalidatePath,
}));

vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));

import { Prisma } from "@prisma/client";

import {
    createAnnouncement,
    deleteAnnouncement,
    updateAnnouncement,
} from "@/app/admin/announcements/actions";

const locales = ["ko", "ja", "en"] as const;

function announcementFormData({
    id,
    publicSlug = "service-notice",
    placement = "ROUTINE",
    category = "",
    priority = "0",
    activeFrom = "",
    expiresAt = "",
    isPublished = false,
    title = "서비스 공지",
    content = "공지 내용입니다.",
}: {
    id?: number | string;
    publicSlug?: string;
    placement?: string;
    category?: string;
    priority?: string;
    activeFrom?: string;
    expiresAt?: string;
    isPublished?: boolean;
    title?: string;
    content?: string;
} = {}) {
    const formData = new FormData();
    if (id !== undefined) formData.set("id", String(id));
    formData.set("publicSlug", publicSlug);
    formData.set("placement", placement);
    formData.set("category", category);
    formData.set("priority", priority);
    formData.set("activeFrom", activeFrom);
    formData.set("expiresAt", expiresAt);
    formData.set("isPublished", String(isPublished));
    for (const locale of locales) {
        formData.set(`title.${locale}`, `${title} ${locale}`);
        formData.set(`content.${locale}`, `${content} ${locale}`);
    }
    return formData;
}

const translationRows = locales.map((locale) => ({
    locale,
    title: `서비스 공지 ${locale}`,
    content: `공지 내용입니다. ${locale}`,
}));

function expectAnnouncementCacheRefresh() {
    expect(mocks.updateTag).toHaveBeenCalledWith("announcements");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/announcements");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/announcements");
}

describe("관리자 공지사항 액션", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.announcementCreate.mockResolvedValue({ id: 10 });
        mocks.announcementFindUnique.mockResolvedValue({
            publishedAt: null,
            translations: [],
        });
        mocks.announcementUpdate.mockResolvedValue({ id: 10 });
        mocks.announcementDelete.mockResolvedValue({ id: 10 });
    });

    it("관리자 인증에 실패하면 입력을 처리하지 않는다", async () => {
        mocks.requireAdmin.mockRejectedValueOnce(new Error("forbidden"));

        await expect(
            createAnnouncement(announcementFormData())
        ).rejects.toThrow("forbidden");

        expect(mocks.announcementCreate).not.toHaveBeenCalled();
    });

    it("잘못된 생성 입력은 로케일 경로의 필드 오류를 반환하고 DB를 수정하지 않는다", async () => {
        const formData = announcementFormData({ publicSlug: "Bad Slug" });
        formData.set("title.ja", " ");

        await expect(createAnnouncement(formData)).resolves.toEqual({
            success: false,
            message:
                "공개 주소는 영문 소문자·숫자와 하이픈(-)만 쓸 수 있습니다.",
            fieldErrors: {
                publicSlug: [
                    "공개 주소는 영문 소문자·숫자와 하이픈(-)만 쓸 수 있습니다.",
                ],
                "translations.ja.title": ["공지 제목을 입력해주세요."],
            },
        });

        expect(mocks.announcementCreate).not.toHaveBeenCalled();
    });

    it("공개 공지를 세 언어 번역과 함께 등록하고 캐시를 갱신한다", async () => {
        await expect(
            createAnnouncement(announcementFormData({ isPublished: true }))
        ).resolves.toEqual({
            success: true,
            message: "공지사항을 등록했습니다.",
            id: 10,
        });

        expect(mocks.announcementCreate).toHaveBeenCalledWith({
            data: {
                title: "서비스 공지 ko",
                content: "공지 내용입니다. ko",
                publicSlug: "service-notice",
                placement: "ROUTINE",
                category: "NOTICE",
                priority: 0,
                activeFrom: null,
                expiresAt: null,
                isPublished: true,
                publishedAt: expect.any(Date),
                translations: { create: translationRows },
            },
            select: { id: true },
        });
        expectAnnouncementCacheRefresh();
    });

    it("선택한 분류를 저장하고 잘못된 분류는 필드 오류로 돌려준다", async () => {
        await createAnnouncement(
            announcementFormData({ category: "MAINTENANCE" })
        );
        expect(mocks.announcementCreate.mock.calls[0][0].data.category).toBe(
            "MAINTENANCE"
        );

        const result = await createAnnouncement(
            announcementFormData({ category: "URGENT" })
        );
        expect(result.success).toBe(false);
        if (!result.success)
            expect(result.fieldErrors?.category).toEqual([
                "공지 분류를 선택해주세요.",
            ]);
    });

    it("중대 공지의 노출 시작이 공개 시각보다 이르면 공개 시각으로 맞춘다", async () => {
        await createAnnouncement(
            announcementFormData({
                placement: "SERVICE_CRITICAL",
                priority: "3",
                activeFrom: "2020-01-01T00:00",
                expiresAt: "2099-01-01T00:00",
                isPublished: true,
            })
        );

        const data = mocks.announcementCreate.mock.calls[0][0].data;
        expect(data.placement).toBe("SERVICE_CRITICAL");
        expect(data.priority).toBe(3);
        expect(data.activeFrom).toEqual(data.publishedAt);
        expect(data.expiresAt).toEqual(new Date("2099-01-01T00:00"));
    });

    it("중복된 공개 주소는 필드 오류로 돌려준다", async () => {
        mocks.announcementCreate.mockRejectedValueOnce(
            new Prisma.PrismaClientKnownRequestError("unique", {
                code: "P2002",
                clientVersion: "test",
            })
        );

        await expect(
            createAnnouncement(announcementFormData())
        ).resolves.toEqual({
            success: false,
            message: "이미 사용 중인 공개 주소입니다.",
            fieldErrors: { publicSlug: ["이미 사용 중인 공개 주소입니다."] },
        });
        expect(mocks.logServerError).not.toHaveBeenCalled();
    });

    it("기존 공개 시각을 유지하고 바뀐 번역에만 수정 시각을 남기며 수정한다", async () => {
        const publishedAt = new Date("2026-08-01T00:00:00.000Z");
        mocks.announcementFindUnique.mockResolvedValue({
            publishedAt,
            translations: [
                translationRows[0],
                { ...translationRows[1], title: "예전 제목" },
            ],
        });

        await expect(
            updateAnnouncement(
                announcementFormData({ id: 10, isPublished: true })
            )
        ).resolves.toEqual({
            success: true,
            message: "공지사항을 저장했습니다.",
            id: 10,
        });

        const call = mocks.announcementUpdate.mock.calls[0][0];
        expect(call.where).toEqual({ id: 10 });
        expect(call.data).toMatchObject({
            title: "서비스 공지 ko",
            publicSlug: "service-notice",
            isPublished: true,
            publishedAt,
        });
        const upserts = call.data.translations.upsert;
        expect(upserts).toHaveLength(3);
        expect(upserts[0].update).toEqual({});
        expect(upserts[1].update).toEqual({
            title: "서비스 공지 ja",
            content: "공지 내용입니다. ja",
            modifiedAt: expect.any(Date),
        });
        expect(upserts[2].create).toEqual(translationRows[2]);
        expect(upserts[2].update.modifiedAt).toEqual(expect.any(Date));
        expectAnnouncementCacheRefresh();
    });

    it("공지를 비공개로 바꾸면 공개 시각을 제거한다", async () => {
        mocks.announcementFindUnique.mockResolvedValue({
            publishedAt: new Date("2026-08-01T00:00:00.000Z"),
            translations: [],
        });

        await updateAnnouncement(
            announcementFormData({ id: 10, isPublished: false })
        );

        expect(mocks.announcementUpdate).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 10 },
                data: expect.objectContaining({
                    isPublished: false,
                    publishedAt: null,
                }),
            })
        );
    });

    it("존재하지 않는 공지는 수정하지 않는다", async () => {
        mocks.announcementFindUnique.mockResolvedValue(null);

        await expect(
            updateAnnouncement(announcementFormData({ id: 99 }))
        ).resolves.toEqual({
            success: false,
            message: "공지사항을 찾을 수 없습니다.",
        });

        expect(mocks.announcementUpdate).not.toHaveBeenCalled();
        expect(mocks.updateTag).not.toHaveBeenCalled();
    });

    it("유효한 공지를 삭제하고 관련 캐시를 갱신한다", async () => {
        const formData = new FormData();
        formData.set("id", "10");

        await expect(deleteAnnouncement(formData)).resolves.toEqual({
            success: true,
            message: "공지사항을 삭제했습니다.",
            id: 10,
        });

        expect(mocks.announcementDelete).toHaveBeenCalledWith({
            where: { id: 10 },
        });
        expectAnnouncementCacheRefresh();
    });

    it("DB 오류를 기록하고 실패 결과를 반환한다", async () => {
        mocks.announcementCreate.mockRejectedValueOnce(
            new Error("database error")
        );

        await expect(
            createAnnouncement(announcementFormData())
        ).resolves.toEqual({
            success: false,
            message: "공지사항을 등록하지 못했습니다.",
        });

        expect(mocks.logServerError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                event: "admin.announcement.create.failed",
            })
        );
        expect(mocks.updateTag).not.toHaveBeenCalled();
    });
});
