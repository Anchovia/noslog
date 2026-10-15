import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import Avatar from "./avatar";
const meta = {
    title: "UI/Avatar",
    component: Avatar,
    args: { alt: "NosLog 프로필", fallbackName: "NosLog" },
    parameters: {
        docs: {
            description: {
                component:
                    "이름 첫 글자와 기본 아이콘 대체 표시. 정보가 있는 사진에는 alt를 전달하고 장식이면 빈 alt를 씁니다.",
            },
        },
    },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        await expect(
            within(canvasElement).getByRole("img", { name: "NosLog 프로필" })
        ).toHaveTextContent("N");
    },
};
export const Photo: Story = { args: { src: "/logo.png" } };
export const IconFallback: Story = { args: { fallbackName: null } };
export const Decorative: Story = { args: { alt: "" } };
