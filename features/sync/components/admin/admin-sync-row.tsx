"use client";

import { useState } from "react";

import {
    AdminReadRow,
    AdminReadRows,
    adminRowOpenProps,
    AdminStatus,
} from "@/components/admin/admin-card";
import AdminDrawer from "@/components/admin/admin-drawer";
import ActionMenu from "@/components/ui/action-menu";
import type { getAdminSyncs } from "@/features/admin/server/admin-sync-service";
import { getSyncHealthTagTone } from "@/lib/admin/sync-health";

type AdminSync = Awaited<ReturnType<typeof getAdminSyncs>>["syncs"][number];

// 동기화 표 한 줄(판 2) — 수신 데이터 상태 · 오류 · 완료 시각은 ⋯ 「자세히 보기」 서랍에
export default function AdminSyncRow({ sync }: { sync: AdminSync }) {
    const [open, setOpen] = useState(false);
    const userName =
        sync.user.nostalgiaName ?? sync.user.username ?? `유저 ${sync.user.id}`;

    return (
        <tr {...adminRowOpenProps(() => setOpen(true))}>
            <td>{userName}</td>
            <td>#{sync.id}</td>
            <td>{sync.syncScope === "full" ? "전체 기록" : "최근 기록"}</td>
            <td>{sync.startedAt.toLocaleString("ko-KR")}</td>
            <td>
                <AdminStatus
                    tone={getSyncHealthTagTone(sync.health.tone) ?? "empty"}
                >
                    {sync.health.label}
                </AdminStatus>
            </td>
            <td>{sync.receivedPlays}</td>
            <td>{sync.insertedPlays}</td>
            <td>{sync.changedRecords}</td>
            <td className="nl-admin-table__menu">
                <ActionMenu
                    label={`동기화 #${sync.id} 메뉴`}
                    items={[
                        {
                            label: "자세히 보기",
                            onSelect: () => setOpen(true),
                        },
                    ]}
                />
                <AdminDrawer
                    open={open}
                    onOpenChange={setOpen}
                    title={`${userName} · #${sync.id}`}
                >
                    <div>
                        <AdminReadRows>
                            <AdminReadRow label="최근 기록 저장">
                                {sync.storedRecentCount} / {sync.insertedPlays}
                            </AdminReadRow>
                            <AdminReadRow label="최근 기록 판정">
                                {sync.recentJudgementCount} /{" "}
                                {sync.storedRecentCount}
                            </AdminReadRow>
                            <AdminReadRow label="FAST/SLOW">
                                {sync.recentFastSlowCount} /{" "}
                                {sync.storedRecentCount}
                            </AdminReadRow>
                            <AdminReadRow label="변경 기록 저장">
                                {sync.storedSnapshotCount} /{" "}
                                {sync.changedRecords}
                            </AdminReadRow>
                            <AdminReadRow label="변경 기록 판정">
                                {sync.snapshotJudgementCount} /{" "}
                                {sync.storedSnapshotCount}
                            </AdminReadRow>
                            <AdminReadRow label="음표 성공률">
                                {sync.snapshotNoteRateCount} /{" "}
                                {sync.storedSnapshotCount}
                            </AdminReadRow>
                            <AdminReadRow label="완료">
                                {sync.completedAt
                                    ? sync.completedAt.toLocaleString("ko-KR")
                                    : "-"}
                            </AdminReadRow>
                        </AdminReadRows>
                    </div>
                    {sync.errorMessage ? (
                        <pre
                            className={`${sync.status === "completed" ? "text-nl-warning" : "text-nl-error"} nl-metadata overflow-x-auto whitespace-pre-wrap`}
                        >
                            {sync.errorMessage}
                        </pre>
                    ) : null}
                </AdminDrawer>
            </td>
        </tr>
    );
}
