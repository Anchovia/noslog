import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
    id?: number;
    profileCompleted?: boolean;
    discordOAuthState?: string;
    discordOAuthReturnTo?: string;
}

const SESSION_TTL_SECONDS = 14 * 24 * 60 * 60;

export default async function getSession() {
    const password = process.env.COOKIE_PASSWORD;
    if (!password || password.length < 32) {
        throw new Error("COOKIE_PASSWORD must be at least 32 characters");
    }

    return getIronSession<SessionContent>(await cookies(), {
        cookieName: "user_session_cookie",
        password,
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
