const contentSecurityPolicyReportOnly = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "script-src 'self' https://dapi.kakao.com https://platform.twitter.com 'report-sample'",
    "style-src 'self' 'unsafe-inline' https://platform.twitter.com",
    "img-src 'self' data: blob: https://cdn.discordapp.com https://p.eagate.573.jp https://*.public.blob.vercel-storage.com https://*.daumcdn.net https://*.kakaocdn.net https://pbs.twimg.com https://*.twimg.com",
    "font-src 'self' data:",
    "connect-src 'self' https://dapi.kakao.com https://*.kakao.com https://*.daum.net https://platform.twitter.com https://syndication.twitter.com",
    "frame-src https://platform.twitter.com https://syndication.twitter.com",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        staleTimes: {
            dynamic: 300,
        },
    },
    async headers() {
        return [
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
            /*
            {
                hostname: "cdn44.atwikiimg.com",
            },
            {
                hostname: "pbs.twimg.com",
            },
            {
                hostname: "remywiki.com",
            },
            */
        ],
    },
};

export default nextConfig;
