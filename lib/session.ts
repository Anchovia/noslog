import "server-only";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

import { serverEnv } from "@/lib/env/server";
import type { Locale } from "@/lib/i18n/routing";

interface SessionContent {
    id?: number;
    profileCompleted?: boolean;
    locale?: Locale;
    discordOAuthState?: string;
    discordOAuthReturnTo?: string;
}

const SESSION_TTL_SECONDS = 14 * 24 * 60 * 60;

export default async function getSession() {
    return getIronSession<SessionContent>(await cookies(), {
        cookieName: "user_session_cookie",
        password: serverEnv.COOKIE_PASSWORD,
        ttl: SESSION_TTL_SECONDS,
        cookieOptions: {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            priority: "high",
        },
    });
}
