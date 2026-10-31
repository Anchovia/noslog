import {
    type TierChangeImageData,
    type TierChangeImageRow,
    tierChangeImageSchema,
} from "@/features/announcements/schemas/tier-change-image-schema";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/routing";
import { MAX_IMAGE_SIZE } from "@/lib/image-upload-rules";
import { tierGoalLabels } from "@/lib/tiers";

/** 사용자 지정 원본(2026-09 공지, 1200×706)의 고정 이미지 규격. 브라우저 UI 토큰을 새로 정의하지 않는다. */
export const TIER_CHANGE_IMAGE_WIDTH = 1200;
export const TIER_CHANGE_IMAGE_PALETTE = {
    background: "#111111",
    text: "#f2f2f2",
    divider: "#2c2c2c",
    accent: "#ff8dcc",
    subtitle: "#9d9d9d",
    muted: "#8a8a8a",
    group: "#afafaf",
    expert: "#db675b",
    up: "#f2735f",
    down: "#70b8ff",
} as const;
// 그림 양식의 값이라 화면 토큰으로 더하지 않는다. 다크 화면 값과 같게 맞춘 고정 색
export const ANNOUNCEMENT_BANNER_PALETTE = {
    surface: "#1b1b1b",
    border: "#323232",
    heading: "#f2f2f2",
    brand: "#a8a8a8",
    date: "#8a8a8a",
    mark: "#dbdbdb",
    cat: "#111111",
} as const;
export const TIER_IMAGE_FONT_FAMILY = "NosLogTierChangeExport";
let fontReady: Promise<void> | undefined;
export async function loadTierImageFont() {
    fontReady ??= (async () => {
        const face = new FontFace(
            TIER_IMAGE_FONT_FAMILY,
            'url("/fonts/pretendard-jp/1.3.9/PretendardJPVariable.woff2")',
            { weight: "100 900" }
        );
        await face.load();
        document.fonts.add(face);
    })().catch((error: unknown) => {
        fontReady = undefined;
        throw error;
    });
    return fontReady;
}
export function tierChangeImageTitle(
    data: Pick<TierChangeImageData, "mode" | "goal">
) {
    return data.mode === "recital"
        ? "Recital Tier"
        : `Basic ${tierGoalLabels[data.goal]} Tier`;
}
export function tierChangeImageAlt(data: TierChangeImageData, locale: Locale) {
    const t = createTranslator(getMessages(locale));
    return t("announcements.tierChange.imageAlt", {
        title: tierChangeImageTitle(data),
        date: data.date,
        changes: data.rows
            .map(
                (row) =>
                    `${row.title} (${row.difficulty} Lv.${row.level}): ${row.before.toFixed(1)} → ${row.after.toFixed(1)}`
            )
            .join("; "),
    });
}

function wrapTitle(text: string, measure: (value: string) => number) {
    const lines: string[] = [];
    let line = "";
    for (const { segment } of new Intl.Segmenter(undefined, {
        granularity: "grapheme",
    }).segment(text)) {
        if (line && measure(line + segment) > 760) {
            lines.push(line.trimEnd());
            line = segment.trimStart();
        } else line += segment;
    }
    if (line) lines.push(line);
    return lines;
}
/** 상향 → 하향 순서. 각 묶음 안의 입력 순서와 긴 곡 제목은 유지한다. */
export function layoutTierChangeImage(
    data: TierChangeImageData,
    measure: (value: string) => number
) {
    let top = 232;
    const groups: {
        direction: "up" | "down";
        top: number;
        rows: {
            data: TierChangeImageRow;
            top: number;
            lines: string[];
            height: number;
        }[];
    }[] = [];
    for (const direction of ["up", "down"] as const) {
        const rows = data.rows.filter((row) =>
            direction === "up" ? row.after > row.before : row.after < row.before
        );
        if (!rows.length) continue;
        if (groups.length) top += 30;
        const group = {
            direction,
            top,
            rows: [] as {
                data: TierChangeImageRow;
                top: number;
                lines: string[];
                height: number;
            }[],
        };
        top += 44;
        for (const row of rows) {
            const lines = wrapTitle(row.title, measure);
            const height = 132 + Math.max(0, lines.length - 1) * 48;
            group.rows.push({ data: row, top, lines, height });
            top += height;
        }
        groups.push(group);
    }
    return {
        width: TIER_CHANGE_IMAGE_WIDTH,
        height: top + 92,
        groups,
        footerBaseline: top + 46,
    };
}
function triangle(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    direction: "up" | "down",
    color: string
) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x, direction === "up" ? y - 11 : y + 11);
    context.lineTo(x - 13, direction === "up" ? y + 11 : y - 11);
    context.lineTo(x + 13, direction === "up" ? y + 11 : y - 11);
    context.closePath();
    context.fill();
}

export async function createTierChangeImage(
    input: TierChangeImageData
): Promise<File> {
    const data = tierChangeImageSchema.parse(input);
    await loadTierImageFont();
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("이 브라우저에서 이미지를 만들 수 없습니다.");
    const font = (size: number, weight = 400) =>
        `${weight} ${size}px ${TIER_IMAGE_FONT_FAMILY}`;
    context.font = font(36, 700);
    const layout = layoutTierChangeImage(
        data,
        (text) => context.measureText(text).width
    );
    // Chrome/Safari의 캔버스 크기 한도를 넘기기 전에 입력을 나눠 생성하도록 안내한다.
    if (layout.height > 16384 || layout.width * layout.height > 16777216)
        throw new Error(
            "곡이 많아 이미지가 너무 큽니다. 곡을 나누어 만들어주세요."
        );
    canvas.width = layout.width;
    canvas.height = layout.height;
    const colors = TIER_CHANGE_IMAGE_PALETTE;
    context.fillStyle = colors.background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = colors.accent;
    context.beginPath();
    context.arc(68, 88, 12, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = colors.text;
    context.font = font(52, 700);
    context.fillText(tierChangeImageTitle(data), 100, 106);
    context.fillStyle = colors.subtitle;
    context.font = font(30);
    context.fillText(
        `${data.date} · ${data.rows.length} charts · before → after`,
        56,
        154
    );
    for (const group of layout.groups) {
        triangle(context, 70, group.top + 11, group.direction, colors.group);
        context.fillStyle = colors.muted;
        context.font = font(30);
        context.fillText(String(group.rows.length), 100, group.top + 22);
        context.fillStyle = colors.divider;
        context.fillRect(56, group.top + 42, 1088, 2);
        for (const row of group.rows) {
            context.fillStyle = colors.text;
            context.font = font(36, 700);
            row.lines.forEach((line, index) =>
                context.fillText(line, 56, row.top + 56 + index * 48)
            );
            context.fillStyle =
                row.data.difficulty === "Expert" ? colors.expert : colors.text;
            context.font = font(28);
            context.fillText(
                `${row.data.difficulty} Lv.${row.data.level}`,
                56,
                row.top + 98 + (row.lines.length - 1) * 48
            );
            const baseline = row.top + 76;
            context.font = font(40, 500);
            context.textAlign = "right";
            context.fillStyle = colors.muted;
            context.fillText(row.data.before.toFixed(1), 972, baseline);
            triangle(
                context,
                1006,
                baseline - 13,
                group.direction,
                colors[group.direction]
            );
            context.fillStyle = colors.accent;
            context.font = font(40, 700);
            context.fillText(row.data.after.toFixed(1), 1144, baseline);
            context.textAlign = "left";
        }
    }
    context.fillStyle = colors.muted;
    context.font = font(28);
    context.fillText("NosLog", 56, layout.footerBaseline);
    const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
            (value) =>
                value
                    ? resolve(value)
                    : reject(new Error("이미지를 만들지 못했습니다.")),
            "image/png"
        )
    );
    if (blob.size > MAX_IMAGE_SIZE)
        throw new Error(
            "이미지가 4MB를 초과했습니다. 곡을 나누어 만들어주세요."
        );
    return new File(
        [blob],
        `noslog-tier-change-${data.mode}-${data.goal}-${data.date}.png`,
        { type: "image/png" }
    );
}

export function appendTierChangeImage(
    content: string,
    url: string,
    alt: string
) {
    const safeAlt = alt.replace(/[\r\n]+/g, " ").replace(/[\\\[\]]/g, "\\$&");
    return `${content}${content && !content.endsWith("\n\n") ? "\n\n" : ""}![${safeAlt}](${url})\n`;
}
