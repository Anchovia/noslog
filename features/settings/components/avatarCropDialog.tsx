"use client";

import { useEffect, useRef, useState } from "react";
import ModalDialog from "@/components/ui/modalDialog";
import Button from "@/components/ui/Button";
import { useTranslations } from "@/components/i18n/localeProvider";

export default function AvatarCropDialog({
    file,
    onCancel,
    onConfirm,
    onCloseAutoFocus,
}: {
    file: File;
    onCancel: () => void;
    onConfirm: (file: File) => void;
    onCloseAutoFocus: (event: Event) => void;
}) {
    const t = useTranslations();
    const canvas = useRef<HTMLCanvasElement>(null);
    const source = useRef<HTMLImageElement | null>(null);
    const drag = useRef<{ x: number; y: number } | null>(null);
    const cancel = useRef<HTMLButtonElement>(null);
    const [ready, setReady] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 1, height: 1 });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    // Coordinates use the 302px Figma canvas; its centered 240px square is
    // the exported crop and the circular boundary previews the profile mask.
    const diameter = 240;
    useEffect(() => {
        const url = URL.createObjectURL(file);
        const image = new Image();
        let active = true;
        image.onload = () => {
            if (active) {
                source.current = image;
                setDimensions({
                    width: image.naturalWidth,
                    height: image.naturalHeight,
                });
                setReady(true);
            }
        };
        image.onerror = () => {
            if (active) setError(t("settings.imageUploadError"));
        };
        image.src = url;
        return () => {
            active = false;
            URL.revokeObjectURL(url);
        };
    }, [file, t]);
    const bounds = () => {
        const scale =
            (diameter / Math.min(dimensions.width, dimensions.height)) * zoom;
        return {
            x: (dimensions.width * scale - diameter) / 2,
            y: (dimensions.height * scale - diameter) / 2,
            scale,
        };
    };
    const limits = bounds();
    const x = Math.max(-limits.x, Math.min(limits.x, position.x));
    const y = Math.max(-limits.y, Math.min(limits.y, position.y));
    useEffect(() => {
        const context = canvas.current?.getContext("2d");
        const image = source.current;
        if (!context || !image || !ready) return;
        context.clearRect(0, 0, 604, 604);
        context.setTransform(2, 0, 0, 2, 0, 0);
        const scale =
            (diameter / Math.min(image.naturalWidth, image.naturalHeight)) *
            zoom;
        context.drawImage(
            image,
            151 - (image.naturalWidth * scale) / 2 + x,
            151 - (image.naturalHeight * scale) / 2 + y,
            image.naturalWidth * scale,
            image.naturalHeight * scale
        );
        context.setTransform(1, 0, 0, 1, 0, 0);
    }, [ready, zoom, x, y]);
    function move(dx: number, dy: number) {
        setPosition({
            x: Math.max(-limits.x, Math.min(limits.x, x + dx)),
            y: Math.max(-limits.y, Math.min(limits.y, y + dy)),
        });
    }
    async function confirm() {
        if (!ready || busy || !source.current) return;
        setBusy(true);
        setError("");
        try {
            const image = source.current;
            const output = document.createElement("canvas");
            // Avoid enlarging a small source; bound encoding cost for large photos.
            const size = Math.min(1024, Math.floor(diameter / limits.scale));
            output.width = output.height = Math.max(1, size);
            const context = output.getContext("2d");
            if (!context) throw new Error("Canvas unavailable");
            const sourceSize = diameter / limits.scale;
            context.drawImage(
                image,
                (image.naturalWidth - sourceSize) / 2 - x / limits.scale,
                (image.naturalHeight - sourceSize) / 2 - y / limits.scale,
                sourceSize,
                sourceSize,
                0,
                0,
                output.width,
                output.height
            );
            const blob = await new Promise<Blob>((resolve, reject) =>
                output.toBlob(
                    (value) =>
                        value
                            ? resolve(value)
                            : reject(new Error("Image encoding failed")),
                    "image/webp",
                    0.9
                )
            );
            const extension = blob.type === "image/webp" ? "webp" : "png";
            onConfirm(
                new File([blob], `profile.${extension}`, { type: blob.type })
            );
        } catch {
            setError(t("settings.imageUploadError"));
        } finally {
            setBusy(false);
        }
    }
    return (
        <ModalDialog
            className="nl-settings-dialog"
            open
            onOpenChange={(open) => {
                if (!open && !busy) onCancel();
            }}
            title={t("settings.changePhoto")}
            showClose={false}
            onCloseAutoFocus={onCloseAutoFocus}
            onOpenAutoFocus={(event) => {
                event.preventDefault();
                cancel.current?.focus();
            }}
            footer={
                <>
                    <Button
                        ref={cancel}
                        appearance="foundation"
                        size="sm"
                        variant="secondary"
                        disabled={busy}
                        onClick={onCancel}
                    >
                        {t("settings.cancel")}
                    </Button>
                    <Button
                        appearance="foundation"
                        size="sm"
                        disabled={!ready || busy}
                        onClick={confirm}
                    >
                        {t("common.confirm")}
                    </Button>
                </>
            }
        >
            <div
                className="nl-settings__crop"
                tabIndex={0}
                role="group"
                aria-label={t("settings.cropPosition")}
                aria-busy={busy}
                onKeyDown={(event) => {
                    if (busy || !ready) return;
                    const delta = event.shiftKey ? 10 : 1;
                    const directions: Record<string, [number, number]> = {
                        ArrowLeft: [-delta, 0],
                        ArrowRight: [delta, 0],
                        ArrowUp: [0, -delta],
                        ArrowDown: [0, delta],
                    };
                    const step = directions[event.key];
                    if (step) {
                        event.preventDefault();
                        move(...step);
                    }
                }}
                onPointerDown={(event) => {
                    if (busy || !ready) return;
                    event.currentTarget.focus();
                    event.currentTarget.setPointerCapture(event.pointerId);
                    drag.current = { x: event.clientX, y: event.clientY };
                }}
                onPointerMove={(event) => {
                    if (!drag.current) return;
                    const ratio =
                        302 / event.currentTarget.getBoundingClientRect().width;
                    move(
                        (event.clientX - drag.current.x) * ratio,
                        (event.clientY - drag.current.y) * ratio
                    );
                    drag.current = { x: event.clientX, y: event.clientY };
                }}
                onPointerUp={() => {
                    drag.current = null;
                }}
                onPointerCancel={() => {
                    drag.current = null;
                }}
            >
                <canvas ref={canvas} width={604} height={604} aria-hidden />
                <span className="nl-settings__crop-circle" aria-hidden />
            </div>
            <div
                className="nl-settings__actions"
                aria-label={t("settings.cropZoom")}
                role="group"
            >
                <Button
                    appearance="foundation"
                    size="sm"
                    variant="secondary"
                    disabled={!ready || busy || zoom <= 1}
                    onClick={() =>
                        setZoom((value) => Math.max(1, value - 0.25))
                    }
                >
                    {t("settings.zoomOut")}
                </Button>
                <Button
                    appearance="foundation"
                    size="sm"
                    variant="secondary"
                    disabled={!ready || busy || zoom >= 4}
                    onClick={() =>
                        setZoom((value) => Math.min(4, value + 0.25))
                    }
                >
                    {t("settings.zoomIn")}
                </Button>
            </div>
            {error ? (
                <p role="alert" className="nl-field__error nl-body-secondary">
                    {error}
                </p>
            ) : null}
        </ModalDialog>
    );
}
