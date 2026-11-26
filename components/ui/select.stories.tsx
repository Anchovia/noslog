import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";

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
        // 메뉴가 닫히는 움직임이 끝나면 포커스가 돌아온다
        await waitFor(() => expect(trigger).toHaveFocus());
    },
};
// 목록 행 = 높이 40 · 글자 14(본문 16 이 붙지 않는다)
export const OptionRows: Story = {
    play: async ({ canvasElement }) => {
        within(canvasElement).getByRole("combobox", { name: "난이도" }).focus();
        await userEvent.keyboard("{ArrowDown}");
        const list = await screen.findByRole("listbox");
        const height = "40px";
        for (const option of within(list).getAllByRole("option")) {
            const style = getComputedStyle(option);
            await expect(style.height).toBe(height);
            await expect(style.fontSize).toBe("14px");
        }
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
        );
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
        // 메뉴가 닫히는 움직임이 끝나면 포커스가 돌아온다
        await waitFor(() => expect(trigger).toHaveFocus());
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
        // 다시 열기 막음(200ms)은 누름 닫기에만 — Escape 뒤 곧바로 키보드로 다시 연다
        await userEvent.keyboard("{ArrowDown}");
        await waitFor(() =>
            expect(trigger).toHaveAttribute("aria-expanded", "true")
        );
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
        );
    },
};
