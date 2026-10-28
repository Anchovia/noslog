"use client";

import { useTranslations } from "@/components/i18n/locale-provider";
import BarList from "@/components/ui/bar-list";
import type { CommunityData } from "@/features/music/schemas/community-schema";

/** 서열 투표 분포 = 막대 목록 — 나온 값마다 한 줄(낮은 값부터), 막대 길이 = 그 값의 표 수. 한 눈금이라 넘김이 없다 */
export default function TierVoteDistribution({
    scope,
}: {
    scope: CommunityData["scopes"][number];
}) {
    const t = useTranslations();
    const values = scope.distribution;
    const max = Math.max(1, ...values.map((entry) => entry.count));
    const name =
        scope.mode === "basic"
            ? `Basic ${t(`community.goal.${scope.goal}`)}`
            : "Recital";
    const label = t("community.distribution", { scope: name });
    return (
        <section className="nl-vote-distribution" aria-label={label}>
            <BarList
                label={label}
                max={max}
                rows={values.map((entry) => ({
                    key: String(entry.value),
                    label: entry.value.toFixed(1),
                    value: entry.count,
                    display: entry.count,
                }))}
            />
        </section>
    );
}
