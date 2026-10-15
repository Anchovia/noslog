"use client";

import { useEffect, useId, useRef, useState } from "react";

import ActionButton from "@/components/ui/action-button";
import Disclosure from "@/components/ui/disclosure";
import { FormField, Input } from "@/components/ui/form-field";
import { StatusMessage } from "@/components/ui/status-message";
import {
    createTierRebalanceImage,
    TIER_REBALANCE_2026_10_08,
    tierRebalanceImageAlt,
    tierRebalanceTotals,
} from "@/features/announcements/lib/tier-rebalance-image";
import {
    TIER_REBALANCE_LABELS,
    type TierRebalanceImageData,
    tierRebalanceImageSchema,
} from "@/features/announcements/schemas/tier-rebalance-image-schema";
import type { Locale } from "@/lib/i18n/routing";

const fields = ["changed", "added", "beforeMax", "afterMax"] as const;
const labels = {
    changed: "값 변경",
    added: "신규",
    beforeMax: "변경 전 구간별 최대 채보 수",
    afterMax: "변경 후 구간별 최대 채보 수",
};
function draft(data?: TierRebalanceImageData) {
    return {
        date:
            data?.date ??
            new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(
                new Date()
            ),
        chartsPerTier: data ? String(data.chartsPerTier) : "",
        rows: TIER_REBALANCE_LABELS.map(
            (_, index) =>
                Object.fromEntries(
                    fields.map((field) => [
                        field,
                        data ? String(data.rows[index][field]) : "",
                    ])
                ) as Record<(typeof fields)[number], string>
        ),
    };
}
export default function TierRebalanceImageBuilder({
    locale,
    onAttach,
    onBusyChange,
    disabled = false,
    initialData,
}: {
    locale: Locale;
    onAttach: (file: File, data: TierRebalanceImageData) => Promise<void>;
    onBusyChange?: (busy: boolean) => void;
    disabled?: boolean;
    initialData?: TierRebalanceImageData;
}) {
    const id = useId();
    const [input, setInput] = useState(() => draft(initialData));
    const [preview, setPreview] = useState<{
        file: File;
        data: TierRebalanceImageData;
        url: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState<"generate" | "attach" | null>(null);
    const previewUrl = useRef<string | null>(null);
    const lock = useRef(false);
    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
        };
    }, []);
    function invalidate() {
        if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
        previewUrl.current = null;
        setPreview(null);
        setError(null);
    }
    const parsed = tierRebalanceImageSchema.safeParse(input);
    const totals = parsed.success ? tierRebalanceTotals(parsed.data) : null;
    async function run(kind: "generate" | "attach") {
        if (lock.current || disabled) return;
        lock.current = true;
        setBusy(kind);
        onBusyChange?.(true);
        setError(null);
        try {
            if (kind === "attach") {
                if (preview) await onAttach(preview.file, preview.data);
            } else {
                if (!parsed.success) {
                    setError(
                        parsed.error.issues
                            .map(
                                (issue) =>
                                    `${typeof issue.path[1] === "number" ? `${TIER_REBALANCE_LABELS[issue.path[1]]}: ` : ""}${issue.message}`
                            )
                            .join(" · ")
                    );
                    return;
                }
                const file = await createTierRebalanceImage(parsed.data);
                if (!mounted.current) return;
                if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
                const url = URL.createObjectURL(file);
                previewUrl.current = url;
                setPreview({ file, data: parsed.data, url });
            }
        } catch (failure) {
            if (mounted.current)
                setError(
                    failure instanceof Error
                        ? failure.message
                        : "이미지를 만들거나 첨부하지 못했습니다."
                );
        } finally {
            lock.current = false;
            if (mounted.current) setBusy(null);
            onBusyChange?.(false);
        }
    }
    return (
        <Disclosure
            title="서열 전체 재배치 요약 이미지"
            className="nl-admin-form__section"
        >
            <div className="nl-admin-form__section">
                <p className="nl-body-secondary nl-muted">
                    네 서열표의 전체 재배치를 한글 요약 이미지 한 장으로
                    만듭니다. 곡별 전체 변경 내역은 CSV 링크로 함께 안내하세요.
                </p>
                <fieldset
                    disabled={disabled || busy !== null}
                    className="nl-admin-form__section m-0 min-w-0 border-0 p-0"
                >
                    <legend className="sr-only">전체 재배치 요약 입력</legend>
                    <ActionButton
                        variant="secondary"
                        onClick={() => {
                            invalidate();
                            setInput(draft(TIER_REBALANCE_2026_10_08));
                        }}
                    >
                        2026-10-08 재배치 값 불러오기
                    </ActionButton>
                    <div className="nl-admin-form__grid">
                        <FormField id={`${id}-date`} label="요약 변경 날짜">
                            <Input
                                id={`${id}-date`}
                                type="date"
                                value={input.date}
                                onChange={(event) => {
                                    invalidate();
                                    setInput({
                                        ...input,
                                        date: event.target.value,
                                    });
                                }}
                            />
                        </FormField>
                        <FormField
                            id={`${id}-charts`}
                            label="서열표마다 채보 수"
                        >
                            <Input
                                id={`${id}-charts`}
                                type="number"
                                inputMode="numeric"
                                min={1}
                                step={1}
                                value={input.chartsPerTier}
                                onChange={(event) => {
                                    invalidate();
                                    setInput({
                                        ...input,
                                        chartsPerTier: event.target.value,
                                    });
                                }}
                            />
                        </FormField>
                    </div>
                    {TIER_REBALANCE_LABELS.map((label, index) => (
                        <section
                            key={label}
                            className="nl-admin-form__section"
                            aria-labelledby={`${id}-row-${index}`}
                        >
                            <h3
                                id={`${id}-row-${index}`}
                                className="nl-component-title"
                            >
                                {label}
                            </h3>
                            <div className="nl-admin-form__grid">
                                {fields.map((field) => (
                                    <FormField
                                        key={field}
                                        id={`${id}-${index}-${field}`}
                                        label={`${label} ${labels[field]}`}
                                    >
                                        <Input
                                            id={`${id}-${index}-${field}`}
                                            type="number"
                                            inputMode="numeric"
                                            min={0}
                                            step={1}
                                            value={input.rows[index][field]}
                                            onChange={(event) => {
                                                invalidate();
                                                setInput({
                                                    ...input,
                                                    rows: input.rows.map(
                                                        (row, position) =>
                                                            position === index
                                                                ? {
                                                                      ...row,
                                                                      [field]:
                                                                          event
                                                                              .target
                                                                              .value,
                                                                  }
                                                                : row
                                                    ),
                                                });
                                            }}
                                        />
                                    </FormField>
                                ))}
                            </div>
                        </section>
                    ))}
                    {totals ? (
                        <p className="nl-body-secondary nl-muted">
                            총 {totals.total.toLocaleString("ko-KR")}개 배치 ·
                            값 변경 {totals.changed.toLocaleString("ko-KR")}건 ·
                            신규 {totals.added.toLocaleString("ko-KR")}건 · 값
                            유지 {totals.retained.toLocaleString("ko-KR")}건
                        </p>
                    ) : null}
                </fieldset>
                {error ? (
                    <StatusMessage
                        severity="danger"
                        title={error}
                        role="alert"
                    />
                ) : null}
                <ActionButton
                    variant="secondary"
                    disabled={disabled || busy === "attach"}
                    busy={busy === "generate"}
                    busyLabel="요약 이미지 만드는 중"
                    onClick={() => run("generate")}
                >
                    요약 이미지 미리보기
                </ActionButton>
                {preview ? (
                    <div className="nl-admin-form__section">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={preview.url}
                            alt={tierRebalanceImageAlt(preview.data, locale)}
                            className="block h-auto w-full"
                        />
                        <ActionButton
                            disabled={disabled || busy === "generate"}
                            busy={busy === "attach"}
                            busyLabel="요약 이미지 첨부 중"
                            onClick={() => run("attach")}
                        >
                            현재 언어 본문에 요약 이미지 첨부
                        </ActionButton>
                        <p className="nl-metadata nl-muted">
                            {locale.toUpperCase()} 본문 끝에 첨부합니다. 이미지
                            글자는 한글이며 대체 설명은 현재 언어로 작성됩니다.
                            미리보기는 업로드하지 않습니다.
                        </p>
                    </div>
                ) : null}
            </div>
        </Disclosure>
    );
}
