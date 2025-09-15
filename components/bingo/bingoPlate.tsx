"use client";

import CreateUserBingoCellData from "@/app/(nevigation)/bingo/[id]/actions";
import Link from "next/link";
import { useState } from "react";

interface Cells {
    id: number;
    challenge: string;
    music_idx: string | null;
    position: number;
    category_short: string | null;
    level: string | null;
}

type UserClearMap = Map<number, boolean>;

interface BingoPlateProps {
    cells: Cells[];
    userClearMap: UserClearMap;
    user_id: number | undefined;
}

export default function BingoPlate({
    cells,
    userClearMap,
    user_id,
}: BingoPlateProps) {
    const [isCheck, setIsCheck] = useState(false);
    return (
        <div className=" bg-dark-secondary p-1 flex flex-col gap-2">
            <section className="flex justify-between w-full items-center px-2.5">
                <h1 className="text-secondary">빙고판</h1>
                <div
                    onClick={() => {
                        setIsCheck((prev) => !prev);
                    }}
                    className="flex gap-2 cursor-pointer"
                >
                    <span>선택 전환</span>
                    <div
                        className={`flex w-10 h-6 rounded-full items-center px-1 transition-all ${
                            isCheck ? "bg-blue-500" : "bg-dark-secondary"
                        }`}
                    >
                        <div
                            className={`size-4 bg-white-secondary rounded-full transition-all ${
                                isCheck ? "translate-x-4" : "translate-x-0"
                            }`}
                        />
                    </div>
                </div>
            </section>
            <section className="grid grid-cols-5 gap-0.5 transition-all">
                {cells.map((cell, _) => (
                    <div
                        key={cell.position}
                        className="relative w-full text-xs border aspect-square text-center *:p-2 *:flex *:items-center *:justify-center *:aspect-square bg-dark-primary"
                    >
                        {/* 빙고 클리어 absolute */}
                        {userClearMap.get(cell.id) === true && (
                            <div className="absolute w-full h-full border-4 border-red-500 z-10" />
                        )}
                        {/* 빙고 클리어 체크모드 absolute */}
                        {isCheck && (
                            <div
                                onClick={() => {
                                    CreateUserBingoCellData(
                                        cell.id,
                                        user_id ? user_id : 1
                                    );
                                }}
                                className={`cursor-pointer absolute w-full h-full border-2 z-20 ${
                                    userClearMap.get(cell.id) === true &&
                                    "border-red-500"
                                }`}
                            />
                        )}
                        {/* 빙고 데이터 */}
                        {cell.music_idx ? (
                            <Link href={`/music/${cell.music_idx}/Normal`}>
                                {cell.challenge}
                            </Link>
                        ) : cell.category_short ? (
                            <Link
                                href={`/music?category=${cell.category_short}`}
                            >
                                {cell.challenge}
                            </Link>
                        ) : (
                            <span>{cell.challenge}</span>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
}
