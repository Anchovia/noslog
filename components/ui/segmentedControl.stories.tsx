import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { SegmentedControl } from "./segmentedControl";

const meta = {
    title: "UI/SegmentedControl",
    component: SegmentedControl,
    args: {
        onValueChange: fn(),
        label: "표시 방식",
        value: "all",
        options: [
            { value: "all", label: "전체" },
            { value: "unavailable", label: "미지원", disabled: true },
            { value: "played", label: "플레이한 악곡" },
        ],
    },
    render: function Render(args) {
        const [value, setValue] = useState(args.value);
        return (
            <SegmentedControl
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
                    "배타 선택을 위한 radiogroup입니다. 방향키·Home·End로 선택과 포커스가 함께 이동하며 비활성 항목은 건너뜁니다.",
            },
        },
    },
} satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: { size: "sm" } };
export const KeyboardNavigation: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const all = canvas.getByRole("radio", { name: "전체" });
        const played = canvas.getByRole("radio", { name: "플레이한 악곡" });
        all.focus();
        await userEvent.keyboard("{ArrowRight}");
        await expect(played).toHaveFocus();
        await expect(played).toHaveAttribute("aria-checked", "true");
        await expect(all).toHaveAttribute("tabindex", "-1");
        await userEvent.keyboard("{Home}");
        await expect(all).toHaveFocus();
        await userEvent.keyboard("{End}{ArrowRight}");
        await expect(all).toHaveFocus();
    },
};
