"use server";

import { getMusicPage } from "./data";
import type { MusicSearchParams } from "./query";

export async function getMoreMusics(
    page: number,
    searchParams: MusicSearchParams
) {
    return getMusicPage(searchParams, page);
}
