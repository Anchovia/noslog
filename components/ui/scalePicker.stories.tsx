import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import ScalePicker from "./scalePicker";
const meta = {
    title: "UI/ScalePicker",
    component: ScalePicker,
    args: { labelId: "scale-label", value: null, onChange: fn() },
    parameters: {
        docs: {
            description: {
                component:
                    "짧은 숫자 척도. 같은 값은 다시 눌러 해제하고 방향키·Home·End로 고릅니다.",
            },
        },
    },
    render: function Render(args) {
        const [value, setValue] = useState(args.value);
        return (
            <>
                <p id="scale-label" className="nl-field__label">
                    난이도 체감
                </p>
                <ScalePicker
                    {...args}
                    value={value}
                    onChange={(next) => {
                        setValue(next);
                        args.onChange(next);
                    }}
                />
            </>
        );
    },
} satisfies Meta<typeof ScalePicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const two = canvas.getByRole("radio", { name: "2" });
        await userEvent.click(two);
        await expect(two).toHaveAttribute("aria-checked", "true");
        await userEvent.click(two);
        await expect(two).toHaveAttribute("aria-checked", "false");
        canvas.getByRole("radio", { name: "0" }).focus();
        await userEvent.keyboard("{End}");
        await expect(canvas.getByRole("radio", { name: "4" })).toHaveAttribute(
            "aria-checked",
            "true"
        );
    },
};
export const Selected: Story = { args: { value: 2 } };
export const Disabled: Story = { args: { disabled: true } };
