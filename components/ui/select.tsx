"use client";

import "@/lib/input-modality";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import type { Ref } from "react";

import { useSelectOpen } from "@/components/ui/use-select-open";
import { cn } from "@/lib/cn";

// Radix 항목은 빈 문자열 값을 쓸 수 없어서 "" 선택지(전국 · — 등)는 안에서만 이 값으로 바꿔 쓴다
const EMPTY = "__nl-select-empty__";
const toItem = (value: string) => (value === "" ? EMPTY : value);
const fromItem = (value: string) => (value === EMPTY ? "" : value);

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

/**
 * 폼 셀렉트 — 트리거는 입력칸과 같은 모양, 목록은 정렬 메뉴와 같은 한 모양
 * (선택 = 면 + 굵기 + 오른쪽 체크). 2026-09-14 M2
 */
export function Select({
    value,
    onValueChange,
    options,
    placeholder,
    disabled,
    invalid,
    onBlur,
    triggerRef,
    id,
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
}: {
    /** option value와 같은 제어 값. 빈 문자열 옵션도 지원한다. */
    value: string;
    /** 선택한 외부 string 값을 전달한다. 내부 sentinel은 노출하지 않는다. */
    onValueChange: (value: string) => void;
    options: readonly SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    onBlur?: () => void;
    /** RHF field.ref/오류 포커스를 연결할 실제 트리거 button ref. */
    triggerRef?: Ref<HTMLButtonElement>;
    id?: string;
    className?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
}) {
    const hasEmpty = options.some((option) => option.value === "");
    const openState = useSelectOpen();
    return (
        <SelectPrimitive.Root
            {...openState}
            value={value === "" && !hasEmpty ? "" : toItem(value)}
            onValueChange={(next) => onValueChange(fromItem(next))}
            disabled={disabled}
        >
            <SelectPrimitive.Trigger
                ref={triggerRef}
                id={id}
                className={cn("nl-input nl-select", className)}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                aria-describedby={ariaDescribedBy}
                aria-invalid={invalid || undefined}
                onBlur={onBlur}
            >
                <SelectPrimitive.Value placeholder={placeholder} />
                <SelectPrimitive.Icon asChild>
                    <ChevronDown className="nl-icon" aria-hidden />
                </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>
            <SelectPrimitive.Portal>
                <div className="noslog-ui">
                    <SelectPrimitive.Content
                        className="nl-select-menu nl-select-menu--field"
                        position="popper"
                        sideOffset={8}
                        align="start"
                        collisionPadding={16}
                    >
                        <SelectPrimitive.Viewport>
                            {options.map((option) => (
                                <SelectPrimitive.Item
                                    key={toItem(option.value)}
                                    value={toItem(option.value)}
                                    disabled={option.disabled}
                                    className="nl-select-option nl-body-secondary"
                                >
                                    <SelectPrimitive.ItemText>
                                        {option.label}
                                    </SelectPrimitive.ItemText>
                                    <SelectPrimitive.ItemIndicator>
                                        <Check
                                            className="nl-icon-small"
                                            aria-hidden
                                        />
                                    </SelectPrimitive.ItemIndicator>
                                </SelectPrimitive.Item>
                            ))}
                        </SelectPrimitive.Viewport>
                    </SelectPrimitive.Content>
                </div>
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    );
}
