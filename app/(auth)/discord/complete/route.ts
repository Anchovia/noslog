import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import {
    createDiscordUser,
    findUserByDiscordId,
    getDiscordLinkingUser,
    updateDiscordIdentity,
} from "@/features/users/server/user-data";
import { getSafeAuthReturnPath } from "@/lib/auth-return-path";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cache-tags";
import { serverEnv } from "@/lib/env/server";
import { isLocale, type Locale, localizePath } from "@/lib/i18n/routing";
import { logSecurityEvent } from "@/lib/observability/server";
import getSession from "@/lib/session";

const DISCORD_TIMEOUT_MS = 10_000;

interface DiscordTokenResponse {
    access_token?: string;
}

interface DiscordUserResponse {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string | null;
    mfa_enabled?: boolean;
}

function errorRedirect(
    request: NextRequest,
    error: string,
    isLinking: boolean,
    returnTo: string = "/",
    locale?: Locale
) {
    const url = new URL(
        isLinking
            ? "/profile/settings"
            : locale
              ? localizePath("/login", locale)
              : "/login",
        request.url
    );
    url.searchParams.set(isLinking ? "discordError" : "error", error);
    if (!isLinking && returnTo !== "/")
        url.searchParams.set("returnTo", returnTo);
    return NextResponse.redirect(url);
}

function discordAvatar(user: DiscordUserResponse) {
    if (!user.avatar) return null;
    const extension = user.avatar.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=256`;
}

function shouldUseDiscordAvatar(
    currentAvatar: string | null,
    userManaged = false
) {
    if (userManaged) return false;
    if (!currentAvatar) return true;

    try {
        const hostname = new URL(currentAvatar).hostname;
        return hostname === "cdn.discordapp.com";
    } catch {
        return false;
    }
}

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    const session = await getSession();
    const currentUser = session.id
        ? await getDiscordLinkingUser(session.id)
        : null;
    if (session.id && !currentUser) {
        delete session.id;
        delete session.profileCompleted;
        delete session.locale;
    }
    const isLinking = Boolean(currentUser);
    const expectedState = session.discordOAuthState;
    const mode = session.discordOAuthMode;
    const initiatingUserId = session.discordOAuthUserId;
    const returnTo = getSafeAuthReturnPath(session.discordOAuthReturnTo) ?? "/";
    const errorResponse = (error: string) => {
        logSecurityEvent({
            event: "auth.discord.failed",
            actorUserId: currentUser?.id,
            mode,
            reason: error,
        });
        // 복귀 주소 검사는 /admin 을 받지 않아, 관리자 재확인 실패는 안내가 보이는 연결 설정으로 보낸다
        if (mode && mode !== "admin") {
            const url = new URL(returnTo, request.url);
            url.searchParams.set("discordError", error);
            return NextResponse.redirect(url);
        }
        return errorRedirect(
            request,
            error,
            isLinking,
            returnTo,
            session.locale
        );
    };

    delete session.discordOAuthState;
    delete session.discordOAuthReturnTo;
    delete session.discordOAuthMode;
    delete session.discordOAuthUserId;
    await session.save();

    if (!state || !expectedState || state !== expectedState) {
        return errorResponse("invalid_state");
    }
    if (mode && (!currentUser || currentUser.id !== initiatingUserId))
        return errorResponse("session_expired");
    if (request.nextUrl.searchParams.get("error") === "access_denied")
        return errorResponse("cancelled");
    if (!code) return errorResponse("invalid_state");

    const clientId = serverEnv.DISCORD_CLIENT_ID;
    const clientSecret = serverEnv.DISCORD_CLIENT_SECRET;
    const redirectUri = serverEnv.DISCORD_REDIRECT_URI;
    if (!clientId || !clientSecret || !redirectUri) {
        return errorResponse("oauth_config");
    }

    try {
        const tokenResponse = await fetch(
            "https://discord.com/api/v10/oauth2/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code,
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: redirectUri,
                }),
                cache: "no-store",
                signal: AbortSignal.timeout(DISCORD_TIMEOUT_MS),
            }
        );
        if (!tokenResponse.ok) {
            return errorResponse("token_exchange");
        }

        const token = (await tokenResponse.json()) as DiscordTokenResponse;
        if (!token.access_token) {
            return errorResponse("token_exchange");
        }

        const userResponse = await fetch(
            "https://discord.com/api/v10/users/@me",
            {
                headers: { Authorization: `Bearer ${token.access_token}` },
                cache: "no-store",
                signal: AbortSignal.timeout(DISCORD_TIMEOUT_MS),
            }
        );
        if (!userResponse.ok) {
            return errorResponse("profile_fetch");
        }

        const discordUser = (await userResponse.json()) as DiscordUserResponse;
        if (!discordUser.id || !discordUser.username) {
            return errorResponse("profile_fetch");
        }

        const discordName = discordUser.global_name ?? discordUser.username;
        if (
            (mode === "refresh" || mode === "delete" || mode === "admin") &&
            currentUser?.discordId !== discordUser.id
        )
            return errorResponse("identity_mismatch");
        session.discordMfaEnabled = discordUser.mfa_enabled === true;
        if (mode === "admin" && currentUser) {
            if (!session.discordMfaEnabled) {
                await session.save();
                return errorResponse("admin_mfa_required");
            }
            session.adminVerification = {
                userId: currentUser.id,
                discordId: discordUser.id,
                verifiedAt: Date.now(),
            };
            await session.save();
            logSecurityEvent({
                event: "auth.discord.succeeded",
                actorUserId: currentUser.id,
                mode,
            });
            return NextResponse.redirect(new URL("/admin/users", request.url));
        }
        if (mode === "delete" && currentUser) {
            session.deletionVerification = {
                userId: currentUser.id,
                discordId: discordUser.id,
                verifiedAt: Date.now(),
            };
            await session.save();
            const destination = new URL(returnTo, request.url);
            destination.searchParams.set("discordResult", "delete");
            return NextResponse.redirect(destination);
        }
        const avatar = discordAvatar(discordUser);
        const linkedUser = await findUserByDiscordId(discordUser.id);

        if (currentUser) {
            if (linkedUser && linkedUser.id !== currentUser.id) {
                return errorResponse("already_linked");
            }
            // 재확인은 연결된 Discord 로 하므로, 훔친 쿠키로 자기 Discord 를 연결하면 재확인이 뚫린다
            if (
                currentUser.role === "admin" &&
                currentUser.discordId !== discordUser.id
            ) {
                return errorResponse("admin_discord_locked");
            }

            await updateDiscordIdentity(currentUser.id, {
                ...(mode === "refresh" ? {} : { discordId: discordUser.id }),
                discordName: discordName,
                discordUsername: discordUser.username,
                ...(mode === "refresh"
                    ? {}
                    : {
                          avatar:
                              avatar &&
                              shouldUseDiscordAvatar(
                                  currentUser.avatar,
                                  currentUser.avatarUserManaged
                              )
                                  ? avatar
                                  : currentUser.avatar,
                      }),
            });
            // 이름 · 아바타는 랭킹 줄과 악곡 순위 줄에도 나온다(2026-10-16 D8 · B6 — 설정 저장과 같게)
            revalidateTag(getUserProfileTag(currentUser.id), "max");
            revalidateTag(CACHE_TAGS.userRankings, "max");
            revalidateTag(CACHE_TAGS.chartRankings, "max");
            await session.save();
            logSecurityEvent({
                event: "auth.discord.succeeded",
                actorUserId: currentUser.id,
                mode,
            });
            if (currentUser.role === "admin" && !session.discordMfaEnabled)
                return errorResponse("admin_mfa_required");
            const destination = new URL(returnTo, request.url);
            if (mode) destination.searchParams.set("discordResult", mode);
            return NextResponse.redirect(destination);
        }

        // 다시 로그인할 때 값이 그대로면 쓰지 않는다 — 랭킹 줄에 나오는 아바타가 바뀐 경우만 랭킹을 비운다(2026-10-15 S4)
        const linkedValues = linkedUser
            ? {
                  discordName: linkedUser.discordName ?? discordName,
                  discordUsername:
                      linkedUser.discordUsername ?? discordUser.username,
                  avatar:
                      avatar &&
                      shouldUseDiscordAvatar(
                          linkedUser.avatar,
                          linkedUser.avatarUserManaged
                      )
                          ? avatar
                          : linkedUser.avatar,
              }
            : null;
        const linkedChanged =
            linkedUser !== null &&
            linkedValues !== null &&
            (linkedValues.discordName !== linkedUser.discordName ||
                linkedValues.discordUsername !== linkedUser.discordUsername ||
                linkedValues.avatar !== linkedUser.avatar);
        const user = linkedUser
            ? linkedChanged
                ? await updateDiscordIdentity(linkedUser.id, linkedValues!)
                : {
                      id: linkedUser.id,
                      locale: linkedUser.locale,
                      role: linkedUser.role,
                      sessionVersion: linkedUser.sessionVersion,
                  }
            : await createDiscordUser({
                  discordId: discordUser.id,
                  discordName: discordName,
                  discordUsername: discordUser.username,
                  avatar,
              });
        const profileCompleted = Boolean(linkedUser?.profileCompletedAt);

        // 새 계정은 그 id 로 캐시된 「없는 프로필」 을 비운다
        if (linkedChanged || !linkedUser)
            revalidateTag(getUserProfileTag(user.id), "max");
        if (linkedChanged && linkedValues?.avatar !== linkedUser?.avatar) {
            revalidateTag(CACHE_TAGS.userRankings, "max");
            revalidateTag(CACHE_TAGS.chartRankings, "max");
        }
        session.id = user.id;
        session.role = user.role;
        session.sessionVersion = user.sessionVersion;
        session.profileCompleted = profileCompleted;
        if (!profileCompleted) session.onboardingReturnTo = returnTo;
        if (profileCompleted && isLocale(user.locale)) {
            session.locale = user.locale;
        }
        await session.save();
        logSecurityEvent({
            event: "auth.discord.succeeded",
            actorUserId: user.id,
        });
        if (
            user.role === "admin" &&
            !session.discordMfaEnabled &&
            profileCompleted
        ) {
            logSecurityEvent({
                event: "auth.discord.admin-mfa-denied",
                actorUserId: user.id,
            });
            const settings = new URL("/profile/settings", request.url);
            settings.searchParams.set("discordError", "admin_mfa_required");
            return NextResponse.redirect(settings);
        }
        return NextResponse.redirect(
            new URL(
                profileCompleted
                    ? returnTo
                    : session.locale
                      ? localizePath("/onboarding", session.locale)
                      : "/onboarding",
                request.url
            )
        );
    } catch {
        return errorResponse("account_update");
    }
}
