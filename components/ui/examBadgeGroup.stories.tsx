import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ExamBadge from "./examBadge";
import ExamBadgeGroup from "./examBadgeGroup";
const meta = {
    title: "UI/ExamBadgeGroup",
    component: ExamBadgeGroup,
    args: {
        className: "flex gap-nl-8",
        children: (
            <>
                <ExamBadge mode="basic" exam={1} />
                <ExamBadge mode="recital" exam={5} />
            </>
        ),
    },
    parameters: {
        docs: {
            description: {
                component:
                    "주어진 폭을 실측해 모드 이름을 전체 또는 이니셜로 표시하는 묶음입니다.",
            },
        },
    },
} satisfies Meta<typeof ExamBadgeGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = {
    decorators: [
        (Story) => (
            <div className="w-full">
                <Story />
            </div>
        ),
    ],
};
