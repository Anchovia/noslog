import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import BarList, { BarListSkeleton } from "./barList";
const meta = {
    title: "UI/BarList",
    component: BarList,
    args: {
        label: "레벨별 기록",
        max: 100,
        rows: [
            { key: "normal", label: "Normal", value: 75 },
            { key: "hard", label: "Hard", value: 40 },
            { key: "expert", label: "Expert", value: null },
        ],
    },
    parameters: {
        docs: {
            description: {
                component:
                    "정확한 라벨과 수치는 접근성 트리에 남기고 장식 막대만 숨깁니다. null은 미확인 값을 뜻합니다.",
            },
        },
    },
} satisfies Meta<typeof BarList>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Loading: Story = {
    render: () => <BarListSkeleton labels={["Normal", "Hard", "Expert"]} />,
};
export const Empty: Story = { args: { rows: [] } };
