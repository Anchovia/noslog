"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition, type FormEvent } from "react";
import { toast } from "sonner";

import { deleteTierBand, updateTierBand } from "@/app/admin/tiers/actions";
import {
    createTierBandFormData,
    createTierIdFormData,
} from "@/features/tiers/schemas/tierAdminSchema";
import { formatTierValue, MAX_TIER_VALUE } from "@/lib/tiers";

import type { TierBandData } from "./tierBoardTypes";

export default function TierBandHeader({ band }: { band: TierBandData }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleUpdate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const value = Number(new FormData(event.currentTarget).get("value"));

        startTransition(async () => {
            try {
                const result = await updateTierBand(
                    createTierBandFormData({ id: band.id, value })
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.refresh();
            } catch {
                toast.error("서열 상수 구간을 저장하지 못했습니다.");
            }
        });
    }

    function handleDelete() {
        startTransition(async () => {
            try {
                const result = await deleteTierBand(
                    createTierIdFormData(band.id)
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.refresh();
            } catch {
                toast.error("서열 상수 구간을 삭제하지 못했습니다.");
            }
        });
    }

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
                    noValidate
                    onSubmit={handleUpdate}
                    className="mt-2 flex items-center gap-1"
                >
                    <input
                        name="value"
                        type="number"
                        min="1"
                        max={MAX_TIER_VALUE}
                        step="0.1"
                        required
                        defaultValue={band.value}
                        aria-label="서열표 구간값"
                        className="border-border bg-bg text-input h-11 w-24 rounded-md border px-2 text-right font-bold tabular-nums"
                    />
                    <button
                        type="submit"
                        disabled={isPending}
                        aria-label={`${band.value} 구간값 저장`}
                        title="구간값 저장"
                        className="border-border hover:bg-bg flex size-11 items-center justify-center rounded-md border disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Check className="size-4" aria-hidden />
                    </button>
                </form>
            </details>
            <span className="text-caption flex h-8 items-center">
                {band.entries.length}곡
            </span>
            <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                aria-label={`${band.value} 구간 삭제`}
                title="구간 삭제"
                className="text-danger hover:bg-danger/10 flex size-8 cursor-pointer items-center justify-center rounded-md disabled:cursor-not-allowed disabled:opacity-50"
            >
                <Trash2 className="size-4" aria-hidden />
            </button>
        </header>
    );
}
