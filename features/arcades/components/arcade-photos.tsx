"use client";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { useTranslations } from "@/components/i18n/locale-provider";
import PhotoViewer from "@/components/ui/photo-viewer";
import type { PublicArcade } from "@/features/arcades/schemas/public-arcade-schema";
import useMediaQuery from "@/lib/hooks/use-media-query";

/**
 * 오락실 사진(P1 · 2026-09-22).
 * - 1056 이상 · 사진 2장 이상 = 모자이크(큰 사진 1 + 작은 사진 최대 2) — 한눈에 보는 자리라 위에 ‹ › 가 없다.
 * - 그 아래 = 한 장 + 밀어 넘김 · ‹ ›(폰 포함 — WCAG 2.5.7) · 카운터.
 * - 어느 사진을 눌러도 그 사진이 전체 화면 뷰어에서 바로 열린다(2026-09-23 V3 · S2, 격자 단계 없음).
 */
export default function ArcadePhotos({
    photos,
    credits,
    strip = false,
}: {
    photos: PublicArcade["photos"];
    /**
     * 제목 아래 사진 줄(2026-10-22 사용자 — 네이버 지도 장소 화면 그대로): 둥근 정사각 사진을 가로로 늘어놓고 옆으로 밀어 본다.
     * 누르면 그 사진이 전체 화면 뷰어에서 열린다. 사진이 없으면 같은 높이의 자리표시자 한 칸
     */
    strip?: boolean;
    /** 사진 출처 칩(뮤즈캣 시안 「작성자 · 날짜」) — 사진 id 별 글, 한 장 보기의 지금 사진에만 */
    credits?: Record<number, string>;
}) {
    const t = useTranslations();
    const wide = useMediaQuery("(min-width: 1056px)");
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const [failed, setFailed] = useState<number[]>([]);
    const [startX, setStartX] = useState<number | null>(null);
    const opener = useRef<HTMLButtonElement | null>(null);
    const swiped = useRef(false);
    const visible = photos.filter((photo) => !failed.includes(photo.id));
    const active = Math.max(0, Math.min(index, visible.length - 1));
    const markFailed = (id: number) => setFailed((current) => [...current, id]);
    // 사진이 없거나 전부 못 불러오면 같은 자리에 자리표시자 — 모든 오락실이 같은 틀
    if (!visible.length)
        return (
            <div
                className={
                    strip
                        ? "nl-arcade-photos nl-arcade-photos--empty nl-arcade-photos--strip-empty nl-body-secondary"
                        : "nl-arcade-photos nl-arcade-photos--empty nl-body-secondary"
                }
            >
                <ImageIcon className="nl-icon nl-icon--large" aria-hidden />
                <p>{t("arcades.photoPending")}</p>
            </div>
        );
    const viewer = (
        <PhotoViewer
            photos={visible}
            index={active}
            open={open}
            onIndexChange={setIndex}
            onOpenChange={setOpen}
            onError={markFailed}
            onCloseAutoFocus={(event) => {
                event.preventDefault();
                opener.current?.focus();
            }}
            label={(position, total) =>
                t("arcades.photo", { index: position, total })
            }
            previousLabel={t("arcades.photoPrevious")}
            nextLabel={t("arcades.photoNext")}
        />
    );
    if (strip)
        return (
            <>
                <ul className="nl-arcade-photos-strip">
                    {visible.map((photo, photoIndex) => (
                        <li key={photo.id}>
                            <button
                                type="button"
                                className="nl-arcade-photos-strip__item"
                                aria-label={t("arcades.photo", {
                                    index: photoIndex + 1,
                                    total: visible.length,
                                })}
                                onClick={(event) =>
                                    openViewer(event.currentTarget, photoIndex)
                                }
                            >
                                <Image
                                    src={photo.url}
                                    alt={photo.alt}
                                    fill
                                    sizes="160px"
                                    loading={
                                        photoIndex === 0 ? "eager" : "lazy"
                                    }
                                    onError={() => markFailed(photo.id)}
                                />
                                {credits?.[photo.id] ? (
                                    <span className="nl-tag nl-arcade-photos__credit">
                                        {credits[photo.id]}
                                    </span>
                                ) : null}
                            </button>
                        </li>
                    ))}
                </ul>
                {viewer}
            </>
        );
    const mosaic = wide && visible.length > 1;
    // 모자이크는 순서 고정(첫 장이 큰 사진) — 넘기지 않으니 같은 사진이 두 번 보이지 않는다
    const lead = mosaic ? visible[0] : visible[active];
    const advance = (direction: number) =>
        setIndex((active + direction + visible.length) % visible.length);
    const openViewer = (target: HTMLButtonElement, nextIndex: number) => {
        opener.current = target;
        setIndex(nextIndex);
        setOpen(true);
    };
    return (
        <>
            <div
                className="nl-arcade-photos"
                data-mosaic={mosaic || undefined}
                // 한 장 보기는 밀어 넘김에 더해 키보드 ← → 로도 넘긴다(모자이크는 넘기지 않음)
                onKeyDown={(event) => {
                    if (mosaic || visible.length < 2) return;
                    if (event.key === "ArrowRight") {
                        event.preventDefault();
                        advance(1);
                    } else if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        advance(-1);
                    }
                }}
                onTouchStart={(event) => {
                    swiped.current = false;
                    setStartX(event.touches[0].clientX);
                }}
                onTouchEnd={(event) => {
                    if (
                        !mosaic &&
                        startX !== null &&
                        Math.abs(event.changedTouches[0].clientX - startX) > 40
                    ) {
                        swiped.current = true;
                        advance(
                            event.changedTouches[0].clientX < startX ? 1 : -1
                        );
                    }
                    setStartX(null);
                }}
            >
                <div className="nl-arcade-photos__stage">
                    <button
                        type="button"
                        className="nl-arcade-photos__main"
                        aria-label={
                            mosaic
                                ? t("arcades.photoAll", {
                                      count: visible.length,
                                  })
                                : t("arcades.photoOpen")
                        }
                        onClick={(event) => {
                            if (swiped.current) {
                                swiped.current = false;
                                return;
                            }
                            openViewer(
                                event.currentTarget,
                                mosaic ? 0 : active
                            );
                        }}
                    >
                        {/* 대표 사진은 들어오자마자 보이는 가장 큰 그림(LCP) — 나중에 받기(lazy) 대신 바로 받는다 */}
                        <Image
                            src={lead.url}
                            alt={lead.alt}
                            fill
                            loading="eager"
                            // 페이지 모드 경계(672 · 1056)와 실제 칸 폭 — 1056+ 주 열 = (1136 − 24) × 2/3, 모자이크 큰 칸 = (주 열 − 8) / 2
                            sizes={
                                mosaic
                                    ? "(max-width: 671px) 100vw, (max-width: 1055px) calc(100vw - 48px), 367px"
                                    : "(max-width: 671px) 100vw, (max-width: 1055px) calc(100vw - 48px), 742px"
                            }
                            onError={() => markFailed(lead.id)}
                        />
                    </button>
                    {mosaic ? null : (
                        <span
                            className="nl-arcade-photos__counter nl-metadata"
                            role="status"
                            aria-label={t("arcades.photo", {
                                index: active + 1,
                                total: visible.length,
                            })}
                        >
                            {active + 1} / {visible.length}
                        </span>
                    )}
                    {!mosaic && credits?.[visible[active].id] ? (
                        <span className="nl-tag nl-arcade-photos__credit">
                            {credits[visible[active].id]}
                        </span>
                    ) : null}
                    {!mosaic && visible.length > 1 ? (
                        <>
                            <button
                                type="button"
                                className="nl-arcade-photos__nav nl-arcade-photos__nav--previous"
                                aria-label={t("arcades.photoPrevious")}
                                onClick={() => advance(-1)}
                            >
                                <ChevronLeft className="nl-icon" aria-hidden />
                            </button>
                            <button
                                type="button"
                                className="nl-arcade-photos__nav nl-arcade-photos__nav--next"
                                aria-label={t("arcades.photoNext")}
                                onClick={() => advance(1)}
                            >
                                <ChevronRight className="nl-icon" aria-hidden />
                            </button>
                        </>
                    ) : null}
                </div>
                {mosaic ? (
                    <>
                        <div className="nl-arcade-photos__thumbnails">
                            {visible.slice(1, 3).map((item, itemIndex) => (
                                <button
                                    type="button"
                                    key={item.id}
                                    onClick={(event) =>
                                        openViewer(
                                            event.currentTarget,
                                            itemIndex + 1
                                        )
                                    }
                                    aria-label={t("arcades.photo", {
                                        index: itemIndex + 2,
                                        total: visible.length,
                                    })}
                                >
                                    <Image
                                        src={item.url}
                                        alt={item.alt}
                                        fill
                                        sizes="310px"
                                        onError={() => markFailed(item.id)}
                                    />
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="nl-arcade-photos__all nl-control"
                            onClick={(event) =>
                                openViewer(event.currentTarget, 0)
                            }
                        >
                            {t("arcades.photoAll", { count: visible.length })}
                        </button>
                    </>
                ) : null}
            </div>
            {viewer}
        </>
    );
}
