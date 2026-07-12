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
    sheet_len: number;
    difficulty_levels: string;
    normal: number;
    hard: number;
    expert: number;
    real: number | null;
}

interface MusicListProps {
    initialMusics: MusicItem[];
    searchParams: MusicSearchParams;
    viewMode: ViewMode;
}

export default function MusicList({
    initialMusics,
    searchParams,
    viewMode,
}: MusicListProps) {
    const [musics, setMusics] = useState<MusicItem[]>(initialMusics);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLastPage, setIsLastPage] = useState(false);
    const trigger = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const triggerElement = trigger.current;

        if (!triggerElement || isLoading || isLastPage) {
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

                void getMoreMusics(page + 1, searchParams)
                    .then((newMusics) => {
                        if (newMusics.length !== 0) {
                            setMusics((prev) => [...prev, ...newMusics]);
                            setPage((prev) => prev + 1);
                        } else {
                            setIsLastPage(true);
                        }
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
    }, [page, searchParams, isLoading, isLastPage]);

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

            {!isLastPage && (
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
