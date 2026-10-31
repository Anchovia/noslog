import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, screen, userEvent, within } from "storybook/test";

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
export const EscapeReopens: Story = {
    play: async ({ canvasElement }) => {
        const trigger = within(canvasElement).getByRole("combobox", {
            name: "난이도",
        });
        trigger.focus();
        await userEvent.keyboard("{ArrowDown}");
        await screen.findByRole("listbox");
        await userEvent.keyboard("{Escape}");
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
        // 다시 열기 막음(200ms)은 누름 닫기에만 — Escape 뒤 곧바로 키보드로 다시 연다
        await userEvent.keyboard("{ArrowDown}");
        await screen.findByRole("listbox");
        await expect(trigger).toHaveAttribute("aria-expanded", "true");
        await userEvent.keyboard("{Escape}");
    },
};
export const PressTriggerCloses: Story = {
    play: async ({ canvasElement }) => {
        const trigger = within(canvasElement).getByRole("combobox", {
            name: "난이도",
        });
        await userEvent.click(trigger);
        await screen.findByRole("listbox");
        // 열린 동안 Radix 가 본문 포인터를 막아 두므로 검사를 끄고 누른다
        await userEvent.click(trigger, { pointerEventsCheck: 0 });
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
        // 닫힌 뒤 같은 누름이 다시 열지 않는다
        await new Promise((resolve) => setTimeout(resolve, 300));
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
        await expect(screen.queryByRole("listbox")).toBeNull();
    },
};
export const Outlined: Story = { args: { outlined: true } };
export const Compact: Story = { args: { size: "sm" } };
export const Disabled: Story = { args: { disabled: true } };
