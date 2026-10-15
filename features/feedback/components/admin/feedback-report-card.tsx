import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { AdminFeedbackReport } from "@/features/feedback/types/feedback-admin";

import FeedbackStatusButton from "./feedback-status-button";

export default function FeedbackReportCard({
    report,
}: {
    report: AdminFeedbackReport;
}) {
    const imagePath = `/api/admin/private-images/feedback/${report.id}`;

    return (
        <article className="overflow-hidden rounded-nl-container bg-nl-surface">
            {report.hasImage ? (
                <a
                    href={imagePath}
                    target="_blank"
                    rel="noreferrer"
                    className="relative block aspect-video bg-nl-raised"
                >
                    <Image
                        src={imagePath}
                        alt="피드백 첨부 이미지"
                        fill
                        unoptimized
                        sizes="358px"
                        className="object-contain"
                    />
                    <span className="absolute top-nl-8 right-nl-8 flex size-nl-32 items-center justify-center rounded-nl-field bg-nl-raised">
                        <ExternalLink className="nl-icon-small" aria-hidden />
                    </span>
                </a>
            ) : null}
            <div className="flex flex-col gap-nl-12 p-nl-12">
                <div className="flex items-start justify-between gap-nl-12">
                    <Link
                        href={`/profile/${report.user.id}`}
                        className="nl-emphasis-label truncate text-nl-content hover:underline"
                    >
                        {report.user.name}
                    </Link>
                    <time className="nl-metadata shrink-0 text-nl-subdued">
                        {new Date(report.createdAt).toLocaleDateString("ko-KR")}
                    </time>
                </div>
                {report.category ? (
                    <p className="nl-metadata text-nl-subdued">
                        {report.category === "idea"
                            ? "제안 · 의견"
                            : "오류 제보"}
                    </p>
                ) : null}
                {report.arcade ? (
                    <p className="nl-metadata flex flex-wrap items-center gap-x-nl-8 text-nl-subdued">
                        <span>오락실 제보</span>
                        <span aria-hidden>·</span>
                        <Link
                            href={report.arcade.href}
                            target="_blank"
                            className="nl-emphasis-label text-nl-content hover:underline"
                        >
                            {report.arcade.name}
                        </Link>
                        {report.arcade.cabinet ? (
                            <>
                                <span aria-hidden>·</span>
                                <span>{report.arcade.cabinet}</span>
                            </>
                        ) : null}
                        {report.arcade.type ? (
                            <>
                                <span aria-hidden>·</span>
                                <span>{report.arcade.type}</span>
                            </>
                        ) : null}
                    </p>
                ) : null}
                <p className="nl-control break-words whitespace-pre-wrap text-nl-content">
                    {report.content}
                </p>
                {report.reply ? (
                    <div className="rounded-nl-field bg-nl-raised p-nl-12">
                        <p className="nl-metadata text-nl-subdued">
                            NosLog 답변
                        </p>
                        <p className="nl-control break-words whitespace-pre-wrap text-nl-content">
                            {report.reply}
                        </p>
                    </div>
                ) : null}
                <FeedbackStatusButton
                    feedbackId={report.id}
                    status={report.status}
                />
            </div>
        </article>
    );
}
