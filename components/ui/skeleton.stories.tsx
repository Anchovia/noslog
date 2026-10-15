import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LoadingStatus, SkeletonText } from "./skeleton";
const meta = {
    title: "UI/SkeletonText",
    component: SkeletonText,
    args: { className: "nl-body", sample: "NosLog" },
    parameters: {
        docs: {
            description: {
                component:
                    "기존 스켈레톤 크기를 확인합니다. 로딩 안내는 LoadingStatus로 한 번만 전달합니다.",
            },
        },
    },
} satisfies Meta<typeof SkeletonText>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Widths: Story = {
    render: () => (
        <div className="nl-stack">
            <SkeletonText className="nl-body" width="s" />
            <SkeletonText className="nl-body" width="m" />
            <SkeletonText className="nl-body" width="l" />
        </div>
    ),
};
export const AnnouncedLoading: Story = {
    render: () => (
        <div aria-busy>
            <LoadingStatus label="기록을 불러오는 중" />
            <SkeletonText className="nl-body" sample="980,000" />
        </div>
    ),
};
