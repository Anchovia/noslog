import { ChevronRight, ClipboardCheck, ListMusic } from "lucide-react";
import Link from "next/link";

import db from "@/lib/db";

export default async function AdminPage() {
    const [examCount, publishedExamCount, pendingSubmissionCount] =
        await Promise.all([
            db.exam.count(),
            db.exam.count({ where: { status: "published" } }),
            db.examSubmission.count({ where: { status: "pending" } }),
        ]);

    return (
        <div className="flex flex-col gap-5 px-4 py-5">
            <section>
                <h1 className="text-title">관리 홈</h1>
                <p className="text-caption mt-1">
                    콘텐츠와 사용자 인증 상태를 관리합니다.
                </p>
            </section>

            <section className="grid grid-cols-3 gap-2">
                <div className="bg-surface rounded-card p-3">
                    <p className="text-caption">전체 검정</p>
                    <p className="text-title mt-2 tabular-nums">{examCount}</p>
                </div>
                <div className="bg-surface rounded-card p-3">
                    <p className="text-caption">공개</p>
                    <p className="text-success mt-2 text-xl font-bold tabular-nums">
                        {publishedExamCount}
                    </p>
                </div>
                <div className="bg-surface rounded-card p-3">
                    <p className="text-caption">심사 대기</p>
                    <p className="text-score mt-2 text-xl font-bold tabular-nums">
                        {pendingSubmissionCount}
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-section mb-2 font-bold">콘텐츠 관리</h2>
                <div className="bg-surface rounded-card overflow-hidden">
                    <Link
                        href="/admin/exams"
                        className="hover:bg-surface-muted flex min-h-16 items-center gap-3 px-3 transition-colors"
                    >
                        <span className="bg-basic/10 text-basic flex size-9 shrink-0 items-center justify-center rounded-md">
                            <ListMusic className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                            <strong className="text-body block font-bold">
                                검정 관리
                            </strong>
                            <span className="text-caption">
                                급수, 과제곡, 통과 조건 설정
                            </span>
                        </span>
                        <ChevronRight className="text-text-disabled size-4" />
                    </Link>
                    <div className="border-divider flex min-h-16 items-center gap-3 border-t px-3 opacity-45">
                        <span className="bg-surface-muted text-text-secondary flex size-9 shrink-0 items-center justify-center rounded-md">
                            <ClipboardCheck className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                            <strong className="text-body block font-bold">
                                인증 심사
                            </strong>
                            <span className="text-caption">추후 구현 예정</span>
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
}
