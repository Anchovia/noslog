import { formatToComma, formatToGrade } from "@/lib/utils";
import Image from "next/image";
import Chart from "./chart";

interface StatisticsProps {
    userData: {
        id: number;
        rank_basic: number | null;
        rank_basic_country: number | null;
        rank_recital: number | null;
        rank_recital_country: number | null;
        grade_basic: number | null;
        grade_recital: number | null;
        play_count: number | null;
        score_p: number | null;
        score_f: number | null;
        score_s: number | null;
        score_a2: number | null;
        score_a: number | null;
    };
    userBestGrades: any;
    isRecital: Boolean;
}

export default function Statistics({
    userData,
    userBestGrades,
    isRecital,
}: StatisticsProps) {
    // p, fc, s, a2, a 랭크 데이터
    const ranks = {
        grade_p: userData.score_p,
        grade_fc_bg: userData.score_f,
        grade_s: userData.score_s,
        grade_a2: userData.score_a2,
        grade_a: userData.score_a,
    };

    // 상단 헤더 통계 데이터
    const statsData = [
        {
            label: "세계 순위",
            value: isRecital ? userData.rank_recital : userData.rank_basic,
            formatter: (val: number | null) => `#${formatToComma(val)}`,
        },
        {
            label: "국가 순위",
            value: isRecital
                ? userData.rank_recital_country
                : userData.rank_basic_country,
            formatter: (val: number | null) => `#${formatToComma(val)}`,
        },
        {
            label: "Grd",
            value: isRecital ? userData.grade_recital : userData.grade_basic,
            formatter: (val: number | null) => formatToGrade(val),
        },
    ];

    return (
        <section className="flex flex-col">
            <h1 className="bg-dark-quinary text-secondary rounded-t-xl p-4 text-center">
                통계
            </h1>
            {/* 상단 헤더 통계 */}
            <article className="*:text-quaternary bg-dark-tertiary flex justify-between p-4 *:flex *:flex-col *:text-center">
                {statsData.map((stat, _) => (
                    <div key={stat.label} className="w-1/3">
                        <span>{stat.label}</span>
                        <span className="text-tertiary">
                            {stat.formatter(stat.value)}
                        </span>
                    </div>
                ))}
            </article>
            {/* 차트 */}
            <article className="bg-dark-secondary h-60 w-full">
                <Chart userBestGrades={userBestGrades} isRecital={isRecital} />
            </article>
            {/* 플레이 횟수, 시간 / 랭크 기록 */}
            <article className="bg-dark-tertiary flex justify-between gap-2 rounded-b-xl p-4">
                {/* 플레이 횟수, 시간 */}
                <div className="bg-dark-secondary text-quinary *:text-white-secondary flex flex-col justify-center gap-1 rounded-xl p-4 text-left *:flex *:items-center *:gap-1">
                    <span>
                        플레이 횟수:{" "}
                        <span className="text-quaternary">
                            {formatToComma(userData.play_count)}
                        </span>
                    </span>
                    <span>
                        플레이 시간:{" "}
                        <span className="text-quaternary">23d</span>
                    </span>
                </div>
                {/* 랭크 기록 */}
                <div className="bg-dark-secondary text-white-secondary *:text-quinary flex flex-1 justify-center gap-4 rounded-xl p-4 text-sm *:flex *:flex-col *:items-center *:justify-center">
                    {Object.entries(ranks).map(([key, value]) => (
                        <div key={key}>
                            <Image
                                alt={key}
                                src={`https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/${key}.png`}
                                width={24}
                                height={24}
                            />
                            <span>{formatToComma(value)}</span>
                        </div>
                    ))}
                </div>
            </article>
        </section>
    );
}
