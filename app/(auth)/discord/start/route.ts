import { randomBytes } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { serverEnv } from "@/lib/env/server";
import getSession from "@/lib/session";
import { getSafeAuthReturnPath } from "@/lib/authReturnPath";
import {
    getPathLocale,
    isLocale,
    LOCALE_COOKIE_NAME,
    localeFromAcceptLanguage,
    localizePath,
} from "@/lib/i18n/routing";

export async function GET(request: NextRequest) {
    const returnTo =
        getSafeAuthReturnPath(
            request.nextUrl.searchParams.get("returnTo") ?? undefined
        ) ?? "/";
    const session = await getSession();
    const requestedMode = request.nextUrl.searchParams.get("mode");
    const mode =
        requestedMode === "refresh" ||
        requestedMode === "change" ||
        requestedMode === "delete"
            ? requestedMode
            : undefined;
    const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
    const locale =
        getPathLocale(returnTo) ??
        session.locale ??
        (isLocale(cookieLocale)
            ? cookieLocale
            : localeFromAcceptLanguage(request.headers.get("accept-language")));
    const clientId = serverEnv.DISCORD_CLIENT_ID;
    const redirectUri = serverEnv.DISCORD_REDIRECT_URI;
    if (mode && (!session.id || !session.profileCompleted)) {
        const login = new URL(localizePath("/login", locale), request.url);
        login.searchParams.set("returnTo", returnTo);
        return NextResponse.redirect(login);
    }
    if (!clientId || !redirectUri) {
        const url = new URL(
            session.id ? returnTo : localizePath("/login", locale),
            request.url
        );
        if (!session.id) url.searchParams.set("returnTo", returnTo);
        url.searchParams.set(
            session.id ? "discordError" : "error",
            "oauth_config"
        );
        return NextResponse.redirect(url);
    }

    const state = randomBytes(32).toString("hex");
    delete session.deletionVerification;
    session.discordOAuthState = state;
    session.discordOAuthReturnTo = returnTo;
    session.discordOAuthMode = mode;
    session.discordOAuthUserId = mode ? session.id : undefined;
    session.locale = locale;
    await session.save();

    const params = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: "identify",
        state,
        redirect_uri: redirectUri,
    });

    return NextResponse.redirect(
        `https://discord.com/oauth2/authorize?${params.toString()}`
    );
}
