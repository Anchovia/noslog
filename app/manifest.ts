import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "NosLog",
        short_name: "NosLog",
        description: "NOSTALGIA 플레이 기록·랭킹·서열 아카이브",
        start_url: "/",
        display: "standalone",
        background_color: "#0b0b10",
        theme_color: "#0b0b10",
        lang: "ko",
        icons: [
            {
                src: "/icon",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
