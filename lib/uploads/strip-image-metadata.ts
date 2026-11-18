import "server-only";

import sharp from "sharp";

import {
    detectImageContentType,
    type ImageContentType,
} from "@/lib/image-upload-rules";

const REENCODE_QUALITY = 90;
// 작은 파일로 큰 그림을 풀게 하는 사진은 풀기 전에 거절한다. 브라우저는 긴 변 2048 로 줄여 올린다
const MAX_INPUT_PIXELS = 4096 * 4096;

// 무손실로 저장한 WebP(화면 캡처 등)를 손실로 다시 만들면 흐려지고 파일도 커진다 — 첫 그림 조각 이름으로 가린다
function isLosslessWebp(bytes: Uint8Array) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let offset = 12;
    while (offset + 8 <= bytes.length) {
        const id = String.fromCharCode(...bytes.subarray(offset, offset + 4));
        if (id === "VP8L") return true;
        if (id === "VP8 ") return false;
        // 움직이는 WebP 는 장 머리 16바이트 뒤에 그 장의 그림 조각이 온다
        const size = id === "ANMF" ? 16 : view.getUint32(offset + 4, true);
        offset += 8 + size + (size % 2);
    }
    return false;
}

/**
 * 사진을 같은 형식으로 다시 만들어 촬영 정보(EXIF · GPS · XMP · IPTC · 색 프로파일 · 주석)를 뺀다.
 * sharp 는 따로 요청하지 않으면 결과 파일에 메타데이터를 쓰지 않는다. 회전 값은 버리기 전에 픽셀에 반영해 사진이 돌아가 보이지 않게 한다.
 * 받지 않는 형식이거나 읽지 못하는 파일이면 던진다 — 부르는 쪽은 원본을 대신 쓰지 않는다.
 */
export async function stripImageMetadata(
    bytes: Uint8Array
): Promise<{ data: Buffer; contentType: ImageContentType }> {
    // sharp 에 든 HEIF · AVIF 해석기(libheif)에 아직 고쳐지지 않은 취약점이 있어, 파일 머리로 받는 형식인지 본 뒤에만 넘긴다
    const contentType = detectImageContentType(bytes);
    if (!contentType) throw new Error("unsupported image format");

    // animated 를 켜지 않으면 움직이는 WebP 가 첫 장만 남는다
    const image = sharp(bytes, {
        animated: true,
        limitInputPixels: MAX_INPUT_PIXELS,
    });
    if (contentType === "image/png")
        return { data: await image.rotate().png().toBuffer(), contentType };
    if (contentType === "image/webp")
        return {
            data: await image
                .rotate()
                .webp(
                    isLosslessWebp(bytes)
                        ? { lossless: true }
                        : { quality: REENCODE_QUALITY }
                )
                .toBuffer(),
            contentType,
        };
    // 색을 줄이지 않은 JPEG(화면 캡처 등)는 그대로 둬 글자 가장자리가 번지지 않게 한다
    const { chromaSubsampling } = await image.metadata();
    return {
        data: await image
            .rotate()
            .jpeg({
                quality: REENCODE_QUALITY,
                chromaSubsampling:
                    chromaSubsampling === "4:4:4" ? "4:4:4" : "4:2:0",
            })
            .toBuffer(),
        contentType,
    };
}
