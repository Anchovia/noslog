/* eslint-disable @next/next/no-img-element */
import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import type {
    ProfileMode,
    ProfileUser,
} from "@/components/profile/dashboard/profileTypes";
import {
    formatProfileDate,
    formatProfileGrade,
    getProfileCountryCode,
} from "@/components/profile/dashboard/profileUtils";
import getSession from "@/lib/session";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import {
    isLocale,
    localizePath,
    LOCALE_REQUEST_HEADER,
} from "@/lib/i18n/routing";
import { formatToComma } from "@/lib/utils";

import { getCachedProfileData } from "../data";

export const dynamic = "force-dynamic";

function getMode(request: NextRequest): ProfileMode {
    return request.nextUrl.searchParams.get("mode") === "recital"
        ? "recital"
        : "basic";
}

function CountryFlag({
    imageSrc,
    width,
    height,
}: {
    imageSrc: string | null;
    width: number;
    height: number;
}) {
    if (imageSrc) {
        return (
            <img
                src={imageSrc}
                alt=""
                style={{
                    width,
                    height,
                    border: "1px solid #d8d8dc",
                    borderRadius: 2,
                    objectFit: "cover",
                }}
            />
        );
    }

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: height,
                height,
                borderRadius: 999,
                background: "#6e87b0",
                color: "#fff",
                fontSize: height * 0.5,
                fontWeight: 700,
            }}
        >
            G
        </div>
    );
}

const flagDataUrls = new Map<string, Promise<string | null>>();

function getFlagDataUrl(countryCode: string) {
    const fileName =
        countryCode === "KR"
            ? "kr.png"
            : countryCode === "JP"
              ? "jp.png"
              : null;
    if (!fileName) return Promise.resolve(null);

    const cached = flagDataUrls.get(fileName);
    if (cached) return cached;

    const flagDataUrl = readFile(
        path.join(process.cwd(), "public", "flags", fileName)
    )
        .then((data) => `data:image/png;base64,${data.toString("base64")}`)
        .catch(() => null);
    flagDataUrls.set(fileName, flagDataUrl);
    return flagDataUrl;
}

async function getAvatarDataUrl(avatar: string | null) {
    if (!avatar) return null;
    if (avatar.startsWith("data:")) return avatar;

    try {
        const response = await fetch(avatar, { cache: "force-cache" });
        if (!response.ok) return null;

        const contentType = response.headers.get("content-type") || "image/png";
        const data = Buffer.from(await response.arrayBuffer()).toString(
            "base64"
        );
        return `data:${contentType};base64,${data}`;
    } catch {
        return null;
    }
}

function getModeData(user: ProfileUser, mode: ProfileMode) {
    if (mode === "recital") {
        return {
            label: "Recital",
            grade: user.grade_recital,
            globalRank: user.rank_recital,
            countryRank: user.rank_recital_country,
        };
    }

    return {
        label: "Basic",
        grade: user.grade_basic,
        globalRank: user.rank_basic,
        countryRank: user.rank_basic_country,
    };
}

function RankChip({
    label,
    value,
    color,
}: {
    label: string;
    value: number | null;
    color: string;
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                height: 50,
                padding: "0 20px",
                borderRadius: 12,
                background: "#1a1a22",
                color: "#f2f2f5",
                fontSize: 22,
                fontWeight: 700,
            }}
        >
            <span
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    color,
                    border: `2px solid ${color}`,
                    fontSize: label === "FC" ? 11 : 17,
                }}
            >
                {label}
            </span>
            {formatToComma(value)}
        </div>
    );
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (!Number.isInteger(id) || id < 1) {
        return new Response("Not found", { status: 404 });
    }

    const session = await getSession();
    const requestLocale = request.headers.get(LOCALE_REQUEST_HEADER);
    const locale = isLocale(requestLocale) ? requestLocale : "ko";
    const t = createTranslator(getMessages(locale));
    if (session.id !== id) {
        return new Response("Forbidden", { status: 403 });
    }

    const profileData = await getCachedProfileData(id);
    if (!profileData) return new Response("Not found", { status: 404 });

    const { user } = profileData;
    const mode = getMode(request);
    const modeData = getModeData(user, mode);
    const avatar = await getAvatarDataUrl(user.avatar);
    const countryCode = getProfileCountryCode(user.country);
    const countryFlag = await getFlagDataUrl(countryCode);
    const profileUrl = `${request.nextUrl.origin}${localizePath(
        `/profile/${user.id}`,
        locale
    )}`;

    return new ImageResponse(
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                padding: "54px 64px",
                color: "#f2f2f5",
                background:
                    "linear-gradient(135deg, #17171f 0%, #0b0b10 68%, #17140c 100%)",
                fontFamily: "sans-serif",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 132,
                            height: 132,
                            padding: 5,
                            borderRadius: 999,
                            background: "#d8b54f",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                height: "100%",
                                overflow: "hidden",
                                borderRadius: 999,
                                background: "#20202a",
                                color: "#a0a0aa",
                                fontSize: 42,
                                fontWeight: 700,
                            }}
                        >
                            {avatar ? (
                                <img
                                    src={avatar}
                                    width="122"
                                    height="122"
                                    alt=""
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: 999,
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                "N"
                            )}
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                            }}
                        >
                            <CountryFlag
                                imageSrc={countryFlag}
                                width={32}
                                height={22}
                            />
                            <span
                                style={{
                                    maxWidth: 500,
                                    overflow: "hidden",
                                    fontSize: 46,
                                    fontWeight: 800,
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {user.username || t("common.unnamedUser")}
                            </span>
                        </div>
                        <span style={{ color: "#a0a0aa", fontSize: 22 }}>
                            {modeData.label} ·{" "}
                            {t("profile.asOf", {
                                date: formatProfileDate(
                                    user.last_played_at,
                                    locale,
                                    t("profile.noRecord")
                                ),
                            })}
                        </span>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 54,
                            height: 54,
                            border: "2px solid #f2f2f5",
                            borderRadius: 999,
                            fontSize: 26,
                        }}
                    >
                        N
                    </div>
                    <span style={{ fontSize: 28, fontWeight: 800 }}>
                        NosLog
                    </span>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 54,
                    marginTop: 72,
                }}
            >
                <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                    <span
                        style={{
                            color: "#666674",
                            fontSize: 18,
                            textTransform: "uppercase",
                            letterSpacing: 3,
                        }}
                    >
                        Grade
                    </span>
                    <span
                        style={{
                            color: "#facc15",
                            fontSize: 78,
                            fontWeight: 900,
                        }}
                    >
                        {formatProfileGrade(modeData.grade)}
                    </span>
                </div>
                <div style={{ width: 1, height: 92, background: "#34343f" }} />
                <div style={{ display: "flex", gap: 62 }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                        }}
                    >
                        <span style={{ color: "#a0a0aa", fontSize: 19 }}>
                            {t("profile.globalRank")}
                        </span>
                        <span style={{ fontSize: 54, fontWeight: 900 }}>
                            {modeData.globalRank
                                ? `#${formatToComma(modeData.globalRank)}`
                                : "-"}
                        </span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                        }}
                    >
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                color: "#a0a0aa",
                                fontSize: 19,
                            }}
                        >
                            <CountryFlag
                                imageSrc={countryFlag}
                                width={25}
                                height={17}
                            />
                            {t("profile.countryRank", {
                                country: countryCode,
                            })}
                        </span>
                        <span style={{ fontSize: 54, fontWeight: 900 }}>
                            {modeData.countryRank
                                ? `#${formatToComma(modeData.countryRank)}`
                                : "-"}
                        </span>
                    </div>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "auto",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <RankChip label="P" value={user.score_p} color="#f5d98b" />
                    <RankChip label="FC" value={user.score_f} color="#a3e635" />
                    <RankChip label="S" value={user.score_s} color="#d8b54f" />
                    {user.exam_basic ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                height: 50,
                                padding: "0 20px",
                                borderRadius: 12,
                                background: "#18202b",
                                color: "#7c9cc6",
                                fontSize: 20,
                                fontWeight: 700,
                            }}
                        >
                            {t("rankings.examBadge", {
                                mode: "Basic",
                                exam: user.exam_basic,
                            })}
                        </div>
                    ) : null}
                    {user.exam_recital ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                height: 50,
                                padding: "0 20px",
                                borderRadius: 12,
                                background: "#291d27",
                                color: "#c98fb0",
                                fontSize: 20,
                                fontWeight: 700,
                            }}
                        >
                            {t("rankings.examBadge", {
                                mode: "Recital",
                                exam: user.exam_recital,
                            })}
                        </div>
                    ) : null}
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 4,
                        color: "#666674",
                        fontSize: 18,
                    }}
                >
                    <span>
                        {user.hide_play_count
                            ? t("profile.playCountPrivate")
                            : t("profile.playCount", {
                                  count: formatToComma(user.play_count),
                              })}
                    </span>
                    <span>{profileUrl}</span>
                </div>
            </div>
        </div>,
        {
            width: 1200,
            height: 630,
            headers: {
                "Cache-Control": "no-store",
                "Content-Disposition": `inline; filename="noslog-profile-${user.id}-${mode}.png"`,
            },
        }
    );
}
