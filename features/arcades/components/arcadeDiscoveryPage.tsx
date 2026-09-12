"use client";

import {
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import type { CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ListFilter } from "lucide-react";
import PageContainer, { PageHeading } from "@/components/layout/pageContainer";
import FooterLinks from "@/components/layout/footerLinks";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
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
// 시트 끌기 — 이만큼 움직여야 끌기로 본다(그 전엔 탭) · 이만큼 끌고 놓으면 그 방향 단계로 ·
// 올린 목록을 맨 위에서 당길 때는 스크롤과 헷갈리지 않게 더 길게
const SHEET_SLOP = 8;
const SHEET_DRAG = 24;
const SHEET_PULL = 48;
// 내린 시트에서 첫 카드 아래 여백 — compact component inset
const SHEET_PEEK_INSET = 16;

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
    const parsed = arcadeDiscoverySchema.safeParse({
        q: params.get("q") ?? "",
        region: params.get("region") ?? "",
        open: params.get("open") === "1",
        available: params.get("available") === "1",
        sort: params.get("sort") ?? "name",
        near: params.get("near") === "1",
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
    } | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const popover = useMediaQuery("(min-width: 672px)");
    // 1056+ 는 지도가 목록 옆에 늘 보인다. 그 아래 폭은 시트가 지도를 덮을 수 있어 「지도에서 보기」 를 준다
    const sideBySide = useMediaQuery("(min-width: 1056px)");
    const [mapState, setMapState] = useState<"loading" | "ready" | "error">(
        "loading"
    );
    const sheetLayout = !sideBySide && mapState !== "error";
    const [sheet, setSheet] = useState<"collapsed" | "expanded">("collapsed");
    const [peek, setPeek] = useState<number | null>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const catalogRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const bodyId = useId();
    const gesture = useRef<{
        startY: number;
        from: number;
        range: number;
        threshold: number;
        active: boolean;
    } | null>(null);
    const suppressClick = useRef(false);
    const pointerHandled = useRef(false);
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
    // 지도 핀에서 고르면 시트를 올리고 목록의 그 카드를 펼쳐 보이게 — 카드 hover 로 고를 때는 스크롤하지 않는다
    function selectFromMap(id: number) {
        select(id);
        expand(id);
        if (sheetLayout) setSheet("expanded");
        requestAnimationFrame(() =>
            listRef.current
                ?.querySelector<HTMLElement>(`[data-arcade-id="${id}"]`)
                ?.scrollIntoView({ block: "nearest", behavior: "smooth" })
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
    // 시트 끌기 — 끄는 동안은 transition 을 끄고 손가락 위치로 옮긴다. 놓으면 인라인 위치를 지워
    // CSS transition 이 그 자리에서 가까운 단계(끈 방향)로 이어서 움직인다
    function beginDrag(y: number, threshold: number) {
        const catalog = catalogRef.current;
        if (!sheetLayout || !catalog || peek === null) return;
        const range = catalog.offsetHeight - peek;
        gesture.current = {
            startY: y,
            from: sheet === "expanded" ? 0 : range,
            range,
            threshold,
            active: false,
        };
    }
    function moveDrag(y: number) {
        const drag = gesture.current;
        const catalog = catalogRef.current;
        if (!drag || !catalog) return false;
        const distance = y - drag.startY;
        if (!drag.active) {
            if (Math.abs(distance) < SHEET_SLOP) return false;
            drag.active = true;
            resultsRef.current?.setAttribute("data-dragging", "");
        }
        const offset = Math.min(drag.range, Math.max(0, drag.from + distance));
        catalog.style.transform = `translateY(${offset}px)`;
        return true;
    }
    function endDrag(y: number | null) {
        const drag = gesture.current;
        gesture.current = null;
        if (!drag?.active) return false;
        resultsRef.current?.removeAttribute("data-dragging");
        if (catalogRef.current) catalogRef.current.style.transform = "";
        if (y !== null && Math.abs(y - drag.startY) >= drag.threshold)
            setSheet(y < drag.startY ? "expanded" : "collapsed");
        return true;
    }
    function toggleSheet() {
        setSheet((current) =>
            current === "expanded" ? "collapsed" : "expanded"
        );
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
    // 내린 시트 높이 = 손잡이 · 요약 줄 · (적용 조건) · 첫 카드 요약 + 아래 16 — 내용에서 잰다.
    // 첫 카드가 펼쳐져 있어도 요약 줄까지만 재서 지도 높이가 카드 펼침에 따라 흔들리지 않는다
    useLayoutEffect(() => {
        if (!sheetLayout) return;
        const catalog = catalogRef.current;
        const body = bodyRef.current;
        if (!catalog || !body) return;
        const anchor = body.querySelector<HTMLElement>(
            ".nl-arcades__list > li:first-child .nl-arcade-result__summary, [data-sheet-peek]"
        );
        if (!anchor) return;
        const measure = () =>
            setPeek(
                Math.ceil(
                    anchor.getBoundingClientRect().bottom +
                        body.scrollTop -
                        catalog.getBoundingClientRect().top +
                        SHEET_PEEK_INSET
                )
            );
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(catalog);
        observer.observe(anchor);
        return () => observer.disconnect();
    }, [sheetLayout, result.length, tokens.length, bounds]);
    return (
        <PageContainer
            className="nl-arcades"
            data-sheet-layout={mapState !== "error" || undefined}
            data-sheet={sheet}
            style={
                peek === null
                    ? undefined
                    : ({ "--nl-sheet-peek": `${peek}px` } as CSSProperties)
            }
        >
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
            <div ref={resultsRef} className="nl-arcades__results">
                <div className="nl-arcades__map-region">
                    <ArcadeDiscoveryMap
                        inlineError
                        appKey={appKey}
                        arcades={result}
                        selectedId={selectedId}
                        focusRequest={focusRequest}
                        // 지도 전용 영역 — 휠·두 손가락으로 확대·축소(버튼 없음). 상세 위치 지도는 페이지 스크롤이 걸려 휠을 끔
                        wheelZoom
                        zoomControls={false}
                        onSelect={selectFromMap}
                        onSearchArea={setBounds}
                        onStateChange={setMapState}
                    />
                </div>
                <div ref={catalogRef} className="nl-arcades__catalog">
                    <div className="nl-arcades__sheet-head">
                        {/* 손잡이 줄 전체가 누르는 자리 — 탭하면 올리고 내리고, 끌면 시트가 따라오고 놓으면 그 방향 단계로 */}
                        <button
                            type="button"
                            className="nl-arcades__sheet-toggle"
                            aria-label={t("arcades.list")}
                            aria-expanded={sheet === "expanded"}
                            aria-controls={bodyId}
                            onPointerDown={(event) => {
                                pointerHandled.current = false;
                                event.currentTarget.setPointerCapture(
                                    event.pointerId
                                );
                                beginDrag(event.clientY, SHEET_DRAG);
                            }}
                            onPointerMove={(event) => moveDrag(event.clientY)}
                            // 탭·끌기는 손을 뗄 때 처리한다 — 쓸어 올린 직후의 탭은 브라우저가 클릭을 만들지 않을 때가 있다
                            onPointerUp={(event) => {
                                pointerHandled.current = true;
                                if (!endDrag(event.clientY)) toggleSheet();
                            }}
                            onPointerCancel={() => endDrag(null)}
                            // 키보드(Enter · Space)는 포인터 없이 클릭만 온다. 포인터로 이미 처리한 클릭은 건너뛴다
                            onClick={() => {
                                if (pointerHandled.current) {
                                    pointerHandled.current = false;
                                    return;
                                }
                                toggleSheet();
                            }}
                        />
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
                    </div>
                    <div
                        ref={bodyRef}
                        id={bodyId}
                        className="nl-arcades__sheet-body"
                        // 내린 시트 안으로 포커스가 들어오면(키보드) 가려진 카드가 보이게 올린다
                        onFocusCapture={() => {
                            if (sheetLayout && sheet === "collapsed")
                                setSheet("expanded");
                        }}
                        // 내린 시트는 몸 어디를 끌어도 시트가 따라온다(내린 동안 목록은 스크롤하지 않는다)
                        onPointerDown={(event) => {
                            suppressClick.current = false;
                            if (sheet === "collapsed")
                                beginDrag(event.clientY, SHEET_DRAG);
                        }}
                        onPointerMove={(event) => {
                            if (sheet !== "collapsed") return;
                            const target = event.currentTarget;
                            if (
                                moveDrag(event.clientY) &&
                                !target.hasPointerCapture(event.pointerId)
                            )
                                target.setPointerCapture(event.pointerId);
                        }}
                        onPointerUp={(event) => {
                            if (sheet === "collapsed" && endDrag(event.clientY))
                                suppressClick.current = true;
                        }}
                        onPointerCancel={() => {
                            if (sheet === "collapsed") endDrag(null);
                        }}
                        // 끌고 놓은 손가락이 카드를 누른 것으로 이어지지 않게
                        onClickCapture={(event) => {
                            if (!suppressClick.current) return;
                            suppressClick.current = false;
                            event.preventDefault();
                            event.stopPropagation();
                        }}
                        // 올린 목록은 맨 위에서 아래로 당길 때만 시트가 따라 내려온다(그 밖에는 목록 스크롤)
                        onTouchStart={(event) => {
                            if (
                                sheet === "expanded" &&
                                event.currentTarget.scrollTop <= 0
                            )
                                beginDrag(event.touches[0].clientY, SHEET_PULL);
                        }}
                        onTouchMove={(event) => {
                            const drag = gesture.current;
                            if (sheet !== "expanded" || !drag) return;
                            const y = event.touches[0].clientY;
                            if (
                                event.currentTarget.scrollTop > 0 ||
                                (!drag.active && y < drag.startY)
                            ) {
                                endDrag(null);
                                gesture.current = null;
                                return;
                            }
                            moveDrag(y);
                        }}
                        onTouchEnd={(event) => {
                            if (sheet === "expanded")
                                endDrag(event.changedTouches[0].clientY);
                        }}
                        onTouchCancel={() => {
                            if (sheet === "expanded") endDrag(null);
                        }}
                    >
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
                                                sheetLayout
                                                    ? showOnMap
                                                    : undefined
                                            }
                                        />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="nl-body nl-muted" data-sheet-peek>
                                {t("arcades.noResults")}
                            </p>
                        )}
                        {/* 시트 배치에서는 페이지가 스크롤되지 않아 셸 푸터 대신 목록 끝에 같은 푸터를 둔다 */}
                        <div className="nl-arcades__footer">
                            <FooterLinks
                                privacyHref={href("/privacy")}
                                privacyLabel={t("footer.privacy")}
                                externalLabel={t("shell.externalLink")}
                                notice={t("shell.serviceNotice")}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
