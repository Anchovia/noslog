import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, within } from "storybook/test";

import ActionButton from "./actionButton";
const meta = {
    title: "UI/ActionButton",
    component: ActionButton,
    args: { children: "저장", onClick: fn() },
    parameters: {
        docs: {
            description: {
                component:
                    "비동기 동작용 버튼. busy 중에는 포커스를 유지하면서 중복 실행을 막습니다.",
            },
        },
    },
} satisfies Meta<typeof ActionButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Busy: Story = {
    args: { busy: true, busyLabel: "저장 중" },
    play: async ({ canvasElement, args }) => {
        const button = within(canvasElement).getByRole("button", {
            name: "저장 중",
        });
        await expect(button).toHaveAttribute("aria-busy", "true");
        button.click();
        await expect(args.onClick).not.toHaveBeenCalled();
    },
};
export const Disabled: Story = { args: { disabled: true } };
