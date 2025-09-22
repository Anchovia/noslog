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
            <h1 className="p-4 text-center bg-dark-quinary text-secondary rounded-t-xl">
                통계
            </h1>
            {/* 상단 헤더 통계 */}
            <article className="flex p-4 justify-between *:text-quaternary *:flex *:flex-col bg-dark-tertiary *:text-center">
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
            <article className="w-full h-60 bg-dark-secondary">
                <Chart userBestGrades={userBestGrades} isRecital={isRecital} />
            </article>
            {/* 플레이 횟수, 시간 / 랭크 기록 */}
            <article className="flex justify-between p-4 bg-dark-tertiary rounded-b-xl gap-2">
                {/* 플레이 횟수, 시간 */}
                <div className="flex flex-col bg-dark-secondary p-4 rounded-xl text-quinary text-left justify-center gap-1 *:text-white-secondary *:flex *:items-center *:gap-1">
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
                <div className="p-4 flex flex-1 bg-dark-secondary rounded-xl justify-center gap-4 text-sm *:flex *:flex-col text-white-secondary *:items-center *:justify-center *:text-quinary">
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
