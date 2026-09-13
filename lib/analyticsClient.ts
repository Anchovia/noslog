import type { ExternalEvent } from "@/lib/analyticsRoutes";

type AnalyticsBeacon =
    { type: "view"; path: string } | { type: "event"; name: ExternalEvent };

// 브라우저 → 방문 통계. 페이지를 떠나도 전송되도록 sendBeacon 을 먼저 쓰고,
// 자동화 브라우저(navigator.webdriver — 테스트 도구)에서는 보내지 않는다
export function sendAnalytics(body: AnalyticsBeacon) {
    if (typeof navigator === "undefined" || navigator.webdriver) return;
    const data = JSON.stringify(body);
    try {
        if (navigator.sendBeacon?.("/api/analytics", data)) return;
    } catch {
        // sendBeacon 이 막힌 브라우저는 아래 fetch 로
    }
    void fetch("/api/analytics", {
        method: "POST",
        body: data,
        keepalive: true,
    }).catch(() => null);
}
