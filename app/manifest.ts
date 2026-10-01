import type { MetadataRoute } from "next";

// 색 = 바탕 토큰 surface/canvas(#111), 아이콘 192 · 512 + maskable(2026-10-01 메타데이터 점검 E1 · E2).
// 로고 원은 지름 68% 라 maskable 안전 영역(지름 80%) 안에 들어가 512 를 그대로 maskable 로도 쓴다
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "NosLog",
        short_name: "NosLog",
        description: "NOSTALGIA 플레이 기록·랭킹·서열 아카이브",
        start_url: "/",
        display: "standalone",
        background_color: "#111111",
        theme_color: "#111111",
        lang: "ko",
        icons: [
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icon",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icon",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}
