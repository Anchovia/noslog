"use client";

import { useId, useRef, useState } from "react";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/formField";
import ModalDialog from "@/components/ui/modalDialog";
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
 * 창 = 고른 3칸(고른 순서 · 칸마다 한 줄 소감 입력 · 빼기) →12→ 기록 찾기(선호 오락실 창과 같은 검색 목록).
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
    const listId = useId();
    const changeButton = useRef<HTMLButtonElement>(null);
    const input = useRef<HTMLInputElement>(null);
    const byChart = new Map(records.map((record) => [record.chartId, record]));
    const selected = parse(value).filter((item) => byChart.has(item.chartId));
    const label = (record: PinnableRecord) =>
        `${record.difficulty.toUpperCase()} ${record.level} · ${record.score.toLocaleString(locale)}`;
    const needle = query.normalize("NFKC").trim().toLocaleLowerCase();
    const matches = records.filter((record) =>
        record.title.normalize("NFKC").toLocaleLowerCase().includes(needle)
    );
    const full = draft.length >= PINNED_RECORD_LIMIT;

    function add(record: PinnableRecord) {
        setDraft((current) =>
            current.some((item) => item.chartId === record.chartId) ||
            current.length >= PINNED_RECORD_LIMIT
                ? current
                : [...current, { chartId: record.chartId, comment: "" }]
        );
    }
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
                description={t("profile.pinned.dialogHelp", {
                    max: PINNED_RECORD_LIMIT,
                })}
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
                    <ol className="nl-pinned-picker__slots">
                        {Array.from(
                            { length: PINNED_RECORD_LIMIT },
                            (_, index) => {
                                const item = draft[index];
                                const record = item
                                    ? byChart.get(item.chartId)
                                    : undefined;
                                return (
                                    <li
                                        key={item?.chartId ?? `empty-${index}`}
                                        className="nl-pinned-picker__slot"
                                        data-empty={!record}
                                    >
                                        {record ? (
                                            <>
                                                <div className="nl-pinned-picker__head">
                                                    <div className="nl-pinned-picker__name">
                                                        <span className="nl-emphasis-label">
                                                            {record.title}
                                                        </span>
                                                        <span className="nl-metadata nl-muted">
                                                            {label(record)}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        aria-label={t(
                                                            "profile.pinned.removeAria",
                                                            {
                                                                title: record.title,
                                                            }
                                                        )}
                                                        onClick={() =>
                                                            setDraft(
                                                                (current) =>
                                                                    current.filter(
                                                                        (
                                                                            _,
                                                                            at
                                                                        ) =>
                                                                            at !==
                                                                            index
                                                                    )
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            "profile.pinned.remove"
                                                        )}
                                                    </Button>
                                                </div>
                                                <Input
                                                    aria-label={t(
                                                        "profile.pinned.commentAria",
                                                        { title: record.title }
                                                    )}
                                                    placeholder={t(
                                                        "profile.pinned.comment"
                                                    )}
                                                    maxLength={
                                                        PINNED_COMMENT_MAX
                                                    }
                                                    value={item.comment}
                                                    onChange={(event) => {
                                                        const comment =
                                                            event.target.value;
                                                        setDraft((current) =>
                                                            current.map(
                                                                (entry, at) =>
                                                                    at === index
                                                                        ? {
                                                                              ...entry,
                                                                              comment,
                                                                          }
                                                                        : entry
                                                            )
                                                        );
                                                    }}
                                                />
                                            </>
                                        ) : (
                                            <span className="nl-metadata nl-muted">
                                                {t(
                                                    "achievement.settings.emptySlot"
                                                )}
                                            </span>
                                        )}
                                    </li>
                                );
                            }
                        )}
                    </ol>
                    <Input
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
                    <p role="status" className="nl-metadata nl-muted">
                        {full
                            ? t("profile.pinned.full", {
                                  max: PINNED_RECORD_LIMIT,
                              })
                            : t("profile.pinned.results", {
                                  count: matches.length.toLocaleString(locale),
                              })}
                    </p>
                    <div
                        id={listId}
                        role="listbox"
                        aria-label={t("profile.pinned.search")}
                        className="nl-settings__arcade-options"
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
                                    data-active={active === index || undefined}
                                    className="nl-settings__arcade-option nl-control"
                                    onMouseDown={(event) =>
                                        event.preventDefault()
                                    }
                                    onClick={() => add(record)}
                                >
                                    {record.title}
                                    <span className="nl-metadata nl-muted">
                                        {" · "}
                                        {label(record)}
                                    </span>
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
            </ModalDialog>
        </div>
    );
}
