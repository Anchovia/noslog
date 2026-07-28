import { ChevronDown } from "lucide-react";
import Link from "next/link";

import { cn, formatToComma } from "@/lib/utils";

import type { ExamDashboardItem } from "./examDashboardTypes";

// 응시료와 보상처럼 보조적인 정보는 필요할 때 펼쳐 확인함
export default function ExamOverview({ exam }: { exam: ExamDashboardItem }) {
    return (
        <details className="bg-surface rounded-card group overflow-hidden">
            <summary className="hover:bg-surface-muted focus-visible:ring-focus/40 flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-3 transition-colors focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                <span>
                    <strong className="text-label block">응시 정보</strong>
                    <span className="text-caption mt-0.5 block">
                        요구 Grd., 검정료와 합격 보상
                    </span>
                </span>
                <ChevronDown className="text-text-disabled size-4 shrink-0 transition-transform group-open:rotate-180" />
            </summary>

            <dl className="border-divider flex flex-col gap-3 border-t px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                    <dt className="text-caption">요구 Grd.</dt>
                    <dd
                        className={cn(
                            "text-label tabular-nums",
                            exam.playerGrade !== null &&
                                exam.playerGrade >= exam.requiredGrade
                                ? "text-success"
                                : "text-text-primary"
                        )}
                    >
                        {formatToComma(exam.requiredGrade)}
                        {exam.playerGrade !== null
                            ? ` · 현재 ${formatToComma(exam.playerGrade)}`
                            : ""}
                    </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <dt className="text-caption">검정료</dt>
                    <dd className="text-label tabular-nums">
                        {formatToComma(exam.feeNos)} nos
                    </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                    <dt className="text-caption shrink-0">합격 보상</dt>
                    <dd className="text-label flex min-w-0 flex-wrap justify-end gap-x-1 text-right">
                        {exam.rewards.length > 0
                            ? exam.rewards.map((reward, index) => (
                                  <span key={reward.id}>
                                      {reward.musicIndex ? (
                                          <Link
                                              href={`/music?q=${encodeURIComponent(reward.label)}`}
                                              className="decoration-divider hover:text-chart focus-visible:ring-focus/40 rounded underline underline-offset-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                                          >
                                              {reward.label}
                                          </Link>
                                      ) : (
                                          reward.label
                                      )}
                                      {index < exam.rewards.length - 1
                                          ? ","
                                          : ""}
                                  </span>
                              ))
                            : "미등록"}
                    </dd>
                </div>
            </dl>
        </details>
    );
}
