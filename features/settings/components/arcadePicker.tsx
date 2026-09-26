"use client";

import { Check } from "lucide-react";
import { useId, useRef, useState } from "react";
import ModalDialog from "@/components/ui/modalDialog";
import SearchField from "@/components/ui/searchField";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import type { SettingsPageData } from "@/features/settings/server/settingsPageService";

/**
 * 선호 오락실 고르기(2026-09-26 P1) — 검색 칸(돋보기) → 「지금 선택」(검색어가 없을 때) → 결과 목록.
 * 줄 = 이름 · 지역, 고른 줄은 체크. 누르면 고르고 닫는다
 */
export default function ArcadePicker({
    open,
    onOpenChange,
    arcades,
    selectedId,
    onSelect,
    onCloseAutoFocus,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    arcades: SettingsPageData["arcades"];
    selectedId: string;
    onSelect: (id: string) => void;
    onCloseAutoFocus: (event: Event) => void;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const listId = useId();
    const input = useRef<HTMLInputElement>(null);
    const current = arcades.find((arcade) => String(arcade.id) === selectedId);
    const matches = arcades.filter((arcade) =>
        `${arcade.name} ${arcade.region ?? ""}`
            .normalize("NFKC")
            .toLocaleLowerCase()
            .includes(query.normalize("NFKC").trim().toLocaleLowerCase())
    );
    const select = (id: number) => {
        onSelect(String(id));
        onOpenChange(false);
    };
    const move = (next: number) => {
        setActive(next);
        document
            .getElementById(`${listId}-${next}`)
            ?.scrollIntoView({ block: "nearest" });
    };
    return (
        <ModalDialog
            className="nl-settings-dialog"
            open={open}
            onOpenChange={onOpenChange}
            title={t("settings.preferredArcade")}
            onCloseAutoFocus={onCloseAutoFocus}
            onOpenAutoFocus={(event) => {
                event.preventDefault();
                input.current?.focus();
            }}
        >
            <SearchField
                ref={input}
                role="combobox"
                aria-label={t("settings.arcadeSearch")}
                aria-autocomplete="list"
                aria-controls={listId}
                aria-expanded={open}
                aria-activedescendant={
                    matches[active] ? `${listId}-${active}` : undefined
                }
                placeholder={t("settings.arcadeSearch")}
                value={query}
                clearLabel={t("discovery.clear")}
                onClear={() => {
                    setQuery("");
                    setActive(0);
                    input.current?.focus();
                }}
                onChange={(event) => {
                    setQuery(event.target.value);
                    setActive(0);
                }}
                onKeyDown={(event) => {
                    if (event.nativeEvent.isComposing || !matches.length)
                        return;
                    if (event.key === "ArrowDown") {
                        event.preventDefault();
                        move(Math.min(active + 1, matches.length - 1));
                    }
                    if (event.key === "ArrowUp") {
                        event.preventDefault();
                        move(Math.max(active - 1, 0));
                    }
                    if (event.key === "Enter" && matches[active]) {
                        event.preventDefault();
                        select(matches[active].id);
                    }
                }}
            />
            {current && !query.trim() ? (
                <div className="nl-settings__pick-group">
                    <p className="nl-metadata nl-muted">
                        {t("settings.arcadeCurrent")}
                    </p>
                    <div className="nl-pick-row" aria-hidden>
                        <span className="nl-pick-row__main">
                            <span className="nl-emphasis-label">
                                {current.name}
                            </span>
                            {current.region ? (
                                <span className="nl-metadata nl-muted">
                                    {current.region}
                                </span>
                            ) : null}
                        </span>
                        <Check className="nl-icon nl-pick-row__check" />
                    </div>
                </div>
            ) : null}
            <div className="nl-settings__pick-group">
                <p role="status" className="nl-metadata nl-muted">
                    {t("settings.arcadeResults", { count: matches.length })}
                </p>
                <div
                    id={listId}
                    role="listbox"
                    aria-label={t("settings.preferredArcade")}
                    className="nl-pick-list"
                >
                    {matches.map((arcade, index) => {
                        const picked = String(arcade.id) === selectedId;
                        return (
                            <div
                                key={arcade.id}
                                id={`${listId}-${index}`}
                                role="option"
                                aria-selected={picked}
                                data-active={active === index || undefined}
                                className="nl-pick-row"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => select(arcade.id)}
                            >
                                <span className="nl-pick-row__main">
                                    <span className="nl-emphasis-label">
                                        {arcade.name}
                                    </span>
                                    {arcade.region ? (
                                        <span className="nl-metadata nl-muted">
                                            {arcade.region}
                                        </span>
                                    ) : null}
                                </span>
                                {picked ? (
                                    <Check
                                        className="nl-icon nl-pick-row__check"
                                        aria-hidden
                                    />
                                ) : null}
                            </div>
                        );
                    })}
                </div>
                {!matches.length ? (
                    <p className="nl-body-secondary nl-muted">
                        {t("arcades.noResults")}
                    </p>
                ) : null}
            </div>
            <a href={href("/gamecenter")} className="nl-text-link nl-control">
                {t("header.arcades")}
            </a>
        </ModalDialog>
    );
}
