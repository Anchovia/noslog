import { describe, expect, it } from "vitest";

import { unlockStepsFor } from "@/lib/music/unlockCondition";

const step = (name: string, stardust: number | null, moved = false) => ({
    name,
    stardust,
    moved,
    requires: null,
});

describe("unlockStepsFor", () => {
    it("picks this difficulty's stardust from four numbers", () => {
        const raw = "Classical Masterpieces Memories of old times (9/19/24/20)";
        expect(unlockStepsFor(raw, "Hard")).toEqual([
            step("Classical Masterpieces Memories of old times", 19),
        ]);
        expect(unlockStepsFor(raw, "Real")).toEqual([
            step("Classical Masterpieces Memories of old times", 20),
        ]);
    });

    it("uses a single number for every difficulty", () => {
        expect(unlockStepsFor("UNDERTALE (24)", "Real")).toEqual([
            step("UNDERTALE", 24),
        ]);
    });

    it("keeps names without numbers and marks moved events", () => {
        expect(
            unlockStepsFor(
                "BEMANI 2021真夏の歌合戦5番勝負\n→時を巡る音楽祭 Vol.V (9/22/30/24)",
                "Expert"
            )
        ).toEqual([
            step("BEMANI 2021真夏の歌合戦5番勝負", null),
            step("時を巡る音楽祭 Vol.V", 30, true),
        ]);
    });

    it("gives the single-number line to Real when a three-number line exists", () => {
        const raw =
            "第四章「まほろばの噂」 (19/29/33)\n第八章「還る場所」 (20)";
        expect(unlockStepsFor(raw, "Expert")).toEqual([
            step("第四章「まほろばの噂」", 33),
        ]);
        expect(unlockStepsFor(raw, "Real")).toEqual([
            step("第八章「還る場所」", 20),
        ]);
    });

    it("leaves Real without stardust when only three numbers exist", () => {
        expect(
            unlockStepsFor("バンめし♪ FGP ROUND3～秋の陣～ (15/28/22)", "Real")
        ).toEqual([step("バンめし♪ FGP ROUND3～秋の陣～", null)]);
    });

    it("drops the free-play note and reads song prerequisites", () => {
        expect(
            unlockStepsFor(
                "L.v.B. 251st Anniversary (13/22/33/26)\n解禁不要(誰でもプレー可能)",
                "Normal"
            )
        ).toEqual([
            step("L.v.B. 251st Anniversary", 13),
            step("解禁不要", null),
        ]);
        expect(
            unlockStepsFor(
                "合同音楽祭 GITADORA×ノスタルジア (10/18/28/24)\n(「On top of the world」[Normal]解禁で出現)",
                "Hard"
            )
        ).toEqual([
            step("合同音楽祭 GITADORA×ノスタルジア", 18),
            {
                name: "",
                stardust: null,
                moved: false,
                requires: {
                    title: "On top of the world",
                    difficulty: "Normal",
                },
            },
        ]);
    });

    it("returns nothing for an empty condition", () => {
        expect(unlockStepsFor(null, "Normal")).toEqual([]);
        expect(unlockStepsFor("  ", "Normal")).toEqual([]);
    });
});
