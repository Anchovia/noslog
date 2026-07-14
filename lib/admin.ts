import { notFound, redirect } from "next/navigation";

import db from "@/lib/db";
import getSession from "@/lib/session";

// 관리자 페이지와 Server Action에서 동일한 권한 검사를 사용함
export async function requireAdmin() {
    const session = await getSession();

    if (!session.id) redirect("/login");

    const user = await db.user.findUnique({
        where: { id: session.id },
        select: {
            id: true,
            username: true,
            nostalgia_name: true,
            avatar: true,
            role: true,
        },
    });

    if (!user || user.role !== "admin") notFound();

    return user;
}
