import {
    getMoreBasicBestPlays,
    getMoreRecitalBestPlays,
} from "@/app/(nevigation)/profile/[id]/actions";
import { formatToComma, formatToGrade } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface BestPlayProps {
    initialBasicBestPlays: any;
    initialRecitalBestPlays: any;
    id: number;
    isRecital: boolean;
}

export default function BestPlay({
    initialBasicBestPlays,
    initialRecitalBestPlays,
    id,
    isRecital,
}: BestPlayProps) {
    const [basicBestPlays, setBasicBestPlays] = useState(initialBasicBestPlays);
    const [recitalBestPlays, setRecitalBestPlays] = useState(
        initialRecitalBestPlays
    );
    const [basicPage, setBasicPage] = useState(0);
    const [recitalPage, setRecitalPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isBasicLastPage, setIsBasicLastPage] = useState(false);
    const [isRecitalLastPage, setRecitalLastPage] = useState(false);

    const diffArr: any = ["Normal", "Hard", "Expert", "Real"];
    const diffColor: any = {
        [diffArr[0]]: "text-normal",
        [diffArr[1]]: "text-hard",
        [diffArr[2]]: "text-expert",
        [diffArr[3]]: "text-real",
    };

    const handleClick = async () => {
        setIsLoading(true);
        if (isRecital) {
            const newPlays = await getMoreRecitalBestPlays(basicPage + 1, id);
            if (newPlays.length !== 0) {
                setRecitalBestPlays((prev: any) => [...prev, ...newPlays]);
                setBasicPage((prev) => prev + 1);
            } else {
                setIsBasicLastPage(true);
            }
        } else {
            const newPlays = await getMoreBasicBestPlays(recitalPage + 1, id);
            if (newPlays.length !== 0) {
                setBasicBestPlays((prev: any) => [...prev, ...newPlays]);
                setRecitalPage((prev) => prev + 1);
            } else {
                setRecitalLastPage(true);
            }
        }
        setIsLoading(false);
    };
    return (
        <section className="flex flex-col bg-dark-secondary/50 rounded-xl">
            <article className="p-4 text-center bg-dark-tertiary text-md rounded-t-xl">
                베스트 플레이
            </article>
            <article className="flex flex-col p-4 gap-4 ">
                {isRecital ? (
                    <>
                        {recitalBestPlays.map((history: any, idx: number) => (
                            <Link
                                href={`/music/${history.music_idx}/${history.difficulty}`}
                                key={idx}
                                className="*:p-3"
                            >
                                <div className="flex bg-dark-tertiary justify-between items-center rounded-xl gap-4">
                                    <div className="flex flex-col gap-0.5 flex-1">
                                        <span className="text-xl">
                                            {history.music.title}
                                        </span>
                                        <span
                                            className={`${
                                                diffColor[history.difficulty]
                                            } text-sm font-serif`}
                                        >
                                            {history.difficulty}
                                        </span>
                                        <span className="text-xs text-white-secondary">
                                            {history.play_time}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        {history.fc_type === 2 && (
                                            <Image
                                                src={`https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_fc_bg.png`}
                                                alt="123"
                                                width={34}
                                                height={34}
                                            />
                                        )}
                                        <Image
                                            src={`https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_${history.rank.toLowerCase()}.png`}
                                            alt="123"
                                            width={34}
                                            height={34}
                                        />
                                    </div>
                                </div>
                                <div className="bg-dark-secondary flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span>
                                            {formatToComma(history.score)}점
                                        </span>
                                        <span className="text-xs text-white-secondary">
                                            {formatToComma(history.max_combo)}x
                                        </span>
                                    </div>
                                    <span>
                                        {formatToGrade(history.grade_recital)}{" "}
                                        Grd
                                    </span>
                                </div>
                            </Link>
                        ))}
                        {!isRecitalLastPage && (
                            <button
                                onClick={handleClick}
                                disabled={isLoading}
                                className="disabled:cursor-not-allowed mx-auto rounded-full px-12 py-1.5 bg-dark-tertiary"
                            >
                                더 불러오기
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        {basicBestPlays.map((history: any, idx: number) => (
                            <Link
                                href={`/music/${history.music_idx}/${history.difficulty}`}
                                key={idx}
                                className="*:p-3"
                            >
                                <div className="flex bg-dark-tertiary justify-between items-center rounded-xl gap-4">
                                    <div className="flex flex-col gap-0.5 flex-1">
                                        <span className="text-xl">
                                            {history.music.title}
                                        </span>
                                        <span
                                            className={`${
                                                diffColor[history.difficulty]
                                            } text-sm font-serif`}
                                        >
                                            {history.difficulty}
                                        </span>
                                        <span className="text-xs text-white-secondary">
                                            {history.play_time}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        {history.fc_type === 2 && (
                                            <Image
                                                src={`https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_fc_bg.png`}
                                                alt="123"
                                                width={34}
                                                height={34}
                                            />
                                        )}
                                        <Image
                                            src={`https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_${history.rank.toLowerCase()}.png`}
                                            alt="123"
                                            width={34}
                                            height={34}
                                        />
                                    </div>
                                </div>
                                <div className="bg-dark-secondary flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span>
                                            {formatToComma(history.score)}점
                                        </span>
                                        <span className="text-xs text-white-secondary">
                                            {formatToComma(history.max_combo)}x
                                        </span>
                                    </div>
                                    <span>
                                        {formatToGrade(history.grade_basic)} Grd
                                    </span>
                                </div>
                            </Link>
                        ))}
                        {!isBasicLastPage && (
                            <button
                                onClick={handleClick}
                                disabled={isLoading}
                                className="disabled:cursor-not-allowed mx-auto rounded-full px-12 py-1.5 bg-dark-tertiary"
                            >
                                더 불러오기
                            </button>
                        )}
                    </>
                )}
            </article>
        </section>
    );
}
