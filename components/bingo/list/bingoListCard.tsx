import { getBingoJacketUrl } from "@/lib/bingo";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import { cn } from "@/lib/utils";
import Link from "next/link";

import type { BingoListItem } from "./bingoListTypes";
import BingoMiniBoard from "./bingoMiniBoard";

interface BingoListCardProps {
    bingo: BingoListItem;
}

// 빙고판의 진행률, 보상과 축소 보드를 목록 카드로 표시함
export default function BingoListCard({ bingo }: BingoListCardProps) {
    const t = useTranslations();
    const localizedHref = useLocalizedHref();
    return (
        <Link
            href={localizedHref(`/bingo/${bingo.id}`)}
            className="bg-surface rounded-card hover:bg-surface-muted overflow-hidden transition-colors"
        >
            <div
                className="bg-surface-muted relative aspect-square bg-cover bg-center"
                style={{
                    backgroundImage: `url(${getBingoJacketUrl(bingo.musicIndex, bingo.background)})`,
                }}
            >
                <div className="absolute top-2 right-2">
                    <BingoMiniBoard
                        completedPositions={bingo.completedPositions}
                        richPositions={bingo.richPositions}
                    />
                </div>
                {bingo.richLines > 0 && !bingo.isCompleted ? (
                    <span className="bg-score text-bg absolute top-2 left-2 rounded px-1.5 py-0.5 text-xs font-extrabold">
                        {t("bingo.chance", { count: bingo.richLines })}
                    </span>
                ) : null}
            </div>
            <div className="p-2.5">
                {bingo.localizedTitle ? (
                    <p className="text-micro truncate">
                        {bingo.localizedTitle}
                    </p>
                ) : null}
                <p className="text-body truncate font-bold">{bingo.title}</p>
                <div className="bg-surface-muted mt-2 h-1 overflow-hidden rounded-full">
                    <div
                        className={cn(
                            "h-full rounded-full",
                            bingo.isCompleted ? "bg-score" : "bg-chart"
                        )}
                        style={{ width: `${bingo.progressPercent}%` }}
                    />
                </div>
                <div className="text-caption mt-2 flex justify-between gap-2">
                    <span>
                        {t("bingo.progress", {
                            lines: bingo.completedLines,
                            required: bingo.requiredLines,
                            cells: bingo.completedCells,
                        })}
                    </span>
                    <span className="text-score shrink-0">
                        {bingo.reward}nos
                    </span>
                </div>
            </div>
        </Link>
    );
}
