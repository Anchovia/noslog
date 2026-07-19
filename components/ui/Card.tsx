import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

// 공통 카드 스타일을 한곳에서 관리함
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <section
            className={cn(
                "rounded-card border-border bg-surface border p-4",
                className
            )}
            {...props}
        />
    );
}

// 카드 상단 제목/액션 영역
export function CardHeader({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("mb-3 flex items-center justify-between", className)}
            {...props}
        />
    );
}

// 카드 제목
export function CardTitle({
    className,
    ...props
}: HTMLAttributes<HTMLHeadingElement>) {
    return <h2 className={cn("text-section", className)} {...props} />;
}

// 카드 본문 영역
export function CardContent({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("space-y-3", className)} {...props} />;
}
