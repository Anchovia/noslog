import db from "@/lib/db";
import { existsSync } from "fs";
import Link from "next/link";
import path from "path";

// todo: 무한 스크롤 기능 제작 필요
// todo2: 필터 기능 제작 필요(카테고리, 난이도, 랭크, 악곡 길이 등등)
// todo3: 악곡 검색 기능 제작 필요(제목, 아티스트 등등)

export default async function Music() {
    const data = await db.music.findMany({
        select: {
            index: true,
            title: true,
            title_kana: true,
            artist: true,
            category_short: true,
            background: true,
            sheet_len: true,
        },
    });

    // public 폴더에 이미지가 존재하는지 확인하는 함수
    const getPublic = (idx: string) => {
        // 이미지 path 생성
        const imagePath = path.join(
            process.cwd(),
            "public",
            "bg",
            `${idx}.png`
        );
        // existsSync로 이미지 존재 여부 확인
        if (existsSync(imagePath)) {
            return `url(/bg/${idx}.png)`;
        } else {
            return `url(https://p.eagate.573.jp/game/nostalgia/op3/img/jacket.html?c=${idx})`;
        }
    };

    return (
        <div>
            <form className="p-8 -mb-8 w-full max-w-lg mx-auto flex flex-col bg-neutral-700 items-center gap-4">
                <input
                    placeholder="악곡 검색"
                    className="w-full px-4 py-2.5 bg-neutral-500"
                />
                <section className="flex gap-4 *:w-full *:bg-neutral-500 *:px-4 *:py-2.5">
                    <input type="text" placeholder="카테고리: Original" />
                    <input type="text" placeholder="정렬: Level" />
                </section>
                <section className="flex w-full justify-between">
                    <article className="flex gap-2 items-center">
                        <span>난이도</span>
                        <div className="size-8 bg-neutral-500 rounded-full" />
                        <div className="size-8 bg-neutral-500 rounded-full" />
                        <div className="size-8 bg-neutral-500 rounded-full" />
                    </article>
                    <article className="flex gap-2 items-center">
                        <span>랭크</span>
                        <div className="size-8 bg-neutral-500 rounded-full" />
                        <div className="size-8 bg-neutral-500 rounded-full" />
                        <div className="size-8 bg-neutral-500 rounded-full" />
                        <div className="size-8 bg-neutral-500 rounded-full" />
                        <div className="size-8 bg-neutral-500 rounded-full" />
                    </article>
                </section>
            </form>
            <section className="py-24 px-16 flex flex-col items-center gap-12 *:w-full *:max-w-lg *:aspect-square *:bg-neutral-500">
                {data.map((music) => (
                    <Link
                        key={music.index}
                        href={`/music/${music.index}`}
                        style={{
                            backgroundImage: `${
                                music.background
                                    ? `url(${music.background})`
                                    : getPublic(music.index)
                            }`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                        className="flex flex-col w-full h-full rounded-b-2xl"
                    >
                        <div className="h-3/5" />
                        <div className="p-4 h-2/5 flex flex-col gap-2 bg-neutral-600 rounded-b-2xl">
                            <div className="flex flex-col flex-1">
                                <h1>{music.title}</h1>
                                <span>{music.artist}</span>
                                {/*<span>{music.index}</span>*/}
                            </div>
                            <hr className="border border-neutral-700" />
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 *:size-8 *:flex *:rounded-full *:justify-center *:items-center *:font-bold *:text-sm">
                                    <div className="border-2 border-green-400 text-green-400">
                                        N
                                    </div>
                                    <div className="border-2 border-orange-400 text-orange-400">
                                        H
                                    </div>
                                    <div className="border-2 border-red-500 text-red-500">
                                        E
                                    </div>
                                    {music.sheet_len > 3 && (
                                        <div className="border-2 border-purple-500 text-purple-500">
                                            R
                                        </div>
                                    )}
                                </div>
                                <div>{music.category_short}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </section>
        </div>
    );
}
