"use client";
import { getMoreRecentPlays } from "@/app/(nevigation)/profile/[id]/actions";
import formatToTimeAgo, { formatToComma, formatToGrade } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface RecentPlayProps {
    initialRecentPlays: any;
    id: number;
}

export default function RecentPlay({
    initialRecentPlays,
    id,
}: RecentPlayProps) {
    const [recentPlays, setRecentPlays] = useState(initialRecentPlays);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLastPage, setIsLastPage] = useState(false);

    const diffArr: any = ["Normal", "Hard", "Expert", "Real"];
    const diffColor: any = {
        [diffArr[0]]: "text-normal",
        [diffArr[1]]: "text-hard",
        [diffArr[2]]: "text-expert",
        [diffArr[3]]: "text-real",
    };

    const handleClick = async () => {
        setIsLoading(true);
        const newPlays = await getMoreRecentPlays(page + 1, id);
        if (newPlays.length !== 0) {
            setRecentPlays((prev: any) => [...prev, ...newPlays]);
            setPage((prev) => prev + 1);
        } else {
            setIsLastPage(true);
        }
        setIsLoading(false);
    };
    return (
        <section className="bg-dark-secondary flex flex-col rounded-xl">
            <article className="bg-dark-quinary text-secondary rounded-t-xl p-4 text-center">
                최근 플레이
            </article>
            <article className="flex flex-col gap-4 p-4">
                {recentPlays.map((history: any, idx: number) => (
                    <Link
                        href={`/music/${history.music_idx}/${history.difficulty}`}
                        key={idx}
                        className="*:p-3"
                    >
                        <div className="bg-dark-quaternary flex items-center justify-between gap-4 rounded-t-xl">
                            <div className="flex gap-2">
                                <Image
                                    src={`https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_${history.rank}.png`}
                                    alt="123"
                                    width={34}
                                    height={34}
                                />
                            </div>
                            <div className="text-quinary flex flex-1 flex-col gap-0.5">
                                <span className="text-tertiary">
                                    {history.music.title}
                                </span>
                                <span
                                    className={`${
                                        diffColor[history.difficulty]
                                    } font-serif`}
                                >
                                    {history.difficulty}
                                </span>
                            </div>
                            <span className="text-tertiary">
                                {formatToGrade(history.grade_basic)} Grd
                            </span>
                        </div>
                        <div className="bg-dark-tertiary flex items-center justify-between rounded-b-xl">
                            <div className="flex flex-col">
                                <span className="text-quaternary">
                                    {formatToComma(history.score)}점
                                </span>
                                <span className="text-senary">
                                    {formatToComma(history.max_combo)}x
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-senary">
                                    {formatToTimeAgo(history.play_time)}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
                {!isLastPage && (
                    <button
                        onClick={handleClick}
                        disabled={isLoading}
                        className="bg-dark-tertiary text-quaternary mx-auto rounded-full px-12 py-1.5 disabled:cursor-not-allowed"
                    >
                        더 불러오기
                    </button>
                )}
            </article>
        </section>
    );
}
