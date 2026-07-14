/* 자켓, 제목, 아티스트, 그레이드 */

import { formatToGrade } from "@/lib/utils";

interface MusicTitleProps {
    background: string | null;
    index: string;
    title: string;
    artist: string | null;
    grade_basic: number | null;
    grade_recital: number | null;
    isRecital: boolean;
}

export default function MusicTitle({
    background,
    index,
    title,
    artist,
    grade_basic,
    grade_recital,
    isRecital,
}: MusicTitleProps) {
    return (
        <section className="flex items-center justify-between gap-6">
            {/* 자켓, 제목, 아티스트 */}
            <article className="flex items-center gap-6">
                <div
                    style={{
                        backgroundImage: `${
                            background
                                ? `url(${background})`
                                : `url(https://p.eagate.573.jp/game/nostalgia/op3/img/jacket.html?c=${index})`
                        }`,
                        backgroundSize: "cover",
                    }}
                    className="aspect-square size-24 border border-white/50"
                />
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <h2 className="text-xl font-normal text-white/80">
                        {artist}
                    </h2>
                </div>
            </article>
            {/* 그레이드 */}
            <article className="flex flex-col items-center">
                <span className="text-lg">Grd</span>
                <span className="text-xl font-bold">
                    {isRecital
                        ? formatToGrade(grade_recital)
                        : formatToGrade(grade_basic)}
                </span>
            </article>
        </section>
    );
}
