import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";

test.skip(
    process.env.NOSLOG_MAINTENANCE_VERIFICATION !== "true",
    "Requires an isolated production server with maintenance enabled."
);

for (const locale of ["ko", "ja", "en"] as const) {
    test(`P7 ${locale} maintenance returns 503 and preserves the requested destination`, async ({
        page,
        request,
    }) => {
        const messages = getMessages(locale);
        const response = await page.goto(
            `/${locale}/rankings?mode=recital&page=2`
        );
        expect(response?.status()).toBe(503);
        expect(response?.headers()["cache-control"]).toContain("no-store");
        const end = process.env.MAINTENANCE_EXPECTED_END_AT;
        expect(response?.headers()["retry-after"]).toBe(
            end ? new Date(end).toUTCString() : undefined
        );
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            messages["maintenance.heading"]
        );
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.getByRole("main").locator("time")).toHaveCount(
            end ? 2 : 0
        );
        if (end)
            await expect(page.locator("time").first()).toHaveAttribute(
                "datetime",
                end
            );
        for (const width of [320, 390, 768, 1470]) {
            await page.setViewportSize({ width, height: 600 });
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
        }
        const reload = page.waitForResponse((next) =>
            next.request().isNavigationRequest()
        );
        await page
            .getByRole("button", {
                name: messages["recovery.checkAgain"],
                exact: true,
            })
            .click();
        expect((await reload).status()).toBe(503);
        await expect(page).toHaveURL(
            new RegExp(`/${locale}/rankings\\?mode=recital&page=2$`)
        );
        const api = await request.get("/api/profiles/1/overview", {
            headers: { "accept-language": locale },
        });
        expect(api.status()).toBe(503);
        expect(api.headers()["cache-control"]).toContain("no-store");
        expect(await api.json()).toEqual({
            isSuccess: false,
            code: "MAINTENANCE",
            message: messages["maintenance.description"],
            result: null,
        });
        expect(
            (await new AxeBuilder({ page }).include("main").analyze())
                .violations
        ).toEqual([]);
    });
}
