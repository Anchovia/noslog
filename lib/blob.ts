import "server-only";

import { del, get, head } from "@vercel/blob";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";

import { serverEnv } from "@/lib/env/server";

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

function hasBlobHostname(url: string, access: "public" | "private") {
    try {
        const parsed = new URL(url);

        return (
            parsed.protocol === "https:" &&
            parsed.hostname.endsWith(`.${access}.blob.vercel-storage.com`) &&
            !parsed.search &&
            !parsed.hash
        );
    } catch {
        return false;
    }
}

function privateBlobToken() {
    const token = serverEnv.PRIVATE_BLOB_READ_WRITE_TOKEN;
    if (!token) {
        throw new Error("PRIVATE_BLOB_READ_WRITE_TOKEN is not configured");
    }
    return token;
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

// 검정 증빙과 피드백은 공개 URL로 노출되지 않는 별도 Blob Store를 사용함
export async function createPrivateImageUploadToken(
    pathnameWithoutExtension: string,
    contentType: string
) {
    if (!isImageContentType(contentType)) return null;

    const pathname = `${pathnameWithoutExtension}.${imageExtension(contentType)}`;
    const token = await generateClientTokenFromReadWriteToken({
        token: privateBlobToken(),
        pathname,
        allowedContentTypes: [contentType],
        maximumSizeInBytes: MAX_IMAGE_SIZE,
        addRandomSuffix: true,
    });

    return { pathname, token };
}

// 저장 전에 현재 Blob Store의 파일과 경로, 형식, 크기를 다시 검증함
export async function isValidImageBlob(url: string, pathnamePrefix: string) {
    if (!hasBlobHostname(url, "public")) return false;

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

export async function isValidPrivateImageBlob(
    url: string,
    pathnamePrefix: string
) {
    if (!hasBlobHostname(url, "private")) return false;

    try {
        const blob = await head(url, { token: privateBlobToken() });

        return (
            blob.pathname.startsWith(pathnamePrefix) &&
            isImageContentType(blob.contentType) &&
            blob.size <= MAX_IMAGE_SIZE
        );
    } catch {
        return false;
    }
}

export async function getPrivateImageBlob(url: string) {
    if (!hasBlobHostname(url, "private")) return null;
    return get(url, {
        access: "private",
        token: privateBlobToken(),
        useCache: false,
    });
}

export async function deleteBlobStrict(url: string | null) {
    if (!url) return;

    if (hasBlobHostname(url, "private")) {
        await del(url, { token: privateBlobToken() });
        return;
    }
    if (hasBlobHostname(url, "public")) {
        await del(url);
    }
}

export async function deleteBlobIfOwned(url: string | null) {
    await deleteBlobStrict(url).catch(() => null);
}
