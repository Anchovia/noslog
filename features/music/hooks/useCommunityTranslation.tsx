"use client";

import { Languages } from "lucide-react";
import { useState } from "react";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import { translateChartContribution } from "@/app/(nevigation)/music/communityActions";

type StoredTranslations = { ko?: string; ja?: string; en?: string };

/**
 * 의견 · 답글 번역(2026-09-22 T1) — 보는 사람 언어와 다른 글에만 「번역 보기」(NN/g).
 * 누르면 같은 자리를 번역문으로 바꾸고 「일본어에서 번역됨 · Gemini · 원문 보기」 를 붙인다(Booking · Amazon 식).
 * 저장된 번역이 있으면 바로, 없으면 처음 한 번만 서버가 만든다(그동안 「번역 중…」)
 */
export default function useCommunityTranslation({
    kind,
    id,
    text,
    language,
    translations,
    enabled,
}: {
    kind: "opinion" | "reply";
    id: number;
    text: string | null;
    language: "ko" | "ja" | "en" | null;
    translations: StoredTranslations;
    enabled: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const [shown, setShown] = useState(false);
    const [fetched, setFetched] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const available =
        enabled && text !== null && language !== null && language !== locale;
    const translated = translations[locale] ?? fetched;
    const translate = async () => {
        setError(null);
        if (translated) {
            setShown(true);
            return;
        }
        setBusy(true);
        const result = await translateChartContribution(
            { kind, id, locale },
            locale
        );
        setBusy(false);
        if (!result.success) {
            setError(result.message);
            return;
        }
        setFetched(result.text);
        setShown(true);
    };
    const showing = available && shown && Boolean(translated);
    return {
        text: showing ? translated! : text,
        lang: showing ? locale : (language ?? undefined),
        button:
            available && !showing ? (
                <button
                    type="button"
                    className="nl-opinion-like nl-control"
                    aria-busy={busy || undefined}
                    disabled={busy}
                    onClick={() => void translate()}
                >
                    {busy ? (
                        <span className="nl-spinner" aria-hidden />
                    ) : (
                        <Languages className="nl-icon-small" aria-hidden />
                    )}
                    <span>
                        {busy
                            ? t("community.translating")
                            : t("community.translate")}
                    </span>
                </button>
            ) : null,
        note: showing ? (
            <p className="nl-opinion-row__translation nl-metadata nl-muted">
                <Languages className="nl-icon-small" aria-hidden />
                <span>
                    {t("community.translatedFrom", {
                        language: t(`community.language.${language!}`),
                    })}
                </span>
                <button
                    type="button"
                    className="nl-link"
                    onClick={() => setShown(false)}
                >
                    {t("community.showOriginal")}
                </button>
            </p>
        ) : null,
        error,
    };
}
