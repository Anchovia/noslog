import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";
import { syncFixtureData } from "./fixtures/syncData";

test.skip(
    process.env.NOSLOG_SYNC_FIXTURE !== "true",
    "Requires the isolated render-only sync fixture."
);

for (const locale of ["ko", "ja", "en"] as const) {
    const t = getMessages(locale);
    test(`P8 ${locale} state matrix preserves scope, reflow and disclosure`, async ({
        page,
    }) => {
        let state = "full";
        await page.route("**/api/sync/status", (route) =>
            route.fulfill({
                json: {
                    isSuccess: true,
                    code: "SUCCESS",
                    message: "",
                    result: syncFixtureData(state),
                },
            })
        );
        for (state of [
            "none",
            "full",
            "recent",
            "partial",
            "processing",
            "delayed",
            "timedOut",
            "failed",
            "cooldown",
            "large",
        ]) {
            await page.goto(
                `/${locale}/p7-verification?fixture=sync&state=${state}`
            );
            const main = page.getByRole("main");
            await expect(main.locator(".nl-sync-page")).toBeVisible();
            await expect(main.getByRole("heading", { level: 1 })).toHaveText(
                t["sync.title"]
            );
            const completed = [
                "full",
                "recent",
                "partial",
                "cooldown",
                "large",
            ].includes(state);
            const latestResult = main.locator("details").filter({
                has: page.locator("summary", {
                    hasText: t["sync.latestResult"],
                }),
            });
            await expect(latestResult).toHaveCount(completed ? 1 : 0);
            if (completed) {
                await expect(main.locator(".nl-sync-status")).toHaveCount(0);
                await expect(main.locator(".nl-sync-primary")).toHaveCount(0);
                await expect(latestResult).not.toHaveAttribute("open", "");
                await latestResult.locator("summary").click();
                await expect(
                    latestResult.locator(".nl-sync-metrics")
                ).toBeVisible();
            }
            await expect(
                main.getByRole("heading", {
                    name: t["sync.coverage"],
                    exact: true,
                })
            ).toHaveCount(0);
            if (state === "recent")
                await expect(main).toContainText(t["sync.recentHelp"]);
            if (state === "partial")
                await expect(main).toContainText(t["sync.excludedTitle"]);
            if (state === "large")
                await expect(main).toContainText(t["sync.firstFull"]);
            if (["processing", "delayed"].includes(state))
                await expect(main.locator(".nl-sync-primary")).toHaveCount(0);
            if (completed)
                await expect(
                    main.getByRole("link", {
                        name: t["sync.openOfficial"],
                        exact: true,
                    })
                ).toHaveCount(1);
            for (const width of [320, 390, 671, 672, 768, 1055, 1056, 1470]) {
                await page.setViewportSize({ width, height: 844 });
                await expect
                    .poll(() =>
                        page.evaluate(
                            () =>
                                document.documentElement.scrollWidth <=
                                innerWidth
                        )
                    )
                    .toBe(true);
            }
            if (state === "full") {
                const setup = main.locator("details").filter({
                    has: page.locator("summary", {
                        hasText: t["sync.setup"],
                    }),
                });
                await expect(setup).toHaveAttribute("open", "");
                await expect(setup.locator(":scope > summary")).toContainText(
                    t["sync.setup"]
                );
                const history = main.locator("details").filter({
                    has: page.locator("summary", {
                        hasText: t["sync.history"],
                    }),
                });
                await history.locator("summary").click();
                await expect(
                    history.locator(".nl-sync-history > li")
                ).toHaveCount(5);
            }
            expect(
                (await new AxeBuilder({ page }).include("main").analyze())
                    .violations
            ).toEqual([]);
        }
    });
    test(`P8 ${locale} processing updates without moving focus and stops after completion`, async ({
        page,
    }) => {
        let state = "processing";
        let requests = 0;
        await page.route("**/api/sync/status", (route) => {
            requests += 1;
            return route.fulfill({
                json: {
                    isSuccess: true,
                    code: "SUCCESS",
                    message: "",
                    result: syncFixtureData(state),
                },
            });
        });
        await page.goto(
            `/${locale}/p7-verification?fixture=sync&state=processing`
        );
        const helpDisclosure = page.locator("details").filter({
            has: page.locator("summary", { hasText: t["sync.help"] }),
        });
        await helpDisclosure.locator("summary").click();
        const help = page.getByRole("button", {
            name: t["sync.invalidate"],
            exact: true,
        });
        await help.focus();
        state = "full";
        await expect(
            page.locator("summary", { hasText: t["sync.latestResult"] })
        ).toBeVisible();
        await expect(help).toBeFocused();
        const completedRequests = requests;
        await page.waitForTimeout(5500);
        expect(requests).toBe(completedRequests);
    });
    test(`P8 ${locale} setup media, copy failure and invalidation cancel are recoverable`, async ({
        page,
    }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.addInitScript(() =>
            Object.defineProperty(navigator, "clipboard", {
                configurable: true,
                value: {
                    writeText: async () => {
                        throw new DOMException(
                            "fixture denied",
                            "NotAllowedError"
                        );
                    },
                },
            })
        );
        await page.route("**/api/sync/status", (route) =>
            route.fulfill({
                json: {
                    isSuccess: true,
                    code: "SUCCESS",
                    message: "",
                    result: syncFixtureData("none"),
                },
            })
        );
        await page.goto(`/${locale}/p7-verification?fixture=sync&state=none`);
        const main = page.getByRole("main");
        await expect(main.locator('img[src$=".gif"]')).toHaveCount(0);
        await main.locator(".nl-sync-mobile-guide > summary").click();
        await main
            .getByRole("button", { name: t["sync.mobileAddAlt"], exact: true })
            .click();
        const media = page.getByRole("dialog");
        await expect(media.locator("img")).toBeVisible();
        await media.press("Escape");
        await expect(
            main.getByRole("button", {
                name: t["sync.mobileAddAlt"],
                exact: true,
            })
        ).toBeFocused();
        await main
            .getByRole("button", { name: t["sync.copyAddress"], exact: true })
            .click();
        await expect(main.getByRole("alert")).toContainText(
            t["common.retryLater"]
        );
        const helpDisclosure = main.locator("details").filter({
            has: page.locator("summary", { hasText: t["sync.help"] }),
        });
        await helpDisclosure.locator("summary").click();
        const invalidate = main.getByRole("button", {
            name: t["sync.invalidate"],
            exact: true,
        });
        await expect(invalidate).toHaveClass(/nl-button--danger-filled/);
        await invalidate.click();
        const dialog = page.getByRole("dialog");
        await expect(
            dialog.getByRole("button", {
                name: t["sync.invalidateConfirm"],
                exact: true,
            })
        ).toHaveClass(/nl-button--danger-filled/);
        await expect(
            dialog.getByRole("button", { name: t["sync.cancel"], exact: true })
        ).toBeFocused();
        await dialog.press("Escape");
        await expect(
            main.getByRole("button", {
                name: t["sync.invalidate"],
                exact: true,
            })
        ).toBeFocused();
    });
}
