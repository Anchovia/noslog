import Link from "next/link";

import FeedbackReportCard from "@/features/feedback/components/admin/feedback-report-card";
import {
    feedbackStatusSchema,
    normalizeFeedbackStatus,
} from "@/features/feedback/schemas/feedback-admin-schema";
import { listFeedbackReports } from "@/features/feedback/server/feedback-admin-service";

const statuses = feedbackStatusSchema.options;

export default async function AdminFeedbackPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const params = await searchParams;
    const status = normalizeFeedbackStatus(params.status);
    const reports = await listFeedbackReports(status);

    return (
        <div className="flex flex-col gap-nl-16 py-nl-24">
            <section>
                <h1 className="nl-section-title text-nl-content">
                    피드백 관리
                </h1>
                <p className="nl-metadata mt-nl-4 text-nl-subdued">
                    사용자가 제출한 피드백과 오류 제보를 확인합니다.
                </p>
            </section>

            <nav className="flex gap-nl-8">
                {statuses.map((item) => (
                    <Link
                        key={item}
                        href={`/admin/feedback?status=${item}`}
                        className={`nl-emphasis-label rounded-nl-field px-nl-12 py-nl-8 transition-colors duration-nl-state ${status === item ? "bg-nl-primary text-nl-on-primary" : "nl-hover-layer bg-nl-surface text-nl-subdued"}`}
                    >
                        {item === "open" ? "접수" : "처리 완료"}
                    </Link>
                ))}
            </nav>

            <section className="flex flex-col gap-nl-12">
                {reports.map((report) => (
                    <FeedbackReportCard key={report.id} report={report} />
                ))}
                {reports.length === 0 ? (
                    <p className="nl-body-secondary rounded-nl-container bg-nl-surface py-nl-48 text-center text-nl-subdued">
                        해당하는 피드백이 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
