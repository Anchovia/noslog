import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import StackedBar from "./stacked-bar";
const meta = {
    title: "UI/StackedBar",
    component: StackedBar,
    args: {
        rows: [
            {
                key: "personal",
                label: "내 기록",
                value: "80 / 20",
                segments: [
                    {
                        key: "just",
                        value: 80,
                        color: "var(--nl-local-data-categorical-1)",
                    },
                    {
                        key: "good",
                        value: 20,
                        color: "var(--nl-local-data-categorical-2)",
                    },
                ],
            },
        ],
    },
    parameters: {
        docs: {
            description: {
                component:
                    "장식 누적 막대는 aria-hidden입니다. 호출부에서 정확한 값을 별도 텍스트나 표로 전달합니다.",
            },
        },
    },
    render: (args) => (
        <>
            <p className="nl-body">정확한 수치: JUST 80, GOOD 20</p>
            <StackedBar {...args} />
        </>
    ),
} satisfies Meta<typeof StackedBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Zero: Story = {
    args: { rows: [{ key: "empty", label: "기록 없음", segments: [] }] },
};
