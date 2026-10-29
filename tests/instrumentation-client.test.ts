import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

// 강제 CSP 아래에서 zod 의 eval 시험이 페이지마다 위반 보고를 내지 않게, 화면 코드보다 먼저 jitless 를 켠다
describe("브라우저 시작 설정", () => {
    afterEach(() => {
        z.config({ jitless: undefined });
        vi.unstubAllGlobals();
    });

    it("zod 의 eval 빠른 길(jitless)을 끈다", async () => {
        vi.stubGlobal("window", { addEventListener: vi.fn() });
        await import("@/instrumentation-client");
        expect(z.config().jitless).toBe(true);
    });
});
