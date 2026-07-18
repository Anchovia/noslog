import type { UserRankingMode, UserRankingRow } from "@/lib/rankings";
import RankingRow from "./userRankingRow";

interface UserRankingListProps {
    mode: UserRankingMode;
    rows: UserRankingRow[];
}

export default function UserRankingList({ mode, rows }: UserRankingListProps) {
    return (
        <section className="bg-surface rounded-card overflow-hidden">
            {rows.length > 0 ? (
                <ol>
                    {rows.map((row) => (
                        <RankingRow key={row.id} mode={mode} row={row} />
                    ))}
                </ol>
            ) : (
                <div className="text-text-disabled flex h-32 items-center justify-center text-sm">
                    선택한 조건의 랭킹 기록이 없습니다.
                </div>
            )}
        </section>
    );
}
