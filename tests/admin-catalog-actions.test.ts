import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    candidateFindUnique: vi.fn(),
    candidateUpdate: vi.fn(),
    parseMusicCatalogSnapshot: vi.fn(),
    applyMusicCatalogSnapshot: vi.fn(),
    revalidatePath: vi.fn(),
    updateTag: vi.fn(),
}));

vi.mock("@/lib/admin", () => ({
    requireAdmin: mocks.requireAdmin,
}));
vi.mock("@/lib/db", () => ({
    default: {
        musicCatalogCandidate: {
            findUnique: mocks.candidateFindUnique,
            update: mocks.candidateUpdate,
        },
    },
}));
vi.mock("@/lib/services/music/catalogSync", () => ({
    parseMusicCatalogSnapshot: mocks.parseMusicCatalogSnapshot,
    applyMusicCatalogSnapshot: mocks.applyMusicCatalogSnapshot,
}));
vi.mock("next/cache", () => ({
    revalidatePath: mocks.revalidatePath,
    updateTag: mocks.updateTag,
}));

import { reviewMusicCatalogCandidate } from "@/app/admin/catalog/actions";

function reviewForm(decision: "approve" | "reject") {
    const formData = new FormData();
    formData.set("candidateId", "7");
    formData.set("decision", decision);
    return formData;
}

describe("관리자 악곡 업데이트 검토", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.candidateFindUnique.mockResolvedValue({
            id: 7,
            payload: { musicIndex: "sasoribi" },
            status: "pending",
        });
        mocks.candidateUpdate.mockResolvedValue({ id: 7 });
        mocks.parseMusicCatalogSnapshot.mockReturnValue({
            musicIndex: "sasoribi",
        });
    });

    it("검토 대기 후보를 반려 상태로 변경한다", async () => {
        await reviewMusicCatalogCandidate(reviewForm("reject"));

        expect(mocks.applyMusicCatalogSnapshot).not.toHaveBeenCalled();
        expect(mocks.candidateUpdate).toHaveBeenCalledWith({
            where: { id: 7 },
            data: {
                status: "rejected",
                reviewedAt: expect.any(Date),
            },
        });
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin");
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/catalog");
    });

    it("승인한 후보를 카탈로그에 반영하고 공개 캐시를 갱신한다", async () => {
        const snapshot = { musicIndex: "sasoribi" };
        mocks.parseMusicCatalogSnapshot.mockReturnValue(snapshot);

        await reviewMusicCatalogCandidate(reviewForm("approve"));

        expect(mocks.applyMusicCatalogSnapshot).toHaveBeenCalledWith(snapshot);
        expect(mocks.candidateUpdate).toHaveBeenCalledWith({
            where: { id: 7 },
            data: {
                status: "applied",
                reviewedAt: expect.any(Date),
                appliedAt: expect.any(Date),
            },
        });
        for (const tag of [
            "music-catalog",
            "music-details",
            "chart-rankings",
            "user-rankings",
        ]) {
            expect(mocks.updateTag).toHaveBeenCalledWith(tag);
        }
    });

    it("이미 반영된 이력은 다시 처리하지 않는다", async () => {
        mocks.candidateFindUnique.mockResolvedValue({
            id: 7,
            payload: { musicIndex: "sasoribi" },
            status: "applied",
        });

        await reviewMusicCatalogCandidate(reviewForm("approve"));

        expect(mocks.parseMusicCatalogSnapshot).not.toHaveBeenCalled();
        expect(mocks.applyMusicCatalogSnapshot).not.toHaveBeenCalled();
        expect(mocks.candidateUpdate).not.toHaveBeenCalled();
    });
});
