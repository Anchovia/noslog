import type { MusicRecordFilter as MusicRecordFilterValue } from "@/features/music/search/musicQuery";
import {
    useLocalizedHref,
    useTranslations,
    type MessageKey,
} from "@/components/i18n/localeProvider";
import { cn } from "@/lib/utils";
import Link from "next/link";

const filterGroups: {
    labelKey: MessageKey;
    weakNoteGroup?: boolean;
    filters: { value: MusicRecordFilterValue; labelKey: MessageKey }[];
}[] = [
    {
        labelKey: "music.filter.status",
        filters: [
            { value: "clear", labelKey: "music.filter.clear" },
            { value: "unplayed", labelKey: "music.filter.unplayed" },
            { value: "s", labelKey: "music.filter.rankS" },
            { value: "fc", labelKey: "music.filter.fullCombo" },
            { value: "pianist", labelKey: "music.filter.pianist" },
        ],
    },
    {
        labelKey: "music.filter.judgement",
        filters: [
            { value: "recent", labelKey: "music.filter.recent30" },
            { value: "miss-near", labelKey: "music.filter.missNear" },
            { value: "sjust-low", labelKey: "music.filter.sjustLow" },
            { value: "fast", labelKey: "music.filter.recentFast" },
            { value: "slow", labelKey: "music.filter.recentSlow" },
        ],
    },
    {
        labelKey: "music.filter.weakNotes",
        weakNoteGroup: true,
        filters: [
            { value: "standard-low", labelKey: "music.filter.standard" },
            { value: "tenuto-low", labelKey: "music.filter.tenuto" },
            {
                value: "glissando-low",
                labelKey: "music.filter.glissando",
            },
            { value: "trill-low", labelKey: "music.filter.trill" },
        ],
    },
];

interface MusicRecordFilterProps {
    selected: MusicRecordFilterValue[];
    isLoggedIn: boolean;
    onToggle: (value: MusicRecordFilterValue) => void;
}

export default function MusicRecordFilter({
    selected,
    isLoggedIn,
    onToggle,
}: MusicRecordFilterProps) {
    const localizedHref = useLocalizedHref();
    const t = useTranslations();

    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <h3 className="text-label">{t("music.myRecords")}</h3>
                {!isLoggedIn ? (
                    <Link
                        href={localizedHref("/login")}
                        className="text-caption hover:text-text-primary underline"
                    >
                        {t("music.loginToUse")}
                    </Link>
                ) : null}
            </div>
            <div className="flex flex-col gap-3">
                {filterGroups.map((group) => (
                    <div key={group.labelKey}>
                        <p className="text-micro text-text-disabled mb-1.5">
                            {t(group.labelKey)}
                            {group.weakNoteGroup
                                ? ` · ${t("music.filter.below90")}`
                                : ""}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {group.filters.map((filter) => {
                                const active = selected.includes(filter.value);
                                return (
                                    <button
                                        key={filter.value}
                                        type="button"
                                        disabled={!isLoggedIn}
                                        onClick={() => onToggle(filter.value)}
                                        className={cn(
                                            "border-border bg-surface text-text-secondary hover:bg-surface-muted rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                                            active &&
                                                "border-chart bg-chart/15 text-chart"
                                        )}
                                    >
                                        {t(filter.labelKey)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            {isLoggedIn ? (
                <p className="text-micro text-text-disabled mt-2">
                    {t("music.filter.anyMatch")}
                </p>
            ) : null}
        </div>
    );
}
