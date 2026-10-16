import { PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

// 앱 서버와 같은 e2e DB(CI 의 Postgres 서비스 · 로컬 noslog_e2e)에 테스트용 사용자를 만들고 지운다.
const databaseUrl = process.env.DATABASE_URL;
const safeLocalDatabase =
    databaseUrl &&
    ["localhost", "127.0.0.1", "postgres"].includes(
        new URL(databaseUrl).hostname
    );
test.skip(
    !safeLocalDatabase,
    "Set DATABASE_URL to the local e2e database; never runs against a shared database."
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
        data: {
            username: `p6-history-${Date.now()}`,
            stats: { create: { gradeBasic: 10000 } },
        },
    });
    const empty = await db!.user.create({
        data: { username: `p6-empty-${Date.now()}` },
    });
    try {
        await db!.userBestGrade.createMany({
            data: [80, 50, 10].map((days, index) => {
                const date = new Date(Date.now() - days * 86400000)
                    .toISOString()
                    .slice(0, 10);
                // 하루 한 줄은 날짜 열(day)로(2026-10-16 DB 재설계 P5-1)
                return {
                    userId: user.id,
                    day: new Date(`${date}T00:00:00Z`),
                    gradeBasic: 8000 + index * 1000,
                    gradeRecital: 0,
                };
            }),
        });
        await page.goto(`/en/profile/${user.id}`);
        const progress = page.getByRole("region", {
            name: "Progress over time",
            exact: true,
        });
        await expect(progress.locator(".nl-line-chart__target")).toHaveCount(3);
        // 기간 = 공용 셀렉트(Radix 콤보박스). 30일 안의 관측은 10일 전 하나 — 점 하나로 그린다(line-chart points.length === 1)
        await progress
            .getByRole("combobox", { name: "Trend period", exact: true })
            .click();
        await page
            .getByRole("option", { name: "30 days", exact: true })
            .click();
        await expect(progress.locator(".nl-line-chart__target")).toHaveCount(1);
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
            data: { name: `${marker}-arcade`, isActive: false },
        });
        let userId: number | undefined;
        try {
            const chart = await db!.musicChart.findFirstOrThrow({
                where: {
                    musicIdx: "bfdaadfb98501907925ecf41a076108d",
                    difficulty: "Expert",
                },
            });
            const hidden = (name: string) => flag === name || flag === "all";
            const user = await db!.user.create({
                data: {
                    username: `${marker}-public`,
                    nostalgiaName: `${marker}-game`,
                    discordName: `${marker}-discord`,
                    discordUsername: `${marker}-handle`,
                    preferredArcadeId: arcade.id,
                    // 동기화 결과는 player_stats 에서(2026-10-16 DB 재설계 P4)
                    stats: {
                        create: {
                            playCount: 987654,
                            gradeBasic: 10000,
                            gradeRecital: 0,
                        },
                    },
                    hideNostalgiaName: hidden("hide_nostalgia_name"),
                    hideDiscordName: hidden("hide_discord_name"),
                    hidePlayCount: hidden("hide_play_count"),
                    hidePreferredArcade: hidden("hide_preferred_arcade"),
                    hidePlayActivity: hidden("hide_play_activity"),
                },
            });
            userId = user.id;
            await db!.playData.create({
                data: {
                    userId: user.id,
                    chartId: chart.id,
                    level: chart.level,
                    score: 976654,
                    rank: "S",
                    fcType: 2,
                    playCount: 1,
                    fullcomboCount: 1,
                    pianisticCount: 0,
                    maxCombo: 100,
                    gradeBasic: 10000,
                    gradeRecital: 0,
                    judgeSjust: 90,
                    judgeJust: 5,
                    judgeGood: 3,
                    judgeNear: 1,
                    judgeMiss: 1,
                },
            });
            await db!.chartPlayHistory.create({
                data: {
                    userId: user.id,
                    chartId: chart.id,
                    score: 976654,
                    rank: "S",
                    maxCombo: 100,
                    gradeBasic: 10000,
                    // 2026-08-11 21:04 KST
                    playedAt: new Date("2026-08-11T12:04:00Z"),
                },
            });
            const response = await page.goto(`/ko/profile/${user.id}`);
            await expect(
                page.getByRole("heading", { name: user.username!, exact: true })
            ).toBeVisible();
            await expect(
                page
                    .getByRole("region", { name: "베스트 성과", exact: true })
                    .getByRole("list")
                    .getByRole("link")
            ).toHaveCount(1);
            await expect(
                page.getByRole("heading", { name: "레벨별 달성", exact: true })
            ).toBeVisible();
            await expect(
                page.getByRole("button", {
                    name: "프로필 카드 공유",
                    exact: true,
                })
            ).toHaveCount(0);
            const html = await response!.text();
            for (const [name, secret] of [
                ["hide_nostalgia_name", user.nostalgiaName!],
                ["hide_discord_name", user.discordName!],
                ["hide_discord_name", user.discordUsername!],
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
