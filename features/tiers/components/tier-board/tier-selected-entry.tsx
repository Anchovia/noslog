"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteTierEntry } from "@/app/admin/tiers/actions";
import { foundationButtonClass } from "@/components/ui/button";
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
        <div className="mx-nl-12 flex items-center gap-nl-8 border-t-nl-stroke border-nl-divider py-nl-8">
            <div className="min-w-0 flex-1">
                <p className="nl-emphasis-label truncate">
                    {entry.chart.music.title}
                </p>
                <p
                    className={cn(
                        "nl-metadata text-nl-subdued",
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
                className={foundationButtonClass({
                    variant: "ghost",
                    size: "icon-sm",
                })}
            >
                <Trash2 className="nl-icon-small" aria-hidden />
            </button>
        </div>
    );
}
