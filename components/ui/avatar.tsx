"use client";

import { User } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useState } from "react";

import { cn } from "@/lib/cn";

/** 그림 원본 크기 힌트(next/image). 그리는 크기는 `size` 를 주지 않으면 CSS 클래스가 정한다 */
const IMAGE_SIZE_HINT = 44;

export default function Avatar({
    src,
    alt = "",
    size,
    className,
    fallbackName,
    fallbackInitial,
    initialClassName = "nl-metadata",
    loading,
    style,
}: {
    src?: string | null;
    alt?: string;
    /** 숫자 크기 — 없으면 자리(부모 · 크기 클래스)가 정한다(헤더는 칸을 채움, 2026-10-15) */
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
            style={
                size === undefined
                    ? style
                    : { width: size, height: size, ...style }
            }
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
                    width={size ?? IMAGE_SIZE_HINT}
                    height={size ?? IMAGE_SIZE_HINT}
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
