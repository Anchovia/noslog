import { Check, ExternalLink, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
    deleteExamSubmission,
    reviewExamSubmission,
} from "@/app/admin/submissions/actions";
import db from "@/lib/db";

const statuses = ["pending", "approved", "rejected"] as const;

export default async function AdminSubmissionsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const params = await searchParams;
    const status = statuses.includes(params.status as (typeof statuses)[number])
        ? params.status!
        : "pending";
    const submissions = await db.examSubmission.findMany({
        where: { status },
        include: {
            user: {
                select: { username: true, nostalgia_name: true, avatar: true },
            },
            exam: { select: { title: true, mode: true, grade: true } },
        },
        orderBy: { submittedAt: "desc" },
        take: 100,
    });

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">인증 심사</h1>
                <p className="text-caption mt-1">
                    검정 합격 증빙을 확인하고 승인하거나 반려합니다.
                </p>
            </section>

            <nav className="flex gap-2">
                {statuses.map((item) => (
                    <Link
                        key={item}
                        href={`/admin/submissions?status=${item}`}
                        className={`rounded-md px-3 py-2 text-sm font-semibold ${status === item ? "bg-text-primary text-bg" : "bg-surface text-text-secondary"}`}
                    >
                        {item === "pending"
                            ? "대기"
                            : item === "approved"
                              ? "승인"
                              : "반려"}
                    </Link>
                ))}
            </nav>

            <section className="flex flex-col gap-3">
                {submissions.map((submission) => {
                    const name =
                        submission.user.nostalgia_name ??
                        submission.user.username ??
                        `유저 ${submission.userId}`;

                    return (
                        <article
                            key={submission.id}
                            className="bg-surface rounded-card overflow-hidden"
                        >
                            <a
                                href={submission.proofImageUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-surface-muted relative block aspect-video"
                            >
                                <Image
                                    src={submission.proofImageUrl}
                                    alt="검정 합격 증빙"
                                    fill
                                    sizes="358px"
                                    className="object-contain"
                                />
                                <span className="bg-bg/80 absolute top-2 right-2 flex size-8 items-center justify-center rounded-md">
                                    <ExternalLink className="size-4" />
                                </span>
                            </a>
                            <div className="flex flex-col gap-3 p-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-body truncate font-bold">
                                            {name}
                                        </p>
                                        <p className="text-caption truncate">
                                            {submission.exam.title}
                                        </p>
                                    </div>
                                    <time className="text-caption shrink-0 tabular-nums">
                                        {submission.submittedAt.toLocaleDateString(
                                            "ko-KR"
                                        )}
                                    </time>
                                </div>
                                {submission.status === "pending" ? (
                                    <form
                                        action={reviewExamSubmission}
                                        className="flex flex-col gap-2"
                                    >
                                        <input
                                            type="hidden"
                                            name="submissionId"
                                            value={submission.id}
                                        />
                                        <textarea
                                            name="reviewerNote"
                                            defaultValue={
                                                submission.reviewerNote ?? ""
                                            }
                                            placeholder="심사 메모 또는 반려 사유"
                                            rows={2}
                                            className="border-border bg-bg text-input w-full resize-none rounded-md border px-3 py-2"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                name="status"
                                                value="rejected"
                                                className="border-danger/40 text-danger flex h-10 cursor-pointer items-center justify-center gap-1 rounded-md border text-sm font-bold"
                                            >
                                                <X className="size-4" /> 반려
                                            </button>
                                            <button
                                                name="status"
                                                value="approved"
                                                className="bg-success text-bg flex h-10 cursor-pointer items-center justify-center gap-1 rounded-md text-sm font-bold"
                                            >
                                                <Check className="size-4" />{" "}
                                                승인
                                            </button>
                                        </div>
                                    </form>
                                ) : submission.reviewerNote ? (
                                    <p className="text-caption bg-bg rounded-md px-3 py-2">
                                        심사 메모: {submission.reviewerNote}
                                    </p>
                                ) : null}
                                <form action={deleteExamSubmission}>
                                    <input
                                        type="hidden"
                                        name="submissionId"
                                        value={submission.id}
                                    />
                                    <button className="border-danger/40 text-danger flex h-10 w-full cursor-pointer items-center justify-center gap-1 rounded-md border text-sm font-bold">
                                        <Trash2 className="size-4" /> 제출 기록
                                        삭제
                                    </button>
                                </form>
                            </div>
                        </article>
                    );
                })}
                {submissions.length === 0 ? (
                    <p className="text-body-muted bg-surface rounded-card py-12 text-center">
                        해당하는 인증이 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
