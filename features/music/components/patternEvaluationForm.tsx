"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import Disclosure from "@/components/ui/disclosure";
import { foundationButtonClass } from "@/components/ui/Button";
import ScalePicker from "@/components/ui/scalePicker";
import useCommunityMutation from "@/features/music/hooks/useCommunityMutation";
import {
    PATTERN_AXES,
    EMPTY_PATTERN_RATINGS,
} from "@/features/music/schemas/communitySchema";
import type { CommunityData } from "@/features/music/schemas/communitySchema";
import DeleteContributionDialog from "./deleteContributionDialog";
import PatternCriteriaDialog from "./patternCriteriaDialog";

type Ratings = typeof EMPTY_PATTERN_RATINGS;
type Status = "idle" | "saving" | "saved" | "failed";

/** 연달아 누를 때 잠깐 모았다가 한 번에 저장 */
const SAVE_DELAY = 400;

const ratingsOf = (data: CommunityData): Ratings =>
    Object.fromEntries(
        PATTERN_AXES.map((axis) => [
            axis,
            data.currentEvaluation?.[axis] ?? EMPTY_PATTERN_RATINGS[axis],
        ])
    ) as Ratings;

/**
 * 패턴 투표 — 축마다 이름 + 숫자 버튼 0~4. 저장 버튼 없이 누르면 바로 저장(연달아 누르면 모아서 한 번) (2026-09-17 A).
 * 상태는 제목 줄 오른쪽 한 곳(저장 중 · 저장됨 · 실패 + 다시 시도). 같은 숫자를 다시 누르면 그 축만 해제,
 * 「선택 해제」 는 확인창 뒤 모든 축을 지운다. 의견은 같은 행이라 서버에 저장된 의견을 그대로 보낸다.
 */
export default function PatternEvaluationForm({
    chartId,
    data,
    accountId,
    returnTo,
}: {
    chartId: number;
    data: CommunityData;
    accountId?: number;
    returnTo: string;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const id = useId();
    const heading = useRef<HTMLHeadingElement>(null);
    const mutation = useCommunityMutation(chartId);
    const [ratings, setRatings] = useState<Ratings>(() => ratingsOf(data));
    const [status, setStatus] = useState<Status>("idle");
    const [clearing, setClearing] = useState(false);
    const timer = useRef<number | null>(null);
    const pending = useRef<Ratings | null>(null);
    const savedOpinion = data.currentEvaluation?.opinion ?? "";
    const hasSaved = PATTERN_AXES.some(
        (axis) => data.currentEvaluation?.[axis] != null
    );
    const disabled =
        !accountId ||
        !data.canEvaluate ||
        Boolean(data.currentEvaluation?.excluded);

    // 서버 값이 바뀌면(다른 곳에서 저장 · 삭제) 저장 대기 중이 아닐 때만 따라간다
    const serverRatings = ratingsOf(data);
    const serverKey = PATTERN_AXES.map((axis) => serverRatings[axis]).join();
    useEffect(() => {
        if (timer.current !== null || mutation.isPending) return;
        setRatings(ratingsOf(data));
        // serverKey 가 바뀔 때만
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serverKey]);
    // 「저장됨」 은 잠깐만 — 그 뒤엔 제목 줄 오른쪽이 「선택 해제」 로 돌아온다
    useEffect(() => {
        if (status !== "saved") return;
        const handle = window.setTimeout(() => setStatus("idle"), 2000);
        return () => window.clearTimeout(handle);
    }, [status]);
    useEffect(
        () => () => {
            if (timer.current !== null) window.clearTimeout(timer.current);
        },
        []
    );

    const persist = async (next: Ratings) => {
        setStatus("saving");
        try {
            const empty = PATTERN_AXES.every((axis) => next[axis] === null);
            if (empty && !savedOpinion) {
                if (hasSaved)
                    await mutation.mutateAsync({
                        action: "delete-evaluation",
                        chartId,
                    });
            } else {
                await mutation.mutateAsync({
                    action: "save-evaluation",
                    input: { chartId, ...next, opinion: savedOpinion },
                });
            }
            setStatus(pending.current ? "saving" : "saved");
        } catch {
            setStatus("failed");
        }
    };
    const schedule = (next: Ratings) => {
        pending.current = next;
        setStatus("saving");
        if (timer.current !== null) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
            timer.current = null;
            const value = pending.current;
            pending.current = null;
            if (value) void persist(value);
        }, SAVE_DELAY);
    };
    const change = (
        axis: (typeof PATTERN_AXES)[number],
        value: number | null
    ) => {
        const next = { ...ratings, [axis]: value };
        setRatings(next);
        schedule(next);
    };
    const hasAny = PATTERN_AXES.some((axis) => ratings[axis] !== null);

    return (
        <Disclosure
            className="nl-pattern-form"
            heading="section"
            open
            title={t("community.patternVote")}
            titleId={`${id}-title`}
            titleRef={heading}
        >
            {/* 제목 줄이 펼침 줄이 되면서 저장 상태 · 동작은 내용 첫 줄로 (2026-09-18 아코디언).
                같은 줄 왼쪽에 평가 기준 한 줄 + ⓘ(개요와 같은 기준 창) — 잠겨 있어도 보인다 (2026-09-23 B2) */}
            <div className="nl-heading-row nl-pattern-form__status">
                <p className="nl-pattern-form__basis nl-metadata nl-muted">
                    <span>
                        {t("pattern.basisShort")} · <strong>0</strong>{" "}
                        {t("pattern.basisLow")} – <strong>4</strong>{" "}
                        {t("pattern.basisHigh")}
                    </span>
                    <PatternCriteriaDialog />
                </p>
                {!disabled ? (
                    <div
                        className="nl-pattern-form__state"
                        role="status"
                        aria-live="polite"
                    >
                        {status === "saving" ? (
                            <span className="nl-metadata nl-muted">
                                {t("community.saving")}
                            </span>
                        ) : status === "saved" ? (
                            <span className="nl-metadata nl-muted">
                                {t("community.savedShort")}
                            </span>
                        ) : status === "failed" ? (
                            <>
                                <span className="nl-metadata nl-pattern-form__error">
                                    {t("community.saveFailed")}
                                </span>
                                <ActionButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => void persist(ratings)}
                                >
                                    {t("common.retry")}
                                </ActionButton>
                            </>
                        ) : hasAny ? (
                            <ActionButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setClearing(true)}
                            >
                                {t("community.clearRating")}
                            </ActionButton>
                        ) : null}
                    </div>
                ) : null}
            </div>
            {/* 평가할 수 없으면 목록을 흐리고(5px) 가운데 떠 있는 카드로 이유 · 로그인 (2026-09-17 L2).
                흐린 목록은 누를 수도 읽을 수도 없고, 카드만 읽힌다 */}
            <div
                className="nl-pattern-lock"
                data-locked={disabled || undefined}
            >
                <div
                    className="nl-pattern-axes"
                    aria-hidden={disabled || undefined}
                    inert={disabled || undefined}
                >
                    {PATTERN_AXES.map((axis) => (
                        <div key={axis} className="nl-pattern-axis">
                            <span id={`${id}-${axis}`} className="nl-control">
                                {t(`pattern.axis.${axis}`)}
                            </span>
                            <ScalePicker
                                labelId={`${id}-${axis}`}
                                value={ratings[axis]}
                                onChange={(value) => change(axis, value)}
                                disabled={disabled}
                            />
                        </div>
                    ))}
                </div>
                {disabled ? (
                    <div className="nl-pattern-lock__overlay">
                        <div className="nl-pattern-lock__card">
                            <p className="nl-emphasis-label">
                                {t(
                                    !accountId
                                        ? "community.evaluationLogin"
                                        : data.currentEvaluation?.excluded
                                          ? "community.action.unavailable"
                                          : "community.evaluationRecord"
                                )}
                            </p>
                            {!accountId ? (
                                <Link
                                    href={href(
                                        `/login?returnTo=${encodeURIComponent(returnTo)}`
                                    )}
                                    className={foundationButtonClass({
                                        variant: "primary",
                                        size: "sm",
                                    })}
                                >
                                    {t("common.login")}
                                </Link>
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
            <DeleteContributionDialog
                kind="evaluation"
                open={clearing}
                onOpenChange={setClearing}
                onConfirm={async () => {
                    if (timer.current !== null) {
                        window.clearTimeout(timer.current);
                        timer.current = null;
                        pending.current = null;
                    }
                    const empty = { ...EMPTY_PATTERN_RATINGS };
                    if (savedOpinion)
                        await mutation.mutateAsync({
                            action: "save-evaluation",
                            input: { chartId, ...empty, opinion: savedOpinion },
                        });
                    else if (hasSaved)
                        await mutation.mutateAsync({
                            action: "delete-evaluation",
                            chartId,
                        });
                    setRatings(empty);
                    setStatus("idle");
                }}
                onDeleted={() => heading.current?.focus()}
            />
        </Disclosure>
    );
}
