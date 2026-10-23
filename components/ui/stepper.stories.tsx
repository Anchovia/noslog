import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import Stepper from "./stepper";

const meta = {
    title: "UI/Stepper",
    component: Stepper,
    args: {
        value: 2,
        unit: "대",
        min: 0,
        max: 50,
        decrementLabel: "대수 줄이기",
        incrementLabel: "대수 늘리기",
        onValueChange: fn(),
    },
    parameters: {
        docs: {
            description: {
                component:
                    "작은 정수(대수)를 − · + 로 바꾸는 줄. 높이 = 컨트롤 높이, 경계 = 입력칸 선.",
            },
        },
    },
    render: function Render(args) {
        const [value, setValue] = useState(args.value);
        return (
            <Stepper
                {...args}
                value={value}
                onValueChange={(next) => {
                    setValue(next);
                    args.onValueChange(next);
                }}
            />
        );
    },
} satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        await userEvent.click(
            canvas.getByRole("button", { name: "대수 늘리기" })
        );
        await expect(args.onValueChange).toHaveBeenLastCalledWith(3);
        await expect(canvas.getByText("3대")).toBeVisible();
    },
};
export const AtMinimum: Story = {
    args: { value: 0 },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(
            canvas.getByRole("button", { name: "대수 줄이기" })
        ).toBeDisabled();
    },
};
export const Disabled: Story = { args: { disabled: true } };
