"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { sendAnalytics } from "@/lib/analyticsClient";

// 공개 페이지가 열리거나 화면이 바뀔 때 방문 1회를 알린다 — 관리자 셸에는 넣지 않는다.
// 검색 조건(?q=…)만 바뀌는 건 같은 페이지라 세지 않는다
export default function PageViewBeacon() {
    const pathname = usePathname();
    useEffect(() => {
        sendAnalytics({ type: "view", path: pathname });
    }, [pathname]);
    return null;
}
