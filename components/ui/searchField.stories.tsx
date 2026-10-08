import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import SearchField from "./searchField";
const meta = {
    title: "UI/SearchField",
    component: SearchField,
    args: {
        "aria-label": "악곡 검색",
        value: "",
        clearLabel: "검색어 지우기",
        onClear: fn(),
        onChange: fn(),
    },
    parameters: {
        docs: {
            description: {
                component:
                    "검색 입력과 지우기·대기 표시. 검색이나 서버 요청은 스토리에 연결하지 않습니다.",
            },
        },
    },
    render: function Render(args) {
        const [value, setValue] = useState(args.value);
        return (
            <SearchField
                {...args}
                value={value}
                onChange={(event) => {
                    setValue(event.target.value);
                    args.onChange?.(event);
                }}
                onClear={() => {
                    setValue("");
                    args.onClear();
                }}
            />
        );
    },
} satisfies Meta<typeof SearchField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole("searchbox", { name: "악곡 검색" });
        await userEvent.type(input, "NosLog");
        await userEvent.click(
            canvas.getByRole("button", { name: "검색어 지우기" })
        );
        await expect(input).toHaveValue("");
        await expect(args.onClear).toHaveBeenCalledOnce();
    },
};
export const Filled: Story = { args: { value: "NOSTALGIA" } };
export const Busy: Story = {
    args: { value: "NOSTALGIA", busy: true, busyLabel: "검색 중" },
};
export const Disabled: Story = { args: { disabled: true } };
