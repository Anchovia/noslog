"use client";

/* eslint-disable @next/next/no-img-element */

import { Music2 } from "lucide-react";
import { type ReactNode, useState } from "react";

import { getJacketUrl } from "@/lib/tiers";
import { cn } from "@/lib/utils";

interface MusicJacketProps {
    index: string;
    background: string | null;
    title: string;
    className?: string;
    children?: ReactNode;
    fallback?: ReactNode;
}

// 저장된 자켓이 없거나 로딩에 실패하면 공통 대체 이미지를 표시함
export default function MusicJacket({
    index,
    background,
    title,
    className,
    children,
    fallback,
}: MusicJacketProps) {
    const jacketUrl = getJacketUrl(index, background);
    const [failedUrl, setFailedUrl] = useState<string | null>(null);
    const showImage = jacketUrl && failedUrl !== jacketUrl;

    return (
        <span
            className={cn(
                "bg-surface-muted relative flex overflow-hidden",
                className
            )}
            aria-label={`${title} 자켓`}
        >
            {showImage ? (
                <img
                    src={jacketUrl}
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                    onError={() => setFailedUrl(jacketUrl)}
                />
            ) : fallback ? (
                fallback
            ) : (
                <Music2
                    className="text-text-disabled m-auto size-1/3"
                    aria-hidden="true"
                />
            )}
            {children}
        </span>
    );
}
