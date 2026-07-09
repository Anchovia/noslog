import Link from "next/link";

export default function MusicCard({
    index,
    background,
    title,
    artist,
    category_short,
    sheet_len,
    difficulty_levels,
}: {
    index: string;
    background: string | null;
    title: string;
    artist: string | null;
    category_short: string;
    sheet_len: number;
    difficulty_levels: string;
}) {
    const diffArr: any = ["Normal", "Hard", "Expert", "Real"];
    const diffColor: any = {
        [diffArr[0]]: "text-normal",
        [diffArr[1]]: "text-hard",
        [diffArr[2]]: "text-expert",
        [diffArr[3]]: "text-real",
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
        <>
            <Link
                key={index}
                href={`/music/${index}/Normal`}
                className="bg-dark-secondary border-dark-secondary flex w-full overflow-hidden rounded-lg border"
            >
                {/* 자켓 */}
                <div
                    style={{
                        backgroundImage: `${
                            background
                                ? `url(${background})`
                                : `url(https://p.eagate.573.jp/game/nostalgia/op3/img/jacket.html?c=${index})`
                        }`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    className="border-dark-secondary relative size-24 border-r"
                >
                    {/* 카테고리 */}
                    <div
                        className={`${categoryColor[category_short]} absolute border-8 border-r-transparent border-b-transparent`}
                    />
                </div>
                {/* 콘텐츠 */}
                <div className="flex flex-1 items-center justify-between p-3.5">
                    {/* 제목, 아티스트 */}
                    <div className="flex flex-1 flex-col gap-1.5 pr-3">
                        <h1 className="text-white-primary flex leading-[1.175rem] font-medium">
                            {title}
                        </h1>
                        <span className="text-white-secondary flex text-xs font-light">
                            {artist}
                        </span>
                    </div>
                    {/* 북마크, 난이도 */}
                    <div className="flex h-full flex-col items-center justify-end gap-1.5">
                        <div className="flex w-14 items-center justify-center gap-1 text-sm font-medium">
                            {difficulty_levels.split(",").map((level, idx) => (
                                <div
                                    key={idx}
                                    className={diffColor[diffArr[idx]]}
                                >
                                    {level}
                                </div>
                            ))}
                            {sheet_len < 4 && (
                                <div className="text-real">-</div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
}
