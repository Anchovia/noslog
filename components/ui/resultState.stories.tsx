import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, within } from "storybook/test";

import Button from "./Button";
import ResultState from "./resultState";
const meta = {
    title: "UI/ResultState",
    component: ResultState,
    args: { message: "검색 결과가 없습니다." },
    parameters: {
        docs: {
            description: {
                component:
                    "빈 상태는 status, 오류는 alert로 전달합니다. 재시도 같은 동작을 action 슬롯에 넣습니다.",
            },
        },
    },
} satisfies Meta<typeof ResultState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        await expect(
            within(canvasElement).getByRole("status")
        ).toHaveTextContent("검색 결과가 없습니다.");
    },
};
export const Error: Story = {
    args: {
        error: true,
        message: "불러오지 못했습니다.",
        action: <Button onClick={fn()}>다시 시도</Button>,
    },
};
