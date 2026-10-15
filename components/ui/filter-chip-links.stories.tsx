import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import FilterChipLinks from "./filter-chip-links";
const meta = {
    title: "UI/FilterChipLinks",
    component: FilterChipLinks,
    args: {
        label: "악곡 구역",
        options: [
            {
                key: "overview",
                label: "개요",
                href: "/ko/music",
                selected: true,
            },
            {
                key: "records",
                label: "기록",
                href: "/ko/rankings",
                selected: false,
            },
        ],
    },
    parameters: {
        docs: {
            description: {
                component:
                    "주소 기반 선택. 현재 위치는 aria-current로 전달하고 스토리에서는 실제 페이지로 이동하지 않습니다.",
            },
        },
    },
} satisfies Meta<typeof FilterChipLinks>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(
            canvas.getByRole("link", { name: "개요" })
        ).toHaveAttribute("aria-current", "page");
        await expect(
            canvas.getByRole("link", { name: "기록" })
        ).not.toHaveAttribute("aria-current");
    },
};
