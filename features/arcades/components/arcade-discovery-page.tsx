"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ListFilter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import FooterLinks from "@/components/layout/footer-links";
import PageContainer, { PageHeading } from "@/components/layout/page-container";
import ActionButton from "@/components/ui/action-button";
import AppliedTokens from "@/components/ui/applied-tokens";
import Button from "@/components/ui/button";
import FilterChips from "@/components/ui/filter-chips";
import FilterGroup from "@/components/ui/filter-group";
import FilterSurface from "@/components/ui/filter-surface";
import SearchField from "@/components/ui/search-field";
import { Select } from "@/components/ui/select";
import SortMenu from "@/components/ui/sort-menu";
import { StatusMessage } from "@/components/ui/status-message";
import {
    arcadeCabinetSummary,
    arcadeDistance,
    selectArcades,
} from "@/features/arcades/arcade-discovery";
import { useArcadeSession } from "@/features/arcades/hooks/use-arcade-session";
import type {
    ArcadeDiscoveryValues,
    PublicArcade,
} from "@/features/arcades/schemas/public-arcade-schema";
import { arcadeDiscoverySchema } from "@/features/arcades/schemas/public-arcade-schema";
import useMediaQuery from "@/lib/hooks/use-media-query";

import ArcadeDiscoveryMap from "./arcade-discovery-map";
import ArcadeMapSheet from "./arcade-map-sheet";
import ArcadeResultCard from "./arcade-result-card";

const SORTS = ["distance", "name", "preferred"] as const;

/**
 * 오락실 찾기 — 지도와 목록이 한 집합이다.
 * 1056 미만: 페이지는 화면 높이에 고정되고(스크롤 없음) 지도가 남은 높이를 채운다.
 * 목록은 시트 — 내림(손잡이 · 요약 줄 · 첫 카드) / 올림(지도 위쪽 끝까지), 시트 안에서만 스크롤한다.
 * 끄는 동안 시트가 손가락을 따라오고, 놓거나 탭하면 그 단계로 움직여 멈춘다.
 * 지도가 못 뜨면 보통 흐름으로 돌아간다.
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
    const href = useLocalizedHref();
    const params = useSearchParams();
    const values = useMemo(() => {
        const parsed = arcadeDiscoverySchema.safeParse({
            q: params.get("q") ?? "",
            region: params.get("region") ?? "",
            open: params.get("open") === "1",
            available: params.get("available") === "1",
            sort: params.get("sort") ?? "name",
            near: params.get("near") === "1",
        });
        return parsed.success ? parsed.data : arcadeDiscoverySchema.parse({});
    }, [params]);
    // 검색어는 입력 칸이 직접 든다 — URL 을 거쳐 되받으면 한 박자 늦은 값이 덮여 한글 조합이 끊긴다(「ㅉ짜짱ㄱ구」).
    // URL 반영은 조합이 끝났을 때만. 뒤로가기처럼 밖에서 바뀐 검색어만 입력 칸으로 받아 온다
    const [search, setSearch] = useState(values.q);
    const [committedQuery, setCommittedQuery] = useState(values.q);
    const composing = useRef(false);
    if (values.q !== committedQuery) {
        setCommittedQuery(values.q);
        setSearch(values.q);
    }
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
    } | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);
    // 카드에 올리거나 키 포커스한 동안만 강조하는 핀(고름과 따로)
    const [highlightedId, setHighlightedId] = useState<number | null>(null);
    const popover = useMediaQuery("(min-width: 672px)");
    // 1056+ 는 지도가 목록 옆에 늘 보인다. 그 아래 폭은 시트가 지도를 덮을 수 있어 「지도에서 보기」 를 준다
    const sideBySide = useMediaQuery("(min-width: 1056px)");
    const [mapState, setMapState] = useState<"loading" | "ready" | "error">(
        "loading"
    );
    const sheetLayout = !sideBySide && mapState !== "error";
    const [sheet, setSheet] = useState<"collapsed" | "expanded">("collapsed");
    const bodyRef = useRef<HTMLDivElement>(null);
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
    const result = useMemo(
        () => selectArcades(arcades, values, locale, origin, bounds, now),
        [arcades, values, locale, origin, bounds, now]
    );
    const draftResult = useMemo(
        () =>
            filterOpen
                ? selectArcades(
                      arcades,
                      arcadeDiscoverySchema.parse(draft),
                      locale,
                      origin,
                      bounds,
                      now
                  )
                : result,
        [filterOpen, arcades, draft, locale, origin, bounds, now, result]
    );
    const runningCount = useMemo(
        () =>
            result.filter(
                (arcade) => arcadeCabinetSummary(arcade).available > 0
            ).length,
        [result]
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
        // Next's History integration adds its own route state. Copying that
        // internal state here bypasses its search-param update notification.
        window.history.replaceState(
            {},
            "",
            `${window.location.pathname}${query.size ? `?${query}` : ""}`
        );
    }
    function commitSearch(q: string) {
        setSearch(q);
        setCommittedQuery(q);
        commit({ ...values, q });
    }
    function setFilterLayer(open: boolean) {
        if (open) form.reset(values);
        setFilterOpen(open);
    }
    // 내 주변만 보기·가까운 순 — 위치 권한을 받아 origin 을 잡고, 성공했을 때만 켠다
    // URL 로 들고 들어왔는데 위치가 없으면 한 번 요청한다 (실패하면 켜진 상태만 남고 거리 정렬은 빠진다)
    const requestedFromUrl = useRef(false);
    const requestNearbyFromUrl = useEffectEvent(() => nearby(() => undefined));
    useEffect(() => {
        if (
            (!values.near && values.sort !== "distance") ||
            origin ||
            requestedFromUrl.current
        )
            return;
        requestedFromUrl.current = true;
        requestNearbyFromUrl();
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
    // 지도 핀에서 고르면 시트를 올리고 목록의 그 카드를 펼쳐 보이게
    function changeSort(sort: ArcadeDiscoveryValues["sort"]) {
        const apply = () => commit({ ...values, sort });
        if (sort === "distance" && !origin) nearby(apply);
        apply();
    }
    function selectFromMap(id: number) {
        select(id);
        expand(id);
        if (sheetLayout) setSheet("expanded");
        requestAnimationFrame(() =>
            listRef.current
                ?.querySelector<HTMLElement>(`[data-arcade-id="${id}"]`)
                ?.scrollIntoView({ block: "nearest" })
        );
    }
    // 카드를 누르면 펼치고 지도를 그 핀으로(내린 시트면 올려서 펼친 칸이 보이게). 펼친 카드를 다시 누르면 접기만 한다
    function toggleCard(id: number) {
        if (expandedId === id) {
            expand(null);
            return;
        }
        select(id);
        expand(id);
        if (sheetLayout) setSheet("expanded");
        setFocusRequest((current) => ({ id, seq: (current?.seq ?? 0) + 1 }));
    }
    // 1056 미만 — 시트를 내려 지도를 보이고 그 핀으로 옮긴다. 내린 시트에는 그 카드가 보이게 목록을 그 카드부터
    function showOnMap(id: number) {
        select(id);
        setSheet("collapsed");
        setFocusRequest((current) => ({ id, seq: (current?.seq ?? 0) + 1 }));
        requestAnimationFrame(() => {
            const body = bodyRef.current;
            const card = listRef.current?.querySelector<HTMLElement>(
                `[data-arcade-id="${id}"]`
            );
            if (body && card)
                body.scrollTop +=
                    card.getBoundingClientRect().top -
                    body.getBoundingClientRect().top;
        });
    }
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
        <PageContainer
            className="nl-arcades"
            data-sheet-layout={mapState !== "error" || undefined}
            data-sheet={sheet}
        >
            {/* 검색줄 옆 필터 자리는 CSS 미디어 쿼리가 아니라 같은 판정(popover)으로 — 둘이 엇갈리면 세 개가 한 줄에 낀다 */}
            <div
                className="nl-arcades__head"
                data-compact={popover ? undefined : ""}
            >
                <PageHeading title={t("arcades.title")} />
                <SearchField
                    value={search}
                    maxLength={200}
                    aria-label={t("arcades.search")}
                    placeholder={t("arcades.searchPlaceholder")}
                    clearLabel={t("discovery.clearQuery")}
                    onClear={() => commitSearch("")}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        if (!composing.current)
                            commitSearch(event.target.value);
                    }}
                    onCompositionStart={() => {
                        composing.current = true;
                    }}
                    onCompositionEnd={(event) => {
                        composing.current = false;
                        commitSearch(event.currentTarget.value);
                    }}
                />
                {/* 672 미만: 필터는 검색줄 오른쪽 아이콘 버튼, 정렬은 시트 요약 줄 — 지도가 한 줄 더 보인다(2026-09-15).
                    672 이상은 다른 목록과 같은 정렬 · 필터 툴바 */}
                <div className="nl-arcades__controls">
                    <div className="nl-filter-toolbar">
                        {popover ? (
                            <SortMenu
                                label={t("discovery.sortLabel")}
                                value={values.sort}
                                options={sorts}
                                onValueChange={changeSort}
                            />
                        ) : null}
                        <FilterSurface
                            popover={popover}
                            open={filterOpen}
                            onOpenChange={setFilterLayer}
                            title={t("arcades.filters")}
                            trigger={
                                popover ? (
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
                                ) : (
                                    <ActionButton
                                        variant="secondary"
                                        size="icon"
                                        className="nl-filter-icon-trigger"
                                        aria-label={t("arcades.filters")}
                                    >
                                        <ListFilter
                                            className="nl-icon"
                                            aria-hidden
                                        />
                                        {filterCount ? (
                                            <span className="nl-filter-count nl-metadata">
                                                {filterCount}
                                            </span>
                                        ) : null}
                                    </ActionButton>
                                )
                            }
                            onReset={() => {
                                form.reset(clearFilters());
                                if (popover) commit(clearFilters());
                            }}
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
                                    <div className="nl-control nl-arcades__region">
                                        <Controller
                                            control={form.control}
                                            name="region"
                                            render={({ field }) => (
                                                <Select
                                                    aria-label={t(
                                                        "arcades.region"
                                                    )}
                                                    value={field.value ?? ""}
                                                    onValueChange={(region) => {
                                                        field.onChange(region);
                                                        if (popover)
                                                            commit({
                                                                ...values,
                                                                region,
                                                            });
                                                    }}
                                                    onBlur={field.onBlur}
                                                    triggerRef={field.ref}
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: t(
                                                                "arcades.scope.nationwide"
                                                            ),
                                                        },
                                                        ...regions.map(
                                                            (region) => ({
                                                                value: region,
                                                                label: region,
                                                            })
                                                        ),
                                                    ]}
                                                />
                                            )}
                                        />
                                    </div>
                                </FilterGroup>
                            </form>
                        </FilterSurface>
                    </div>
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
            <ArcadeMapSheet
                sheetLayout={sheetLayout}
                sheet={sheet}
                onSheetChange={setSheet}
                toggleLabel={t("arcades.list")}
                peekSelector=".nl-arcades__list > li:first-child .nl-arcade-result__summary, [data-sheet-peek]"
                measureKey={`${result.length}-${tokens.length}-${bounds ? "b" : ""}`}
                bodyRef={bodyRef}
                map={
                    <ArcadeDiscoveryMap
                        inlineError
                        appKey={appKey}
                        arcades={result}
                        selectedId={selectedId}
                        highlightedId={highlightedId}
                        focusRequest={focusRequest}
                        // 지도 전용 영역 — 휠·두 손가락으로 확대·축소(버튼 없음). 상세 위치 지도는 페이지 스크롤이 걸려 휠을 끔
                        wheelZoom
                        onSelect={selectFromMap}
                        onSearchArea={setBounds}
                        onStateChange={setMapState}
                    />
                }
                head={
                    <div className="nl-arcades__summary-row">
                        <p
                            className="nl-arcades__summary nl-body-secondary nl-muted"
                            role="status"
                        >
                            {t("arcades.resultsSummary", {
                                count: result.length,
                                verified: runningCount,
                            })}
                        </p>
                        {popover ? null : (
                            <SortMenu
                                size="sm"
                                className="nl-arcades__sort"
                                label={t("discovery.sortLabel")}
                                value={values.sort}
                                options={sorts}
                                onValueChange={changeSort}
                            />
                        )}
                    </div>
                }
            >
                <AppliedTokens
                    label={t("arcades.filters")}
                    clearLabel={t("discovery.clearFilters")}
                    onClear={() => commit(clearFilters())}
                    tokens={tokens}
                />
                {bounds ? (
                    <Button
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
                        {result.map((arcade, index) => (
                            <li key={arcade.id}>
                                <ArcadeResultCard
                                    arcade={arcade}
                                    eagerPhoto={index === 0}
                                    distance={arcadeDistance(arcade, origin)}
                                    now={now}
                                    selected={arcade.id === selectedId}
                                    expanded={arcade.id === expandedId}
                                    onHighlight={setHighlightedId}
                                    onToggle={toggleCard}
                                    onShowOnMap={
                                        sheetLayout ? showOnMap : undefined
                                    }
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="nl-body-secondary nl-muted" data-sheet-peek>
                        {t("arcades.noResults")}
                    </p>
                )}
                {/* 시트 배치에서는 페이지가 스크롤되지 않아 셸 푸터 대신 목록 끝에 같은 푸터를 둔다 */}
                <div className="nl-arcades__footer">
                    <FooterLinks
                        termsHref={href("/terms")}
                        termsLabel={t("footer.terms")}
                        privacyHref={href("/privacy")}
                        privacyLabel={t("footer.privacy")}
                        externalLabel={t("shell.externalLink")}
                        notice={t("shell.serviceNotice")}
                    />
                </div>
            </ArcadeMapSheet>
        </PageContainer>
    );
}
