export const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

export const IMAGE_CONTENT_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
] as const;

export const IMAGE_ACCEPT = IMAGE_CONTENT_TYPES.join(",");

export type ImageContentType = (typeof IMAGE_CONTENT_TYPES)[number];
export type ImageFileValidationError = "type" | "size";

export function isImageContentType(value: string): value is ImageContentType {
    return IMAGE_CONTENT_TYPES.some((contentType) => contentType === value);
}

export function imageFileValidationError(file: {
    type: string;
    size: number;
}): ImageFileValidationError | null {
    if (!isImageContentType(file.type)) return "type";
    if (file.size > MAX_IMAGE_SIZE) return "size";
    return null;
}

/** 파일 머리 바이트로 본 형식 — 올릴 때 선언한 Content-Type 은 보내는 쪽이 정하므로 믿지 않는다 */
export function detectImageContentType(
    bytes: Uint8Array
): ImageContentType | null {
    const startsWith = (signature: number[], offset = 0) =>
        bytes.length >= offset + signature.length &&
        signature.every((byte, index) => bytes[offset + index] === byte);
    if (startsWith([0xff, 0xd8, 0xff])) return "image/jpeg";
    if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
        return "image/png";
    if (
        startsWith([0x52, 0x49, 0x46, 0x46]) &&
        startsWith([0x57, 0x45, 0x42, 0x50], 8)
    )
        return "image/webp";
    return null;
}
