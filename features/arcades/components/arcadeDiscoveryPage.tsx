"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ListFilter } from "lucide-react";
import PageContainer, { PageHeading } from "@/components/layout/pageContainer";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import SearchField from "@/components/ui/searchField";
import Button from "@/components/ui/Button";
import ActionButton from "@/components/ui/actionButton";
import { Select } from "@/components/ui/select";
import AppliedTokens from "@/components/ui/appliedTokens";
import FilterChips from "@/components/ui/filterChips";
import FilterGroup from "@/components/ui/filterGroup";
import FilterSurface from "@/components/ui/filterSurface";
import SortMenu from "@/components/ui/sortMenu";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { StatusMessage } from "@/components/ui/statusMessage";
import { arcadeDiscoverySchema } from "@/features/arcades/schemas/publicArcadeSchema";
import type {
    ArcadeDiscoveryValues,
    PublicArcade,
} from "@/features/arcades/schemas/publicArcadeSchema";
import {
    arcadeCabinetSummary,
    arcadeDistance,
    selectArcades,
} from "@/features/arcades/arcadeDiscovery";
import { useArcadeSession } from "@/features/arcades/hooks/useArcadeSession";
import ArcadeResultCard from "./arcadeResultCard";
import ArcadeDiscoveryMap from "./arcadeDiscoveryMap";

const SORTS = ["distance", "verified", "name", "preferred"] as const;

/**
 * 오락실 찾기 — 지도와 목록이 한 집합이다.
 * Compact: 지도가 위에 붙고 목록이 시트처럼 그 위로 올라온다(카카오맵·Airbnb 모바일).
 * 1056+: 목록 | 지도 1:1, 카드에 올리면 핀이 커지고 지도를 움직이면 「이 지역에서 검색」.
 */
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
        sort: params.get("sort") ?? "name",
        near: params.get("near") === "1",
        mode: params.get("mode") ?? "list",
    });
    const values = parsed.success
        ? parsed.data
        : arcadeDiscoverySchema.parse({});
    const {
        origin,
        bounds,
        selectedId,
        expandedId,
        setOrigin,
        setBounds,
        select,
        expand,
    } = useArcadeSession();
    // 지도를 그 핀으로 옮기라는 요청 — seq 로 같은 카드를 다시 눌러도 다시 옮긴다
    const [focusRequest, setFocusRequest] = useState<{
        id: number;
        seq: number;
        afterMapMode?: boolean;
    } | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const popover = useMediaQuery("(min-width: 672px)");
    // 1056+ 는 지도가 목록 옆에 늘 보인다. 그 아래 폭은 시트가 지도를 덮을 수 있어 「지도에서 보기」 를 준다
    const sideBySide = useMediaQuery("(min-width: 1056px)");
    const [locationState, setLocationState] = useState<
        "idle" | "requesting" | "denied" | "error"
    >("idle");
    const [now, setNow] = useState(() => new Date());
    const listRef = useRef<HTMLUListElement>(null);
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
    const runningCount = result.filter(
        (arcade) => arcadeCabinetSummary(arcade).available > 0
    ).length;
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
    const filterCount =
        Number(values.open) +
        Number(values.available) +
        Number(!!values.region) +
        Number(values.near);
    const sorts = SORTS.map((value) => ({
        value,
        label: t(`arcades.sort.${value}`),
    }));

    function commit(next: ArcadeDiscoveryValues) {
        const query = new URLSearchParams();
        if (next.q) query.set("q", next.q);
        if (next.region) query.set("region", next.region);
        if (next.open) query.set("open", "1");
        if (next.available) query.set("available", "1");
        if (next.sort !== "name") query.set("sort", next.sort);
        if (next.near) query.set("near", "1");
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
        if (open) form.reset(values);
        setFilterOpen(open);
    }
    // 내 주변만 보기·가까운 순 — 위치 권한을 받아 origin 을 잡고, 성공했을 때만 켠다
    // URL 로 들고 들어왔는데 위치가 없으면 한 번 요청한다 (실패하면 켜진 상태만 남고 거리 정렬은 빠진다)
    const requestedFromUrl = useRef(false);
    useEffect(() => {
        if (
            (!values.near && values.sort !== "distance") ||
            origin ||
            requestedFromUrl.current
        )
            return;
        requestedFromUrl.current = true;
        nearby(() => undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.near, values.sort, origin]);
    function nearby(onSuccess: () => void) {
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
                onSuccess();
            },
            (error) =>
                setLocationState(
                    error.code === error.PERMISSION_DENIED ? "denied" : "error"
                ),
            { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 }
        );
    }
    // 지도 핀에서 고르면 목록의 그 카드를 펼치고 보이게 — 카드 hover 로 고를 때는 스크롤하지 않는다
    function selectFromMap(id: number) {
        select(id);
        expand(id);
        requestAnimationFrame(() =>
            listRef.current
                ?.querySelector<HTMLElement>(`[data-arcade-id="${id}"]`)
                ?.scrollIntoView({ block: "nearest", behavior: "smooth" })
        );
    }
    // 카드를 누르면 펼치고 지도를 그 핀으로. 펼친 카드를 다시 누르면 접기만 한다
    function toggleCard(id: number) {
        if (expandedId === id) {
            expand(null);
            return;
        }
        select(id);
        expand(id);
        setFocusRequest((current) => ({ id, seq: (current?.seq ?? 0) + 1 }));
    }
    // Compact·Intermediate — 전체 지도 모드로 바꾸고 그 핀을 골라 옮긴다(지도 아래 미리보기 카드).
    // 옮기기는 지도가 전체 높이로 그려진 뒤에 — 모드가 URL 로 반영되기 전에 옮기면 옛 높이 기준으로 가운데가 잡힌다
    function showOnMap(id: number) {
        select(id);
        setFocusRequest((current) => ({
            id,
            seq: (current?.seq ?? 0) + 1,
            afterMapMode: true,
        }));
        commit({ ...values, mode: "map" });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    const mapFocus =
        focusRequest?.afterMapMode && values.mode !== "map"
            ? null
            : focusRequest;
    function clearFilters() {
        return {
            ...values,
            region: "",
            open: false,
            available: false,
            near: false,
        };
    }
    const tokens = [
        values.near
            ? {
                  key: "near",
                  label: t("arcades.nearMe"),
                  onRemove: () => commit({ ...values, near: false }),
              }
            : null,
        values.region
            ? {
                  key: "region",
                  label: values.region,
                  onRemove: () => commit({ ...values, region: "" }),
              }
            : null,
        values.open
            ? {
                  key: "open",
                  label: t("arcades.openFilter"),
                  onRemove: () => commit({ ...values, open: false }),
              }
            : null,
        values.available
            ? {
                  key: "available",
                  label: t("arcades.availableFilter"),
                  onRemove: () => commit({ ...values, available: false }),
              }
            : null,
    ]
        .filter((token) => token !== null)
        .map((token) => ({
            ...token,
            removeLabel: t("discovery.removeCondition", {
                condition: token.label,
            }),
        }));
    return (
        <PageContainer className="nl-arcades" data-mode={values.mode}>
            <div className="nl-arcades__head">
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
                    <div
                        className={
                            popover
                                ? "nl-filter-toolbar"
                                : "nl-filter-toolbar nl-filter-toolbar--split"
                        }
                    >
                        <SortMenu
                            label={t("discovery.sortLabel")}
                            value={values.sort}
                            options={sorts}
                            onValueChange={(sort) => {
                                const apply = () => commit({ ...values, sort });
                                if (sort === "distance" && !origin)
                                    nearby(apply);
                                apply();
                            }}
                        />
                        <FilterSurface
                            popover={popover}
                            open={filterOpen}
                            onOpenChange={setFilterLayer}
                            title={t("arcades.filters")}
                            trigger={
                                <ActionButton
                                    variant="secondary"
                                    className="nl-filter-trigger"
                                    aria-label={t("arcades.filters")}
                                >
                                    <ListFilter
                                        className="nl-icon-small"
                                        aria-hidden
                                    />
                                    {t("arcades.filters")}
                                    {filterCount ? (
                                        <span className="nl-filter-count nl-metadata">
                                            {filterCount}
                                        </span>
                                    ) : null}
                                    <ChevronDown
                                        className="nl-icon-small"
                                        aria-hidden
                                    />
                                </ActionButton>
                            }
                            headerAction={
                                <ActionButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        form.reset(clearFilters());
                                        if (popover) commit(clearFilters());
                                    }}
                                >
                                    {t("common.reset")}
                                </ActionButton>
                            }
                            footer={
                                <ActionButton
                                    className="nl-arcades__apply"
                                    onClick={form.handleSubmit((next) => {
                                        commit(next);
                                        setFilterOpen(false);
                                    })}
                                >
                                    {t("arcades.viewResults", {
                                        count: draftResult.length,
                                    })}
                                </ActionButton>
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
                                <FilterGroup label={t("arcades.status")}>
                                    <FilterChips
                                        label={t("arcades.status")}
                                        value={[
                                            ...(draft.open
                                                ? ["open" as const]
                                                : []),
                                            ...(draft.available
                                                ? ["available" as const]
                                                : []),
                                        ]}
                                        onValueChange={(chosen) => {
                                            const next = {
                                                open: chosen.includes("open"),
                                                available:
                                                    chosen.includes(
                                                        "available"
                                                    ),
                                            };
                                            form.setValue("open", next.open);
                                            form.setValue(
                                                "available",
                                                next.available
                                            );
                                            if (popover)
                                                commit({ ...values, ...next });
                                        }}
                                        options={[
                                            {
                                                value: "open",
                                                label: t("arcades.openFilter"),
                                            },
                                            {
                                                value: "available",
                                                label: t(
                                                    "arcades.availableFilter"
                                                ),
                                            },
                                        ]}
                                    />
                                </FilterGroup>
                                <FilterGroup label={t("arcades.region")}>
                                    <FilterChips
                                        label={t("arcades.nearMe")}
                                        value={
                                            draft.near ? ["near" as const] : []
                                        }
                                        onValueChange={(chosen) => {
                                            const near =
                                                chosen.includes("near");
                                            const apply = () => {
                                                form.setValue("near", near);
                                                if (popover)
                                                    commit({ ...values, near });
                                            };
                                            if (near && !origin) nearby(apply);
                                            else apply();
                                        }}
                                        options={[
                                            {
                                                value: "near",
                                                label: t(
                                                    locationState ===
                                                        "requesting"
                                                        ? "arcades.nearMeBusy"
                                                        : "arcades.nearMe"
                                                ),
                                                disabled:
                                                    locationState ===
                                                    "requesting",
                                            },
                                        ]}
                                    />
                                    <label className="nl-control nl-arcades__region">
                                        <span className="sr-only">
                                            {t("arcades.region")}
                                        </span>
                                        <Select
                                            {...form.register("region", {
                                                onChange: (event) => {
                                                    if (popover)
                                                        commit({
                                                            ...values,
                                                            region: event.target
                                                                .value,
                                                        });
                                                },
                                            })}
                                        >
                                            <option value="">
                                                {t("arcades.scope.nationwide")}
                                            </option>
                                            {regions.map((region) => (
                                                <option
                                                    value={region}
                                                    key={region}
                                                >
                                                    {region}
                                                </option>
                                            ))}
                                        </Select>
                                    </label>
                                </FilterGroup>
                            </form>
                        </FilterSurface>
                    </div>
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
            </div>
            <div className="nl-arcades__results">
                <div className="nl-arcades__map-region">
                    <ArcadeDiscoveryMap
                        inlineError
                        appKey={appKey}
                        arcades={result}
                        selectedId={selectedId}
                        focusRequest={mapFocus}
                        // 넓은 화면에서 목록 옆 지도 전용 영역 — 휠로 확대·축소(상세 위치 지도는 페이지 스크롤이 걸려 끔)
                        wheelZoom
                        onSelect={selectFromMap}
                        onSearchArea={setBounds}
                        onExpand={
                            values.mode === "list"
                                ? () => commit({ ...values, mode: "map" })
                                : undefined
                        }
                    />
                    {/* 전체 지도 모드(Compact)에서만 — 고른 핀의 카드를 지도 아래에 띄운다 */}
                    {selected && values.mode === "map" ? (
                        <div className="nl-arcades__preview">
                            <ArcadeResultCard
                                preview
                                arcade={selected}
                                distance={arcadeDistance(selected, origin)}
                                now={now}
                                selected
                                expanded
                                onSelect={select}
                            />
                        </div>
                    ) : null}
                </div>
                <div className="nl-arcades__catalog">
                    <span className="nl-arcades__handle" aria-hidden />
                    <p
                        className="nl-arcades__summary nl-body-secondary nl-muted"
                        role="status"
                    >
                        {t("arcades.resultsSummary", {
                            count: result.length,
                            verified: runningCount,
                        })}
                    </p>
                    <AppliedTokens
                        label={t("arcades.filters")}
                        clearLabel={t("discovery.clearFilters")}
                        onClear={() => commit(clearFilters())}
                        tokens={tokens}
                    />
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
                            ref={listRef}
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
                                        now={now}
                                        selected={arcade.id === selectedId}
                                        expanded={arcade.id === expandedId}
                                        onSelect={select}
                                        onToggle={toggleCard}
                                        onShowOnMap={
                                            sideBySide ? undefined : showOnMap
                                        }
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
