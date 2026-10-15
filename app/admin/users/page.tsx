import { Search } from "lucide-react";
import FilterChipLinks from "@/components/ui/filter-chip-links";

import AdminUserCard from "@/features/users/components/admin/admin-user-card";
import { normalizeUserAdminFilters } from "@/features/users/schemas/user-admin-schema";
import { listAdminUsers } from "@/features/users/server/user-admin-service";

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; state?: string }>;
}) {
    const params = await searchParams;
    const filters = normalizeUserAdminFilters(params.q, params.state);
    const result = await listAdminUsers(filters);

    return (
        <div className="flex flex-col gap-nl-16 py-nl-24">
            <section>
                <h1 className="nl-section-title text-nl-content">유저 관리</h1>
                <p className="nl-metadata mt-nl-4 text-nl-subdued">
                    계정 권한과 데이터 연동 토큰을 관리합니다.
                </p>
            </section>
            <form>
                {filters.state === "attention" ? (
                    <input type="hidden" name="state" value="attention" />
                ) : null}
                <label className="nl-search">
                    <Search className="nl-icon" aria-hidden />
                    <input
                        name="q"
                        defaultValue={filters.q}
                        placeholder="닉네임 · NOSTALGIA 이름 · Discord 검색"
                        aria-label="유저 검색"
                        className="nl-search__input nl-body"
                    />
                </label>
            </form>
            <FilterChipLinks
                label="사용자 상태"
                options={[
                    {
                        key: "all",
                        href: `/admin/users?q=${encodeURIComponent(filters.q)}`,
                        selected: filters.state !== "attention",
                        label: `전체 ${result.totalCount}`,
                    },
                    {
                        key: "attention",
                        href: `/admin/users?state=attention&q=${encodeURIComponent(filters.q)}`,
                        selected: filters.state === "attention",
                        label: `점검 필요 ${result.attentionCount}`,
                    },
                ]}
            />
            <section className="flex flex-col gap-nl-8">
                {result.users.map((user) => (
                    <AdminUserCard key={user.id} user={user} />
                ))}
                {result.users.length === 0 ? (
                    <p className="nl-body-secondary rounded-nl-container bg-nl-surface py-nl-48 text-center text-nl-subdued">
                        조건에 맞는 유저가 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
