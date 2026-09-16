"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import Avatar from "@/components/ui/avatar";
import { StatusMessage } from "@/components/ui/statusMessage";
import useCommunityMutation from "@/features/music/hooks/useCommunityMutation";
import {
    EMPTY_PATTERN_RATINGS,
    PATTERN_AXES,
} from "@/features/music/schemas/communitySchema";
import type { CommunityData } from "@/features/music/schemas/communitySchema";

const LIMIT = 120;

/**
 * 의견 작성 칸 — 의견 구역 맨 위(새 의견) 또는 내 의견 줄 안(수정).
 * 쉬는 상태는 아바타 32 + 한 줄 입력(L), 누르면 여러 줄 · 글자 수 · 「취소 · 의견 저장」(M)으로 펼친다(2026-09-16 C1).
 * 의견은 패턴 평가와 같은 행에 저장되므로, 저장할 때 슬라이더는 서버에 저장돼 있던 값을 그대로 보낸다 — 이 칸은 의견만 바꾼다.
 */
export default function OpinionComposer({
    chartId,
    data,
    accountId,
    avatar,
    returnTo,
    inline = false,
    onDone,
}: {
    chartId: number;
    data: CommunityData;
    accountId?: number;
    avatar?: string | null;
    returnTo: string;
    /** 내 의견 줄 안에서 고칠 때 — 아바타 없이 처음부터 펼친다 */
    inline?: boolean;
    onDone?: () => void;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const id = useId();
    const saved = data.currentEvaluation?.opinion ?? "";
    const [value, setValue] = useState(inline ? saved : "");
    const [focused, setFocused] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const container = useRef<HTMLDivElement>(null);
    const mutation = useCommunityMutation(chartId);
    if (!accountId || !data.canEvaluate || data.currentEvaluation?.excluded)
        return (
            <p className="nl-body-secondary nl-muted">
                {t(
                    !accountId
                        ? "community.opinionLogin"
                        : data.currentEvaluation?.excluded
                          ? "community.action.unavailable"
                          : "community.opinionRecord"
                )}
                {!accountId ? (
                    <>
                        {" "}
                        <Link
                            className="nl-link"
                            href={href(
                                `/login?returnTo=${encodeURIComponent(returnTo)}`
                            )}
                        >
                            {t("common.login")}
                        </Link>
                    </>
                ) : null}
            </p>
        );
    const expanded = inline || focused || value !== "";
    const trimmed = value.trim();
    const close = () => {
        setValue(inline ? saved : "");
        setError(null);
        setFocused(false);
        onDone?.();
    };
    const save = async () => {
        if (trimmed.length > LIMIT) {
            setError(t("community.opinionTooLong"));
            return;
        }
        setError(null);
        try {
            if (!trimmed && saved) {
                await mutation.mutateAsync({
                    action: "delete-opinion",
                    chartId,
                });
            } else {
                const ratings = Object.fromEntries(
                    PATTERN_AXES.map((axis) => [
                        axis,
                        data.currentEvaluation?.[axis] ??
                            EMPTY_PATTERN_RATINGS[axis],
                    ])
                ) as typeof EMPTY_PATTERN_RATINGS;
                await mutation.mutateAsync({
                    action: "save-evaluation",
                    input: { chartId, ...ratings, opinion: trimmed },
                });
            }
            setValue("");
            setFocused(false);
            onDone?.();
        } catch (reason) {
            setError(
                reason instanceof Error
                    ? reason.message
                    : t("community.action.failed")
            );
        }
    };
    return (
        <div
            ref={container}
            className="nl-opinion-composer"
            data-inline={inline || undefined}
            onBlur={(event) => {
                if (!container.current?.contains(event.relatedTarget as Node))
                    setFocused(false);
            }}
        >
            {inline ? null : <Avatar src={avatar} size={32} />}
            <div className="nl-opinion-composer__body">
                <textarea
                    id={`${id}-input`}
                    className="nl-input nl-opinion-composer__input"
                    data-expanded={expanded || undefined}
                    rows={expanded ? 3 : 1}
                    value={value}
                    placeholder={t("community.opinionCompose")}
                    aria-label={t("community.opinionLabel")}
                    aria-describedby={expanded ? `${id}-help` : undefined}
                    aria-invalid={Boolean(error) || undefined}
                    autoFocus={inline}
                    disabled={mutation.isPending}
                    onFocus={() => setFocused(true)}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            event.preventDefault();
                            close();
                        }
                    }}
                />
                {expanded ? (
                    <>
                        <p
                            id={`${id}-help`}
                            className="nl-opinion-composer__help nl-metadata nl-muted"
                        >
                            <span>{t("community.opinionLimit")}</span>
                            <span
                                className={
                                    value.length > LIMIT
                                        ? "nl-field__error"
                                        : undefined
                                }
                            >
                                {value.length}/{LIMIT}
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
                                onClick={close}
                            >
                                {t("community.cancel")}
                            </ActionButton>
                            <ActionButton
                                size="sm"
                                disabled={!trimmed && !saved}
                                busy={mutation.isPending}
                                onClick={() => void save()}
                            >
                                {t("community.saveOpinion")}
                            </ActionButton>
                        </div>
                    </>
                ) : null}
            </div>
            <span className="sr-only" role="status">
                {mutation.isSuccess ? t("community.action.saved") : ""}
            </span>
        </div>
    );
}
