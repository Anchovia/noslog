import { listAdminBingos } from "@/features/bingos/server/bingo-admin-data";
import Link from "next/link";

import {
    AdminCard,
    AdminCardEmpty,
    AdminCardHead,
    AdminPager,
    AdminStatus,
    AdminTable,
} from "@/components/admin/admin-card";
import { foundationButtonClass } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin";
import {
    ADMIN_PAGE_SIZE,
    adminPageHref,
    parseAdminPage,
} from "@/lib/admin/page";

const statusLabel: Record<string, string> = {
    draft: "임시 저장",
    published: "공개",
    archived: "보관",
};

export default async function AdminBingosPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    await requireAdmin();
    const page = parseAdminPage((await searchParams).page);
    const { bingos, totalCount } = await listAdminBingos(page);

    return (
        <AdminCard>
            <AdminCardHead
                title="빙고"
                actions={
                    <Link
                        href="/admin/bingos/new"
                        className={foundationButtonClass({
                            variant: "secondary",
                            size: "sm",
                        })}
                    >
                        빙고 추가
                    </Link>
                }
            />
            {bingos.length === 0 ? (
                <AdminCardEmpty>등록된 빙고가 없습니다.</AdminCardEmpty>
            ) : (
                <AdminTable>
                    <thead>
                        <tr>
                            <th scope="col">제목</th>
                            <th scope="col">표지 곡</th>
                            <th scope="col">칸</th>
                            <th scope="col">완성 줄</th>
                            <th scope="col">보상</th>
                            <th scope="col">상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bingos.map((bingo) => (
                            <tr key={bingo.id}>
                                <td>
                                    <Link href={`/admin/bingos/${bingo.id}`}>
                                        {bingo.title ?? "제목 없음"}
                                    </Link>
                                </td>
                                <td>{bingo.coverMusic.title}</td>
                                <td>{bingo._count.cells}/25칸</td>
                                <td>{bingo.requiredLines}줄</td>
                                <td>
                                    {bingo.rewardNos.toLocaleString("ko-KR")}{" "}
                                    nos
                                </td>
                                <td>
                                    <AdminStatus
                                        tone={
                                            bingo.status === "published"
                                                ? "success"
                                                : "empty"
                                        }
                                    >
                                        {statusLabel[bingo.status] ??
                                            bingo.status}
                                    </AdminStatus>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </AdminTable>
            )}
            <AdminPager
                page={page}
                pageSize={ADMIN_PAGE_SIZE}
                total={totalCount}
                unit="개"
                hrefFor={(target) => adminPageHref("/admin/bingos", {}, target)}
            />
        </AdminCard>
    );
}
