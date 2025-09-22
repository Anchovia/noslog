"use client";

import { formatToComma, formatToGrade } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import RecitalToggleButton from "../button/recitalToggleButton";
import BestPlay from "./bestPlay";
import Chart from "./chart";
import RecentPlay from "./recentPlay";

interface ProfileProps {
    userData: {
        discord_name: string | null;
        discord_tag: string | null;
        id: number;
        username: string | null;
        avatar: string | null;
        country: string;
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
        score_b2: number | null;
    };
    initialRecentPlays: any[];
    initialBasicBestPlays: any[];
    initialRecitalBestPlays: any[];
    userBestGrades: any[];
}

export default function ProfileDetail({
    userData,
    initialRecentPlays,
    initialBasicBestPlays,
    initialRecitalBestPlays,
    userBestGrades,
}: ProfileProps) {
    const [isRecital, setIsRecital] = useState(false);

    return (
        <div className="px-8 py-4 max-w-screen-sm mx-auto flex flex-col gap-4">
            <section className="flex flex-col gap-4">
                {/* 타이틀, 리사이틀 버튼 */}
                <article className="flex items-center justify-between">
                    <h1 className="text-tertiary">
                        <span className="text-secondary">
                            {userData.username}
                        </span>
                        의 프로필
                    </h1>
                    <RecitalToggleButton
                        isRecital={isRecital}
                        setIsRecital={setIsRecital}
                    />
                </article>
                {/* 프로필, 설정 버튼*/}
                <article className="flex bg-dark-quinary rounded-t-xl p-4 gap-4">
                    <div className="size-24 rounded-3xl relative overflow-hidden">
                        {userData.avatar ? (
                            <Image src={userData.avatar} alt="avatar" fill />
                        ) : (
                            <div className="bg-neutral-500" />
                        )}
                    </div>
                    <div className="flex flex-col justify-center gap-1 flex-1">
                        <div className="flex gap-1 items-center">
                            <div className="relative w-8 h-6 rounded-full  overflow-hidden">
                                <Image
                                    src={`/flag/${userData.country}.svg`}
                                    alt={userData.country}
                                    fill
                                />
                            </div>
                            <span className="text-primary">
                                {userData.username ? userData.username : "-"}
                            </span>
                        </div>
                        {isRecital ? (
                            <span className="text-quaternary">{`NosLog #${formatToComma(
                                userData.rank_recital
                            )}`}</span>
                        ) : (
                            <span className="text-quaternary">{`NosLog #${formatToComma(
                                userData.rank_basic
                            )}`}</span>
                        )}
                    </div>
                    <div>
                        <Link href={`/profile/settings`}>
                            <Image
                                className="fle"
                                src="/icon/gear.png"
                                width={28}
                                height={28}
                                alt="setting"
                            />
                        </Link>
                    </div>
                </article>
                {/* 소셜(디스코드) */}
                <article className="-mt-4 flex flex-col text-sm gap-2 bg-dark-tertiary p-4">
                    <h2 className="text-secondary">소셜</h2>
                    <div className="border border-neutral-700" />
                    <div className="flex gap-2">
                        <Image
                            src={"/icon/discord.png"}
                            alt={"discord"}
                            width={30}
                            height={20}
                        />
                        <span className="flex items-center gap-1 *:flex *:items-center">
                            <span className="text-quaternary">
                                {userData.discord_name
                                    ? userData.discord_name
                                    : "-"}
                            </span>
                            <span className="text-quinary">
                                #
                                {userData.discord_tag
                                    ? userData.discord_tag
                                    : "-"}
                            </span>
                        </span>
                    </div>
                </article>
                <article className="-mt-4 flex gap-3 bg-dark-secondary p-4 rounded-b-xl text-quinary">
                    <span>
                        <span className="font-semibold ">2025년 09월</span> 시작
                    </span>
                    <span>
                        <span className="font-semibold ">7일전</span> 마지막
                        플레이
                    </span>
                </article>
            </section>
            {/* 통계 */}
            <section className="flex flex-col">
                <article className="p-4 text-center bg-dark-quinary text-secondary rounded-t-xl">
                    통계
                </article>
                <article className="flex p-4 justify-between *:text-quaternary *:flex *:flex-col bg-dark-tertiary *:text-center">
                    <div className="w-1/3">
                        <span>세계 순위</span>
                        {isRecital ? (
                            <span className="text-tertiary">{`#${formatToComma(
                                userData.rank_recital
                            )}`}</span>
                        ) : (
                            <span className="text-tertiary">{`#${formatToComma(
                                userData.rank_basic
                            )}`}</span>
                        )}
                    </div>
                    <div className="w-1/3">
                        <span>국가 순위</span>
                        {isRecital ? (
                            <span className="text-tertiary">{`#${formatToComma(
                                userData.rank_recital_country
                            )}`}</span>
                        ) : (
                            <span className="text-tertiary">{`#${formatToComma(
                                userData.rank_basic_country
                            )}`}</span>
                        )}
                    </div>
                    <div className="w-1/3">
                        <span>Grd</span>
                        {isRecital ? (
                            <span className="text-tertiary">
                                {formatToGrade(userData.grade_recital)}
                            </span>
                        ) : (
                            <span className="text-tertiary">
                                {formatToGrade(userData.grade_basic)}
                            </span>
                        )}
                    </div>
                </article>
                {/* 차트 */}
                <article className="w-full h-60 bg-dark-secondary">
                    <Chart
                        userBestGrades={userBestGrades}
                        isRecital={isRecital}
                    />
                </article>
                <article className="flex justify-between p-4 bg-dark-tertiary rounded-b-xl gap-2">
                    <span className="flex flex-col bg-dark-secondary p-4 rounded-xl text-quinary text-left justify-center gap-1 *:text-white-secondary *:flex *:items-center *:gap-1">
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
                    </span>
                    <span className="p-4 flex flex-1 bg-dark-secondary rounded-xl justify-center gap-4 text-sm *:flex *:flex-col text-white-secondary *:items-center *:justify-center *:text-quinary">
                        <div>
                            <Image
                                src={
                                    "https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_p.png"
                                }
                                alt="grade_p"
                                width={24}
                                height={24}
                            />
                            <span>{formatToComma(userData.score_p)}</span>
                        </div>
                        <div>
                            <Image
                                src={
                                    "https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_fc_bg.png"
                                }
                                alt="grade_fc"
                                width={24}
                                height={24}
                            />
                            <span>{formatToComma(userData.score_f)}</span>
                        </div>

                        <div>
                            <Image
                                src={
                                    "https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_s.png"
                                }
                                alt="grade_S"
                                width={24}
                                height={24}
                            />
                            <span>{formatToComma(userData.score_s)}</span>
                        </div>
                        <div>
                            <Image
                                src={
                                    "https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_a2.png"
                                }
                                alt="grade_a2"
                                width={24}
                                height={24}
                            />
                            <span>{formatToComma(userData.score_a2)}</span>
                        </div>
                        <div>
                            <Image
                                src={
                                    "https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_a.png"
                                }
                                alt="grade_a"
                                width={24}
                                height={24}
                            />
                            <span>{formatToComma(userData.score_a)}</span>
                        </div>
                    </span>
                </article>
            </section>
            {/* 최근 플레이 기록 */}
            <RecentPlay
                initialRecentPlays={initialRecentPlays}
                id={userData.id}
            />
            {/* 베스트 플레이 기록 */}
            <BestPlay
                initialBasicBestPlays={initialBasicBestPlays}
                initialRecitalBestPlays={initialRecitalBestPlays}
                id={userData.id}
                isRecital={isRecital}
            />
        </div>
    );
}
