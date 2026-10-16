import type { Prisma } from "@prisma/client";
import { cache } from "react";

import db from "./db";
import getSession from "./session";

// 요청마다 읽는 로그인 사용자 — 셸 · 권한 · 언어 판단에 쓰는 열만(2026-10-16 DB 재설계 P4 Q3).
// 예전에는 select 없이 User 43열을 모두 읽었다. 다른 열이 필요하면 그 화면의 data 함수가 따로 읽는다
export const SESSION_USER_SELECT = {
    id: true,
    username: true,
    avatar: true,
    role: true,
    locale: true,
    nostalgiaName: true,
    showLocalizedMusicTitle: true,
    preferredArcadeId: true,
    syncTokenVersion: true,
} satisfies Prisma.UserSelect;

export type SessionUser = Prisma.UserGetPayload<{
    select: typeof SESSION_USER_SELECT;
}>;

export const getSessionUser = cache(async () => {
    const session = await getSession();
    const user = session.id
        ? await db.user.findUnique({
              where: { id: session.id },
              select: SESSION_USER_SELECT,
          })
        : null;

    return { session, user };
});

export async function getUser() {
    const { user } = await getSessionUser();
    return user;
}
