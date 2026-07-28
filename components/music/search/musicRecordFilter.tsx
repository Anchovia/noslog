import type { MusicRecordFilter as MusicRecordFilterValue } from "@/app/(nevigation)/music/query";
import { cn } from "@/lib/utils";
import Link from "next/link";

const filterGroups: {
    label: string;
    filters: { value: MusicRecordFilterValue; label: string }[];
}[] = [
    {
        label: "상태",
        filters: [
            { value: "clear", label: "클리어" },
            { value: "unplayed", label: "미플레이" },
            { value: "s", label: "S" },
            { value: "fc", label: "FC" },
            { value: "pianist", label: "Pianist" },
        ],
    },
    {
        label: "판정",
        filters: [
            { value: "recent", label: "최근 30일" },
            { value: "miss-near", label: "Miss/Near 5%+" },
            { value: "sjust-low", label: "S-Just 85% 미만" },
            { value: "fast", label: "최근 FAST" },
            { value: "slow", label: "최근 SLOW" },
        ],
    },
    {
        label: "약한 음표",
        filters: [
            { value: "standard-low", label: "일반" },
            { value: "tenuto-low", label: "테누토" },
            { value: "glissando-low", label: "글리산도" },
            { value: "trill-low", label: "트릴" },
        ],
    },
];

interface MusicRecordFilterProps {
    selected: MusicRecordFilterValue[];
    isLoggedIn: boolean;
    onToggle: (value: MusicRecordFilterValue) => void;
}

export default function MusicRecordFilter({
    selected,
    isLoggedIn,
    onToggle,
}: MusicRecordFilterProps) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <h3 className="text-label">내 기록</h3>
                {!isLoggedIn ? (
                    <Link
                        href="/login"
                        className="text-caption hover:text-text-primary underline"
                    >
                        로그인 후 이용
                    </Link>
                ) : null}
            </div>
            <div className="flex flex-col gap-3">
                {filterGroups.map((group) => (
                    <div key={group.label}>
                        <p className="text-micro text-text-disabled mb-1.5">
                            {group.label}
                            {group.label === "약한 음표" ? " · 90% 미만" : ""}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {group.filters.map((filter) => {
                                const active = selected.includes(filter.value);
                                return (
                                    <button
                                        key={filter.value}
                                        type="button"
                                        disabled={!isLoggedIn}
                                        onClick={() => onToggle(filter.value)}
                                        className={cn(
                                            "border-border bg-surface text-text-secondary hover:bg-surface-muted rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                                            active &&
                                                "border-chart bg-chart/15 text-chart"
                                        )}
                                    >
                                        {filter.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            {isLoggedIn ? (
                <p className="text-micro text-text-disabled mt-2">
                    여러 조건은 하나라도 해당하면 표시합니다.
                </p>
            ) : null}
        </div>
    );
}
