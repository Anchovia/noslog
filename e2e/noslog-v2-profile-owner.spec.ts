import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { getMessages } from "../lib/i18n/messages";

test.skip(
    process.env.NOSLOG_RECOVERY_FIXTURE !== "true",
    "Uses disposable UI fixtures; never forges a session or changes endpoint permissions."
);
const cardPattern = "**/profile/2147483646/card?mode=*";
const fixtureUrl = (locale: string, query = "") =>
    `/${locale}/p7-verification?fixture=profile${query}`;

for (const locale of ["ko", "ja", "en"] as const) {
    const t = getMessages(locale);
    test(`P6 ${locale} owner privacy and sync controls follow the approved state matrix`, async ({
        page,
    }) => {
        for (const privacy of [
            "nostalgia",
            "discord",
            "arcade",
            "count",
            "activity",
            "all",
        ]) {
            await page.goto(fixtureUrl(locale, `&privacy=${privacy}`));
            const identity = page.getByRole("region", {
                name: "PROFILE_OWNER_FIXTURE",
                exact: true,
            });
            await expect(identity).toContainText(t["profile.private"]);
            await expect(
                identity.getByRole("link", {
                    name: t["profile.settings"],
                    exact: true,
                })
            ).toHaveCount(2);
            for (const [flag, secret] of [
                ["nostalgia", "FIXTURE_NOSTALGIA"],
                ["discord", "FIXTURE_DISCORD"],
                ["arcade", "FIXTURE_ARCADE"],
            ]) {
                if (privacy === flag || privacy === "all")
                    await expect(identity).not.toContainText(secret);
                else await expect(identity).toContainText(secret);
            }
            await page.setViewportSize({ width: 320, height: 844 });
            await expect
                .poll(() =>
                    page.evaluate(
                        () => document.documentElement.scrollWidth <= innerWidth
                    )
                )
                .toBe(true);
        }
        for (const sync of [
            "none",
            "processing",
            "partial",
            "failed",
            "completed",
        ]) {
            await page.goto(fixtureUrl(locale, `&sync=${sync}`));
            const identity = page.getByRole("region", {
                name: "PROFILE_OWNER_FIXTURE",
                exact: true,
            });
            const recovery = identity.getByRole("link", {
                name: t["sync.title"],
                exact: true,
            });
            await expect(recovery).toHaveCount(
                ["partial", "failed"].includes(sync) ? 1 : 0
            );
            if (["partial", "failed"].includes(sync)) {
                const chips = await identity
                    .locator(".nl-profile-identity__chips")
                    .boundingBox();
                const action = await recovery.boundingBox();
                expect(action!.height).toBe(40);
                expect(action!.y - chips!.y - chips!.height).toBe(12);
            }
        }
        expect(
            (await new AxeBuilder({ page }).include("main").analyze())
                .violations
        ).toEqual([]);
    });

    test(`P6 ${locale} share preparation, card failure, retry and unsupported copy keep accessible actions`, async ({
        page,
    }, testInfo) => {
        await page.addInitScript(() => {
            Object.defineProperty(navigator, "clipboard", {
                configurable: true,
                value: {},
            });
            Object.defineProperty(navigator, "share", {
                configurable: true,
                value: undefined,
            });
        });
        const png = await readFile("public/logo.png");
        let fail = true;
        let release!: () => void;
        const held = new Promise<void>((resolve) => {
            release = resolve;
        });
        await page.route(cardPattern, async (route) => {
            await held;
            await route.fulfill(
                fail
                    ? { status: 503, body: "fixture unavailable" }
                    : { status: 200, contentType: "image/png", body: png }
            );
        });
        await page.goto(fixtureUrl(locale, "&mode=recital"));
        const trigger = page.getByRole("button", {
            name: t["profile.share"],
            exact: true,
        });
        await trigger.click();
        const dialog = page.getByRole("dialog", {
            name: t["profile.shareTitle"],
            exact: true,
        });
        await expect(dialog.locator(".nl-skeleton")).toBeVisible();
        await expect(
            dialog.getByRole("button", {
                name: t["profile.saveImage"],
                exact: true,
            })
        ).toBeDisabled();
        release();
        await expect(dialog.getByRole("alert")).toContainText(
            t["profile.cardError"]
        );
        fail = false;
        await dialog
            .getByRole("button", { name: t["common.retry"], exact: true })
            .click();
        await expect(
            dialog.getByRole("button", {
                name: t["profile.saveImage"],
                exact: true,
            })
        ).toBeEnabled();
        await expect(
            dialog.getByRole("button", {
                name: t["profile.copyImage"],
                exact: true,
            })
        ).toBeDisabled();
        await expect(
            dialog.getByRole("button", {
                name: t["profile.shareX"],
                exact: true,
            })
        ).toBeVisible();
        for (const width of [320, 390, 768, 1470]) {
            await page.setViewportSize({ width, height: 844 });
            const box = await dialog.boundingBox();
            expect(box!.x).toBeGreaterThanOrEqual(16);
            expect(box!.x + box!.width).toBeLessThanOrEqual(width - 16);
            if (width >= 768) {
                const copyButton = await dialog
                    .getByRole("button", {
                        name: t["profile.copyImage"],
                        exact: true,
                    })
                    .boundingBox();
                expect(copyButton!.height).toBe(40);
            }
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({
            path: testInfo.outputPath(`p6-share-${locale}.png`),
        });
        expect(
            (
                await new AxeBuilder({ page })
                    .include('[role="dialog"]')
                    .analyze()
            ).violations
        ).toEqual([]);
        await dialog.press("Escape");
        await expect(trigger).toBeFocused();
    });

    test(`P6 ${locale} clipboard rejection recovers and cancelled native sharing stays neutral`, async ({
        page,
    }) => {
        await page.addInitScript(() => {
            let copies = 0;
            Object.defineProperty(navigator, "clipboard", {
                configurable: true,
                value: {
                    write: async () => {
                        copies += 1;
                        if (copies === 1)
                            throw new DOMException(
                                "fixture denied",
                                "NotAllowedError"
                            );
                    },
                },
            });
            Object.defineProperty(window, "ClipboardItem", {
                configurable: true,
                value: class {
                    static supports() {
                        return true;
                    }
                },
            });
            Object.defineProperty(navigator, "canShare", {
                configurable: true,
                value: () => true,
            });
            Object.defineProperty(navigator, "share", {
                configurable: true,
                value: async () => {
                    throw new DOMException("fixture cancelled", "AbortError");
                },
            });
        });
        const png = await readFile("public/logo.png");
        await page.route(cardPattern, (route) =>
            route.fulfill({ status: 200, contentType: "image/png", body: png })
        );
        await page.goto(fixtureUrl(locale));
        await page
            .getByRole("button", { name: t["profile.share"], exact: true })
            .click();
        const dialog = page.getByRole("dialog");
        await dialog
            .getByRole("button", { name: t["profile.copyImage"], exact: true })
            .click();
        await expect(dialog.getByRole("alert")).toContainText(
            t["profile.imageError"]
        );
        await dialog
            .getByRole("button", { name: t["profile.copyImage"], exact: true })
            .click();
        await expect(dialog.getByRole("status")).toContainText(
            t["profile.copiedImage"]
        );
        await dialog
            .getByRole("button", {
                name: t["profile.shareAction"],
                exact: true,
            })
            .click();
        await expect(dialog.getByRole("alert")).toHaveCount(0);
        await expect(
            dialog.getByRole("button", {
                name: t["profile.saveImage"],
                exact: true,
            })
        ).toBeEnabled();
        await dialog.press("Escape");
    });
}
