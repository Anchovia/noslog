import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { Checkbox } from "./checkbox";

const meta = {
    title: "UI/Checkbox",
    component: Checkbox,
    args: { label: "플레이 점수 공개" },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const checkbox = within(canvasElement).getByRole("checkbox", {
            name: "플레이 점수 공개",
        });
        checkbox.focus();
        await userEvent.keyboard(" ");
        await expect(checkbox).toBeChecked();
        await userEvent.keyboard(" ");
        await expect(checkbox).not.toBeChecked();
    },
};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
