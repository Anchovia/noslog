"use client";

import { put } from "@vercel/blob/client";

import { MAX_IMAGE_SIZE } from "@/lib/image-upload-rules";

interface ClientImageUploadGrant {
    pathname: string;
    token: string;
}

const REENCODE_MAX_SIDE = 2048;

// 긴 변만 상한에 맞추고 비율은 그대로 둔다. 작은 이미지는 키우지 않는다
export function fitImageSize(
    width: number,
    height: number,
    maxSide = REENCODE_MAX_SIDE
) {
    const scale = Math.min(1, maxSide / Math.max(width, height));
    return {
        width: Math.max(1, Math.round(width * scale)),
        height: Math.max(1, Math.round(height * scale)),
    };
}

function loadImage(file: File) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
            URL.revokeObjectURL(url);
            resolve(image);
        };
        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error());
        };
        image.src = url;
    });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string) {
    return new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
            (value) => (value ? resolve(value) : reject(new Error())),
            type,
            0.9
        )
    );
}

const EXTENSIONS: Record<string, string> = {
    "image/webp": "webp",
    "image/jpeg": "jpg",
    "image/png": "png",
};

// 사진 속 위치 정보 같은 메타데이터를 올리지 않으려고 canvas 에 다시 그려 픽셀만 새 파일로 만든다.
// WebP 를 못 만드는 브라우저(Safari)는 PNG 를 돌려줘 사진이 몇 MB 로 커지므로, JPEG 사진은 JPEG 로 다시 만든다.
// 그래도 한도를 넘으면 지금처럼 원본을 올린다 — 다시 만들기 때문에 올라가던 사진이 막히지 않게
export async function reencodeImageForUpload(file: File) {
    const image = await loadImage(file);
    const size = fitImageSize(image.naturalWidth, image.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error();
    context.drawImage(image, 0, 0, size.width, size.height);
    let blob = await canvasToBlob(canvas, "image/webp");
    if (blob.type !== "image/webp" && file.type === "image/jpeg")
        blob = await canvasToBlob(canvas, "image/jpeg");
    const extension = EXTENSIONS[blob.type];
    if (!extension || blob.size > MAX_IMAGE_SIZE) return file;
    return new File([blob], `image.${extension}`, { type: blob.type });
}

export async function uploadGrantedImage(
    file: File,
    grant: ClientImageUploadGrant,
    access: "public" | "private"
) {
    const blob = await put(grant.pathname, file, {
        access,
        token: grant.token,
        contentType: file.type,
    });

    return blob.url;
}
