"use server";

import { getMusicPage } from "./data";
import type { MusicSearchParams } from "./query";

export async function getMoreMusics(
    cursor: string,
    searchParams: MusicSearchParams
) {
    return getMusicPage(searchParams, cursor);
}
