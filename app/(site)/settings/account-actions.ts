"use server";

import { endUserSessions } from "@/features/users/server/user-session-service";
import getSession from "@/lib/session";

export async function logoutAccount() {
    const session = await getSession();
    if (session.id) await endUserSessions(session.id);
    session.destroy();
    return { success: true as const };
}
