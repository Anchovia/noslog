import { getJacketCandidates } from "@/lib/musicJackets";
import { tierValueColor } from "@/lib/music/tierValueColor";
import { formatTierValue, isTierGoalAchieved } from "@/lib/tiers";
import type { TierGoal } from "@/lib/tiers";
import type {
    TierBrowserEntry,
    TierBrowserStrip,
} from "@/features/tiers/schemas/tierBrowserSchema";

/**
 * 서열표 이미지 내보내기(2026-09-22 E3 · D1 · I1 · W1 · JPEG) — 브라우저 캔버스로 그린다.
 * 폭 1200 · 한 줄 자켓 12 · 한 장 500곡까지. 색 · 글자 · 여백은 모두 지금 페이지의 토큰을 읽어 쓴다
 * (화면 카드와 같은 규칙: 달성 테두리 · 미달성 흑백 · 자켓 위 띠 · 오른쪽 아래 난이도 판)
 */
export const TIER_EXPORT_MAX = 500;
export const TIER_EXPORT_WIDTH = 1200;
export const TIER_EXPORT_COLUMNS = 12;
const JPEG_QUALITY = 0.9;
const JACKET_LOADS = 8;

export interface TierExportBand {
    value: number;
    entries: TierBrowserEntry[];
}

export interface TierExportInput {
    /** 토큰을 읽을 기준 요소(.noslog-ui 안) */
    host: HTMLElement;
    title: string;
    subtitle: string | null;
    date: string;
    url: string;
    bands: TierExportBand[];
    goal: TierGoal;
    strip: TierBrowserStrip;
    stripValue: (entry: TierBrowserEntry) => string | null;
    achievedLabel: (count: number, total: number) => string;
    showNames: boolean;
    /** 로그인하고 「내 달성 표시」를 켰을 때 — 테두리 · 흑백 · 띠 · 구간 달성 수 */
    showAchievement: boolean;
}

function tokenReader(host: HTMLElement) {
    const probe = document.createElement("span");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    host.appendChild(probe);
    const hostStyle = getComputedStyle(host);
    return {
        color(expression: string) {
            probe.style.color = "";
            probe.style.color = expression;
            return getComputedStyle(probe).color;
        },
        px(name: string) {
            return parseFloat(hostStyle.getPropertyValue(name)) || 0;
        },
        raw(name: string) {
            return hostStyle.getPropertyValue(name).trim();
        },
        family: hostStyle.fontFamily,
        dispose() {
            probe.remove();
        },
    };
}

function loadImage(url: string) {
    return new Promise<HTMLImageElement | null>((resolve) => {
        const image = new Image();
        if (
            new URL(url, window.location.href).origin !== window.location.origin
        )
            image.crossOrigin = "anonymous";
        image.decoding = "async";
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = url;
    });
}

async function loadJacket(entry: TierBrowserEntry) {
    for (const url of getJacketCandidates(
        entry.chart.music.index,
        entry.chart.music.background
    )) {
        const image = await loadImage(url);
        if (image) return image;
    }
    return null;
}

async function loadJackets(entries: TierBrowserEntry[]) {
    const images = new Map<string, HTMLImageElement | null>();
    const indexes = [
        ...new Set(entries.map((entry) => entry.chart.music.index)),
    ];
    let next = 0;
    await Promise.all(
        Array.from(
            { length: Math.min(JACKET_LOADS, indexes.length) },
            async () => {
                while (next < indexes.length) {
                    const index = indexes[next++];
                    const entry = entries.find(
                        (item) => item.chart.music.index === index
                    )!;
                    images.set(index, await loadJacket(entry));
                }
            }
        )
    );
    return images;
}

function roundedRect(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
) {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
}

function ellipsize(
    context: CanvasRenderingContext2D,
    text: string,
    width: number
) {
    if (context.measureText(text).width <= width) return text;
    let end = text.length;
    while (
        end > 0 &&
        context.measureText(`${text.slice(0, end)}…`).width > width
    )
        end--;
    return `${text.slice(0, end)}…`;
}

/** 자켓 그림만 흑백 — 캔버스 filter 를 못 쓰는 브라우저도 같게 화소를 직접 바꾼다 */
function desaturate(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
) {
    const left = Math.round(x);
    const top = Math.round(y);
    const side = Math.round(size);
    const pixels = context.getImageData(left, top, side, side);
    const data = pixels.data;
    for (let index = 0; index < data.length; index += 4) {
        const gray =
            0.2126 * data[index] +
            0.7152 * data[index + 1] +
            0.0722 * data[index + 2];
        data[index] = data[index + 1] = data[index + 2] = gray;
    }
    context.putImageData(pixels, left, top);
}

export async function drawTierImage(input: TierExportInput) {
    const tokens = tokenReader(input.host);
    try {
        const space = (step: number) => tokens.px(`--nl-spacing-${step}`);
        const size = (step: number) => tokens.px(`--nl-type-size-${step}`);
        const line = (step: number) =>
            tokens.px(`--nl-type-line-height-${step}`);
        const weight = (name: string) => tokens.raw(`--nl-type-weight-${name}`);
        const font = (px: number, fontWeight: string) =>
            `${fontWeight} ${px}px ${tokens.family}`;
        const colors = {
            canvas: tokens.color("var(--nl-surface-canvas)"),
            sunken: tokens.color("var(--nl-surface-sunken)"),
            overlay: tokens.color("var(--nl-surface-overlay)"),
            text: tokens.color("var(--nl-content-default)"),
            subdued: tokens.color("var(--nl-content-subdued)"),
            divider: tokens.color("var(--nl-border-divider)"),
            emptySlot: tokens.color("var(--nl-border-empty-slot)"),
            scrim: tokens.color("var(--nl-surface-media-scrim)"),
            onMedia: tokens.color("var(--nl-content-on-media)"),
            fullCombo: tokens.color("var(--nl-achievement-full-combo)"),
            goal: tokens.color(`var(--nl-score-goal-${input.goal})`),
        };
        const difficultyColor = (difficulty: string) =>
            tokens.color(
                `color-mix(in srgb, var(--nl-difficulty-text-${difficulty.toLowerCase()}) 88%, var(--nl-content-on-media))`
            );

        const padding = space(32);
        const gap = space(8);
        const radius = tokens.px("--nl-radius-container");
        const plateRadius = tokens.px("--nl-radius-control");
        const titleFont = font(size(32), weight("bold"));
        const subtitleFont = font(size(14), weight("regular"));
        const bandFont = font(size(20), weight("semibold"));
        const metaFont = font(size(12), weight("regular"));
        const plateFont = metaFont;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { willReadFrequently: true })!;
        // 구간 열 폭 = 구간 값 · 달성 수 중 넓은 글자 + 16
        const achievedCount = (band: TierExportBand) =>
            band.entries.filter((entry) =>
                isTierGoalAchieved(entry.record, input.goal)
            ).length;
        context.font = bandFont;
        const valueWidths = input.bands.map(
            (band) => context.measureText(formatTierValue(band.value)).width
        );
        context.font = metaFont;
        const countWidths = input.showAchievement
            ? input.bands.map(
                  (band) =>
                      context.measureText(
                          input.achievedLabel(
                              achievedCount(band),
                              band.entries.length
                          )
                      ).width
              )
            : [];
        const labelWidth =
            Math.ceil(Math.max(0, ...valueWidths, ...countWidths)) + space(16);
        const gridWidth = TIER_EXPORT_WIDTH - padding * 2 - labelWidth;
        const cell =
            (gridWidth - gap * (TIER_EXPORT_COLUMNS - 1)) / TIER_EXPORT_COLUMNS;
        const nameHeight = input.showNames ? space(4) + line(16) : 0;
        const rowHeight = cell + nameHeight;
        const headerHeight =
            line(40) + (input.subtitle ? space(4) + line(20) : 0);
        const bandHeights = input.bands.map((band) =>
            Math.max(
                line(28) + (input.showAchievement ? line(16) : 0),
                Math.ceil(band.entries.length / TIER_EXPORT_COLUMNS) *
                    rowHeight +
                    (Math.ceil(band.entries.length / TIER_EXPORT_COLUMNS) - 1) *
                        gap
            )
        );
        const footerHeight = space(16) + 1 + space(16) + line(16);
        const height = Math.ceil(
            padding +
                headerHeight +
                space(24) +
                bandHeights.reduce((sum, value) => sum + value, 0) +
                space(24) * Math.max(0, input.bands.length - 1) +
                footerHeight +
                padding
        );
        canvas.width = TIER_EXPORT_WIDTH;
        canvas.height = height;
        context.textBaseline = "top";
        context.fillStyle = colors.canvas;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // 머리 — 왼쪽 서열표 · 조건 / 아래 달성 요약, 오른쪽 NosLog · 날짜
        context.fillStyle = colors.text;
        context.font = titleFont;
        const brandWidth = (() => {
            context.font = font(size(20), weight("bold"));
            return context.measureText("NosLog").width;
        })();
        context.font = titleFont;
        context.fillText(
            ellipsize(
                context,
                input.title,
                TIER_EXPORT_WIDTH - padding * 2 - brandWidth - space(24)
            ),
            padding,
            padding + (line(40) - size(32)) / 2
        );
        if (input.subtitle) {
            context.font = subtitleFont;
            context.fillStyle = colors.subdued;
            context.fillText(
                input.subtitle,
                padding,
                padding + line(40) + space(4) + (line(20) - size(14)) / 2
            );
        }
        context.textAlign = "right";
        context.fillStyle = colors.text;
        context.font = font(size(20), weight("bold"));
        context.fillText(
            "NosLog",
            TIER_EXPORT_WIDTH - padding,
            padding + (line(28) - size(20)) / 2
        );
        context.font = metaFont;
        context.fillStyle = colors.subdued;
        context.fillText(
            input.date,
            TIER_EXPORT_WIDTH - padding,
            padding + line(28) + space(4)
        );
        context.textAlign = "left";

        const entries = input.bands.flatMap((band) => band.entries);
        const jackets = await loadJackets(entries);
        let y = padding + headerHeight + space(24);
        input.bands.forEach((band, bandIndex) => {
            // 구간 값(서열 값 그라데이션 색) · 아래 달성 수
            context.font = bandFont;
            context.fillStyle = tokens.color(tierValueColor(band.value));
            context.fillText(
                formatTierValue(band.value),
                padding,
                y + (line(28) - size(20)) / 2
            );
            if (input.showAchievement) {
                context.font = metaFont;
                context.fillStyle = colors.subdued;
                context.fillText(
                    input.achievedLabel(
                        achievedCount(band),
                        band.entries.length
                    ),
                    padding,
                    y + line(28)
                );
            }
            band.entries.forEach((entry, index) => {
                const column = index % TIER_EXPORT_COLUMNS;
                const row = Math.floor(index / TIER_EXPORT_COLUMNS);
                const x = padding + labelWidth + column * (cell + gap);
                const top = y + row * (rowHeight + gap);
                const achieved = isTierGoalAchieved(entry.record, input.goal);
                const record = entry.record;
                const pianist = Boolean(
                    record &&
                    (record.fc_type === 3 || record.score >= 1_000_000)
                );
                const fc = Boolean(record && record.fc_type >= 2 && !pianist);

                context.save();
                roundedRect(context, x, top, cell, cell, radius);
                context.clip();
                context.fillStyle = colors.sunken;
                context.fillRect(x, top, cell, cell);
                const image = jackets.get(entry.chart.music.index);
                if (!image) {
                    // 자켓이 없으면 화면(MusicJacket)과 같은 음표 대체 아이콘 — icon-large · content/subdued
                    const icon = tokens.px("--nl-icon-large");
                    const scale = icon / 24;
                    context.save();
                    context.translate(
                        x + (cell - icon) / 2,
                        top + (cell - icon) / 2
                    );
                    context.scale(scale, scale);
                    context.strokeStyle = colors.subdued;
                    context.lineWidth = 2;
                    context.lineCap = "round";
                    context.lineJoin = "round";
                    context.stroke(new Path2D("M9 18V5l12-2v13"));
                    context.stroke(
                        new Path2D("M9 18a3 3 0 1 1-6 0a3 3 0 1 1 6 0")
                    );
                    context.stroke(
                        new Path2D("M21 16a3 3 0 1 1-6 0a3 3 0 1 1 6 0")
                    );
                    context.restore();
                }
                if (image) {
                    const scale = Math.max(
                        cell / image.naturalWidth,
                        cell / image.naturalHeight
                    );
                    const drawWidth = image.naturalWidth * scale;
                    const drawHeight = image.naturalHeight * scale;
                    context.drawImage(
                        image,
                        x + (cell - drawWidth) / 2,
                        top + (cell - drawHeight) / 2,
                        drawWidth,
                        drawHeight
                    );
                    if (input.showAchievement && !achieved) {
                        try {
                            desaturate(context, x, top, cell);
                        } catch {
                            // 교차 출처 허용이 없는 자켓은 화소를 못 읽어 컬러 그대로 둔다
                        }
                    }
                }
                context.restore();

                // 자켓 위 띠 — 고른 값(공식 Grd · 레이팅)
                const stripText = input.showAchievement
                    ? input.stripValue(entry)
                    : null;
                if (stripText && input.strip !== "off") {
                    const stripHeight = space(2) * 2 + line(16);
                    context.save();
                    roundedRect(context, x, top, cell, cell, radius);
                    context.clip();
                    context.fillStyle = colors.scrim;
                    context.fillRect(x, top, cell, stripHeight);
                    context.restore();
                    context.font = metaFont;
                    context.fillStyle = colors.onMedia;
                    context.textAlign = "center";
                    context.fillText(
                        stripText,
                        x + cell / 2,
                        top + space(2) + (line(16) - size(12)) / 2
                    );
                    context.textAlign = "left";
                }

                // 오른쪽 아래 난이도 판
                context.font = plateFont;
                // 칸이 폰 카드(375 이상)보다 커서 판은 약칭 없이 전체 이름
                const plateText = `${entry.chart.difficulty} ${entry.chart.level}`;
                const plateWidth =
                    context.measureText(plateText).width + space(4) * 2;
                const plateHeight = line(16) + space(2) * 2;
                const plateX = x + cell - space(8) - plateWidth;
                const plateY = top + cell - space(8) - plateHeight;
                context.fillStyle = colors.overlay;
                roundedRect(
                    context,
                    plateX,
                    plateY,
                    plateWidth,
                    plateHeight,
                    plateRadius
                );
                context.fill();
                context.fillStyle = difficultyColor(entry.chart.difficulty);
                context.fillText(
                    plateText,
                    plateX + space(4),
                    plateY + space(2) + (line(16) - size(12)) / 2
                );

                // 테두리 — 달성 = 기준 색(달성 + FC = FC 초록 → 기준 색), 그 밖은 빈 칸 선
                if (input.showAchievement && achieved) {
                    const stroke = 2;
                    if (fc) {
                        const gradient = context.createLinearGradient(
                            x,
                            top,
                            x + cell,
                            top + cell
                        );
                        gradient.addColorStop(0.25, colors.fullCombo);
                        gradient.addColorStop(0.75, colors.goal);
                        context.strokeStyle = gradient;
                    } else context.strokeStyle = colors.goal;
                    context.lineWidth = stroke;
                    roundedRect(
                        context,
                        x + stroke / 2,
                        top + stroke / 2,
                        cell - stroke,
                        cell - stroke,
                        radius - stroke / 2
                    );
                    context.stroke();
                } else {
                    context.strokeStyle = colors.emptySlot;
                    context.lineWidth = 1;
                    roundedRect(
                        context,
                        x + 0.5,
                        top + 0.5,
                        cell - 1,
                        cell - 1,
                        radius - 0.5
                    );
                    context.stroke();
                }

                if (input.showNames) {
                    context.font = metaFont;
                    context.fillStyle = colors.text;
                    context.fillText(
                        ellipsize(
                            context,
                            entry.chart.music.localizedTitle ??
                                entry.chart.music.title,
                            cell
                        ),
                        x,
                        top + cell + space(4) + (line(16) - size(12)) / 2
                    );
                }
            });
            y +=
                bandHeights[bandIndex] +
                (bandIndex < input.bands.length - 1 ? space(24) : 0);
        });

        // 바닥 — 구분선 · 이 서열표 주소
        y += space(16);
        context.fillStyle = colors.divider;
        context.fillRect(padding, y, TIER_EXPORT_WIDTH - padding * 2, 1);
        y += 1 + space(16);
        context.font = metaFont;
        context.fillStyle = colors.subdued;
        context.fillText(
            ellipsize(context, input.url, TIER_EXPORT_WIDTH - padding * 2),
            padding,
            y + (line(16) - size(12)) / 2
        );
        return canvas;
    } finally {
        tokens.dispose();
    }
}

export function canvasBlob(
    canvas: HTMLCanvasElement,
    type: "image/jpeg" | "image/png"
) {
    return new Promise<Blob | null>((resolve) =>
        canvas.toBlob(
            resolve,
            type,
            type === "image/jpeg" ? JPEG_QUALITY : undefined
        )
    );
}
