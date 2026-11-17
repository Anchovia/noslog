import AdminLinkRow from "@/components/admin/admin-link-row";
import { listAdminExams } from "@/features/exams/server/exam-admin-data";
import { Search } from "lucide-react";
import Link from "next/link";

import {
    AdminCard,
    AdminCardEmpty,
    AdminCardHead,
    AdminCardTools,
    AdminPager,
    AdminStatus,
    AdminTable,
} from "@/components/admin/admin-card";
import { foundationButtonClass } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/admin";
import {
    ADMIN_PAGE_SIZE,
    adminPageHref,
    parseAdminPage,
} from "@/lib/admin/page";

export default async function AdminExamsPage({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string;
        mode?: string;
        status?: string;
        page?: string;
    }>;
}) {
    await requireAdmin();
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
    const page = parseAdminPage(params.page);
    const { exams, totalCount } = await listAdminExams(where, page);

    return (
        <AdminCard>
            <AdminCardHead
                title="검정"
                actions={
                    <Link
                        href="/admin/exams/new"
                        className={foundationButtonClass({
                            variant: "secondary",
                            size: "sm",
                        })}
                    >
                        검정 추가
                    </Link>
                }
            />
            <AdminCardTools>
                <form className="flex flex-1 flex-wrap items-center justify-between gap-nl-8">
                    <div className="flex flex-wrap items-center gap-nl-8">
                        <select
                            name="mode"
                            defaultValue={mode}
                            aria-label="모드 필터"
                            className="nl-input min-w-0"
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
                            className="nl-input min-w-0"
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
                    </div>
                    <label className="nl-search">
                        <Search className="nl-icon" aria-hidden />
                        <input
                            name="q"
                            defaultValue={query}
                            placeholder="제목 검색"
                            aria-label="검정 검색"
                            className="nl-search__input nl-body"
                        />
                    </label>
                </form>
            </AdminCardTools>
            {exams.length === 0 ? (
                <AdminCardEmpty>조건에 맞는 검정이 없습니다.</AdminCardEmpty>
            ) : (
                <AdminTable>
                    <thead>
                        <tr>
                            <th scope="col">제목</th>
                            <th scope="col">구분</th>
                            <th scope="col">주소</th>
                            <th scope="col">과제곡</th>
                            <th scope="col">심사 대기</th>
                            <th scope="col">상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map((exam) => (
                            <AdminLinkRow
                                key={exam.id}
                                href={`/admin/exams/${exam.id}`}
                            >
                                <td>
                                    <Link href={`/admin/exams/${exam.id}`}>
                                        {exam.title}
                                    </Link>
                                </td>
                                <td>
                                    {exam.mode === "event"
                                        ? "Event"
                                        : `${exam.mode === "basic" ? "Basic" : "Recital"} ${exam.grade}급`}
                                </td>
                                <td lang="en">{exam.slug}</td>
                                <td>{exam._count.stages}개</td>
                                <td>
                                    {exam._count.submissions > 0
                                        ? `${exam._count.submissions}건`
                                        : "-"}
                                </td>
                                <td>
                                    {exam.status === "published" ? (
                                        <AdminStatus tone="success">
                                            공개
                                        </AdminStatus>
                                    ) : (
                                        <AdminStatus tone="empty">
                                            초안
                                        </AdminStatus>
                                    )}
                                </td>
                            </AdminLinkRow>
                        ))}
                    </tbody>
                </AdminTable>
            )}
            <AdminPager
                page={page}
                pageSize={ADMIN_PAGE_SIZE}
                total={totalCount}
                unit="개"
                hrefFor={(target) =>
                    adminPageHref(
                        "/admin/exams",
                        { q: query, mode, status },
                        target
                    )
                }
            />
        </AdminCard>
    );
}
