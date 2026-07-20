import { SITE_URL } from "@/lib/metadata/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin/",
                "/api/",
                "/discord/",
                "/login",
                "/onboarding",
                "/profile/settings",
            ],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
