import type { AdminChartEvaluation } from "@/features/music/types/chart-evaluation-admin";

import DeleteChartEvaluationButton from "./delete-chart-evaluation-button";

export default function ChartEvaluationAdminCard({
    evaluation,
}: {
    evaluation: AdminChartEvaluation;
}) {
    return (
        <article className="flex flex-col gap-3 rounded-card bg-surface p-3">
            <div>
                <p className="truncate text-body font-bold">
                    {evaluation.chart.musicTitle}
                </p>
                <p className="text-caption capitalize">
                    {evaluation.chart.difficulty} · {evaluation.userName} · 체감{" "}
                    {evaluation.perceivedConstant.toFixed(1)}
                </p>
            </div>
            <p
                className={`text-sm leading-relaxed ${evaluation.comment ? "text-text-primary" : "text-text-disabled"}`}
            >
                {evaluation.comment ?? "등록된 의견 없음"}
            </p>
            <p className="text-caption">
                추천 {evaluation.reactions.up} · 비추천{" "}
                {evaluation.reactions.down}
                {" · 계단 "}
                {evaluation.patterns.stairs} / 연타{" "}
                {evaluation.patterns.repetition}
                {" / 폴리리듬 "}
                {evaluation.patterns.chord} / 변속 {evaluation.patterns.trill} /
                글리산도 {evaluation.patterns.glissando}
            </p>
            <DeleteChartEvaluationButton evaluationId={evaluation.id} />
        </article>
    );
}
