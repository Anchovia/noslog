import { Trash2 } from "lucide-react";

import { deleteEvaluation } from "@/app/admin/community/actions";
import db from "@/lib/db";

export default async function AdminCommunityPage() {
    const evaluations = await db.chartEvaluation.findMany({
        include: {
            user: {
                select: { id: true, username: true, nostalgia_name: true },
            },
            chart: {
                select: {
                    difficulty: true,
                    music: { select: { index: true, title: true } },
                },
            },
            reactions: { select: { value: true } },
        },
        orderBy: { updated_at: "desc" },
        take: 100,
    });

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">의견 관리</h1>
                <p className="text-caption mt-1">
                    체감 난이도, 패턴 평가와 짧은 의견을 관리합니다.
                </p>
            </section>
            <section className="flex flex-col gap-2">
                {evaluations.map((evaluation) => {
                    const up = evaluation.reactions.filter(
                        (reaction) => reaction.value > 0
                    ).length;
                    const down = evaluation.reactions.filter(
                        (reaction) => reaction.value < 0
                    ).length;
                    return (
                        <article
                            key={evaluation.id}
                            className="bg-surface rounded-card flex flex-col gap-3 p-3"
                        >
                            <div>
                                <p className="text-body truncate font-bold">
                                    {evaluation.chart.music.title}
                                </p>
                                <p className="text-caption capitalize">
                                    {evaluation.chart.difficulty} ·{" "}
                                    {evaluation.user.nostalgia_name ??
                                        evaluation.user.username ??
                                        `유저 ${evaluation.user.id}`}{" "}
                                    · 체감{" "}
                                    {evaluation.perceived_constant.toFixed(1)}
                                </p>
                            </div>
                            <p
                                className={`text-sm leading-relaxed ${evaluation.comment ? "text-text-primary" : "text-text-disabled"}`}
                            >
                                {evaluation.comment ?? "등록된 의견 없음"}
                            </p>
                            <p className="text-caption">
                                추천 {up} · 비추천 {down} · 계단{" "}
                                {evaluation.stairs} / 연타{" "}
                                {evaluation.repetition} / 폴리리듬{" "}
                                {evaluation.chord} / 즈레 {evaluation.trill} /
                                글리산도 {evaluation.glissando}
                            </p>
                            <form action={deleteEvaluation}>
                                <input
                                    type="hidden"
                                    name="evaluationId"
                                    value={evaluation.id}
                                />
                                <button className="border-danger/40 text-danger flex h-9 w-full items-center justify-center gap-1 rounded-md border text-xs font-bold">
                                    <Trash2 className="size-3.5" /> 평가 전체
                                    삭제
                                </button>
                            </form>
                        </article>
                    );
                })}
                {evaluations.length === 0 ? (
                    <p className="text-body-muted bg-surface rounded-card py-12 text-center">
                        등록된 평가가 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
