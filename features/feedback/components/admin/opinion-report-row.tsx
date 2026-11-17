"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
    setOpinionReportTargetHidden,
    updateOpinionReportStatus,
} from "@/app/admin/feedback/actions";
import { AdminReadRow, AdminReadRows } from "@/components/admin/admin-card";
import AdminDrawer from "@/components/admin/admin-drawer";
import ActionMenu from "@/components/ui/action-menu";
import Button from "@/components/ui/button";
import {
    createOpinionReportHiddenUpdateFormData,
    createOpinionReportStatusUpdateFormData,
} from "@/features/feedback/schemas/opinion-report-admin-schema";
import type { AdminOpinionReport } from "@/features/feedback/types/opinion-report-admin";
import useActionToast from "@/lib/hooks/use-action-toast";

// 표 칸에는 첫 줄만, 전체 본문은 서랍에서 본다
function firstLine(text: string) {
    const line = text.split("\n")[0] ?? "";
    return line.length > 60 ? `${line.slice(0, 60)}…` : line;
}

export default function OpinionReportRow({
    report,
}: {
    report: AdminOpinionReport;
}) {
    const router = useRouter();
    const { isPending, run } = useActionToast();
    const [open, setOpen] = useState(false);
    const nextStatus = report.status === "pending" ? "resolved" : "pending";
    const statusLabel = report.status === "pending" ? "처리 완료" : "다시 열기";
    const hideLabel =
        report.hidden === null
            ? null
            : report.hidden
              ? "다시 보이기"
              : "글 가리기";
    const createdAt = new Date(report.createdAt).toLocaleDateString("ko-KR");
    const targetLabel = report.target === "opinion" ? "의견 신고" : "답글 신고";

    function handleStatusUpdate() {
        run(
            () =>
                updateOpinionReportStatus(
                    createOpinionReportStatusUpdateFormData(
                        report.id,
                        nextStatus
                    )
                ),
            {
                errorMessage: "신고 상태를 변경하지 못했습니다.",
                onSuccess: () => {
                    setOpen(false);
                    router.refresh();
                },
            }
        );
    }

    function handleHiddenToggle() {
        run(
            () =>
                setOpinionReportTargetHidden(
                    createOpinionReportHiddenUpdateFormData(
                        report.id,
                        !report.hidden
                    )
                ),
            {
                errorMessage: "글 상태를 변경하지 못했습니다.",
                onSuccess: () => {
                    router.refresh();
                },
            }
        );
    }

    const authorLink = (
        <Link href={`/profile/${report.author.id}`} className="nl-link">
            {report.author.name}
        </Link>
    );
    const reporterLink = (
        <Link href={`/profile/${report.reporter.id}`} className="nl-link">
            {report.reporter.name}
        </Link>
    );

    return (
        <tr>
            <td>{firstLine(report.snapshot)}</td>
            <td>{targetLabel}</td>
            <td>{report.reason}</td>
            <td>{authorLink}</td>
            <td>{reporterLink}</td>
            <td>{createdAt}</td>
            <td className="nl-admin-table__menu">
                <ActionMenu
                    label="신고 메뉴"
                    disabled={isPending}
                    items={[
                        { label: "자세히 보기", onSelect: () => setOpen(true) },
                        { label: statusLabel, onSelect: handleStatusUpdate },
                        ...(hideLabel
                            ? [
                                  {
                                      label: hideLabel,
                                      onSelect: handleHiddenToggle,
                                  },
                              ]
                            : []),
                    ]}
                />
                <AdminDrawer
                    open={open}
                    onOpenChange={setOpen}
                    title={targetLabel}
                    footer={
                        <>
                            <Button
                                variant="secondary"
                                onClick={() => setOpen(false)}
                            >
                                취소
                            </Button>
                            {hideLabel ? (
                                <Button
                                    variant="secondary"
                                    disabled={isPending}
                                    onClick={handleHiddenToggle}
                                >
                                    {isPending ? "처리 중" : hideLabel}
                                </Button>
                            ) : null}
                            <Button
                                disabled={isPending}
                                onClick={handleStatusUpdate}
                            >
                                {isPending ? "처리 중" : statusLabel}
                            </Button>
                        </>
                    }
                >
                    <AdminReadRows>
                        <AdminReadRow label="사유">
                            {report.reason}
                        </AdminReadRow>
                        <AdminReadRow label="작성자">{authorLink}</AdminReadRow>
                        <AdminReadRow label="신고한 사람">
                            {reporterLink}
                        </AdminReadRow>
                        <AdminReadRow label="채보">
                            {report.chart ? (
                                <Link
                                    href={report.chart.href}
                                    target="_blank"
                                    className="nl-link"
                                >
                                    {report.chart.title} ·{" "}
                                    {report.chart.difficulty}
                                </Link>
                            ) : (
                                "작성자가 지운 글"
                            )}
                        </AdminReadRow>
                        <AdminReadRow label="받은 날">{createdAt}</AdminReadRow>
                    </AdminReadRows>
                    <p className="nl-control break-words whitespace-pre-wrap text-nl-content">
                        {report.snapshot}
                    </p>
                    {report.explanation ? (
                        <div className="flex flex-col gap-nl-4">
                            <p className="nl-metadata text-nl-subdued">
                                추가 설명
                            </p>
                            <p className="nl-control break-words whitespace-pre-wrap text-nl-content">
                                {report.explanation}
                            </p>
                        </div>
                    ) : null}
                </AdminDrawer>
            </td>
        </tr>
    );
}
