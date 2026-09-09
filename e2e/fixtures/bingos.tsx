"use client";

import { useRef, useState } from "react";
import seeds from "@/prisma/data/op3-bingos.json";
import musics from "@/prisma/data/music-catalog.json";
import BingoCatalogPage from "@/features/bingos/components/bingoCatalogPage";
import BingoDetailPage from "@/features/bingos/components/bingoDetailPage";
import type {
    BingoCatalogItem,
    BingoDetail,
} from "@/features/bingos/schemas/publicBingoSchema";
import { getBingoProgress } from "@/lib/bingo";

const completedPositions = [1, 2, 3, 7, 8, 13, 19, 25];
export const bingoDetailFixture: BingoDetail = {
    id: 900001,
    title: seeds[0].title,
    musicIndex: "efc00c4325b7aea7aa77e95db0234b40",
    background: null,
    sourceVersion: seeds[0].sourceVersion,
    requiredLines: seeds[0].requiredLines,
    rewardNos: seeds[0].rewardNos,
    lineRewardNos: seeds[0].lineRewardNos,
    completionRewardNos: seeds[0].completionRewardNos,
    isAuthenticated: true,
    completedCellIds: completedPositions.map((position) => 900000 + position),
    cells: seeds[0].cells.map((cell) => ({
        id: 900000 + cell.position,
        position: cell.position,
        challenge: cell.title,
        language: "ko",
        missionType: "record",
        musicIndex: null,
        categoryShort: null,
    })),
};
export default function BingosFixture({ state }: { state?: string }) {
    const [calls, setCalls] = useState(0);
    const finish = useRef<
        | ((value: {
              success: true;
              message: string;
              isCompleted: boolean;
          }) => void)
        | null
    >(null);
    const intent = useRef(false);
    if (state?.startsWith("detail"))
        return (
            <>
                <output aria-label="Fixture saves">{calls}</output>
                {state === "detail-busy" ? (
                    <button
                        onClick={() =>
                            finish.current?.({
                                success: true,
                                message: "",
                                isCompleted: intent.current,
                            })
                        }
                    >
                        Finish fixture save
                    </button>
                ) : null}
                <BingoDetailPage
                    bingo={{
                        ...bingoDetailFixture,
                        isAuthenticated: state !== "detail-guest",
                        completedCellIds:
                            state === "detail-full"
                                ? bingoDetailFixture.cells.map(
                                      (cell) => cell.id
                                  )
                                : state === "detail-guest"
                                  ? []
                                  : bingoDetailFixture.completedCellIds,
                    }}
                    saveAction={async (_id, isCompleted) => {
                        setCalls((value) => value + 1);
                        if (state === "detail-failure")
                            return {
                                success: false,
                                message: "Fixture save failure",
                            };
                        if (state === "detail-busy") {
                            intent.current = isCompleted;
                            return new Promise((resolve) => {
                                finish.current = resolve;
                            });
                        }
                        return { success: true, message: "", isCompleted };
                    }}
                    resetAction={async () => {
                        setCalls((value) => value + 1);
                        await new Promise((resolve) =>
                            setTimeout(resolve, 700)
                        );
                        return state === "detail-reset-failure"
                            ? {
                                  success: false,
                                  message: "Fixture reset failure",
                              }
                            : { success: true, message: "" };
                    }}
                />
            </>
        );
    const items: BingoCatalogItem[] = seeds.map((seed, i) => {
        const count = [0, 3, 5, 7, 8, 12, 20, 25][i % 8];
        const positions = Array.from(
            { length: count },
            (_, index) => index + 1
        );
        const progress = getBingoProgress(
            seed.cells.map((cell) => ({
                id: cell.position,
                position: cell.position,
                isCompleted: positions.includes(cell.position),
            }))
        );
        return {
            id: 900001 + i,
            title: seed.title,
            musicIndex:
                state === "missing-cover"
                    ? "missing-cover"
                    : (musics.find((music) => music.title === seed.title)
                          ?.index ?? "missing-cover"),
            background: null,
            sourceVersion: seed.sourceVersion,
            rewardNos: seed.rewardNos,
            requiredLines: seed.requiredLines,
            completedPositions: positions,
            completedLines: progress.completedLines,
            chanceLines: progress.richLines,
            lastModifiedAt: count
                ? `2026-09-01T00:${String(i).padStart(2, "0")}:00Z`
                : null,
        };
    });
    return (
        <BingoCatalogPage
            items={state === "empty" ? [] : items}
            isAuthenticated={state !== "guest"}
        />
    );
}
