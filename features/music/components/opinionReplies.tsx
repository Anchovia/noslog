"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, CornerDownRight } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import type { ReactNode } from "react";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import ActionMenu from "@/components/ui/actionMenu";
import Avatar from "@/components/ui/avatar";
import { SkeletonText } from "@/components/ui/skeleton";
import { StatusMessage } from "@/components/ui/statusMessage";
import { communityReplyOptions } from "@/features/music/api/community";
import useCommunityMutation from "@/features/music/hooks/useCommunityMutation";
import {
    OPINION_REPLY_MAX_LENGTH,
    type OpinionPage,
    type OpinionReply,
} from "@/features/music/schemas/communitySchema";
import DeleteContributionDialog from "./deleteContributionDialog";
import OpinionLike from "./opinionLike";
import useCommunityTranslation from "@/features/music/hooks/useCommunityTranslation";
import ReportOpinionDialog from "./reportOpinionDialog";

type Opinion = OpinionPage["items"][number];

/**
 * 의견 답글(2026-09-22 R1) — 한 단계. 의견 본문 아래 동작 줄(좋아요 · 답글) →
 * 「답글 N개 ⌄」 로 접어 두고, 펼치면 아바타 24 · 본문 열에 맞춘 들여쓰기로 오래된 것부터.
 * 답글에 답하면 같은 줄에 @이름 을 붙여 이어 쓴다. 작성 칸은 그 자리(목록 끝)
 */
export default function OpinionReplies({
    opinion,
    chartId,
    accountId,
    canReply,
    returnTo,
    like,
    translate,
}: {
    opinion: Opinion;
    chartId: number;
    accountId?: number;
    canReply: boolean;
    returnTo: string;
    /** 의견 좋아요 — 지운 의견 자리에는 없다 */
    like: ReactNode;
    /** 의견 번역 보기 — 보는 사람 언어와 다른 글에만 */
    translate?: ReactNode;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const id = useId();
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<string | null>(null);
    const composer = useRef<HTMLTextAreaElement>(null);
    const replies = useQuery({
        ...communityReplyOptions(chartId, opinion.id, accountId),
        enabled: open,
    });
    const writable = canReply && opinion.opinion !== null;
    const startReply = (prefix = "") => {
        setOpen(true);
        setDraft(prefix);
        requestAnimationFrame(() => {
            const input = composer.current;
            if (!input) return;
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        });
    };
    return (
        <>
            <div className="nl-opinion-row__actions">
                {like}
                {translate}
                {opinion.opinion === null ? null : accountId ? (
                    writable ? (
                        <button
                            type="button"
                            className="nl-opinion-like nl-control"
                            onClick={() => startReply()}
                        >
                            <CornerDownRight
                                className="nl-icon-small"
                                aria-hidden
                            />
                            <span>{t("community.reply")}</span>
                        </button>
                    ) : null
                ) : (
                    <Link
                        href={href(
                            `/login?returnTo=${encodeURIComponent(returnTo)}`
                        )}
                        className="nl-opinion-like nl-control"
                        title={t("community.replyLogin")}
                    >
                        <CornerDownRight
                            className="nl-icon-small"
                            aria-hidden
                        />
                        <span>{t("community.reply")}</span>
                    </Link>
                )}
            </div>
            {opinion.replyCount > 0 ? (
                <button
                    type="button"
                    className="nl-opinion-replies__toggle nl-emphasis-label"
                    aria-expanded={open}
                    aria-controls={`${id}-replies`}
                    onClick={() => setOpen(!open)}
                >
                    {open
                        ? t("community.replyHide")
                        : t("community.replyCount", {
                              count: opinion.replyCount,
                          })}
                    {open ? (
                        <ChevronUp className="nl-icon-small" aria-hidden />
                    ) : (
                        <ChevronDown className="nl-icon-small" aria-hidden />
                    )}
                </button>
            ) : null}
            {open ? (
                <div
                    id={`${id}-replies`}
                    className="nl-opinion-replies"
                    aria-busy={replies.isFetching}
                >
                    {replies.isPending ? (
                        [0, 1]
                            .slice(
                                0,
                                Math.max(1, Math.min(2, opinion.replyCount))
                            )
                            .map((index) => <ReplySkeleton key={index} />)
                    ) : replies.isError ? (
                        <StatusMessage
                            severity="danger"
                            role="alert"
                            title={t("community.loadError")}
                        />
                    ) : (
                        replies.data.items.map((reply) => (
                            <ReplyRow
                                key={reply.id}
                                reply={reply}
                                chartId={chartId}
                                evaluationId={opinion.id}
                                accountId={accountId}
                                returnTo={returnTo}
                                translationEnabled={
                                    replies.data.translationEnabled
                                }
                                onReply={
                                    writable
                                        ? () =>
                                              startReply(
                                                  `@${reply.user.username ?? ""} `
                                              )
                                        : undefined
                                }
                            />
                        ))
                    )}
                    {writable && draft !== null ? (
                        <ReplyComposer
                            key={`new-${draft}`}
                            inputRef={composer}
                            chartId={chartId}
                            evaluationId={opinion.id}
                            initial={draft}
                            onDone={() => setDraft(null)}
                        />
                    ) : null}
                </div>
            ) : null}
        </>
    );
}

function ReplyRow({
    reply,
    chartId,
    evaluationId,
    accountId,
    returnTo,
    onReply,
    translationEnabled,
}: {
    reply: OpinionReply;
    chartId: number;
    evaluationId: number;
    accountId?: number;
    returnTo: string;
    onReply?: () => void;
    translationEnabled: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const mutation = useCommunityMutation(chartId);
    const [action, setAction] = useState<"delete" | "report" | null>(null);
    const [editing, setEditing] = useState(false);
    const [reported, setReported] = useState(false);
    const name = reply.user.username ?? t("ranking.unknownPlayer");
    const writtenAt = new Date(reply.createdAt);
    const translation = useCommunityTranslation({
        kind: "reply",
        id: reply.id,
        text: reply.body,
        language: reply.language,
        translations: reply.translations,
        enabled: translationEnabled,
    });
    return (
        <article className="nl-opinion-row" data-reply="">
            <Avatar src={reply.user.avatar} size={24} />
            <div className="nl-opinion-row__content">
                <div className="nl-opinion-row__header">
                    <Link
                        href={href(`/profile/${reply.user.id}`)}
                        className="nl-opinion-row__name nl-emphasis-label"
                    >
                        {name}
                    </Link>
                    <span className="nl-metadata nl-muted">
                        <time
                            dateTime={reply.createdAt}
                            title={writtenAt.toLocaleString(locale)}
                        >
                            {writtenAt.toLocaleDateString(locale, {
                                month: "numeric",
                                day: "numeric",
                                timeZone: "Asia/Seoul",
                            })}
                        </time>
                        {reply.edited ? ` · ${t("community.edited")}` : ""}
                    </span>
                    {accountId ? (
                        <ActionMenu
                            label={t("community.replyActions", { name })}
                            items={
                                reply.own
                                    ? [
                                          {
                                              label: t("community.edit"),
                                              onSelect: () => setEditing(true),
                                          },
                                          {
                                              label: t(
                                                  "community.delete.reply.action"
                                              ),
                                              onSelect: () =>
                                                  setAction("delete"),
                                              destructive: true,
                                          },
                                      ]
                                    : [
                                          {
                                              label: t("community.report"),
                                              onSelect: () =>
                                                  setAction("report"),
                                          },
                                      ]
                            }
                        />
                    ) : null}
                </div>
                {editing ? (
                    <ReplyComposer
                        chartId={chartId}
                        evaluationId={evaluationId}
                        replyId={reply.id}
                        initial={reply.body}
                        onDone={() => setEditing(false)}
                    />
                ) : (
                    <>
                        <p
                            className="nl-body-secondary nl-opinion-row__body"
                            lang={translation.lang}
                        >
                            {translation.text}
                        </p>
                        {translation.note}
                        {translation.error ? (
                            <StatusMessage
                                severity="danger"
                                role="alert"
                                title={translation.error}
                            />
                        ) : null}
                        <div className="nl-opinion-row__actions">
                            <OpinionLike
                                count={reply.likeCount}
                                pressed={reply.viewerLiked}
                                canReact={reply.canReact}
                                signedIn={Boolean(accountId)}
                                loginHref={href(
                                    `/login?returnTo=${encodeURIComponent(returnTo)}`
                                )}
                                pending={mutation.isPending}
                                onToggle={(selected) =>
                                    mutation.mutate({
                                        action: "reply-like",
                                        chartId,
                                        replyId: reply.id,
                                        selected,
                                    })
                                }
                            />
                            {translation.button}
                            {onReply && !reply.own ? (
                                <button
                                    type="button"
                                    className="nl-opinion-like nl-control"
                                    onClick={onReply}
                                >
                                    <CornerDownRight
                                        className="nl-icon-small"
                                        aria-hidden
                                    />
                                    <span>{t("community.reply")}</span>
                                </button>
                            ) : null}
                        </div>
                    </>
                )}
                {mutation.isError ? (
                    <StatusMessage
                        severity="danger"
                        role="alert"
                        title={mutation.error.message}
                    />
                ) : null}
                {reported ? (
                    <p className="nl-body-secondary" role="status">
                        {t("community.reportReceived")}
                    </p>
                ) : null}
            </div>
            <DeleteContributionDialog
                kind="reply"
                open={action === "delete"}
                onOpenChange={(open) => {
                    if (!open) setAction(null);
                }}
                onConfirm={() =>
                    mutation.mutateAsync({
                        action: "reply-delete",
                        chartId,
                        replyId: reply.id,
                    })
                }
                onDeleted={() => setAction(null)}
            />
            {action === "report" ? (
                <ReportOpinionDialog
                    chartId={chartId}
                    replyId={reply.id}
                    accountId={accountId}
                    returnTo={returnTo}
                    onClose={() => setAction(null)}
                    onReported={() => setReported(true)}
                />
            ) : null}
        </article>
    );
}

// 답글 작성 · 고치기 칸 — 의견 작성 칸과 같은 부품 모양(아바타 없이 본문 열에), 글자 수는 의견과 같은 120
function ReplyComposer({
    chartId,
    evaluationId,
    replyId,
    initial,
    inputRef,
    onDone,
}: {
    chartId: number;
    evaluationId: number;
    replyId?: number;
    initial: string;
    inputRef?: React.Ref<HTMLTextAreaElement>;
    onDone: () => void;
}) {
    const t = useTranslations();
    const id = useId();
    const mutation = useCommunityMutation(chartId);
    const [value, setValue] = useState(initial);
    const [error, setError] = useState<string | null>(null);
    const trimmed = value.trim();
    const save = async () => {
        setError(null);
        try {
            await mutation.mutateAsync({
                action: "reply-save",
                chartId,
                evaluationId,
                replyId,
                body: trimmed,
            });
            onDone();
        } catch (reason) {
            setError(
                reason instanceof Error
                    ? reason.message
                    : t("community.action.failed")
            );
        }
    };
    return (
        <div className="nl-opinion-composer" data-inline="">
            <div className="nl-opinion-composer__body">
                <textarea
                    ref={inputRef}
                    id={`${id}-input`}
                    className="nl-input nl-opinion-composer__input"
                    data-expanded=""
                    rows={2}
                    value={value}
                    placeholder={t("community.replyCompose")}
                    aria-label={t("community.replyLabel")}
                    aria-describedby={`${id}-help`}
                    aria-invalid={Boolean(error) || undefined}
                    autoFocus={replyId !== undefined}
                    readOnly={mutation.isPending}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            event.preventDefault();
                            onDone();
                        }
                    }}
                />
                <p
                    id={`${id}-help`}
                    className="nl-opinion-composer__help nl-metadata nl-muted"
                >
                    <span />
                    <span
                        className={
                            value.length > OPINION_REPLY_MAX_LENGTH
                                ? "nl-field__error"
                                : undefined
                        }
                    >
                        {value.length}/{OPINION_REPLY_MAX_LENGTH}
                    </span>
                </p>
                {error ? (
                    <StatusMessage
                        severity="danger"
                        role="alert"
                        title={error}
                    />
                ) : null}
                <div className="nl-opinion-composer__actions">
                    <ActionButton
                        variant="ghost"
                        size="sm"
                        disabled={mutation.isPending}
                        onClick={onDone}
                    >
                        {t("community.cancel")}
                    </ActionButton>
                    <ActionButton
                        size="sm"
                        disabled={
                            !trimmed ||
                            trimmed.length > OPINION_REPLY_MAX_LENGTH
                        }
                        busy={mutation.isPending}
                        busyLabel={t("community.saving")}
                        onClick={() => void save()}
                    >
                        {replyId === undefined
                            ? t("community.replySave")
                            : t("community.saveOpinion")}
                    </ActionButton>
                </div>
            </div>
        </div>
    );
}

// 답글 줄 스켈레톤 — 같은 줄 틀(사진 24 열 + 내용 열 사이 12 · 이름 줄 →4→ 본문)
function ReplySkeleton() {
    return (
        <div className="nl-opinion-row" data-reply="" aria-hidden="true">
            <span className="nl-avatar nl-skeleton" />
            <div className="nl-opinion-row__content">
                <div className="nl-opinion-row__header">
                    <SkeletonText className="nl-emphasis-label" width="s" />
                </div>
                <SkeletonText className="nl-body-secondary" width="l" />
            </div>
        </div>
    );
}
