"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

import { pageRouteFromPath } from "@/lib/analytics-routes";

// 프로필 번호 · 슬러그 · 검색어가 Vercel 로 가지 않게 주소를 라우트 패턴으로 바꾼다. 목록에 없는 경로는 보내지 않는다
function toRouteEvent(event: BeforeSendEvent) {
    const url = new URL(event.url);
    const route = pageRouteFromPath(url.pathname);
    return route ? { ...event, url: `${url.origin}${route}` } : null;
}

export default function WebAnalytics() {
    return <Analytics beforeSend={toRouteEvent} />;
}
