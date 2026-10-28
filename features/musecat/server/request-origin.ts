import "server-only";

import { headers } from "next/headers";

/** 서울시청 — 접속 지역을 모를 때(로컬 개발 · 헤더 없음)의 기준 위치 */
const DEFAULT_ORIGIN = { lat: 37.5665, lon: 126.978 };

export interface RequestOrigin {
    lat: number;
    lon: number;
    /** 접속 지역 도시 이름(있으면) — 없으면 화면이 기본 이름을 쓴다 */
    city: string | null;
    source: "ip" | "default";
}

/**
 * 오락실 목록의 처음 기준 위치(2026-10-21 안 A) — 뮤즈캣 주변 검색은 좌표가 꼭 있어야 해서 위치 없는 전체 목록이 없다.
 * Vercel 이 붙여 주는 접속 IP 위치 헤더(x-vercel-ip-latitude · longitude · city, 공식 문서 확인)를 쓰고, 없으면 서울.
 * 대략적인 위치라 저장하지 않고 이번 요청에만 쓴다. 기기에 저장된 마지막 위치가 있으면 화면이 그것을 먼저 쓴다
 */
export async function getRequestOrigin(): Promise<RequestOrigin> {
    const list = await headers();
    const lat = Number(list.get("x-vercel-ip-latitude"));
    const lon = Number(list.get("x-vercel-ip-longitude"));
    if (
        list.has("x-vercel-ip-latitude") &&
        Number.isFinite(lat) &&
        Number.isFinite(lon) &&
        Math.abs(lat) <= 90 &&
        Math.abs(lon) <= 180
    ) {
        const rawCity = list.get("x-vercel-ip-city");
        let city: string | null = null;
        try {
            city = rawCity ? decodeURIComponent(rawCity) : null;
        } catch {
            city = null;
        }
        return { lat, lon, city, source: "ip" };
    }
    return { ...DEFAULT_ORIGIN, city: null, source: "default" };
}
