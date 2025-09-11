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
                href={`/music/${index}/Normal/basic`}
                className="w-full flex bg-dark-tertiary rounded-lg overflow-hidden border border-dark-secondary"
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
                    className="size-24 border-r border-dark-secondary relative"
                >
                    {/* 카테고리 */}
                    <div
                        className={`${categoryColor[category_short]} border-8 border-r-transparent border-b-transparent absolute`}
                    />
                </div>
                {/* 콘텐츠 */}
                <div className="flex flex-1 p-3.5 justify-between items-center">
                    {/* 제목, 아티스트 */}
                    <div className="flex flex-col gap-1.5 flex-1 pr-3">
                        <h1 className="flex text-white-primary leading-[1.175rem] font-medium">
                            {title}
                        </h1>
                        <span className="flex text-xs text-white-secondary font-light">
                            {artist}
                        </span>
                    </div>
                    {/* 북마크, 난이도 */}
                    <div className="flex flex-col h-full gap-1.5 justify-end items-center">
                        <div className="flex text-sm font-medium justify-center items-center w-14 gap-1">
                            {difficulty_levels.split(",").map((level, idx) => (
                                <div
                                    key={idx}
                                    className={diffColor[diffArr[idx]]}
                                >
                                    {level}
                                </div>
                            ))}
                            {sheet_len < 4 && (
                                <div className=" text-real">-</div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
}
