import { Check, Pencil, Trash2 } from "lucide-react";

import { deleteTierBand, updateTierBand } from "@/app/admin/tiers/actions";
import { formatTierValue, MAX_TIER_VALUE } from "@/lib/tiers";

import type { TierBandData } from "./tierBoardTypes";

// 상수 구간값 수정과 삭제 액션을 한곳에서 관리함
export default function TierBandHeader({ band }: { band: TierBandData }) {
    return (
        <header className="bg-surface-muted flex items-start gap-2 px-3 py-2">
            <details className="group min-w-0 flex-1">
                <summary
                    title="구간값 수정"
                    className="flex h-8 w-fit cursor-pointer list-none items-center gap-2"
                >
                    <strong className="text-body font-bold tabular-nums">
                        {formatTierValue(band.value)}
                    </strong>
                    <Pencil className="text-text-disabled group-open:text-text-primary size-3.5" />
                </summary>
                <form
                    action={updateTierBand}
                    className="mt-2 flex items-center gap-1"
                >
                    <input type="hidden" name="id" value={band.id} />
                    <input
                        name="value"
                        type="number"
                        min="1"
                        max={MAX_TIER_VALUE}
                        step="0.1"
                        required
                        defaultValue={band.value}
                        aria-label="서열표 구간값"
                        className="border-border bg-bg h-9 w-20 rounded-md border px-2 text-right font-bold tabular-nums"
                    />
                    <button
                        aria-label={`${band.value} 구간값 저장`}
                        title="구간값 저장"
                        className="border-border hover:bg-bg flex size-9 cursor-pointer items-center justify-center rounded-md border"
                    >
                        <Check className="size-4" />
                    </button>
                </form>
            </details>
            <span className="text-caption flex h-8 items-center">
                {band.entries.length}곡
            </span>
            <form action={deleteTierBand}>
                <input type="hidden" name="id" value={band.id} />
                <button
                    aria-label={`${band.value} 구간 삭제`}
                    title="구간 삭제"
                    className="text-danger hover:bg-danger/10 flex size-8 cursor-pointer items-center justify-center rounded-md"
                >
                    <Trash2 className="size-4" />
                </button>
            </form>
        </header>
    );
}
