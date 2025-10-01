"use client";

import { searchSchema, searchType } from "@/app/(nevigation)/music/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function MusicSearch() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [normal, setNormal] = useState("");
    const [hard, setHard] = useState("");
    const [expert, setExpert] = useState("");
    const [real, setReal] = useState("");

    const { register, handleSubmit } = useForm<searchType>({
        resolver: zodResolver(searchSchema),
    });

    const onSubmit = handleSubmit(async (data: searchType) => {
        const url =
            "music?" +
            (data.search !== "" ? `&qurry=${data.search}` : "") +
            (normal !== "" ? `&normal=${normal}` : "") +
            (hard !== "" ? `&hard=${hard}` : "") +
            (expert !== "" ? `&expert=${expert}` : "") +
            (real !== "" ? `&real=${real}` : "");

        redirect(url);
    });
    const onValid = async () => {
        await onSubmit();
    };

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.id === "normal") {
            setNormal(e.target.value);
        }
        if (e.target.id === "hard") {
            setHard(e.target.value);
        }
        if (e.target.id === "expert") {
            setExpert(e.target.value);
        }
        if (e.target.id === "real") {
            setReal(e.target.value);
        }
    };

    console.log(normal, hard, expert, real);

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
                    <article className="w-full flex gap-8 *:flex *:flex-col">
                        <div className="*:h-6 gap-3">
                            <span>Normal</span>
                            <span>Hard</span>
                            <span>Expert</span>
                            <span>Real</span>
                        </div>
                        <div className="flex-1 *:h-6 gap-3">
                            <input
                                id="normal"
                                min={1}
                                max={12}
                                step={1}
                                value={normal}
                                type="range"
                                onChange={handleRangeChange}
                            />
                            <input
                                id="hard"
                                min={1}
                                max={12}
                                step={1}
                                value={hard}
                                type="range"
                                onChange={handleRangeChange}
                            />
                            <input
                                id="expert"
                                min={1}
                                max={12}
                                step={1}
                                value={expert}
                                type="range"
                                onChange={handleRangeChange}
                            />
                            <input
                                id="real"
                                min={1}
                                max={3}
                                step={1}
                                value={real}
                                type="range"
                                className="w-1/4"
                                onChange={handleRangeChange}
                            />
                        </div>
                    </article>
                )}
            </form>
        </section>
    );
}
