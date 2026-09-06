"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CompactSelect<Value extends string>({
    value,
    onValueChange,
    label,
    options,
    disabled = false,
    outlined = false,
}: {
    value: Value;
    onValueChange: (value: Value) => void;
    label: string;
    options: {
        value: Value;
        label: string;
        shortLabel?: string;
        disabled?: boolean;
    }[];
    disabled?: boolean;
    outlined?: boolean;
}) {
    const selected = options.find((option) => option.value === value);
    return (
        <Select.Root
            value={value}
            onValueChange={(next) => onValueChange(next as Value)}
            disabled={disabled}
        >
            <Select.Trigger
                className={cn(
                    "nl-compact-select nl-control",
                    outlined && "nl-compact-select--outlined"
                )}
                aria-label={label}
            >
                <Select.Value>
                    {selected?.shortLabel ?? selected?.label}
                </Select.Value>
                <Select.Icon>
                    <ChevronDown aria-hidden />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <div className="noslog-ui">
                    <Select.Content
                        className="nl-select-menu"
                        position="popper"
                        sideOffset={8}
                        align="start"
                        collisionPadding={16}
                    >
                        <Select.Viewport>
                            {options.map((option) => (
                                <Select.Item
                                    key={option.value}
                                    value={option.value}
                                    disabled={option.disabled}
                                    className="nl-select-option nl-body-secondary"
                                >
                                    <Select.ItemText>
                                        {option.label}
                                    </Select.ItemText>
                                    <Select.ItemIndicator>
                                        <Check
                                            className="nl-icon"
                                            aria-hidden
                                        />
                                    </Select.ItemIndicator>
                                </Select.Item>
                            ))}
                        </Select.Viewport>
                    </Select.Content>
                </div>
            </Select.Portal>
        </Select.Root>
    );
}
