import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

// 관리자용 배지 = 공용 태그(nl-tag) 그대로(2026-10-15 B5 2단계). 상태는 같은 면에 글자만 알림 표시색, 모드는 색 없음
const badgeVariants = cva("nl-tag", {
    variants: {
        variant: {
            default: "",
            outline: "",
            success: "nl-tag--status",
            danger: "nl-tag--status",
            score: "nl-tag--status",
            basic: "",
            recital: "",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

const tones = {
    success: "success",
    danger: "danger",
    score: "warning",
} as const;

interface BadgeProps
    extends
        HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof badgeVariants> {}

export default function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <span
            className={cn(badgeVariants({ variant }), className)}
            data-tone={
                variant && variant in tones
                    ? tones[variant as keyof typeof tones]
                    : undefined
            }
            {...props}
        />
    );
}
