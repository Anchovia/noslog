import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import RangeSlider from "./range-slider";
const meta = {
    title: "UI/RangeSlider",
    component: RangeSlider,
    args: {
        label: "레벨 범위",
        minimumLabel: "최소 레벨",
        maximumLabel: "최대 레벨",
        max: 20,
        value: [5, 15],
        onValueChange: fn(),
        onValueCommit: fn(),
    },
    parameters: {
        docs: {
            description: {
                component:
                    "두 손잡이의 범위 선택. 각 손잡이 이름과 변경·확정 콜백을 분리합니다.",
            },
        },
    },
    render: function Render(args) {
        const [value, setValue] = useState(args.value);
        return (
            <>
                <RangeSlider
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
} satisfies Meta<typeof RangeSlider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement, args }) => {
        const minimum = within(canvasElement).getByRole("slider", {
            name: "최소 레벨",
        });
        minimum.focus();
        await userEvent.keyboard("{ArrowRight}");
        await expect(minimum).toHaveAttribute("aria-valuenow", "6");
        await expect(args.onValueCommit).toHaveBeenCalled();
    },
};
export const FullRange: Story = { args: { value: [1, 20] } };
