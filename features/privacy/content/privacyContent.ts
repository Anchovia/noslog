import copy from "@/features/privacy/content/policyCopy.json";
import { privacyCopySchema } from "@/features/privacy/schemas/privacyCopySchema";
import type { Locale } from "@/lib/i18n/routing";

// Visual copy from P15 (2026-09-02). Legal/operational release blockers in
// handoff 82 remain open; the four warning blocks must not be removed.
export function getPrivacyCopy(locale: Locale) {
    return privacyCopySchema.parse(copy[locale]);
}

// No superseded policy has been supplied. Do not publish Figma's example dates
// as historical versions or infer an archive from deleted documents.
export const privacyHistoryCopy = {
    ko: { title: "이전 버전", empty: "아직 이전 버전이 없습니다." },
    ja: {
        title: "過去のバージョン",
        empty: "過去のバージョンはまだありません。",
    },
    en: {
        title: "Previous versions",
        empty: "There are no previous versions yet.",
    },
} as const;
