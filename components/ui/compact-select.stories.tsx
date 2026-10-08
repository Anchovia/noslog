import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import CompactSelect from "./compact-select";
const meta = {
    title: "UI/CompactSelect",
    component: CompactSelect,
    args: {
        label: "난이도",
        value: "normal",
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
                    "결과 줄의 짧은 선택. 전체 라벨과 축약 표시를 구분하고 outlined·컴팩트·비활성 상태를 비교합니다.",
            },
        },
    },
    render: function Render(args) {
        const [value, setValue] = useState(args.value);
        return (
            <>
                <CompactSelect
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
} satisfies Meta<typeof CompactSelect>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const trigger = within(canvasElement).getByRole("combobox", {
            name: "난이도",
        });
        trigger.focus();
        await userEvent.keyboard("{ArrowDown}{End}{Enter}");
        await expect(trigger).toHaveTextContent("Hard");
        await expect(trigger).toHaveFocus();
    },
};
export const Outlined: Story = { args: { outlined: true } };
export const Compact: Story = { args: { size: "sm" } };
export const Disabled: Story = { args: { disabled: true } };
