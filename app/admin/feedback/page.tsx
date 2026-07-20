import { Check, ExternalLink, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import db from "@/lib/db";

import { updateFeedbackStatus } from "./actions";

const statuses = ["open", "resolved"] as const;

export default async function AdminFeedbackPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const params = await searchParams;
    const status = statuses.includes(params.status as (typeof statuses)[number])
        ? params.status!
        : "open";
    const reports = await db.feedbackReport.findMany({
        where: { status },
        include: {
            user: {
                select: { id: true, username: true, nostalgia_name: true },
            },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
    });

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">피드백 관리</h1>
                <p className="text-caption mt-1">
                    사용자가 제출한 피드백과 오류 제보를 확인합니다.
                </p>
            </section>

            <nav className="flex gap-2">
                {statuses.map((item) => (
                    <Link
                        key={item}
                        href={`/admin/feedback?status=${item}`}
                        className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${status === item ? "bg-text-primary text-bg" : "bg-surface text-text-secondary hover:bg-surface-muted"}`}
                    >
                        {item === "open" ? "접수" : "처리 완료"}
                    </Link>
                ))}
            </nav>

            <section className="flex flex-col gap-3">
                {reports.map((report) => (
                    <article
                        key={report.id}
                        className="bg-surface rounded-card overflow-hidden"
                    >
                        {report.imageUrl ? (
                            <a
                                href={report.imageUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-surface-muted relative block aspect-video"
                            >
                                <Image
                                    src={report.imageUrl}
                                    alt="피드백 첨부 이미지"
                                    fill
                                    sizes="358px"
                                    className="object-contain"
                                />
                                <span className="bg-bg/80 absolute top-2 right-2 flex size-8 items-center justify-center rounded-md">
                                    <ExternalLink className="size-4" />
                                </span>
                            </a>
                        ) : null}
                        <div className="flex flex-col gap-3 p-3">
                            <div className="flex items-start justify-between gap-3">
                                <Link
                                    href={`/profile/${report.user.id}`}
                                    className="text-body truncate font-bold hover:underline"
                                >
                                    {report.user.username ??
                                        report.user.nostalgia_name ??
                                        `유저 ${report.user.id}`}
                                </Link>
                                <time className="text-caption shrink-0 tabular-nums">
                                    {report.createdAt.toLocaleDateString(
                                        "ko-KR"
                                    )}
                                </time>
                            </div>
                            <p className="text-body break-words whitespace-pre-wrap">
                                {report.content}
                            </p>
                            <form action={updateFeedbackStatus}>
                                <input
                                    type="hidden"
                                    name="id"
                                    value={report.id}
                                />
                                <input
                                    type="hidden"
                                    name="status"
                                    value={
                                        status === "open" ? "resolved" : "open"
                                    }
                                />
                                <button className="border-border hover:bg-surface-muted flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border text-sm font-bold transition-colors">
                                    {status === "open" ? (
                                        <Check className="text-success size-4" />
                                    ) : (
                                        <RotateCcw className="size-4" />
                                    )}
                                    {status === "open"
                                        ? "처리 완료"
                                        : "다시 열기"}
                                </button>
                            </form>
                        </div>
                    </article>
                ))}
                {reports.length === 0 ? (
                    <p className="bg-surface text-body-muted rounded-card py-12 text-center">
                        해당하는 피드백이 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
