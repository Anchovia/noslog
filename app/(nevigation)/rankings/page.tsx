import db from "@/lib/db";
import { formatToComma, formatToGrade } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function Rankings() {
    const rankingDatas = await db.user.findMany({
        select: {
            id: true,
            country: true,
            username: true,
            grade_basic: true,
            score_p: true,
            score_f: true,
            score_s: true,
        },
        orderBy: { grade_basic: "desc" },
    });

    return (
        <main className="max-w-screen-md mx-auto p-8 min-h-screen">
            <h1 className="text-primary">랭킹</h1>
            <div className="flex gap-4">
                <h2>국가별</h2>
                <span>ko-KR</span>
                <span>ja-JP</span>
                <span>other</span>
            </div>
            <table className="w-full h-full">
                <thead className="w-full">
                    <tr>
                        <td className="w-1"></td>
                        <td className="w-10"></td>
                        <td></td>
                        <td className="w-14 text-center">Grade</td>
                        <td className="w-14 text-center">
                            <Image
                                className="mx-auto"
                                width={24}
                                height={24}
                                src={`https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_p.png`}
                                alt="p"
                            />
                        </td>
                        <td className="w-14 text-center">
                            <Image
                                className="mx-auto"
                                width={24}
                                height={24}
                                src={`https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_fc_bg.png`}
                                alt="S"
                            />
                        </td>
                        <td className="w-14 text-center">
                            <Image
                                className="mx-auto"
                                width={24}
                                height={24}
                                src={`https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_s.png`}
                                alt="s"
                            />
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {rankingDatas.map((rankingData, index) => (
                        <tr key={index} className="">
                            <td className="w-1 text-left">#{index + 1}</td>
                            <td className="w-10">
                                <Image
                                    className="mx-auto"
                                    width={24}
                                    height={24}
                                    src={`/flag/${rankingData.country}.svg`}
                                    alt={rankingData.country}
                                />
                            </td>
                            <td>
                                <Link href={`/profile/${rankingData.id}`}>
                                    {rankingData.username}
                                </Link>
                            </td>
                            <td className="w-14 text-center">
                                {formatToGrade(rankingData.grade_basic)}
                            </td>
                            <td className="w-14 text-center">
                                {formatToComma(rankingData.score_p)}
                            </td>
                            <td className="w-14 text-center">
                                {formatToComma(rankingData.score_f)}
                            </td>
                            <td className="w-14 text-center">
                                {formatToComma(rankingData.score_s)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}
