"use client";

import { LocateFixed } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

import { listMusecatArcadesAction } from "@/app/(site)/gamecenter/musecat-actions";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import PageContainer from "@/components/layout/page-container";
import ActionButton from "@/components/ui/action-button";
import FilterChips from "@/components/ui/filter-chips";
import Pagination from "@/components/ui/pagination";
import SearchField from "@/components/ui/search-field";
import { StatusMessage } from "@/components/ui/status-message";
import {
    findPlace,
    reverseGeocode,
} from "@/features/arcades/api/geocode-arcade-address";
import ArcadeDiscoveryMap from "@/features/arcades/components/arcade-discovery-map";
import ArcadeMapSheet, {
    type MapSheetState,
} from "@/features/arcades/components/arcade-map-sheet";
import type { ArcadeBounds } from "@/features/arcades/types/arcade-geography";
import MusecatListRow from "@/features/musecat/components/musecat-list-row";
import type { RequestOrigin } from "@/features/musecat/server/request-origin";
import useMediaQuery from "@/lib/hooks/use-media-query";

type ListResult = NonNullable<
    Awaited<ReturnType<typeof listMusecatArcadesAction>>
>;
/** 기준 위치 — 어디서 왔는지에 따라 캡션이 바뀐다(내 위치 = 가까운 순, 나머지 = 「○○ 기준」) */
interface Origin {
    lat: number;
    lon: number;
    label: string | null;
    source: "device" | "search" | "area" | "ip" | "default";
}
type Point = { latitude: number; longitude: number };

/** 마지막 기준 위치는 이 기기에만 — 주소 · 서버에 남기지 않는다 */
const LOCATION_KEY = "noslog.musecat.origin";

function readOrigin(): Origin | null {
    try {
        const raw = window.localStorage.getItem(LOCATION_KEY);
        if (!raw) return null;
        const value = JSON.parse(raw) as Origin;
        return Number.isFinite(value?.lat) && Number.isFinite(value?.lon)
            ? value
            : null;
    } catch {
        return null;
    }
}

function writeOrigin(origin: Origin) {
    try {
        window.localStorage.setItem(LOCATION_KEY, JSON.stringify(origin));
    } catch {
        // 저장이 막힌 브라우저 — 이번 방문에만 쓴다
    }
}

/**
 * 뮤즈캣 오락실 목록(2026-10-21 위치 정하기 안 A — 구글 지도 · 카카오맵 · 스타벅스 코리아 실측, Google Store Locator 모범 사례).
 * 목록은 바로 보인다: 처음 기준 = 이 기기의 마지막 위치 → 없으면 접속 지역(IP) → 서울.
 * 내 위치 = 지도 오른쪽 아래 조준선 하나(누를 때 권한, 바로 적용 · 확인 버튼 없음), 직접 고르기 = 검색칸 · 지도를 옮긴 뒤 「이 지역에서 검색」.
 * 거부되면 조준선에 사선 + 검색칸 아래 한 줄(색 상자 없음).
 * 배치(검색칸 자리 안 2 — 구글 지도 홈 · Bing · 다방 · 올리브영 / 스타벅스 코리아 · 이디야): 1056 미만은 지도가 화면을 채우고 검색이 지도 위에 떠 있으며
 * 목록은 오락실 찾기와 같은 아래 시트(공용 ArcadeMapSheet), 1056 이상은 화면 폭 지도 위에 왼쪽 패널(제목 · 검색 · 칩 · 목록). 값은 모두 토큰 · 공용 부품
 */
export default function MusecatArcadeListPage({
    appKey,
    initialOrigin,
}: {
    appKey: string;
    initialOrigin: RequestOrigin;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const [origin, setOrigin] = useState<Origin>({
        lat: initialOrigin.lat,
        lon: initialOrigin.lon,
        label: initialOrigin.city,
        source: initialOrigin.source,
    });
    const [locate, setLocate] = useState<"idle" | "busy" | "active" | "denied">(
        "idle"
    );
    const [locateError, setLocateError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [centerRequest, setCenterRequest] = useState<
        (Point & { seq: number }) | null
    >(null);
    const [country, setCountry] = useState<string | null>(null);
    const [region, setRegion] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [attempt, setAttempt] = useState(0);
    const [result, setResult] = useState<ListResult | null>(null);
    const [failed, setFailed] = useState(false);
    const [busy, startTransition] = useTransition();
    // 핀을 누르면 고르기(2026-10-21 전면 대조 ③) — 폰은 시트에 그 줄 하나, 넓은 화면은 패널에서 그 줄로. 줄을 누르면 상세
    const [selectedId, setSelectedId] = useState<number | null>(null);
    // 영업 상태 기준 시각 — 목록을 받은 뒤에만 그리므로 첫 그림과 어긋나지 않는다
    const [now] = useState(() => new Date());
    const seq = useRef(0);
    const bodyRef = useRef<HTMLDivElement>(null);
    // 안 2(2026-10-21 사용자) — 1056 미만은 지도 가득 + 위에 떠 있는 검색 + 아래 시트 목록, 1056 이상은 지도 위 왼쪽 패널
    const wide = useMediaQuery("(min-width: 1056px)");
    const [mapState, setMapState] = useState<"loading" | "ready" | "error">(
        "loading"
    );
    const sheetLayout = !wide && mapState !== "error";
    const [sheet, setSheet] = useState<MapSheetState>("collapsed");
    const regionNames = new Intl.DisplayNames([locale], { type: "region" });

    useEffect(() => {
        // 이 기기에 저장된 마지막 기준 위치가 있으면 그것부터(브라우저에만 있어 그린 뒤에 읽는다)
        const saved = readOrigin();
        if (saved) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOrigin(saved);
            seq.current += 1;
            setCenterRequest({
                latitude: saved.lat,
                longitude: saved.lon,
                seq: seq.current,
            });
        }
    }, []);

    useEffect(() => {
        startTransition(async () => {
            const next = await listMusecatArcadesAction({
                lat: origin.lat,
                lon: origin.lon,
                country,
                region,
                page,
            }).catch(() => null);
            setFailed(next === null);
            if (next) {
                setResult(next);
                setSelectedId(null);
            }
        });
    }, [origin, country, region, page, attempt]);

    function apply(next: Origin) {
        writeOrigin(next);
        setOrigin(next);
        setPage(1);
        seq.current += 1;
        setCenterRequest({
            latitude: next.lat,
            longitude: next.lon,
            seq: seq.current,
        });
    }
    // 조준선 — 누르는 순간 권한을 묻고, 받으면 바로 내 위치 · 가까운 순(Apple HIG · web.dev: 쓰려는 순간에 묻기)
    function locateMe() {
        if (locate === "busy") return;
        if (!navigator.geolocation || !window.isSecureContext) {
            setLocate("denied");
            setLocateError(t("musecat.list.locationError"));
            return;
        }
        setLocate("busy");
        setLocateError(null);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocate("active");
                apply({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                    label: null,
                    source: "device",
                });
            },
            (error) => {
                setLocate("denied");
                setLocateError(
                    t(
                        error.code === error.PERMISSION_DENIED
                            ? "musecat.list.locationDenied"
                            : "musecat.list.locationError"
                    )
                );
            },
            { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 }
        );
    }
    // 검색 — 고르면 바로 그 위치(확인 버튼 없음)
    async function search() {
        const text = query.trim();
        if (!text) return;
        setSearching(true);
        const point = await findPlace(appKey, text).catch(() => null);
        setSearching(false);
        if (!point) {
            setLocateError(t("musecat.list.searchFailed"));
            return;
        }
        setLocateError(null);
        if (locate === "active") setLocate("idle");
        apply({
            lat: point.latitude,
            lon: point.longitude,
            label: text,
            source: "search",
        });
    }
    // 지도를 옮긴 뒤 「이 지역에서 검색」 — 보이는 범위의 가운데를 기준으로
    async function searchArea(bounds: ArcadeBounds) {
        const lat = (bounds.north + bounds.south) / 2;
        const lon = (bounds.east + bounds.west) / 2;
        const label = await reverseGeocode(appKey, lat, lon).catch(() => null);
        if (locate === "active") setLocate("idle");
        apply({ lat, lon, label, source: "area" });
    }
    const distance = (km: number | null) =>
        km === null
            ? null
            : km < 1
              ? `${Math.round(km * 1000)}m`
              : `${km.toLocaleString(locale, { maximumFractionDigits: 1 })}km`;
    // 목록 위 「◎ 위치 ○○」 줄(2026-10-22 사용자 — 카카오맵 목록 그대로: 위치 라벨 + 지금 기준 위치, 개수 문장 없음)
    const place =
        origin.source === "device"
            ? t("musecat.list.whereDevice")
            : (origin.label ?? t("musecat.list.defaultPlace"));
    const countryEntries = result
        ? Object.entries(result.countryTotals).sort((a, b) => b[1] - a[1])
        : [];
    const items =
        result?.items.filter(
            (item) =>
                wide || selectedId === null || item.arcade.id === selectedId
        ) ?? [];
    function selectArcade(id: number) {
        setSelectedId(id);
        if (!wide) {
            setSheet("collapsed");
            return;
        }
        requestAnimationFrame(() =>
            bodyRef.current
                ?.querySelector(`[data-arcade-id="${id}"]`)
                ?.scrollIntoView({ block: "nearest" })
        );
    }
    const regionEntries = result
        ? Object.entries(result.regionTotals).sort((a, b) => b[1] - a[1])
        : [];

    const searchForm = (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                void search();
            }}
        >
            <SearchField
                floating={!wide}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onClear={() => setQuery("")}
                clearLabel={t("musecat.list.clear")}
                busy={searching}
                busyLabel={t("musecat.list.searching")}
                placeholder={t("musecat.list.searchPlaceholder")}
                aria-label={t("musecat.list.searchPlaceholder")}
            />
        </form>
    );
    const notice = locateError ? (
        <p className="nl-body-secondary nl-muted" role="status">
            {locateError}
        </p>
    ) : null;

    return (
        <PageContainer
            className="nl-arcades nl-musecat-arcades"
            data-sheet-layout={sheetLayout || undefined}
            data-sheet={sheet}
        >
            <h1 className="sr-only">{t("arcades.title")}</h1>
            <ArcadeMapSheet
                sheetLayout={sheetLayout}
                sheet={sheet}
                onSheetChange={setSheet}
                toggleLabel={t("musecat.list.sheet")}
                // 내린 시트는 줄 두 개까지(하나뿐이면 그 줄) — 2026-10-21 전면 대조 ③
                peekSelector=".nl-musecat-lines > li:nth-child(2), .nl-musecat-lines > li:only-child, [data-sheet-peek]"
                measureKey={`${items.length}-${regionEntries.length}-${countryEntries.length}-${locateError ?? ""}`}
                bodyRef={bodyRef}
                map={
                    <>
                        {wide ? null : (
                            <div className="nl-musecat-float">{searchForm}</div>
                        )}
                        <ArcadeDiscoveryMap
                            inlineError
                            appKey={appKey}
                            arcades={
                                result?.items.map((item) => item.arcade) ?? []
                            }
                            selectedId={selectedId}
                            wheelZoom={wide}
                            labels
                            onSelect={selectArcade}
                            onBackgroundClick={() => setSelectedId(null)}
                            onSearchArea={(bounds) => void searchArea(bounds)}
                            onStateChange={setMapState}
                            centerRequest={centerRequest}
                            locate={{ state: locate, onLocate: locateMe }}
                        />
                    </>
                }
                head={
                    <>
                        {wide ? searchForm : null}
                        {notice}
                        <p className="nl-musecat-where">
                            <LocateFixed
                                className="nl-icon-small"
                                aria-hidden
                            />
                            <span className="nl-emphasis-label nl-musecat-where__label">
                                {t("musecat.list.where")}
                            </span>
                            <span className="nl-body-secondary nl-musecat-where__value">
                                {place}
                            </span>
                        </p>
                    </>
                }
            >
                {/* 나라가 하나면 칩 줄을 두지 않는다 · 칩에 개수를 넣지 않는다(요약 줄 하나로) */}
                {countryEntries.length > 1 ? (
                    <FilterChips
                        label={t("musecat.list.countries")}
                        row
                        multiple={false}
                        value={[country ?? "all"]}
                        onValueChange={(values) => {
                            const next = values[0];
                            setCountry(!next || next === "all" ? null : next);
                            setRegion(null);
                            setPage(1);
                        }}
                        options={[
                            { value: "all", label: t("musecat.list.all") },
                            ...countryEntries.map(([code]) => ({
                                value: code,
                                label: regionNames.of(code) ?? code,
                            })),
                        ]}
                    />
                ) : null}
                {regionEntries.length > 1 ? (
                    <FilterChips
                        label={t("musecat.list.regions")}
                        row
                        multiple={false}
                        value={region ? [region] : []}
                        onValueChange={(values) => {
                            setRegion(
                                values[0] && values[0] !== region
                                    ? values[0]
                                    : null
                            );
                            setPage(1);
                        }}
                        options={regionEntries.map(([name]) => ({
                            value: name,
                            label: name,
                        }))}
                    />
                ) : null}
                {failed ? (
                    <div data-sheet-peek>
                        <StatusMessage
                            severity="info"
                            tone="quiet"
                            title={t("musecat.list.failed")}
                            action={
                                <ActionButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        setAttempt((value) => value + 1)
                                    }
                                >
                                    {t("musecat.list.retry")}
                                </ActionButton>
                            }
                        />
                    </div>
                ) : null}
                {result && items.length ? (
                    <section className="nl-musecat-section" aria-busy={busy}>
                        <ul className="nl-musecat-lines">
                            {items.map((item) => (
                                <li key={item.arcade.id}>
                                    <MusecatListRow
                                        arcade={item.arcade}
                                        href={href(
                                            `/gamecenter/${item.arcade.slug}`
                                        )}
                                        distance={
                                            origin.source === "device"
                                                ? distance(item.distanceKm)
                                                : null
                                        }
                                        nostalgiaCount={item.nostalgiaCount}
                                        openFlags={item.openFlags}
                                        closed={item.closed}
                                        selected={item.arcade.id === selectedId}
                                        now={now}
                                    />
                                </li>
                            ))}
                        </ul>
                        {selectedId !== null && !wide ? null : (
                            <Pagination
                                page={result.page}
                                totalPages={result.lastPage}
                                onPageChange={(value) => {
                                    setPage(value);
                                    // 쪽을 넘기면 목록 맨 위부터
                                    bodyRef.current?.scrollTo({ top: 0 });
                                }}
                                busy={busy}
                                label={t("musecat.list.pages")}
                                pageLabel={(value) =>
                                    t("musecat.list.page", { page: value })
                                }
                                previousLabel={t("musecat.list.previous")}
                                nextLabel={t("musecat.list.next")}
                            />
                        )}
                    </section>
                ) : result && !busy && !failed ? (
                    <p className="nl-body-secondary nl-muted" data-sheet-peek>
                        {t("musecat.list.empty")}
                    </p>
                ) : null}
            </ArcadeMapSheet>
        </PageContainer>
    );
}
