"use client";

import { useTranslations } from "@/components/i18n/localeProvider";
import { LoadingStatus } from "@/components/ui/skeleton";
import { BingoCatalogCardSkeleton } from "./bingoCatalogCard";

/**
 * 빙고 목록 불러오기(2026-09-19 로딩 시안 S1) — 실제 목록과 같은 틀: 제목(실제 글자) →24→ 검색칸 자리(컨트롤 L) →24→ 카드 격자.
 * 안내 문장은 화면 읽기에만
 */
export default function BingoCatalogLoading() {
    const t = useTranslations();
    return (
        <div className="nl-bingo-catalog" aria-busy="true">
            <LoadingStatus label={t("bingo.loading")} />
            <div className="nl-bingo-catalog__head">
                <h1 className="nl-page-title">{t("bingo.title")}</h1>
                <div
                    className="nl-bingo-catalog__search-row"
                    aria-hidden="true"
                >
                    <span className="nl-skeleton nl-skeleton-control" />
                </div>
            </div>
            <ul className="nl-bingo-catalog__grid" aria-hidden="true">
                {Array.from({ length: 6 }, (_, index) => (
                    <li key={index}>
                        <BingoCatalogCardSkeleton />
                    </li>
                ))}
            </ul>
        </div>
    );
}
