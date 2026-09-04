import { Search } from "lucide-react";
import Link from "next/link";

import AdminUserCard from "@/features/users/components/admin/adminUserCard";
import { normalizeUserAdminFilters } from "@/features/users/schemas/userAdminSchema";
import { listAdminUsers } from "@/features/users/server/userAdminService";

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; state?: string }>;
}) {
    const params = await searchParams;
    const filters = normalizeUserAdminFilters(params.q, params.state);
    const result = await listAdminUsers(filters);

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">유저 관리</h1>
                <p className="text-caption mt-1">
                    계정 권한과 데이터 연동 토큰을 관리합니다.
                </p>
            </section>
            <form className="relative">
                {filters.state === "attention" ? (
                    <input type="hidden" name="state" value="attention" />
                ) : null}
                <Search
                    className="text-text-disabled absolute top-1/2 left-3 size-4 -translate-y-1/2"
                    aria-hidden
                />
                <input
                    name="q"
                    defaultValue={filters.q}
                    placeholder="닉네임 · NOSTALGIA 이름 · Discord 검색"
                    className="border-border bg-surface text-input h-11 w-full rounded-md border pr-3 pl-10"
                />
            </form>
            <nav className="flex gap-2">
                <Link
                    href={`/admin/users?q=${encodeURIComponent(filters.q)}`}
                    className={`rounded-md px-3 py-2 text-sm font-semibold ${filters.state !== "attention" ? "bg-text-primary text-bg" : "bg-surface text-text-secondary"}`}
                >
                    전체 {result.totalCount}
                </Link>
                <Link
                    href={`/admin/users?state=attention&q=${encodeURIComponent(filters.q)}`}
                    className={`rounded-md px-3 py-2 text-sm font-semibold ${filters.state === "attention" ? "bg-score text-bg" : "bg-surface text-text-secondary"}`}
                >
                    점검 필요 {result.attentionCount}
                </Link>
            </nav>
            <section className="flex flex-col gap-2">
                {result.users.map((user) => (
                    <AdminUserCard key={user.id} user={user} />
                ))}
                {result.users.length === 0 ? (
                    <p className="text-body-muted bg-surface rounded-card py-12 text-center">
                        조건에 맞는 유저가 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
