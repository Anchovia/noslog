"use client";

import { useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import { ChevronDown, ListFilter } from "lucide-react";

export default function BingoCatalogLoading({
    authenticated = false,
}: {
    authenticated?: boolean;
}) {
    const t = useTranslations();
    return (
        <div className="nl-bingo-catalog">
            <h1 className="nl-page-title">{t("bingo.title")}</h1>
            {authenticated ? (
                <div className="nl-bingo-catalog__controls">
                    <Button
                        appearance="foundation"
                        variant="secondary"
                        size="sm"
                        disabled
                    >
                        <ListFilter className="nl-icon" aria-hidden />
                        {t("discovery.filterSort")}
                        <ChevronDown className="nl-icon" aria-hidden />
                    </Button>
                </div>
            ) : null}
            <div className="nl-bingo-catalog__grid" aria-hidden="true">
                {Array.from({ length: 4 }, (_, index) => (
                    <div
                        className="nl-bingo-card nl-bingo-card--loading"
                        key={index}
                    >
                        <div className="nl-bingo-card__cover" />
                        <span />
                        <div>
                            <span />
                        </div>
                    </div>
                ))}
            </div>
            <p className="nl-body-secondary nl-muted" role="status">
                {t("bingo.loading")}
            </p>
        </div>
    );
}
