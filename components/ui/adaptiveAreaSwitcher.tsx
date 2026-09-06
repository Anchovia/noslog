"use client";

import * as Tabs from "@radix-ui/react-tabs";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { useId } from "react";
import type { ReactNode } from "react";

import useElementWidth from "@/lib/hooks/useElementWidth";

export default function AdaptiveAreaSwitcher<Value extends string>({
    value,
    options,
    onValueChange,
    label,
    children,
    busy = false,
}: {
    value: Value;
    options: readonly { value: Value; label: string }[];
    onValueChange: (value: Value) => void;
    label: string;
    children: ReactNode;
    busy?: boolean;
}) {
    const { ref, width } = useElementWidth<HTMLDivElement>();
    const wide = width >= 424;
    const id = useId();
    return (
        <Tabs.Root
            ref={ref}
            value={value}
            activationMode="manual"
            onValueChange={(next) => onValueChange(next as Value)}
            className="nl-area"
        >
            {wide ? (
                <Tabs.List className="nl-area__tabs" aria-label={label}>
                    {options.map((option) => (
                        <Tabs.Trigger
                            key={option.value}
                            value={option.value}
                            id={`${id}-tab-${option.value}`}
                            aria-controls={id}
                            className="nl-area__tab nl-control"
                        >
                            {option.label}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
            ) : (
                <Select.Root
                    value={value}
                    onValueChange={(next) => onValueChange(next as Value)}
                >
                    <Select.Trigger
                        className="nl-area__select nl-control"
                        aria-label={label}
                        aria-controls={id}
                    >
                        <Select.Value />
                        <Select.Icon>
                            <ChevronDown className="nl-icon" aria-hidden />
                        </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                        <div className="noslog-ui">
                            <Select.Content
                                className="nl-select-menu nl-area__menu"
                                position="popper"
                                sideOffset={8}
                                collisionPadding={16}
                            >
                                <Select.Viewport>
                                    {options.map((option) => (
                                        <Select.Item
                                            key={option.value}
                                            value={option.value}
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
            )}
            <Tabs.Content
                value={value}
                id={id}
                role={wide ? "tabpanel" : "region"}
                aria-labelledby={wide ? `${id}-tab-${value}` : undefined}
                aria-label={
                    wide
                        ? undefined
                        : options.find((option) => option.value === value)
                              ?.label
                }
                className="nl-area__panel"
                aria-busy={busy || undefined}
            >
                {children}
            </Tabs.Content>
        </Tabs.Root>
    );
}
