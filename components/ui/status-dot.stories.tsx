import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import StatusDot from "./status-dot";

const meta = {
    title: "UI/StatusDot",
    component: StatusDot,
    args: { tone: "success" },
    render: (args) => (
        <span className="nl-control">
            <StatusDot {...args} />
        </span>
    ),
    parameters: {
        docs: {
            description: {
                component:
                    "상태 색 점 8 — 늘 상태 글자와 함께 쓴다. empty 는 빈 원(미확인).",
            },
        },
    },
} satisfies Meta<typeof StatusDot>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Success: Story = {
    play: async ({ canvasElement }) => {
        await expect(
            canvasElement.querySelector(".nl-status-dot")
        ).toHaveAttribute("data-tone", "success");
    },
};
export const Danger: Story = { args: { tone: "danger" } };
export const Info: Story = { args: { tone: "info" } };
export const Empty: Story = { args: { tone: "empty" } };
