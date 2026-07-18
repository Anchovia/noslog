import { cn } from "@/lib/utils";

import type { ExamMode } from "./examDashboardTypes";

export const EXAM_MODES: { value: ExamMode; label: string }[] = [
    { value: "basic", label: "Basic" },
    { value: "recital", label: "Recital" },
    { value: "event", label: "Event" },
];

interface ExamModeTabsProps {
    mode: ExamMode;
    onChange: (mode: ExamMode) => void;
}

// 검정 모드 전환 탭을 한곳에서 관리함
export default function ExamModeTabs({ mode, onChange }: ExamModeTabsProps) {
    return (
        <div className="flex gap-2">
            {EXAM_MODES.map((item) => (
                <button
                    key={item.value}
                    type="button"
                    onClick={() => onChange(item.value)}
                    className={cn(
                        "bg-surface text-text-secondary h-8 rounded-lg px-3.5 text-xs font-semibold",
                        mode === item.value && "bg-text-primary text-bg"
                    )}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
