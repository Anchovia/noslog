import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, screen, userEvent, within } from "storybook/test";

import { Select } from "./select";

const meta = {
    title: "UI/Select",
    component: Select,
    args: {
        onValueChange: fn(),
        "aria-label": "난이도",
        value: "normal",
        options: [
            { value: "", label: "전체" },
            { value: "normal", label: "Normal" },
            { value: "hard", label: "Hard" },
            { value: "expert", label: "Expert", disabled: true },
        ],
    },
    render: function Render(args) {
        const [value, setValue] = useState(args.value);
        return (
            <Select
                {...args}
                value={value}
                onValueChange={(next) => {
                    setValue(next);
                    args.onValueChange(next);
                }}
            />
        );
    },
    parameters: {
        docs: {
            description: {
                component:
                    "value/onValueChange로 제어합니다. 빈 문자열 선택지는 내부에서 변환되며, 라벨·설명·invalid 상태는 입력칸과 같은 접근성 속성으로 연결합니다.",
            },
        },
    },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { invalid: true } };
export const KeyboardSelection: Story = {
    play: async ({ canvasElement }) => {
        const trigger = within(canvasElement).getByRole("combobox", {
            name: "난이도",
        });
        trigger.focus();
        await userEvent.keyboard("{ArrowDown}");
        const list = await screen.findByRole("listbox");
        await expect(
            within(list).getByRole("option", { name: "Expert" })
        ).toHaveAttribute("aria-disabled", "true");
        await userEvent.keyboard("{End}{Enter}");
        await expect(trigger).toHaveTextContent("Hard");
        await expect(trigger).toHaveFocus();
    },
};
export const EmptyValue: Story = { args: { value: "" } };
export const EscapeRestoresFocus: Story = {
    play: async ({ canvasElement }) => {
        const trigger = within(canvasElement).getByRole("combobox", {
            name: "난이도",
        });
        trigger.focus();
        await userEvent.keyboard("{ArrowDown}");
        await screen.findByRole("listbox");
        await userEvent.keyboard("{Escape}");
        await expect(trigger).toHaveFocus();
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
    },
};
