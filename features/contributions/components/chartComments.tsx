"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useId, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

import {
    addChartComment,
    deleteMyChartComment,
    hideChartComment,
    listChartComments,
    resolveChartComment,
} from "@/app/(nevigation)/music/[index]/[difficulty]/draftActions";
import {
    formatCommentTime,
    type PlaybackClock,
} from "@/components/chart-pattern/playbackClock";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import ActionMenu from "@/components/ui/actionMenu";
import { StatusMessage } from "@/components/ui/statusMessage";
import ContributionLabel from "@/features/contributions/components/contributionLabel";
import { CHART_COMMENT_MAX_LENGTH } from "@/features/contributions/schemas/chartDraftSchema";
import type { ChartCommentItem } from "@/features/contributions/server/chartDraftService";

export function chartCommentsKey(chartId: number) {
    return ["chart-comments", chartId] as const;
}

/** 뷰어(진행 막대 눈금)와 의견 구역이 같은 목록을 나눠 쓴다 */
export function chartCommentsOptions(
    chartId: number,
    initialComments: ChartCommentItem[]
) {
    return {
        queryKey: chartCommentsKey(chartId),
        // 읽을 수 없으면(null) 빈 목록 — 공개 채보 댓글은 누구나 읽으므로 실제로는 오지 않는다
        queryFn: async () => (await listChartComments({ chartId })) ?? [],
        initialData: initialComments,
        staleTime: 30_000,
    };
}

/**
 * 공개 채보 뷰어의 「채보 의견」 구역(2026-09-24 D1) — 조작부 아래 구역 하나.
 * 제목 줄 →12→ 쓰기 칸(지금 재생 시각 + 한 줄 입력 + 「남기기」) →8→ 목록(의견 목록 줄 문법, 아바타 없이).
 * 시각을 누르면 뷰어가 그 시각으로 가고 주소에 `?t=` 가 붙는다. 「해결」 · 가리기는 운영자만.
 */
export default function ChartComments({
    chartId,
    initialComments,
    signedIn,
    canModerate,
    returnTo,
    clock,
    onSeek,
}: {
    chartId: number;
    initialComments: ChartCommentItem[];
    signedIn: boolean;
    canModerate: boolean;
    returnTo: string;
    clock: PlaybackClock;
    onSeek: (timeMs: number) => void;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const id = useId();
    const query = useQuery(chartCommentsOptions(chartId, initialComments));
    const comments = query.data;
    return (
        <section className="nl-chart-comments" aria-labelledby={`${id}-title`}>
            <div className="nl-heading-row">
                <h2 id={`${id}-title`} className="nl-section-title">
                    {t("contribution.comment.title", {
                        count: comments.length,
                    })}
                </h2>
                {signedIn ? null : (
                    <Link
                        className="nl-heading-link nl-control"
                        href={href(
                            `/login?returnTo=${encodeURIComponent(returnTo)}`
                        )}
                    >
                        {t("contribution.comment.login")}
                        <ChevronRight aria-hidden />
                    </Link>
                )}
            </div>
            <div className="nl-chart-comments__body">
                {signedIn ? (
                    <ChartCommentComposer chartId={chartId} clock={clock} />
                ) : null}
                {comments.length ? (
                    <div className="nl-opinions__list">
                        {comments.map((comment) => (
                            <ChartCommentRow
                                key={comment.id}
                                chartId={chartId}
                                comment={comment}
                                canModerate={canModerate}
                                onSeek={onSeek}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="nl-body-secondary nl-muted">
                        {t("contribution.comment.empty")}
                    </p>
                )}
            </div>
        </section>
    );
}

/**
 * 쓰기 칸 — 시각은 지금 재생 위치를 따라가다가 글을 쓰기 시작하면 멈춘다.
 * 시각을 누르면 지금 재생 위치로 다시 맞춘다(재생 막대로 옮긴 뒤 누르면 그 자리).
 */
function ChartCommentComposer({
    chartId,
    clock,
}: {
    chartId: number;
    clock: PlaybackClock;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const id = useId();
    const queryClient = useQueryClient();
    const live = useSyncExternalStore(clock.subscribe, clock.get, () => 0);
    const [pinned, setPinned] = useState<number | null>(null);
    const [body, setBody] = useState("");
    const [error, setError] = useState<string | null>(null);
    const timeMs = pinned ?? live;
    const mutation = useMutation({
        mutationFn: async () => {
            const result = await addChartComment(
                { chartId, timeMs: Math.round(timeMs), body },
                locale
            );
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (result) => {
            setBody("");
            setPinned(null);
            setError(null);
            toast.success(result.message);
            void queryClient.invalidateQueries({
                queryKey: chartCommentsKey(chartId),
            });
        },
        onError: (reason) => setError(reason.message),
    });
    const trimmed = body.trim();
    return (
        <form
            className="nl-chart-comments__composer"
            onSubmit={(event) => {
                event.preventDefault();
                if (trimmed && !mutation.isPending) mutation.mutate();
            }}
        >
            <div className="nl-chart-comments__composer-row">
                <button
                    type="button"
                    className="nl-link nl-control nl-chart-comments__time"
                    aria-label={t("contribution.comment.timeSync", {
                        time: formatCommentTime(timeMs),
                    })}
                    onClick={() =>
                        setPinned(body ? Math.round(clock.get()) : null)
                    }
                >
                    {formatCommentTime(timeMs)}
                </button>
                <input
                    id={`${id}-input`}
                    className="nl-input nl-chart-comments__input"
                    value={body}
                    maxLength={CHART_COMMENT_MAX_LENGTH}
                    placeholder={t("contribution.comment.placeholder")}
                    aria-label={t("contribution.comment.label")}
                    aria-invalid={Boolean(error) || undefined}
                    readOnly={mutation.isPending}
                    onChange={(event) => {
                        const next = event.target.value;
                        if (!body && next) setPinned(Math.round(clock.get()));
                        if (!next) setPinned(null);
                        setBody(next);
                    }}
                />
                <ActionButton
                    type="submit"
                    disabled={!trimmed}
                    busy={mutation.isPending}
                    busyLabel={t("contribution.comment.sending")}
                >
                    {t("contribution.comment.send")}
                </ActionButton>
            </div>
            {error ? (
                <StatusMessage severity="danger" role="alert" title={error} />
            ) : null}
        </form>
    );
}

function ChartCommentRow({
    chartId,
    comment,
    canModerate,
    onSeek,
}: {
    chartId: number;
    comment: ChartCommentItem;
    canModerate: boolean;
    onSeek: (timeMs: number) => void;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const locale = useLocale();
    const id = useId();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (action: "delete" | "resolve" | "hide") => {
            const result =
                action === "delete"
                    ? await deleteMyChartComment(comment.id, locale)
                    : action === "resolve"
                      ? await resolveChartComment(comment.id)
                      : await hideChartComment(comment.id);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (result) => {
            toast.success(result.message);
            void queryClient.invalidateQueries({
                queryKey: chartCommentsKey(chartId),
            });
        },
        onError: (reason) => toast.error(reason.message),
    });
    const name = comment.user.username ?? t("ranking.unknownPlayer");
    const writtenAt = new Date(comment.createdAt);
    const actions = [
        ...(canModerate && !comment.resolved
            ? [
                  {
                      label: t("contribution.comment.resolve"),
                      onSelect: () => mutation.mutate("resolve"),
                  },
              ]
            : []),
        ...(comment.own && !comment.resolved
            ? [
                  {
                      label: t("contribution.comment.delete"),
                      onSelect: () => mutation.mutate("delete"),
                      destructive: true,
                  },
              ]
            : []),
        ...(canModerate && !comment.own
            ? [
                  {
                      label: t("contribution.comment.hide"),
                      onSelect: () => mutation.mutate("hide"),
                      destructive: true,
                  },
              ]
            : []),
    ];
    return (
        <article
            className="nl-opinion-row__content"
            aria-labelledby={`${id}-name`}
            aria-busy={mutation.isPending || undefined}
        >
            <div className="nl-opinion-row__header">
                <button
                    type="button"
                    className="nl-link nl-emphasis-label nl-chart-comments__time"
                    aria-label={t("contribution.comment.seek", {
                        time: formatCommentTime(comment.timeMs),
                    })}
                    onClick={() => onSeek(comment.timeMs)}
                >
                    {formatCommentTime(comment.timeMs)}
                </button>
                <Link
                    id={`${id}-name`}
                    href={href(`/profile/${comment.user.id}`)}
                    className="nl-opinion-row__name nl-emphasis-label"
                >
                    {name}
                </Link>
                <ContributionLabel label={comment.user.label} />
                <span className="nl-metadata nl-muted">
                    <time
                        dateTime={comment.createdAt}
                        title={writtenAt.toLocaleString(locale)}
                    >
                        {writtenAt.toLocaleDateString(locale, {
                            month: "numeric",
                            day: "numeric",
                            timeZone: "Asia/Seoul",
                        })}
                    </time>
                </span>
                {comment.resolved ? (
                    <span className="nl-tag nl-tag--status" data-tone="success">
                        {t("contribution.comment.resolved")}
                    </span>
                ) : null}
                {actions.length ? (
                    <ActionMenu
                        label={t("contribution.comment.actions", { name })}
                        items={actions}
                        disabled={mutation.isPending}
                    />
                ) : null}
            </div>
            <p className="nl-body-secondary nl-opinion-row__body">
                {comment.body}
            </p>
        </article>
    );
}
