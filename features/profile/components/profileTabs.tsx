"use client";

import { usePathname, useSearchParams } from "next/navigation";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import AreaTabLinks from "@/components/ui/areaTabLinks";

/**
 * 프로필 구역 탭(2026-09-25 D2) — 탭마다 주소가 다르고, 고른 모드(`?mode=recital`)를 그대로 넘긴다.
 * 점수 비공개 프로필을 남이 보면 점수로 만든 탭(기록 · 통계)은 두지 않고, 「플레이 활동 비공개」 면 활동 탭을 두지 않는다(2026-09-26)
 */
const PROFILE_TABS = [
    { key: "overview", path: "", hiddenBy: null },
    { key: "records", path: "/records", hiddenBy: "scores" },
    { key: "stats", path: "/stats", hiddenBy: "scores" },
    { key: "achievements", path: "/achievements", hiddenBy: null },
    { key: "activity", path: "/activity", hiddenBy: "activity" },
] as const;

export default function ProfileTabs({
    userId,
    scoresHidden,
    activityHidden,
}: {
    userId: number;
    scoresHidden: boolean;
    activityHidden: boolean;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const pathname = usePathname();
    const params = useSearchParams();
    const mode = params.get("mode") === "recital" ? "?mode=recital" : "";
    const base = `/profile/${userId}`;
    const current = PROFILE_TABS.find(
        (tab) => tab.path && pathname.endsWith(`${base}${tab.path}`)
    );
    return (
        <AreaTabLinks
            label={t("profile.tabs.label")}
            options={PROFILE_TABS.filter(
                (tab) =>
                    !(
                        (tab.hiddenBy === "scores" && scoresHidden) ||
                        (tab.hiddenBy === "activity" && activityHidden)
                    )
            ).map((tab) => ({
                key: tab.key,
                label: t(`profile.tabs.${tab.key}`),
                href: href(`${base}${tab.path}${mode}`),
                selected: (current?.key ?? "overview") === tab.key,
            }))}
        />
    );
}
