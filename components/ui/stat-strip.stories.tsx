import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import StatStrip, { StatStripSkeleton } from "./stat-strip";
const meta = {
    title: "UI/StatStrip",
    component: StatStrip,
    args: {
        label: "기록 요약",
        items: [
            { key: "score", label: "점수", value: "980,000" },
            { key: "rank", label: "랭킹", value: 12 },
            { key: "hidden", label: "숨긴 값", value: null },
        ],
    },
    parameters: {
        docs: {
            description: {
                component:
                    "null 값을 제외하는 수치 목록. pending은 이전 값을 유지하며, 로딩은 기존 스켈레톤을 사용합니다.",
            },
        },
    },
} satisfies Meta<typeof StatStrip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        await expect(
            within(canvasElement).queryByText("숨긴 값")
        ).not.toBeInTheDocument();
        await expect(within(canvasElement).getByText("980,000")).toBeVisible();
    },
};
export const Pending: Story = { args: { pending: true } };
export const WithSlots: Story = {
    args: {
        header: <p className="nl-body">내 최고 기록</p>,
        footer: (
            <a className="nl-control" href="#records">
                기록 보기
            </a>
        ),
    },
};
export const Loading: Story = {
    render: () => <StatStripSkeleton labels={["점수", "랭킹"]} />,
};
export const Empty: Story = { args: { items: [] } };
