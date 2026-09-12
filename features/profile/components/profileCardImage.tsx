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
    getExamTier,
    isExamGrade,
    type ExamGradeMode,
    type ExamTier,
} from "@/features/exams/examGrades";
import {
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

// 검정 명판 — UI ExamBadge 의 카드 배율(×2) 원시값 판. 카드 면이 그라디언트라
// Recital 의 파인 모서리는 원판으로 덮지 않고 면을 조각으로 나눠 모서리를 비워 둔다.
const examPlates: Record<ExamTier, { metal: string; fill: string | null }> = {
    low: { metal: "#8a8a8a", fill: null },
    mid: { metal: "#b98b67", fill: null },
    high: { metal: "#c4c8ce", fill: null },
    top: { metal: "#d6b56d", fill: "#25211a" },
    peak: { metal: "#d6b56d", fill: "#000000" },
};
const plateLine = 2;
const plateInset = 4;
const plateArc = 8;
type Corner = "tl" | "tr" | "bl" | "br";
const corners: Corner[] = ["tl", "tr", "bl", "br"];
// 왼쪽 위 기준 좌표를 모서리마다 뒤집는다. 한 축만 뒤집으면 호의 방향도 바뀐다.
function cornerSvg(
    key: string,
    corner: Corner,
    size: number,
    draw: (
        point: (x: number, y: number) => string,
        sweep: (base: 0 | 1) => number
    ) => string,
    paint: { fill?: string; stroke?: string }
) {
    const flipX = corner.endsWith("r");
    const flipY = corner.startsWith("b");
    const point = (x: number, y: number) =>
        `${flipX ? size - x : x} ${flipY ? size - y : y}`;
    const sweep = (base: 0 | 1) => (flipX !== flipY ? 1 - base : base);
    return (
        <svg
            key={key}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{
                position: "absolute",
                [flipX ? "right" : "left"]: 0,
                [flipY ? "bottom" : "top"]: 0,
            }}
        >
            <path
                d={draw(point, sweep)}
                fill={paint.fill ?? "none"}
                stroke={paint.stroke ?? "none"}
                strokeWidth={plateLine}
            />
        </svg>
    );
}
function CardExamPlate({
    mode,
    grade,
    label,
}: {
    mode: ExamGradeMode;
    grade: number;
    label: string;
}) {
    const tier = getExamTier(grade);
    const { metal, fill } = examPlates[tier];
    const rule = tier === "high" || tier === "top" || tier === "peak";
    const concave = mode === "recital";
    const outerArc = plateArc - plateLine / 2;
    const outerEnd = Math.sqrt(outerArc ** 2 - 1);
    const innerArc = plateArc + plateInset - plateLine / 2;
    const innerEnd = Math.sqrt(innerArc ** 2 - (plateInset + 1) ** 2);
    const innerStart = plateArc + plateInset - plateLine;
    // 조각은 key 가 붙은 배열로 넘긴다 — ImageResponse 는 Fragment 를 크기 없는
    // 상자로 감싸서, 그 안의 절대 배치 조각이 명판이 아니라 그 상자를 기준으로 놓였다
    const layers: ReturnType<typeof cornerSvg>[] = [];
    const bar = (key: string, style: Record<string, number | string>) =>
        layers.push(
            <div key={key} style={{ position: "absolute", ...style }} />
        );
    const arcs = (
        key: string,
        size: number,
        draw: Parameters<typeof cornerSvg>[3],
        paint: Parameters<typeof cornerSvg>[4]
    ) => {
        for (const corner of corners)
            layers.push(
                cornerSvg(`${key}-${corner}`, corner, size, draw, paint)
            );
    };
    if (concave && fill) {
        bar("fill-x", {
            left: plateArc,
            right: plateArc,
            top: 0,
            bottom: 0,
            background: fill,
        });
        bar("fill-y", {
            left: 0,
            right: 0,
            top: plateArc,
            bottom: plateArc,
            background: fill,
        });
        arcs(
            "fill",
            plateArc,
            (p, s) =>
                `M ${p(0, outerArc)} A ${outerArc} ${outerArc} 0 0 ${s(0)} ${p(outerArc, 0)} L ${p(plateArc, 0)} L ${p(plateArc, plateArc)} L ${p(0, plateArc)} Z`,
            { fill }
        );
    }
    if (rule && !concave)
        bar("inner", {
            top: plateInset - plateLine,
            left: plateInset - plateLine,
            right: plateInset - plateLine,
            bottom: plateInset - plateLine,
            border: `${plateLine}px solid ${metal}`,
        });
    if (rule && concave) {
        bar("inner-top", {
            top: plateInset,
            left: innerStart,
            right: innerStart,
            height: plateLine,
            background: metal,
        });
        bar("inner-bottom", {
            bottom: plateInset,
            left: innerStart,
            right: innerStart,
            height: plateLine,
            background: metal,
        });
        bar("inner-left", {
            left: plateInset,
            top: innerStart,
            bottom: innerStart,
            width: plateLine,
            background: metal,
        });
        bar("inner-right", {
            right: plateInset,
            top: innerStart,
            bottom: innerStart,
            width: plateLine,
            background: metal,
        });
        arcs(
            "inner",
            plateArc + plateInset,
            (p, s) =>
                `M ${p(innerEnd, plateInset + 1)} A ${innerArc} ${innerArc} 0 0 ${s(1)} ${p(plateInset + 1, innerEnd)}`,
            { stroke: metal }
        );
    }
    if (concave) {
        const edge = plateArc - plateLine;
        bar("outer-top", {
            top: 0,
            left: edge,
            right: edge,
            height: plateLine,
            background: metal,
        });
        bar("outer-bottom", {
            bottom: 0,
            left: edge,
            right: edge,
            height: plateLine,
            background: metal,
        });
        bar("outer-left", {
            left: 0,
            top: edge,
            bottom: edge,
            width: plateLine,
            background: metal,
        });
        bar("outer-right", {
            right: 0,
            top: edge,
            bottom: edge,
            width: plateLine,
            background: metal,
        });
        arcs(
            "outer",
            plateArc,
            (p, s) =>
                `M ${p(outerEnd, 1)} A ${outerArc} ${outerArc} 0 0 ${s(1)} ${p(1, outerEnd)}`,
            { stroke: metal }
        );
    }
    return (
        <div
            style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 8,
                height: 44,
                padding: "0 16px",
                fontSize: 24,
                // ImageResponse 는 undefined 스타일 값을 문자열로 바꾸다 던진다
                ...(!concave && fill ? { background: fill } : {}),
                ...(concave ? {} : { border: `${plateLine}px solid ${metal}` }),
            }}
        >
            {layers}
            <span style={{ color: tier === "peak" ? metal : subdued }}>
                {mode === "basic" ? "BASIC" : "RECITAL"}
            </span>
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    width: plateLine,
                    height: 22,
                    background: metal,
                }}
            >
                {tier === "peak" ? (
                    <svg
                        width={12}
                        height={12}
                        viewBox="0 0 12 12"
                        style={{ position: "absolute", left: -5, top: 5 }}
                    >
                        <path d="M 6 0 L 12 6 L 6 12 L 0 6 Z" fill={metal} />
                    </svg>
                ) : null}
            </div>
            <span
                style={{
                    color: tier === "low" ? ink : metal,
                    fontWeight: 700,
                }}
            >
                {label}
            </span>
        </div>
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
            { mode: "basic", grade: user.exam_basic },
            { mode: "recital", grade: user.exam_recital },
        ] as const
    ).flatMap(({ mode, grade }) =>
        isExamGrade(grade) ? [{ mode, grade }] : []
    );
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
                            <CardExamPlate
                                mode={exam.mode}
                                grade={exam.grade}
                                label={t("rankings.examGrade", {
                                    exam: exam.grade,
                                })}
                            />
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
