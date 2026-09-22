"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import type {
    ExamDashboardItem,
    ExamMode,
} from "@/components/exams/dashboard/examDashboardTypes";
import { useTranslations } from "@/components/i18n/localeProvider";
import { SegmentedControl } from "@/components/ui/segmentedControl";

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
    /** 급 상태(2026-09-22 G1-a) — 셀렉트 트리거 · 목록 · 레일이 같은 모양 */
    getState: (exam: ExamDashboardItem) => ReactNode;
}) {
    const t = useTranslations();
    return (
        <div className="nl-exam-navigation">
            <SegmentedControl
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
                    <label className="nl-control" htmlFor="exam-select">
                        {t("exams.select")}
                    </label>
                    <Select.Root
                        value={selected.slug}
                        onValueChange={(slug) => {
                            const exam = exams.find(
                                (item) => item.slug === slug
                            );
                            if (exam) onSelect(exam);
                        }}
                    >
                        <Select.Trigger
                            className="nl-input nl-exam-select__trigger"
                            id="exam-select"
                        >
                            <span className="nl-exam-select__value">
                                <Select.Value>
                                    {getLabel(selected)}
                                </Select.Value>
                                {getState(selected)}
                            </span>
                            <Select.Icon>
                                <ChevronDown className="nl-icon" aria-hidden />
                            </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                            <Select.Content
                                className="noslog-ui nl-exam-select__popup"
                                position="popper"
                                sideOffset={8}
                                collisionPadding={16}
                            >
                                <Select.Viewport>
                                    {exams.map((exam) => (
                                        <Select.Item
                                            className="nl-exam-select__option nl-control"
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
                                </Select.Viewport>
                            </Select.Content>
                        </Select.Portal>
                    </Select.Root>
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
