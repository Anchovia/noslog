import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { getMessages } from "@/lib/i18n/messages";

async function chooseProof(
    page: Page,
    label: string,
    file: Parameters<import("@playwright/test").FileChooser["setFiles"]>[0]
) {
    const chooser = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: label, exact: true }).click();
    await (await chooser).setFiles(file);
}

test.skip(
    process.env.NOSLOG_EXAMS_FIXTURE !== "true",
    "Requires the isolated local P13 presentation harness."
);
for (const locale of ["ko", "ja", "en"] as const) {
    test(`P13 ${locale} reference, selector, Event choices and history reflow`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`/${locale}/p7-verification?fixture=exams`);
        await expect(page.locator("#exam-title")).toContainText("8");
        for (const width of [
            320, 390, 671, 672, 768, 1055, 1056, 1470, 1055, 1470,
        ]) {
            await page.setViewportSize({ width, height: 900 });
            const rail = page.locator(".nl-exam-rail");
            if (width >= 1056) {
                await expect(rail).toBeVisible();
                await expect(rail).toHaveCSS("padding", "8px");
                await expect(page.getByRole("combobox")).not.toBeVisible();
                const first = (await rail
                    .locator("button")
                    .nth(0)
                    .boundingBox())!;
                const second = (await rail
                    .locator("button")
                    .nth(1)
                    .boundingBox())!;
                expect(first.height).toBe(44);
                expect(second.y - first.y - first.height).toBe(4);
            } else {
                await expect(rail).not.toBeVisible();
                await expect(page.getByRole("combobox")).toBeVisible();
            }
            await expect(page.locator("#exam-title")).toContainText("8");
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
            if (width === 390 || width === 1470)
                await page.screenshot({
                    path: testInfo.outputPath(`exams-${width}.png`),
                    fullPage: true,
                });
        }
        await expect(page.locator(".nl-exam-rail button")).toHaveCount(10);
        await expect(page.getByRole("combobox")).not.toBeVisible();
        await page.setViewportSize({ width: 390, height: 900 });
        await page.getByRole("combobox").click();
        await page
            .getByRole("option")
            .filter({ hasText: t["rankings.examGrade"].replace("{exam}", "7") })
            .click();
        await expect(page).toHaveURL(new RegExp(`/${locale}/exams/basic-7$`));
        await expect(page.locator("#exam-title")).toContainText("7");
        await page.goBack();
        await expect(page.locator("#exam-title")).toContainText("8");
        await page
            .getByText(t["exams.practice.title"], { exact: true })
            .click();
        await expect(
            page.getByText(t["exams.practice.limitation"], { exact: true })
        ).toBeVisible();
        await expect(
            page.getByText(t["exams.practice.partial"], { exact: true })
        ).toBeVisible();
        await page.getByRole("radio", { name: "Recital", exact: true }).click();
        await expect(
            page.getByText(t["exams.recital.explanation"], { exact: true })
        ).toBeVisible();
        await expect(page.locator(".nl-exam-practice")).toHaveCount(0);
        await page.getByRole("radio", { name: "Event", exact: true }).click();
        await expect(page.locator(".nl-exam-proof")).toHaveCount(0);
        await expect(page.locator(".nl-exam-stage__charts > span")).toHaveCount(
            9
        );
        await page.locator(".nl-exam-stage__row").first().click();
        await expect(page.getByRole("dialog").getByRole("link")).toHaveCount(3);
        await page.keyboard.press("Escape");
        await expect(page.locator(".nl-exam-stage__row").first()).toBeFocused();
        expect(
            (await new AxeBuilder({ page }).include(".nl-exams").analyze())
                .violations
        ).toEqual([]);
        expect(errors).toEqual([]);
    });

    test(`P13 ${locale} proof selection is local and failed submission retains preview`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        await page.goto(`/${locale}/p7-verification?fixture=exams&state=proof`);
        await chooseProof(page, t["exams.proof.upload"], {
            name: "invalid.txt",
            mimeType: "text/plain",
            buffer: Buffer.from("invalid"),
        });
        await expect(
            page.locator(".nl-exam-proof").getByRole("alert")
        ).toContainText(t["exams.proof.invalidImage"]);
        await chooseProof(page, t["exams.proof.upload"], "public/logo.png");
        await expect(page.getByAltText(t["exams.proof.preview"])).toBeVisible();
        await expect(page.getByLabel("Fixture submissions")).toHaveText("0");
        await expect(page.locator(".nl-exam-proof li")).toHaveCount(5);
        for (const width of [320, 390, 768, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
        }
        await page
            .getByRole("button", { name: t["exams.proof.submit"], exact: true })
            .click();
        await expect(page.getByLabel("Fixture submissions")).toHaveText("1");
        await expect(page.getByAltText(t["exams.proof.preview"])).toBeVisible();
        await page.setViewportSize({ width: 390, height: 900 });
        await page.screenshot({
            path: testInfo.outputPath("proof-preview-390.png"),
            fullPage: true,
        });
        expect(
            (await new AxeBuilder({ page }).include(".nl-exam-proof").analyze())
                .violations
        ).toEqual([]);
        await page
            .getByRole("button", { name: t["exams.proof.cancel"], exact: true })
            .click();
        await expect(page.getByAltText(t["exams.proof.preview"])).toHaveCount(
            0
        );
        await expect(page.getByLabel("Fixture submissions")).toHaveText("1");
        await expect(
            page.locator(".nl-exam-proof").getByRole("alert")
        ).toHaveCount(0);
    });

    test(`P13 ${locale} rejected proof, size limit, replacement and busy controls`, async ({
        page,
    }) => {
        const t = getMessages(locale);
        await page.goto(
            `/${locale}/p7-verification?fixture=exams&state=proof-rejected`
        );
        await expect(
            page.getByText("Fixture review reason", { exact: true })
        ).toBeVisible();
        await chooseProof(page, t["exams.proof.resubmit"], {
            name: "too-large.png",
            mimeType: "image/png",
            buffer: Buffer.alloc(4 * 1024 * 1024 + 1),
        });
        await expect(
            page.locator(".nl-exam-proof").getByRole("alert")
        ).toContainText(t["exams.proof.imageTooLarge"]);
        await expect(page.getByLabel("Fixture submissions")).toHaveText("0");
        await chooseProof(page, t["exams.proof.resubmit"], "public/logo.png");
        const originalPreview = await page
            .getByAltText(t["exams.proof.preview"])
            .getAttribute("src");
        await chooseProof(page, t["exams.proof.replace"], "public/logo.png");
        await expect(
            page.getByAltText(t["exams.proof.preview"])
        ).not.toHaveAttribute("src", originalPreview!);
        await expect(page.getByLabel("Fixture submissions")).toHaveText("0");

        await page.goto(
            `/${locale}/p7-verification?fixture=exams&state=proof-busy`
        );
        await chooseProof(page, t["exams.proof.upload"], "public/logo.png");
        await page
            .getByRole("button", { name: t["exams.proof.submit"], exact: true })
            .click();
        await expect(
            page.locator(".nl-exam-proof").getByRole("status")
        ).toHaveText(t["exams.proof.uploading"]);
        for (const key of ["uploading", "replace", "cancel"] as const)
            await expect(
                page.getByRole("button", {
                    name: t[`exams.proof.${key}`],
                    exact: true,
                })
            ).toBeDisabled();
        await page
            .getByRole("button", { name: "Finish fixture upload", exact: true })
            .click();
        await expect(
            page.getByText(t["exams.proof.reviewing"], { exact: true })
        ).toBeVisible();
    });

    test(`P13 ${locale} expired authorization retains selection and links back to the exam`, async ({
        page,
    }, testInfo) => {
        const t = getMessages(locale);
        await page.goto(
            `/${locale}/p7-verification?fixture=exams&state=proof-expired`
        );
        await chooseProof(page, t["exams.proof.upload"], "public/logo.png");
        const preview = page.getByAltText(t["exams.proof.preview"]);
        const source = await preview.getAttribute("src");
        await page
            .getByRole("button", { name: t["exams.proof.submit"], exact: true })
            .click();
        await expect(
            page.locator(".nl-exam-proof").getByRole("alert")
        ).toHaveText(t["onboarding.error.loginRequired"]);
        await expect(preview).toHaveAttribute("src", source!);
        const login = page.getByRole("link", {
            name: t["exams.proof.login"],
            exact: true,
        });
        await expect(login).toHaveAttribute(
            "href",
            `/${locale}/login?returnTo=${encodeURIComponent(`/${locale}/exams/basic-8`)}`
        );
        await login.focus();
        await expect(login).toBeFocused();
        for (const width of [320, 390, 1470]) {
            await page.setViewportSize({ width, height: 900 });
            await page.evaluate(() => window.scrollTo(0, 0));
            expect(
                await page.evaluate(
                    () => document.documentElement.scrollWidth <= innerWidth
                )
            ).toBe(true);
            await page.screenshot({
                path: testInfo.outputPath(`proof-expired-${width}.png`),
                fullPage: true,
            });
        }
        expect(
            (await new AxeBuilder({ page }).include(".nl-exam-proof").analyze())
                .violations
        ).toEqual([]);
        await page
            .getByRole("button", { name: t["exams.proof.submit"], exact: true })
            .click();
        await expect(page.getByLabel("Fixture submissions")).toHaveText("2");
        await expect(preview).toHaveAttribute("src", source!);
    });

    test(`P13 ${locale} successful proof, guest and empty states`, async ({
        page,
    }) => {
        const t = getMessages(locale);
        await page.goto(
            `/${locale}/p7-verification?fixture=exams&state=proof-success`
        );
        await chooseProof(page, t["exams.proof.upload"], "public/logo.png");
        await page
            .getByRole("button", { name: t["exams.proof.submit"], exact: true })
            .click();
        await expect(
            page.getByText(t["exams.proof.reviewing"], { exact: true })
        ).toBeVisible();
        await expect(page.getByAltText(t["exams.proof.preview"])).toHaveCount(
            0
        );
        await page.goto(`/${locale}/p7-verification?fixture=exams&state=guest`);
        await expect(page.locator(".nl-exam-practice")).toHaveCount(0);
        await expect(
            page.getByRole("link", {
                name: t["exams.proof.login"],
                exact: true,
            })
        ).toHaveAttribute("href", new RegExp(`returnTo=.*exams`));
        await page.goto(`/${locale}/p7-verification?fixture=exams&state=empty`);
        await expect(
            page.getByText(t["exams.empty"], { exact: true })
        ).toBeVisible();
    });
}
