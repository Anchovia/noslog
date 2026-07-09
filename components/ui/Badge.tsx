import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

// 공통 배지 스타일과 variant를 한곳에서 관리함
const badgeVariants = cva(
    "inline-flex h-6 items-center rounded-card px-2 text-xs font-medium",
    {
        variants: {
            variant: {
                default: "bg-surface-muted text-text-secondary",
                outline: "border border-border text-text-secondary",
                normal: "bg-normal/15 text-normal",
                hard: "bg-hard/15 text-hard",
                expert: "bg-expert/15 text-expert",
                real: "bg-real/15 text-real",
                success: "bg-normal text-bg",
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
