import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import ChartDraftCopyButton from "./chart-draft-copy-button";

const writeText = fn(async (_text: string) => {});

const meta = {
    title: "Features/Contributions/ChartDraftCopyButton",
    component: ChartDraftCopyButton,
    args: { href: "/music/12/hard/draft" },
    beforeEach: () => {
        writeText.mockClear();
        const original = navigator.clipboard;
        Object.defineProperty(navigator, "clipboard", {
            configurable: true,
            value: { writeText },
        });
        return () => {
            Object.defineProperty(navigator, "clipboard", {
                configurable: true,
                value: original,
            });
        };
    },
} satisfies Meta<typeof ChartDraftCopyButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.click(
            canvas.getByRole("button", { name: "주소 복사" })
        );
        await expect(writeText).toHaveBeenCalledWith(
            new URL("/music/12/hard/draft", window.location.href).href
        );
        await expect(
            await canvas.findByRole("button", { name: "복사됨" })
        ).toBeVisible();
        await expect(canvas.getByRole("status")).toHaveTextContent(
            "주소를 복사했습니다."
        );
    },
};

export const CurrentPage: Story = {
    args: { href: undefined },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.click(
            canvas.getByRole("button", { name: "주소 복사" })
        );
        await expect(writeText).toHaveBeenCalledWith(window.location.href);
    },
};
