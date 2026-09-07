import { PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

const databaseUrl = process.env.PROFILE_TEST_DATABASE_URL;
const safeLocalDatabase =
    databaseUrl &&
    new URL(databaseUrl).hostname === "127.0.0.1" &&
    new URL(databaseUrl).port === "55432" &&
    new URL(databaseUrl).pathname === "/noslog_v2";
test.skip(
    !safeLocalDatabase,
    "Requires the explicit local NosLog E2E database; never runs against a shared database."
);
const db = safeLocalDatabase
    ? new PrismaClient({ datasources: { db: { url: databaseUrl } } })
    : null;
test.afterAll(async () => {
    await db?.$disconnect();
});

test("P6 actual stored history honors the selected range and empty users have one record-empty outcome", async ({
    page,
}) => {
    const user = await db!.user.create({
        data: { username: `p6-history-${Date.now()}`, grade_basic: 10000 },
    });
    const empty = await db!.user.create({
        data: { username: `p6-empty-${Date.now()}` },
    });
    try {
        await db!.userBestGrade.createMany({
            data: [80, 50, 10].map((days, index) => ({
                user_id: user.id,
                besttime: new Date(Date.now() - days * 86400000)
                    .toISOString()
                    .slice(0, 10),
                grade_basic: 8000 + index * 1000,
                grade_recital: 0,
            })),
        });
        await page.goto(`/en/profile/${user.id}`);
        const progress = page.getByRole("region", {
            name: "Progress over time",
            exact: true,
        });
        await expect(progress.locator(".nl-line-chart__target")).toHaveCount(3);
        await progress.getByRole("combobox").selectOption("30");
        await expect(progress.locator(".nl-line-chart__target")).toHaveCount(0);
        await expect(
            progress.getByText("More history is needed to show a trend.", {
                exact: true,
            })
        ).toBeVisible();
        await page.goto(`/ko/profile/${empty.id}`);
        await expect(
            page.getByText("아직 동기화된 기록이 없습니다.", { exact: true })
        ).toHaveCount(1);
        await expect(
            page.getByRole("region", { name: "성장 추이", exact: true })
        ).toHaveCount(0);
        await expect(
            page.getByRole("region", { name: "베스트 성과", exact: true })
        ).toHaveCount(0);
    } finally {
        await db!.user.delete({ where: { id: user.id } });
        await db!.user.delete({ where: { id: empty.id } });
    }
});

const flags = [
    "hide_nostalgia_name",
    "hide_discord_name",
    "hide_play_count",
    "hide_preferred_arcade",
    "hide_play_activity",
    "all",
] as const;
test("P6 a missing avatar keeps the profile usable with an accessible initial fallback", async ({
    page,
}) => {
    const user = await db!.user.create({
        data: {
            username: `p6-avatar-fallback-${Date.now()}`,
            avatar: "/p6-verification-missing-avatar.png",
        },
    });
    try {
        await page.goto(`/ko/profile/${user.id}`);
        await expect(
            page.getByRole("heading", { name: user.username!, exact: true })
        ).toBeVisible();
        const avatar = page.locator(".nl-profile-identity__avatar");
        await expect(avatar).toHaveAttribute("role", "img");
        await expect(avatar).toHaveAccessibleName(
            `${user.username} 프로필 이미지`
        );
        await expect(avatar.locator("img")).toHaveCount(0);
        await expect(avatar).toHaveText("P");
        await expect(avatar).toHaveCSS("width", "64px");
        await expect(avatar).toHaveCSS("height", "64px");
        await expect(page.getByRole("main")).not.toContainText(
            "Failed to parse src"
        );
        await expect(page.getByRole("banner")).toBeVisible();
        await expect(page.getByRole("contentinfo")).toBeVisible();
    } finally {
        await db!.user.delete({ where: { id: user.id } });
    }
});
for (const flag of flags) {
    test(`P6 server HTML and incremental endpoints enforce ${flag} without hiding public best performance`, async ({
        page,
    }) => {
        const marker = `p6-${Date.now()}-${flag}`;
        const arcade = await db!.arcade.create({
            data: { name: `${marker}-arcade`, is_active: false },
        });
        let userId: number | undefined;
        try {
            const chart = await db!.musicChart.findFirstOrThrow({
                where: {
                    music_idx: "bfdaadfb98501907925ecf41a076108d",
                    difficulty: { equals: "Expert", mode: "insensitive" },
                },
            });
            const hidden = (name: string) => flag === name || flag === "all";
            const user = await db!.user.create({
                data: {
                    username: `${marker}-public`,
                    nostalgia_name: `${marker}-game`,
                    discord_name: `${marker}-discord`,
                    discord_username: `${marker}-handle`,
                    preferred_arcade_id: arcade.id,
                    play_count: 987654,
                    grade_basic: 10000,
                    grade_recital: 0,
                    hide_nostalgia_name: hidden("hide_nostalgia_name"),
                    hide_discord_name: hidden("hide_discord_name"),
                    hide_play_count: hidden("hide_play_count"),
                    hide_preferred_arcade: hidden("hide_preferred_arcade"),
                    hide_play_activity: hidden("hide_play_activity"),
                },
            });
            userId = user.id;
            await db!.playData.create({
                data: {
                    user_id: user.id,
                    chart_id: chart.id,
                    music_idx: chart.music_idx,
                    difficulty: chart.difficulty,
                    level: chart.level,
                    score: 976654,
                    rank: "S",
                    fc_type: 2,
                    play_count: 1,
                    fullcombo_count: 1,
                    pianistic_count: 0,
                    max_combo: 100,
                    grade_basic: 10000,
                    grade_recital: 0,
                    besttime: "2026-08-11",
                    judge_sjust: 90,
                    judge_just: 5,
                    judge_good: 3,
                    judge_near: 1,
                    judge_miss: 1,
                },
            });
            await db!.chartPlayHistory.create({
                data: {
                    user_id: user.id,
                    chart_id: chart.id,
                    score: 976654,
                    rank: "S",
                    max_combo: 100,
                    grade_basic: 10000,
                    source_play_time: "2026-08-11 21:04:00",
                },
            });
            const response = await page.goto(`/ko/profile/${user.id}`);
            await expect(
                page.getByRole("heading", { name: user.username!, exact: true })
            ).toBeVisible();
            await expect(
                page
                    .getByRole("region", { name: "베스트 성과", exact: true })
                    .getByRole("link")
            ).toHaveCount(1);
            await expect(
                page.getByRole("heading", { name: "판정 요약", exact: true })
            ).toBeVisible();
            await expect(
                page.getByRole("button", {
                    name: "프로필 카드 공유",
                    exact: true,
                })
            ).toHaveCount(0);
            const html = await response!.text();
            for (const [name, secret] of [
                ["hide_nostalgia_name", user.nostalgia_name!],
                ["hide_discord_name", user.discord_name!],
                ["hide_discord_name", user.discord_username!],
                ["hide_preferred_arcade", arcade.name],
                ["hide_play_count", "987654"],
            ]) {
                if (hidden(name)) expect(html).not.toContain(secret);
                else expect(html).toContain(secret);
            }
            const recent = await page.request.get(
                `/api/profiles/${user.id}/plays?kind=recent&offset=0`
            );
            const payload = (await recent.json()).result;
            expect(payload.status).toBe(
                hidden("hide_play_activity") ? "hidden" : "available"
            );
            expect(payload.items).toHaveLength(
                hidden("hide_play_activity") ? 0 : 1
            );
            if (hidden("hide_play_activity")) {
                expect(html).not.toContain("2026-08-11 21:04:00");
                await expect(
                    page.getByRole("region", {
                        name: "최근 플레이",
                        exact: true,
                    })
                ).toHaveCount(0);
            }
        } finally {
            if (userId) await db!.user.delete({ where: { id: userId } });
            await db!.arcade.delete({ where: { id: arcade.id } });
        }
    });
}

test("P6 missing and malformed user ids retain the shell and offer Home", async ({
    page,
}) => {
    for (const id of ["2147483647", "999999999999999999", "invalid"]) {
        await page.goto(`/ko/profile/${id}`);
        await expect(
            page.getByText("페이지를 찾을 수 없습니다.", { exact: true })
        ).toBeVisible();
        await expect(page.getByRole("banner")).toBeVisible();
        await expect(
            page.getByRole("link", { name: "홈으로 이동", exact: true })
        ).toHaveAttribute("href", "/ko");
    }
});
