import { ImageResponse } from "next/og";

import {
    BRAND_MARK_CAT_PATH,
    BRAND_MARK_CIRCLE,
    BRAND_MARK_SIZE,
} from "@/lib/metadata/brand-mark";

/**
 * 아이콘 · 공유 이미지 색 = tokens.css 다크 값(2026-10-01 D13). 이미지는 CSS 변수를 못 읽어 값을 옮겨 둔다 —
 * 값이 토큰과 같은지는 tests/brand-image-colors.test.ts 가 tokens.css 를 읽어 확인한다
 */
export const BRAND_IMAGE_DARK_HEX = {
    background: "#111111", // surface-canvas
    surface: "#1b1b1b", // surface-surface
    border: "#323232", // border-divider
    primary: "#dbdbdb", // identity-mark (워드마크 · N 로고)
    secondary: "#afafaf", // content-subdued
} as const;

const colors = BRAND_IMAGE_DARK_HEX;

/** 이미지용 NosLog 아이콘(2026-10-15 B) — 채운 원(로고 색) 안의 고양이(바탕색). 화면은 components/layout/brand-mark.tsx */
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
            {/* 고양이 원 = 지름 68% 상자(maskable 안전 영역 80% 안, 2026-10-15 B) */}
            <BrandMarkImage size={Math.round(size * 0.68)} />
        </div>,
        { height: size, width: size }
    );
}

export function createSocialImage() {
    return new ImageResponse(
        <div
            style={{
                alignItems: "center",
                background: colors.background,
                color: colors.primary,
                display: "flex",
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
                    border: `2px solid ${colors.border}`,
                    borderRadius: "24px",
                    display: "flex",
                    height: "100%",
                    justifyContent: "space-between",
                    padding: "64px 72px",
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
                            fontWeight: 700,
                        }}
                    >
                        NosLog
                    </div>
                    <div
                        style={{
                            color: colors.secondary,
                            display: "flex",
                            fontSize: 32,
                        }}
                    >
                        NOSTALGIA Records · Rankings · Tier Lists
                    </div>
                    <div
                        style={{
                            color: colors.secondary,
                            display: "flex",
                            fontSize: 24,
                            marginTop: "32px",
                        }}
                    >
                        noslog.app
                    </div>
                </div>
                {/* 오른쪽 = 앱 아이콘과 같은 고양이 원(2026-10-15 B) */}
                <BrandMarkImage size={220} />
            </div>
        </div>,
        { height: 630, width: 1200 }
    );
}
