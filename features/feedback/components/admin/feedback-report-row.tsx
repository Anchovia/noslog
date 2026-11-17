"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { updateFeedbackStatus } from "@/app/admin/feedback/actions";
import {
    AdminReadRow,
    AdminReadRows,
    adminRowOpenProps,
} from "@/components/admin/admin-card";
import AdminDrawer from "@/components/admin/admin-drawer";
import ActionMenu from "@/components/ui/action-menu";
import Button from "@/components/ui/button";
import { createFeedbackStatusUpdateFormData } from "@/features/feedback/schemas/feedback-admin-schema";
import type { AdminFeedbackReport } from "@/features/feedback/types/feedback-admin";
import useActionToast from "@/lib/hooks/use-action-toast";

// 표 칸에는 첫 줄만, 전체 본문은 서랍에서 본다
function firstLine(text: string) {
    const line = text.split("\n")[0] ?? "";
    return line.length > 60 ? `${line.slice(0, 60)}…` : line;
}

function categoryLabel(category: string | null) {
    if (!category) return null;
    return category === "idea" ? "제안 · 의견" : "오류 제보";
}

export default function FeedbackReportRow({
    report,
}: {
    report: AdminFeedbackReport;
}) {
    const router = useRouter();
    const { isPending, run } = useActionToast();
    const [open, setOpen] = useState(false);
    const [reply, setReply] = useState("");
    const replyId = useId();
    const nextStatus = report.status === "open" ? "resolved" : "open";
    const statusLabel = report.status === "open" ? "처리 완료" : "다시 열기";
    const imagePath = `/api/admin/private-images/feedback/${report.id}`;
    const createdAt = new Date(report.createdAt).toLocaleDateString("ko-KR");

    function handleStatusUpdate(withReply: string) {
        run(
            () =>
                updateFeedbackStatus(
                    createFeedbackStatusUpdateFormData(
                        report.id,
                        nextStatus,
                        nextStatus === "resolved" ? withReply : ""
                    )
                ),
            {
                errorMessage: "피드백 상태를 변경하지 못했습니다.",
                onSuccess: () => {
                    setOpen(false);
                    router.refresh();
                },
            }
        );
    }

    return (
        <tr {...adminRowOpenProps(() => setOpen(true))}>
            <td>{firstLine(report.content)}</td>
            <td>
                <Link href={`/profile/${report.user.id}`} className="nl-link">
                    {report.user.name}
                </Link>
            </td>
            <td>
                {report.arcade ? "오락실 제보" : categoryLabel(report.category)}
            </td>
            <td>{createdAt}</td>
            <td className="nl-admin-table__menu">
                <ActionMenu
                    label="피드백 메뉴"
                    disabled={isPending}
                    items={[
                        { label: "자세히 보기", onSelect: () => setOpen(true) },
                        {
                            label: statusLabel,
                            onSelect: () => handleStatusUpdate(""),
                        },
                    ]}
                />
                <AdminDrawer
                    open={open}
                    onOpenChange={setOpen}
                    title="피드백"
                    footer={
                        <>
                            <Button
                                variant="secondary"
                                onClick={() => setOpen(false)}
                            >
                                취소
                            </Button>
                            <Button
                                disabled={isPending}
                                onClick={() => handleStatusUpdate(reply)}
                            >
                                {isPending ? "처리 중" : statusLabel}
                            </Button>
                        </>
                    }
                >
                    <AdminReadRows>
                        <AdminReadRow label="보낸 사람">
                            <Link
                                href={`/profile/${report.user.id}`}
                                className="nl-link"
                            >
                                {report.user.name}
                            </Link>
                        </AdminReadRow>
                        {report.category ? (
                            <AdminReadRow label="종류">
                                {categoryLabel(report.category)}
                            </AdminReadRow>
                        ) : null}
                        {report.arcade ? (
                            <>
                                <AdminReadRow label="오락실">
                                    <Link
                                        href={report.arcade.href}
                                        target="_blank"
                                        className="nl-link"
                                    >
                                        {report.arcade.name}
                                    </Link>
                                </AdminReadRow>
                                {report.arcade.cabinet ? (
                                    <AdminReadRow label="기체">
                                        {report.arcade.cabinet}
                                    </AdminReadRow>
                                ) : null}
                                {report.arcade.type ? (
                                    <AdminReadRow label="제보 종류">
                                        {report.arcade.type}
                                    </AdminReadRow>
                                ) : null}
                            </>
                        ) : null}
                        <AdminReadRow label="받은 날">{createdAt}</AdminReadRow>
                    </AdminReadRows>
                    <p className="nl-control break-words whitespace-pre-wrap text-nl-content">
                        {report.content}
                    </p>
                    {report.hasImage ? (
                        <a
                            href={imagePath}
                            target="_blank"
                            rel="noreferrer"
                            className="relative block aspect-video bg-nl-control"
                        >
                            <Image
                                src={imagePath}
                                alt="피드백 첨부 이미지"
                                fill
                                unoptimized
                                sizes="512px"
                                className="object-contain"
                            />
                            <span className="absolute top-nl-8 right-nl-8 flex size-nl-32 items-center justify-center rounded-nl-control bg-nl-surface">
                                <ExternalLink
                                    className="nl-icon-small"
                                    aria-hidden
                                />
                            </span>
                        </a>
                    ) : null}
                    {report.reply ? (
                        <div className="flex flex-col gap-nl-4">
                            <p className="nl-metadata text-nl-subdued">
                                NosLog 답변
                            </p>
                            <p className="nl-control break-words whitespace-pre-wrap text-nl-content">
                                {report.reply}
                            </p>
                        </div>
                    ) : null}
                    {/* 접수 상태에서만 답변 칸 — 쓰고 「처리 완료」 를 누르면 제보한 사람에게 보인다(2026-09-18) */}
                    {report.status === "open" ? (
                        <div className="flex flex-col gap-nl-8">
                            <label
                                htmlFor={replyId}
                                className="nl-metadata text-nl-subdued"
                            >
                                답변 (선택) — 쓰면 제보한 사람의 「내 제보」 에
                                보입니다
                            </label>
                            <textarea
                                id={replyId}
                                value={reply}
                                maxLength={1000}
                                rows={3}
                                disabled={isPending}
                                onChange={(event) =>
                                    setReply(event.target.value)
                                }
                                className="nl-input"
                            />
                        </div>
                    ) : null}
                </AdminDrawer>
            </td>
        </tr>
    );
}
