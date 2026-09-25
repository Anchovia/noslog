"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { useState } from "react";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

export default function Avatar({
    src,
    alt = "",
    size = 44,
    className,
    fallbackName,
    fallbackInitial,
    initialClassName = "nl-metadata",
    loading,
    style,
}: {
    src?: string | null;
    alt?: string;
    size?: number;
    className?: string;
    fallbackName?: string | null;
    fallbackInitial?: string;
    /** 첫 글자 글자 스타일 — 기본 metadata, 프로필 머리 108 만 display(2026-09-26 D6) */
    initialClassName?: string;
    loading?: "eager" | "lazy";
    style?: CSSProperties;
}) {
    const [failedSource, setFailedSource] = useState<string | null>(null);

    return (
        <span
            className={cn("nl-avatar", className)}
            style={{ width: size, height: size, ...style }}
            role={!src || failedSource === src ? "img" : undefined}
            aria-label={
                !src || failedSource === src ? alt || undefined : undefined
            }
            aria-hidden={!alt || undefined}
        >
            {src && failedSource !== src ? (
                <Image
                    src={src}
                    alt={alt}
                    width={size}
                    height={size}
                    loading={loading}
                    onError={() => setFailedSource(src)}
                />
            ) : fallbackInitial || fallbackName?.trim() ? (
                <span className={initialClassName} aria-hidden>
                    {fallbackInitial ??
                        Array.from(fallbackName!.trim())[0].toLocaleUpperCase()}
                </span>
            ) : (
                <User aria-hidden />
            )}
        </span>
    );
}
