import "server-only";

import type { Prisma } from "@prisma/client";

import db from "@/lib/db";

// 라우트(로그인 · 연동 · 관리자 확인)가 쓰는 User 읽기 · 쓰기 — 라우트에서 옮김(2026-10-16 D8)

/** 권한 확인용 역할 — 관리자 전용 라우트 · 통계 제외 */
export function getUserRole(userId: number) {
    return db.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });
}

/** 연동 토큰 판(무효화 확인)과 역할 — 자켓 수집 라우트 */
export function getUserSyncAuth(userId: number) {
    return db.user.findUnique({
        where: { id: userId },
        select: { syncTokenVersion: true, role: true },
    });
}

/** 온보딩을 마쳤는지 */
export function getProfileCompletedAt(userId: number) {
    return db.user.findUnique({
        where: { id: userId },
        select: { profileCompletedAt: true },
    });
}

/** Discord 연동을 시작한 로그인 사용자 */
export function getDiscordLinkingUser(userId: number) {
    return db.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            discordId: true,
            avatar: true,
            avatarUserManaged: true,
            role: true,
            sessionVersion: true,
        },
    });
}

/** 이 Discord 계정에 이미 이어진 사용자 */
export function findUserByDiscordId(discordId: string) {
    return db.user.findUnique({
        where: { discordId },
        select: {
            id: true,
            avatar: true,
            avatarUserManaged: true,
            discordName: true,
            discordUsername: true,
            profileCompletedAt: true,
            locale: true,
            role: true,
            sessionVersion: true,
        },
    });
}

/** Discord 이름 · 아바타 · 연동 id 저장 — 세션에 넣을 값을 돌려준다 */
export function updateDiscordIdentity(
    userId: number,
    data: Pick<
        Prisma.UserUpdateInput,
        "discordId" | "discordName" | "discordUsername" | "avatar"
    >
) {
    return db.user.update({
        where: { id: userId },
        data,
        select: { id: true, locale: true, role: true, sessionVersion: true },
    });
}

/** Discord 로 처음 들어온 사용자 */
export function createDiscordUser(data: {
    discordId: string;
    discordName: string | null;
    discordUsername: string;
    avatar: string | null;
}) {
    return db.user.create({
        data,
        select: { id: true, locale: true, role: true, sessionVersion: true },
    });
}
