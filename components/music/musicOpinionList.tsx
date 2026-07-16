"use client";

import { cn } from "@/lib/utils";
import { ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import Link from "next/link";
import type { EvaluationOpinion } from "./musicTierVoteTypes";

interface MusicOpinionListProps {
    opinionCount: number;
    opinions: EvaluationOpinion[];
    isPending: boolean;
    onReact: (evaluationId: number, value: 1 | -1) => void;
    onDelete: (evaluationId: number) => void;
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("ko-KR", {
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
    return (
        <section className="bg-surface rounded-card overflow-hidden">
            <header className="bg-surface-muted flex h-10 items-center px-4">
                <h2 className="text-section">
                    의견 {opinionCount.toLocaleString("ko-KR")}
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
                                    href={`/profile/${opinion.user.id}`}
                                    className="text-text-primary text-sm font-bold"
                                >
                                    {opinion.user.username || "이름 없는 유저"}
                                </Link>
                                <span className="text-caption tabular-nums">
                                    체감 {opinion.perceivedConstant.toFixed(1)}
                                </span>
                                <time
                                    className="text-caption"
                                    dateTime={opinion.updatedAt}
                                >
                                    {formatDate(opinion.updatedAt)}
                                </time>
                            </div>
                            <p className="text-body mt-1">{opinion.comment}</p>
                            <div className="mt-2 flex items-center gap-1">
                                <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => onReact(opinion.id, 1)}
                                    aria-label="의견 추천"
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
                                    aria-label="의견 비추천"
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
                                        aria-label="내 투표와 의견 삭제"
                                        title="내 투표와 의견 삭제"
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
                    아직 등록된 의견이 없습니다.
                </p>
            )}
        </section>
    );
}
