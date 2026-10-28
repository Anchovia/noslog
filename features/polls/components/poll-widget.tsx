"use client";

import { Check, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import ActionButton from "@/components/ui/action-button";
import Button from "@/components/ui/button";
import IntentLink from "@/components/ui/intent-link";
import { StatusMessage } from "@/components/ui/status-message";
import { votePoll } from "@/features/polls/server/poll-actions";
import type { PublicPoll } from "@/features/polls/server/poll-service";

/**
 * 글에 붙는 투표 위젯 — 투표 전에는 선택지 줄, 투표 뒤에는 라벨 오른쪽 퍼센트 + 그 아래 막대.
 * 한 개만 고르는 투표는 누르면 바로 반영하고, 여러 개는 「투표하기」 로 모아서 낸다(Discourse 규칙).
 * 로그인하지 않았으면 공개된 결과만 보이고, 결과가 아직 비공개면 제목 줄 끝에 로그인 링크를 둔다.
 */
export default function PollWidget({
    poll,
    isAuthenticated,
}: {
    poll: PublicPoll;
    isAuthenticated: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const pathname = usePathname();
    const [state, setState] = useState(poll);
    const [picked, setPicked] = useState<number[]>(poll.myOptionIds);
    // 고르는 줄은 「투표할 수 있는 사람」 에게만 — 비로그인 · 마감은 결과만 본다
    const [editing, setEditing] = useState(
        isAuthenticated && !poll.closed && poll.myOptionIds.length === 0
    );
    const [pending, startTransition] = useTransition();
    // 즉시 저장 상태(설정 화면과 같다) — 저장 중 · 저장됨 · 실패 + 다시 시도를 목록 아래 한 곳에
    const [saved, setSaved] = useState(false);
    const [failed, setFailed] = useState<{
        message: string;
        optionIds: number[];
        retryable: boolean;
    } | null>(null);

    const voted = state.myOptionIds.length > 0;
    const total = state.options.reduce((sum, option) => sum + option.votes, 0);
    const closed = state.closed;
    const showResults = state.showResults || voted;
    const canVote = isAuthenticated && !closed;
    // 자격이 없는 사람에게 「투표하면 결과가 보입니다」 같은 설명 대신 로그인 길을 둔다
    const loginToVote = !isAuthenticated && !closed && !showResults;

    function send(optionIds: number[]) {
        setSaved(false);
        setFailed(null);
        startTransition(async () => {
            let result: {
                success: boolean;
                message?: string;
                retryable?: boolean;
            };
            try {
                result = await votePoll(state.id, optionIds);
            } catch {
                result = {
                    success: false,
                    message: t("poll.voteFailed"),
                    retryable: true,
                };
            }
            if (!result.success) {
                // 한 개 투표는 누른 줄만 되돌린다 — 여러 개는 고르던 것을 두고 「투표하기」 로 다시 낸다
                if (!state.multiple) setPicked(state.myOptionIds);
                setFailed({
                    message: result.message ?? t("poll.voteFailed"),
                    optionIds,
                    retryable: result.retryable === true,
                });
                return;
            }
            // 내 표만 다시 세어 화면을 맞춘다 — 새로 고치지 않아도 결과가 바뀐다
            setState((prev) => ({
                ...prev,
                myOptionIds: optionIds,
                options: prev.options.map((option) => {
                    const was = prev.myOptionIds.includes(option.id);
                    const now = optionIds.includes(option.id);
                    return {
                        ...option,
                        votes: option.votes + (now ? 1 : 0) - (was ? 1 : 0),
                    };
                }),
                voterCount:
                    prev.voterCount +
                    (prev.myOptionIds.length === 0 && optionIds.length > 0
                        ? 1
                        : 0),
            }));
            setEditing(false);
            setSaved(true);
        });
    }

    function choose(optionId: number) {
        if (!state.multiple) {
            setPicked([optionId]);
            send([optionId]);
            return;
        }
        setPicked((prev) =>
            prev.includes(optionId)
                ? prev.filter((id) => id !== optionId)
                : [...prev, optionId]
        );
    }

    const meta = [
        closed
            ? t("poll.closed")
            : state.closesAt
              ? t("poll.closesOn", {
                    date: new Date(state.closesAt).toLocaleDateString(locale),
                })
              : null,
        state.showVoters ? null : t("poll.anonymous"),
    ].filter(Boolean);

    return (
        <section className="nl-poll" aria-label={t("poll.title")}>
            {loginToVote ? (
                <div className="nl-heading-row">
                    <p className="nl-emphasis-label">{state.question}</p>
                    <IntentLink
                        className="nl-heading-link nl-control"
                        href={href(
                            `/login?returnTo=${encodeURIComponent(pathname)}`
                        )}
                    >
                        {t("community.voteLoginLink")}
                        <ChevronRight aria-hidden />
                    </IntentLink>
                </div>
            ) : (
                <p className="nl-emphasis-label">{state.question}</p>
            )}
            {meta.length ? (
                <p className="nl-metadata nl-muted">{meta.join(" · ")}</p>
            ) : null}

            {!editing && showResults ? (
                <ul className="nl-poll__results">
                    {state.options.map((option) => {
                        const share = total
                            ? Math.round((option.votes / total) * 100)
                            : 0;
                        const mine = state.myOptionIds.includes(option.id);
                        return (
                            <li key={option.id} className="nl-poll__result">
                                <p className="nl-body-secondary nl-poll__label">
                                    <span>
                                        {option.text}
                                        {mine ? (
                                            <Check
                                                className="nl-icon-small"
                                                aria-label={t("poll.myVote")}
                                            />
                                        ) : null}
                                    </span>
                                    <span className="nl-muted">{share}%</span>
                                </p>
                                <span className="nl-poll__bar" aria-hidden>
                                    <i
                                        className="nl-chart-reveal nl-chart-bar"
                                        style={{ width: `${share}%` }}
                                        data-mine={mine || undefined}
                                    />
                                </span>
                            </li>
                        );
                    })}
                </ul>
            ) : loginToVote ? null : !editing ? (
                <p className="nl-body-secondary nl-muted">
                    {t(
                        closed
                            ? "poll.resultsAfterClose"
                            : "poll.resultsAfterVote"
                    )}
                </p>
            ) : (
                <ul className="nl-poll__options">
                    {state.options.map((option) => {
                        const chosen = picked.includes(option.id);
                        return (
                            <li key={option.id}>
                                <button
                                    type="button"
                                    className="nl-poll__option"
                                    aria-pressed={chosen}
                                    disabled={pending || closed}
                                    onClick={() => choose(option.id)}
                                >
                                    {option.text}
                                    {chosen ? (
                                        <Check
                                            className="nl-icon-small"
                                            aria-hidden
                                        />
                                    ) : null}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}

            {failed ? (
                <StatusMessage
                    tone="quiet"
                    severity="danger"
                    role="alert"
                    title={failed.message}
                    action={
                        // 다시 시도는 한 개 투표의 서버 · 연결 실패만 — 여러 개는 「투표하기」 가 지금 고른 것을 다시 낸다
                        failed.retryable && !state.multiple ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={pending}
                                onClick={() => {
                                    setPicked(failed.optionIds);
                                    send(failed.optionIds);
                                }}
                            >
                                {t("common.retry")}
                            </Button>
                        ) : null
                    }
                />
            ) : canVote && !state.multiple ? (
                <p
                    role="status"
                    className={
                        pending || saved
                            ? "nl-body-secondary nl-muted"
                            : "sr-only"
                    }
                >
                    {pending
                        ? t("settings.saving")
                        : saved
                          ? t("settings.saved")
                          : null}
                </p>
            ) : null}

            <div className="nl-poll__foot">
                <span className="nl-metadata nl-muted">
                    {t("poll.voterCount", { count: state.voterCount })}
                </span>
                {/* 여러 개 고르기는 「투표하기」 로 모아서 낸다 · 이미 낸 표는 「다시 고르기」 */}
                {canVote && (editing || !voted) && state.multiple ? (
                    <ActionButton
                        size="sm"
                        busy={pending}
                        disabled={picked.length === 0}
                        onClick={() => send(picked)}
                    >
                        {t("poll.vote")}
                    </ActionButton>
                ) : null}
                {canVote && voted && !editing ? (
                    <ActionButton
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setPicked(state.myOptionIds);
                            setSaved(false);
                            setEditing(true);
                        }}
                    >
                        {t("poll.changeVote")}
                    </ActionButton>
                ) : null}
            </div>
        </section>
    );
}
