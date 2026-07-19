import { ChevronRight, Plus, Search } from "lucide-react";
import Link from "next/link";

import Badge from "@/components/ui/Badge";
import { Prisma } from "@prisma/client";
import db from "@/lib/db";

function getModeVariant(mode: string) {
    if (mode === "basic") return "basic" as const;
    if (mode === "recital") return "recital" as const;
    return "default" as const;
}

export default async function AdminExamsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; mode?: string; status?: string }>;
}) {
    const params = await searchParams;
    const query = params.q?.trim() ?? "";
    const mode = ["basic", "recital", "event"].includes(params.mode ?? "")
        ? params.mode
        : "";
    const status = ["draft", "published"].includes(params.status ?? "")
        ? params.status
        : "";
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
    const exams = await db.exam.findMany({
        where,
        select: {
            id: true,
            title: true,
            slug: true,
            mode: true,
            grade: true,
            status: true,
            updatedAt: true,
            _count: {
                select: {
                    stages: true,
                    submissions: { where: { status: "pending" } },
                },
            },
        },
        orderBy: [{ mode: "asc" }, { grade: "desc" }, { id: "desc" }],
    });

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-title">검정 관리</h1>
                    <p className="text-caption mt-1">총 {exams.length}개</p>
                </div>
                <Link
                    href="/admin/exams/new"
                    className="bg-text-primary text-bg flex size-10 items-center justify-center rounded-md"
                    aria-label="검정 추가"
                    title="검정 추가"
                >
                    <Plus className="size-5" />
                </Link>
            </div>

            <form className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.75rem] gap-2">
                <label className="border-border bg-surface col-span-3 flex h-11 min-w-0 items-center gap-2 rounded-md border px-3">
                    <Search className="text-text-disabled size-4 shrink-0" />
                    <input
                        name="q"
                        defaultValue={query}
                        placeholder="제목 검색"
                        className="text-input min-w-0 flex-1 bg-transparent outline-none"
                    />
                </label>
                <select
                    name="mode"
                    defaultValue={mode}
                    aria-label="모드 필터"
                    className="border-border bg-surface text-input h-11 min-w-0 rounded-md border px-2"
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
                    className="border-border bg-surface text-input h-11 min-w-0 rounded-md border px-2"
                >
                    <option value="">모든 상태</option>
                    <option value="draft">초안</option>
                    <option value="published">공개</option>
                </select>
                <button
                    type="submit"
                    className="border-border bg-surface text-text-primary hover:bg-surface-muted flex size-11 items-center justify-center rounded-md border transition-colors"
                    aria-label="필터 적용"
                    title="필터 적용"
                >
                    <Search className="size-4" />
                </button>
            </form>

            {exams.length > 0 ? (
                <section className="bg-surface rounded-card overflow-hidden">
                    {exams.map((exam) => (
                        <Link
                            key={exam.id}
                            href={`/admin/exams/${exam.id}`}
                            className="border-divider hover:bg-surface-muted flex min-h-17 items-center gap-3 border-b px-3 py-2.5 transition-colors last:border-b-0"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                    <Badge variant={getModeVariant(exam.mode)}>
                                        {exam.mode === "event"
                                            ? "Event"
                                            : `${exam.mode === "basic" ? "Basic" : "Recital"} ${exam.grade}급`}
                                    </Badge>
                                    <Badge
                                        variant={
                                            exam.status === "published"
                                                ? "success"
                                                : "outline"
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
                                <p className="text-body mt-1.5 truncate font-bold">
                                    {exam.title}
                                </p>
                                <p className="text-caption mt-0.5 truncate">
                                    {exam.slug} · 과제곡 {exam._count.stages}개
                                </p>
                            </div>
                            <ChevronRight className="text-text-disabled size-4 shrink-0" />
                        </Link>
                    ))}
                </section>
            ) : (
                <div className="bg-surface rounded-card text-caption flex min-h-40 items-center justify-center px-6 text-center">
                    조건에 맞는 검정이 없습니다.
                </div>
            )}
        </div>
    );
}
