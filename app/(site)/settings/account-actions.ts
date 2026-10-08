"use server";

import getSession from "@/lib/session";

export async function logoutAccount() {
    const session = await getSession();
    session.destroy();
    return { success: true as const };
}
