import Link from "next/link";

import { cn } from "@/lib/utils";

type Difficulty = "Normal" | "Hard" | "Expert" | "Real";

interface MusicCardProps {
    index: string;
    title: string;
    artist: string | null;
    background: string | null;
    category_short: string;
    normal: number;
    hard: number;
    expert: number;
    real: number | null;
}

const categoryStyle: Record<
    string,
    {
        text: string;
    }
> = {
    pops: {
        text: "text-genre-pops",
    },
    anime: {
        text: "text-genre-anime",
    },
    BM: {
        text: "text-genre-bm",
    },
    Org: {
        text: "text-genre-original",
    },
    Var: {
        text: "text-genre-variety",
    },
    var: {
        text: "text-genre-variety",
    },
    "Cl/Jz": {
        text: "text-genre-classic-jazz",
    },
};

const difficultyBadges: {
    key: Difficulty;
    className: string;
    getLevel: (music: MusicCardProps) => number | null;
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

export default function MusicCard(props: MusicCardProps) {
    const { index, title, artist, background, category_short } = props;
    const categoryClassName = categoryStyle[category_short] ?? {
        text: "text-text-secondary",
    };
    const defaultDifficulty: Difficulty = "Normal";
    const jacketImageUrl =
        background ||
        `https://p.eagate.573.jp/game/nostalgia/op3/img/jacket.html?c=${index}`;

    return (
        <Link
            href={`/music/${index}/${defaultDifficulty}`}
            className="bg-surface rounded-card hover:bg-surface-muted flex min-h-16 w-full overflow-hidden transition-colors"
        >
            <div
                className="bg-surface-muted relative w-14 shrink-0 overflow-hidden bg-cover bg-center"
                style={{
                    backgroundImage: `url(${jacketImageUrl})`,
                }}
                aria-hidden="true"
            />

            <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-3 py-2.5">
                <div className="flex min-w-0 flex-col gap-1">
                    <h2 className="text-text-primary truncate text-sm leading-snug font-semibold">
                        {title}
                    </h2>
                    <p className="flex min-w-0 items-center text-xs leading-normal">
                        <span className="text-text-secondary truncate">
                            {artist || "아티스트 미상"}
                        </span>
                        <span className="text-text-disabled shrink-0"> · </span>
                        <span
                            className={cn("shrink-0", categoryClassName.text)}
                        >
                            {category_short}
                        </span>
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
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
