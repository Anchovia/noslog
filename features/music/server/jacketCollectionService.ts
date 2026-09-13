import "server-only";

import { put } from "@vercel/blob";
import { revalidateTag } from "next/cache";

import { deleteBlobIfOwned } from "@/lib/blob";
import { CACHE_TAGS } from "@/lib/cacheTags";
import { musicBG } from "@/lib/constants";
import db from "@/lib/db";
import { getLocalJacketUrl } from "@/lib/musicJackets";

// 공식 자켓(약 100px)은 수 KB 라 넉넉히 잡아도 1MB 를 넘지 않는다
export const MAX_COLLECTED_JACKET_BYTES = 1024 * 1024;
export const JACKET_INDEX_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

type JacketFormat = { contentType: string; extension: string };

// 확장자·Content-Type 이 아니라 파일 머리 바이트로 형식을 판별한다
export function detectJacketFormat(bytes: Uint8Array): JacketFormat | null {
    const startsWith = (signature: number[], offset = 0) =>
        bytes.length >= offset + signature.length &&
        signature.every((byte, position) => bytes[offset + position] === byte);
    if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
        return { contentType: "image/png", extension: "png" };
    if (startsWith([0xff, 0xd8, 0xff]))
        return { contentType: "image/jpeg", extension: "jpg" };
    if (
        startsWith([0x52, 0x49, 0x46, 0x46]) &&
        startsWith([0x57, 0x45, 0x42, 0x50], 8)
    )
        return { contentType: "image/webp", extension: "webp" };
    if (startsWith([0x47, 0x49, 0x46, 0x38]))
        return { contentType: "image/gif", extension: "gif" };
    return null;
}

// 로컬 파일·DB 자켓·기존 매핑이 모두 없는 곡 — 관리자 동기화 때 북마클릿이 이 곡들만 공식 사이트에서 받아 온다
export async function getMissingJacketIndexes() {
    const music = await db.music.findMany({
        where: { background: null },
        select: { index: true },
        orderBy: { index: "asc" },
    });
    return music
        .map((item) => item.index)
        .filter(
            (index) =>
                JACKET_INDEX_PATTERN.test(index) &&
                !getLocalJacketUrl(index) &&
                !musicBG[index]
        );
}

export type SaveCollectedJacketResult = "saved" | "skipped" | "invalid";

// 아직 자켓이 없는 곡에만 저장한다 — 한 번 채워지면 목록에서 빠져 다음 동기화부터는 받지 않는다
export async function saveCollectedJacket(
    index: string,
    bytes: Uint8Array
): Promise<SaveCollectedJacketResult> {
    if (!JACKET_INDEX_PATTERN.test(index)) return "invalid";
    if (bytes.length === 0 || bytes.length > MAX_COLLECTED_JACKET_BYTES)
        return "invalid";
    const format = detectJacketFormat(bytes);
    if (!format) return "invalid";
    if (getLocalJacketUrl(index) || musicBG[index]) return "skipped";

    const music = await db.music.findUnique({
        where: { index },
        select: { background: true },
    });
    if (!music || music.background) return "skipped";

    const blob = await put(
        `jackets/${index}.${format.extension}`,
        Buffer.from(bytes),
        {
            access: "public",
            contentType: format.contentType,
            addRandomSuffix: true,
        }
    );
    const updated = await db.music.updateMany({
        where: { index, background: null },
        data: { background: blob.url },
    });
    if (updated.count === 0) {
        await deleteBlobIfOwned(blob.url);
        return "skipped";
    }

    revalidateTag(CACHE_TAGS.musicCatalog, "max");
    revalidateTag(CACHE_TAGS.musicDetails, "max");
    revalidateTag(CACHE_TAGS.bingos, "max");
    return "saved";
}
