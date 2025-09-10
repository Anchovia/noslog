import { diffArr, diffColor } from "@/lib/constants";
import { formatToComma, formatToGrade, getPublic } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface MusicDetailProps {
    isRecital: boolean;
    category: string;
    index: string;
    grade: number;
    title: string;
    artist: string | null;
    level: number;
    score: number;
    max_combo: number;
    play_count: number;
    difficulty: string;
    sheet_len: number;
    difficulty_levels: string;
}

export default function MusicDetail({
    isRecital,
    category,
    index,
    grade,
    title,
    artist,
    level,
    score,
    max_combo,
    play_count,
    difficulty,
    sheet_len,
    difficulty_levels,
}: MusicDetailProps) {
    const gradeType = isRecital ? "recital" : "basic";
    const difficultyLevels = difficulty_levels
        .split(",")
        .map((level) => level.trim());

    return (
        <main className="p-8 flex flex-col gap-6">
            {/* 카테고리, 리사이틀 버튼 */}
            <section className="flex justify-between">
                <article className="px-3 py-1 bg-dark-secondary rounded-full">
                    {category}
                </article>
                {isRecital ? (
                    <Link
                        href={`/music/${index}/${difficulty}/basic`}
                        className="flex gap-2"
                    >
                        <span>Recital</span>
                        <div className="flex w-10 h-6 rounded-full bg-blue-500 items-center justify-end px-1">
                            <div className="size-4 bg-white-secondary rounded-full" />
                        </div>
                    </Link>
                ) : (
                    <Link
                        href={`/music/${index}/${difficulty}/recital`}
                        className="flex gap-2"
                    >
                        <span>Recital</span>
                        <div className="flex w-10 h-6 rounded-full bg-dark-tertiary items-center justify-start px-1">
                            <div className="size-4 bg-white-secondary rounded-full" />
                        </div>
                    </Link>
                )}
            </section>
            {/* 자켓, 제목, 아티스트, 그레이드 */}
            <section className="flex justify-between items-center gap-6">
                {/* 자켓, 제목, 아티스트 */}
                <article className="flex items-center gap-6">
                    <div
                        style={{
                            backgroundImage: getPublic(index),
                            backgroundSize: "cover",
                        }}
                        className="size-24 aspect-square border border-white/50"
                    />
                    <div className="flex flex-col">
                        <h1 className="font-bold text-2xl">{title}</h1>
                        <h2 className="font-normal text-xl text-white/80">
                            {artist}
                        </h2>
                    </div>
                </article>
                {/* 그레이드 */}
                <article className="flex flex-col items-center">
                    <span className="text-lg">Grd.</span>
                    <span className="text-xl font-bold">
                        {formatToGrade(grade)}
                    </span>
                </article>
            </section>
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
                            href={`/music/${index}/${diff}/${gradeType}`}
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
            <div className="border border-dark-secondary" />
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
            <section className="flex flex-col items-center gap-6">
                <h1 className="text-2xl">랭킹</h1>
            </section>
        </main>
    );
}
