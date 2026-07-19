import type { MetadataRoute } from "next";

const appUrl = process.env.APP_URL?.trim() || "https://noslog.app";

const routes = ["", "/music", "/rankings", "/tiers", "/bingo", "/exams"];

export default function sitemap(): MetadataRoute.Sitemap {
    return routes.map((route) => ({
        url: `${appUrl}${route}`,
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1 : 0.8,
    }));
}
