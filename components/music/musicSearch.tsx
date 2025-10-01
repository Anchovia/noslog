"use client";

import { searchSchema, searchType } from "@/app/(nevigation)/music/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function MusicSearch() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isLevelOpen, setIsLevelOpen] = useState(false);

    const [normal, setNormal] = useState(4);
    const [hard, setHard] = useState(null);
    const [expert, setExpert] = useState(null);
    const [real, setReal] = useState(null);

    const { register, handleSubmit } = useForm<searchType>({
        resolver: zodResolver(searchSchema),
    });

    const onSubmit = handleSubmit(async (data: searchType) => {
        const url =
            "music?" +
            (data.search !== "" ? `&qurry=${data.search}` : "") +
            (normal !== null ? `&normal=${normal}` : "") +
            (hard !== null ? `&hard=${hard}` : "") +
            (expert !== null ? `&expert=${expert}` : "") +
            (real !== null ? `&real=${real}` : "");

        redirect(url);
    });
    const onValid = async () => {
        await onSubmit();
    };

    return (
        <section className="px-6 py-4 bg-dark-secondary">
            <form
                action={onValid}
                className="flex flex-col items-center justify-center gap-6 rounded-lg"
            >
                <input
                    placeholder="검색 입력.."
                    className="w-full px-6 py-4 bg-white-secondary rounded-xl"
                    {...register("search")}
                />
                {/* 필터 버튼 */}
                <article className="flex w-full gap-3 *:px-5 text-center *:py-2 *:rounded-full *:cursor-pointer">
                    <div
                        onClick={() => {
                            setIsFilterOpen(true);
                            setIsLevelOpen((prev) => !prev);
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
                </article>
                {/* 세부 필터 */}
                {isFilterOpen && (
                    <article className="w-full flex flex-col gap-6">
                        {isLevelOpen && (
                            <div className="flex w-full justify-between gap-2 text-center">
                                <span className="w-20">레벨</span>
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
