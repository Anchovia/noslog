"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useTransition } from "react";
import { toast } from "sonner";

import { deleteTierBand, updateTierBand } from "@/app/admin/tiers/actions";
import { foundationButtonClass } from "@/components/ui/button";
import {
    createTierBandFormData,
    createTierIdFormData,
} from "@/features/tiers/schemas/tier-admin-schema";
import { formatTierValue, MAX_TIER_VALUE } from "@/lib/tiers";

import type { TierBandData } from "./tier-board-types";

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
        <header className="flex items-start gap-nl-8 bg-nl-raised px-nl-12 py-nl-8">
            <details className="group min-w-0 flex-1">
                <summary
                    title="구간값 수정"
                    className="flex h-nl-32 w-fit cursor-pointer list-none items-center gap-nl-8"
                >
                    <strong className="nl-metric-value text-nl-content">
                        {formatTierValue(band.value)}
                    </strong>
                    <Pencil className="nl-icon-small text-nl-disabled group-open:text-nl-content" />
                </summary>
                <form
                    noValidate
                    onSubmit={handleUpdate}
                    className="mt-nl-8 flex items-center gap-nl-4"
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
                        className="nl-input nl-admin-number-input"
                    />
                    <button
                        type="submit"
                        disabled={isPending}
                        aria-label={`${band.value} 구간값 저장`}
                        title="구간값 저장"
                        className={foundationButtonClass({
                            variant: "secondary",
                            size: "icon",
                        })}
                    >
                        <Check className="nl-icon-small" aria-hidden />
                    </button>
                </form>
            </details>
            <span className="nl-metadata flex h-nl-32 items-center text-nl-subdued">
                {band.entries.length}곡
            </span>
            <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                aria-label={`${band.value} 구간 삭제`}
                title="구간 삭제"
                className={foundationButtonClass({
                    variant: "ghost",
                    size: "icon-sm",
                })}
            >
                <Trash2 className="nl-icon-small" aria-hidden />
            </button>
        </header>
    );
}
