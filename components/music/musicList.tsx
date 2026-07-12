"use client";

import { getMoreMusics } from "@/app/(nevigation)/music/action";
import { useEffect, useRef, useState } from "react";
import MusicCard from "./musicCard";

interface MusicListProps {
    initialMusics: {
        index: string;
        title: string;
        artist: string | null;
        category_short: string;
        background: string | null;
        sheet_len: number;
        difficulty_levels: string;
    }[];
    searchParams: {
        q?: string;
        normal?: string;
        hard?: string;
        expert?: string;
        real?: string;
    };
}

export default function MusicList({
    initialMusics,
    searchParams,
}: MusicListProps) {
    const [musics, setMusics] = useState(initialMusics);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLastPage, setIsLastPage] = useState(false);
    const trigger = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            async (
                entries: IntersectionObserverEntry[],
                observer: IntersectionObserver
            ) => {
                const element = entries[0];
                if (element.isIntersecting && trigger.current) {
                    observer.unobserve(trigger.current);

                    setIsLoading(true);
                    const newMusics = await getMoreMusics(
                        page + 1,
                        searchParams
                    );
                    if (newMusics.length !== 0) {
                        setMusics((prev) => [...prev, ...newMusics]);
                        setPage((prev) => prev + 1);
                    } else {
                        setIsLastPage(true);
                    }
                    setIsLoading(false);
                }
            },
            {
                threshold: 1.0,
            }
        );
        if (trigger.current) {
            observer.observe(trigger.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [page]);

    return (
        <section className="flex h-full w-full flex-col items-center gap-2 px-6">
            {musics.map((music) => (
                <MusicCard key={music.index} {...music} />
            ))}
            {!isLastPage ? (
                <span
                    ref={trigger}
                    className="bg-dark-tertiary mx-auto w-fit rounded-md px-3 py-2 text-sm font-semibold active:scale-95"
                >
                    {isLoading ? "로딩 중..." : "더 가져오기"}
                </span>
            ) : null}
        </section>
    );
}
