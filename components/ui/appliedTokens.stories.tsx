import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import AppliedTokens from "./appliedTokens";
const meta = {
    title: "UI/AppliedTokens",
    component: AppliedTokens,
    args: {
        label: "적용 조건",
        clearLabel: "전체 지우기",
        onClear: fn(),
        tokens: [
            {
                key: "normal",
                label: "Normal",
                removeLabel: "Normal 조건 해제",
                onRemove: fn(),
            },
        ],
    },
    parameters: {
        docs: {
            description: {
                component:
                    "적용된 조건의 개별 해제·전체 해제. 상태 변경은 호출부가 책임집니다.",
            },
        },
    },
} satisfies Meta<typeof AppliedTokens>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        await userEvent.click(
            canvas.getByRole("button", { name: "Normal 조건 해제" })
        );
        await expect(args.tokens[0].onRemove).toHaveBeenCalledOnce();
        await userEvent.click(
            canvas.getByRole("button", { name: "전체 지우기" })
        );
        await expect(args.onClear).toHaveBeenCalledOnce();
    },
};
export const Empty: Story = { args: { tokens: [] } };
