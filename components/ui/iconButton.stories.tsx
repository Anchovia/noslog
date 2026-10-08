import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Search } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";

import IconButton from "./iconButton";

const meta = {
    title: "UI/IconButton",
    component: IconButton,
    args: {
        label: "악곡 검색",
        children: <Search className="nl-icon" aria-hidden />,
        onClick: fn(),
    },
    parameters: {
        docs: {
            description: {
                component:
                    "label은 필수 접근성 이름입니다. 내부 아이콘은 aria-hidden으로 장식 처리하고, 줄의 높이에 따라 compact를 선택합니다.",
            },
        },
    },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ args, canvasElement }) => {
        const button = within(canvasElement).getByRole("button", {
            name: "악곡 검색",
        });
        await userEvent.click(button);
        await expect(args.onClick).toHaveBeenCalledTimes(1);
    },
};
export const Compact: Story = { args: { size: "compact" } };
export const Disabled: Story = { args: { disabled: true } };
