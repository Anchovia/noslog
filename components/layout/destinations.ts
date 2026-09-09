import {
    GraduationCap,
    Grid3X3,
    Layers,
    ListMusic,
    MapPin,
    Music,
    RefreshCw,
    Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { MessageKey } from "@/lib/i18n/messages";

export const productDestinations = [
    { href: "/music", labelKey: "shell.music", icon: Music },
    { href: "/music?scope=chart", labelKey: "shell.charts", icon: ListMusic },
    { href: "/rankings", labelKey: "shell.rankings", icon: Trophy },
    { href: "/tiers", labelKey: "shell.tiers", icon: Layers },
    { href: "/bingo", labelKey: "shell.bingo", icon: Grid3X3 },
    { href: "/exams", labelKey: "shell.exams", icon: GraduationCap },
    { href: "/gamecenter", labelKey: "shell.arcades", icon: MapPin },
    { href: "/bookmarklet", labelKey: "shell.dataSync", icon: RefreshCw },
] satisfies { href: string; labelKey: MessageKey; icon: LucideIcon }[];

export function isDestinationActive(
    pathname: string,
    chartScope: boolean,
    href: string
) {
    if (href.startsWith("/music")) {
        return (
            (pathname === "/music" || pathname.startsWith("/music/")) &&
            chartScope === href.includes("scope=chart")
        );
    }
    return pathname === href || pathname.startsWith(`${href}/`);
}
