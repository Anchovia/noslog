"use client";

import { useState } from "react";

import ActionButton from "@/components/ui/actionButton";
import PollBuilderDialog, {
    type PollBuilderLabels,
} from "@/features/polls/components/pollBuilderDialog";
import {
    emptyPollInput,
    pickLocaleText,
    type PollInput,
} from "@/features/polls/schemas/pollSchema";
import type { Locale } from "@/lib/i18n/routing";

export interface PollSectionLabels extends PollBuilderLabels {
    section: string;
    optional: string;
    create: string;
    edit: string;
    remove: string;
    /** 「선택지 3개 · 한 개만 고름 · 9월 30일 마감」 을 만드는 조각 */
    summaryOptions: (count: number) => string;
    summarySingle: string;
    summaryMultiple: string;
    summaryCloses: (date: string) => string;
    summaryNoClose: string;
    votes: (count: number) => string;
}

/**
 * 글쓰기 화면의 투표 구역 (2026-09-23 V2) — 본문 밖에 두고 글과 함께 저장한다.
 * 만들기 전에는 「투표 만들기」 버튼만, 만든 뒤에는 요약 카드 + 「고치기 · 지우기」.
 */
export default function PollFormSection({
    value,
    onChange,
    labels,
    locales,
    locale,
    votes = 0,
}: {
    value: PollInput | null;
    onChange: (poll: PollInput | null) => void;
    labels: PollSectionLabels;
    locales: Locale[];
    /** 요약을 보여 줄 언어 */
    locale: Locale;
    /** 이미 들어온 표 — 1 이상이면 질문 · 선택지가 잠긴다 */
    votes?: number;
}) {
    const [open, setOpen] = useState(false);
    const locked = votes > 0;
    const summary = value
        ? [
              labels.summaryOptions(value.options.length),
              value.multiple ? labels.summaryMultiple : labels.summarySingle,
              value.closesAt
                  ? labels.summaryCloses(value.closesAt)
                  : labels.summaryNoClose,
          ].join(" · ")
        : null;

    return (
        <section className="nl-poll-section">
            <div className="nl-poll-section__head">
                <h2 className="nl-component-title">{labels.section}</h2>
                <span className="nl-metadata nl-muted">{labels.optional}</span>
            </div>
            {value ? (
                <div className="nl-poll-section__card">
                    <div className="nl-poll-section__card-head">
                        <p className="nl-emphasis-label">
                            {pickLocaleText(value.question, locale)}
                        </p>
                        <div className="nl-poll-section__actions">
                            <ActionButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setOpen(true)}
                            >
                                {labels.edit}
                            </ActionButton>
                            <ActionButton
                                variant="ghost"
                                size="sm"
                                disabled={locked}
                                onClick={() => onChange(null)}
                            >
                                {labels.remove}
                            </ActionButton>
                        </div>
                    </div>
                    <p className="nl-metadata nl-muted">{summary}</p>
                    {locked ? (
                        <p className="nl-metadata nl-muted">
                            {labels.votes(votes)}
                        </p>
                    ) : null}
                </div>
            ) : (
                <ActionButton
                    variant="secondary"
                    onClick={() => {
                        onChange(emptyPollInput(locales[0]));
                        setOpen(true);
                    }}
                >
                    {labels.create}
                </ActionButton>
            )}
            <PollBuilderDialog
                // 창을 열 때마다 저장된 값에서 다시 시작한다(열림 여부를 key 에 넣어 새로 그린다)
                key={open ? "open" : "closed"}
                open={open}
                onOpenChange={setOpen}
                onCancel={() => {
                    // 만들다 취소하면 빈 투표를 남기지 않는다(저장하고 닫을 때는 부르지 않는다)
                    if (value && !pickLocaleText(value.question, locale))
                        onChange(null);
                }}
                value={value ?? emptyPollInput(locales[0])}
                onSave={onChange}
                labels={labels}
                locales={locales}
                locked={locked}
            />
        </section>
    );
}
