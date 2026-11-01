// 우리 공개 Blob 저장소 호스트 — 읽기 · 쓰기 토큰(vercel_blob_rw_<저장소 id>_<비밀>)의 저장소 id 로 만든다(@vercel/blob 의
// parseStoreIdFromReadWriteToken · constructBlobUrl 과 같은 규칙). BLOB_STORE_ID 를 쓰지 않는 것은, 그 값이 있으면 SDK 가
// Vercel 배포에서 토큰 대신 OIDC 인증으로 바꾸기 때문이다. URL 호스트는 소문자로 비교된다
const blobStoreId = process.env.BLOB_READ_WRITE_TOKEN?.trim()
    .split("_")[3]
    ?.toLowerCase();
const blobPublicHost = blobStoreId
    ? `${blobStoreId}.public.blob.vercel-storage.com`
    : null;

// 스크립트는 proxy 가 요청마다 nonce 로 강제한다. 여기 Report-Only 는 나머지 출처만 지켜보므로 script-src 는 다 받아 둔다
// (비우면 default-src 'self' 가 스크립트에 적용돼, nonce 가 붙은 Next 인라인 스크립트마다 위반 보고가 온다)
const contentSecurityPolicyReportOnly = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "script-src * 'unsafe-inline' 'unsafe-eval' blob: data:",
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: https://cdn.discordapp.com https://p.eagate.573.jp${blobPublicHost ? ` https://${blobPublicHost}` : ""} https://*.daumcdn.net https://*.kakaocdn.net https://pbs.twimg.com https://*.twimg.com`,
    "font-src 'self' data:",
    "connect-src 'self' https://dapi.kakao.com https://*.kakao.com https://*.kakaocdn.net https://*.daum.net",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "report-uri /api/csp-report",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ["127.0.0.1"],
    agentRules: false,
    poweredByHeader: false,
    // 공지 · 이벤트 본문은 편집기 미리보기(클라이언트)에서도 그린다. 토큰에서 뽑은 공개 호스트만 빌드 때 넣는다(비밀 부분은 넣지 않음)
    env: { BLOB_PUBLIC_HOST: blobPublicHost ?? "" },
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
            // 파트너 동의 화면은 다른 사이트 안에 끼워 넣지 못하게 CSP 로 강제(RFC 9700 §4.16, 2026-10-20) — 나머지는 Report-Only
            ...["/authorize", "/:locale(ko|ja|en)/authorize"].map((source) => ({
                source,
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "frame-ancestors 'none'",
                    },
                ],
            })),
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
                        // 위치는 이 사이트에서만(오락실 「내 주변」 · 내 위치 조준선, 2026-10-21) — 전부 막혀 있어 내 주변 찾기가 늘 실패했다
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=(self)",
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
            // Discord 프로필 사진(?size= 가 붙어 search 는 두지 않는다)
            ...["/avatars/**", "/embed/avatars/**"].map((pathname) => ({
                protocol: "https",
                hostname: "cdn.discordapp.com",
                pathname,
            })),
            // 자켓 대체 주소 일부는 http · 슬래시 두 개로 저장돼 있다
            ...["/game/**", "//game/**"].map((pathname) => ({
                hostname: "p.eagate.573.jp",
                pathname,
            })),
            ...(blobPublicHost
                ? [
                      {
                          protocol: "https",
                          hostname: blobPublicHost,
                          pathname: "/**",
                      },
                  ]
                : []),
            // 공식 X 글 사진(media)과 동영상 · GIF 미리보기 프레임
            ...[
                "/media/**",
                "/ext_tw_video_thumb/**",
                "/amplify_video_thumb/**",
                "/tweet_video_thumb/**",
            ].map((pathname) => ({
                protocol: "https",
                hostname: "pbs.twimg.com",
                pathname,
            })),
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
