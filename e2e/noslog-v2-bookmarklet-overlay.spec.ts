import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import type { createBookmarkletHref } from "@/lib/bookmarklet";

let createHref: typeof createBookmarkletHref;
test.beforeAll(async () => {
    process.env.DATABASE_URL ??=
        "postgresql://fixture:fixture@localhost:5432/fixture";
    process.env.COOKIE_PASSWORD ??= "render-only-cookie-password-32-characters";
    process.env.BOOKMARKLET_SECRET ??=
        "render-only-bookmarklet-secret-32-characters";
    createHref = (await import("@/lib/bookmarklet")).createBookmarkletHref;
});

for (const locale of ["ko", "ja", "en"] as const) {
    for (const state of ["wrong", "full", "recent", "failed"] as const) {
        test(`bookmarklet ${locale} ${state} isolates provider data and reflows`, async ({
            page,
        }, testInfo) => {
            const posts: { totalData: unknown; token: string }[] = [];
            const errors: string[] = [];
            page.on("pageerror", (error) => errors.push(error.message));
            await page.route("**/*", async (route) => {
                const url = new URL(route.request().url());
                if (url.pathname.endsWith(".woff2"))
                    return route.fulfill({
                        body: await readFile(
                            "public/fonts/pretendard-jp/1.3.9/PretendardJPVariable.woff2"
                        ),
                        contentType: "font/woff2",
                        headers: { "Access-Control-Allow-Origin": "*" },
                    });
                if (url.pathname.includes("pdata_getdata")) {
                    if (state === "failed")
                        return route.fulfill({ status: 500, json: {} });
                    if (
                        state === "recent" &&
                        url.searchParams.get("service_kind") === "music_data"
                    )
                        return route.fulfill({ status: 403, json: {} });
                    return route.fulfill({
                        json: { status: 0, fixture: true },
                    });
                }
                if (url.pathname === "/api/receivePlayerData") {
                    if (route.request().method() === "OPTIONS")
                        return route.fulfill({
                            status: 204,
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Headers": "content-type",
                                "Access-Control-Allow-Methods": "POST",
                            },
                        });
                    posts.push(route.request().postDataJSON());
                    return route.fulfill({
                        json: { message: "Fixture sync completed." },
                        headers: { "Access-Control-Allow-Origin": "*" },
                    });
                }
                return route.fulfill({
                    contentType: "text/html",
                    body: "<!doctype html><title>Isolated bookmarklet fixture</title><body></body>",
                });
            });
            await page.goto(
                state === "wrong"
                    ? "https://noslog.example/fixture"
                    : "https://p.eagate.573.jp/fixture"
            );
            const source = decodeURIComponent(
                createHref(
                    "https://noslog.example",
                    "render-only-fixture",
                    undefined,
                    locale
                ).slice("javascript:".length)
            );
            // Execute the generated application in a fully routed, isolated browser.
            await page.evaluate((source) => {
                void (0, eval)(source);
            }, source);
            const overlay = page.locator("#noslog-sync-overlay");
            await expect(overlay).toHaveAttribute(
                "data-state",
                ["full", "recent"].includes(state) ? "success" : "failure"
            );
            await expect(overlay).not.toContainText("https://");
            await expect(page.locator("#noslog-sync-track")).toBeHidden();
            for (const width of [320, 390, 768, 1470]) {
                await page.setViewportSize({ width, height: 844 });
                await expect
                    .poll(() =>
                        overlay.evaluate(
                            (node) => node.scrollWidth <= node.clientWidth
                        )
                    )
                    .toBe(true);
                const box = await overlay.boundingBox();
                expect(box!.width).toBeLessThanOrEqual(334);
                expect(box!.x).toBeGreaterThanOrEqual(15);
                expect(box!.x + box!.width).toBeLessThanOrEqual(width - 15);
            }
            await page.screenshot({
                path: testInfo.outputPath(`${locale}-${state}.png`),
            });
            expect(posts.length).toBe(
                ["full", "recent"].includes(state) ? 1 : 0
            );
            if (state === "recent") expect(posts[0].totalData).toBeNull();
            if (state === "full")
                expect(posts[0].totalData).toEqual({
                    status: 0,
                    fixture: true,
                });
            await overlay.getByRole("button").click();
            await expect(overlay).toHaveCount(0);
            expect(errors).toEqual([]);
        });
    }
}
