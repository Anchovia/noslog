import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import LineChart from "./line-chart";
const meta = {
    title: "UI/LineChart",
    component: LineChart,
    args: {
        label: "점수 추이",
        dimensionLabel: "날짜",
        valueLabel: "점수",
        points: [
            {
                id: "one",
                dimension: "10월 1일",
                shortDimension: "10/1",
                value: 70,
            },
            {
                id: "two",
                dimension: "10월 2일",
                shortDimension: "10/2",
                value: 90,
            },
        ],
        formatValue: (value: number) => String(value),
        formatAxis: (value: number) => String(value),
        domain: [0, 100],
        emptyMessage: "기록이 없습니다.",
    },
    parameters: {
        docs: {
            description: {
                component:
                    "빈 상태·한 점·두 계열과 정확한 값 표. 그래프 점의 키보드 탐색을 확인합니다.",
            },
        },
    },
} satisfies Meta<typeof LineChart>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByRole("table")).toBeVisible();
        const first = canvas.getByRole("button", {
            name: "10월 1일 · 점수 · 70",
        });
        first.focus();
        await userEvent.keyboard("{ArrowRight}");
        await expect(
            canvas.getByRole("button", { name: "10월 2일 · 점수 · 90" })
        ).toHaveFocus();
    },
};
export const Empty: Story = { args: { points: [] } };
export const Single: Story = {
    args: {
        points: [
            {
                id: "one",
                dimension: "10월 1일",
                shortDimension: "10/1",
                value: 70,
            },
        ],
    },
};
export const Comparison: Story = {
    args: {
        secondaryLabel: "평균",
        points: [
            {
                id: "one",
                dimension: "10월 1일",
                shortDimension: "10/1",
                value: 70,
                secondaryValue: 60,
            },
            {
                id: "two",
                dimension: "10월 2일",
                shortDimension: "10/2",
                value: 90,
                secondaryValue: 80,
            },
        ],
    },
};
