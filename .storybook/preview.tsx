import "@/app/globals.css";

import type { Preview } from "@storybook/nextjs-vite";

import { LocaleProvider } from "@/components/i18n/locale-provider";
import { getMessages } from "@/lib/i18n/messages";
import { resolveLocale } from "@/lib/i18n/routing";

import { contractViewports } from "./responsive-contract";

const preview: Preview = {
    tags: ["autodocs"],
    initialGlobals: { locale: "ko" },
    globalTypes: {
        locale: {
            description: "NosLog 언어",
            toolbar: {
                title: "언어",
                items: [
                    { value: "ko", title: "한국어" },
                    { value: "ja", title: "日本語" },
                    { value: "en", title: "English" },
                ],
                dynamicTitle: true,
            },
        },
    },
    parameters: {
        layout: "padded",
        viewport: { options: contractViewports },
        a11y: {
            test: "error",
            // 색 대비 기준 3 : 1 — axe 기본 검사의 비율만 바꾸고 나머지 값은 기본 그대로
            config: {
                checks: [
                    {
                        id: "color-contrast",
                        options: {
                            ignoreUnicode: true,
                            ignoreLength: false,
                            ignorePseudo: false,
                            boldValue: 700,
                            boldTextPt: 14,
                            largeTextPt: 18,
                            contrastRatio: {
                                normal: { expected: 3 },
                                large: { expected: 3 },
                            },
                            pseudoSizeThreshold: 0.25,
                            shadowOutlineEmMax: 0.2,
                            textStrokeEmMin: 0.03,
                        },
                    },
                ],
            },
            options: {
                runOnly: {
                    type: "tag",
                    values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
                },
            },
        },
        nextjs: { appDirectory: true },
    },
    decorators: [
        (Story, context) => {
            const locale = resolveLocale(context.globals.locale);
            // Portals inherit document language; styles still use their existing noslog-ui wrapper.
            document.documentElement.lang = locale;
            return (
                <LocaleProvider locale={locale} messages={getMessages(locale)}>
                    <main
                        className={
                            context.parameters.layout === "fullscreen"
                                ? "noslog-ui bg-nl-canvas"
                                : "noslog-ui bg-nl-canvas p-nl-16"
                        }
                        lang={locale}
                    >
                        <Story />
                    </main>
                </LocaleProvider>
            );
        },
    ],
};

export default preview;
