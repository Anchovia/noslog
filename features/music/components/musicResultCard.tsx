"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import MusicJacket from "@/components/music/musicJacket";
import { SkeletonText } from "@/components/ui/skeleton";
import { entryDifficulty } from "@/features/music/lib/entryDifficulty";
import type { MusicResult } from "@/features/music/schemas/musicResultSchema";
import { cn } from "@/lib/utils";

const difficulties = ["normal", "hard", "expert", "real"] as const;

/**
 * 난이도 판 4칸 — 고정 순서(Normal · Hard · Expert · Real), 없는 난이도는 자리만 비워 열을 지킨다.
 * 판 24(목록 · 격자) / 20(촘촘) · raised 면 · 숫자는 metric-value 14 tabular 에 난이도 글자색 (2026-09-16 L2).
 */
function DifficultyLevels({ music }: { music: MusicResult }) {
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
    // 목록에서 들어가는 난이도 = 그 곡의 가장 높은 난이도(2026-09-19 사용자)
    const entry = entryDifficulty((difficulty) => Boolean(music[difficulty]));
    return (
        <Link
            {...props}
            href={href(destination ?? `/music/${music.index}/${entry}`)}
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

/**
 * 결과 카드 스켈레톤(2026-09-19 로딩 시안 S1) — 같은 카드 틀 · 클래스(목록 · 격자 · 촘촘)에 자켓 자리 · 글자 자리 · 난이도 판만 채운다.
 * 이름 · 아티스트 글자 단계도 실제 카드와 같다(목록 = entity-title · body-secondary, 격자 = emphasis-label · metadata)
 */
export function MusicResultCardSkeleton({
    view = "list",
    showLevels = true,
}: {
    view?: "list" | "grid" | "dense";
    showLevels?: boolean;
}) {
    return (
        <div
            className={cn(
                "nl-music-card",
                `nl-music-card--${view === "list" ? "list" : "grid"}`,
                view === "dense" && "nl-music-card--dense"
            )}
            aria-hidden="true"
        >
            <span className="nl-jacket nl-skeleton" />
            <span className="nl-music-card__body">
                <span className="nl-music-card__identity">
                    <SkeletonText
                        className={
                            view === "list"
                                ? "nl-entity-title"
                                : "nl-emphasis-label"
                        }
                        width="l"
                    />
                    {view === "dense" ? null : (
                        <SkeletonText
                            className={
                                view === "list"
                                    ? "nl-body-secondary"
                                    : "nl-metadata"
                            }
                            width="m"
                        />
                    )}
                </span>
                {showLevels ? (
                    <span className="nl-difficulty-levels">
                        {difficulties.map((difficulty) => (
                            <span
                                key={difficulty}
                                className="nl-level nl-skeleton"
                            />
                        ))}
                    </span>
                ) : null}
            </span>
        </div>
    );
}
