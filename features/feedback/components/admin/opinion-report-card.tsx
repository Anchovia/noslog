import Link from "next/link";

import type { AdminOpinionReport } from "@/features/feedback/types/opinion-report-admin";

import OpinionReportStatusButton from "./opinion-report-status-button";

export default function OpinionReportCard({
    report,
}: {
    report: AdminOpinionReport;
}) {
    return (
        <article className="flex flex-col gap-nl-12 rounded-nl-control bg-nl-surface p-nl-12">
            <div className="flex items-start justify-between gap-nl-12">
                <p className="nl-metadata flex flex-wrap items-center gap-x-nl-8 text-nl-subdued">
                    <span>
                        {report.target === "opinion"
                            ? "의견 신고"
                            : "답글 신고"}
                    </span>
                    <span aria-hidden>·</span>
                    <span>{report.reason}</span>
                </p>
                <time className="nl-metadata shrink-0 text-nl-subdued">
                    {new Date(report.createdAt).toLocaleDateString("ko-KR")}
                </time>
            </div>
            <p className="nl-metadata flex flex-wrap items-center gap-x-nl-8 text-nl-subdued">
                <span>작성자</span>
                <Link
                    href={`/profile/${report.author.id}`}
                    className="nl-link nl-emphasis-label"
                >
                    {report.author.name}
                </Link>
                <span aria-hidden>·</span>
                <span>신고한 사람</span>
                <Link
                    href={`/profile/${report.reporter.id}`}
                    className="nl-link nl-emphasis-label"
                >
                    {report.reporter.name}
                </Link>
            </p>
            {report.chart ? (
                <Link
                    href={report.chart.href}
                    target="_blank"
                    className="nl-admin-link nl-metadata text-nl-subdued"
                >
                    {report.chart.title} · {report.chart.difficulty}
                </Link>
            ) : (
                <p className="nl-metadata text-nl-subdued">작성자가 지운 글</p>
            )}
            <p className="nl-control break-words whitespace-pre-wrap text-nl-content">
                {report.snapshot}
            </p>
            {report.explanation ? (
                <div className="rounded-nl-control bg-nl-control p-nl-12">
                    <p className="nl-metadata text-nl-subdued">추가 설명</p>
                    <p className="nl-control break-words whitespace-pre-wrap text-nl-content">
                        {report.explanation}
                    </p>
                </div>
            ) : null}
            <OpinionReportStatusButton
                reportId={report.id}
                status={report.status}
            />
        </article>
    );
}
