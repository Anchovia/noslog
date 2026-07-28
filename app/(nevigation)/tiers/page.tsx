import Link from "next/link";

import TierBandBrowser from "@/components/tiers/tierBandBrowser";
import TierControls from "@/components/tiers/tierControls";
import TierRatingWeightChart from "@/components/tiers/tierRatingWeightChart";
import { createPageMetadata } from "@/lib/metadata/site";
import {
    formatTierDate,
    isTierDifficulty,
    isTierGoal,
    isTierLevelFilter,
    isTierMode,
    tierGoalLabels,
    type TierDifficulty,
    type TierGoal,
    type TierMode,
} from "@/lib/tiers";
import { getUser } from "@/lib/user";
import {
    getCachedBasicTierWeightTheoreticalMax,
    getCachedGoalTierOverview,
    getTierBandForUser,
} from "./data";

export const metadata = createPageMetadata({
    title: "악곡 서열표",
    description:
        "노스텔지어 Basic·Recital의 S·Full Combo·Pianist 목표별 통합 서열표를 확인합니다.",
    path: "/tiers",
});

interface TiersPageProps {
    searchParams: Promise<{
        mode?: string | string[];
        goal?: string | string[];
        difficulty?: string | string[];
        level?: string | string[];
    }>;
}

function firstParam(value?: string | string[]) {
    return Array.isArray(value) ? value[0] : value;
}

function splitParam(value?: string | string[]) {
    return (firstParam(value) ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

export default async function TiersPage({ searchParams }: TiersPageProps) {
    const query = await searchParams;
    const requestedMode = firstParam(query.mode) ?? "basic";
    const requestedGoal = firstParam(query.goal) ?? "s";
    const mode: TierMode = isTierMode(requestedMode) ? requestedMode : "basic";
    const goal: TierGoal = isTierGoal(requestedGoal) ? requestedGoal : "s";
    const difficulties = splitParam(query.difficulty).filter(
        isTierDifficulty
    ) as TierDifficulty[];
    const levels = splitParam(query.level).filter(isTierLevelFilter);
    const [user, tierList] = await Promise.all([
        getUser(),
        getCachedGoalTierOverview(mode, goal, difficulties, levels),
    ]);
    const showRatingWeight = mode === "basic" && Boolean(tierList);
    const [initialBand, ratingTheoreticalMax] = tierList
        ? await Promise.all([
              tierList.bands[0]
                  ? getTierBandForUser(
                        tierList.slug,
                        tierList.bands[0].id,
                        user?.id,
                        difficulties,
                        levels
                    )
                  : Promise.resolve(null),
              showRatingWeight
                  ? getCachedBasicTierWeightTheoreticalMax(tierList.id)
                  : Promise.resolve(null),
          ])
        : [null, null];
    const filterKey = `${mode}:${goal}:${difficulties.join(",")}:${levels.join(",")}`;

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-title">서열표</h1>
                {user?.role === "admin" && tierList ? (
                    <Link
                        href={`/admin/tiers/${tierList.id}`}
                        className="text-caption hover:text-text-primary"
                    >
                        현재 서열표 편집
                    </Link>
                ) : null}
            </div>

            <TierControls
                key={filterKey}
                mode={mode}
                goal={goal}
                difficulties={difficulties}
                levels={levels}
            />

            {tierList ? (
                <>
                    <details className="bg-surface rounded-card group px-3 py-3">
                        <summary className="text-body cursor-pointer list-none font-semibold">
                            {tierGoalLabels[goal]} 서열표 안내
                        </summary>
                        <div className="border-divider text-body-muted mt-3 flex flex-col gap-2 border-t pt-3">
                            {ratingTheoreticalMax ? (
                                <TierRatingWeightChart
                                    theoreticalMax={ratingTheoreticalMax}
                                    goal={goal}
                                />
                            ) : null}
                            <p>{tierList.description}</p>
                            <p>
                                난이도와 공식 레벨은 채보를 찾기 위한 필터이며,
                                서열 배치는 목표별로 독립적으로 관리됩니다.
                            </p>
                            <p className="text-caption">
                                업데이트 {formatTierDate(tierList.updatedAt)}
                            </p>
                        </div>
                    </details>

                    <TierBandBrowser
                        key={filterKey}
                        slug={tierList.slug}
                        bands={tierList.bands}
                        initialBand={initialBand}
                        goal={goal}
                        difficulties={difficulties}
                        levels={levels}
                        showRecords={Boolean(user)}
                    />
                </>
            ) : (
                <div className="bg-surface text-text-disabled rounded-card flex min-h-32 items-center justify-center px-4 text-center text-sm">
                    선택한 목표의 공개 서열표가 없습니다.
                </div>
            )}
        </div>
    );
}
