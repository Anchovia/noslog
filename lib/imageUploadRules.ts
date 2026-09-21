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
