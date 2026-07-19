import type { MusicRecordFilter as MusicRecordFilterValue } from "@/app/(nevigation)/music/query";
import { cn } from "@/lib/utils";
import Link from "next/link";

const filters: { value: MusicRecordFilterValue; label: string }[] = [
    { value: "s", label: "S" },
    { value: "fc", label: "FC" },
    { value: "pianist", label: "Pianist" },
    { value: "unplayed", label: "미플레이" },
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
            <div className="flex flex-wrap gap-2">
                {filters.map((filter) => {
                    const active = selected.includes(filter.value);
                    return (
                        <button
                            key={filter.value}
                            type="button"
                            disabled={!isLoggedIn}
                            onClick={() => onToggle(filter.value)}
                            className={cn(
                                "border-border bg-surface text-text-secondary hover:bg-surface-muted rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                                active && "border-chart bg-chart/15 text-chart"
                            )}
                        >
                            {filter.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
