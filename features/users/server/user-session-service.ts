import "server-only";

import db from "@/lib/db";
import { logSecurityEvent } from "@/lib/observability/server";

/** 사고 때 이 사용자의 모든 로그인 쿠키를 무효로 한다. 절차는 docs/operations/incident-response.md */
export async function revokeUserSessions(userId: number) {
    await db.user.update({
        where: { id: userId },
        data: { sessionVersion: { increment: 1 } },
        select: { id: true },
    });
    logSecurityEvent({ event: "auth.sessions-revoked", targetUserId: userId });
}

/** 로그아웃 — 쿠키만 지우면 복사된 쿠키가 만료까지 살아 있어, 버전을 올려 이 사용자의 모든 기기를 함께 끊는다 */
export async function endUserSessions(userId: number) {
    await db.user.updateMany({
        where: { id: userId },
        data: { sessionVersion: { increment: 1 } },
    });
}
