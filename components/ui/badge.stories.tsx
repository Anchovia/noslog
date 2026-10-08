import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Badge from "./badge";
const meta = {
    title: "UI/Badge",
    component: Badge,
    args: { children: "표시 라벨" },
    parameters: {
        docs: {
            description: {
                component:
                    "기존 배지의 지원 variant 비교. 공개 화면에 새 배지 디자인을 추가하지 않습니다.",
            },
        },
    },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Variants: Story = {
    render: () => (
        <div className="nl-stack">
            {(
                [
                    "default",
                    "outline",
                    "success",
                    "danger",
                    "normal",
                    "hard",
                    "expert",
                    "real",
                    "basic",
                    "recital",
                ] as const
            ).map((variant) => (
                <Badge key={variant} variant={variant}>
                    {variant}
                </Badge>
            ))}
        </div>
    ),
};
