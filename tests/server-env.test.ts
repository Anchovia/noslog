import { afterEach, describe, expect, it, vi } from "vitest";

async function loadServerEnv(env: {
    VERCEL_ENV: string;
    MUSECAT_MODE: string;
    VERCEL_URL?: string;
}) {
    vi.stubEnv("VERCEL_ENV", env.VERCEL_ENV);
    vi.stubEnv("MUSECAT_MODE", env.MUSECAT_MODE);
    vi.stubEnv("VERCEL_URL", env.VERCEL_URL ?? "noslog-abc123.vercel.app");
    vi.resetModules();
    return import("@/lib/env/server");
}

describe("서버 환경 변수 확인", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.resetModules();
    });

    it("운영 배포에서 뮤즈캣 mock 모드면 시작하지 않는다", async () => {
        await expect(
            loadServerEnv({ VERCEL_ENV: "production", MUSECAT_MODE: "mock" })
        ).rejects.toThrow(
            "MUSECAT_MODE=mock cannot be used when VERCEL_ENV is production"
        );
    });

    it("배포 주소가 없는 로컬 빌드는 운영 env 를 읽어도 멈추지 않는다", async () => {
        const { serverEnv } = await loadServerEnv({
            VERCEL_ENV: "production",
            MUSECAT_MODE: "mock",
            VERCEL_URL: "",
        });
        expect(serverEnv.MUSECAT_MODE).toBe("mock");
    });

    it("운영 배포의 live · 빈 값과 프리뷰 · 개발의 mock 은 받는다", async () => {
        for (const env of [
            { VERCEL_ENV: "production", MUSECAT_MODE: "live" },
            { VERCEL_ENV: "production", MUSECAT_MODE: "" },
            { VERCEL_ENV: "preview", MUSECAT_MODE: "mock" },
            { VERCEL_ENV: "development", MUSECAT_MODE: "mock" },
            { VERCEL_ENV: "", MUSECAT_MODE: "mock" },
        ]) {
            const { serverEnv } = await loadServerEnv(env);
            expect(serverEnv.MUSECAT_MODE).toBe(env.MUSECAT_MODE || undefined);
        }
    });
});
