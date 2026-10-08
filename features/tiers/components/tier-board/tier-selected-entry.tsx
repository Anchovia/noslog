"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteTierEntry } from "@/app/admin/tiers/actions";
import { createTierIdFormData } from "@/features/tiers/schemas/tier-admin-schema";
import { cn } from "@/lib/cn";

import type { TierEntryData } from "./tier-board-types";
import { getTierDifficultyColor } from "./tier-board-utils";

export default function TierSelectedEntry({ entry }: { entry: TierEntryData }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        startTransition(async () => {
            try {
                const result = await deleteTierEntry(
                    createTierIdFormData(entry.id)
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.refresh();
            } catch {
                toast.error("채보를 서열표에서 제거하지 못했습니다.");
            }
        });
    }

    return (
        <div className="mx-3 flex items-center gap-2 border-t border-divider py-2">
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">
                    {entry.chart.music.title}
                </p>
                <p
                    className={cn(
                        "text-caption font-semibold",
                        getTierDifficultyColor(entry.chart.difficulty)
                    )}
                >
                    {entry.chart.difficulty} Lv{entry.chart.level}
                </p>
            </div>
            <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                aria-label="채보 제거"
                title="채보 제거"
                className="flex size-9 cursor-pointer items-center justify-center rounded-md text-danger hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <Trash2 className="size-4" aria-hidden />
            </button>
        </div>
    );
}
