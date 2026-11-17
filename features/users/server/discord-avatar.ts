import "server-only";

import { createHmac } from "node:crypto";

import { put } from "@vercel/blob";

import { serverEnv } from "@/lib/env/server";
import {
    detectImageContentType,
    MAX_IMAGE_SIZE,
} from "@/lib/image-upload-rules";
import { logServerError } from "@/lib/observability/server";

const DISCORD_AVATAR_TIMEOUT_MS = 10_000;
const DISCORD_CDN_HOSTNAME = "cdn.discordapp.com";
const PUBLIC_BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

// 같은 Discord 사진이면 같은 경로가 나와 다시 받지 않는다. Discord 사진 해시를 그대로 넣으면
// 주소만으로 Discord 계정과 맞춰 볼 수 있어, 서버 비밀값으로 바꾼 값을 넣는다
function copyPathname(userId: number, discordAvatarHash: string) {
    const tag = createHmac("sha256", serverEnv.COOKIE_PASSWORD)
        .update(`discord-avatar:${userId}:${discordAvatarHash}`)
        .digest("hex")
        .slice(0, 32);
    return `avatars/${userId}/discord-${tag}.png`;
}

/** 저장된 주소가 이 회원의 Discord 사진 복사본이면 그 저장 경로 */
function storedCopyPathname(userId: number, avatar: URL) {
    return avatar.hostname.endsWith(PUBLIC_BLOB_HOST_SUFFIX) &&
        avatar.pathname.startsWith(`/avatars/${userId}/discord-`)
        ? avatar.pathname.slice(1)
        : null;
}

/**
 * Discord 사진을 따라가는 회원인지. 직접 올리거나 지운 사진(avatarUserManaged)과,
 * 그 칸이 생기기 전에 올린 사진(저장 경로가 `profile-`)은 덮어쓰지 않는다
 */
function usesDiscordAvatar(
    userId: number,
    avatar: string | null,
    userManaged: boolean
) {
    if (userManaged) return false;
    if (!avatar) return true;
    const url = URL.parse(avatar);
    return (
        url !== null &&
        (url.hostname === DISCORD_CDN_HOSTNAME ||
            storedCopyPathname(userId, url) !== null)
    );
}

async function downloadDiscordAvatar(
    discordUserId: string,
    discordAvatarHash: string
) {
    // 움직이는 사진(a_)도 png 로 청하면 첫 장이 온다. 저장소가 받는 형식에 gif 가 없다
    const response = await fetch(
        `https://${DISCORD_CDN_HOSTNAME}/avatars/${discordUserId}/${discordAvatarHash}.png?size=256`,
        {
            cache: "no-store",
            signal: AbortSignal.timeout(DISCORD_AVATAR_TIMEOUT_MS),
        }
    );
    if (!response.ok || !response.body)
        throw new Error(`Discord avatar download failed: ${response.status}`);

    // Content-Length 는 보내는 쪽이 정하므로 받은 바이트로 센다
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > MAX_IMAGE_SIZE) {
            await reader.cancel();
            throw new Error("Discord avatar exceeds the image size limit");
        }
        chunks.push(value);
    }
    const bytes = Buffer.concat(chunks);
    if (detectImageContentType(bytes) !== "image/png")
        throw new Error("Discord avatar is not a PNG image");
    return bytes;
}

/**
 * `users.avatar` 에 넣을 값을 돌려준다. Discord 사진은 NosLog 공개 저장소에 복사한 주소로만 저장한다 —
 * Discord CDN 주소에는 Discord 사용자 식별자가 들어 있어, 그대로 쓰면 「Discord 비공개」 여도 드러난다.
 * 복사하지 못하면 null(기본 사진)이고 로그인은 그대로 이어진다
 */
export async function syncDiscordAvatar(
    user: { id: number; avatar: string | null; avatarUserManaged: boolean },
    discordUser: { id: string; avatar: string | null }
) {
    if (!usesDiscordAvatar(user.id, user.avatar, user.avatarUserManaged))
        return user.avatar;
    if (!discordUser.avatar) return null;

    const pathname = copyPathname(user.id, discordUser.avatar);
    const stored = user.avatar ? URL.parse(user.avatar) : null;
    if (stored && storedCopyPathname(user.id, stored) === pathname)
        return user.avatar;

    try {
        const bytes = await downloadDiscordAvatar(
            discordUser.id,
            discordUser.avatar
        );
        const blob = await put(pathname, bytes, {
            access: "public",
            contentType: "image/png",
            addRandomSuffix: false,
            // 주소 저장에 실패해 파일만 남았을 때, 다음 로그인이 같은 경로에 다시 올릴 수 있어야 한다
            allowOverwrite: true,
        });
        return blob.url;
    } catch (error) {
        logServerError(error, {
            event: "auth.discord.avatar-copy.failed",
            routePath: "/discord/complete",
            routeType: "route",
        });
        return null;
    }
}
