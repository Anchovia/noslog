import { randomBytes } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import getSession from "@/lib/session";

function safeReturnTo(value: string | null) {
    return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function GET(request: NextRequest) {
    const returnTo = safeReturnTo(request.nextUrl.searchParams.get("returnTo"));
    const session = await getSession();
    const clientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;
    if (!clientId || !redirectUri) {
        const url = new URL(session.id ? returnTo : "/login", request.url);
        url.searchParams.set(
            session.id ? "discordError" : "error",
            "oauth_config"
        );
        return NextResponse.redirect(url);
    }

    const state = randomBytes(32).toString("hex");
    session.discordOAuthState = state;
    session.discordOAuthReturnTo = returnTo;
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
