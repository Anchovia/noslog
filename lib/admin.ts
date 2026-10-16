import { notFound, redirect } from "next/navigation";

import { getSessionUser } from "@/lib/user";

// 관리자 페이지와 Server Action에서 동일한 권한 검사를 사용함.
// 사용자 조회는 같은 요청의 헤더 등과 함께 한 번만 한다(React cache, 2026-10-15 CORE-15)
export async function requireAdmin() {
    const { session, user } = await getSessionUser();

    if (!session.id) redirect("/login");
    if (!user || user.role !== "admin") notFound();

    return {
        id: user.id,
        username: user.username,
        nostalgia_name: user.nostalgiaName,
        avatar: user.avatar,
        role: user.role,
    };
}
