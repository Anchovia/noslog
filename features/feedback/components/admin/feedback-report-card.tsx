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
        <article className="overflow-hidden rounded-card bg-surface">
            {report.hasImage ? (
                <a
                    href={imagePath}
                    target="_blank"
                    rel="noreferrer"
                    className="relative block aspect-video bg-surface-muted"
                >
                    <Image
                        src={imagePath}
                        alt="피드백 첨부 이미지"
                        fill
                        unoptimized
                        sizes="358px"
                        className="object-contain"
                    />
                    <span className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-md bg-bg/80">
                        <ExternalLink className="size-4" aria-hidden />
                    </span>
                </a>
            ) : null}
            <div className="flex flex-col gap-3 p-3">
                <div className="flex items-start justify-between gap-3">
                    <Link
                        href={`/profile/${report.user.id}`}
                        className="truncate text-body font-bold hover:underline"
                    >
                        {report.user.name}
                    </Link>
                    <time className="shrink-0 text-caption tabular-nums">
                        {new Date(report.createdAt).toLocaleDateString("ko-KR")}
                    </time>
                </div>
                {report.category ? (
                    <p className="text-caption">
                        {report.category === "idea"
                            ? "제안 · 의견"
                            : "오류 제보"}
                    </p>
                ) : null}
                {report.arcade ? (
                    <p className="flex flex-wrap items-center gap-x-1.5 text-caption">
                        <span>오락실 제보</span>
                        <span aria-hidden>·</span>
                        <Link
                            href={report.arcade.href}
                            target="_blank"
                            className="text-body font-bold hover:underline"
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
                <p className="text-body break-words whitespace-pre-wrap">
                    {report.content}
                </p>
                {report.reply ? (
                    <div className="rounded-md bg-surface-muted p-3">
                        <p className="text-caption">NosLog 답변</p>
                        <p className="text-body break-words whitespace-pre-wrap">
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
