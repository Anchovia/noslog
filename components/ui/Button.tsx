import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes } from "react";

// 공통 버튼 스타일과 variant를 한곳에서 관리함
const buttonVariants = cva(
    "focus-visible:ring-focus/40 inline-flex items-center justify-center rounded-card font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary:
                    "bg-interactive text-on-interactive hover:bg-interactive/90",
                secondary:
                    "border border-border bg-surface-muted text-text-primary hover:bg-divider",
                ghost: "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
                danger: "bg-danger text-on-interactive hover:bg-danger/90",
            },
            size: {
                sm: "h-8 px-3 text-xs font-semibold",
                md: "h-10 px-4 text-sm",
                lg: "h-12 px-5 text-sm font-bold",
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
        VariantProps<typeof buttonVariants> {
    appearance?: "legacy" | "foundation";
    destructiveFilled?: boolean;
}

export default function Button({
    className,
    variant,
    size,
    appearance = "legacy",
    destructiveFilled = false,
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(
                appearance === "foundation"
                    ? foundationButtonClass({
                          variant,
                          size,
                          destructiveFilled,
                      })
                    : buttonVariants({ variant, size }),
                className
            )}
            {...props}
        />
    );
}

export { buttonVariants };

export function foundationButtonClass({
    variant = "primary",
    size,
    destructiveFilled = false,
}: Pick<ButtonProps, "variant" | "size" | "destructiveFilled"> = {}) {
    return cn(
        "nl-button",
        variant && `nl-button--${variant}`,
        size === "icon" && "nl-button--icon",
        destructiveFilled && "nl-button--danger-filled"
    );
}
