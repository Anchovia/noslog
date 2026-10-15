"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

import {
    addChartComment,
    deleteMyChartComment,
    hideChartComment,
    listChartComments,
    resolveChartComment,
} from "@/app/(site)/music/[index]/[difficulty]/draft-actions";
import {
    formatCommentTime,
    type PlaybackClock,
} from "@/components/chart-pattern/playbackClock";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import ActionButton from "@/components/ui/action-button";
import ActionMenu from "@/components/ui/action-menu";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { StatusMessage } from "@/components/ui/status-message";
import ContributionLabel from "@/features/contributions/components/contribution-label";
import { CHART_COMMENT_MAX_LENGTH } from "@/features/contributions/schemas/chart-draft-schema";
import {
    CHART_COMMENT_KINDS,
    type ChartCommentKind,
    isChartCommentKind,
} from "@/features/contributions/schemas/chart-draft-schema";
import type { ChartCommentItem } from "@/features/contributions/server/chart-draft-service";

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
 * 공개 채보 뷰어의 「채보 의견」 구역(2026-09-24 D1) — 머리 아래 구역 하나.
 * 제목 줄 →12→ 쓰기 칸(1055 이하만 — 1056 이상은 무대 바로 아래, 2026-10-15 L2) →16→ 목록(의견 목록 줄 문법, 아바타 없이).
 * 시각을 누르면 뷰어가 그 시각으로 가고 주소에 `?t=` 가 붙는다. 「해결」 · 가리기는 운영자만.
 */
export default function ChartComments({
    chartId,
    initialComments,
    signedIn,
    canModerate,
    returnTo,
    clock,
    draft,
    onSeek,
}: {
    chartId: number;
    initialComments: ChartCommentItem[];
    signedIn: boolean;
    canModerate: boolean;
    returnTo: string;
    clock: PlaybackClock;
    draft: ChartCommentDraft;
    onSeek: (timeMs: number) => void;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const id = useId();
    const query = useQuery(chartCommentsOptions(chartId, initialComments));
    // 한 단어 필터(2026-10-01 H2, osu! discussion 의 Pending · Resolved · All)
    const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");
    const all = query.data;
    const comments = all.filter((comment) =>
        filter === "all"
            ? true
            : filter === "open"
              ? !comment.resolved
              : comment.resolved
    );
    return (
        <section className="nl-chart-comments" aria-labelledby={`${id}-title`}>
            <div className="nl-heading-row">
                <h2 id={`${id}-title`} className="nl-section-title">
                    {t("contribution.comment.title", {
                        count: all.length,
                    })}
                </h2>
                {all.length ? (
                    <SegmentedControl
                        size="sm"
                        label={t("contribution.comment.filterLabel")}
                        value={filter}
                        onValueChange={setFilter}
                        options={(["all", "open", "resolved"] as const).map(
                            (value) => ({
                                value,
                                label: t(
                                    `contribution.comment.filter.${value}`
                                ),
                            })
                        )}
                    />
                ) : null}
                {signedIn ? null : (
                    <Link
                        className="nl-heading-link nl-control nl-chart-comments__login"
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
                    <div className="nl-chart-comments__composer-slot">
                        <ChartCommentComposer draft={draft} clock={clock} />
                    </div>
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
 * 쓰기 칸 상태 — 무대 아래(1056 이상)와 의견 구역(1055 이하) 두 자리가 나눠 쓴다(2026-10-15 L2).
 * 폭을 바꿔 자리가 바뀌어도 쓰던 글 · 종류 · 고정한 시각이 유지된다.
 */
export function useChartCommentDraft(chartId: number) {
    const locale = useLocale();
    const queryClient = useQueryClient();
    const [pinned, setPinned] = useState<number | null>(null);
    const [body, setBody] = useState("");
    const [kind, setKind] = useState<ChartCommentKind>("problem");
    const [error, setError] = useState<string | null>(null);
    const reset = () => {
        setBody("");
        setPinned(null);
        setError(null);
    };
    const mutation = useMutation({
        mutationFn: async (timeMs: number) => {
            const result = await addChartComment(
                { chartId, timeMs: Math.round(timeMs), body, kind },
                locale
            );
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (result) => {
            reset();
            toast.success(result.message);
            void queryClient.invalidateQueries({
                queryKey: chartCommentsKey(chartId),
            });
        },
        onError: (reason) => setError(reason.message),
    });
    return {
        body,
        setBody,
        kind,
        setKind,
        pinned,
        setPinned,
        error,
        reset,
        mutation,
    };
}

export type ChartCommentDraft = ReturnType<typeof useChartCommentDraft>;

/**
 * 무대 바로 아래 쓰기 줄(2026-10-15 L2, 1056 이상만 보임) — 재생을 보면서 쓴다.
 * 로그아웃이면 같은 자리에 「로그인하고 의견 남기기 ›」(제목 줄의 같은 링크는 이 폭에서 숨김).
 */
export function ChartCommentStageEntry({
    signedIn,
    returnTo,
    draft,
    clock,
}: {
    signedIn: boolean;
    returnTo: string;
    draft: ChartCommentDraft;
    clock: PlaybackClock;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    return (
        <div className="nl-chart-viewer__comment-entry">
            {signedIn ? (
                <ChartCommentComposer draft={draft} clock={clock} />
            ) : (
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
    );
}

/**
 * 쓰기 칸 — 시각(고정폭 숫자) + 한 줄 입력으로 쉬고, 누르면 아래 8 에 종류 세그먼트 · 「취소 · 남기기」 가 펼쳐진다
 * (2026-10-15 C2, 평가 의견 작성 칸과 같은 문법 · Esc 로 접힘).
 * 시각은 지금 재생 위치를 따라가다가 글을 쓰기 시작하면 멈춘다. 시각을 누르면 지금 재생 위치로 다시 맞춘다.
 */
export function ChartCommentComposer({
    draft,
    clock,
}: {
    draft: ChartCommentDraft;
    clock: PlaybackClock;
}) {
    const t = useTranslations();
    const id = useId();
    const container = useRef<HTMLFormElement>(null);
    const live = useSyncExternalStore(clock.subscribe, clock.get, () => 0);
    const [focused, setFocused] = useState(false);
    const { body, setBody, kind, setKind, pinned, setPinned, error, mutation } =
        draft;
    const timeMs = pinned ?? live;
    const trimmed = body.trim();
    const expanded = focused || body !== "";
    const close = () => {
        draft.reset();
        setFocused(false);
    };
    return (
        <form
            ref={container}
            className="nl-chart-comments__composer"
            onSubmit={(event) => {
                event.preventDefault();
                if (trimmed && !mutation.isPending) mutation.mutate(timeMs);
            }}
            onBlur={(event) => {
                if (!container.current?.contains(event.relatedTarget as Node))
                    setFocused(false);
            }}
        >
            <div className="nl-chart-comments__composer-row">
                {/* 고정폭 숫자(2026-10-15 T1) — 재생 중 글자 폭이 바뀌어 입력칸이 흔들리지 않게. 무대 재생 시간과 같은 글자 */}
                <button
                    type="button"
                    className="nl-link nl-metric-value nl-chart-comments__time"
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
                    onFocus={() => setFocused(true)}
                    onChange={(event) => {
                        const next = event.target.value;
                        if (!body && next) setPinned(Math.round(clock.get()));
                        if (!next) setPinned(null);
                        setBody(next);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            event.preventDefault();
                            close();
                            event.currentTarget.blur();
                        }
                    }}
                />
            </div>
            {expanded ? (
                <div className="nl-chart-comments__composer-actions">
                    <SegmentedControl
                        size="sm"
                        label={t("contribution.comment.kindLabel")}
                        value={kind}
                        onValueChange={setKind}
                        options={CHART_COMMENT_KINDS.map((value) => ({
                            value,
                            label: t(`contribution.comment.kind.${value}`),
                        }))}
                    />
                    <div className="nl-chart-comments__composer-buttons">
                        <ActionButton
                            variant="ghost"
                            disabled={mutation.isPending}
                            onClick={close}
                        >
                            {t("community.cancel")}
                        </ActionButton>
                        <ActionButton
                            type="submit"
                            disabled={!trimmed}
                            busy={mutation.isPending}
                            busyLabel={t("contribution.comment.sending")}
                        >
                            {t("contribution.comment.send")}
                        </ActionButton>
                    </div>
                </div>
            ) : null}
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
                    <span
                        className="nl-tag nl-tag--status nl-tag--inline"
                        data-tone="success"
                    >
                        {t("contribution.comment.resolved")}
                    </span>
                ) : (
                    <span className="nl-tag nl-tag--inline">
                        {t(
                            isChartCommentKind(comment.kind)
                                ? `contribution.comment.kind.${comment.kind}`
                                : "contribution.comment.kind.problem"
                        )}
                    </span>
                )}
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
