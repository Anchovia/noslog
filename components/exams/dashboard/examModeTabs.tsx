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
                        "bg-surface text-text-secondary hover:bg-surface-muted hover:text-text-primary focus-visible:ring-text-secondary/30 h-9 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none",
                        mode === item.value &&
                            "bg-text-primary text-bg hover:bg-text-primary/90 hover:text-bg"
                    )}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
