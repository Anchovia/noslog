import { getBingoJacketUrl } from "@/lib/bingo";
import { formatToComma } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import type { BingoListItem } from "./bingoListTypes";

interface ContinueBingoCardProps {
    bingo: BingoListItem;
}

// 사용자가 가장 최근에 변경한 빙고를 이어서 진행 카드로 표시함
export default function ContinueBingoCard({ bingo }: ContinueBingoCardProps) {
    return (
        <Link
            href={`/bingo/${bingo.id}`}
            className="border-border bg-surface rounded-card hover:bg-surface-muted flex items-center gap-3 border p-3 transition-colors"
        >
            <div
                className="bg-surface-muted size-14 shrink-0 rounded-md bg-cover bg-center"
                style={{
                    backgroundImage: `url(${getBingoJacketUrl(bingo.musicIndex, bingo.background)})`,
                }}
            />
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-caption">이어서 진행</span>
                    {bingo.richLines > 0 ? (
                        <span className="bg-score text-bg rounded px-1.5 py-0.5 text-xs font-extrabold">
                            빙고 찬스 {bingo.richLines}
                        </span>
                    ) : null}
                </div>
                <p className="text-body mt-1 truncate font-bold">
                    {bingo.title}
                </p>
                <p className="text-caption mt-1">
                    줄 {bingo.completedLines}/{bingo.requiredLines} · 칸{" "}
                    {bingo.completedCells}/25 · {formatToComma(bingo.reward)}nos
                </p>
            </div>
            <ChevronRight className="text-text-disabled size-5 shrink-0" />
        </Link>
    );
}
