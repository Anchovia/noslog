import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToComma, formatToGrade } from "@/lib/utils";
import { existsSync } from "fs";
import Image from "next/image";
import Link from "next/link";
import path from "path";

export default async function MusicDetail({
    params,
}: {
    params: { index: string; difficulty: string };
}) {
    // public 폴더에 이미지가 존재하는지 확인하는 함수
    const getPublic = (index: string) => {
        // 이미지 path 생성
        const imagePath = path.join(
            process.cwd(),
            "public",
            "bg",
            `${index}.png`
        );
        // existsSync로 이미지 존재 여부 확인
        if (existsSync(imagePath)) {
            return `url(/bg/${index}.png)`;
        } else {
            return `url(https://p.eagate.573.jp/game/nostalgia/op3/img/jacket.html?c=${index})`;
        }
    };

    const music = await db.music.findUnique({
        where: { index: params.index },
        select: {
            index: true,
            background: true,
            title: true,
            artist: true,
            category: true,
            sheet_len: true,
        },
    });

    const session = await getSession();
    const userData = await db.playData.findMany({
        where: {
            music_idx: params.index,
            user_id: session.id,
            difficulty: params.difficulty,
        },
    });

    const diffArr: any = ["Normal", "Hard", "Expert", "Real"];
    const diffColor: any = {
        [diffArr[0]]: "text-green-500",
        [diffArr[1]]: "text-yellow-500",
        [diffArr[2]]: "text-red-500",
        [diffArr[3]]: "text-purple-500",
    };

    const {
        grade_basic,
        grade_recital,
        level,
        score,
        max_combo,
        play_count,
        rank,
    } = userData[0];

    // todo: 데이터 스키마에 난이도 레벨 리스트 넣은 후 불러오기
    // todo2: 그 스키마에 달성 rank도 리스트로 추가하기

    return (
        <main className="p-8 flex flex-col gap-6">
            {/* 카테고리, 리사이틀 버튼 */}
            <section className="flex justify-between">
                <article className="px-3 py-1 bg-neutral-800 rounded-full">
                    {music?.category}
                </article>
                <article className="flex text-lg items-center gap-2">
                    <span>Recital</span>
                    <div className="flex w-10 h-6 rounded-full bg-neutral-700 items-center justify-end px-1">
                        <div className="size-4 bg-white rounded-full" />
                    </div>
                </article>
            </section>
            {/* 자켓, 제목, 아티스트, 그레이드 */}
            <section className="flex justify-between items-center gap-6">
                {/* 자켓, 제목, 아티스트 */}
                <article className="flex items-center gap-6">
                    <div
                        style={{ backgroundImage: getPublic(music!.index) }}
                        className="size-24 aspect-square border border-white/50"
                    />
                    <div className="flex flex-col">
                        <h1 className="font-bold text-2xl">{music?.title}</h1>
                        <h2 className="font-normal text-xl text-white/80">
                            {music?.artist}
                        </h2>
                    </div>
                </article>
                {/* 그레이드 */}
                <article className="flex flex-col items-center">
                    <span className="text-lg">Grd.</span>
                    <span className="text-xl font-bold">
                        {formatToGrade(grade_basic)}
                    </span>
                </article>
            </section>
            <div className="border border-neutral-800" />
            {/* 난이도 링크 */}
            <section className="flex justify-between">
                {diffArr.map((diff: any, idx: number) => (
                    <Link
                        key={diff}
                        href={`/music/${params.index}/${diff}`}
                        className={`w-24 h-32 flex flex-col items-center gap-2 ${
                            params.difficulty === diff
                                ? "border-b-4 border-neutral-700"
                                : null
                        }`}
                    >
                        <Image
                            className="border-none"
                            src={
                                "https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_fc_bg.png"
                            }
                            alt={idx.toString()}
                            width={48}
                            height={48}
                        />
                        <span
                            className={`${diffColor[diff]} text-xl font-serif ${
                                params.difficulty === diff
                                    ? "font-black"
                                    : "font-normal"
                            }`}
                        >
                            {diff}
                        </span>
                        <span>Lv. {level}</span>
                    </Link>
                ))}
            </section>
            <div className="border border-neutral-800" />
            {/* 플레이어 데이터 */}
            <section className="flex flex-col items-center gap-6">
                <h1 className="text-2xl">플레이데이터</h1>
                <article className="flex w-full justify-between items-center gap-8 *:rounded-2xl *:w-full *:aspect-square *:bg-neutral-800 *:flex *:flex-col *:items-center *:justify-center text-lg font-semibold">
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
            <div className="border border-neutral-800" />
            {/* 랭킹 */}
            <section className="flex flex-col items-center gap-6">
                <h1 className="text-2xl">랭킹</h1>
            </section>
        </main>
    );
}
