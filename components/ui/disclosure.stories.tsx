import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor } from "storybook/test";

import Disclosure from "./disclosure";
const meta = {
    title: "UI/Disclosure",
    component: Disclosure,
    args: {
        title: "상세 조건",
        children: <p className="nl-body">펼침 내용</p>,
    },
    parameters: {
        docs: {
            description: {
                component:
                    "네이티브 details·summary 펼침. compact·card·section은 기존 지원 형태입니다.",
            },
        },
    },
} satisfies Meta<typeof Disclosure>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const summary = canvasElement.querySelector("summary")!;
        await userEvent.click(summary);
        await waitFor(() =>
            expect(canvasElement.querySelector("details")).toHaveAttribute(
                "open"
            )
        );
        await userEvent.click(summary);
        await waitFor(() =>
            expect(canvasElement.querySelector("details")).not.toHaveAttribute(
                "open"
            )
        );
    },
};
export const Compact: Story = { args: { compact: true } };
export const Card: Story = { args: { card: true, open: true } };
export const Section: Story = { args: { heading: "section", meta: "3개" } };
