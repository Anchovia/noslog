"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import CompactSelect from "@/components/ui/compactSelect";
import SearchField from "@/components/ui/searchField";
import { searchPreviewOptions } from "@/features/music/api/searchPreview";
import MusicResultCard from "@/features/music/components/musicResultCard";
import { musicSearchSchema } from "@/features/music/schemas/musicSearchSchema";
import type { MusicSearchFormValues } from "@/features/music/schemas/musicSearchSchema";
import type { SearchScope } from "@/features/music/schemas/searchPreviewSchema";
import useDebouncedValue from "@/lib/hooks/useDebouncedValue";

export default function HomeSearch() {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const router = useRouter();
    const resultsId = useId();
    const regionRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [scope, setScope] = useState<SearchScope>("music");
    const [composing, setComposing] = useState(false);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const [capacity, setCapacity] = useState(5);
    const [slowRequest, setSlowRequest] = useState<string | null>(null);
    const { register, control, setValue, handleSubmit } =
        useForm<MusicSearchFormValues>({
            resolver: zodResolver(musicSearchSchema),
            defaultValues: { search: "" },
        });
    const value = useWatch({ control, name: "search" }) ?? "";
    const normalized = value.trim();
    const queryKey = `${scope}:${composing ? "" : normalized}`;
    const debouncedKey = useDebouncedValue(queryKey, 300);
    const current =
        queryKey === debouncedKey && !composing && normalized.length > 0;
    const query = useQuery({
        ...searchPreviewOptions({ q: normalized, scope, locale }),
        enabled: current && open,
    });
    const pending = current && query.isFetching;
    const busyKey = `${queryKey}:${query.dataUpdatedAt}:${query.errorUpdatedAt}`;

    useEffect(() => {
        if (!pending) return;
        const timer = setTimeout(() => setSlowRequest(busyKey), 400);
        return () => clearTimeout(timer);
    }, [pending, busyKey]);
    useEffect(() => {
        function closeOutside(event: PointerEvent) {
            if (
                event.target instanceof Node &&
                !regionRef.current?.contains(event.target)
            )
                setOpen(false);
        }
        document.addEventListener("pointerdown", closeOutside);
        return () => document.removeEventListener("pointerdown", closeOutside);
    }, []);

    const data = current ? query.data : undefined;
    const total = data?.total ?? 0;
    useEffect(() => {
        const anchor = regionRef.current;
        if (!anchor) return;
        function measure() {
            const viewport = window.visualViewport;
            const bottom =
                (viewport?.offsetTop ?? 0) +
                (viewport?.height ?? window.innerHeight);
            const available =
                bottom - anchor!.getBoundingClientRect().bottom - 8 - 32 - 16;
            const withoutHandoff = Math.min(
                5,
                Math.max(0, Math.floor((available + 8) / 72))
            );
            setCapacity(
                total > withoutHandoff
                    ? Math.min(
                          5,
                          Math.max(0, Math.floor((available - 44) / 72))
                      )
                    : withoutHandoff
            );
        }
        const observer = new ResizeObserver(measure);
        observer.observe(anchor);
        window.visualViewport?.addEventListener("resize", measure);
        window.visualViewport?.addEventListener("scroll", measure);
        window.addEventListener("scroll", measure, { passive: true });
        return () => {
            observer.disconnect();
            window.visualViewport?.removeEventListener("resize", measure);
            window.visualViewport?.removeEventListener("scroll", measure);
            window.removeEventListener("scroll", measure);
        };
    }, [total]);

    const items = data?.items.slice(0, capacity) ?? [];
    const allParams = new URLSearchParams();
    if (normalized) allParams.set("q", normalized);
    if (scope === "chart") allParams.set("scope", scope);
    const allHref = href(`/music${allParams.size ? `?${allParams}` : ""}`);
    const destinations = items.map((item) =>
        href(
            `/music/${item.index}/${item.difficulty?.toLowerCase() ?? "normal"}${scope === "chart" ? "/pattern" : ""}`
        )
    );
    const showHandoff = total > items.length;
    if (showHandoff) destinations.push(allHref);
    const showPopup =
        open &&
        current &&
        (Boolean(data) ||
            query.isError ||
            (pending && slowRequest === busyKey));
    const activeId =
        showPopup && active >= 0 && active < destinations.length
            ? `${resultsId}-${active}`
            : undefined;

    function navigate(destination: string) {
        setOpen(false);
        router.push(destination);
    }
    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (composing || event.nativeEvent.isComposing) return;
        if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
            setActive(-1);
            return;
        }
        if (
            showPopup &&
            destinations.length &&
            (event.key === "ArrowDown" || event.key === "ArrowUp")
        ) {
            event.preventDefault();
            setActive(
                (index) =>
                    (index +
                        (event.key === "ArrowDown" ? 1 : -1) +
                        destinations.length) %
                    destinations.length
            );
        } else if (event.key === "Enter" && activeId) {
            event.preventDefault();
            navigate(destinations[active]);
        }
    }

    const registration = register("search");
    return (
        <form
            ref={regionRef}
            role="search"
            aria-label={t("home.preview")}
            className="nl-home-search"
            onSubmit={handleSubmit(() => {
                if (!composing) navigate(allHref);
            })}
        >
            <SearchField
                {...registration}
                ref={(element) => {
                    registration.ref(element);
                    inputRef.current = element;
                }}
                value={value}
                onChange={(event) => {
                    void registration.onChange(event);
                    setActive(-1);
                    setOpen(true);
                }}
                maxLength={100}
                aria-label={t(
                    scope === "music"
                        ? "discovery.musicPlaceholder"
                        : "discovery.chartPlaceholder"
                )}
                placeholder={t(
                    scope === "music"
                        ? "discovery.musicPlaceholder"
                        : "discovery.chartPlaceholder"
                )}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={showPopup}
                aria-controls={resultsId}
                aria-activedescendant={activeId}
                autoComplete="off"
                enterKeyHint="search"
                onFocus={() => setOpen(true)}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setComposing(true)}
                onCompositionEnd={() => setComposing(false)}
                clearLabel={t("discovery.clear")}
                onClear={() => {
                    setValue("search", "");
                    setOpen(false);
                    setActive(-1);
                    inputRef.current?.focus({ preventScroll: true });
                }}
                leading={
                    <CompactSelect
                        value={scope}
                        onValueChange={(next) => {
                            setScope(next);
                            setActive(-1);
                            setOpen(true);
                        }}
                        label={t("discovery.scope")}
                        options={[
                            {
                                value: "music",
                                label: t("discovery.musicSearch"),
                                shortLabel: t("discovery.music"),
                            },
                            {
                                value: "chart",
                                label: t("discovery.chartSearch"),
                                shortLabel: t("discovery.chart"),
                            },
                        ]}
                    />
                }
            />
            <div
                className="nl-search-preview"
                hidden={!showPopup}
                aria-busy={pending || undefined}
            >
                <div
                    id={resultsId}
                    role="listbox"
                    aria-label={t("home.preview")}
                    className="nl-search-preview__list"
                >
                    {items.map((item, index) => (
                        <MusicResultCard
                            key={`${item.index}:${item.difficulty}`}
                            music={item}
                            showLevels={false}
                            destination={destinations[index]}
                            role="option"
                            id={`${resultsId}-${index}`}
                            aria-selected={active === index}
                            tabIndex={-1}
                            onClick={() => setOpen(false)}
                        />
                    ))}
                    {showHandoff ? (
                        <Link
                            href={allHref}
                            id={`${resultsId}-${items.length}`}
                            role="option"
                            aria-selected={active === items.length}
                            tabIndex={-1}
                            className="nl-search-preview__all nl-control"
                            onClick={() => setOpen(false)}
                        >
                            {t("home.allResults", { count: total })}
                        </Link>
                    ) : null}
                </div>
                {pending && !data ? (
                    <p className="nl-body-secondary nl-muted" role="status">
                        {t("home.previewLoading")}
                    </p>
                ) : query.isError ? (
                    <div className="nl-inline">
                        <p className="nl-body-secondary nl-muted">
                            {t("home.previewError")}
                        </p>
                        <ActionButton
                            variant="ghost"
                            onClick={() => {
                                setSlowRequest(null);
                                void query.refetch();
                            }}
                        >
                            {t("common.retry")}
                        </ActionButton>
                    </div>
                ) : data?.total === 0 ? (
                    <p className="nl-body-secondary nl-muted" role="status">
                        {t("home.previewEmpty")}
                    </p>
                ) : null}
            </div>
        </form>
    );
}
