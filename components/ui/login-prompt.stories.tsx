import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import LoginPrompt from "./login-prompt";
const meta = {
    title: "UI/LoginPrompt",
    component: LoginPrompt,
    args: {
        title: "로그인이 필요합니다.",
        description: "로그인한 뒤 기록을 작성할 수 있습니다.",
    },
    parameters: {
        docs: {
            description: {
                component:
                    "로그아웃 상태의 폼 안내 본문. 실제 로그인 동작은 스토리에 연결하지 않습니다.",
            },
        },
    },
} satisfies Meta<typeof LoginPrompt>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
