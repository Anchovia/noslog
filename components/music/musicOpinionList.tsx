"use client";

import { cn } from "@/lib/utils";
import { ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import Link from "next/link";
import type { EvaluationOpinion } from "./musicTierVoteTypes";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";

interface MusicOpinionListProps {
    opinionCount: number;
    opinions: EvaluationOpinion[];
    isPending: boolean;
    onReact: (evaluationId: number, value: 1 | -1) => void;
    onDelete: (evaluationId: number) => void;
}

function formatDate(value: string, locale: string) {
    return new Intl.DateTimeFormat(locale, {
        month: "2-digit",
        day: "2-digit",
    })
        .format(new Date(value))
        .replaceAll(". ", ".")
        .replace(/\.$/, "")
        .trim();
}

export default function MusicOpinionList({
    opinionCount,
    opinions,
    isPending,
    onReact,
    onDelete,
}: MusicOpinionListProps) {
    const locale = useLocale();
    const localizedHref = useLocalizedHref();
    const t = useTranslations();

    return (
        <section className="bg-surface rounded-card overflow-hidden">
            <header className="bg-surface-muted flex h-10 items-center px-4">
                <h2 className="text-section">
                    {t("music.opinion.title", {
                        count: opinionCount.toLocaleString(locale),
                    })}
                </h2>
            </header>
            {opinions.length > 0 ? (
                <ol>
                    {opinions.map((opinion) => (
                        <li
                            key={opinion.id}
                            className="border-divider border-t px-4 py-3 first:border-t-0"
                        >
                            <div className="flex items-center gap-2">
                                <Link
                                    href={localizedHref(
                                        `/profile/${opinion.user.id}`
                                    )}
                                    className="text-text-primary text-sm font-bold"
                                >
                                    {opinion.user.username ||
                                        t("common.unnamedUser")}
                                </Link>
                                <span className="text-caption tabular-nums">
                                    {t("music.opinion.perceived", {
                                        value: opinion.perceivedConstant.toFixed(
                                            1
                                        ),
                                    })}
                                </span>
                                <time
                                    className="text-caption"
                                    dateTime={opinion.updatedAt}
                                >
                                    {formatDate(opinion.updatedAt, locale)}
                                </time>
                            </div>
                            <p className="text-body mt-1">{opinion.comment}</p>
                            <div className="mt-2 flex items-center gap-1">
                                <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => onReact(opinion.id, 1)}
                                    aria-label={t("music.opinion.upvote")}
                                    className={cn(
                                        "flex h-8 items-center gap-1 rounded-md px-2 text-xs",
                                        opinion.viewerReaction === 1
                                            ? "bg-chart/15 text-chart"
                                            : "text-text-secondary hover:bg-surface-muted"
                                    )}
                                >
                                    <ThumbsUp size={14} aria-hidden />
                                    {opinion.positiveCount}
                                </button>
                                <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => onReact(opinion.id, -1)}
                                    aria-label={t("music.opinion.downvote")}
                                    className={cn(
                                        "flex h-8 items-center gap-1 rounded-md px-2 text-xs",
                                        opinion.viewerReaction === -1
                                            ? "bg-danger/15 text-danger"
                                            : "text-text-secondary hover:bg-surface-muted"
                                    )}
                                >
                                    <ThumbsDown size={14} aria-hidden />
                                    {opinion.negativeCount}
                                </button>
                                {opinion.canDelete ? (
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={() => onDelete(opinion.id)}
                                        aria-label={t("music.opinion.delete")}
                                        title={t("music.opinion.delete")}
                                        className="text-text-secondary hover:bg-danger/15 hover:text-danger ml-auto flex size-8 items-center justify-center rounded-md disabled:opacity-50"
                                    >
                                        <Trash2 size={14} aria-hidden />
                                    </button>
                                ) : null}
                            </div>
                        </li>
                    ))}
                </ol>
            ) : (
                <p className="text-body-muted flex h-24 items-center justify-center">
                    {t("music.opinion.empty")}
                </p>
            )}
        </section>
    );
}
