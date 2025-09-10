import db from "@/lib/db";
import { existsSync } from "fs";
import Image from "next/image";
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
            difficulty_levels: true,
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

    const categoryColor: any = {
        "Cl/Jz": "border-green-500",
        Var: "border-amber-500",
        Org: "border-orange-500",
        BM: "border-blue-500",
        anime: "border-pink-500",
        pops: "border-red-500",
    };

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
                {data.map((music) => (
                    <Link
                        key={music.index}
                        href={`/music/${music.index}/Normal`}
                        className="w-full flex bg-dark-tertiary rounded-lg overflow-hidden border border-dark-secondary"
                    >
                        {/* 자켓 */}
                        <div
                            style={{
                                backgroundImage: `${
                                    music.background
                                        ? `url(${music.background})`
                                        : getPublic(music.index)
                                }`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                            className="size-24 border-r border-dark-secondary relative"
                        >
                            {/* 카테고리 */}
                            <div
                                className={`${
                                    categoryColor[music.category_short]
                                } border-8 border-r-transparent border-b-transparent absolute`}
                            />
                        </div>
                        {/* 콘텐츠 */}
                        <div className="flex flex-1 p-3.5 justify-between items-center">
                            {/* 제목, 아티스트 */}
                            <div className="flex flex-col gap-1.5 flex-1 pr-3">
                                <h1 className="flex text-white-primary leading-[1.175rem] font-medium">
                                    {music.title}
                                </h1>
                                <span className="flex text-xs text-white-secondary font-light">
                                    {music.artist}
                                </span>
                            </div>
                            {/* 랭크, 난이도 */}
                            <div className="flex flex-col gap-1.5 justify-between items-center">
                                <div className="relative size-9 aspect-square">
                                    <Image
                                        src={
                                            "https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_fc_bg.png"
                                        }
                                        fill
                                        alt={"fc"}
                                    />
                                </div>
                                <div className="flex text-sm font-medium  justify-center items-center w-14 gap-1">
                                    <div className=" text-normal">1</div>
                                    <div className=" text-hard">4</div>
                                    <div className=" text-expert">10</div>
                                    {music.sheet_len > 3 ? (
                                        <div className=" text-real">2</div>
                                    ) : (
                                        <div className=" text-real">-</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </section>
        </main>
    );
}
