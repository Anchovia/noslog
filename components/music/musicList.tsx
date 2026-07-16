"use client";

import { getMoreMusics } from "@/app/(nevigation)/music/action";
import type { MusicSearchParams } from "@/app/(nevigation)/music/query";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import MusicCard from "./musicCard";
import MusicGridCard from "./musicGridCard";
import type { ViewMode } from "./musicToolbar";

export interface MusicItem {
    index: string;
    title: string;
    artist: string | null;
    category_short: string;
    background: string | null;
    normal: number;
    hard: number;
    expert: number;
    real: number | null;
}

interface MusicListProps {
    initialPage: {
        items: MusicItem[];
        nextCursor: string | null;
    };
    searchParams: MusicSearchParams;
    viewMode: ViewMode;
}

export default function MusicList({
    initialPage,
    searchParams,
    viewMode,
}: MusicListProps) {
    const [musics, setMusics] = useState<MusicItem[]>(initialPage.items);
    const [cursor, setCursor] = useState<string | null>(initialPage.nextCursor);
    const [isLoading, setIsLoading] = useState(false);
    const trigger = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const triggerElement = trigger.current;

        if (!triggerElement || !cursor || isLoading) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const element = entries[0];

                if (!element.isIntersecting) {
                    return;
                }

                observer.unobserve(triggerElement);
                setIsLoading(true);

                void getMoreMusics(cursor, searchParams)
                    .then((nextPage) => {
                        setMusics((prev) => [...prev, ...nextPage.items]);
                        setCursor(nextPage.nextCursor);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            },
            {
                threshold: 1.0,
            }
        );

        observer.observe(triggerElement);

        return () => {
            observer.disconnect();
        };
    }, [cursor, searchParams, isLoading]);

    return (
        <section
            className={cn(
                "h-full w-full gap-2",
                viewMode === "grid"
                    ? "grid grid-cols-2 items-start"
                    : "flex flex-col"
            )}
        >
            {musics.map((music) =>
                viewMode === "grid" ? (
                    <MusicGridCard key={music.index} {...music} />
                ) : (
                    <MusicCard key={music.index} {...music} />
                )
            )}

            {cursor && (
                <span
                    ref={trigger}
                    className={cn(
                        "bg-surface-muted text-caption text-text-secondary rounded-card mx-auto w-fit px-3 py-2 font-semibold",
                        viewMode === "grid" && "col-span-2"
                    )}
                >
                    {isLoading ? "로딩 중..." : "스크롤하면 계속 로드 ..."}
                </span>
            )}
        </section>
    );
}
