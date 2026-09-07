"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ListFilter } from "lucide-react";
import PageContainer, { PageHeading } from "@/components/layout/pageContainer";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import SearchField from "@/components/ui/searchField";
import Button from "@/components/ui/Button";
import FullScreenDialog from "@/components/ui/fullScreenDialog";
import RadioGroup from "@/components/ui/radioGroup";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusMessage } from "@/components/ui/statusMessage";
import { arcadeDiscoverySchema } from "@/features/arcades/schemas/publicArcadeSchema";
import type {
    ArcadeDiscoveryValues,
    PublicArcade,
} from "@/features/arcades/schemas/publicArcadeSchema";
import {
    arcadeDistance,
    selectArcades,
} from "@/features/arcades/arcadeDiscovery";
import { useArcadeSession } from "@/features/arcades/hooks/useArcadeSession";
import ArcadeResultCard from "./arcadeResultCard";
import ArcadeDiscoveryMap from "./arcadeDiscoveryMap";

export default function ArcadeDiscoveryPage({
    arcades,
    appKey,
}: {
    arcades: PublicArcade[];
    appKey: string;
}) {
    const locale = useLocale();
    const t = useTranslations();
    const params = useSearchParams();
    const parsed = arcadeDiscoverySchema.safeParse({
        q: params.get("q") ?? "",
        region: params.get("region") ?? "",
        open: params.get("open") === "1",
        available: params.get("available") === "1",
        sort: params.get("sort") ?? "default",
        mode: params.get("mode") ?? "list",
    });
    const values = parsed.success
        ? parsed.data
        : arcadeDiscoverySchema.parse({});
    const { origin, bounds, selectedId, setOrigin, setBounds, select } =
        useArcadeSession();
    const [filterOpen, setFilterOpen] = useState(false);
    const [locationState, setLocationState] = useState<
        "idle" | "requesting" | "denied" | "error"
    >("idle");
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 60_000);
        return () => window.clearInterval(timer);
    }, []);
    const form = useForm({
        resolver: zodResolver(arcadeDiscoverySchema),
        defaultValues: values,
    });
    const draft = useWatch({ control: form.control });
    const result = selectArcades(arcades, values, locale, origin, bounds, now);
    const draftResult = selectArcades(
        arcades,
        arcadeDiscoverySchema.parse(draft),
        locale,
        origin,
        bounds,
        now
    );
    const regions = useMemo(
        () =>
            Array.from(
                new Set(
                    arcades
                        .map((arcade) => arcade.region)
                        .filter((region): region is string => Boolean(region))
                )
            ).sort((a, b) => a.localeCompare(b, locale)),
        [arcades, locale]
    );
    const selected = result.find((arcade) => arcade.id === selectedId);
    const filterCount = Number(values.open) + Number(values.available);
    const sorts = (
        [
            "default",
            "name",
            "preferred",
            ...(origin ? (["distance"] as const) : []),
        ] as const
    ).map((value) => ({ value, label: t(`arcades.sort.${value}`) }));

    function commit(next: ArcadeDiscoveryValues) {
        const query = new URLSearchParams();
        if (next.q) query.set("q", next.q);
        if (next.region) query.set("region", next.region);
        if (next.open) query.set("open", "1");
        if (next.available) query.set("available", "1");
        if (next.sort !== "default") query.set("sort", next.sort);
        if (next.mode !== "list") query.set("mode", next.mode);
        // Next's History integration adds its own route state. Copying that
        // internal state here bypasses its search-param update notification.
        window.history.replaceState(
            {},
            "",
            `${window.location.pathname}${query.size ? `?${query}` : ""}`
        );
    }
    function setFilterLayer(open: boolean) {
        if (open)
            form.reset({
                ...values,
                sort:
                    values.sort === "distance" && !origin
                        ? "default"
                        : values.sort,
            });
        setFilterOpen(open);
    }
    function nearby() {
        if (!navigator.geolocation || !window.isSecureContext) {
            setLocationState("error");
            return;
        }
        setLocationState("requesting");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setOrigin({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setBounds(null);
                setLocationState("idle");
                const query = new URLSearchParams(window.location.search);
                query.set("sort", "distance");
                window.history.replaceState(
                    {},
                    "",
                    `${window.location.pathname}?${query}`
                );
            },
            (error) =>
                setLocationState(
                    error.code === error.PERMISSION_DENIED ? "denied" : "error"
                ),
            { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 }
        );
    }
    return (
        <PageContainer className="nl-arcades" data-mode={values.mode}>
            <PageHeading title={t("arcades.title")} />
            <SearchField
                value={values.q}
                maxLength={200}
                aria-label={t("arcades.search")}
                placeholder={t("arcades.searchPlaceholder")}
                clearLabel={t("discovery.clearQuery")}
                onClear={() => commit({ ...values, q: "" })}
                onChange={(event) =>
                    commit({ ...values, q: event.target.value })
                }
            />
            <div className="nl-arcades__controls">
                <Button
                    appearance="foundation"
                    variant="secondary"
                    size="sm"
                    disabled={locationState === "requesting"}
                    onClick={nearby}
                >
                    {t(
                        locationState === "requesting"
                            ? "arcades.nearMeBusy"
                            : "arcades.nearMe"
                    )}
                </Button>
                <FullScreenDialog
                    open={filterOpen}
                    onOpenChange={setFilterLayer}
                    title={t("discovery.filterSort")}
                    trigger={
                        <Button
                            appearance="foundation"
                            size="sm"
                            variant="secondary"
                        >
                            <ListFilter className="nl-icon" aria-hidden />
                            {t("discovery.filterSort")}
                            {filterCount ? ` (${filterCount})` : ""}
                            <ChevronDown className="nl-icon" aria-hidden />
                        </Button>
                    }
                    footer={
                        <Button
                            appearance="foundation"
                            size="sm"
                            className="nl-arcades__apply"
                            onClick={form.handleSubmit((next) => {
                                commit(next);
                                setFilterOpen(false);
                            })}
                        >
                            {t("arcades.viewResults", {
                                count: draftResult.length,
                            })}
                        </Button>
                    }
                >
                    <form
                        noValidate
                        className="nl-arcades__filters"
                        onSubmit={form.handleSubmit((next) => {
                            commit(next);
                            setFilterOpen(false);
                        })}
                    >
                        <Controller
                            control={form.control}
                            name="sort"
                            render={({ field }) => (
                                <RadioGroup
                                    label={t("discovery.sortLabel")}
                                    value={field.value ?? "default"}
                                    onValueChange={field.onChange}
                                    options={sorts}
                                />
                            )}
                        />
                        <div className="nl-arcades__filter-options">
                            <Checkbox
                                label={t("arcades.openFilter")}
                                {...form.register("open")}
                            />
                            <Checkbox
                                label={t("arcades.availableFilter")}
                                {...form.register("available")}
                            />
                        </div>
                        <label className="nl-control nl-arcades__region">
                            {t("arcades.region")}
                            <select {...form.register("region")}>
                                <option value="">
                                    {t("arcades.scope.nationwide")}
                                </option>
                                {regions.map((region) => (
                                    <option value={region} key={region}>
                                        {region}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <Button
                            appearance="foundation"
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                                form.reset({
                                    ...values,
                                    region: "",
                                    open: false,
                                    available: false,
                                    sort: "default",
                                })
                            }
                        >
                            {t("arcades.reset")}
                        </Button>
                    </form>
                </FullScreenDialog>
                {values.mode === "map" ? (
                    <Button
                        appearance="foundation"
                        size="sm"
                        variant="secondary"
                        onClick={() => commit({ ...values, mode: "list" })}
                    >
                        {t("arcades.listView")}
                    </Button>
                ) : null}
            </div>
            {locationState === "denied" || locationState === "error" ? (
                <StatusMessage
                    severity="warning"
                    title={t(
                        locationState === "denied"
                            ? "arcades.locationDenied"
                            : "arcades.locationFailed"
                    )}
                />
            ) : null}
            <div className="nl-arcades__results">
                <div className="nl-arcades__map-region">
                    <ArcadeDiscoveryMap
                        appKey={appKey}
                        arcades={result}
                        selectedId={selectedId}
                        onSelect={select}
                        onSearchArea={setBounds}
                        onExpand={
                            values.mode === "list"
                                ? () => commit({ ...values, mode: "map" })
                                : undefined
                        }
                    />
                    {selected ? (
                        <div className="nl-arcades__preview">
                            <ArcadeResultCard
                                arcade={selected}
                                distance={arcadeDistance(selected, origin)}
                                selected
                                onSelect={select}
                            />
                        </div>
                    ) : null}
                </div>
                <div className="nl-arcades__catalog">
                    <div
                        className="nl-arcades__summary nl-body-secondary nl-muted"
                        role="status"
                    >
                        <p>{t("arcades.results", { count: result.length })}</p>
                        {values.region ? <p>{values.region}</p> : null}
                        {filterCount ? (
                            <p>
                                {[
                                    values.open
                                        ? t("arcades.openFilter")
                                        : null,
                                    values.available
                                        ? t("arcades.availableFilter")
                                        : null,
                                ]
                                    .filter(Boolean)
                                    .join(" · ")}
                            </p>
                        ) : null}
                        <p>
                            {t(
                                `arcades.sort.${values.sort === "distance" && !origin ? "default" : values.sort}`
                            )}
                        </p>
                    </div>
                    {bounds ? (
                        <Button
                            appearance="foundation"
                            size="sm"
                            variant="ghost"
                            onClick={() => setBounds(null)}
                        >
                            {t("arcades.resetArea")}
                        </Button>
                    ) : null}
                    {result.length ? (
                        <ul
                            className="nl-arcades__list"
                            aria-label={t("arcades.list")}
                        >
                            {result.map((arcade) => (
                                <li key={arcade.id}>
                                    <ArcadeResultCard
                                        arcade={arcade}
                                        distance={arcadeDistance(
                                            arcade,
                                            origin
                                        )}
                                        selected={arcade.id === selectedId}
                                        onSelect={select}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="nl-body nl-muted">
                            {t("arcades.noResults")}
                        </p>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
