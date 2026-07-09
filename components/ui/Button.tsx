import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";

// 공통 버튼 스타일과 variant를 한곳에서 관리함
const buttonVariants = cva(
    "inline-flex h-10 items-center justify-center rounded-card px-4 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary: "bg-real text-bg hover:bg-real/90",
                secondary:
                    "border border-border bg-surface-muted text-text-primary hover:bg-divider",
                ghost: "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
                danger: "bg-expert text-text-primary hover:bg-expert/90",
            },
            size: {
                sm: "h-8 px-3 text-xs",
                md: "h-10 px-4 text-sm",
                lg: "h-12 px-5 text-base",
                icon: "size-10 px-0",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

interface ButtonProps
    extends
        ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

export default function Button({
    className,
    variant,
    size,
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
        />
    );
}

export { buttonVariants };
