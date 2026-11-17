import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    mode: vi.fn(() => "live"),
    token: vi.fn(),
    report: vi.fn(),
    strip: vi.fn(),
    actionCreate: vi.fn(),
    logServerError: vi.fn(),
}));

vi.mock("next/cache", () => ({
    unstable_cache: (fn: unknown) => fn,
    updateTag: vi.fn(),
}));
vi.mock("@/lib/session", () => ({ default: async () => ({ id: 9 }) }));
vi.mock("@/lib/db", () => ({
    default: { musecatAction: { create: mocks.actionCreate } },
}));
vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));
vi.mock("@/lib/uploads/strip-image-metadata", () => ({
    stripImageMetadata: mocks.strip,
}));
vi.mock("@/features/musecat/server/musecat-mode", () => ({
    getMusecatMode: mocks.mode,
}));
vi.mock("@/features/musecat/server/musecat-connection-service", () => ({
    getMusecatAccessToken: mocks.token,
    getMusecatConnection: vi.fn(),
    markMusecatNeedsReconnect: vi.fn(),
}));
vi.mock("@/features/musecat/server/musecat-live-client", () => ({
    reportMusecatFault: mocks.report,
}));
vi.mock("@/features/musecat/server/musecat-mock", () => ({}));
vi.mock("@/features/arcades/arcade-discovery", () => ({
    arcadeDistance: vi.fn(),
}));
vi.mock("@/features/arcades/server/public-arcade-service", () => ({
    getPublicArcade: vi.fn(),
    getPublicArcades: vi.fn(),
}));

import { reportFault } from "@/features/musecat/server/musecat-arcade-service";

const original = (name: string) =>
    new File([`original:${name}`], name, { type: "image/jpeg" });
const fault = (photos: File[]) => ({
    musecatArcadeId: "1",
    gameId: "2",
    disruption: "major" as const,
    message: "건반이 눌리지 않아요",
    photos,
});

describe("뮤즈캣 고장 신고 사진의 촬영 정보", () => {
    beforeEach(() => {
        mocks.mode.mockReturnValue("live");
        mocks.token.mockResolvedValue({
            ok: true,
            token: "access",
            connectionId: 3,
            generation: 1,
        });
        mocks.report.mockResolvedValue({ ok: true, data: {} });
        mocks.strip.mockImplementation(async (bytes: Uint8Array) => ({
            data: Buffer.from(
                new TextDecoder().decode(bytes).replace("original", "stripped")
            ),
            contentType: "image/jpeg",
        }));
    });

    it("촬영 정보를 뺀 사진만 뮤즈캣으로 넘긴다", async () => {
        await expect(
            reportFault(fault([original("a.jpg"), original("b.jpg")]))
        ).resolves.toEqual({ ok: true, xp: undefined });

        expect(mocks.strip).toHaveBeenCalledTimes(2);
        const sent: File[] = mocks.report.mock.calls[0][1].photos;
        expect(
            await Promise.all(
                sent.map(async (photo) => [
                    photo.name,
                    photo.type,
                    await photo.text(),
                ])
            )
        ).toEqual([
            ["a.jpg", "image/jpeg", "stripped:a.jpg"],
            ["b.jpg", "image/jpeg", "stripped:b.jpg"],
        ]);
    });

    it("한 장이라도 지우지 못하면 신고를 보내지 않고 실패로 답한다", async () => {
        const error = new Error("corrupt image");
        mocks.strip.mockRejectedValueOnce(error);

        await expect(
            reportFault(fault([original("a.jpg"), original("b.jpg")]))
        ).resolves.toEqual({ ok: false, error: "failed" });

        expect(mocks.report).not.toHaveBeenCalled();
        expect(mocks.actionCreate).not.toHaveBeenCalled();
        expect(mocks.logServerError).toHaveBeenCalledWith(error, {
            event: "musecat.fault-report.photo-strip.failed",
            routePath: "/gamecenter",
            routeType: "action",
        });
    });

    it("연결되지 않은 계정의 사진은 읽지 않는다", async () => {
        mocks.token.mockResolvedValue({ ok: false, error: "not_connected" });

        await expect(reportFault(fault([original("a.jpg")]))).resolves.toEqual({
            ok: false,
            error: "not_connected",
        });
        expect(mocks.strip).not.toHaveBeenCalled();
        expect(mocks.report).not.toHaveBeenCalled();
    });
});
