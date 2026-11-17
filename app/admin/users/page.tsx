import { Search } from "lucide-react";

import {
    AdminCard,
    AdminCardEmpty,
    AdminCardHead,
    AdminCardTools,
    AdminPager,
    AdminTable,
} from "@/components/admin/admin-card";
import FilterChipLinks from "@/components/ui/filter-chip-links";
import AdminUserRow from "@/features/users/components/admin/admin-user-row";
import { normalizeUserAdminFilters } from "@/features/users/schemas/user-admin-schema";
import { listAdminUsers } from "@/features/users/server/user-admin-service";
import { requireAdmin } from "@/lib/admin";
import {
    ADMIN_PAGE_SIZE,
    adminPageHref,
    parseAdminPage,
} from "@/lib/admin/page";

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; state?: string; page?: string }>;
}) {
    await requireAdmin();
    const params = await searchParams;
    const filters = normalizeUserAdminFilters(params.q, params.state);
    const page = parseAdminPage(params.page);
    const result = await listAdminUsers(filters, new Date(), page);
    const state = filters.state === "attention" ? "attention" : undefined;
    const total =
        filters.state === "attention"
            ? result.attentionCount
            : result.totalCount;

    return (
        <AdminCard>
            <AdminCardHead title="유저" />
            <AdminCardTools>
                <FilterChipLinks
                    label="사용자 상태"
                    options={[
                        {
                            key: "all",
                            href: adminPageHref(
                                "/admin/users",
                                { q: filters.q },
                                1
                            ),
                            selected: filters.state !== "attention",
                            label: `전체 ${result.totalCount}`,
                        },
                        {
                            key: "attention",
                            href: adminPageHref(
                                "/admin/users",
                                { state: "attention", q: filters.q },
                                1
                            ),
                            selected: filters.state === "attention",
                            label: `점검 필요 ${result.attentionCount}`,
                        },
                    ]}
                />
                <form>
                    {state ? (
                        <input type="hidden" name="state" value={state} />
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
            </AdminCardTools>
            {result.users.length === 0 ? (
                <AdminCardEmpty>조건에 맞는 유저가 없습니다.</AdminCardEmpty>
            ) : (
                <AdminTable>
                    <thead>
                        <tr>
                            <th scope="col">닉네임</th>
                            <th scope="col">NOSTALGIA 이름</th>
                            <th scope="col">가입일</th>
                            <th scope="col">마지막 동기화</th>
                            <th scope="col">권한</th>
                            <th scope="col">상태</th>
                            <th scope="col" className="nl-admin-table__menu">
                                <span className="sr-only">메뉴</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.users.map((user) => (
                            <AdminUserRow key={user.id} user={user} />
                        ))}
                    </tbody>
                </AdminTable>
            )}
            <AdminPager
                page={page}
                pageSize={ADMIN_PAGE_SIZE}
                total={total}
                unit="명"
                hrefFor={(target) =>
                    adminPageHref(
                        "/admin/users",
                        { q: filters.q, state },
                        target
                    )
                }
            />
        </AdminCard>
    );
}
