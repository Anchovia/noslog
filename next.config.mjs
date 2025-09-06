/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "k.kakaocdn.net",
            },
        ],
    },
};

export default nextConfig;
