import { ImageResponse } from "next/og";

const colors = {
    background: "#0b0b10",
    surface: "#121218",
    border: "#2a2a35",
    primary: "#f2f2f5",
    secondary: "#a0a0aa",
};

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
