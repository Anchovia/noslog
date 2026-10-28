"use client";

import { useId, useRef, useState } from "react";

import { useTranslations } from "@/components/i18n/locale-provider";
import ActionButton from "@/components/ui/action-button";
import Avatar from "@/components/ui/avatar";
import { StatusMessage } from "@/components/ui/status-message";
import useCommunityMutation from "@/features/music/hooks/use-community-mutation";
import type { CommunityData } from "@/features/music/schemas/community-schema";
import {
    EMPTY_PATTERN_RATINGS,
    PATTERN_AXES,
} from "@/features/music/schemas/community-schema";

const LIMIT = 120;

/**
 * 의견 작성 칸 — 의견 구역 맨 위(새 의견) 또는 내 의견 줄 안(수정).
 * 쉬는 상태는 아바타 32 + 한 줄 입력(L), 누르면 여러 줄 · 글자 수 · 「취소 · 의견 작성」(M)으로 펼친다.
 * 의견은 패턴 평가와 같은 행에 저장되므로, 저장할 때 슬라이더는 서버에 저장돼 있던 값을 그대로 보낸다 — 이 칸은 의견만 바꾼다.
 */
export default function OpinionComposer({
    chartId,
    data,
    avatar,
    inline = false,
    first = false,
    onDone,
}: {
    chartId: number;
    data: CommunityData;
    avatar?: string | null;
    /** 내 의견 줄 안에서 고칠 때 — 아바타 없이 처음부터 펼친다 */
    inline?: boolean;
    /** 아직 의견이 하나도 없을 때 — 빈 안내 문장 대신 자리표시자가 할 일을 말한다 */
    first?: boolean;
    onDone?: () => void;
}) {
    const t = useTranslations();
    const id = useId();
    const saved = data.currentEvaluation?.opinion ?? "";
    const [value, setValue] = useState(inline ? saved : "");
    const [focused, setFocused] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const container = useRef<HTMLDivElement>(null);
    const mutation = useCommunityMutation(chartId);
    // 로그아웃이면 패널이 작성 칸 대신 제목 줄 로그인 링크를 둔다 — 여기는 로그인한 사람만 온다
    if (!data.canEvaluate || data.currentEvaluation?.excluded)
        return (
            <p className="nl-body-secondary nl-muted">
                {t(
                    data.currentEvaluation?.excluded
                        ? "community.action.unavailable"
                        : "community.opinionRecord"
                )}
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
        // 버튼은 늘 켜 두고 빈 값 · 넘친 값은 칸 아래 오류로 알린다
        if (!trimmed && !saved) {
            setError(t("community.opinionEmpty"));
            return;
        }
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
            {inline ? null : <Avatar src={avatar} size="compact" />}
            <div className="nl-opinion-composer__body">
                <textarea
                    id={`${id}-input`}
                    className="nl-input nl-opinion-composer__input"
                    data-expanded={expanded || undefined}
                    rows={expanded ? 3 : 1}
                    value={value}
                    placeholder={t(
                        first
                            ? "community.opinionFirst"
                            : "community.opinionCompose"
                    )}
                    aria-label={t("community.opinionLabel")}
                    aria-describedby={expanded ? `${id}-help` : undefined}
                    aria-invalid={Boolean(error) || undefined}
                    autoFocus={inline}
                    // 저장 중에도 비활성 면으로 바꾸지 않는다 — 고칠 수만 없게(바쁨은 비활성이 아니다)
                    readOnly={mutation.isPending}
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
                                busy={mutation.isPending}
                                busyLabel={t("community.saving")}
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
