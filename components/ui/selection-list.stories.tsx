import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import SelectionList from "./selection-list";
const meta = {
    title: "UI/SelectionList",
    component: SelectionList,
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
                    "네이티브 radio·checkbox 기반 선택 목록. label을 숨겨도 접근성 이름은 남깁니다.",
            },
        },
    },
    render: function Render(args) {
        const [value, setValue] = useState(args.value);
        return (
            <>
                <SelectionList
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
} satisfies Meta<typeof SelectionList>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.click(canvas.getByRole("radio", { name: "Hard" }));
        await expect(canvas.getByRole("radio", { name: "Hard" })).toBeChecked();
        await expect(
            canvas.getByRole("radio", { name: "Normal" })
        ).not.toBeChecked();
        await expect(
            canvas.getByRole("radio", { name: "Expert" })
        ).toBeDisabled();
    },
};
export const Multiple: Story = { args: { multiple: true } };
export const HiddenLegend: Story = { args: { hideLabel: true } };
