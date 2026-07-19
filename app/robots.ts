import type { MetadataRoute } from "next";

const appUrl = process.env.APP_URL?.trim() || "https://noslog.app";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin/", "/api/", "/profile/settings", "/onboarding"],
        },
        sitemap: `${appUrl}/sitemap.xml`,
        host: appUrl,
    };
}
