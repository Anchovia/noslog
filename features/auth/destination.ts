import type { MessageKey } from "@/lib/i18n/messages";
import { stripLocaleFromPath } from "@/lib/i18n/routing";

const destinations: Record<string, MessageKey> = {
    music: "header.music",
    rankings: "header.rankings",
    tiers: "header.tiers",
    bingo: "header.bingo",
    exams: "header.exams",
    arcades: "header.arcades",
    bookmarklet: "header.dataSync",
    settings: "settings.title",
    profile: "profile.fallbackTitle",
};

export function getAuthDestinationKey(path: string) {
    if (/^\/profile\/settings(?:\/|\?|$)/.test(stripLocaleFromPath(path)))
        return "settings.title";
    return destinations[stripLocaleFromPath(path).split(/[/?#]/)[1]];
}
