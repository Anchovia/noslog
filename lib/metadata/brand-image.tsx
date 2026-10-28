import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { TOKEN_VALUES } from "@/lib/design-token-values";
import {
    BRAND_MARK_CAT_PATH,
    BRAND_MARK_CIRCLE,
    BRAND_MARK_SIZE,
} from "@/lib/metadata/brand-mark";

/**
 * 아이콘 · 공유 이미지 색 = tokens.css 다크 값. 이미지는 CSS 변수를 못 읽어 값을 옮겨 둔다 —
 * 값이 토큰과 같은지는 tests/brand-image-colors.test.ts 가 tokens.css 를 읽어 확인한다
 */
export const BRAND_IMAGE_DARK_HEX = {
    background: "#111111", // surface-canvas
    surface: "#1b1b1b", // surface-surface
    border: "#323232", // border-divider
    primary: "#dbdbdb", // identity-mark (고양이 원)
    text: "#dbdbdb", // content-default (이름 「NosLog」)
    secondary: "#afafaf", // content-subdued
} as const;

const SOCIAL_IMAGE_FONT = "Pretendard JP";

/** 공유 미리보기 글자도 사이트 글꼴로 — Satori 는 woff2 를 읽지 못해 리포의 TTF 원본을 쓴다 */
async function loadSocialImageFonts() {
    const directory = join(process.cwd(), "assets/fonts/pretendard-jp/1.3.9");
    return Promise.all(
        (
            [
                { file: "Regular", weight: 400 },
                { file: "SemiBold", weight: 600 },
                { file: "Bold", weight: 700 },
            ] as const
        ).map(async ({ file, weight }) => {
            const buffer = await readFile(
                join(directory, `PretendardJP-${file}.ttf`)
            );
            return {
                name: SOCIAL_IMAGE_FONT,
                data: buffer.buffer.slice(
                    buffer.byteOffset,
                    buffer.byteOffset + buffer.byteLength
                ) as ArrayBuffer,
                weight,
                style: "normal" as const,
            };
        })
    );
}

const colors = BRAND_IMAGE_DARK_HEX;
const { spacing: space, typeSize, weight, stroke } = TOKEN_VALUES;

/** 이미지용 NosLog 아이콘 — 채운 원(로고 색) 안의 고양이(바탕색). 화면은 components/layout/brand-mark.tsx */
export function BrandMarkImage({
    size,
    circle = colors.primary,
    cat = colors.background,
}: {
    size: number;
    circle?: string;
    cat?: string;
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${BRAND_MARK_SIZE} ${BRAND_MARK_SIZE}`}
        >
            <circle
                cx={BRAND_MARK_CIRCLE.cx}
                cy={BRAND_MARK_CIRCLE.cy}
                r={BRAND_MARK_CIRCLE.r}
                fill={circle}
            />
            <path d={BRAND_MARK_CAT_PATH} fill={cat} fillRule="evenodd" />
        </svg>
    );
}

export function createBrandIcon(size: number) {
    return new ImageResponse(
        <div
            style={{
                alignItems: "center",
                background: colors.background,
                color: colors.primary,
                display: "flex",
                height: "100%",
                justifyContent: "center",
                width: "100%",
            }}
        >
            {/* 고양이 원 = 지름 68% 상자(maskable 안전 영역 80% 안) */}
            <BrandMarkImage size={Math.round(size * 0.68)} />
        </div>,
        { height: size, width: size }
    );
}

export async function createSocialImage() {
    const fonts = await loadSocialImageFonts();
    return new ImageResponse(
        <div
            style={{
                alignItems: "center",
                background: colors.background,
                color: colors.text,
                display: "flex",
                fontFamily: SOCIAL_IMAGE_FONT,
                height: "100%",
                justifyContent: "center",
                padding: "72px",
                width: "100%",
            }}
        >
            <div
                style={{
                    alignItems: "center",
                    background: colors.surface,
                    border: `${stroke.strong}px solid ${colors.border}`,
                    borderRadius: "24px",
                    display: "flex",
                    height: "100%",
                    justifyContent: "space-between",
                    padding: `${space[64]}px 72px`,
                    width: "100%",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            fontSize: 72,
                            fontWeight: weight.semibold,
                        }}
                    >
                        NosLog
                    </div>
                    <div
                        style={{
                            color: colors.secondary,
                            display: "flex",
                            fontSize: typeSize[32],
                        }}
                    >
                        NOSTALGIA Records · Rankings · Tier Lists
                    </div>
                    <div
                        style={{
                            color: colors.secondary,
                            display: "flex",
                            fontSize: typeSize[24],
                            marginTop: space[32],
                        }}
                    >
                        noslog.app
                    </div>
                </div>
                {/* 오른쪽 = 앱 아이콘과 같은 고양이 원 */}
                <BrandMarkImage size={220} />
            </div>
        </div>,
        { fonts, height: 630, width: 1200 }
    );
}
