import type { MusicTranslationLocale, MusicTranslationStatus } from "./csv";

export interface MusicTranslationExportRow {
    index: string;
    originalTitle: string;
    titleKana: string;
    locale: MusicTranslationLocale;
    title: string;
    status: MusicTranslationStatus;
}

const FORMULA_PREFIX_PATTERN = /^[=+\-@]/;

function escapeCsvField(value: string) {
    const safeValue = FORMULA_PREFIX_PATTERN.test(value) ? `'${value}` : value;
    return `"${safeValue.replaceAll('"', '""')}"`;
}

export function serializeMusicTranslationCsv(
    rows: MusicTranslationExportRow[]
) {
    const header = "index,original_title,title_kana,locale,title,status";
    const records = rows.map((row) =>
        [
            row.index,
            row.originalTitle,
            row.titleKana,
            row.locale,
            row.title,
            row.status,
        ]
            .map(escapeCsvField)
            .join(",")
    );

    return `\uFEFF${[header, ...records].join("\r\n")}\r\n`;
}
