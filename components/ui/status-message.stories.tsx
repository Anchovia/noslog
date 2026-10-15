import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Button from "./button";
import { StatusMessage } from "./status-message";
const meta = {
    title: "UI/StatusMessage",
    component: StatusMessage,
    args: { title: "변경이 적용됐습니다." },
    parameters: {
        docs: {
            description: {
                component:
                    "inline·quiet·boxed의 기존 표현 비교. 실시간 안내의 role은 호출부에서 지정합니다.",
            },
        },
    },
} satisfies Meta<typeof StatusMessage>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Danger: Story = {
    args: {
        severity: "danger",
        title: "변경을 적용하지 못했습니다.",
        role: "alert",
    },
};
export const Quiet: Story = {
    args: {
        tone: "quiet",
        title: "불러오지 못했습니다.",
        action: (
            <Button variant="ghost" size="sm">
                다시 시도
            </Button>
        ),
    },
};
export const Boxed: Story = {
    args: {
        tone: "boxed",
        severity: "warning",
        title: "되돌릴 수 없는 변경",
        description: "확인한 뒤 진행하세요.",
    },
};
