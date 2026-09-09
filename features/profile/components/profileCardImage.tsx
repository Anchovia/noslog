/* eslint-disable @next/next/no-img-element */
import { profileCardGlobe } from "@/features/profile/profileCardGlobe";
import type {
    ProfileMode,
    ProfileUser,
} from "@/components/profile/dashboard/profileTypes";
import {
    formatProfileDate,
    getProfileCountryCode,
} from "@/components/profile/dashboard/profileUtils";
import {
    getCardExamColor,
    getProfileCardInitial,
    getProfileCardMode,
} from "@/features/profile/profileCardModel";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/routing";
import { formatToComma } from "@/lib/utils";

// P16 is a fixed-size generated image with its own approved raw palette, not
// ordinary UI. ImageResponse requires inline styles and cannot use global CSS.
const ink = "#f2f2f5";
const gold = "#d8b54f";
const divider = "#34343f";
const subdued = "#afafaf";
function CountryFlag({
    source,
    width,
    height,
}: {
    source: string | null;
    width: number;
    height: number;
}) {
    return source ? (
        <img
            src={source}
            alt=""
            width={width}
            height={height}
            style={{
                width,
                height,
                border: "1px solid #d8d8dc",
                borderRadius: 2,
                objectFit: "cover",
            }}
        />
    ) : (
        <img src={profileCardGlobe} width={height} height={height} alt="" />
    );
}
function Divider() {
    return (
        <div
            style={{ width: 1, height: 26, background: divider, flexShrink: 0 }}
        />
    );
}

export default function ProfileCardImage({
    user,
    mode,
    locale,
    avatar,
    flag,
    profileUrl,
}: {
    user: ProfileUser;
    mode: ProfileMode;
    locale: Locale;
    avatar: string | null;
    flag: string | null;
    profileUrl: string;
}) {
    const t = createTranslator(getMessages(locale));
    const data = getProfileCardMode(user, mode);
    const name = user.username || t("common.unnamedUser");
    const country = getProfileCountryCode(user.country);
    const exams = (
        [
            { mode: "B", grade: user.exam_basic },
            { mode: "R", grade: user.exam_recital },
        ] as const
    ).filter((exam) => exam.grade && exam.grade >= 1 && exam.grade <= 10);
    return (
        <div
            style={{
                display: "flex",
                position: "relative",
                width: 1200,
                height: 630,
                overflow: "hidden",
                borderRadius: 24,
                color: ink,
                fontFamily: "Pretendard JP",
                fontWeight: 400,
                backgroundImage:
                    "linear-gradient(152.300527deg, #1a1a26 0%, #0b0b10 42.857%, #241b0c 71.429%)",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "linear-gradient(207.699473deg, rgba(216,181,79,.05) 16.667%, rgba(216,181,79,0) 20.833%)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    width: 1600,
                    height: 140,
                    left: -303,
                    top: 560,
                    transform: "rotate(18deg)",
                    transformOrigin: "top left",
                    background: "rgba(216,181,79,.05)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    left: 600,
                    top: -520,
                    width: 1040,
                    height: 1040,
                    borderRadius: "50%",
                    border: "1px solid rgba(216,181,79,.12)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    left: 760,
                    top: -360,
                    width: 720,
                    height: 720,
                    borderRadius: "50%",
                    border: "2px solid rgba(216,181,79,.24)",
                }}
            />
            <div
                style={{
                    display: "flex",
                    position: "absolute",
                    left: 64,
                    top: 54,
                    width: 1072,
                    height: 132,
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: 28,
                        alignItems: "center",
                        minWidth: 0,
                        flex: 1,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            width: 132,
                            height: 132,
                            flexShrink: 0,
                            borderRadius: "50%",
                            border: `5px solid ${gold}`,
                            background: "#20202a",
                            overflow: "hidden",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 42,
                            fontWeight: 700,
                            color: "#a0a0aa",
                        }}
                    >
                        {avatar ? (
                            <img
                                src={avatar}
                                alt=""
                                width={122}
                                height={122}
                                style={{
                                    width: 122,
                                    height: 122,
                                    objectFit: "cover",
                                }}
                            />
                        ) : (
                            getProfileCardInitial(name, locale)
                        )}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                            minWidth: 0,
                            flex: 1,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                                minWidth: 0,
                            }}
                        >
                            <CountryFlag source={flag} width={32} height={22} />
                            <span
                                style={{
                                    minWidth: 0,
                                    maxWidth: 500,
                                    flexShrink: 1,
                                    fontSize: 46,
                                    fontWeight: 700,
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {name}
                            </span>
                        </div>
                        <span style={{ color: "#a0a0aa", fontSize: 22 }}>
                            {data.label} ·{" "}
                            {t("profile.asOf", {
                                date: formatProfileDate(
                                    user.hide_play_activity
                                        ? null
                                        : user.last_played_at,
                                    locale,
                                    t("profile.noRecord")
                                ),
                            })}
                        </span>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        flexShrink: 0,
                    }}
                >
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 54,
                            height: 54,
                            border: `2px solid ${ink}`,
                            borderRadius: "50%",
                            fontSize: 26,
                            fontWeight: 700,
                        }}
                    >
                        N
                    </span>
                    <span style={{ fontSize: 28, fontWeight: 700 }}>
                        NosLog
                    </span>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    position: "absolute",
                    left: 64,
                    top: 258,
                    alignItems: "flex-end",
                    gap: 54,
                }}
            >
                <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                    <span
                        style={{
                            color: subdued,
                            fontSize: 18,
                            lineHeight: "23px",
                            letterSpacing: 3,
                            textTransform: "uppercase",
                        }}
                    >
                        {t("rankings.metric.grade")}
                    </span>
                    <span
                        style={{
                            color: data.grade ? "#facc15" : subdued,
                            fontSize: data.grade ? 120 : 54,
                            lineHeight: data.grade ? "156px" : "70px",
                            fontWeight: 700,
                        }}
                    >
                        {data.grade ? formatToComma(data.grade) : "-"}
                    </span>
                </div>
                <div style={{ width: 1, height: 92, background: divider }} />
                <div style={{ display: "flex", gap: 62 }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                        }}
                    >
                        <span
                            style={{
                                color: "#a0a0aa",
                                fontSize: 19,
                                lineHeight: "29px",
                            }}
                        >
                            {t("profile.globalRank")}
                        </span>
                        <span
                            style={{
                                fontSize: 54,
                                fontWeight: 700,
                                lineHeight: "70px",
                            }}
                        >
                            {data.globalRank
                                ? `#${formatToComma(data.globalRank)}`
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
                                lineHeight: "29px",
                            }}
                        >
                            <CountryFlag source={flag} width={25} height={17} />
                            {t("profile.countryRank", { country })}
                        </span>
                        <span
                            style={{
                                fontSize: 54,
                                fontWeight: 700,
                                lineHeight: "70px",
                            }}
                        >
                            {data.countryRank
                                ? `#${formatToComma(data.countryRank)}`
                                : "-"}
                        </span>
                    </div>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    position: "absolute",
                    left: 64,
                    top: 522,
                    width: 1072,
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    {[
                        { label: "P", value: user.score_p, color: "#f5d98b" },
                        { label: "FC", value: user.score_f, color: "#a3e635" },
                        { label: "S", value: user.score_s, color: gold },
                    ].map((item, index) => (
                        <div
                            key={item.label}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 24,
                            }}
                        >
                            {index ? <Divider /> : null}
                            <span
                                style={{
                                    display: "flex",
                                    gap: 10,
                                    fontSize: 26,
                                    fontWeight: 700,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <span style={{ color: item.color }}>
                                    {item.label}
                                </span>
                                <span>{formatToComma(item.value)}</span>
                            </span>
                        </div>
                    ))}
                    {exams.map((exam) => (
                        <div
                            key={exam.mode}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 24,
                            }}
                        >
                            <Divider />
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    height: 44,
                                    paddingRight: 16,
                                    background: "#24242c",
                                    borderRadius: 8,
                                    overflow: "hidden",
                                    fontWeight: 700,
                                    fontSize: 24,
                                }}
                            >
                                <span
                                    style={{
                                        width: 10,
                                        height: 44,
                                        background: getCardExamColor(
                                            exam.grade!
                                        ),
                                    }}
                                />
                                <span>{exam.mode}</span>
                                <span>
                                    {t("rankings.examGrade", {
                                        exam: exam.grade!,
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 4,
                        minWidth: 0,
                        flex: 1,
                        color: subdued,
                        fontSize: 18,
                    }}
                >
                    <span style={{ whiteSpace: "nowrap" }}>
                        {user.hide_play_count
                            ? t("profile.playCountPrivate")
                            : t("profile.playCount", {
                                  count: formatToComma(user.play_count),
                              })}
                    </span>
                    <span
                        style={{
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {profileUrl.replace(/^https?:\/\//, "")}
                    </span>
                </div>
            </div>
        </div>
    );
}
