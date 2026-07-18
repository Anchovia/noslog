/** @type {import('next').NextConfig} */
const nextConfig = {
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
                hostname: "imagedelivery.net",
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
