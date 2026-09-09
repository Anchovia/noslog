"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "@/components/i18n/localeProvider";
import ModalDialog from "@/components/ui/modalDialog";
import type { PublicArcade } from "@/features/arcades/schemas/publicArcadeSchema";

export default function ArcadePhotos({
    photos,
}: {
    photos: PublicArcade["photos"];
}) {
    const t = useTranslations();
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const [failed, setFailed] = useState<number[]>([]);
    const [startX, setStartX] = useState<number | null>(null);
    const opener = useRef<HTMLButtonElement | null>(null);
    const swiped = useRef(false);
    const visible = photos.filter((photo) => !failed.includes(photo.id));
    const active = Math.min(index, visible.length - 1);
    if (!visible.length) return null;
    const photo = visible[active];
    const advance = (direction: number) =>
        setIndex((active + direction + visible.length) % visible.length);
    return (
        <>
            <div
                className="nl-arcade-photos"
                onTouchStart={(event) => {
                    swiped.current = false;
                    setStartX(event.touches[0].clientX);
                }}
                onTouchEnd={(event) => {
                    if (
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
                <button
                    type="button"
                    className="nl-arcade-photos__main"
                    aria-label={t("arcades.photoOpen")}
                    onClick={(event) => {
                        if (swiped.current) {
                            swiped.current = false;
                            return;
                        }
                        opener.current = event.currentTarget;
                        setOpen(true);
                    }}
                >
                    <Image
                        src={photo.url}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 959px) 100vw, 952px"
                        onError={() =>
                            setFailed((current) => [...current, photo.id])
                        }
                    />
                </button>
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
                {visible.length > 1 ? (
                    <div className="nl-arcade-photos__controls">
                        <button
                            type="button"
                            className="nl-icon-button"
                            aria-label={t("arcades.photoPrevious")}
                            onClick={() => advance(-1)}
                        >
                            <ChevronLeft className="nl-icon" aria-hidden />
                        </button>
                        <button
                            type="button"
                            className="nl-icon-button"
                            aria-label={t("arcades.photoNext")}
                            onClick={() => advance(1)}
                        >
                            <ChevronRight className="nl-icon" aria-hidden />
                        </button>
                    </div>
                ) : null}
                <div className="nl-arcade-photos__thumbnails">
                    {visible.slice(1).map((item, itemIndex) => (
                        <button
                            type="button"
                            key={item.id}
                            onClick={(event) => {
                                opener.current = event.currentTarget;
                                setIndex(itemIndex + 1);
                                setOpen(true);
                            }}
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
                                onError={() =>
                                    setFailed((current) => [
                                        ...current,
                                        item.id,
                                    ])
                                }
                            />
                        </button>
                    ))}
                </div>
            </div>
            <ModalDialog
                open={open}
                onOpenChange={setOpen}
                width="wide"
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    opener.current?.focus();
                }}
                title={t("arcades.photo", {
                    index: active + 1,
                    total: visible.length,
                })}
            >
                <div className="nl-arcade-photos__full">
                    <Image
                        src={photo.url}
                        alt={photo.alt}
                        fill
                        sizes="90vw"
                        onError={() =>
                            setFailed((current) => [...current, photo.id])
                        }
                    />
                </div>
                {visible.length > 1 ? (
                    <div className="nl-arcade-photos__full-controls">
                        <button
                            type="button"
                            className="nl-icon-button"
                            aria-label={t("arcades.photoPrevious")}
                            onClick={() => advance(-1)}
                        >
                            <ChevronLeft className="nl-icon" aria-hidden />
                        </button>
                        <button
                            type="button"
                            className="nl-icon-button"
                            aria-label={t("arcades.photoNext")}
                            onClick={() => advance(1)}
                        >
                            <ChevronRight className="nl-icon" aria-hidden />
                        </button>
                    </div>
                ) : null}
            </ModalDialog>
        </>
    );
}
