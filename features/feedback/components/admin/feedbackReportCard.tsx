import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { AdminFeedbackReport } from "@/features/feedback/types/feedbackAdmin";

import FeedbackStatusButton from "./feedbackStatusButton";

export default function FeedbackReportCard({
    report,
}: {
    report: AdminFeedbackReport;
}) {
    const imagePath = `/api/admin/private-images/feedback/${report.id}`;

    return (
        <article className="bg-surface rounded-card overflow-hidden">
            {report.hasImage ? (
                <a
                    href={imagePath}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-surface-muted relative block aspect-video"
                >
                    <Image
                        src={imagePath}
                        alt="피드백 첨부 이미지"
                        fill
                        unoptimized
                        sizes="358px"
                        className="object-contain"
                    />
                    <span className="bg-bg/80 absolute top-2 right-2 flex size-8 items-center justify-center rounded-md">
                        <ExternalLink className="size-4" aria-hidden />
                    </span>
                </a>
            ) : null}
            <div className="flex flex-col gap-3 p-3">
                <div className="flex items-start justify-between gap-3">
                    <Link
                        href={`/profile/${report.user.id}`}
                        className="text-body truncate font-bold hover:underline"
                    >
                        {report.user.name}
                    </Link>
                    <time className="text-caption shrink-0 tabular-nums">
                        {new Date(report.createdAt).toLocaleDateString("ko-KR")}
                    </time>
                </div>
                <p className="text-body break-words whitespace-pre-wrap">
                    {report.content}
                </p>
                <FeedbackStatusButton
                    feedbackId={report.id}
                    status={report.status}
                />
            </div>
        </article>
    );
}
