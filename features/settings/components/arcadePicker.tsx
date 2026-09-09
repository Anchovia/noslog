"use client";

import { useId, useRef, useState } from "react";
import ModalDialog from "@/components/ui/modalDialog";
import { Input } from "@/components/ui/formField";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import type { SettingsPageData } from "@/features/settings/server/settingsPageService";

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
            <Input
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
            <p role="status" className="nl-metadata nl-muted">
                {t("settings.arcadeResults", { count: matches.length })}
            </p>
            <div
                id={listId}
                role="listbox"
                aria-label={t("settings.preferredArcade")}
                className="nl-settings__arcade-options"
            >
                {matches.map((arcade, index) => (
                    <div
                        key={arcade.id}
                        id={`${listId}-${index}`}
                        role="option"
                        aria-selected={String(arcade.id) === selectedId}
                        data-active={active === index || undefined}
                        className="nl-settings__arcade-option nl-control"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => select(arcade.id)}
                    >
                        {arcade.name}
                        {arcade.region ? ` · ${arcade.region}` : ""}
                    </div>
                ))}
            </div>
            {!matches.length ? (
                <p className="nl-body-secondary nl-muted">
                    {t("arcades.noResults")}
                </p>
            ) : null}
            <a href={href("/arcades")} className="nl-text-link nl-control">
                {t("header.arcades")}
            </a>
        </ModalDialog>
    );
}
