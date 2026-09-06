"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import MusicJacket from "@/components/music/musicJacket";
import type { MusicResult } from "@/features/music/schemas/musicResultSchema";
import { cn } from "@/lib/utils";

const difficulties = ["normal", "hard", "expert", "real"] as const;

export function DifficultyLevels({ music }: { music: MusicResult }) {
    return (
        <span className="nl-difficulty-levels nl-metric-value" lang="en">
            {difficulties.map((difficulty) => (
                <span
                    key={difficulty}
                    className={`nl-level--${difficulty}`}
                    aria-label={`${difficulty}: ${music[difficulty] || "—"}`}
                >
                    {music[difficulty] || ""}
                </span>
            ))}
        </span>
    );
}

export default function MusicResultCard({
    music,
    view = "list",
    showLevels = true,
    destination,
    pending = false,
    className,
    ...props
}: Omit<ComponentProps<typeof Link>, "href"> & {
    music: MusicResult;
    view?: "list" | "grid";
    showLevels?: boolean;
    destination?: string;
    pending?: boolean;
}) {
    const href = useLocalizedHref();
    const t = useTranslations();
    const firstDifficulty =
        difficulties.find((difficulty) => music[difficulty]) ?? "normal";
    return (
        <Link
            {...props}
            href={href(
                destination ?? `/music/${music.index}/${firstDifficulty}`
            )}
            className={cn("nl-music-card", `nl-music-card--${view}`, className)}
            aria-disabled={pending || undefined}
            onClick={(event) => {
                if (pending) {
                    event.preventDefault();
                    return;
                }
                props.onClick?.(event);
            }}
        >
            <MusicJacket
                index={music.index}
                background={music.background}
                title={music.title}
                appearance="foundation"
            >
                <span className="nl-jacket__category nl-metadata" lang="en">
                    {music.category_short}
                </span>
            </MusicJacket>
            <span className="nl-music-card__body">
                <span className="nl-music-card__identity">
                    {music.localizedTitle ? (
                        <span className="nl-metadata nl-muted">
                            {music.localizedTitle}
                        </span>
                    ) : null}
                    <span
                        className="nl-entity-title"
                        lang={
                            /[\u3040-\u30ff\u3400-\u9fff]/u.test(music.title)
                                ? "ja"
                                : undefined
                        }
                    >
                        {music.title}
                    </span>
                    <span className="nl-body-secondary nl-muted">
                        {music.artist || t("music.unknownArtist")}
                    </span>
                </span>
                {showLevels ? <DifficultyLevels music={music} /> : null}
            </span>
        </Link>
    );
}
