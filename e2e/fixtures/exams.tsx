"use client";

import { useRef, useState } from "react";
import ExamDashboard from "@/features/exams/components/examDashboard";
import ExamProofUpload from "@/features/exams/components/examProofUpload";
import type { ExamDashboardItem } from "@/components/exams/dashboard/examDashboardTypes";
import { useTranslations } from "@/components/i18n/localeProvider";

// Presentation-only fixtures; callbacks below never authenticate or write data.
export const examFixture: ExamDashboardItem = {
    id: 900081,
    slug: "basic-8",
    mode: "basic",
    scoringType: "score",
    grade: 8,
    shortLabel: "8급",
    title: "Basic 8급",
    description: null,
    feeNos: 1500,
    requiredGrade: 2000,
    playerGrade: 2350,
    hasSyncedIdentity: true,
    rewards: [{ id: 1, type: "title", label: "Basic 8급", musicIndex: null }],
    isAchieved: false,
    submissionStatus: null,
    submissionReviewerNote: null,
    stages: [
        {
            id: 1,
            position: 1,
            label: "1st",
            requirementType: "single",
            requiredValue: 900000,
            bestValue: 912340,
            musicIndex: "5b05ef5bc3f2273244e215064fe7e28c",
            title: "アーカーシャの碑文",
            artist: null,
            charts: [{ chartId: 1, difficulty: "Hard", level: 5 }],
        },
        {
            id: 2,
            position: 2,
            label: "2nd",
            requirementType: "cumulative",
            requiredValue: 1825000,
            bestValue: 891220,
            musicIndex: "c3c666ee312e76a8abbefbc25ca15b9a",
            title: "アラベスク",
            artist: null,
            charts: [{ chartId: 2, difficulty: "Hard", level: 5 }],
        },
        {
            id: 3,
            position: 3,
            label: "Fin",
            requirementType: "cumulative",
            requiredValue: 2775000,
            bestValue: null,
            musicIndex: "eeac789c04bd8b95c03ab0c6637e8e54",
            title: "Beyond the Ocean",
            artist: null,
            charts: [{ chartId: 3, difficulty: "Hard", level: 6 }],
        },
    ],
};

export default function ExamsFixture({ state }: { state?: string }) {
    const t = useTranslations();
    const [submissions, setSubmissions] = useState(0);
    const [message, setMessage] = useState<string | null>(null);
    const finishUpload = useRef<((success: boolean) => void) | null>(null);
    if (state?.startsWith("proof"))
        return (
            <div className="nl-container">
                <h1 className="nl-page-title">
                    P13 proof presentation fixture
                </h1>
                <h2 className="nl-section-title">Basic 8</h2>
                <output aria-label="Fixture submissions">{submissions}</output>
                {state === "proof-busy" ? (
                    <button
                        type="button"
                        onClick={() => finishUpload.current?.(true)}
                    >
                        Finish fixture upload
                    </button>
                ) : null}
                <ExamProofUpload
                    exam={{
                        ...examFixture,
                        submissionStatus:
                            state === "proof-rejected" ? "rejected" : null,
                        submissionReviewerNote: "Fixture review reason",
                    }}
                    isAuthenticated
                    disabled={false}
                    message={message}
                    requiresLogin={
                        state === "proof-expired" && message !== null
                    }
                    onClearMessage={() => setMessage(null)}
                    onUpload={async () => {
                        setSubmissions((value) => value + 1);
                        if (state === "proof-busy")
                            return new Promise<boolean>((resolve) => {
                                finishUpload.current = resolve;
                            });
                        if (state !== "proof-success")
                            setMessage(
                                state === "proof-expired"
                                    ? t("onboarding.error.loginRequired")
                                    : "Fixture retryable failure"
                            );
                        return state === "proof-success";
                    }}
                />
            </div>
        );
    const basic = Array.from({ length: 10 }, (_, i) => ({
        ...examFixture,
        id: 900080 + i,
        grade: 10 - i,
        slug: `basic-${10 - i}`,
        isAchieved: i < 2,
        requiredGrade: i > 2 ? 9000 : 2000,
    }));
    const recital: ExamDashboardItem = {
        ...examFixture,
        id: 900101,
        slug: "recital-10",
        mode: "recital",
        scoringType: "recital_point",
        grade: 10,
        title: "Recital 10급",
        stages: examFixture.stages.map((stage, i) => ({
            ...stage,
            bestValue: null,
            requiredValue: [24, 52, 84][i],
        })),
    };
    const event: ExamDashboardItem = {
        ...examFixture,
        id: 900201,
        slug: "event-kac",
        mode: "event",
        grade: null,
        shortLabel: "7th KAC",
        title: "The 7th KAC",
        requiredGrade: 0,
        rewards: [
            {
                id: 2,
                type: "music",
                label: "Carezza",
                musicIndex: "fixture-event",
            },
        ],
        stages: examFixture.stages.map((stage) => ({
            ...stage,
            charts: [
                { chartId: 10 + stage.id, difficulty: "Normal", level: 5 },
                { chartId: 20 + stage.id, difficulty: "Hard", level: 9 },
                { chartId: 30 + stage.id, difficulty: "Expert", level: 12 },
            ],
        })),
    };
    const exams = state === "empty" ? [] : [...basic, recital, event];
    return <ExamDashboard exams={exams} isAuthenticated={state !== "guest"} />;
}
