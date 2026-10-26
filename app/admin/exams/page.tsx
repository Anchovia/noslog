import { listAdminExams } from "@/features/exams/server/exam-admin-data";
import { ChevronRight, Plus, Search } from "lucide-react";
import Link from "next/link";

import Badge from "@/components/ui/badge";
import { foundationButtonClass } from "@/components/ui/button";
import { Prisma } from "@prisma/client";

export default async function AdminExamsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; mode?: string; status?: string }>;
}) {
    const params = await searchParams;
    const query = params.q?.trim() ?? "";
    const mode =
        (["basic", "recital", "event"] as const).find(
            (value) => value === params.mode
        ) ?? "";
    const status =
        (["draft", "published"] as const).find(
            (value) => value === params.status
        ) ?? "";
    const where: Prisma.ExamWhereInput = {
        ...(query
            ? {
                  OR: [
                      { title: { contains: query } },
                      { slug: { contains: query } },
                  ],
              }
            : {}),
        ...(mode ? { mode } : {}),
        ...(status ? { status } : {}),
    };
    const exams = await listAdminExams(where);

    return (
        <div className="flex flex-col gap-nl-16 py-nl-24">
            <div className="flex items-center justify-between gap-nl-12">
                <div>
                    <h1 className="nl-section-title text-nl-content">
                        검정 관리
                    </h1>
                    <p className="nl-metadata mt-nl-4 text-nl-subdued">
                        총 {exams.length}개
                    </p>
                </div>
                <Link
                    href="/admin/exams/new"
                    className={foundationButtonClass({ size: "icon" })}
                    aria-label="검정 추가"
                    title="검정 추가"
                >
                    <Plus className="nl-icon" />
                </Link>
            </div>

            <form className="flex flex-wrap gap-nl-8">
                <label className="nl-search w-full">
                    <Search className="nl-icon" aria-hidden />
                    <input
                        name="q"
                        defaultValue={query}
                        placeholder="제목 검색"
                        className="nl-search__input nl-body"
                    />
                </label>
                <select
                    name="mode"
                    defaultValue={mode}
                    aria-label="모드 필터"
                    className="nl-input min-w-0 flex-1"
                >
                    <option value="">전체</option>
                    <option value="basic">Basic</option>
                    <option value="recital">Recital</option>
                    <option value="event">Event</option>
                </select>
                <select
                    name="status"
                    defaultValue={status}
                    aria-label="상태 필터"
                    className="nl-input min-w-0 flex-1"
                >
                    <option value="">모든 상태</option>
                    <option value="draft">초안</option>
                    <option value="published">공개</option>
                </select>
                <button
                    type="submit"
                    className={foundationButtonClass({
                        variant: "secondary",
                        size: "icon",
                    })}
                    aria-label="필터 적용"
                    title="필터 적용"
                >
                    <Search className="nl-icon" aria-hidden />
                </button>
            </form>

            {exams.length > 0 ? (
                <section className="overflow-hidden rounded-nl-control bg-nl-surface">
                    {exams.map((exam) => (
                        <Link
                            key={exam.id}
                            href={`/admin/exams/${exam.id}`}
                            className="nl-hover-layer flex min-h-nl-64 items-center gap-nl-12 border-b-nl-stroke border-nl-divider px-nl-12 py-nl-12 transition-colors duration-nl-state last:border-b-0"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-nl-8">
                                    <Badge>
                                        {exam.mode === "event"
                                            ? "Event"
                                            : `${exam.mode === "basic" ? "Basic" : "Recital"} ${exam.grade}급`}
                                    </Badge>
                                    <Badge
                                        variant={
                                            exam.status === "published"
                                                ? "success"
                                                : "default"
                                        }
                                    >
                                        {exam.status === "published"
                                            ? "공개"
                                            : "초안"}
                                    </Badge>
                                    {exam._count.submissions > 0 ? (
                                        <Badge variant="score">
                                            심사 {exam._count.submissions}
                                        </Badge>
                                    ) : null}
                                </div>
                                <p className="nl-emphasis-label mt-nl-8 truncate text-nl-content">
                                    {exam.title}
                                </p>
                                <p className="nl-metadata mt-nl-4 truncate text-nl-subdued">
                                    {exam.slug} · 과제곡 {exam._count.stages}개
                                </p>
                            </div>
                            <ChevronRight className="nl-icon-small shrink-0 text-nl-disabled" />
                        </Link>
                    ))}
                </section>
            ) : (
                <div className="nl-metadata rounded-nl-control bg-nl-surface px-nl-24 py-nl-64 text-center text-nl-subdued">
                    조건에 맞는 검정이 없습니다.
                </div>
            )}
        </div>
    );
}
