"use client";

import { User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/cn";

/** next/image 에 요청할 원본 크기. 그리는 크기는 CSS 클래스(`nl-avatar--*`)가 정하고, 크기가 없으면 자리(부모)가 정한다 */
const IMAGE_SIZE_HINT = {
    small: 24,
    compact: 32,
    medium: 40,
    large: 64,
    profile: 108,
} as const;
const DEFAULT_IMAGE_SIZE_HINT = 44;

export type AvatarSize = keyof typeof IMAGE_SIZE_HINT;

export default function Avatar({
    src,
    alt = "",
    size,
    className,
    fallbackName,
    fallbackInitial,
    initialClassName = "nl-metadata",
    loading,
}: {
    src?: string | null;
    alt?: string;
    /** 크기 단계 — 없으면 자리(부모)가 정한다(헤더는 칸을 채움) */
    size?: AvatarSize;
    className?: string;
    fallbackName?: string | null;
    fallbackInitial?: string;
    /** 첫 글자 글자 스타일 — 기본 metadata, 프로필 머리 108 만 display(2026-09-26 D6) */
    initialClassName?: string;
    loading?: "eager" | "lazy";
}) {
    const imageSize = size ? IMAGE_SIZE_HINT[size] : DEFAULT_IMAGE_SIZE_HINT;
    const [failedSource, setFailedSource] = useState<string | null>(null);

    return (
        <span
            className={cn("nl-avatar", size && `nl-avatar--${size}`, className)}
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
                    width={imageSize}
                    height={imageSize}
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
