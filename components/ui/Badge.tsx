import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

// 공통 배지 스타일과 variant를 한곳에서 관리함
const badgeVariants = cva(
    "inline-flex h-6 items-center rounded-card px-2 text-badge",
    {
        variants: {
            variant: {
                default: "bg-surface-muted text-text-secondary",
                outline: "border border-border text-text-secondary",

                success: "bg-success/15 text-success",
                danger: "bg-danger/15 text-danger",
                score: "bg-score/15 text-score",
                bronze: "bg-bronze/15 text-bronze",

                normal: "bg-normal/15 text-normal",
                hard: "bg-hard/15 text-hard",
                expert: "bg-expert/15 text-expert",
                real: "bg-real/15 text-real",

                basic: "bg-basic/15 text-basic",
                recital: "bg-recital/15 text-recital",

                rankFc: "bg-rank-fc/15 text-rank-fc",
                rankS: "bg-rank-s/15 text-rank-s",
                rankAPlus: "bg-rank-a-plus/15 text-rank-a-plus",
                rankA: "bg-rank-a/15 text-rank-a",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

interface BadgeProps
    extends
        HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof badgeVariants> {}

export default function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <span
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}

export { badgeVariants };
