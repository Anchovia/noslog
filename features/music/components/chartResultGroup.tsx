"use client";

import Link from "next/link";
import { useId } from "react";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import MusicJacket from "@/components/music/musicJacket";
import type { DiscoveryResult } from "@/features/music/schemas/discoverySchema";

export default function ChartResultGroup({
    music,
    pending = false,
}: {
    music: DiscoveryResult;
    pending?: boolean;
}) {
    const href = useLocalizedHref();
    const t = useTranslations();
    const id = useId();
    return (
        <article className="nl-chart-group" aria-labelledby={id}>
            <div className="nl-chart-group__identity">
                <MusicJacket
                    index={music.index}
                    title={music.title}
                    background={music.background}
                    appearance="foundation"
                >
                    <span className="nl-jacket__category nl-metadata" lang="en">
                        {music.category_short}
                    </span>
                </MusicJacket>
                <div className="nl-music-card__identity">
                    <h2 id={id} className="nl-entity-title">
                        {music.title}
                    </h2>
                    <p className="nl-body-secondary nl-muted">
                        {music.artist || t("music.unknownArtist")}
                    </p>
                </div>
            </div>
            <div className="nl-chart-group__targets">
                {music.targets.map((target) => (
                    <Link
                        key={target.difficulty}
                        href={href(
                            `/music/${music.index}/${target.difficulty.toLowerCase()}/pattern`
                        )}
                        className="nl-chart-target nl-control"
                        aria-label={`${music.title} · ${target.difficulty} ${target.level}`}
                        aria-disabled={pending || undefined}
                        onClick={(event) => {
                            if (pending) event.preventDefault();
                        }}
                    >
                        <span
                            className={`nl-difficulty-marker nl-difficulty-marker--${target.difficulty.toLowerCase()}`}
                            aria-hidden
                        />
                        <span>{target.difficulty}</span>
                        <span className="nl-metric-value">{target.level}</span>
                    </Link>
                ))}
            </div>
        </article>
    );
}
