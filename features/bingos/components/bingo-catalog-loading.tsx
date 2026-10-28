"use client";

import { useTranslations } from "@/components/i18n/locale-provider";
import { LoadingStatus } from "@/components/ui/skeleton";

import { BingoCatalogCardSkeleton } from "./bingo-catalog-card";

/**
 * 빙고 목록 불러오기 — 실제 목록과 같은 틀: 제목(실제 글자) →16→ 검색칸 자리(컨트롤 L) →12→ 결과 줄 자리(M) →12→ 카드 격자.
 * 로그인 여부를 아직 몰라 상태 칩 줄은 두지 않는다. 안내 문장은 화면 읽기에만
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
            <div
                className="nl-filter-control-block nl-bingo-catalog__controls"
                aria-hidden="true"
            >
                <div className="nl-bingo-catalog__summary-row" />
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
