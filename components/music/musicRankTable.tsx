import { formatToGrade } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { RankingMode } from "./musicDetail";

interface RankingRow {
    rank: string;
    score: number;
    max_combo: number;
    besttime: string;
    user_id: number;
    user: { username: string | null; id: number };
    grade_basic?: number;
    grade_recital?: number;
}

interface MusicRankTableProps {
    musicIndex: string;
    difficulty: string;
    mode: RankingMode;
    basicPlayDatas: RankingRow[];
    recitalPlayDatas: RankingRow[];
}

export default function MusicRankTable({
    musicIndex,
    difficulty,
    mode,
    basicPlayDatas,
    recitalPlayDatas,
}: MusicRankTableProps) {
    const rows = mode === "recital" ? recitalPlayDatas : basicPlayDatas;

    return (
        <section className="bg-surface rounded-card overflow-hidden">
            <header className="bg-surface-muted flex items-center justify-between p-3">
                <h2 className="text-section">랭킹</h2>
                <div className="border-border rounded-card flex overflow-hidden border">
                    {(["basic", "recital"] as RankingMode[]).map((item) => (
                        <Link
                            key={item}
                            href={`/music/${musicIndex}/${difficulty}?tab=ranking&mode=${item}`}
                            className={cn(
                                "px-3 py-1.5 text-xs font-semibold capitalize",
                                mode === item
                                    ? "bg-border text-text-primary"
                                    : "text-text-secondary"
                            )}
                        >
                            {item}
                        </Link>
                    ))}
                </div>
            </header>

            <ol>
                {rows.map((row, index) => {
                    const grade =
                        mode === "recital"
                            ? row.grade_recital
                            : row.grade_basic;

                    return (
                        <li
                            key={row.user_id}
                            className="border-divider grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2 border-t px-3 py-3"
                        >
                            <span className="text-text-secondary text-center text-sm font-bold tabular-nums">
                                {index + 1}
                            </span>
                            <div className="min-w-0">
                                <Link
                                    href={`/profile/${row.user.id}`}
                                    className="text-text-primary block truncate text-sm font-semibold"
                                >
                                    {row.user.username || "이름 없는 유저"}
                                </Link>
                                <span className="text-caption">
                                    {row.rank} · Combo{" "}
                                    {row.max_combo.toLocaleString("ko-KR")}
                                </span>
                            </div>
                            <div className="text-right">
                                <strong className="text-text-primary block text-sm tabular-nums">
                                    {row.score.toLocaleString("ko-KR")}
                                </strong>
                                <span className="text-caption tabular-nums">
                                    Grd {formatToGrade(grade ?? 0)}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}
