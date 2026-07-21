import { KeyRound, Search, ShieldCheck, UserRound } from "lucide-react";

import { resetUserSyncToken, updateUserRole } from "@/app/admin/users/actions";
import db from "@/lib/db";

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q = "" } = await searchParams;
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
            sync_token_version: true,
            created_at: true,
            _count: {
                select: {
                    dataSyncs: true,
                    chartEvaluations: true,
                    examAchievements: true,
                },
            },
        },
        orderBy: { updated_at: "desc" },
        take: 100,
    });

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">유저 관리</h1>
                <p className="text-caption mt-1">
                    계정 권한과 데이터 연동 토큰을 관리합니다.
                </p>
            </section>
            <form className="relative">
                <Search className="text-text-disabled absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <input
                    name="q"
                    defaultValue={q}
                    placeholder="닉네임 · NOSTALGIA 이름 · Discord 검색"
                    className="border-border bg-surface text-input h-11 w-full rounded-md border pr-3 pl-10"
                />
            </form>
            <section className="flex flex-col gap-2">
                {users.map((user) => (
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
                        </div>
                        <p className="text-caption">
                            플레이 {user.play_count ?? 0}회 · 동기화{" "}
                            {user._count.dataSyncs}회 · 평가{" "}
                            {user._count.chartEvaluations}개 · 검정{" "}
                            {user._count.examAchievements}개
                        </p>
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
                                <button className="border-border flex h-9 w-full items-center justify-center gap-1 rounded-md border text-xs font-bold">
                                    <ShieldCheck className="size-3.5" />{" "}
                                    {user.role === "admin"
                                        ? "권한 해제"
                                        : "관리자 지정"}
                                </button>
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
            </section>
        </div>
    );
}
