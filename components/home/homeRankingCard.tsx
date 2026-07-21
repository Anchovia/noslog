"use client";

import {
    CountryMark,
    UserAvatar,
} from "@/components/rankings/table/rankingUserMeta";
import type { UserRankingMode, UserRankingRow } from "@/lib/rankings";
import { formatToGrade } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

interface HomeRankingCardProps {
    initialMode: UserRankingMode;
    rankings: Record<UserRankingMode, UserRankingRow[]>;
}

export default function HomeRankingCard({
    initialMode,
    rankings,
}: HomeRankingCardProps) {
    const [mode, setMode] = useState(initialMode);

    function selectMode(nextMode: UserRankingMode) {
        if (nextMode === mode) return;

        setMode(nextMode);
        const url = new URL(window.location.href);
        if (nextMode === "basic") {
            url.searchParams.delete("ranking");
        } else {
            url.searchParams.set("ranking", nextMode);
        }
        window.history.replaceState(null, "", url);
    }

    return (
        <section className="bg-surface rounded-card overflow-hidden">
            <div className="bg-surface-muted flex h-10 items-center justify-between px-3">
                <div className="flex items-center gap-2">
                    <h2 className="text-section">유저 랭킹</h2>

                    <div className="border-border rounded-card flex overflow-hidden border">
                        {(["basic", "recital"] as const).map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => selectMode(item)}
                                aria-pressed={mode === item}
                                className={
                                    mode === item
                                        ? "bg-border text-text-primary cursor-pointer px-2.5 py-1 text-xs font-semibold"
                                        : "text-text-secondary hover:bg-border/60 hover:text-text-primary cursor-pointer px-2.5 py-1 text-xs font-semibold transition-colors"
                                }
                            >
                                {item === "basic" ? "Basic" : "Recital"}
                            </button>
                        ))}
                    </div>
                </div>

                <Link
                    href={`/rankings?mode=${mode}`}
                    className="text-caption hover:text-text-primary transition-colors"
                >
                    전체 →
                </Link>
            </div>

            <div>
                {rankings[mode].map((user, index) => (
                    <Link
                        key={user.id}
                        href={`/profile/${user.id}`}
                        className="border-divider flex h-10 items-center border-t px-3"
                    >
                        <span
                            className={
                                index === 0
                                    ? "text-score w-8 text-sm font-bold"
                                    : index === 2
                                      ? "text-bronze w-8 text-sm font-bold"
                                      : index >= 3
                                        ? "text-text-disabled w-8 text-sm font-bold"
                                        : "text-text-primary w-8 text-sm font-bold"
                            }
                        >
                            {index + 1}
                        </span>

                        <UserAvatar
                            avatar={user.avatar}
                            username={user.username}
                            size={24}
                        />

                        <span className="mx-2 flex w-4 shrink-0 items-center justify-center">
                            <CountryMark country={user.country} />
                        </span>

                        <span className="text-body min-w-0 flex-1 truncate">
                            {user.username ?? "Unknown"}
                        </span>

                        <span className="text-caption text-text-primary tabular-nums">
                            Grd {formatToGrade(user.grade)}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
