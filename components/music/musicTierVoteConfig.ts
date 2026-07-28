import type { MessageKey } from "@/lib/i18n/messages";

export const patternItems = [
    { key: "stairs", label: "계단", labelKey: "music.pattern.stairs" },
    { key: "repetition", label: "연타", labelKey: "music.pattern.repetition" },
    { key: "chord", label: "폴리리듬", labelKey: "music.pattern.chord" },
    { key: "trill", label: "즈레", labelKey: "music.pattern.trill" },
    {
        key: "glissando",
        label: "글리산도",
        labelKey: "music.pattern.glissando",
    },
] as const satisfies readonly {
    key: string;
    label: string;
    labelKey: MessageKey;
}[];

export const patternLevelKeys = [
    "music.tier.level.none",
    "music.tier.level.low",
    "music.tier.level.medium",
    "music.tier.level.high",
    "music.tier.level.veryHigh",
] as const;
