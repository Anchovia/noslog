import "server-only";

import sharp from "sharp";

/** 카드 안 아바타는 122 — 2배로 그려 넣는다 */
const CARD_AVATAR_SIZE = 244;
// 작은 파일로 큰 그림을 풀게 하는 사진(공유 카드는 누구나 부를 수 있다)은 풀기 전에 거절한다
const MAX_AVATAR_INPUT_PIXELS = 4096 * 4096;

// sharp 에 든 HEIF · AVIF 해석기(libheif)에 아직 고쳐지지 않은 취약점이 있어, 파일 머리로
// 프로필 사진으로 받는 형식(JPEG · PNG · WebP · GIF)인지 본 뒤에만 sharp 에 넘긴다
function isCardAvatarFormat(bytes: Uint8Array) {
    const startsWith = (signature: number[], offset = 0) =>
        signature.every((byte, index) => bytes[offset + index] === byte);
    return (
        startsWith([0xff, 0xd8, 0xff]) ||
        startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) ||
        startsWith([0x47, 0x49, 0x46, 0x38]) ||
        (startsWith([0x52, 0x49, 0x46, 0x46]) &&
            startsWith([0x57, 0x45, 0x42, 0x50], 8))
    );
}

/**
 * 프로필 사진을 카드 그리기 엔진(next/og)이 읽는 PNG 로 바꾼다.
 * 엔진은 png · jpeg · gif 만 받아서, 설정에서 올린 사진(자르기 창이 webp 로 저장)을 그대로 넣으면
 * 그리다가 오류가 나 카드가 만들어지지 않는다(2026-09-30). 움직이는 gif 는 첫 장만 쓴다.
 * 읽지 못하는 사진이면 null — 카드는 이름 첫 글자로 그린다.
 */
export async function toCardAvatar(bytes: Uint8Array): Promise<string | null> {
    if (!isCardAvatarFormat(bytes)) return null;
    try {
        const png = await sharp(bytes, {
            limitInputPixels: MAX_AVATAR_INPUT_PIXELS,
        })
            .rotate()
            .resize(CARD_AVATAR_SIZE, CARD_AVATAR_SIZE, { fit: "cover" })
            .png()
            .toBuffer();
        return `data:image/png;base64,${png.toString("base64")}`;
    } catch {
        return null;
    }
}
