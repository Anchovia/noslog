import { ImageResponse } from "next/og";

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
            <div
                style={{
                    alignItems: "center",
                    border: `${Math.max(4, Math.round(size * 0.018))}px solid ${colors.primary}`,
                    borderRadius: "50%",
                    display: "flex",
                    fontSize: Math.round(size * 0.42),
                    fontWeight: 700,
                    height: "68%",
                    justifyContent: "center",
                    width: "68%",
                }}
            >
                N
            </div>
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
                <div
                    style={{
                        alignItems: "center",
                        border: `5px solid ${colors.primary}`,
                        borderRadius: "50%",
                        display: "flex",
                        fontSize: 96,
                        fontWeight: 700,
                        height: 220,
                        justifyContent: "center",
                        width: 220,
                    }}
                >
                    N
                </div>
            </div>
        </div>,
        { height: 630, width: 1200 }
    );
}
