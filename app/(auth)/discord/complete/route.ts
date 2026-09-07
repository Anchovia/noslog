import db from "@/lib/db";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import { serverEnv } from "@/lib/env/server";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/routing";
import { getSafeAuthReturnPath } from "@/lib/authReturnPath";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface DiscordTokenResponse {
    access_token?: string;
}

interface DiscordUserResponse {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string | null;
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
        ? await db.user.findUnique({
              where: { id: session.id },
              select: {
                  id: true,
                  discord_id: true,
                  avatar: true,
                  avatar_user_managed: true,
              },
          })
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
        if (mode) {
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
        if (mode === "refresh" && currentUser?.discord_id !== discordUser.id)
            return errorResponse("identity_mismatch");
        const avatar = discordAvatar(discordUser);
        const linkedUser = await db.user.findUnique({
            where: { discord_id: discordUser.id },
            select: {
                id: true,
                avatar: true,
                avatar_user_managed: true,
                discord_name: true,
                discord_username: true,
                profile_completed_at: true,
                locale: true,
            },
        });

        if (currentUser) {
            if (linkedUser && linkedUser.id !== currentUser.id) {
                return errorResponse("already_linked");
            }

            await db.user.update({
                where: { id: currentUser.id },
                data: {
                    ...(mode === "refresh"
                        ? {}
                        : { discord_id: discordUser.id }),
                    discord_name: discordName,
                    discord_username: discordUser.username,
                    ...(mode === "refresh"
                        ? {}
                        : {
                              avatar:
                                  avatar &&
                                  shouldUseDiscordAvatar(
                                      currentUser.avatar,
                                      currentUser.avatar_user_managed
                                  )
                                      ? avatar
                                      : currentUser.avatar,
                          }),
                },
            });
            revalidateTag(getUserProfileTag(currentUser.id), "max");
            revalidateTag(CACHE_TAGS.userRankings, "max");
            const destination = new URL(returnTo, request.url);
            if (mode) destination.searchParams.set("discordResult", mode);
            return NextResponse.redirect(destination);
        }

        const user = linkedUser
            ? await db.user.update({
                  where: { id: linkedUser.id },
                  data: {
                      discord_name: linkedUser.discord_name ?? discordName,
                      discord_username:
                          linkedUser.discord_username ?? discordUser.username,
                      avatar:
                          avatar &&
                          shouldUseDiscordAvatar(
                              linkedUser.avatar,
                              linkedUser.avatar_user_managed
                          )
                              ? avatar
                              : linkedUser.avatar,
                  },
                  select: { id: true, locale: true },
              })
            : await db.user.create({
                  data: {
                      discord_id: discordUser.id,
                      discord_name: discordName,
                      discord_username: discordUser.username,
                      avatar,
                  },
                  select: { id: true, locale: true },
              });
        const profileCompleted = Boolean(linkedUser?.profile_completed_at);

        revalidateTag(getUserProfileTag(user.id), "max");
        revalidateTag(CACHE_TAGS.userRankings, "max");
        session.id = user.id;
        session.profileCompleted = profileCompleted;
        if (!profileCompleted) session.onboardingReturnTo = returnTo;
        if (profileCompleted && isLocale(user.locale)) {
            session.locale = user.locale;
        }
        await session.save();
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
