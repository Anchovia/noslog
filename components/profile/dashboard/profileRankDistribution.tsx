import { ChevronDown } from "lucide-react";

import { cn, formatToComma } from "@/lib/utils";
import { useTranslations } from "@/components/i18n/localeProvider";

import type { ProfileRankRow } from "./profileTypes";
import {
    PROFILE_RANK_COLORS,
    PROFILE_RANK_ICON_BASE_URL,
    PROFILE_RANK_ICON_NAMES,
} from "./profileUtils";

interface ProfileRankDistributionProps {
    rows: ProfileRankRow[];
    playCount: number | null;
    isPlayCountPrivate: boolean;
    expanded: boolean;
    onToggle: () => void;
}

// 랭크별 플레이 분포와 확장 상태를 한곳에서 표시함
export default function ProfileRankDistribution({
    rows,
    playCount,
    isPlayCountPrivate,
    expanded,
    onToggle,
}: ProfileRankDistributionProps) {
    const t = useTranslations();
    const maxCount = Math.max(...rows.map((row) => row.value), 1);

    return (
        <section className="bg-surface rounded-card p-4">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-section font-bold">
                    {t("profile.rankDistribution")}
                </h2>
                <button
                    type="button"
                    onClick={onToggle}
                    className="text-caption hover:bg-surface-muted hover:text-text-primary focus-visible:ring-focus/40 flex cursor-pointer items-center gap-1 rounded px-1.5 py-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                    {expanded ? t("profile.collapse") : t("profile.all")}
                    <ChevronDown
                        size={13}
                        className={cn(
                            "transition-transform",
                            expanded && "rotate-180"
                        )}
                    />
                </button>
            </div>
            <div className="space-y-2.5">
                {rows.slice(0, expanded ? rows.length : 5).map((row, index) => (
                    <div
                        key={row.label}
                        className="grid grid-cols-[20px_1fr_34px] items-center gap-2"
                    >
                        <span
                            className="size-5 bg-contain bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url(${PROFILE_RANK_ICON_BASE_URL}/grade_${PROFILE_RANK_ICON_NAMES[index]}.png)`,
                            }}
                            role="img"
                            aria-label={t("profile.rankAria", {
                                rank: row.label,
                            })}
                        />
                        <span className="bg-divider h-1.5 overflow-hidden rounded-full">
                            <span
                                className={cn(
                                    "block h-full rounded-full",
                                    PROFILE_RANK_COLORS[index]
                                )}
                                style={{
                                    width: `${(row.value / maxCount) * 100}%`,
                                }}
                            />
                        </span>
                        <span className="text-caption text-right tabular-nums">
                            {formatToComma(row.value)}
                        </span>
                    </div>
                ))}
            </div>
            <p className="text-caption mt-3">
                {isPlayCountPrivate
                    ? t("profile.playCountPrivate")
                    : t("profile.playCount", {
                          count: formatToComma(playCount),
                      })}
            </p>
        </section>
    );
}
