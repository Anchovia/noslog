"use client";

import "@/lib/input-modality";

import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import { useTranslations } from "@/components/i18n/locale-provider";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SelectFrame } from "@/components/ui/select-frame";
import type {
    ExamDashboardItem,
    ExamMode,
} from "@/features/exams/types/exam-dashboard";

export default function ExamNavigation({
    mode,
    exams,
    selected,
    onModeChange,
    onSelect,
    getLabel,
    getState,
}: {
    mode: ExamMode;
    exams: ExamDashboardItem[];
    selected: ExamDashboardItem | null;
    onModeChange: (mode: ExamMode) => void;
    onSelect: (exam: ExamDashboardItem) => void;
    getLabel: (exam: ExamDashboardItem) => string;
    /** 급 상태(2026-09-22 G1-a) — 셀렉트 목록 · 레일이 같은 모양 */
    getState: (exam: ExamDashboardItem) => ReactNode;
}) {
    const t = useTranslations();
    return (
        <div className="nl-exam-navigation">
            <SegmentedControl
                className="nl-segments--dense"
                label={t("exams.title")}
                value={mode}
                onValueChange={onModeChange}
                options={[
                    { value: "basic", label: "Basic" },
                    { value: "recital", label: "Recital" },
                    { value: "event", label: "Event" },
                ]}
            />
            {mode === "event" ? (
                <p className="nl-body-secondary nl-muted">
                    {t("exams.event.reference")}
                </p>
            ) : null}
            {selected ? (
                <div className="nl-exam-select">
                    <label
                        className="nl-control nl-muted"
                        htmlFor="exam-select"
                    >
                        {t("exams.select")}
                    </label>
                    <SelectFrame
                        value={selected.slug}
                        onValueChange={(slug) => {
                            const exam = exams.find(
                                (item) => item.slug === slug
                            );
                            if (exam) onSelect(exam);
                        }}
                        menuClassName="noslog-ui nl-exam-select__popup"
                        unwrapped
                        trigger={
                            <Select.Trigger
                                className="nl-input nl-select nl-exam-select__trigger"
                                id="exam-select"
                            >
                                {/* 고른 급의 상태는 급 머리 태그에 있어 트리거에는 두지 않는다(2026-09-22 사용자) */}
                                <Select.Value />
                                <Select.Icon>
                                    <ChevronDown
                                        className="nl-icon"
                                        aria-hidden
                                    />
                                </Select.Icon>
                            </Select.Trigger>
                        }
                    >
                        {exams.map((exam) => (
                            <Select.Item
                                className="nl-exam-select__option nl-control nl-focus-inset nl-forced-press"
                                value={exam.slug}
                                key={exam.id}
                                textValue={getLabel(exam)}
                            >
                                <Select.ItemText>
                                    {getLabel(exam)}
                                </Select.ItemText>
                                {getState(exam)}
                            </Select.Item>
                        ))}
                    </SelectFrame>
                </div>
            ) : null}
            <nav className="nl-exam-rail" aria-label={t("exams.select")}>
                {exams.map((exam) => (
                    <button
                        type="button"
                        key={exam.id}
                        className="nl-control"
                        aria-current={
                            exam.id === selected?.id ? "true" : undefined
                        }
                        onClick={() => onSelect(exam)}
                    >
                        <span>{getLabel(exam)}</span>
                        {getState(exam)}
                    </button>
                ))}
            </nav>
        </div>
    );
}
