import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import UnitInput from "./unit-input";

const meta = {
    title: "UI/UnitInput",
    component: UnitInput,
    args: {
        unit: "대",
        defaultValue: "1",
        type: "number",
        "aria-label": "대수",
    },
    parameters: {
        docs: {
            description: {
                component:
                    "단위 붙은 입력칸 — 공용 입력칸 모양 안에 오른쪽 단위 글자.",
            },
        },
    },
} satisfies Meta<typeof UnitInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        await expect(
            within(canvasElement).getByRole("spinbutton", { name: "대수" })
        ).toHaveValue(1);
    },
};
export const Disabled: Story = { args: { disabled: true } };
