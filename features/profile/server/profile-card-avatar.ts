import "server-only";

import sharp from "sharp";

/** 카드 안 아바타는 122 — 2배로 그려 넣는다 */
const CARD_AVATAR_SIZE = 244;

/**
 * 프로필 사진을 카드 그리기 엔진(next/og)이 읽는 PNG 로 바꾼다.
 * 엔진은 png · jpeg · gif 만 받아서, 설정에서 올린 사진(자르기 창이 webp 로 저장)을 그대로 넣으면
 * 그리다가 오류가 나 카드가 만들어지지 않는다(2026-09-30). 움직이는 gif 는 첫 장만 쓴다.
 * 읽지 못하는 사진이면 null — 카드는 이름 첫 글자로 그린다.
 */
export async function toCardAvatar(bytes: Uint8Array): Promise<string | null> {
    try {
        const png = await sharp(bytes)
            .rotate()
            .resize(CARD_AVATAR_SIZE, CARD_AVATAR_SIZE, { fit: "cover" })
            .png()
            .toBuffer();
        return `data:image/png;base64,${png.toString("base64")}`;
    } catch {
        return null;
    }
}
