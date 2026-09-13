import copy from "@/features/privacy/content/policyCopy.json";
import version20260727 from "@/features/privacy/content/versions/2026-07-27.json";
import { privacyCopySchema } from "@/features/privacy/schemas/privacyCopySchema";
import type { Locale } from "@/lib/i18n/routing";

// Visual copy from P15 (2026-09-02). Legal/operational release blockers in
// handoff 82 remain open; the four warning blocks must not be removed.
export function getPrivacyCopy(locale: Locale) {
    return privacyCopySchema.parse(copy[locale]);
}

// 이전 시행 버전 — 새 시행 버전을 낼 때 직전 policyCopy.json 을 versions/{시행일}.json 으로 손대지 않고 보관하고
// 여기 맨 앞에 한 줄 더한다. until 은 다음 버전 시행 전날(서울 기준). 지어낸 날짜나 지운 문서로 이력을 만들지 않는다
export const PRIVACY_PREVIOUS_VERSIONS = [
    {
        id: "2026-07-27",
        effective: "2026-07-27",
        until: "2026-09-12",
        copy: version20260727,
    },
] as const;
export type PrivacyVersion = (typeof PRIVACY_PREVIOUS_VERSIONS)[number];

export function getPrivacyVersion(id: string) {
    return (
        PRIVACY_PREVIOUS_VERSIONS.find((version) => version.id === id) ?? null
    );
}

export function getPrivacyVersionCopy(version: PrivacyVersion, locale: Locale) {
    return privacyCopySchema.parse(version.copy[locale]);
}

// 방침 머리의 날짜와 같은 표기 — 2026년 7월 27일 / 2026年7月27日 / July 27, 2026
function policyDate(key: string, locale: Locale) {
    const [year, month, day] = key.split("-").map(Number);
    if (locale === "ko") return `${year}년 ${month}월 ${day}일`;
    if (locale === "ja") return `${year}年${month}月${day}日`;
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    }).format(Date.UTC(year, month - 1, day));
}

export function privacyVersionPeriod(version: PrivacyVersion, locale: Locale) {
    const separator = locale === "ja" ? "〜" : " – ";
    return `${policyDate(version.effective, locale)}${separator}${policyDate(version.until, locale)}`;
}

export const privacyHistoryCopy = {
    ko: {
        title: "이전 버전",
        empty: "아직 이전 버전이 없습니다.",
        period: (range: string) => `적용 기간: ${range}`,
    },
    ja: {
        title: "過去のバージョン",
        empty: "過去のバージョンはまだありません。",
        period: (range: string) => `適用期間：${range}`,
    },
    en: {
        title: "Previous versions",
        empty: "There are no previous versions yet.",
        period: (range: string) => `Effective period: ${range}`,
    },
} as const;
