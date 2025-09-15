import db from "@/lib/db";
import Link from "next/link";

export default async function BingoDetail({
    params,
}: {
    params: { id: string };
}) {
    const cells = await db.bingoCell.findMany({
        where: {
            bingo_id: Number(params.id),
        },
        select: {
            challenge: true,
            music_idx: true,
            position: true,
            category_short: true,
        },
        orderBy: {
            challenge: "asc",
        },
    });
    return (
        <main className="p-8 grid grid-cols-5 max-w-screen-sm mx-auto min-h-screen items-center">
            {cells.map((cell, idx) => (
                <div
                    key={idx}
                    className="flex items-center jus text-quinary border aspect-square"
                >
                    {cell.music_idx ? (
                        <Link href={`/music/${cell.music_idx}/Normal`}>
                            {cell.challenge}
                        </Link>
                    ) : cell.category_short ? (
                        <Link href={`/music?category=${cell.category_short}`}>
                            {cell.challenge}
                        </Link>
                    ) : (
                        cell.challenge
                    )}
                </div>
            ))}
        </main>
    );
}
