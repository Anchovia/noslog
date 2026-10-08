import "@/app/globals.css";

import type { Preview } from "@storybook/nextjs-vite";

import { LocaleProvider } from "@/components/i18n/locale-provider";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale } from "@/lib/i18n/routing";

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
        a11y: {
            test: "error",
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
            const locale = isLocale(context.globals.locale)
                ? context.globals.locale
                : "ko";
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
