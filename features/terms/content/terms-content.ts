import copy from "@/features/terms/content/termsCopy.json";
import { termsCopySchema } from "@/features/terms/schemas/terms-copy-schema";
import type { Locale } from "@/lib/i18n/routing";

// 법률 검토가 끝나기 전까지 「법률 검토 대기」 경고 블록은 지우지 않는다
export function getTermsCopy(locale: Locale) {
    return termsCopySchema.parse(copy[locale]);
}

// 이전 시행 버전 — 새 시행 버전을 낼 때 직전 termsCopy.json 을 versions/{시행일}.json 으로 손대지 않고 보관하고
// 여기 맨 앞에 한 줄 더한다. until 은 다음 버전 시행 전날(서울 기준)
export const TERMS_PREVIOUS_VERSIONS: readonly {
    id: string;
    effective: string;
    until: string;
    copy: Record<Locale, unknown>;
}[] = [];
export type TermsVersion = (typeof TERMS_PREVIOUS_VERSIONS)[number];

export function getTermsVersion(id: string) {
    return TERMS_PREVIOUS_VERSIONS.find((version) => version.id === id) ?? null;
}

export function getTermsVersionCopy(version: TermsVersion, locale: Locale) {
    return termsCopySchema.parse(version.copy[locale]);
}
