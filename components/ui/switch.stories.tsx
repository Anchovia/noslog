import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { Switch } from "./switch";

const meta = {
    title: "UI/Switch",
    component: Switch,
    args: { checked: false, "aria-label": "공개 설정", onCheckedChange: fn() },
    render: function Render(args) {
        const [checked, setChecked] = useState(args.checked);
        return (
            <Switch
                {...args}
                checked={checked}
                onCheckedChange={(next) => {
                    setChecked(next);
                    args.onCheckedChange(next);
                }}
            />
        );
    },
    parameters: {
        docs: {
            description: {
                component:
                    "즉시 적용하는 설정용입니다. 저장 버튼이 있는 폼에서는 Checkbox를 사용하고, aria-label 또는 label 요소를 연결합니다.",
            },
        },
    },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const control = within(canvasElement).getByRole("switch", {
            name: "공개 설정",
        });
        control.focus();
        await userEvent.keyboard(" ");
        await expect(control).toHaveAttribute("aria-checked", "true");
    },
};
export const Checked: Story = { args: { checked: true } };
export const Disabled: Story = { args: { disabled: true } };
