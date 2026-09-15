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

/**
 * 난이도 판 4칸 — 고정 순서(Normal · Hard · Expert · Real), 없는 난이도는 자리만 비워 열을 지킨다.
 * 판 24(목록 · 격자) / 20(촘촘) · raised 면 · 숫자는 metric-value 14 tabular 에 난이도 글자색 (2026-09-16 L2).
 */
export function DifficultyLevels({ music }: { music: MusicResult }) {
    return (
        <span className="nl-difficulty-levels nl-metric-value" lang="en">
            {difficulties.map((difficulty) => (
                <span
                    key={difficulty}
                    className={cn(
                        "nl-level",
                        music[difficulty]
                            ? `nl-level--${difficulty}`
                            : "nl-level--empty"
                    )}
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
    view?: "list" | "grid" | "dense";
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
            className={cn(
                "nl-music-card",
                `nl-music-card--${view === "list" ? "list" : "grid"}`,
                view === "dense" && "nl-music-card--dense",
                className
            )}
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
                <span
                    className="nl-jacket__category nl-metadata"
                    lang="en"
                    data-category={music.category_short}
                >
                    {music.category_short}
                </span>
            </MusicJacket>
            <span className="nl-music-card__body">
                {/* 글자 단계: 목록 = 이름 16 · 아티스트 14, 격자 = 이름 14(emphasis-label) · 아티스트 12, 촘촘 = 이름 14 한 줄만 */}
                <span className="nl-music-card__identity">
                    {music.localizedTitle && view !== "dense" ? (
                        <span className="nl-metadata nl-muted">
                            {music.localizedTitle}
                        </span>
                    ) : null}
                    <span
                        className={
                            view === "list"
                                ? "nl-entity-title"
                                : "nl-emphasis-label"
                        }
                        lang={
                            /[\u3040-\u30ff\u3400-\u9fff]/u.test(music.title)
                                ? "ja"
                                : undefined
                        }
                    >
                        {music.title}
                    </span>
                    {view === "dense" ? null : (
                        <span
                            className={cn(
                                view === "list"
                                    ? "nl-body-secondary"
                                    : "nl-metadata",
                                "nl-muted"
                            )}
                        >
                            {music.artist || t("music.unknownArtist")}
                        </span>
                    )}
                </span>
                {showLevels ? <DifficultyLevels music={music} /> : null}
            </span>
        </Link>
    );
}
