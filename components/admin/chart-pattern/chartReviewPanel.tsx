"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
    addChartComment,
    deleteMyChartComment,
    listChartComments,
    resolveChartComment,
} from "@/app/(site)/music/[index]/[difficulty]/draft-actions";
import { formatCommentTime } from "@/components/chart-pattern/playbackClock";
import { useLocale, useTranslations } from "@/components/i18n/locale-provider";
import type { ChartDraftStatus } from "@/features/contributions/schemas/chart-draft-schema";
import { CHART_COMMENT_MAX_LENGTH } from "@/features/contributions/schemas/chart-draft-schema";
import type { ChartCommentItem } from "@/features/contributions/server/chart-draft-service";
import { formatEditorTime } from "@/lib/chart-pattern/timing";

import { useChartEditorStore } from "./chartEditorStore";
import ActionButton from "@/components/ui/action-button";
import Button, { foundationButtonClass } from "@/components/ui/button";
import ModalDialog from "@/components/ui/modal-dialog";

const STEPS: ChartDraftStatus[] = [
    "draft",
    "pending",
    "changes_requested",
    "approved",
];

/** 초안 시각 댓글 — 레일 탭 이름(개수)과 캔버스 · 파형 표시가 함께 쓴다 */
export function useDraftComments(chartId: number, draftId: number | null) {
    const setCommentTimes = useChartEditorStore(
        (state) => state.setCommentTimes
    );
    const query = useQuery({
        queryKey: ["chart-comments", chartId, draftId],
        queryFn: async () =>
            draftId === null
                ? []
                : ((await listChartComments({ chartId, draftId })) ?? []),
        enabled: draftId !== null,
        staleTime: 30_000,
    });
    const comments = query.data ?? [];
    const times = comments
        .filter((comment) => !comment.resolved)
        .map((comment) => comment.timeMs)
        .join(",");
    useEffect(() => {
        setCommentTimes(times ? times.split(",").map(Number) : []);
    }, [setCommentTimes, times]);
    return comments;
}

/**
 * 레일 「검토」 탭(2026-09-24 B1 · C1) — 단계 줄 → 지금 시각에 댓글 쓰기 → 시각 댓글 목록.
 * 기여자와 운영자가 같은 탭을 쓴다. 「해결」 은 운영자만, 지우기는 해결 전 내 댓글만.
 */
export default function ChartReviewPanel({
    chartId,
    draftId,
    status,
    comments,
    canModerate,
    onSeek,
}: {
    chartId: number;
    draftId: number;
    status: ChartDraftStatus;
    comments: ChartCommentItem[];
    canModerate: boolean;
    onSeek: (timeMs: number) => void;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const queryClient = useQueryClient();
    const currentTimeMs = useChartEditorStore((state) => state.currentTimeMs);
    const [body, setBody] = useState("");
    // 지운 댓글은 되돌릴 수 없어 확인 창을 거친다
    const [deleting, setDeleting] = useState<number | null>(null);
    const refresh = () =>
        queryClient.invalidateQueries({
            queryKey: ["chart-comments", chartId, draftId],
        });
    const add = useMutation({
        mutationFn: async () => {
            const result = await addChartComment(
                {
                    chartId,
                    draftId,
                    timeMs: Math.round(currentTimeMs),
                    body,
                },
                locale
            );
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: () => {
            setBody("");
            void refresh();
        },
        onError: (error) => toast.error(error.message),
    });
    const act = useMutation({
        mutationFn: async ({
            id,
            action,
        }: {
            id: number;
            action: "resolve" | "delete";
        }) => {
            const result =
                action === "resolve"
                    ? await resolveChartComment(id)
                    : await deleteMyChartComment(id, locale);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (result) => {
            toast.success(result.message);
            setDeleting(null);
            void refresh();
        },
        onError: (error) => toast.error(error.message),
    });
    const stepIndex = STEPS.indexOf(status);

    return (
        <section className="flex min-h-0 flex-1 flex-col gap-nl-12 overflow-y-auto p-nl-8">
            <ol
                aria-label={t("editor.review.steps")}
                className="grid grid-cols-4 gap-nl-4"
            >
                {STEPS.map((step, index) => (
                    <li
                        key={step}
                        aria-current={index === stepIndex ? "step" : undefined}
                        className={`nl-metadata flex flex-col gap-nl-4 text-center ${
                            index === stepIndex
                                ? "text-nl-content"
                                : index < stepIndex
                                  ? "text-nl-subdued"
                                  : "text-nl-disabled"
                        }`}
                    >
                        <span
                            aria-hidden
                            data-on={index <= stepIndex || undefined}
                            className={`nl-step-bar h-nl-4 rounded-nl-full ${
                                index <= stepIndex
                                    ? "bg-nl-primary"
                                    : "bg-nl-divider"
                            }`}
                        />
                        {/* 191 레일에서 칸마다 라벨을 두면 낱말이 끊겨, 라벨은 화면 읽기에만 두고 지금 단계를 아래 한 줄로 보인다 */}
                        <span className="sr-only">
                            {t(`contribution.draftStatus.${step}`)}
                        </span>
                    </li>
                ))}
            </ol>
            <p className="flex items-baseline gap-nl-8" aria-hidden>
                <span className="nl-metadata text-nl-subdued">
                    {stepIndex + 1} / {STEPS.length}
                </span>
                <span className="nl-emphasis-label text-nl-content">
                    {t(`contribution.draftStatus.${status}`)}
                </span>
            </p>

            <form
                className="flex flex-col gap-nl-8"
                onSubmit={(event) => {
                    event.preventDefault();
                    if (body.trim() && !add.isPending) add.mutate();
                }}
            >
                <label
                    htmlFor="chart-review-comment"
                    className="nl-metadata text-nl-subdued"
                >
                    {t("editor.review.commentAt", {
                        time: formatEditorTime(currentTimeMs),
                    })}
                </label>
                <textarea
                    id="chart-review-comment"
                    value={body}
                    maxLength={CHART_COMMENT_MAX_LENGTH}
                    rows={3}
                    readOnly={add.isPending}
                    onChange={(event) => setBody(event.target.value)}
                    placeholder={t("editor.review.placeholder")}
                    className="nl-input resize-none"
                />
                <button
                    type="submit"
                    disabled={!body.trim() || add.isPending}
                    className={foundationButtonClass({ size: "sm" })}
                >
                    {add.isPending
                        ? t("contribution.comment.sending")
                        : t("contribution.comment.send")}
                </button>
            </form>

            {comments.length ? (
                <ul className="flex flex-col gap-nl-8">
                    {comments.map((comment) => (
                        <li
                            key={comment.id}
                            className="flex flex-col gap-nl-4 rounded-nl-control bg-nl-canvas px-nl-8 py-nl-8"
                        >
                            <div className="nl-metadata flex flex-wrap items-center gap-x-nl-8 gap-y-nl-4 text-nl-subdued">
                                <button
                                    type="button"
                                    onClick={() => onSeek(comment.timeMs)}
                                    aria-label={t("contribution.comment.seek", {
                                        time: formatCommentTime(comment.timeMs),
                                    })}
                                    className="nl-metric-value nl-link underline"
                                >
                                    {formatCommentTime(comment.timeMs)}
                                </button>
                                <span className="min-w-0 truncate text-nl-subdued">
                                    {comment.user.username ??
                                        t("ranking.unknownPlayer")}
                                </span>
                                {comment.resolved ? (
                                    <span
                                        className="nl-tag nl-tag--status"
                                        data-tone="success"
                                    >
                                        {t("contribution.comment.resolved")}
                                    </span>
                                ) : null}
                            </div>
                            <p className="nl-metadata break-words whitespace-pre-wrap">
                                {comment.body}
                            </p>
                            {!comment.resolved &&
                            (canModerate || comment.own) ? (
                                <div className="flex gap-nl-4">
                                    {canModerate ? (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            disabled={act.isPending}
                                            onClick={() =>
                                                act.mutate({
                                                    id: comment.id,
                                                    action: "resolve",
                                                })
                                            }
                                        >
                                            {t("editor.review.resolve")}
                                        </Button>
                                    ) : null}
                                    {comment.own ? (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            disabled={act.isPending}
                                            onClick={() =>
                                                setDeleting(comment.id)
                                            }
                                        >
                                            {t("editor.review.delete")}
                                        </Button>
                                    ) : null}
                                </div>
                            ) : null}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="nl-metadata nl-metadata--long text-nl-subdued">
                    {t("editor.review.empty")}
                </p>
            )}
            <ModalDialog
                variant="confirm"
                className="nl-editor-dialog"
                open={deleting !== null}
                onOpenChange={(open) => {
                    if (!open && !act.isPending) setDeleting(null);
                }}
                title={t("editor.review.deleteTitle")}
                footer={
                    <>
                        <Button
                            variant="secondary"
                            disabled={act.isPending}
                            onClick={() => setDeleting(null)}
                        >
                            {t("settings.cancel")}
                        </Button>
                        <ActionButton
                            variant="danger"
                            busy={act.isPending}
                            onClick={() => {
                                if (deleting !== null)
                                    act.mutate({
                                        id: deleting,
                                        action: "delete",
                                    });
                            }}
                        >
                            {t("editor.review.delete")}
                        </ActionButton>
                    </>
                }
            />
        </section>
    );
}
