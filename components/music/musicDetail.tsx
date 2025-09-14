"use client";

import { formatToComma } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import RecitalToggleButton from "../button/recitalToggleButton";
import MusicRankTable from "./musicRankTable";
import MusicTitle from "./musicTitle";

interface MusicDetailProps {
    category: string;
    index: string;
    grade_basic: number | null;
    grade_recital: number | null;
    title: string;
    artist: string | null;
    level: number | null;
    score: number | null;
    max_combo: number | null;
    play_count: number | null;
    difficulty: string;
    sheet_len: number;
    difficulty_levels: string;
    background: string | null;
    basicPlayDatas: any;
    recitalPlayDatas: any;
}

const diffArr: any = ["Normal", "Hard", "Expert", "Real"];
const diffColor: any = {
    [diffArr[0]]: "text-normal",
    [diffArr[1]]: "text-hard",
    [diffArr[2]]: "text-expert",
    [diffArr[3]]: "text-real",
};

export default function MusicDetail({
    category,
    index,
    grade_basic,
    grade_recital,
    title,
    artist,
    background,
    score,
    max_combo,
    play_count,
    difficulty,
    sheet_len,
    difficulty_levels,
    basicPlayDatas,
    recitalPlayDatas,
}: MusicDetailProps) {
    const difficultyLevels = difficulty_levels
        .split(",")
        .map((level) => level.trim());

    const [isRecital, setIsRecital] = useState(false);

    return (
        <main className="max-w-screen-sm mx-auto p-8 flex flex-col gap-6">
            {/* 카테고리, 리사이틀 버튼 */}
            <section className="flex justify-between">
                <article className="px-3 py-1 bg-dark-secondary rounded-full">
                    {category}
                </article>
                <RecitalToggleButton
                    isRecital={isRecital}
                    setIsRecital={setIsRecital}
                />
            </section>
            {/* 자켓, 제목, 아티스트, 그레이드 */}
            <MusicTitle
                background={background}
                index={index}
                title={title}
                artist={artist}
                grade_basic={grade_basic}
                grade_recital={grade_recital}
                isRecital={isRecital}
            />
            <div className="border border-dark-secondary" />
            {/* 난이도 링크 */}
            <section className="flex justify-between">
                {diffArr.map((diff: any, idx: number) =>
                    sheet_len === 3 && idx === 3 ? (
                        <div
                            key={diff}
                            className={`w-24 h-32 flex flex-col items-center gap-2 ${
                                difficulty === diff
                                    ? "border-b-4 border-dark-tertiary"
                                    : null
                            }`}
                        >
                            <Image
                                src={
                                    "https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_fc_bg.png"
                                }
                                alt={idx.toString()}
                                width={48}
                                height={48}
                            />
                            <span
                                className={`${
                                    diffColor[diff]
                                } text-xl font-serif ${
                                    difficulty === diff
                                        ? "font-black"
                                        : "font-normal"
                                }`}
                            >
                                {diff}
                            </span>
                            <span>Lv. -</span>
                        </div>
                    ) : (
                        <Link
                            key={diff}
                            href={`/music/${index}/${diff}/`}
                            className={`w-24 h-32 flex flex-col items-center gap-2 ${
                                difficulty === diff
                                    ? "border-b-4 border-dark-tertiary"
                                    : null
                            }`}
                        >
                            <Image
                                src={
                                    "https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_fc_bg.png"
                                }
                                alt={idx.toString()}
                                width={48}
                                height={48}
                            />
                            <span
                                className={`${
                                    diffColor[diff]
                                } text-xl font-serif ${
                                    difficulty === diff
                                        ? "font-black"
                                        : "font-normal"
                                }`}
                            >
                                {diff}
                            </span>
                            <span>Lv. {difficultyLevels[idx]}</span>
                        </Link>
                    )
                )}
            </section>
            {/* 플레이어 데이터 */}
            <section className="flex flex-col items-center gap-6">
                <h1 className="text-2xl">플레이데이터</h1>
                <article className="flex w-full justify-between items-center gap-4 *:rounded-2xl *:w-full *:aspect-square *:bg-dark-secondary *:flex *:flex-col *:items-center *:justify-center text-lg font-semibold">
                    <div>
                        <span>스코어</span>
                        <span>
                            {score === 0 ? "-" : formatToComma(score)} 점
                        </span>
                    </div>
                    <div>
                        <span>콤보</span>
                        <span>
                            {max_combo === 0 ? "-" : formatToComma(max_combo)}{" "}
                            회
                        </span>
                    </div>
                    <div>
                        <span>플레이</span>
                        <span>
                            {play_count === 0 ? "-" : formatToComma(play_count)}{" "}
                            회
                        </span>
                    </div>
                </article>
            </section>
            <div className="border border-dark-secondary" />
            {/* 랭킹 */}
            <MusicRankTable
                basicPlayDatas={basicPlayDatas}
                recitalPlayDatas={recitalPlayDatas}
                isRecital={isRecital}
            />
        </main>
    );
}
