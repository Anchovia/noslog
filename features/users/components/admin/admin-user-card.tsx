import { DatabaseZap, ShieldCheck, UserRound } from "lucide-react";

import ResetUserSyncTokenButton from "@/features/users/components/admin/reset-user-sync-token-button";
import UserRoleToggleButton from "@/features/users/components/admin/user-role-toggle-button";
import type { AdminUserRow } from "@/features/users/types/user-admin";
import { getSyncHealthTagTone } from "@/lib/admin/sync-health";

export default function AdminUserCard({ user }: { user: AdminUserRow }) {
    return (
        <article className="flex flex-col gap-nl-12 rounded-nl-control bg-nl-surface p-nl-12">
            <div className="flex items-start gap-nl-12">
                <span
                    className={`flex size-nl-32 shrink-0 items-center justify-center rounded-nl-full bg-nl-control ${user.role === "admin" ? "text-nl-content" : "text-nl-subdued"}`}
                >
                    {user.role === "admin" ? (
                        <ShieldCheck className="nl-icon-small" aria-hidden />
                    ) : (
                        <UserRound className="nl-icon-small" aria-hidden />
                    )}
                </span>
                <div className="min-w-0 flex-1">
                    <p className="nl-emphasis-label truncate text-nl-content">
                        {user.name}
                    </p>
                    <p className="nl-metadata text-nl-subdued">
                        #{user.id} · {user.country} · 가입{" "}
                        {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                </div>
                <span
                    className="nl-tag nl-tag--status shrink-0"
                    data-tone={getSyncHealthTagTone(user.health.tone)}
                >
                    {user.health.label}
                </span>
            </div>
            <p className="nl-metadata text-nl-subdued">
                플레이 {user.playCount}회 · 동기화 {user.counts.dataSyncs}회 ·
                평가 {user.counts.chartEvaluations}개 · 검정{" "}
                {user.counts.examAchievements}개
            </p>
            <div className="grid grid-cols-2 gap-nl-8">
                <div className="rounded-nl-control bg-nl-canvas p-nl-8">
                    <p className="nl-metadata text-nl-subdued">마지막 동기화</p>
                    <strong className="nl-metadata mt-nl-4 block text-nl-subdued">
                        {user.latestSyncAt
                            ? new Date(user.latestSyncAt).toLocaleString(
                                  "ko-KR"
                              )
                            : "-"}
                    </strong>
                </div>
                <div className="rounded-nl-control bg-nl-canvas p-nl-8">
                    <p className="nl-metadata text-nl-subdued">
                        공식 마지막 플레이
                    </p>
                    <strong className="nl-metadata mt-nl-4 block text-nl-subdued">
                        {user.nostalgiaLastPlaytime ?? "-"}
                    </strong>
                </div>
                <div className="rounded-nl-control bg-nl-canvas p-nl-8">
                    <p className="nl-metadata text-nl-subdued">
                        전체 채보 기록
                    </p>
                    <strong className="nl-metric-value mt-nl-4 block text-nl-content">
                        {user.counts.playData.toLocaleString("ko-KR")}
                    </strong>
                </div>
                <div className="rounded-nl-control bg-nl-canvas p-nl-8">
                    <p className="nl-metadata text-nl-subdued">
                        최근 플레이 기록
                    </p>
                    <strong className="nl-metric-value mt-nl-4 block text-nl-content">
                        {user.counts.recentPlayHistory.toLocaleString("ko-KR")}
                    </strong>
                </div>
            </div>
            <details className="border-t-nl-stroke border-nl-divider pt-nl-12">
                <summary className="nl-emphasis-label flex cursor-pointer list-none items-center gap-nl-8 text-nl-content">
                    <DatabaseZap className="nl-icon-small" aria-hidden />
                    상세 데이터 적재율
                </summary>
                <dl className="mt-nl-12 grid grid-cols-2 gap-x-nl-12 gap-y-nl-8">
                    <div>
                        <dt className="nl-metadata text-nl-subdued">
                            채보 판정
                        </dt>
                        <dd className="nl-metric-value text-nl-content">
                            {user.coverage.judgementRecords} /{" "}
                            {user.counts.playData}
                        </dd>
                    </div>
                    <div>
                        <dt className="nl-metadata text-nl-subdued">
                            음표 성공률
                        </dt>
                        <dd className="nl-metric-value text-nl-content">
                            {user.coverage.noteRateRecords} /{" "}
                            {user.counts.playData}
                        </dd>
                    </div>
                    <div>
                        <dt className="nl-metadata text-nl-subdued">
                            최근 플레이 판정
                        </dt>
                        <dd className="nl-metric-value text-nl-content">
                            {user.coverage.recentJudgementRecords} /{" "}
                            {user.counts.recentPlayHistory}
                        </dd>
                    </div>
                    <div>
                        <dt className="nl-metadata text-nl-subdued">
                            FAST/SLOW
                        </dt>
                        <dd className="nl-metric-value text-nl-content">
                            {user.coverage.recentFastSlowRecords} /{" "}
                            {user.counts.recentPlayHistory}
                        </dd>
                    </div>
                </dl>
            </details>
            <div className="grid grid-cols-2 gap-nl-8">
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
