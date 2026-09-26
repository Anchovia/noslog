"use client";

import { Check, X } from "lucide-react";
import { useId, useRef, useState } from "react";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/formField";
import ModalDialog from "@/components/ui/modalDialog";
import SearchField from "@/components/ui/searchField";
import {
    PINNED_COMMENT_MAX,
    PINNED_RECORD_LIMIT,
    pinnedRecordsValueSchema,
    type PinnableRecord,
} from "@/features/profile/schemas/pinnedRecordSchema";

type Draft = { chartId: number; comment: string };

function parse(value: string): Draft[] {
    const parsed = pinnedRecordsValueSchema.safeParse(value);
    return parsed.success
        ? parsed.data.map((item) => ({
              chartId: item.chartId,
              comment: item.comment ?? "",
          }))
        : [];
}

/**
 * 설정 「프로필」 탭의 「고정 기록」 칸(2026-09-26 S2) — 「프로필 업적」 칸과 같은 모양(값 + 「변경」 → 창, 「저장」 때 함께 저장).
 * 창(2026-09-26 P1) = 고른 것 순번 알약 한 줄(× 로 빼기 · 누르면 그 기록의 한 줄 소감 칸) →12→ 기록 찾기(검색 칸 + 고르기 목록).
 * 빈 값 = 자동(베스트 상위 3곡)
 */
export default function PinnedRecordsPicker({
    records,
    value,
    onChange,
    disabled,
    error,
}: {
    records: readonly PinnableRecord[];
    /** 고른 기록 JSON(폼 값) */
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<Draft[]>([]);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    // 소감을 적는 알약(고른 기록 chartId) — 새로 고르면 그 기록으로
    const [editing, setEditing] = useState<number | null>(null);
    const listId = useId();
    const commentId = useId();
    const changeButton = useRef<HTMLButtonElement>(null);
    const input = useRef<HTMLInputElement>(null);
    const byChart = new Map(records.map((record) => [record.chartId, record]));
    const selected = parse(value).filter((item) => byChart.has(item.chartId));
    const needle = query.normalize("NFKC").trim().toLocaleLowerCase();
    const matches = records.filter((record) =>
        record.title.normalize("NFKC").toLocaleLowerCase().includes(needle)
    );
    const full = draft.length >= PINNED_RECORD_LIMIT;

    function add(record: PinnableRecord) {
        if (draft.some((item) => item.chartId === record.chartId)) {
            setDraft((current) =>
                current.filter((item) => item.chartId !== record.chartId)
            );
            return;
        }
        if (draft.length >= PINNED_RECORD_LIMIT) return;
        setDraft((current) => [
            ...current,
            { chartId: record.chartId, comment: "" },
        ]);
        setEditing(record.chartId);
    }
    const editingIndex = draft.findIndex((item) => item.chartId === editing);
    const editingRecord =
        editingIndex >= 0
            ? byChart.get(draft[editingIndex].chartId)
            : undefined;
    const move = (next: number) => {
        setActive(next);
        document
            .getElementById(`${listId}-${next}`)
            ?.scrollIntoView({ block: "nearest" });
    };

    return (
        <div className="nl-settings__zone">
            <p className="nl-control">{t("profile.pinned.title")}</p>
            <div className="nl-settings__arcade-row">
                {records.length ? (
                    <p className="nl-body">
                        {selected.length ? (
                            selected
                                .map((item) => byChart.get(item.chartId)!.title)
                                .join(" · ")
                        ) : (
                            <span className="nl-metadata nl-muted">
                                {t("profile.pinned.auto")}
                            </span>
                        )}
                    </p>
                ) : (
                    <p className="nl-body nl-muted">
                        {t("profile.noSyncedRecords")}
                    </p>
                )}
                {records.length ? (
                    <div className="nl-settings__actions">
                        <Button
                            ref={changeButton}
                            variant="secondary"
                            disabled={disabled}
                            onClick={() => {
                                setDraft(selected);
                                setEditing(selected[0]?.chartId ?? null);
                                setQuery("");
                                setActive(0);
                                setOpen(true);
                            }}
                        >
                            {t("achievement.settings.change")}
                        </Button>
                    </div>
                ) : null}
            </div>
            <p className="nl-metadata nl-muted">
                {t("profile.pinned.help", { max: PINNED_RECORD_LIMIT })}
            </p>
            {error ? (
                <p role="alert" className="nl-metadata nl-field__error">
                    {error}
                </p>
            ) : null}
            <ModalDialog
                className="nl-settings-dialog"
                open={open}
                onOpenChange={setOpen}
                title={t("profile.pinned.title")}
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    changeButton.current?.focus();
                }}
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                onChange("");
                                setOpen(false);
                            }}
                        >
                            {t("achievement.settings.useAuto")}
                        </Button>
                        <Button
                            onClick={() => {
                                onChange(
                                    draft.length
                                        ? JSON.stringify(
                                              draft.map((item) => ({
                                                  chartId: item.chartId,
                                                  comment:
                                                      item.comment.trim() ||
                                                      null,
                                              }))
                                          )
                                        : ""
                                );
                                setOpen(false);
                            }}
                        >
                            {t("achievement.settings.apply")}
                        </Button>
                    </>
                }
            >
                <div className="nl-pinned-picker">
                    {/* 고른 칩 →8→ 쓰는 법 한 줄(2026-09-26 점검 D2 — 시안 P1: 칩을 눌러 소감) */}
                    <div className="nl-settings__pick-group">
                        <ol className="nl-pick-slots">
                            {Array.from(
                                { length: PINNED_RECORD_LIMIT },
                                (_, index) => {
                                    const item = draft[index];
                                    const record = item
                                        ? byChart.get(item.chartId)
                                        : undefined;
                                    if (!record)
                                        return (
                                            <li
                                                key={`empty-${index}`}
                                                className="nl-pick-slot nl-control"
                                                data-empty
                                            >
                                                {index + 1} ·{" "}
                                                {t(
                                                    "achievement.settings.emptySlot"
                                                )}
                                            </li>
                                        );
                                    return (
                                        <li
                                            key={record.chartId}
                                            className="nl-pick-slot nl-control"
                                            data-active={
                                                editing === record.chartId ||
                                                undefined
                                            }
                                        >
                                            <button
                                                type="button"
                                                className="nl-pick-slot__label"
                                                aria-pressed={
                                                    editing === record.chartId
                                                }
                                                aria-label={t(
                                                    "profile.pinned.commentAria",
                                                    { title: record.title }
                                                )}
                                                onClick={() =>
                                                    setEditing(record.chartId)
                                                }
                                            >
                                                <span>
                                                    {index + 1} · {record.title}
                                                </span>
                                                <span
                                                    className={`nl-metadata nl-level--${record.difficulty.toLowerCase()}`}
                                                >
                                                    {record.difficulty.toUpperCase()}{" "}
                                                    {record.level}
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                className="nl-pick-slot__remove"
                                                aria-label={t(
                                                    "profile.pinned.removeAria",
                                                    { title: record.title }
                                                )}
                                                onClick={() => {
                                                    setDraft((current) =>
                                                        current.filter(
                                                            (_, at) =>
                                                                at !== index
                                                        )
                                                    );
                                                    if (
                                                        editing ===
                                                        record.chartId
                                                    )
                                                        setEditing(null);
                                                }}
                                            >
                                                <X
                                                    className="nl-icon-small"
                                                    aria-hidden
                                                />
                                            </button>
                                        </li>
                                    );
                                }
                            )}
                        </ol>
                        <p className="nl-metadata nl-muted">
                            {t("profile.pinned.dialogHelp", {
                                max: PINNED_RECORD_LIMIT,
                            })}
                        </p>
                    </div>
                    {/* 소감 칸 = 어느 곡인지 보이는 라벨 위(2026-09-26 점검 D3 — 폼 「라벨 위」) */}
                    {editingRecord ? (
                        <FormField
                            id={commentId}
                            label={t("profile.pinned.commentLabel", {
                                title: editingRecord.title,
                            })}
                        >
                            <Input
                                id={commentId}
                                maxLength={PINNED_COMMENT_MAX}
                                value={draft[editingIndex].comment}
                                onChange={(event) => {
                                    const comment = event.target.value;
                                    setDraft((current) =>
                                        current.map((entry, at) =>
                                            at === editingIndex
                                                ? { ...entry, comment }
                                                : entry
                                        )
                                    );
                                }}
                            />
                        </FormField>
                    ) : null}
                    <SearchField
                        ref={input}
                        role="combobox"
                        aria-label={t("profile.pinned.search")}
                        aria-autocomplete="list"
                        aria-controls={listId}
                        aria-expanded={open}
                        aria-activedescendant={
                            matches[active] ? `${listId}-${active}` : undefined
                        }
                        placeholder={t("profile.pinned.search")}
                        value={query}
                        clearLabel={t("discovery.clear")}
                        onClear={() => {
                            setQuery("");
                            setActive(0);
                            input.current?.focus();
                        }}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setActive(0);
                        }}
                        onKeyDown={(event) => {
                            if (
                                event.nativeEvent.isComposing ||
                                !matches.length
                            )
                                return;
                            if (event.key === "ArrowDown") {
                                event.preventDefault();
                                move(Math.min(active + 1, matches.length - 1));
                            }
                            if (event.key === "ArrowUp") {
                                event.preventDefault();
                                move(Math.max(active - 1, 0));
                            }
                            if (event.key === "Enter" && matches[active]) {
                                event.preventDefault();
                                add(matches[active]);
                            }
                        }}
                    />
                    <div className="nl-settings__pick-group">
                        <p role="status" className="nl-metadata nl-muted">
                            {full
                                ? t("profile.pinned.full", {
                                      max: PINNED_RECORD_LIMIT,
                                  })
                                : t("profile.pinned.results", {
                                      count: matches.length.toLocaleString(
                                          locale
                                      ),
                                  })}
                        </p>
                        <div
                            id={listId}
                            role="listbox"
                            aria-label={t("profile.pinned.search")}
                            className="nl-pick-list"
                        >
                            {matches.map((record, index) => {
                                const picked = draft.some(
                                    (item) => item.chartId === record.chartId
                                );
                                return (
                                    <div
                                        key={record.chartId}
                                        id={`${listId}-${index}`}
                                        role="option"
                                        aria-selected={picked}
                                        aria-disabled={
                                            (!picked && full) || undefined
                                        }
                                        data-active={
                                            active === index || undefined
                                        }
                                        className="nl-pick-row"
                                        onMouseDown={(event) =>
                                            event.preventDefault()
                                        }
                                        onClick={() => add(record)}
                                    >
                                        <span className="nl-pick-row__main">
                                            <span className="nl-emphasis-label">
                                                {record.title}
                                            </span>
                                            <span className="nl-metadata nl-muted">
                                                <span
                                                    className={`nl-level--${record.difficulty.toLowerCase()}`}
                                                >
                                                    {record.difficulty.toUpperCase()}{" "}
                                                    {record.level}
                                                </span>
                                                {" · "}
                                                {record.score.toLocaleString(
                                                    locale
                                                )}
                                            </span>
                                        </span>
                                        {picked ? (
                                            <Check
                                                className="nl-icon nl-pick-row__check"
                                                aria-hidden
                                            />
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                        {!matches.length ? (
                            <p className="nl-body-secondary nl-muted">
                                {t("profile.pinned.noResults")}
                            </p>
                        ) : null}
                    </div>
                </div>
            </ModalDialog>
        </div>
    );
}
