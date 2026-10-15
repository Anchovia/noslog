"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useId, useRef, useState } from "react";

import ActionButton from "@/components/ui/action-button";
import Disclosure from "@/components/ui/disclosure";
import { FormField, Input } from "@/components/ui/form-field";
import SearchField from "@/components/ui/search-field";
import { Select } from "@/components/ui/select";
import { LoadingStatus } from "@/components/ui/skeleton";
import { StatusMessage } from "@/components/ui/status-message";
import {
    createTierChangeImage,
    tierChangeImageAlt,
} from "@/features/announcements/lib/tier-change-image";
import {
    type TierChangeImageData,
    tierChangeImageSchema,
} from "@/features/announcements/schemas/tier-change-image-schema";
import { searchPreviewOptions } from "@/features/music/api/search-preview";
import type { MusicResult } from "@/features/music/schemas/music-result-schema";
import type { SearchPreview } from "@/features/music/schemas/search-preview-schema";
import useDebouncedValue from "@/lib/hooks/use-debounced-value";
import type { Locale } from "@/lib/i18n/routing";
import {
    MAX_TIER_VALUE,
    MIN_TIER_VALUE,
    TIER_DIFFICULTIES,
    TIER_MODE_GOALS,
    type TierDifficulty,
    type TierGoal,
    tierGoalLabels,
    type TierMode,
} from "@/lib/tiers";

type DraftRow = {
    id: number;
    musicIndex: string;
    title: string;
    difficulty: TierDifficulty;
    level: number;
    choices: { value: TierDifficulty; label: string; level: number }[];
    before: string;
    after: string;
};
function chartChoices(music: MusicResult) {
    return TIER_DIFFICULTIES.flatMap((difficulty) => {
        const level =
            music[
                difficulty.toLowerCase() as
                    "normal" | "hard" | "expert" | "real"
            ];
        return level && level > 0
            ? [{ value: difficulty, label: `${difficulty} Lv.${level}`, level }]
            : [];
    });
}
function today() {
    return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(
        new Date()
    );
}

/** 공지 편집기의 생성 칸. 미리보기는 로컬이며 명시적인 첨부만 onAttach를 호출한다. */
export default function TierChangeImageBuilder({
    locale,
    onAttach,
    onBusyChange,
    disabled = false,
    initialData,
    searchMusics,
}: {
    locale: Locale;
    onAttach: (file: File, data: TierChangeImageData) => Promise<void>;
    onBusyChange?: (busy: boolean) => void;
    disabled?: boolean;
    /** 저장된 생성용 데이터 또는 격리된 스토리 입력. 실제 서열표는 수정하지 않는다. */
    initialData?: TierChangeImageData;
    /** 스토리에서 검색만 격리하는 어댑터. 기본은 기존 공개 음악 검색이다. */
    searchMusics?: (
        query: string,
        signal: AbortSignal
    ) => Promise<SearchPreview>;
}) {
    const id = useId();
    const [mode, setMode] = useState<TierMode>(initialData?.mode ?? "basic");
    const [goal, setGoal] = useState<TierGoal>(initialData?.goal ?? "pianist");
    const [date, setDate] = useState(initialData?.date ?? today());
    const [rows, setRows] = useState<DraftRow[]>(
        () =>
            initialData?.rows.map((row, index) => ({
                ...row,
                id: index,
                before: row.before.toFixed(1),
                after: row.after.toFixed(1),
                choices: [
                    {
                        value: row.difficulty,
                        label: `${row.difficulty} Lv.${row.level}`,
                        level: row.level,
                    },
                ],
            })) ?? []
    );
    const nextId = useRef(rows.length);
    const [search, setSearch] = useState("");
    const debounced = useDebouncedValue(search.trim(), 300);
    const currentSearch = search.trim() === debounced && !!debounced;
    const options = searchPreviewOptions({
        q: debounced,
        scope: "music",
        locale: "ja",
    });
    const query = useQuery({
        ...options,
        ...(searchMusics
            ? {
                  queryFn: ({ signal }: { signal: AbortSignal }) =>
                      searchMusics(debounced, signal),
              }
            : {}),
        enabled: !!currentSearch,
    });
    const [preview, setPreview] = useState<{
        file: File;
        data: TierChangeImageData;
        url: string;
    } | null>(null);
    const previewUrl = useRef<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState<"generate" | "attach" | null>(null);
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
    function editRow(rowId: number, patch: Partial<DraftRow>) {
        invalidate();
        setRows((current) =>
            current.map((row) =>
                row.id === rowId ? { ...row, ...patch } : row
            )
        );
    }
    async function run(kind: "generate" | "attach") {
        if (lock.current || disabled) return;
        lock.current = true;
        setBusy(kind);
        onBusyChange?.(true);
        setError(null);
        try {
            if (kind === "attach") {
                if (!preview) return;
                await onAttach(preview.file, preview.data);
            } else {
                const parsed = tierChangeImageSchema.safeParse({
                    mode,
                    goal,
                    date,
                    rows,
                });
                if (!parsed.success) {
                    setError(
                        parsed.error.issues
                            .map((issue) => {
                                const position =
                                    typeof issue.path[1] === "number"
                                        ? `곡 ${issue.path[1] + 1}: `
                                        : "";
                                return position + issue.message;
                            })
                            .join(" · ")
                    );
                    return;
                }
                const file = await createTierChangeImage(parsed.data);
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
        <Disclosure title="서열 변경 이미지" className="nl-admin-form__section">
            <div className="nl-admin-form__section">
                <p className="nl-body-secondary nl-muted">
                    곡을 고르고 변경 전후 값을 입력하면 기존 공지 양식으로
                    만듭니다. 미리보기는 업로드하지 않습니다.
                </p>
                <fieldset
                    disabled={disabled || busy !== null}
                    className="nl-admin-form__section m-0 min-w-0 border-0 p-0"
                >
                    <legend className="sr-only">서열 변경 이미지 입력</legend>
                    <div className="nl-admin-form__grid">
                        <FormField id={`${id}-mode`} label="모드">
                            <Select
                                id={`${id}-mode`}
                                value={mode}
                                options={[
                                    { value: "basic", label: "Basic" },
                                    { value: "recital", label: "Recital" },
                                ]}
                                onValueChange={(value) => {
                                    invalidate();
                                    setMode(value as TierMode);
                                    if (value === "recital") setGoal("pianist");
                                }}
                            />
                        </FormField>
                        <FormField id={`${id}-goal`} label="목표">
                            <Select
                                id={`${id}-goal`}
                                value={goal}
                                options={TIER_MODE_GOALS[mode].map((value) => ({
                                    value,
                                    label: tierGoalLabels[value],
                                }))}
                                onValueChange={(value) => {
                                    invalidate();
                                    setGoal(value as TierGoal);
                                }}
                            />
                        </FormField>
                        <FormField id={`${id}-date`} label="변경 날짜">
                            <Input
                                id={`${id}-date`}
                                type="date"
                                value={date}
                                onChange={(event) => {
                                    invalidate();
                                    setDate(event.target.value);
                                }}
                            />
                        </FormField>
                    </div>
                    <FormField id={`${id}-search`} label="곡 추가">
                        <SearchField
                            id={`${id}-search`}
                            value={search}
                            maxLength={100}
                            onChange={(event) => setSearch(event.target.value)}
                            onClear={() => setSearch("")}
                            clearLabel="곡 검색 지우기"
                            placeholder="곡 제목 · 아티스트"
                        />
                    </FormField>
                    {currentSearch && query.isError ? (
                        <StatusMessage
                            severity="danger"
                            title="곡을 검색하지 못했습니다."
                            role="alert"
                            action={
                                <ActionButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => void query.refetch()}
                                >
                                    다시 검색
                                </ActionButton>
                            }
                        />
                    ) : null}
                    {currentSearch && query.isFetching ? (
                        <LoadingStatus label="곡 검색 중" />
                    ) : null}
                    {currentSearch && query.data ? (
                        <div
                            className="nl-admin-form__section"
                            role="group"
                            aria-label="곡 검색 결과"
                        >
                            {query.data.items.map((music) => (
                                <ActionButton
                                    key={music.index}
                                    variant="ghost"
                                    onClick={() => {
                                        const choices = chartChoices(music),
                                            selected =
                                                choices.find(
                                                    (choice) =>
                                                        choice.value ===
                                                        "Expert"
                                                ) ?? choices[0];
                                        if (!selected) {
                                            setError(
                                                "등록된 채보가 없는 곡입니다."
                                            );
                                            return;
                                        }
                                        invalidate();
                                        const row = {
                                            id: nextId.current++,
                                            musicIndex: music.index,
                                            title: music.title,
                                            difficulty: selected.value,
                                            level: selected.level,
                                            choices,
                                            before: "",
                                            after: "",
                                        };
                                        setRows((current) => [...current, row]);
                                        setSearch("");
                                    }}
                                >
                                    {music.title}
                                    {music.artist ? ` · ${music.artist}` : ""}
                                </ActionButton>
                            ))}
                            {!query.data.items.length ? (
                                <p className="nl-body-secondary nl-muted">
                                    검색 결과가 없습니다.
                                </p>
                            ) : null}
                            {query.data.total > query.data.items.length ? (
                                <p className="nl-metadata nl-muted">
                                    상위 5개 결과입니다. 곡 제목을 더 입력해
                                    좁혀주세요.
                                </p>
                            ) : null}
                        </div>
                    ) : null}
                    {rows.map((row, index) => (
                        <section
                            className="nl-admin-form__section"
                            key={row.id}
                            aria-labelledby={`${id}-row-${row.id}`}
                        >
                            <div className="flex items-center justify-between gap-nl-16">
                                <h3
                                    id={`${id}-row-${row.id}`}
                                    className="nl-component-title"
                                >
                                    {index + 1}. {row.title}
                                </h3>
                                <ActionButton
                                    variant="ghost"
                                    size="sm"
                                    aria-label={`${row.title} 제거`}
                                    onClick={() => {
                                        invalidate();
                                        setRows((current) =>
                                            current.filter(
                                                (item) => item.id !== row.id
                                            )
                                        );
                                    }}
                                >
                                    제거
                                </ActionButton>
                            </div>
                            <FormField
                                id={`${id}-difficulty-${row.id}`}
                                label={`${row.title} 난이도`}
                            >
                                <Select
                                    id={`${id}-difficulty-${row.id}`}
                                    value={row.difficulty}
                                    options={row.choices}
                                    onValueChange={(value) => {
                                        const choice = row.choices.find(
                                            (item) => item.value === value
                                        );
                                        if (choice)
                                            editRow(row.id, {
                                                difficulty: choice.value,
                                                level: choice.level,
                                            });
                                    }}
                                />
                            </FormField>
                            <div className="nl-admin-form__grid">
                                {(["before", "after"] as const).map((field) => (
                                    <FormField
                                        key={field}
                                        id={`${id}-${field}-${row.id}`}
                                        label={`${row.title} ${field === "before" ? "변경 전" : "변경 후"}`}
                                    >
                                        <Input
                                            id={`${id}-${field}-${row.id}`}
                                            type="number"
                                            inputMode="decimal"
                                            min={MIN_TIER_VALUE}
                                            max={MAX_TIER_VALUE}
                                            step="0.1"
                                            value={row[field]}
                                            onChange={(event) =>
                                                editRow(row.id, {
                                                    [field]: event.target.value,
                                                })
                                            }
                                        />
                                    </FormField>
                                ))}
                            </div>
                        </section>
                    ))}
                    {!rows.length ? (
                        <p className="nl-body-secondary nl-muted">
                            추가한 곡이 없습니다.
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
                    busyLabel="이미지 만드는 중"
                    onClick={() => run("generate")}
                >
                    이미지 미리보기
                </ActionButton>
                {preview ? (
                    <div className="nl-admin-form__section">
                        {/* 생성 PNG의 원본 비율만 줄인다. 관리자 UI의 크기·색·간격은 바꾸지 않는다. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={preview.url}
                            alt={tierChangeImageAlt(preview.data, locale)}
                            className="block h-auto w-full"
                        />
                        <ActionButton
                            disabled={disabled || busy === "generate"}
                            busy={busy === "attach"}
                            busyLabel="이미지 첨부 중"
                            onClick={() => run("attach")}
                        >
                            현재 언어 본문에 이미지 첨부
                        </ActionButton>
                        <p className="nl-metadata nl-muted">
                            {locale.toUpperCase()} 본문 끝에 첨부합니다. 공지
                            저장·게시와 실제 서열표 변경은 별도입니다.
                        </p>
                    </div>
                ) : null}
            </div>
        </Disclosure>
    );
}
