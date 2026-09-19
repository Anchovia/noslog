import { beforeEach, describe, expect, it, vi } from "vitest";
const { env, sync } = vi.hoisted(() => ({
    env: {
        OFFICIAL_X_SYNC_SECRET: "test-only-official-x-sync-secret-32-chars" as
            string | undefined,
    },
    sync: vi.fn(),
}));
vi.mock("@/lib/env/server", () => ({ serverEnv: env }));
vi.mock("@/features/home/server/officialXSync", () => ({
    syncOfficialXFeed: sync,
}));
vi.mock("@/lib/observability/server", () => ({ logServerError: vi.fn() }));
import { GET } from "@/app/api/cron/official-x/route";
function request(value?: string) {
    return new Request("http://localhost/api/cron/official-x", {
        headers: value ? { authorization: value } : {},
    });
}
beforeEach(() => {
    env.OFFICIAL_X_SYNC_SECRET = "test-only-official-x-sync-secret-32-chars";
    sync.mockReset();
});
describe("official news cron authorization", () => {
    it.each([undefined, "Bearer wrong", "Bearer é"])(
        "rejects missing/invalid authorization before any sync",
        async (value) => {
            expect((await GET(request(value))).status).toBe(401);
            expect(sync).not.toHaveBeenCalled();
        }
    );
    it("fails closed when the server has no secret", async () => {
        env.OFFICIAL_X_SYNC_SECRET = undefined;
        expect((await GET(request("Bearer undefined"))).status).toBe(401);
        expect(sync).not.toHaveBeenCalled();
    });
    it("returns a non-cacheable success envelope for an authorized sync", async () => {
        sync.mockResolvedValue({ status: "unchanged" });
        const response = await GET(
            request(`Bearer ${env.OFFICIAL_X_SYNC_SECRET}`)
        );
        expect(response.status).toBe(200);
        expect(response.headers.get("cache-control")).toBe("no-store");
        expect(await response.json()).toMatchObject({
            isSuccess: true,
            result: { status: "unchanged" },
        });
    });
    it("reports incomplete translations to the scheduler", async () => {
        sync.mockResolvedValue({ status: "translation-pending" });
        const response = await GET(
            request(`Bearer ${env.OFFICIAL_X_SYNC_SECRET}`)
        );
        expect(response.status).toBe(503);
        expect(await response.json()).toMatchObject({
            code: "TRANSLATION_PENDING",
        });
    });
    it("does not expose external errors or credentials", async () => {
        sync.mockRejectedValue(new Error("private credential"));
        const response = await GET(
            request(`Bearer ${env.OFFICIAL_X_SYNC_SECRET}`)
        );
        expect(response.status).toBe(503);
        expect(await response.text()).not.toContain("private credential");
    });
});
