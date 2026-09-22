"use client";

import { Check } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import { votePoll } from "@/features/polls/server/pollActions";
import type { PublicPoll } from "@/features/polls/server/pollService";

/**
 * 글에 붙는 투표 위젯 (2026-09-23 R1) — 투표 전에는 선택지 줄, 투표 뒤에는 라벨 오른쪽 퍼센트 + 그 아래 막대.
 * 한 개만 고르는 투표는 누르면 바로 반영하고, 여러 개는 「투표하기」 로 모아서 낸다(Discourse 규칙).
 * 로그인하지 않았으면 결과만 보이고 누르면 로그인 안내.
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
    const [state, setState] = useState(poll);
    const [picked, setPicked] = useState<number[]>(poll.myOptionIds);
    // 고르는 줄은 「투표할 수 있는 사람」 에게만 — 비로그인 · 마감은 결과만 본다(2026-09-23 R1)
    const [editing, setEditing] = useState(
        isAuthenticated && !poll.closed && poll.myOptionIds.length === 0
    );
    const [pending, startTransition] = useTransition();

    const voted = state.myOptionIds.length > 0;
    const total = state.options.reduce((sum, option) => sum + option.votes, 0);
    const closed = state.closed;
    const showResults = state.showResults || voted;
    const canVote = isAuthenticated && !closed;

    function send(optionIds: number[]) {
        startTransition(async () => {
            const result = await votePoll(state.id, optionIds);
            if (!result.success) {
                toast.error(result.message);
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
        });
    }

    function choose(optionId: number) {
        if (!canVote) {
            if (!isAuthenticated) toast.error(t("poll.loginToVote"));
            return;
        }
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
            <p className="nl-emphasis-label">{state.question}</p>
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
                                                aria-label={t("poll.vote")}
                                            />
                                        ) : null}
                                    </span>
                                    <span className="nl-muted">{share}%</span>
                                </p>
                                <span className="nl-poll__bar" aria-hidden>
                                    <i
                                        style={{ width: `${share}%` }}
                                        data-mine={mine || undefined}
                                    />
                                </span>
                            </li>
                        );
                    })}
                </ul>
            ) : !editing ? (
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
