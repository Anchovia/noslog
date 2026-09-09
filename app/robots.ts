import { SITE_URL } from "@/lib/metadata/site";
import { SUPPORTED_LOCALES } from "@/lib/i18n/routing";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "SemrushBot",
                disallow: "/",
            },
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/admin/",
                    "/api/",
                    "/discord/",
                    "/login",
                    "/onboarding",
                    "/profile/settings",
                    ...SUPPORTED_LOCALES.flatMap((locale) => [
                        `/${locale}/login`,
                        `/${locale}/onboarding`,
                        `/${locale}/profile/settings`,
                    ]),
                ],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
