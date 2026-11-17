"use client";

import { useState } from "react";

import {
    AdminReadRow,
    AdminReadRows,
    AdminStatus,
} from "@/components/admin/admin-card";
import AdminDrawer from "@/components/admin/admin-drawer";
import ActionMenu from "@/components/ui/action-menu";
import ResetUserSyncTokenButton from "@/features/users/components/admin/reset-user-sync-token-button";
import UserRoleToggleButton from "@/features/users/components/admin/user-role-toggle-button";
import type { AdminUserRow as AdminUserRowData } from "@/features/users/types/user-admin";
import { getSyncHealthTagTone } from "@/lib/admin/sync-health";

// 유저 표 한 줄(판 2) — 표에 못 넣은 값과 권한 · 토큰 동작은 ⋯ 「자세히 보기」 서랍에
export default function AdminUserRow({ user }: { user: AdminUserRowData }) {
    const [open, setOpen] = useState(false);
    const isAdmin = user.role === "admin";

    return (
        <tr>
            <td>{user.username ?? "-"}</td>
            <td>{user.nostalgiaName ?? "-"}</td>
            <td>{new Date(user.createdAt).toLocaleDateString("ko-KR")}</td>
            <td>
                {user.latestSyncAt
                    ? new Date(user.latestSyncAt).toLocaleString("ko-KR")
                    : "-"}
            </td>
            <td>{isAdmin ? "관리자" : "일반"}</td>
            <td>
                <AdminStatus
                    tone={getSyncHealthTagTone(user.health.tone) ?? "empty"}
                >
                    {user.health.label}
                </AdminStatus>
            </td>
            <td className="nl-admin-table__menu">
                <ActionMenu
                    label={`${user.name} 메뉴`}
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
                    title={user.name}
                >
                    <div>
                        <AdminReadRows>
                            <AdminReadRow label="번호">#{user.id}</AdminReadRow>
                            <AdminReadRow label="국가">
                                {user.country}
                            </AdminReadRow>
                            <AdminReadRow label="플레이">
                                {user.playCount}회
                            </AdminReadRow>
                            <AdminReadRow label="동기화">
                                {user.counts.dataSyncs}회
                            </AdminReadRow>
                            <AdminReadRow label="평가">
                                {user.counts.chartEvaluations}개
                            </AdminReadRow>
                            <AdminReadRow label="검정">
                                {user.counts.examAchievements}개
                            </AdminReadRow>
                            <AdminReadRow label="공식 마지막 플레이">
                                {user.nostalgiaLastPlaytime ?? "-"}
                            </AdminReadRow>
                            <AdminReadRow label="전체 채보 기록">
                                {user.counts.playData.toLocaleString("ko-KR")}
                            </AdminReadRow>
                            <AdminReadRow label="최근 플레이 기록">
                                {user.counts.recentPlayHistory.toLocaleString(
                                    "ko-KR"
                                )}
                            </AdminReadRow>
                            <AdminReadRow label="채보 판정">
                                {user.coverage.judgementRecords} /{" "}
                                {user.counts.playData}
                            </AdminReadRow>
                            <AdminReadRow label="음표 성공률">
                                {user.coverage.noteRateRecords} /{" "}
                                {user.counts.playData}
                            </AdminReadRow>
                            <AdminReadRow label="최근 플레이 판정">
                                {user.coverage.recentJudgementRecords} /{" "}
                                {user.counts.recentPlayHistory}
                            </AdminReadRow>
                            <AdminReadRow label="FAST/SLOW">
                                {user.coverage.recentFastSlowRecords} /{" "}
                                {user.counts.recentPlayHistory}
                            </AdminReadRow>
                        </AdminReadRows>
                    </div>
                    <div className="grid grid-cols-2 gap-nl-8">
                        <UserRoleToggleButton
                            isAdmin={isAdmin}
                            userId={user.id}
                            userLabel={user.name}
                        />
                        <ResetUserSyncTokenButton
                            userId={user.id}
                            syncTokenVersion={user.syncTokenVersion}
                        />
                    </div>
                </AdminDrawer>
            </td>
        </tr>
    );
}
