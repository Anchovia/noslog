import Link from "next/link";

import { cn } from "@/lib/utils";
import type { MusicItem } from "./musicList";

type Difficulty = "Normal" | "Hard" | "Expert" | "Real";

const categoryStyle: Record<string, string> = {
    pops: "bg-genre-pops text-text-primary",
    anime: "bg-genre-anime text-text-primary",
    BM: "bg-genre-bm text-text-primary",
    Org: "bg-genre-original text-text-primary",
    Var: "bg-genre-variety text-text-primary",
    var: "bg-genre-variety text-text-primary",
    "Cl/Jz": "bg-genre-classic-jazz text-text-primary",
};

const difficultyBadges: {
    key: Difficulty;
    className: string;
    getLevel: (music: MusicItem) => number | null;
}[] = [
    {
        key: "Normal",
        className: "bg-normal/15 text-normal",
        getLevel: (music) => music.normal,
    },
    {
        key: "Hard",
        className: "bg-hard/15 text-hard",
        getLevel: (music) => music.hard,
    },
    {
        key: "Expert",
        className: "bg-expert/15 text-expert",
        getLevel: (music) => music.expert,
    },
    {
        key: "Real",
        className: "bg-real/15 text-real",
        getLevel: (music) => music.real,
    },
];

// 그리드 보기에서 자켓 중심의 악곡 정보를 표시함
export default function MusicGridCard(props: MusicItem) {
    const { index, title, artist, background, category_short } = props;
    const defaultDifficulty: Difficulty = "Normal";
    const jacketImageUrl =
        background ||
        `https://p.eagate.573.jp/game/nostalgia/op3/img/jacket.html?c=${index}`;

    return (
        <Link
            href={`/music/${index}/${defaultDifficulty}`}
            className="bg-surface rounded-card hover:bg-surface-muted min-w-0 overflow-hidden transition-colors"
        >
            <div
                className="bg-surface-muted relative aspect-square w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${jacketImageUrl})` }}
                aria-hidden="true"
            >
                <span
                    className={cn(
                        "absolute top-2 left-2 rounded px-1.5 py-1 text-xs leading-none font-bold",
                        categoryStyle[category_short] ??
                            "bg-border text-text-secondary"
                    )}
                >
                    {category_short}
                </span>
            </div>

            <div className="flex min-w-0 flex-col gap-1.5 p-3">
                <h2 className="text-text-primary truncate text-sm leading-snug font-semibold">
                    {title}
                </h2>
                <p className="text-text-secondary truncate text-xs leading-normal">
                    {artist || "아티스트 미상"}
                </p>

                <div className="flex items-center gap-1">
                    {difficultyBadges.map((difficulty) => {
                        const level = difficulty.getLevel(props);

                        return (
                            <span
                                key={difficulty.key}
                                className={cn(
                                    "flex h-5 min-w-5 items-center justify-center rounded px-1 text-[10px] leading-none font-bold",
                                    difficulty.className
                                )}
                                title={difficulty.key}
                            >
                                {level ?? "-"}
                            </span>
                        );
                    })}
                </div>
            </div>
        </Link>
    );
}
