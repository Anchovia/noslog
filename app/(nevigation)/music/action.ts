"use server";

import { getMusicPage } from "./data";
import type { MusicSearchParams } from "./query";
import getSession from "@/lib/session";

export async function getMoreMusics(
    cursor: string,
    searchParams: MusicSearchParams
) {
    const session = await getSession();
    return getMusicPage(searchParams, cursor, session.id ?? null);
}
