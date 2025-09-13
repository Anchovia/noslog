"use client";

import { useState } from "react";

export default function MusicSearch() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isLevelOpen, setIsLevelOpen] = useState(false);
    const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);
    const [isRankOpen, setIsRankOpen] = useState(false);

    return (
        <section className="px-6 py-4 bg-dark-secondary">
            <form className="flex flex-col items-center justify-center gap-6 rounded-lg">
                <input
                    placeholder="검색 입력.."
                    className="w-full px-6 py-4 bg-white-secondary rounded-xl"
                />
                {/* 필터 버튼 */}
                <article className="flex w-full gap-3 *:px-5 text-center *:py-2 *:rounded-full *:cursor-pointer">
                    <div
                        onClick={() => {
                            setIsFilterOpen(true);
                            setIsLevelOpen((prev) => !prev);
                            setIsDifficultyOpen(false);
                            setIsRankOpen(false);
                        }}
                        className={`bg-dark-tertiary flex justify-center gap-1.5 ${
                            isLevelOpen && "bg-white-secondary text-black"
                        }`}
                    >
                        {isLevelOpen ? (
                            <>
                                <span>레벨:</span>
                                <span>3~9</span>
                                <span className="">X</span>
                            </>
                        ) : (
                            <span>레벨</span>
                        )}
                    </div>
                    <span
                        onClick={() => {
                            setIsFilterOpen(true);
                            setIsDifficultyOpen((prev) => !prev);
                            setIsLevelOpen(false);
                            setIsRankOpen(false);
                        }}
                        className="bg-dark-tertiary"
                    >
                        난이도
                    </span>
                    <span
                        onClick={() => {
                            setIsFilterOpen(true);
                            setIsRankOpen((prev) => !prev);
                            setIsLevelOpen(false);
                            setIsDifficultyOpen(false);
                        }}
                        className="bg-dark-tertiary"
                    >
                        달성 랭크
                    </span>
                </article>
                {/* 세부 필터 */}
                {isFilterOpen && (
                    <article className="w-full flex flex-col gap-6">
                        {isLevelOpen && (
                            <div className="flex w-full justify-between gap-2 text-center">
                                <span className="w-20">레벨</span>
                                <input type="range" className="flex-1"></input>
                            </div>
                        )}
                        {isDifficultyOpen && (
                            <div className="flex w-full justify-between text-center gap-2">
                                <span className="w-20">난이도</span>
                                <span className="flex-1 bg-dark-tertiary rounded-full">
                                    Normal
                                </span>
                                <span className="flex-1 bg-dark-tertiary rounded-full">
                                    Hard
                                </span>
                                <span className="flex-1 bg-dark-tertiary rounded-full">
                                    Expert
                                </span>
                                <span className="flex-1 bg-dark-tertiary rounded-full">
                                    Real
                                </span>
                            </div>
                        )}
                        {isRankOpen && (
                            <div className="flex w-full justify-between text-center gap-2">
                                <span className="w-20">랭크</span>
                                <span className="flex-1 bg-dark-tertiary rounded-full">
                                    P
                                </span>
                                <span className="flex-1 bg-dark-tertiary rounded-full">
                                    FC
                                </span>
                                <span className="flex-1 bg-dark-tertiary rounded-full">
                                    S
                                </span>
                                <span className="flex-1 bg-dark-tertiary rounded-full">
                                    A+
                                </span>
                                <span className="flex-1 bg-dark-tertiary rounded-full">
                                    A
                                </span>
                            </div>
                        )}
                        {/* 접기 버튼 */}
                        <div
                            onClick={() => setIsFilterOpen((prev) => !prev)}
                            className="flex w-full items-center gap-4 *:rounded-full cursor-pointer"
                        >
                            <div className="flex-1 h-1 bg-dark-secondary" />
                            <span>접기</span>
                            <div className="flex-1 h-1 bg-dark-secondary" />
                        </div>
                    </article>
                )}
            </form>
        </section>
    );
}
