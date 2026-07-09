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
        <main className="mx-auto flex max-w-(--breakpoint-sm) flex-col gap-6 p-8">
            {/* 카테고리, 리사이틀 버튼 */}
            <section className="flex justify-between">
                <article className="bg-dark-secondary rounded-full px-3 py-1">
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
            <div className="border-dark-secondary border" />
            {/* 난이도 링크 */}
            <section className="flex justify-between">
                {diffArr.map((diff: any, idx: number) =>
                    sheet_len === 3 && idx === 3 ? (
                        <div
                            key={diff}
                            className={`flex h-32 w-24 flex-col items-center gap-2 ${
                                difficulty === diff
                                    ? "border-dark-tertiary border-b-4"
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
                                } font-serif text-xl ${
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
                            className={`flex h-32 w-24 flex-col items-center gap-2 ${
                                difficulty === diff
                                    ? "border-dark-tertiary border-b-4"
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
                                } font-serif text-xl ${
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
                <article className="*:bg-dark-secondary flex w-full items-center justify-between gap-4 text-lg font-semibold *:flex *:aspect-square *:w-full *:flex-col *:items-center *:justify-center *:rounded-2xl">
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
            <div className="border-dark-secondary border" />
            {/* 랭킹 */}
            <MusicRankTable
                basicPlayDatas={basicPlayDatas}
                recitalPlayDatas={recitalPlayDatas}
                isRecital={isRecital}
            />
        </main>
    );
}
