"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import useOverlayHistory from "@/lib/hooks/useOverlayHistory";

export interface ViewerPhoto {
    id: number;
    url: string;
    alt: string;
}

/**
 * 사진 뷰어(2026-09-23 V3 · B2 · C2 · S2 · U2) — 모든 폭에서 화면을 채우고, 바탕은 페이지 바탕색,
 * 사진은 `contain`. 조작부는 사진 위에 — 닫기 우상 · ‹ › 좌우(폰에도 — WCAG 2.5.7) · 카운터와 썸네일 줄은 아래.
 * 격자 단계는 두지 않는다(사진이 몇 장뿐이라 한 단계 더 누르게 된다). 뒤로 가기로 닫힌다
 */
export default function PhotoViewer({
    photos,
    index,
    open,
    onIndexChange,
    onOpenChange,
    onCloseAutoFocus,
    onError,
    label,
    previousLabel,
    nextLabel,
}: {
    photos: ViewerPhoto[];
    index: number;
    open: boolean;
    onIndexChange: (index: number) => void;
    onOpenChange: (open: boolean) => void;
    onCloseAutoFocus?: (event: Event) => void;
    onError?: (id: number) => void;
    /** 사진 한 장의 이름 — 「{index} / {total}」 처럼 쓰는 화면 문구 */
    label: (index: number, total: number) => string;
    /** 넘김 버튼 이름 — 화면마다 제 문구를 쓴다(오락실 사진 등) */
    previousLabel: string;
    nextLabel: string;
}) {
    const t = useTranslations();
    const [startX, setStartX] = useState<number | null>(null);
    const swiped = useRef(false);
    useOverlayHistory(open, () => onOpenChange(false));
    // 열려 있는 동안 뒤 페이지는 스크롤하지 않는다(APG — 배경을 실제로 잠갔을 때만 모달이라 할 수 있다)
    useEffect(() => {
        if (!open) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [open]);
    const total = photos.length;
    const active = Math.max(0, Math.min(index, total - 1));
    const photo = photos[active];
    const advance = (direction: number) =>
        onIndexChange((active + direction + total) % total);
    if (!photo) return null;
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <div className="noslog-ui">
                    <Dialog.Content
                        className="nl-photo-viewer"
                        aria-describedby={undefined}
                        onCloseAutoFocus={onCloseAutoFocus}
                        onKeyDown={(event) => {
                            if (total < 2) return;
                            if (event.key === "ArrowRight") {
                                event.preventDefault();
                                advance(1);
                            } else if (event.key === "ArrowLeft") {
                                event.preventDefault();
                                advance(-1);
                            }
                        }}
                    >
                        <Dialog.Title className="sr-only">
                            {label(active + 1, total)}
                        </Dialog.Title>
                        <div
                            className="nl-photo-viewer__stage"
                            onTouchStart={(event) => {
                                swiped.current = false;
                                setStartX(event.touches[0].clientX);
                            }}
                            onTouchEnd={(event) => {
                                const end = event.changedTouches[0].clientX;
                                if (
                                    total > 1 &&
                                    startX !== null &&
                                    Math.abs(end - startX) > 40
                                ) {
                                    swiped.current = true;
                                    advance(end < startX ? 1 : -1);
                                }
                                setStartX(null);
                            }}
                        >
                            <Image
                                src={photo.url}
                                alt={photo.alt}
                                fill
                                sizes="100vw"
                                onError={() => onError?.(photo.id)}
                            />
                        </div>
                        <Dialog.Close asChild>
                            <button
                                type="button"
                                className="nl-photo-viewer__close"
                                aria-label={t("common.close")}
                            >
                                <X
                                    className="nl-icon nl-icon--large"
                                    aria-hidden
                                />
                            </button>
                        </Dialog.Close>
                        {total > 1 ? (
                            <>
                                <button
                                    type="button"
                                    className="nl-photo-viewer__nav nl-photo-viewer__nav--previous"
                                    aria-label={previousLabel}
                                    onClick={() => advance(-1)}
                                >
                                    <ChevronLeft
                                        className="nl-icon"
                                        aria-hidden
                                    />
                                </button>
                                <button
                                    type="button"
                                    className="nl-photo-viewer__nav nl-photo-viewer__nav--next"
                                    aria-label={nextLabel}
                                    onClick={() => advance(1)}
                                >
                                    <ChevronRight
                                        className="nl-icon"
                                        aria-hidden
                                    />
                                </button>
                                <div className="nl-photo-viewer__bar">
                                    <p
                                        className="nl-metadata nl-muted"
                                        role="status"
                                    >
                                        {active + 1} / {total}
                                    </p>
                                    <ul className="nl-photo-viewer__thumbnails">
                                        {photos.map((item, itemIndex) => (
                                            <li key={item.id}>
                                                <button
                                                    type="button"
                                                    aria-label={label(
                                                        itemIndex + 1,
                                                        total
                                                    )}
                                                    aria-current={
                                                        itemIndex === active
                                                            ? "true"
                                                            : undefined
                                                    }
                                                    onClick={() =>
                                                        onIndexChange(itemIndex)
                                                    }
                                                >
                                                    <Image
                                                        src={item.url}
                                                        alt=""
                                                        fill
                                                        sizes="88px"
                                                        onError={() =>
                                                            onError?.(item.id)
                                                        }
                                                    />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        ) : null}
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
