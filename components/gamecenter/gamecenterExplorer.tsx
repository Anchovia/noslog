"use client";

import {
    Check,
    ChevronDown,
    ExternalLink,
    MapPin,
    Search,
    Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { setPreferredArcade } from "@/app/(nevigation)/gamecenter/actions";
import Button from "@/components/ui/Button";
import {
    ARCADE_MACHINE_STATUS_META,
    isArcadeMachineStatus,
} from "@/lib/arcadeDetails";

import ArcadeBubbleMap from "./arcadeBubbleMap";
import ArcadeBusinessHours from "./arcadeBusinessHours";
import ArcadeMiniMap from "./arcadeMiniMap";

export interface GamecenterArcade {
    id: number;
    name: string;
    region: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    machineCount: number | null;
    priceInfo: string | null;
    businessHours: unknown;
    machineStatus: string;
    statusNote: string | null;
    notes: string | null;
    preferredCount: number;
}

interface GamecenterExplorerProps {
    appKey: string;
    arcades: GamecenterArcade[];
    isAuthenticated: boolean;
    initialPreferredArcadeId: number | null;
}

function kakaoMapUrl(arcade: GamecenterArcade) {
    if (arcade.latitude === null || arcade.longitude === null) return null;
    return `https://map.kakao.com/link/map/${encodeURIComponent(arcade.name)},${arcade.latitude},${arcade.longitude}`;
}

export default function GamecenterExplorer({
    appKey,
    arcades,
    isAuthenticated,
    initialPreferredArcadeId,
}: GamecenterExplorerProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [openArcadeId, setOpenArcadeId] = useState<number | null>(null);
    const [preferredArcadeId, setPreferredArcadeId] = useState(
        initialPreferredArcadeId
    );
    const [notice, setNotice] = useState<{
        arcadeId: number;
        message: string;
        success: boolean;
    } | null>(null);
    const [isPending, startTransition] = useTransition();

    const filteredArcades = useMemo(() => {
        const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");
        if (!normalizedQuery) return arcades;
        return arcades.filter((arcade) =>
            [arcade.name, arcade.region, arcade.address]
                .filter(Boolean)
                .some((value) =>
                    value!.toLocaleLowerCase("ko-KR").includes(normalizedQuery)
                )
        );
    }, [arcades, query]);

    function openFromMap(arcadeId: number) {
        setQuery("");
        setOpenArcadeId(arcadeId);
        window.setTimeout(() => {
            document
                .getElementById(`gamecenter-${arcadeId}`)
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 0);
    }

    function choosePreferredArcade(arcade: GamecenterArcade) {
        setNotice(null);
        startTransition(async () => {
            const result = await setPreferredArcade(arcade.id);
            if (result.success) {
                setPreferredArcadeId(arcade.id);
                router.refresh();
            }
            setNotice({
                arcadeId: arcade.id,
                message: result.message,
                success: result.success,
            });
        });
    }

    return (
        <div className="flex flex-col gap-4">
            <section className="border-border bg-surface rounded-card overflow-hidden border">
                <ArcadeBubbleMap
                    appKey={appKey}
                    arcades={arcades}
                    selectedId={openArcadeId}
                    onSelect={openFromMap}
                />
                <div className="flex items-center justify-between gap-3 px-3 py-2">
                    <p className="text-caption">
                        원이 클수록 선호 오락실로 지정한 사용자가 많습니다.
                    </p>
                    <span className="text-caption shrink-0">
                        총 {arcades.length}곳
                    </span>
                </div>
            </section>

            <label className="border-border bg-surface focus-within:border-focus focus-within:ring-focus/20 flex h-11 items-center gap-2 rounded-full border px-4 transition focus-within:ring-2">
                <Search
                    className="text-text-disabled size-5 shrink-0"
                    aria-hidden="true"
                />
                <span className="sr-only">오락실 검색</span>
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="오락실 이름 · 지역 · 주소 검색"
                    className="text-input placeholder:text-text-disabled h-full min-w-0 flex-1 bg-transparent outline-none"
                />
            </label>

            <section className="flex flex-col gap-2" aria-label="오락실 목록">
                {filteredArcades.map((arcade) => {
                    const isOpen = openArcadeId === arcade.id;
                    const isPreferred = preferredArcadeId === arcade.id;
                    const mapUrl = kakaoMapUrl(arcade);
                    const statusMeta = isArcadeMachineStatus(
                        arcade.machineStatus
                    )
                        ? ARCADE_MACHINE_STATUS_META[arcade.machineStatus]
                        : ARCADE_MACHINE_STATUS_META.unknown;
                    const hasCoordinates =
                        arcade.latitude !== null && arcade.longitude !== null;
                    return (
                        <article
                            id={`gamecenter-${arcade.id}`}
                            key={arcade.id}
                            className="border-border bg-surface rounded-card scroll-m-4 overflow-hidden border"
                        >
                            <button
                                type="button"
                                id={`gamecenter-trigger-${arcade.id}`}
                                aria-expanded={isOpen}
                                aria-controls={`gamecenter-panel-${arcade.id}`}
                                onClick={() =>
                                    setOpenArcadeId(isOpen ? null : arcade.id)
                                }
                                className="hover:bg-surface-muted focus-visible:ring-focus/40 flex w-full items-center gap-3 p-4 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
                            >
                                <span className="bg-chart/15 text-chart flex size-9 shrink-0 items-center justify-center rounded-full">
                                    <MapPin
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="text-section flex items-center gap-2">
                                        <span className="truncate">
                                            {arcade.name}
                                        </span>
                                        {isPreferred ? (
                                            <span className="bg-success/15 text-success text-badge shrink-0 rounded px-1.5 py-1">
                                                선호
                                            </span>
                                        ) : null}
                                    </span>
                                    <span className="text-caption mt-1 block truncate">
                                        {arcade.region ??
                                            arcade.address ??
                                            "지역 정보 준비 중"}
                                    </span>
                                </span>
                                <span className="text-caption flex shrink-0 items-center gap-1">
                                    <Users
                                        className="size-3.5"
                                        aria-hidden="true"
                                    />
                                    {arcade.preferredCount}명
                                </span>
                                <ChevronDown
                                    className={`text-text-disabled size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                    aria-hidden="true"
                                />
                            </button>

                            {isOpen ? (
                                <div
                                    id={`gamecenter-panel-${arcade.id}`}
                                    role="region"
                                    aria-labelledby={`gamecenter-trigger-${arcade.id}`}
                                    className="border-divider border-t"
                                >
                                    {hasCoordinates ? (
                                        <ArcadeMiniMap
                                            appKey={appKey}
                                            name={arcade.name}
                                            latitude={arcade.latitude!}
                                            longitude={arcade.longitude!}
                                        />
                                    ) : (
                                        <div className="bg-surface-muted text-body-muted flex h-44 items-center justify-center">
                                            지도 위치를 준비하고 있습니다.
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-3 p-4">
                                        <div>
                                            <p className="text-label">주소</p>
                                            <p className="text-body-muted mt-1">
                                                {arcade.address ??
                                                    "주소 정보 준비 중"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-label">
                                                운영 정보
                                            </p>
                                            <div className="mt-2 grid grid-cols-2 gap-2">
                                                <div className="bg-surface-muted rounded-card p-3">
                                                    <p className="text-caption">
                                                        플레이 요금
                                                    </p>
                                                    <p className="text-label mt-1">
                                                        {arcade.priceInfo ??
                                                            "미확인"}
                                                    </p>
                                                </div>
                                                <div className="bg-surface-muted rounded-card p-3">
                                                    <p className="text-caption">
                                                        기체 수
                                                    </p>
                                                    <p className="text-label mt-1">
                                                        {arcade.machineCount
                                                            ? `${arcade.machineCount}대`
                                                            : "미확인"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-surface-muted rounded-card p-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-label">
                                                    기체 상태
                                                </p>
                                                <span
                                                    className={`text-badge rounded px-2 py-1 ${statusMeta.className}`}
                                                >
                                                    {statusMeta.label}
                                                </span>
                                            </div>
                                            {arcade.statusNote ? (
                                                <p className="text-body-muted mt-2 whitespace-pre-wrap">
                                                    {arcade.statusNote}
                                                </p>
                                            ) : null}
                                        </div>
                                        <ArcadeBusinessHours
                                            value={arcade.businessHours}
                                        />
                                        {arcade.notes ? (
                                            <div>
                                                <p className="text-label">
                                                    비고
                                                </p>
                                                <p className="text-body-muted mt-1 whitespace-pre-wrap">
                                                    {arcade.notes}
                                                </p>
                                            </div>
                                        ) : null}
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-body-muted flex items-center gap-1.5">
                                                <Users
                                                    className="size-4"
                                                    aria-hidden="true"
                                                />
                                                선호 {arcade.preferredCount}명
                                            </span>
                                            {mapUrl ? (
                                                <a
                                                    href={mapUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-chart focus-visible:ring-focus/40 flex items-center gap-1 text-sm font-semibold focus-visible:ring-2 focus-visible:outline-none"
                                                >
                                                    카카오맵에서 보기
                                                    <ExternalLink
                                                        className="size-3.5"
                                                        aria-hidden="true"
                                                    />
                                                </a>
                                            ) : null}
                                        </div>

                                        {isAuthenticated ? (
                                            <Button
                                                size="md"
                                                variant={
                                                    isPreferred
                                                        ? "secondary"
                                                        : "primary"
                                                }
                                                disabled={
                                                    isPreferred || isPending
                                                }
                                                onClick={() =>
                                                    choosePreferredArcade(
                                                        arcade
                                                    )
                                                }
                                                className="w-full gap-2"
                                            >
                                                {isPreferred ? (
                                                    <Check
                                                        className="size-4"
                                                        aria-hidden="true"
                                                    />
                                                ) : null}
                                                {isPreferred
                                                    ? "현재 선호 오락실"
                                                    : "선호 오락실로 지정"}
                                            </Button>
                                        ) : (
                                            <Link
                                                href="/discord/start?returnTo=/gamecenter"
                                                className="bg-interactive text-on-interactive rounded-card focus-visible:ring-focus/40 hover:bg-interactive/90 flex h-10 w-full items-center justify-center text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                                            >
                                                로그인 후 선호 오락실 지정
                                            </Link>
                                        )}

                                        {notice?.arcadeId === arcade.id ? (
                                            <p
                                                className={`text-caption text-center ${notice.success ? "text-success" : "text-danger"}`}
                                                role="status"
                                            >
                                                {notice.message}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            ) : null}
                        </article>
                    );
                })}

                {filteredArcades.length === 0 ? (
                    <p className="bg-surface text-body-muted rounded-card py-12 text-center">
                        검색 결과가 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
