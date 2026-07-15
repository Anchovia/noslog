import db from "@/lib/db";
import getSession from "@/lib/session";
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
    isLinking: boolean
) {
    const url = new URL(
        isLinking ? "/profile/settings" : "/login",
        request.url
    );
    url.searchParams.set(isLinking ? "discordError" : "error", error);
    return NextResponse.redirect(url);
}

function discordAvatar(user: DiscordUserResponse) {
    if (!user.avatar) return null;
    const extension = user.avatar.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=256`;
}

function shouldUseDiscordAvatar(currentAvatar: string | null) {
    if (!currentAvatar) return true;

    try {
        const hostname = new URL(currentAvatar).hostname;
        return (
            hostname === "k.kakaocdn.net" || hostname === "cdn.discordapp.com"
        );
    } catch {
        return false;
    }
}

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    const session = await getSession();
    const isLinking = Boolean(session.id);
    const expectedState = session.discordOAuthState;
    const returnTo = session.discordOAuthReturnTo ?? "/";

    delete session.discordOAuthState;
    delete session.discordOAuthReturnTo;
    await session.save();

    if (!code || !state || !expectedState || state !== expectedState) {
        return errorRedirect(request, "invalid_state", isLinking);
    }

    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;
    if (!clientId || !clientSecret || !redirectUri) {
        return errorRedirect(request, "oauth_config", isLinking);
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
            return errorRedirect(request, "token_exchange", isLinking);
        }

        const token = (await tokenResponse.json()) as DiscordTokenResponse;
        if (!token.access_token) {
            return errorRedirect(request, "token_exchange", isLinking);
        }

        const userResponse = await fetch(
            "https://discord.com/api/v10/users/@me",
            {
                headers: { Authorization: `Bearer ${token.access_token}` },
                cache: "no-store",
            }
        );
        if (!userResponse.ok) {
            return errorRedirect(request, "profile_fetch", isLinking);
        }

        const discordUser = (await userResponse.json()) as DiscordUserResponse;
        if (!discordUser.id || !discordUser.username) {
            return errorRedirect(request, "profile_fetch", isLinking);
        }

        const discordName = discordUser.global_name ?? discordUser.username;
        const avatar = discordAvatar(discordUser);
        const linkedUser = await db.user.findUnique({
            where: { discord_id: discordUser.id },
            select: { id: true, avatar: true },
        });

        if (session.id) {
            if (linkedUser && linkedUser.id !== session.id) {
                return errorRedirect(request, "already_linked", true);
            }

            const currentUser = await db.user.findUnique({
                where: { id: session.id },
                select: { id: true, avatar: true },
            });
            if (!currentUser) {
                return errorRedirect(request, "user_missing", true);
            }

            await db.user.update({
                where: { id: currentUser.id },
                data: {
                    discord_id: discordUser.id,
                    discord_name: discordName,
                    avatar:
                        avatar && shouldUseDiscordAvatar(currentUser.avatar)
                            ? avatar
                            : currentUser.avatar,
                },
            });
            return NextResponse.redirect(new URL(returnTo, request.url));
        }

        const user = linkedUser
            ? await db.user.update({
                  where: { id: linkedUser.id },
                  data: {
                      discord_name: discordName,
                      avatar:
                          avatar && shouldUseDiscordAvatar(linkedUser.avatar)
                              ? avatar
                              : linkedUser.avatar,
                  },
                  select: { id: true },
              })
            : await db.user.create({
                  data: {
                      discord_id: discordUser.id,
                      discord_name: discordName,
                      avatar,
                  },
                  select: { id: true },
              });

        session.id = user.id;
        await session.save();
        return NextResponse.redirect(new URL(returnTo, request.url));
    } catch {
        return errorRedirect(request, "account_update", isLinking);
    }
}
