"use client";

import type { AchievementSummary } from "@/features/achievements/achievementDefinitions";
import AchievementInfoBadge from "@/features/achievements/components/achievementInfoBadge";

/**
 * 프로필 머리 진열(2026-09-24 P5 · B1, 2026-09-25 개수 글자 삭제) — 명판 · 기여 라벨 뒤에 고른 업적(없으면 자동) 3개.
 * 배지마다 올리거나 누르면 osu! 메달 창 같은 정보 카드(M1, `AchievementInfoBadge`).
 * 업적 페이지 입구는 프로필 「업적」 구역의 「모두 보기」. 얻은 업적이 없으면 그리지 않는다.
 */
export default function AchievementShowcase({
    summary,
}: {
    userId: number;
    summary: AchievementSummary;
    isOwner: boolean;
}) {
    if (!summary.showcase.length) return null;
    return (
        <span className="nl-achievement-showcase">
            {summary.showcase.map((item) => (
                <AchievementInfoBadge
                    key={item.key}
                    achievementKey={item.key}
                    tier={item.tier}
                    achievedAt={item.achievedAt}
                    recipients={item.recipients}
                    size="inline"
                />
            ))}
        </span>
    );
}
