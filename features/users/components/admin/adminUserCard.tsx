import { DatabaseZap, ShieldCheck, UserRound } from "lucide-react";

import UserRoleToggleButton from "@/features/users/components/admin/userRoleToggleButton";
import ResetUserSyncTokenButton from "@/features/users/components/admin/resetUserSyncTokenButton";
import type { AdminUserRow } from "@/features/users/types/userAdmin";
import { getSyncHealthClassName } from "@/lib/admin/syncHealth";

export default function AdminUserCard({ user }: { user: AdminUserRow }) {
    return (
        <article className="bg-surface rounded-card flex flex-col gap-3 p-3">
            <div className="flex items-start gap-3">
                <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full ${user.role === "admin" ? "bg-basic/10 text-basic" : "bg-surface-muted text-text-secondary"}`}
                >
                    {user.role === "admin" ? (
                        <ShieldCheck className="size-4" aria-hidden />
                    ) : (
                        <UserRound className="size-4" aria-hidden />
                    )}
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-body truncate font-bold">{user.name}</p>
                    <p className="text-caption">
                        #{user.id} · {user.country} · 가입{" "}
                        {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                </div>
                <span
                    className={`${getSyncHealthClassName(user.health.tone)} shrink-0 rounded-full px-2 py-1 text-xs font-semibold`}
                >
                    {user.health.label}
                </span>
            </div>
            <p className="text-caption">
                플레이 {user.playCount}회 · 동기화 {user.counts.dataSyncs}회 ·
                평가 {user.counts.chartEvaluations}개 · 검정{" "}
                {user.counts.examAchievements}개
            </p>
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-bg rounded-md p-2">
                    <p className="text-micro">마지막 동기화</p>
                    <strong className="text-caption mt-0.5 block font-semibold">
                        {user.latestSyncAt
                            ? new Date(user.latestSyncAt).toLocaleString(
                                  "ko-KR"
                              )
                            : "-"}
                    </strong>
                </div>
                <div className="bg-bg rounded-md p-2">
                    <p className="text-micro">공식 마지막 플레이</p>
                    <strong className="text-caption mt-0.5 block font-semibold">
                        {user.nostalgiaLastPlaytime ?? "-"}
                    </strong>
                </div>
                <div className="bg-bg rounded-md p-2">
                    <p className="text-micro">전체 채보 기록</p>
                    <strong className="text-label mt-0.5 block tabular-nums">
                        {user.counts.playData.toLocaleString("ko-KR")}
                    </strong>
                </div>
                <div className="bg-bg rounded-md p-2">
                    <p className="text-micro">최근 플레이 기록</p>
                    <strong className="text-label mt-0.5 block tabular-nums">
                        {user.counts.recentPlayHistory.toLocaleString("ko-KR")}
                    </strong>
                </div>
            </div>
            <details className="border-border border-t pt-3">
                <summary className="text-label flex cursor-pointer list-none items-center gap-1.5 font-semibold">
                    <DatabaseZap className="size-3.5" aria-hidden />
                    상세 데이터 적재율
                </summary>
                <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                    <div>
                        <dt className="text-micro">채보 판정</dt>
                        <dd className="text-label tabular-nums">
                            {user.coverage.judgementRecords} /{" "}
                            {user.counts.playData}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-micro">음표 성공률</dt>
                        <dd className="text-label tabular-nums">
                            {user.coverage.noteRateRecords} /{" "}
                            {user.counts.playData}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-micro">최근 플레이 판정</dt>
                        <dd className="text-label tabular-nums">
                            {user.coverage.recentJudgementRecords} /{" "}
                            {user.counts.recentPlayHistory}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-micro">FAST/SLOW</dt>
                        <dd className="text-label tabular-nums">
                            {user.coverage.recentFastSlowRecords} /{" "}
                            {user.counts.recentPlayHistory}
                        </dd>
                    </div>
                </dl>
            </details>
            <div className="grid grid-cols-2 gap-2">
                <UserRoleToggleButton
                    isAdmin={user.role === "admin"}
                    userId={user.id}
                    userLabel={user.name}
                />
                <ResetUserSyncTokenButton
                    userId={user.id}
                    syncTokenVersion={user.syncTokenVersion}
                />
            </div>
        </article>
    );
}
