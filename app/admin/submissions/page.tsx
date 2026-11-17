import {
    AdminCard,
    AdminCardEmpty,
    AdminCardHead,
    AdminCountTabs,
    AdminPager,
    AdminTable,
} from "@/components/admin/admin-card";
import ExamSubmissionRow from "@/features/exams/components/admin/exam-submission-row";
import {
    examSubmissionStatusSchema,
    normalizeExamSubmissionStatus,
} from "@/features/exams/schemas/exam-submission-admin-schema";
import {
    countExamSubmissionsByStatus,
    listExamSubmissions,
} from "@/features/exams/server/exam-submission-admin-service";
import { requireAdmin } from "@/lib/admin";
import {
    ADMIN_PAGE_SIZE,
    adminPageArgs,
    adminPageHref,
    parseAdminPage,
} from "@/lib/admin/page";

const statuses = examSubmissionStatusSchema.options;

export default async function AdminSubmissionsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; page?: string }>;
}) {
    await requireAdmin();
    const params = await searchParams;
    const status = normalizeExamSubmissionStatus(params.status);
    const page = parseAdminPage(params.page);
    const [submissions, counts] = await Promise.all([
        listExamSubmissions(status, adminPageArgs(page)),
        countExamSubmissionsByStatus(),
    ]);

    return (
        <div className="nl-admin-stack">
            <AdminCountTabs
                label="심사 상태"
                options={statuses.map((item) => ({
                    key: item,
                    label:
                        item === "pending"
                            ? "대기"
                            : item === "approved"
                              ? "승인"
                              : "반려",
                    count: counts[item],
                    href: `/admin/submissions?status=${item}`,
                    selected: status === item,
                }))}
            />
            <AdminCard>
                <AdminCardHead title="인증 심사" />
                {submissions.length ? (
                    <>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <th>유저</th>
                                    <th>검정</th>
                                    <th>제출한 날</th>
                                    {status === "pending" ? null : (
                                        <th>심사 메모</th>
                                    )}
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((submission) => (
                                    <ExamSubmissionRow
                                        key={submission.id}
                                        submission={submission}
                                    />
                                ))}
                            </tbody>
                        </AdminTable>
                        <AdminPager
                            page={page}
                            pageSize={ADMIN_PAGE_SIZE}
                            total={counts[status]}
                            unit="건"
                            hrefFor={(next) =>
                                adminPageHref(
                                    "/admin/submissions",
                                    { status: params.status },
                                    next
                                )
                            }
                        />
                    </>
                ) : (
                    <AdminCardEmpty>해당하는 인증이 없습니다.</AdminCardEmpty>
                )}
            </AdminCard>
        </div>
    );
}
