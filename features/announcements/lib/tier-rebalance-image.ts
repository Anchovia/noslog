import {
    loadTierImageFont,
    TIER_CHANGE_IMAGE_PALETTE,
    TIER_IMAGE_FONT_FAMILY,
} from "@/features/announcements/lib/tier-change-image";
import {
    TIER_REBALANCE_BAND_COUNT,
    TIER_REBALANCE_LABELS,
    type TierRebalanceImageData,
    tierRebalanceImageSchema,
} from "@/features/announcements/schemas/tier-rebalance-image-schema";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/routing";
import { MAX_IMAGE_SIZE } from "@/lib/image-upload-rules";

/** 사용자가 적용한 2026-10-08 재배치의 고정 집계. 다음 공지에는 명시적으로만 불러온다. */
export const TIER_REBALANCE_2026_10_08: TierRebalanceImageData = {
    date: "2026-10-08",
    chartsPerTier: 2172,
    rows: [
        { changed: 1950, added: 3, beforeMax: 230, afterMax: 39 },
        { changed: 1877, added: 3, beforeMax: 227, afterMax: 39 },
        { changed: 1827, added: 3, beforeMax: 226, afterMax: 39 },
        { changed: 1888, added: 3, beforeMax: 231, afterMax: 39 },
    ],
};
const number = (value: number) => value.toLocaleString("ko-KR");
export function tierRebalanceTotals(data: TierRebalanceImageData) {
    const total = data.chartsPerTier * data.rows.length;
    const changed = data.rows.reduce((sum, row) => sum + row.changed, 0);
    const added = data.rows.reduce((sum, row) => sum + row.added, 0);
    return { total, changed, added, retained: total - changed - added };
}
export function tierRebalanceImageAlt(
    data: TierRebalanceImageData,
    locale: Locale
) {
    const totals = tierRebalanceTotals(data);
    const t = createTranslator(getMessages(locale));
    return t("announcements.tierRebalance.imageAlt", {
        date: data.date,
        total: number(totals.total),
        changed: number(totals.changed),
        added: number(totals.added),
        retained: number(totals.retained),
        charts: number(data.chartsPerTier),
        bands: TIER_REBALANCE_BAND_COUNT,
        rows: data.rows
            .map((row, index) =>
                t("announcements.tierRebalance.rowAlt", {
                    label: [
                        "Basic S",
                        "Basic 990k",
                        "Basic Pianist",
                        "Recital Grd",
                    ][index],
                    changed: number(row.changed),
                    added: number(row.added),
                    before: number(row.beforeMax),
                    after: number(row.afterMax),
                })
            )
            .join("; "),
    });
}

/** 승인된 한글 A안: 1200×960, 네 서열표의 변경 수와 구간별 최대 밀집도를 비교한다. */
export async function createTierRebalanceImage(
    input: TierRebalanceImageData
): Promise<File> {
    const data = tierRebalanceImageSchema.parse(input);
    await loadTierImageFont();
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 960;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("이 브라우저에서 이미지를 만들 수 없습니다.");
    const colors = TIER_CHANGE_IMAGE_PALETTE;
    context.fillStyle = colors.background;
    context.fillRect(0, 0, 1200, 960);
    context.fillStyle = colors.accent;
    context.beginPath();
    context.arc(68, 88, 12, 0, Math.PI * 2);
    context.fill();
    const text = (
        value: string,
        x: number,
        y: number,
        size: number,
        color: string = colors.subtitle,
        weight = 400,
        align: CanvasTextAlign = "left",
        maxWidth = 1088
    ) => {
        context.font = `${weight} ${size}px ${TIER_IMAGE_FONT_FAMILY}`;
        // 고정 칸 폭을 넘는 숫자는 축소·잘라내기 대신 입력 오류로 알린다.
        if (context.measureText(value).width > maxWidth)
            throw new Error(
                "数字が画像の欄に収まりません。集計範囲を分けてください。"
            );
        context.fillStyle = color;
        context.textAlign = align;
        context.fillText(value, x, y);
    };
    const divider = (y: number) => {
        context.fillStyle = colors.divider;
        context.fillRect(56, y, 1088, 2);
    };
    const totals = tierRebalanceTotals(data);
    text("서열표 전체 재배치", 100, 106, 52, colors.text, 700);
    text(
        `${data.date} · 서열표 4개 · 총 ${number(totals.total)}개 배치`,
        56,
        154,
        30
    );
    text(
        `값 변경 ${number(totals.changed)}건 · 신규 ${number(totals.added)}건 · 값 유지 ${number(totals.retained)}건`,
        56,
        224,
        30
    );
    text("서열표", 56, 305, 28);
    text("값 변경", 600, 305, 28, colors.subtitle, 400, "right");
    text("신규", 755, 305, 28, colors.subtitle, 400, "right");
    text("구간별 최대 채보 수", 1144, 305, 28, colors.subtitle, 400, "right");
    data.rows.forEach((row, index) => {
        const top = 328 + index * 110;
        divider(top);
        const y = top + 67;
        text(
            TIER_REBALANCE_LABELS[index],
            56,
            y,
            36,
            colors.text,
            700,
            "left",
            390
        );
        text(number(row.changed), 600, y, 36, colors.accent, 700, "right", 140);
        text(number(row.added), 755, y, 36, colors.text, 400, "right", 130);
        text(
            number(row.beforeMax),
            990,
            y,
            36,
            colors.subtitle,
            400,
            "right",
            180
        );
        text("→", 1040, y, 32, colors.subtitle, 400, "right");
        text(
            number(row.afterMax),
            1144,
            y,
            36,
            colors.accent,
            700,
            "right",
            100
        );
    });
    divider(768);
    text(
        `서열표마다 ${number(data.chartsPerTier)}개 채보 · ${TIER_REBALANCE_BAND_COUNT}개 구간 · 0.1 단위`,
        56,
        830,
        28
    );
    text("NosLog", 56, 910, 28);
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
        throw new Error("이미지가 업로드 한도 4MB를 초과했습니다.");
    return new File([blob], `noslog-tier-rebalance-${data.date}.png`, {
        type: "image/png",
    });
}
