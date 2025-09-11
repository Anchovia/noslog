/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "k.kakaocdn.net",
            },

            {
                hostname: "p.eagate.573.jp",
            },
            {
                hostname: "imagedelivery.net",
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
