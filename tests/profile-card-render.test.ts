import { createElement } from "react";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { describe, expect, it } from "vitest";
import type { ProfileUser } from "@/components/profile/dashboard/profileTypes";
import ProfileCardImage from "@/features/profile/components/profileCardImage";
import {
    getProfileCardInitial,
    getProfileCardMode,
} from "@/features/profile/profileCardModel";

const base: ProfileUser = {
    id: 1,
    username: "계롤",
    avatar: null,
    country: "ko-KR",
    nostalgia_name: null,
    discord_name: null,
    discord_username: null,
    rank_basic: 482,
    rank_basic_country: 57,
    rank_recital: 120,
    rank_recital_country: 15,
    grade_basic: 571300,
    grade_recital: 521000,
    exam_basic: 8,
    exam_recital: 10,
    play_count: 1204,
    score_p: 12,
    score_f: 87,
    score_s: 214,
    score_a2: null,
    score_a: null,
    score_b2: null,
    score_b: null,
    score_c: null,
    score_d: null,
    hide_nostalgia_name: false,
    hide_discord_name: false,
    hide_play_count: false,
    hide_preferred_arcade: false,
    hide_play_activity: false,
    preferredArcade: null,
    created_at: "2026-08-27",
    last_played_at: "2026-08-27",
};
describe("P16 share card", () => {
    it("normalizes official Grd and selects the requested mode", () => {
        expect(getProfileCardMode(base, "basic")).toMatchObject({
            grade: 5713,
            globalRank: 482,
        });
        expect(getProfileCardMode(base, "recital")).toMatchObject({
            grade: 5210,
            globalRank: 120,
        });
        expect(
            getProfileCardMode({ ...base, grade_basic: null }, "basic")
        ).toMatchObject({ grade: null });
        expect(getProfileCardInitial("🎵 계롤", "ko")).toBe("계");
        expect(getProfileCardInitial("étoile", "en")).toBe("É");
    });
    for (const scenario of [
        "ko-base",
        "ko-empty",
        "ko-partial",
        "ja-long",
        "en-recital",
        "ko-top-peak",
        "ko-mid-high",
    ] as const) {
        it(`renders ${scenario} with the complete original Pretendard JP fonts`, async () => {
            const locale = scenario.startsWith("ja")
                ? "ja"
                : scenario.startsWith("en")
                  ? "en"
                  : "ko";
            const user = { ...base };
            if (scenario === "ko-empty")
                Object.assign(user, {
                    username: "새로운 사용자",
                    grade_basic: null,
                    grade_recital: null,
                    rank_basic: null,
                    rank_basic_country: null,
                    exam_basic: null,
                    exam_recital: null,
                    score_p: null,
                    score_f: null,
                    score_s: null,
                    last_played_at: null,
                });
            if (scenario === "ko-partial")
                Object.assign(user, {
                    rank_basic: null,
                    rank_basic_country: null,
                    exam_basic: null,
                    exam_recital: null,
                    hide_play_count: true,
                    hide_play_activity: true,
                });
            // 명판의 금빛 면·안쪽 선·흑단·파인 모서리 조각을 모두 그리게 한다
            if (scenario === "ko-top-peak")
                Object.assign(user, { exam_basic: 2, exam_recital: 1 });
            if (scenario === "ko-mid-high")
                Object.assign(user, { exam_basic: 5, exam_recital: 3 });
            if (scenario === "ja-long")
                Object.assign(user, {
                    username: "長いユーザー名とノスタルジアの演奏記録",
                    country: "global",
                });
            const fonts = await Promise.all(
                (
                    [
                        { weight: 400, name: "Regular" },
                        { weight: 700, name: "Bold" },
                    ] as const
                ).map(async ({ weight, name }) => {
                    const file = await readFile(
                        `assets/fonts/pretendard-jp/1.3.9/PretendardJP-${name}.ttf`
                    );
                    return {
                        name: "Pretendard JP",
                        weight,
                        data: file.buffer.slice(
                            file.byteOffset,
                            file.byteOffset + file.byteLength
                        ) as ArrayBuffer,
                    };
                })
            );
            const flag =
                user.country === "global"
                    ? null
                    : `data:image/png;base64,${(await readFile("public/flags/kr.png")).toString("base64")}`;
            const response = new ImageResponse(
                createElement(ProfileCardImage, {
                    user,
                    locale,
                    mode: scenario === "en-recital" ? "recital" : "basic",
                    avatar: null,
                    flag,
                    profileUrl: `https://noslog.app/${locale}/profile/1`,
                }),
                { width: 1200, height: 630, fonts }
            );
            const png = Buffer.from(await response.arrayBuffer());
            expect(png.subarray(1, 4).toString()).toBe("PNG");
            expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([
                1200, 630,
            ]);
            await mkdir("test-results/profile-card", { recursive: true });
            await writeFile(`test-results/profile-card/${scenario}.png`, png);
        }, 15000);
    }
});
