"use client";

import { searchSchema, searchType } from "@/app/(nevigation)/music/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function MusicSearch() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [normal, setNormal] = useState(4);
    const [hard, setHard] = useState(null);
    const [expert, setExpert] = useState(null);
    const [real, setReal] = useState(null);

    const { register, handleSubmit } = useForm<searchType>({
        resolver: zodResolver(searchSchema),
    });

    const handleLevelClick = (e: any) => {
        const value = e.target.value();
    };

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

    const diffList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
                <article
                    onClick={() => setIsFilterOpen((prev) => !prev)}
                    className="cursor-pointer w-full py-2 flex items-center justify-center bg-dark-quinary"
                >
                    필터
                </article>
                {isFilterOpen && (
                    <article>
                        <div>
                            <span>Normal</span>
                            <div>
                                {diffList.map((level) => (
                                    <div
                                        id={level.toString()}
                                        onClick={handleLevelClick}
                                    >
                                        <span>{level}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </article>
                )}
            </form>
        </section>
    );
}
