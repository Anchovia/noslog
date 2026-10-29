import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    transaction: vi.fn(),
    deleteMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
}));

const transactionClient = {
    uploadTokenGrant: {
        deleteMany: mocks.deleteMany,
        count: mocks.count,
        create: mocks.create,
    },
};

vi.mock("server-only", () => ({}));

vi.mock("@/lib/db", () => ({
    default: {
        $transaction: mocks.transaction,
        uploadTokenGrant: { deleteMany: mocks.deleteMany },
    },
}));

import {
    claimUploadTokenQuota,
    releaseUploadTokenQuota,
} from "@/lib/upload-rate-limit";

describe("이미지 업로드 토큰 발급 제한", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.deleteMany.mockResolvedValue({ count: 0 });
        mocks.count.mockResolvedValue(0);
        mocks.create.mockResolvedValue({ id: 10 });
        mocks.transaction.mockImplementation(async (callback) =>
            callback(transactionClient)
        );
    });

    it("한도 이내이면 발급 기록을 만들고 허용한다", async () => {
        mocks.count.mockResolvedValue(9);

        await expect(
            claimUploadTokenQuota(2, "profile-avatar")
        ).resolves.toEqual({ allowed: true, grantId: 10 });

        expect(mocks.create).toHaveBeenCalledWith({
            data: { userId: 2, purpose: "profile-avatar" },
            select: { id: true },
        });
        expect(mocks.transaction).toHaveBeenCalledWith(expect.any(Function), {
            isolationLevel: "Serializable",
        });
    });

    it("최근 한 시간에 10회 발급했으면 추가 발급을 거부한다", async () => {
        mocks.count.mockResolvedValue(10);

        await expect(claimUploadTokenQuota(2, "exam-proof")).resolves.toEqual({
            allowed: false,
            grantId: null,
        });
        expect(mocks.create).not.toHaveBeenCalled();
    });

    it("이용자 글 번역은 같은 표에서 시간당 20회로 따로 센다", async () => {
        mocks.count.mockResolvedValue(19);
        await expect(
            claimUploadTokenQuota(2, "community-translation")
        ).resolves.toEqual({ allowed: true, grantId: 10 });
        expect(mocks.create).toHaveBeenCalledWith({
            data: { userId: 2, purpose: "community-translation" },
            select: { id: true },
        });

        mocks.create.mockClear();
        mocks.count.mockResolvedValue(20);
        await expect(
            claimUploadTokenQuota(2, "community-translation")
        ).resolves.toEqual({ allowed: false, grantId: null });
        expect(mocks.create).not.toHaveBeenCalled();
    });

    it("목적별 창으로 세고, 정리는 모든 목적의 창보다 오래된 행만 지운다", async () => {
        vi.useFakeTimers({ now: new Date("2026-10-29T12:00:00.000Z") });
        try {
            await claimUploadTokenQuota(2, "community-translation");
            const hourAgo = new Date("2026-10-29T11:00:00.000Z");
            expect(mocks.deleteMany).toHaveBeenCalledWith({
                where: { userId: 2, createdAt: { lt: hourAgo } },
            });
            expect(mocks.count).toHaveBeenCalledWith({
                where: {
                    userId: 2,
                    purpose: "community-translation",
                    createdAt: { gte: hourAgo },
                },
            });
        } finally {
            vi.useRealTimers();
        }
    });

    it("토큰 생성 실패 시 발급 기록을 되돌릴 수 있다", async () => {
        await releaseUploadTokenQuota(2, 10);

        expect(mocks.deleteMany).toHaveBeenCalledWith({
            where: { id: 10, userId: 2 },
        });
    });
});
