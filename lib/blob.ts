import "server-only";

import { del, head } from "@vercel/blob";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";

export const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
export const IMAGE_CONTENT_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
] as const;

type ImageContentType = (typeof IMAGE_CONTENT_TYPES)[number];

export function isImageContentType(value: string): value is ImageContentType {
    return IMAGE_CONTENT_TYPES.some((contentType) => contentType === value);
}

function imageExtension(contentType: ImageContentType) {
    return contentType === "image/jpeg" ? "jpg" : contentType.split("/")[1];
}

function isPublicBlobUrl(url: string) {
    try {
        const parsed = new URL(url);

        return (
            parsed.protocol === "https:" &&
            parsed.hostname.endsWith(".public.blob.vercel-storage.com") &&
            !parsed.search &&
            !parsed.hash
        );
    } catch {
        return false;
    }
}

// 로그인 확인을 마친 서버 액션에서 이미지 한 장 전용 토큰을 발급함
export async function createImageUploadToken(
    pathnameWithoutExtension: string,
    contentType: string
) {
    if (!isImageContentType(contentType)) return null;

    const pathname = `${pathnameWithoutExtension}.${imageExtension(contentType)}`;
    const token = await generateClientTokenFromReadWriteToken({
        pathname,
        allowedContentTypes: [contentType],
        maximumSizeInBytes: MAX_IMAGE_SIZE,
        addRandomSuffix: true,
    });

    return { pathname, token };
}

// 저장 전에 현재 Blob Store의 파일과 경로, 형식, 크기를 다시 검증함
export async function isValidImageBlob(url: string, pathnamePrefix: string) {
    if (!isPublicBlobUrl(url)) return false;

    try {
        const blob = await head(url);

        return (
            blob.pathname.startsWith(pathnamePrefix) &&
            isImageContentType(blob.contentType) &&
            blob.size <= MAX_IMAGE_SIZE
        );
    } catch {
        return false;
    }
}

export async function deleteBlobIfOwned(url: string | null) {
    if (!url || !isPublicBlobUrl(url)) return;
    await del(url).catch(() => null);
}
