export const MUSIC_TRANSLATION_LOCALES = ["ko", "en"] as const;
export const MUSIC_TRANSLATION_STATUSES = ["draft", "approved"] as const;

export type MusicTranslationLocale = (typeof MUSIC_TRANSLATION_LOCALES)[number];
export type MusicTranslationStatus =
    (typeof MUSIC_TRANSLATION_STATUSES)[number];

export interface MusicTranslationCsvRow {
    line: number;
    index: string;
    locale: MusicTranslationLocale;
    title: string;
    status: MusicTranslationStatus;
}

function parseCsvRecords(source: string) {
    const records: string[][] = [];
    let record: string[] = [];
    let field = "";
    let inQuotes = false;

    for (let index = 0; index < source.length; index++) {
        const character = source[index];

        if (character === '"') {
            if (inQuotes && source[index + 1] === '"') {
                field += '"';
                index++;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (!inQuotes && character === ",") {
            record.push(field);
            field = "";
            continue;
        }

        if (!inQuotes && (character === "\n" || character === "\r")) {
            if (character === "\r" && source[index + 1] === "\n") index++;
            record.push(field);
            if (record.some((value) => value.trim())) records.push(record);
            record = [];
            field = "";
            continue;
        }

        field += character;
    }

    if (inQuotes) {
        return { records: [], error: "닫히지 않은 따옴표가 있습니다." };
    }

    record.push(field);
    if (record.some((value) => value.trim())) records.push(record);

    return { records, error: null };
}

export function parseMusicTranslationCsv(source: string): {
    rows: MusicTranslationCsvRow[];
    errors: string[];
} {
    const csv = source.replace(/^\uFEFF/, "").trim();
    if (!csv) return { rows: [], errors: ["CSV 내용이 비어 있습니다."] };

    const parsed = parseCsvRecords(csv);
    if (parsed.error) return { rows: [], errors: [parsed.error] };
    if (parsed.records.length < 2) {
        return {
            rows: [],
            errors: ["헤더와 한 개 이상의 데이터 행이 필요합니다."],
        };
    }
    if (parsed.records.length > 2_001) {
        return {
            rows: [],
            errors: ["한 번에 최대 2,000개 번역만 가져올 수 있습니다."],
        };
    }

    const headers = parsed.records[0].map((value) =>
        value.trim().toLowerCase()
    );
    const requiredHeaders = ["index", "locale", "title", "status"] as const;
    const headerIndexes = Object.fromEntries(
        requiredHeaders.map((header) => [header, headers.indexOf(header)])
    ) as Record<(typeof requiredHeaders)[number], number>;
    const missingHeaders = requiredHeaders.filter(
        (header) => headerIndexes[header] < 0
    );
    if (missingHeaders.length > 0) {
        return {
            rows: [],
            errors: [`필수 헤더가 없습니다: ${missingHeaders.join(", ")}`],
        };
    }

    const rows: MusicTranslationCsvRow[] = [];
    const errors: string[] = [];
    const duplicateKeys = new Set<string>();

    parsed.records.slice(1).forEach((record, rowIndex) => {
        const line = rowIndex + 2;
        const index = record[headerIndexes.index]?.trim() ?? "";
        const locale = record[headerIndexes.locale]?.trim().toLowerCase() ?? "";
        const title = record[headerIndexes.title]?.trim() ?? "";
        const status = record[headerIndexes.status]?.trim().toLowerCase() ?? "";

        if (!index) errors.push(`${line}행: index가 비어 있습니다.`);
        if (
            !MUSIC_TRANSLATION_LOCALES.includes(
                locale as MusicTranslationLocale
            )
        ) {
            errors.push(`${line}행: locale은 ko 또는 en이어야 합니다.`);
        }
        if (!title) errors.push(`${line}행: title이 비어 있습니다.`);
        if (title.length > 300) {
            errors.push(`${line}행: title은 300자 이하여야 합니다.`);
        }
        if (
            !MUSIC_TRANSLATION_STATUSES.includes(
                status as MusicTranslationStatus
            )
        ) {
            errors.push(`${line}행: status는 draft 또는 approved여야 합니다.`);
        }

        const duplicateKey = `${index}:${locale}`;
        if (duplicateKeys.has(duplicateKey)) {
            errors.push(`${line}행: 같은 index와 locale이 중복되었습니다.`);
        }
        duplicateKeys.add(duplicateKey);

        if (
            index &&
            title &&
            title.length <= 300 &&
            MUSIC_TRANSLATION_LOCALES.includes(
                locale as MusicTranslationLocale
            ) &&
            MUSIC_TRANSLATION_STATUSES.includes(
                status as MusicTranslationStatus
            )
        ) {
            rows.push({
                line,
                index,
                locale: locale as MusicTranslationLocale,
                title,
                status: status as MusicTranslationStatus,
            });
        }
    });

    return { rows, errors };
}
