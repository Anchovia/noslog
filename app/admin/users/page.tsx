import {
    DatabaseZap,
    KeyRound,
    Search,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import Link from "next/link";

import { resetUserSyncToken, updateUserRole } from "@/app/admin/users/actions";
import AdminRoleToggleButton from "@/components/admin/adminRoleToggleButton";
import {
    getSyncHealthClassName,
    getUserSyncHealth,
} from "@/lib/admin/syncHealth";
import db from "@/lib/db";

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; state?: string }>;
}) {
    const { q = "", state = "all" } = await searchParams;
    const keyword = q.trim();
    const users = await db.user.findMany({
        where: keyword
            ? {
                  OR: [
                      { username: { contains: keyword } },
                      { nostalgia_name: { contains: keyword } },
                      { discord_name: { contains: keyword } },
                      { discord_username: { contains: keyword } },
                  ],
              }
            : undefined,
        select: {
            id: true,
            username: true,
            nostalgia_name: true,
            country: true,
            role: true,
            play_count: true,
            nostalgia_last_playtime: true,
            sync_token_version: true,
            created_at: true,
            dataSyncs: {
                select: {
                    status: true,
                    sync_scope: true,
                    started_at: true,
                    completed_at: true,
                },
                orderBy: { started_at: "desc" },
                take: 1,
            },
            _count: {
                select: {
                    dataSyncs: true,
                    PlayData: true,
                    chartPlayHistory: true,
                    chartEvaluations: true,
                    examAchievements: true,
                },
            },
        },
        orderBy: { updated_at: "desc" },
        take: 100,
    });
    const userIds = users.map((user) => user.id);
    const [
        judgementGroups,
        noteRateGroups,
        recentJudgementGroups,
        recentFastSlowGroups,
    ] = await Promise.all([
        db.playData.groupBy({
            by: ["user_id"],
            where: {
                user_id: { in: userIds },
                judge_sjust: { not: null },
                judge_just: { not: null },
                judge_good: { not: null },
                judge_miss: { not: null },
                judge_near: { not: null },
            },
            _count: { _all: true },
        }),
        db.playData.groupBy({
            by: ["user_id"],
            where: {
                user_id: { in: userIds },
                note_rate_standard: { not: null },
            },
            _count: { _all: true },
        }),
        db.chartPlayHistory.groupBy({
            by: ["user_id"],
            where: {
                user_id: { in: userIds },
                judge_sjust: { not: null },
                judge_just: { not: null },
                judge_good: { not: null },
                judge_miss: { not: null },
                judge_near: { not: null },
            },
            _count: { _all: true },
        }),
        db.chartPlayHistory.groupBy({
            by: ["user_id"],
            where: {
                user_id: { in: userIds },
                fast_count: { not: null },
                slow_count: { not: null },
            },
            _count: { _all: true },
        }),
    ]);
    const judgementByUser = new Map(
        judgementGroups.map((row) => [row.user_id, row._count._all] as const)
    );
    const noteRateByUser = new Map(
        noteRateGroups.map((row) => [row.user_id, row._count._all] as const)
    );
    const recentJudgementByUser = new Map(
        recentJudgementGroups.map(
            (row) => [row.user_id, row._count._all] as const
        )
    );
    const recentFastSlowByUser = new Map(
        recentFastSlowGroups.map(
            (row) => [row.user_id, row._count._all] as const
        )
    );
    const now = new Date();
    const userRows = users.map((user) => {
        const latestSync = user.dataSyncs[0] ?? null;
        const judgementRecords = judgementByUser.get(user.id) ?? 0;
        const noteRateRecords = noteRateByUser.get(user.id) ?? 0;
        const recentJudgementRecords = recentJudgementByUser.get(user.id) ?? 0;
        const recentFastSlowRecords = recentFastSlowByUser.get(user.id) ?? 0;
        const health = getUserSyncHealth(
            {
                latestStatus: latestSync?.status ?? null,
                latestStartedAt: latestSync?.started_at ?? null,
                totalRecords: user._count.PlayData,
                judgementRecords,
                noteRateRecords,
            },
            now
        );

        return {
            ...user,
            latestSync,
            judgementRecords,
            noteRateRecords,
            recentJudgementRecords,
            recentFastSlowRecords,
            health,
        };
    });
    const filteredUsers =
        state === "attention"
            ? userRows.filter((user) => user.health.needsAttention)
            : userRows;
    const attentionCount = userRows.filter(
        (user) => user.health.needsAttention
    ).length;

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">유저 관리</h1>
                <p className="text-caption mt-1">
                    계정 권한과 데이터 연동 토큰을 관리합니다.
                </p>
            </section>
            <form className="relative">
                {state === "attention" ? (
                    <input type="hidden" name="state" value="attention" />
                ) : null}
                <Search className="text-text-disabled absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <input
                    name="q"
                    defaultValue={q}
                    placeholder="닉네임 · NOSTALGIA 이름 · Discord 검색"
                    className="border-border bg-surface text-input h-11 w-full rounded-md border pr-3 pl-10"
                />
            </form>
            <nav className="flex gap-2">
                <Link
                    href={`/admin/users?q=${encodeURIComponent(q)}`}
                    className={`rounded-md px-3 py-2 text-sm font-semibold ${state !== "attention" ? "bg-text-primary text-bg" : "bg-surface text-text-secondary"}`}
                >
                    전체 {userRows.length}
                </Link>
                <Link
                    href={`/admin/users?state=attention&q=${encodeURIComponent(q)}`}
                    className={`rounded-md px-3 py-2 text-sm font-semibold ${state === "attention" ? "bg-score text-bg" : "bg-surface text-text-secondary"}`}
                >
                    점검 필요 {attentionCount}
                </Link>
            </nav>
            <section className="flex flex-col gap-2">
                {filteredUsers.map((user) => (
                    <article
                        key={user.id}
                        className="bg-surface rounded-card flex flex-col gap-3 p-3"
                    >
                        <div className="flex items-start gap-3">
                            <span
                                className={`flex size-9 shrink-0 items-center justify-center rounded-full ${user.role === "admin" ? "bg-basic/10 text-basic" : "bg-surface-muted text-text-secondary"}`}
                            >
                                {user.role === "admin" ? (
                                    <ShieldCheck className="size-4" />
                                ) : (
                                    <UserRound className="size-4" />
                                )}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-body truncate font-bold">
                                    {user.nostalgia_name ??
                                        user.username ??
                                        `유저 ${user.id}`}
                                </p>
                                <p className="text-caption">
                                    #{user.id} · {user.country} · 가입{" "}
                                    {user.created_at.toLocaleDateString(
                                        "ko-KR"
                                    )}
                                </p>
                            </div>
                            <span
                                className={`${getSyncHealthClassName(user.health.tone)} shrink-0 rounded-full px-2 py-1 text-xs font-semibold`}
                            >
                                {user.health.label}
                            </span>
                        </div>
                        <p className="text-caption">
                            플레이 {user.play_count ?? 0}회 · 동기화{" "}
                            {user._count.dataSyncs}회 · 평가{" "}
                            {user._count.chartEvaluations}개 · 검정{" "}
                            {user._count.examAchievements}개
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-bg rounded-md p-2">
                                <p className="text-micro">마지막 동기화</p>
                                <strong className="text-caption mt-0.5 block font-semibold">
                                    {user.latestSync
                                        ? user.latestSync.started_at.toLocaleString(
                                              "ko-KR"
                                          )
                                        : "-"}
                                </strong>
                            </div>
                            <div className="bg-bg rounded-md p-2">
                                <p className="text-micro">공식 마지막 플레이</p>
                                <strong className="text-caption mt-0.5 block font-semibold">
                                    {user.nostalgia_last_playtime ?? "-"}
                                </strong>
                            </div>
                            <div className="bg-bg rounded-md p-2">
                                <p className="text-micro">전체 채보 기록</p>
                                <strong className="text-label mt-0.5 block tabular-nums">
                                    {user._count.PlayData.toLocaleString(
                                        "ko-KR"
                                    )}
                                </strong>
                            </div>
                            <div className="bg-bg rounded-md p-2">
                                <p className="text-micro">최근 플레이 기록</p>
                                <strong className="text-label mt-0.5 block tabular-nums">
                                    {user._count.chartPlayHistory.toLocaleString(
                                        "ko-KR"
                                    )}
                                </strong>
                            </div>
                        </div>
                        <details className="border-border border-t pt-3">
                            <summary className="text-label flex cursor-pointer list-none items-center gap-1.5 font-semibold">
                                <DatabaseZap className="size-3.5" />
                                상세 데이터 적재율
                            </summary>
                            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                                <div>
                                    <dt className="text-micro">채보 판정</dt>
                                    <dd className="text-label tabular-nums">
                                        {user.judgementRecords} /{" "}
                                        {user._count.PlayData}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-micro">음표 성공률</dt>
                                    <dd className="text-label tabular-nums">
                                        {user.noteRateRecords} /{" "}
                                        {user._count.PlayData}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-micro">
                                        최근 플레이 판정
                                    </dt>
                                    <dd className="text-label tabular-nums">
                                        {user.recentJudgementRecords} /{" "}
                                        {user._count.chartPlayHistory}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-micro">FAST/SLOW</dt>
                                    <dd className="text-label tabular-nums">
                                        {user.recentFastSlowRecords} /{" "}
                                        {user._count.chartPlayHistory}
                                    </dd>
                                </div>
                            </dl>
                        </details>
                        <div className="grid grid-cols-2 gap-2">
                            <form
                                action={updateUserRole}
                                className="flex gap-2"
                            >
                                <input
                                    type="hidden"
                                    name="userId"
                                    value={user.id}
                                />
                                <input
                                    type="hidden"
                                    name="role"
                                    value={
                                        user.role === "admin" ? "user" : "admin"
                                    }
                                />
                                <AdminRoleToggleButton
                                    isAdmin={user.role === "admin"}
                                    userLabel={
                                        user.nostalgia_name ??
                                        user.username ??
                                        `유저 ${user.id}`
                                    }
                                />
                            </form>
                            <form action={resetUserSyncToken}>
                                <input
                                    type="hidden"
                                    name="userId"
                                    value={user.id}
                                />
                                <button className="border-border flex h-9 w-full items-center justify-center gap-1 rounded-md border text-xs font-bold">
                                    <KeyRound className="size-3.5" /> 연동 토큰
                                    초기화 ({user.sync_token_version})
                                </button>
                            </form>
                        </div>
                    </article>
                ))}
                {filteredUsers.length === 0 ? (
                    <p className="text-body-muted bg-surface rounded-card py-12 text-center">
                        조건에 맞는 유저가 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
