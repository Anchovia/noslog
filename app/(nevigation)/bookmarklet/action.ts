"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function regenerateSyncToken() {
    const session = await getSession();
    if (!session.id) return;

    await db.user.update({
        where: { id: session.id },
        data: { sync_token_version: { increment: 1 } },
    });

    revalidatePath("/bookmarklet");
}
