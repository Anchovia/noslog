"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

import { useTranslations } from "@/components/i18n/localeProvider";
import type { TierBrowserQuery } from "@/features/tiers/schemas/tierBrowserSchema";
import {
    TIER_MODE_GOALS,
    TIER_MODES,
    normalizeTierModeGoal,
    tierListLabel,
} from "@/lib/tiers";

type TierList = Pick<TierBrowserQuery, "mode" | "goal">;

const encode = ({ mode, goal }: TierList) => `${mode}:${goal}`;

/**
 * 서열표 제목 스위처(2026-09-22 ④) — 페이지 제목 자체가 네 서열표를 고르는 셀렉트.
 * 트리거 = 제목 글자(page-title) + 꺾쇠 24, 목록 = 셀렉트 목록 규격에 Basic · Recital 두 묶음 소제목.
 * 모드 · 목표를 따로 고르지 않아 조합이 많아 보이지 않고, Recital 이어도 같은 자리 · 같은 모양이다
 */
export default function TierListSwitcher({
    value,
    onValueChange,
}: {
    value: TierList;
    onValueChange: (value: TierList) => void;
}) {
    const t = useTranslations();
    const name = (list: TierList) =>
        t("tiers.goalOption", { goal: tierListLabel(list.mode, list.goal) });
    return (
        <Select.Root
            value={encode(value)}
            onValueChange={(next) => {
                const [mode, goal] = next.split(":") as [
                    TierList["mode"],
                    TierList["goal"],
                ];
                onValueChange({
                    mode,
                    goal: normalizeTierModeGoal(mode, goal),
                });
            }}
        >
            <Select.Trigger
                className="nl-tier-switch nl-page-title"
                aria-label={t("tiers.listLabel")}
            >
                <Select.Value>{name(value)}</Select.Value>
                <Select.Icon asChild>
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
                            {TIER_MODES.map((mode) => (
                                <Select.Group
                                    key={mode}
                                    className="nl-tier-switch__group"
                                >
                                    <Select.Label className="nl-tier-switch__heading nl-metadata">
                                        {mode === "basic" ? "Basic" : "Recital"}
                                    </Select.Label>
                                    {TIER_MODE_GOALS[mode].map((goal) => (
                                        <Select.Item
                                            key={goal}
                                            value={encode({ mode, goal })}
                                            className="nl-select-option nl-body-secondary"
                                        >
                                            <Select.ItemText>
                                                {name({ mode, goal })}
                                            </Select.ItemText>
                                            <Select.ItemIndicator>
                                                <Check
                                                    className="nl-icon"
                                                    aria-hidden
                                                />
                                            </Select.ItemIndicator>
                                        </Select.Item>
                                    ))}
                                </Select.Group>
                            ))}
                        </Select.Viewport>
                    </Select.Content>
                </div>
            </Select.Portal>
        </Select.Root>
    );
}
