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
        <main className="mx-auto flex min-h-screen max-w-(--breakpoint-md) flex-col items-center gap-8 p-8">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-primary">빙고</h1>
            </div>
            <div className="grid w-full grid-cols-2 gap-4">
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
                        className="ring-dark-primary hover:ring-white-secondary relative flex aspect-square overflow-hidden rounded-3xl mix-blend-screen ring-2 transition-shadow ease-in-out"
                    >
                        <div className="backdrop-blur-0 absolute h-full w-full bg-black/60 blur-xs" />
                        <div className="absolute flex h-full w-full items-center justify-center">
                            <div className="bg-dark-quaternary flex w-full flex-col items-center p-4 text-center mix-blend-screen">
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
