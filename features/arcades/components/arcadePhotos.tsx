"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
    LayoutGrid,
} from "lucide-react";
import { useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/iconButton";
import ModalDialog from "@/components/ui/modalDialog";
import type { PublicArcade } from "@/features/arcades/schemas/publicArcadeSchema";
import useMediaQuery from "@/lib/hooks/useMediaQuery";

/**
 * 오락실 사진(P1 · 2026-09-22).
 * - 1056 이상 · 사진 2장 이상 = 모자이크(큰 사진 1 + 작은 사진 최대 2) — 한눈에 보는 자리라 위에 ‹ › 가 없다.
 *   어느 사진이든 · 「사진 N장 모두 보기」 를 누르면 창의 격자 → 한 장 · ‹ › (모자이크 5곳 모두 같은 방식).
 * - 그 아래 = 한 장 + 밀어 넘김 · 카운터(672 이상은 ‹ › 도), 누르면 창에서 그 사진 한 장.
 */
export default function ArcadePhotos({
    photos,
}: {
    photos: PublicArcade["photos"];
}) {
    const t = useTranslations();
    const wide = useMediaQuery("(min-width: 1056px)");
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<"grid" | "single">("single");
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
            <div className="nl-arcade-photos nl-arcade-photos--empty nl-body-secondary">
                <ImageIcon className="nl-icon nl-icon--large" aria-hidden />
                <p>{t("arcades.photoPending")}</p>
            </div>
        );
    const mosaic = wide && visible.length > 1;
    // 모자이크는 순서 고정(첫 장이 큰 사진) — 넘기지 않으니 같은 사진이 두 번 보이지 않는다
    const lead = mosaic ? visible[0] : visible[active];
    const photo = visible[active];
    const advance = (direction: number) =>
        setIndex((active + direction + visible.length) % visible.length);
    const openDialog = (
        target: HTMLButtonElement,
        nextView: "grid" | "single"
    ) => {
        opener.current = target;
        setView(nextView);
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
                            openDialog(
                                event.currentTarget,
                                mosaic ? "grid" : "single"
                            );
                        }}
                    >
                        <Image
                            src={lead.url}
                            alt={lead.alt}
                            fill
                            sizes="(max-width: 959px) 100vw, 952px"
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
                                        openDialog(event.currentTarget, "grid")
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
                                openDialog(event.currentTarget, "grid")
                            }
                        >
                            <LayoutGrid className="nl-icon" aria-hidden />
                            {t("arcades.photoAll", { count: visible.length })}
                        </button>
                    </>
                ) : null}
            </div>
            <ModalDialog
                open={open}
                onOpenChange={setOpen}
                width="wide"
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    opener.current?.focus();
                }}
                title={
                    view === "grid"
                        ? t("arcades.photoGridTitle", { count: visible.length })
                        : t("arcades.photo", {
                              index: active + 1,
                              total: visible.length,
                          })
                }
            >
                {view === "grid" ? (
                    <ul className="nl-arcade-photos__grid">
                        {visible.map((item, itemIndex) => (
                            <li key={item.id}>
                                <button
                                    type="button"
                                    aria-label={t("arcades.photo", {
                                        index: itemIndex + 1,
                                        total: visible.length,
                                    })}
                                    onClick={() => {
                                        setIndex(itemIndex);
                                        setView("single");
                                    }}
                                >
                                    <Image
                                        src={item.url}
                                        alt={item.alt}
                                        fill
                                        sizes="(max-width: 767px) 50vw, 240px"
                                        onError={() => markFailed(item.id)}
                                    />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <>
                        <div
                            className="nl-arcade-photos__full"
                            // 창 안 한 장 보기도 키보드 ← → 로 넘긴다
                            onKeyDown={(event) => {
                                if (visible.length < 2) return;
                                if (event.key === "ArrowRight") advance(1);
                                else if (event.key === "ArrowLeft") advance(-1);
                            }}
                        >
                            <Image
                                src={photo.url}
                                alt={photo.alt}
                                fill
                                sizes="90vw"
                                onError={() => markFailed(photo.id)}
                            />
                        </div>
                        <div className="nl-arcade-photos__full-controls">
                            {visible.length > 1 ? (
                                <Button
                                    variant="secondary"
                                    onClick={() => setView("grid")}
                                >
                                    {t("arcades.photoBackToGrid")}
                                </Button>
                            ) : null}
                            {visible.length > 1 ? (
                                <>
                                    <IconButton
                                        label={t("arcades.photoPrevious")}
                                        onClick={() => advance(-1)}
                                    >
                                        <ChevronLeft
                                            className="nl-icon"
                                            aria-hidden
                                        />
                                    </IconButton>
                                    <IconButton
                                        label={t("arcades.photoNext")}
                                        onClick={() => advance(1)}
                                    >
                                        <ChevronRight
                                            className="nl-icon"
                                            aria-hidden
                                        />
                                    </IconButton>
                                </>
                            ) : null}
                        </div>
                    </>
                )}
            </ModalDialog>
        </>
    );
}
