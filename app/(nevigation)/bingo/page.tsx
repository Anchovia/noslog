import db from "@/lib/db";
import Link from "next/link";

export default async function Bingo() {
    const bingos = await db.bingo.findMany({
        select: {
            id: true,
            music_idx: true,
            nos: true,
            music: {
                select: {
                    title: true,
                    background: true,
                },
            },
        },
    });
    return (
        <main className="max-w-screen-md flex flex-col gap-8 p-8 items-center mx-auto">
            <div className="w-full flex justify-between items-center">
                <h1 className="text-primary">빙고</h1>
            </div>
            <div className="w-full grid grid-cols-2 gap-4">
                {bingos.map((bingo, idx) => (
                    <Link
                        key={idx}
                        href={`/bingo/${bingo.id}`}
                        style={{
                            backgroundImage: `${
                                bingo.music.background
                                    ? `url(${bingo.music.background})`
                                    : `url(https://p.eagate.573.jp/game/nostalgia/op3/img/jacket.html?c=${bingo.music_idx})`
                            }`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                        className="relative aspect-square rounded-3xl overflow-hidden flex mix-blend-screen ring-2 ring-dark-primary hover:ring-white-secondary ease-in-out transition-shadow"
                    >
                        <div className="w-full h-full absolute backdrop-blur-0 bg-black/60 blur-sm" />
                        <div className="w-full h-full absolute flex items-center justify-center">
                            <div className="w-full flex flex-col items-center p-4 text-center bg-dark-quaternary mix-blend-screen">
                                <h1 className="text-tertiary">
                                    {bingo.music.title}
                                </h1>
                                <h2 className="text-quaternary">
                                    {bingo.nos}nos
                                </h2>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
