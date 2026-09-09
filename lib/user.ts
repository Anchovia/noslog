import { cache } from "react";

import db from "./db";
import getSession from "./session";

export const getSessionUser = cache(async () => {
    const session = await getSession();
    const user = session.id
        ? await db.user.findUnique({ where: { id: session.id } })
        : null;

    return { session, user };
});

export async function getUser() {
    const { user } = await getSessionUser();
    return user;
}
