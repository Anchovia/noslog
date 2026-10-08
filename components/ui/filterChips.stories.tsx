import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import FilterChips from "./filterChips";
const meta = {
    title: "UI/FilterChips",
    component: FilterChips,
    args: {
        label: "난이도",
        value: ["normal"],
        onValueChange: fn(),
        options: [
            { value: "normal", label: "Normal" },
            { value: "hard", label: "Hard" },
            { value: "expert", label: "Expert", disabled: true },
        ],
    },
    parameters: {
        docs: {
            description: {
                component:
                    "다중 선택 토글과 배타 선택. 비활성 항목은 선택할 수 없습니다.",
            },
        },
    },
    render: function Render(args) {
        const [value, setValue] = useState(args.value);
        return (
            <>
                <FilterChips
                    {...args}
                    value={value}
                    onValueChange={(next) => {
                        setValue(next);
                        args.onValueChange(next);
                    }}
                />
            </>
        );
    },
} satisfies Meta<typeof FilterChips>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const hard = canvas.getByRole("button", { name: "Hard" });
        await userEvent.click(hard);
        await expect(hard).toHaveAttribute("aria-pressed", "true");
        await userEvent.click(hard);
        await expect(hard).toHaveAttribute("aria-pressed", "false");
        await expect(
            canvas.getByRole("button", { name: "Expert" })
        ).toBeDisabled();
    },
};
export const Single: Story = { args: { multiple: false } };
export const Row: Story = { args: { row: true } };
