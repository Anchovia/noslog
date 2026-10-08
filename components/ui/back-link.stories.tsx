import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import BackLink from "./back-link";
const meta = {
    title: "UI/BackLink",
    component: BackLink,
    args: { href: "/ko/music", children: "악곡 목록" },
    parameters: {
        docs: {
            description: {
                component: "히스토리 이동이 아닌 상위 페이지 링크입니다.",
            },
        },
    },
} satisfies Meta<typeof BackLink>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        await expect(
            within(canvasElement).getByRole("link", { name: "악곡 목록" })
        ).toHaveAttribute("href", "/ko/music");
    },
};
export const Plain: Story = { args: { plain: true } };
