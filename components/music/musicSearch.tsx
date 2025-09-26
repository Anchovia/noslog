"use client";

import { searchSchema, searchType } from "@/app/(nevigation)/music/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function MusicSearch() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isLevelOpen, setIsLevelOpen] = useState(false);
    const [isRealOpen, setIsRealOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<searchType>({
        resolver: zodResolver(searchSchema),
    });

    const onSubmit = handleSubmit(async (data: searchType) => {
        redirect(`music?qurry=${data.search}`);
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
                            setIsRealOpen(false);
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
                            setIsRealOpen((prev) => !prev);
                            setIsLevelOpen(false);
                        }}
                        className="bg-dark-tertiary"
                    >
                        Real
                    </span>
                </article>
                {/* 세부 필터 */}
                {isFilterOpen && (
                    <article className="w-full flex flex-col gap-6">
                        {isLevelOpen && (
                            <div className="flex w-full justify-between gap-2 text-center">
                                <span className="w-20">레벨</span>
                                <input
                                    type="range"
                                    list="level"
                                    min="1"
                                    max="12"
                                    step="1"
                                    className="flex-1"
                                />
                                <datalist id="level">
                                    {[1 * 12].map((_, idx) => (
                                        <option
                                            key={idx}
                                            value={idx}
                                            label={idx.toString()}
                                            className="flex flex-col"
                                        />
                                    ))}
                                </datalist>
                            </div>
                        )}
                        {isRealOpen && (
                            <div className="flex w-full justify-between gap-2 text-center">
                                <span className="w-20">Real</span>
                                <input
                                    type="range"
                                    list="level"
                                    min="1"
                                    max="3"
                                    step="1"
                                    className="flex-1"
                                />
                                <datalist id="level">
                                    <option value={1} label={"1"} />
                                    <option value={2} label={"2"} />
                                    <option value={3} label={"3"} />
                                </datalist>
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
