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
        <div className="bg-dark-secondary flex flex-col gap-2 p-1">
            <section className="flex w-full items-center justify-between px-2.5">
                <h1 className="text-secondary">빙고판</h1>
                <div
                    onClick={() => {
                        setIsCheck((prev) => !prev);
                    }}
                    className="flex cursor-pointer gap-2"
                >
                    <span>선택 전환</span>
                    <div
                        className={`flex h-6 w-10 items-center rounded-full px-1 transition-all ${
                            isCheck ? "bg-blue-500" : "bg-dark-secondary"
                        }`}
                    >
                        <div
                            className={`bg-white-secondary size-4 rounded-full transition-all ${
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
                        className="bg-dark-primary relative aspect-square w-full border text-center text-xs *:flex *:aspect-square *:items-center *:justify-center *:p-2"
                    >
                        {/* 빙고 클리어 absolute */}
                        {userClearMap.get(cell.id) === true && (
                            <div className="absolute z-10 h-full w-full border-4 border-red-500" />
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
                                className={`absolute z-20 h-full w-full cursor-pointer border-2 ${
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
