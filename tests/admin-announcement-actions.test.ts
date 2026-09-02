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

import {
    createAnnouncement,
    deleteAnnouncement,
    updateAnnouncement,
} from "@/app/admin/announcements/actions";

function announcementFormData({
    id,
    title = "서비스 공지",
    content = "공지 내용입니다.",
    isPublished = false,
}: {
    id?: number | string;
    title?: string;
    content?: string;
    isPublished?: boolean;
} = {}) {
    const formData = new FormData();
    if (id !== undefined) formData.set("id", String(id));
    formData.set("title", title);
    formData.set("content", content);
    formData.set("isPublished", String(isPublished));
    return formData;
}

function expectAnnouncementCacheRefresh() {
    expect(mocks.updateTag).toHaveBeenCalledWith("announcements");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/announcements");
}

describe("관리자 공지사항 액션", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.announcementCreate.mockResolvedValue({ id: 10 });
        mocks.announcementFindUnique.mockResolvedValue({ publishedAt: null });
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

    it("잘못된 생성 입력은 필드 오류를 반환하고 DB를 수정하지 않는다", async () => {
        await expect(
            createAnnouncement(
                announcementFormData({ title: " ", content: " " })
            )
        ).resolves.toEqual({
            success: false,
            message: "공지 제목을 입력해주세요.",
            fieldErrors: {
                title: ["공지 제목을 입력해주세요."],
                content: ["공지 내용을 입력해주세요."],
            },
        });

        expect(mocks.announcementCreate).not.toHaveBeenCalled();
    });

    it("공개 공지를 등록하고 홈과 관리자 캐시를 갱신한다", async () => {
        await expect(
            createAnnouncement(
                announcementFormData({
                    title: "  서비스 공지  ",
                    content: "  공지 내용입니다.  ",
                    isPublished: true,
                })
            )
        ).resolves.toEqual({
            success: true,
            message: "공지사항을 등록했습니다.",
        });

        expect(mocks.announcementCreate).toHaveBeenCalledWith({
            data: {
                title: "서비스 공지",
                content: "공지 내용입니다.",
                isPublished: true,
                publishedAt: expect.any(Date),
            },
        });
        expectAnnouncementCacheRefresh();
    });

    it("기존 공개 시각을 유지하며 공지를 수정한다", async () => {
        const publishedAt = new Date("2026-08-01T00:00:00.000Z");
        mocks.announcementFindUnique.mockResolvedValue({ publishedAt });

        await expect(
            updateAnnouncement(
                announcementFormData({ id: 10, isPublished: true })
            )
        ).resolves.toEqual({
            success: true,
            message: "공지사항을 저장했습니다.",
        });

        expect(mocks.announcementUpdate).toHaveBeenCalledWith({
            where: { id: 10 },
            data: {
                title: "서비스 공지",
                content: "공지 내용입니다.",
                isPublished: true,
                publishedAt,
            },
        });
        expectAnnouncementCacheRefresh();
    });

    it("공지를 비공개로 바꾸면 공개 시각을 제거한다", async () => {
        mocks.announcementFindUnique.mockResolvedValue({
            publishedAt: new Date("2026-08-01T00:00:00.000Z"),
        });

        await updateAnnouncement(
            announcementFormData({ id: 10, isPublished: false })
        );

        expect(mocks.announcementUpdate).toHaveBeenCalledWith({
            where: { id: 10 },
            data: expect.objectContaining({
                isPublished: false,
                publishedAt: null,
            }),
        });
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
