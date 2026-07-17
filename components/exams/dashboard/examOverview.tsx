import Link from "next/link";

import { cn, formatToComma } from "@/lib/utils";

import type { ExamDashboardItem } from "./examDashboardTypes";
import { getModeBadge } from "./examDashboardUtils";

// 선택한 검정의 요구 조건과 보상을 한곳에서 표시함
export default function ExamOverview({ exam }: { exam: ExamDashboardItem }) {
    return (
        <section>
            <div className="flex flex-wrap items-center gap-2">
                <h1
                    className={cn(
                        "rounded-md border px-2 py-0.5 text-xs font-extrabold",
                        getModeBadge(exam.mode)
                    )}
                >
                    {exam.title}
                </h1>
                <p className="text-text-secondary text-xs tabular-nums">
                    요구 Grd. {formatToComma(exam.requiredGrade)}
                    {exam.playerGrade !== null ? (
                        <span
                            className={cn(
                                "ml-1",
                                exam.playerGrade >= exam.requiredGrade
                                    ? "text-success"
                                    : "text-danger"
                            )}
                        >
                            {exam.playerGrade >= exam.requiredGrade ? "✓" : "✕"}{" "}
                            {formatToComma(exam.playerGrade)}
                        </span>
                    ) : null}
                </p>
            </div>

            <div className="text-text-secondary mt-1 flex min-w-0 items-center gap-2 text-xs">
                <p className="shrink-0">
                    검정료{" "}
                    <strong className="text-text-primary">
                        {formatToComma(exam.feeNos)} nos
                    </strong>
                </p>
                <span className="text-divider">·</span>
                {exam.rewards.length > 0 ? (
                    <div className="flex min-w-0 items-center gap-x-1 overflow-hidden whitespace-nowrap">
                        <span className="shrink-0">합격 보상</span>
                        {exam.rewards.map((reward, index) => (
                            <span
                                key={reward.id}
                                className="text-text-primary truncate font-semibold"
                            >
                                {reward.musicIndex ? (
                                    <Link
                                        href={`/music?q=${encodeURIComponent(reward.label)}`}
                                        className="decoration-divider underline underline-offset-2"
                                    >
                                        {reward.label}
                                    </Link>
                                ) : (
                                    reward.label
                                )}
                                {index < exam.rewards.length - 1 ? "," : ""}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="truncate">합격 보상 미등록</span>
                )}
            </div>
        </section>
    );
}
