import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getSession: vi.fn() }));

vi.mock("@/lib/session", () => ({ default: mocks.getSession }));

import { proxy } from "@/proxy";

function nonceOf(policy: string | null | undefined) {
    return /'nonce-([^']+)'/.exec(policy ?? "")?.[1];
}

// 스크립트는 요청마다 새 nonce 로만 실행된다 — Next 가 요청 헤더의 CSP 에서 nonce 를 읽어 붙인다
describe("스크립트 정책(CSP)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.getSession.mockResolvedValue({});
    });

    it("페이지 응답에 nonce · strict-dynamic 정책을 강제하고 같은 nonce 를 요청 헤더로 넘긴다", async () => {
        const response = await proxy(
            new NextRequest("https://noslog.app/ko/music")
        );
        const policy = response?.headers.get("content-security-policy");
        expect(policy).toContain("'strict-dynamic'");
        expect(policy).toContain("object-src 'none'");
        expect(policy).toContain("base-uri 'self'");
        expect(policy).toContain("report-uri /api/csp-report");
        expect(policy).not.toContain("'unsafe-inline'");
        const nonce = nonceOf(policy);
        expect(nonce).toBeTruthy();
        expect(response?.headers.get("x-middleware-request-x-nonce")).toBe(
            nonce
        );
        expect(
            response?.headers.get(
                "x-middleware-request-content-security-policy"
            )
        ).toBe(policy);
    });

    it("요청마다 nonce 가 다르다", async () => {
        const [first, second] = await Promise.all([
            proxy(new NextRequest("https://noslog.app/ko")),
            proxy(new NextRequest("https://noslog.app/ko")),
        ]);
        expect(nonceOf(first?.headers.get("content-security-policy"))).not.toBe(
            nonceOf(second?.headers.get("content-security-policy"))
        );
    });

    it("관리자 화면에도 같은 정책을 건다", async () => {
        const response = await proxy(
            new NextRequest("https://noslog.app/admin/events/1")
        );
        expect(nonceOf(response?.headers.get("content-security-policy"))).toBe(
            response?.headers.get("x-middleware-request-x-nonce")
        );
    });

    it("API 응답에는 붙이지 않는다", async () => {
        await expect(
            proxy(new NextRequest("https://noslog.app/api/health"))
        ).resolves.toBeUndefined();
    });
});
