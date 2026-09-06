"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export default function Avatar({
    src,
    alt = "",
    size = 44,
    className,
    fallbackName,
}: {
    src?: string | null;
    alt?: string;
    size?: number;
    className?: string;
    fallbackName?: string | null;
}) {
    const [failedSource, setFailedSource] = useState<string | null>(null);

    return (
        <span
            className={cn("nl-avatar", className)}
            style={{ width: size, height: size }}
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
                    onError={() => setFailedSource(src)}
                />
            ) : fallbackName?.trim() ? (
                <span className="nl-metadata" aria-hidden>
                    {Array.from(fallbackName.trim())[0].toLocaleUpperCase()}
                </span>
            ) : (
                <User aria-hidden />
            )}
        </span>
    );
}
