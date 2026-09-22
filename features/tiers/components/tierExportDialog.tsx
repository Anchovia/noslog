"use client";

/* eslint-disable @next/next/no-img-element */

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import ModalDialog from "@/components/ui/modalDialog";
import { StatusMessage } from "@/components/ui/statusMessage";
import { tierBrowserBandOptions } from "@/features/tiers/api/tierBrowser";
import {
    canvasBlob,
    drawTierImage,
    TIER_EXPORT_MAX,
} from "@/features/tiers/lib/tierExportImage";
import type {
    TierBrowserOverview,
    TierBrowserQuery,
} from "@/features/tiers/schemas/tierBrowserSchema";
import { formatTierValue } from "@/lib/tiers";
import { cn } from "@/lib/utils";
import { sortTierBrowserEntries } from "./tierBrowserBands";
import { tierStripValue } from "./tierBrowserCard";

// 창의 표시 선택(곡 이름 · 내 달성)은 이 브라우저에 기억한다(2026-09-22, PIU Scores 「Remembered for next time」)
const OPTIONS_KEY = "noslog-tier-export";
type ExportOptions = { names: boolean; achievement: boolean };
const DEFAULT_OPTIONS: ExportOptions = { names: false, achievement: true };

function readOptions(): ExportOptions {
    try {
        const saved = JSON.parse(localStorage.getItem(OPTIONS_KEY) ?? "null");
        return {
            names:
                typeof saved?.names === "boolean"
                    ? saved.names
                    : DEFAULT_OPTIONS.names,
            achievement:
                typeof saved?.achievement === "boolean"
                    ? saved.achievement
                    : DEFAULT_OPTIONS.achievement,
        };
    } catch {
        return DEFAULT_OPTIONS;
    }
}

function seoulDate() {
    // en-CA = YYYY-MM-DD
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
}

type Rendered = { jpeg: Blob; png: () => Promise<Blob | null>; url: string };

function TierExportPreview({
    query,
    overview,
    title,
    conditions,
}: {
    query: TierBrowserQuery;
    overview: TierBrowserOverview;
    title: string;
    conditions: string[];
}) {
    const t = useTranslations();
    const locale = useLocale();
    const client = useQueryClient();
    const host = useRef<HTMLDivElement>(null);
    const [options, setOptions] = useState(readOptions);
    const [attempt, setAttempt] = useState(0);
    const [rendered, setRendered] = useState<Rendered | null>(null);
    const [failed, setFailed] = useState(false);
    const [status, setStatus] = useState<
        "idle" | "working" | "copied" | "error"
    >("idle");
    const signedIn = overview.viewerId !== null;
    const showAchievement = signedIn && options.achievement;
    const bands =
        overview.list?.bands.filter(
            (band) =>
                band.totalCount > 0 &&
                (!query.bands.length || query.bands.includes(band.value))
        ) ?? [];
    const total = bands.reduce((sum, band) => sum + band.totalCount, 0);
    const blocked = total > TIER_EXPORT_MAX || total === 0;
    const heading = [title, ...conditions].join(" · ");
    const date = seoulDate();
    const fileName = `noslog-${[
        query.mode,
        query.goal,
        ...query.difficulties,
        ...query.levels,
        ...query.bands.map(formatTierValue),
        date,
    ]
        .join("-")
        .toLowerCase()
        .replaceAll(/[^\p{L}\p{N}.-]/gu, "-")}.jpg`;

    function changeOptions(next: ExportOptions) {
        setOptions(next);
        try {
            localStorage.setItem(OPTIONS_KEY, JSON.stringify(next));
        } catch {
            // 저장 못 하는 환경이면 이번 창에서만 쓴다
        }
    }

    useEffect(() => {
        if (blocked || !host.current) return;
        let cancelled = false;
        let objectUrl: string | null = null;
        // 새 조건 · 표시로 다시 그리는 동안 이전 미리보기를 걷는다(외부 캔버스 · 주소 자원을 이 효과가 소유)
        setRendered(null);
        setFailed(false);
        void (async () => {
            try {
                const sort =
                    query.sort === "score" && !signedIn
                        ? "position"
                        : query.sort;
                const loaded = await Promise.all(
                    bands.map((band) =>
                        client.fetchQuery(
                            tierBrowserBandOptions(
                                query,
                                band.id,
                                locale,
                                overview.viewerId,
                                overview.showLocalizedTitle
                            )
                        )
                    )
                );
                const exportBands = loaded.map((band) => ({
                    value: band.value,
                    entries: sortTierBrowserEntries(band.entries, sort),
                }));
                const canvas = await drawTierImage({
                    host: host.current!,
                    title: heading,
                    subtitle: showAchievement
                        ? t("tiers.achieved", {
                              count: overview
                                  .list!.bands.filter((band) =>
                                      bands.includes(band)
                                  )
                                  .reduce(
                                      (sum, band) =>
                                          sum + (band.achievedCount ?? 0),
                                      0
                                  ),
                              total,
                          })
                        : null,
                    date,
                    url: window.location.href,
                    bands: exportBands,
                    goal: query.goal,
                    strip: query.strip,
                    stripValue: (entry) =>
                        tierStripValue(entry.record, query.strip, locale),
                    achievedLabel: (count, all) =>
                        t("tiers.achieved", { count, total: all }),
                    showNames: options.names,
                    showAchievement,
                });
                const jpeg = await canvasBlob(canvas, "image/jpeg");
                if (!jpeg) throw new Error("jpeg");
                if (cancelled) return;
                objectUrl = URL.createObjectURL(jpeg);
                setRendered({
                    jpeg,
                    url: objectUrl,
                    png: () => canvasBlob(canvas, "image/png"),
                });
            } catch {
                if (!cancelled) setFailed(true);
            }
        })();
        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
        // bands · heading 은 query · overview 에서 나온다
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, overview, options, attempt, locale, blocked]);

    const file = rendered
        ? new File([rendered.jpeg], fileName, { type: "image/jpeg" })
        : null;
    const payload = file
        ? {
              files: [file],
              title: t("tiers.export.shareTitle", { list: title }),
              text: t("tiers.export.shareText", { list: heading }),
              url: window.location.href,
          }
        : null;
    const canCopy =
        typeof navigator !== "undefined" &&
        typeof navigator.clipboard?.write === "function" &&
        typeof ClipboardItem !== "undefined" &&
        (typeof ClipboardItem.supports !== "function" ||
            ClipboardItem.supports("image/png"));
    const canShare =
        payload !== null &&
        typeof navigator.share === "function" &&
        Boolean(navigator.canShare?.(payload));
    const preparing = !blocked && !failed && !rendered;
    const disabled = blocked || !rendered || status === "working";

    function download() {
        if (!rendered) return;
        const anchor = document.createElement("a");
        anchor.href = rendered.url;
        anchor.download = fileName;
        anchor.click();
    }
    async function copy() {
        if (!rendered || !canCopy) return;
        setStatus("working");
        try {
            // 클립보드는 PNG 만 받는 브라우저가 많아 복사만 PNG 로 만든다
            const png = await rendered.png();
            if (!png) throw new Error("png");
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": png }),
            ]);
            setStatus("copied");
        } catch {
            setStatus("error");
        }
    }
    async function share() {
        if (!payload) return;
        if (canShare) {
            setStatus("working");
            try {
                await navigator.share(payload);
                setStatus("idle");
            } catch (error) {
                setStatus(
                    error instanceof Error && error.name === "AbortError"
                        ? "idle"
                        : "error"
                );
            }
        } else {
            const intent = new URL("https://x.com/intent/post");
            intent.searchParams.set("text", `${payload.text}\n${payload.url}`);
            window.open(intent.href, "_blank", "noopener,noreferrer");
        }
    }

    return (
        <div className="nl-image-share__body" ref={host}>
            {/* 담기는 것 — 지금 서열표 · 필터 · 구간 조건 그대로 */}
            <p className="nl-body-secondary nl-muted">
                {t("tiers.export.scope", {
                    list: heading,
                    bands: bands.length,
                    count: total.toLocaleString(locale),
                })}
            </p>
            {blocked ? (
                <StatusMessage
                    severity="warning"
                    role="status"
                    title={
                        total === 0
                            ? t("tiers.export.empty")
                            : t("tiers.export.tooMany", {
                                  max: TIER_EXPORT_MAX.toLocaleString(locale),
                                  count: total.toLocaleString(locale),
                              })
                    }
                />
            ) : failed ? (
                <StatusMessage
                    severity="danger"
                    role="alert"
                    title={t("profile.imageError")}
                />
            ) : (
                <>
                    <div
                        className={cn(
                            "nl-image-share__preview nl-tier-export__preview",
                            preparing && "nl-skeleton"
                        )}
                        aria-busy={preparing}
                    >
                        {rendered ? (
                            <img
                                src={rendered.url}
                                alt={t("tiers.export.preview", {
                                    list: heading,
                                })}
                            />
                        ) : null}
                    </div>
                    {preparing ? (
                        <p className="nl-body-secondary nl-muted" role="status">
                            {t("profile.preparingImage")}
                        </p>
                    ) : null}
                </>
            )}
            <div className="nl-tier-export__options">
                <Checkbox
                    label={t("tiers.export.names")}
                    checked={options.names}
                    onChange={(event) =>
                        changeOptions({
                            ...options,
                            names: event.currentTarget.checked,
                        })
                    }
                />
                {signedIn ? (
                    <Checkbox
                        label={t("tiers.export.achievement")}
                        checked={options.achievement}
                        onChange={(event) =>
                            changeOptions({
                                ...options,
                                achievement: event.currentTarget.checked,
                            })
                        }
                    />
                ) : null}
            </div>
            {status === "copied" ? (
                <StatusMessage
                    severity="success"
                    role="status"
                    title={t("profile.copiedImage")}
                />
            ) : status === "error" ? (
                <StatusMessage
                    severity="danger"
                    role="alert"
                    title={t("profile.imageError")}
                />
            ) : null}
            <div className="nl-image-share__actions">
                {failed ? (
                    <Button
                        variant="primary"
                        onClick={() => setAttempt((value) => value + 1)}
                    >
                        {t("common.retry")}
                    </Button>
                ) : (
                    <>
                        <Button
                            className="nl-image-share__save"
                            variant="primary"
                            disabled={disabled}
                            onClick={download}
                        >
                            {t("profile.saveImage")}
                        </Button>
                        <div className="nl-image-share__secondary">
                            <Button
                                variant="secondary"
                                disabled={disabled || !canCopy}
                                onClick={() => void copy()}
                            >
                                {t("profile.copyImage")}
                            </Button>
                            <Button
                                variant="secondary"
                                disabled={disabled}
                                onClick={() => void share()}
                            >
                                {t(
                                    canShare
                                        ? "profile.shareAction"
                                        : "profile.shareX"
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

/**
 * 서열표 이미지 내보내기(2026-09-22 E3 · D1) — 제목 줄 오른쪽 공유 아이콘이 여는 창.
 * 프로필 카드 내보내기와 같은 창(nl-image-share): 담기는 범위 한 줄 → 미리보기 → 표시 선택 → 저장 · 복사 · 공유
 */
export default function TierExportDialog({
    query,
    overview,
    title,
    conditions,
    open,
    onOpenChange,
    onCloseAutoFocus,
}: {
    query: TierBrowserQuery;
    overview: TierBrowserOverview;
    title: string;
    conditions: string[];
    /** 제목 줄 ⋯ 메뉴 「이미지로 내보내기」 가 연다(2026-09-22 S7-a) — 창만 있고 여는 버튼은 없다 */
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCloseAutoFocus?: (event: Event) => void;
}) {
    const t = useTranslations();
    return (
        <ModalDialog
            open={open}
            onOpenChange={onOpenChange}
            onCloseAutoFocus={onCloseAutoFocus}
            title={t("tiers.export.title")}
            className="nl-image-share"
        >
            {open ? (
                <TierExportPreview
                    query={query}
                    overview={overview}
                    title={title}
                    conditions={conditions}
                />
            ) : null}
        </ModalDialog>
    );
}
