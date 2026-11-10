"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { deleteTierEntry } from "@/app/admin/tiers/actions";
import { foundationButtonClass } from "@/components/ui/button";
import { createTierIdFormData } from "@/features/tiers/schemas/tier-admin-schema";
import { cn } from "@/lib/cn";
import useActionToast from "@/lib/hooks/use-action-toast";

import type { TierEntryData } from "./tier-board-types";
import { getTierDifficultyColor } from "./tier-board-utils";

export default function TierSelectedEntry({ entry }: { entry: TierEntryData }) {
    const router = useRouter();
    const { isPending, run } = useActionToast();

    function handleDelete() {
        run(() => deleteTierEntry(createTierIdFormData(entry.id)), {
            errorMessage: "채보를 서열표에서 제거하지 못했습니다.",
            onSuccess: () => {
                router.refresh();
            },
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
