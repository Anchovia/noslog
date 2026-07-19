import { createSocialImage } from "@/lib/metadata/brandImage";

export const alt = "NosLog - NOSTALGIA 플레이 기록·랭킹·서열 아카이브";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
    return createSocialImage();
}
