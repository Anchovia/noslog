import { readJsonBody } from "@/lib/api/read-json-body";

const MAX_REPORT_BYTES = 16 * 1024;

// 주소의 쿼리에는 OAuth code · 토큰이 실릴 수 있어 로그에는 출처와 경로만 남긴다
function withoutQuery(value: unknown) {
    if (typeof value !== "string") return null;
    try {
        const url = new URL(value);
        return `${url.origin}${url.pathname}`;
    } catch {
        return value.slice(0, 32);
    }
}

// 브라우저가 보내는 CSP 위반 보고(report-uri) — 함수 로그에 요약 한 줄만 남기고 늘 204
export async function POST(request: Request) {
    const read = await readJsonBody(request, MAX_REPORT_BYTES);
    const report =
        !read.tooLarge && read.body && typeof read.body === "object"
            ? (read.body as { "csp-report"?: Record<string, unknown> })[
                  "csp-report"
              ]
            : undefined;
    if (report) {
        console.warn("CSP violation", {
            directive:
                report["effective-directive"] ?? report["violated-directive"],
            disposition: report.disposition,
            blocked: withoutQuery(report["blocked-uri"]),
            document: withoutQuery(report["document-uri"]),
        });
    }
    return new Response(null, { status: 204 });
}
