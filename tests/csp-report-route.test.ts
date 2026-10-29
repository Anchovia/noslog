import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/csp-report/route";

// 위반 보고는 함수 로그에 요약만 — 주소의 쿼리(OAuth code 등)는 남기지 않는다
describe("POST /api/csp-report", () => {
    afterEach(() => vi.restoreAllMocks());

    it("출처와 경로만 남기고 204", async () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const response = await POST(
            new Request("https://noslog.app/api/csp-report", {
                method: "POST",
                headers: { "content-type": "application/csp-report" },
                body: JSON.stringify({
                    "csp-report": {
                        "document-uri":
                            "https://noslog.app/ko/authorize?code=secret",
                        "blocked-uri": "https://evil.example/x.js?t=1",
                        "effective-directive": "script-src-elem",
                        disposition: "enforce",
                    },
                }),
            })
        );
        expect(response.status).toBe(204);
        expect(warn).toHaveBeenCalledWith("CSP violation", {
            directive: "script-src-elem",
            disposition: "enforce",
            blocked: "https://evil.example/x.js",
            document: "https://noslog.app/ko/authorize",
        });
    });

    it("너무 크거나 형식이 다른 본문은 남기지 않고 204", async () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        for (const body of ["x".repeat(20 * 1024), "not json", "{}"]) {
            const response = await POST(
                new Request("https://noslog.app/api/csp-report", {
                    method: "POST",
                    body,
                })
            );
            expect(response.status).toBe(204);
        }
        expect(warn).not.toHaveBeenCalled();
    });
});
