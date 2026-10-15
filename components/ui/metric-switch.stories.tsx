import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import MetricSwitch from "./metric-switch";
const meta = {
    title: "UI/MetricSwitch",
    component: MetricSwitch,
    args: {
        label: "랭킹 모드",
        value: "basic",
        onValueChange: fn(),
        options: [
            { value: "basic", label: "Basic 모드", shortLabel: "Basic" },
            { value: "recital", label: "Recital 모드", shortLabel: "Recital" },
        ],
    },
    parameters: {
        docs: {
            description: {
                component:
                    "지표를 바꾸는 버튼 묶음. 방향키는 포커스만 옮기고 Enter·Space로 적용합니다.",
            },
        },
    },
    render: function Render(args) {
        const [value, setValue] = useState(args.value);
        return (
            <>
                <MetricSwitch
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
} satisfies Meta<typeof MetricSwitch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        canvas.getByRole("button", { name: "Basic 모드" }).focus();
        await userEvent.keyboard("{ArrowRight}");
        const recital = canvas.getByRole("button", { name: "Recital 모드" });
        await expect(recital).toHaveFocus();
        await expect(recital).toHaveAttribute("aria-pressed", "false");
        await userEvent.keyboard("{Enter}");
        await expect(recital).toHaveAttribute("aria-pressed", "true");
    },
};
