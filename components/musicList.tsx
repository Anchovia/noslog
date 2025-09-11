"use client";

import { getMoreMusics } from "@/app/(nevigation)/music/action";
import Image from "next/image";
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
}

export default function MusicList({ initialMusics }: MusicListProps) {
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
                    const newMusics = await getMoreMusics(page + 1);
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
        <main className="w-full h-full">
            <section className="px-6 py-4">
                <form className="p-2 flex items-center justify-center gap-2  bg-dark-secondary rounded-lg">
                    <Image
                        src={"/icon/arrowDown.png"}
                        alt={"arrowDown"}
                        width={28}
                        height={28}
                    />
                    <input
                        placeholder="검색"
                        className="w-full px-4 py-2 text-sm bg-dark-primary"
                    />
                    <Image
                        src={"/icon/search.png"}
                        alt={"search"}
                        width={28}
                        height={28}
                    />
                </form>
            </section>
            <section className="px-6 flex flex-col mx-auto items-center gap-2 w-full h-full max-w-lg">
                {musics.map((music) => (
                    <MusicCard key={music.index} {...music} />
                ))}
                {!isLastPage ? (
                    <span
                        ref={trigger}
                        className="text-sm font-semibold bg-dark-tertiary w-fit mx-auto px-3 py-2 rounded-md active:scale-95"
                    >
                        {isLoading ? "로딩 중..." : "더 가져오기"}
                    </span>
                ) : null}
            </section>
        </main>
    );
}
