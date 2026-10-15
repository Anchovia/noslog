const contentSecurityPolicyReportOnly = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "script-src 'self' https://dapi.kakao.com 'report-sample'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://cdn.discordapp.com https://p.eagate.573.jp https://*.public.blob.vercel-storage.com https://*.daumcdn.net https://*.kakaocdn.net https://pbs.twimg.com https://*.twimg.com",
    "font-src 'self' data:",
    "connect-src 'self' https://dapi.kakao.com https://*.kakao.com https://*.daum.net",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ["127.0.0.1"],
    agentRules: false,
    outputFileTracingIncludes: {
        "/profile/*/card": ["./assets/fonts/pretendard-jp/1.3.9/*.ttf"],
    },
    experimental: {
        staleTimes: {
            dynamic: 3600,
        },
    },
    async headers() {
        return [
            // 버전이 박힌 글꼴은 내용이 바뀌지 않는다 — 1년 · immutable(2026-10-15 S12)
            {
                source: "/fonts/pretendard-jp/1.3.9/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            // 자켓 · 국기 · 아이콘 등 public 이미지 — 같은 이름으로 바뀔 수 있어 하루 + 뒤에서 갱신(문서를 열 때마다 304 재검증하지 않게)
            ...[
                "bg",
                "brand",
                "flag",
                "flags",
                "grade",
                "icon",
                "icons",
                "images",
            ].map((folder) => ({
                source: `/${folder}/:path*`,
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=86400, stale-while-revalidate=604800",
                    },
                ],
            })),
            {
                source: "/fonts/pretendard-jp/1.3.9/PretendardJPVariable.woff2",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "https://p.eagate.573.jp",
                    },
                ],
            },
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    { key: "X-Frame-Options", value: "DENY" },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=31536000; includeSubDomains",
                    },
                    {
                        key: "Content-Security-Policy-Report-Only",
                        value: contentSecurityPolicyReportOnly,
                    },
                ],
            },
        ];
    },
    images: {
        // 원본 주소가 내용마다 바뀐다(Blob 무작위 접미사 · Discord · X 해시) — 최적화 결과를 31일 둔다(기본 4시간, 2026-10-15 S12)
        minimumCacheTTL: 2678400,
        remotePatterns: [
            {
                hostname: "cdn.discordapp.com",
            },

            {
                hostname: "p.eagate.573.jp",
            },
            {
                hostname: "*.public.blob.vercel-storage.com",
            },
            {
                hostname: "pbs.twimg.com",
            },
            /*
            {
                hostname: "cdn44.atwikiimg.com",
            },
            {
                hostname: "remywiki.com",
            },
            */
        ],
    },
};

export default nextConfig;
