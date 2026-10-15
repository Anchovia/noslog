import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ExamBadge from "./exam-badge";
const meta = {
    title: "UI/ExamBadge",
    component: ExamBadge,
    args: { mode: "basic", exam: 1 },
    parameters: {
        docs: {
            description: {
                component:
                    "유효한 검정 급수만 표시합니다. 숨김·Basic·Recital과 기존 급수별 표현을 비교합니다.",
            },
        },
    },
} satisfies Meta<typeof ExamBadge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Recital: Story = { args: { mode: "recital", exam: 10 } };
export const Hidden: Story = { args: { exam: null } };
export const Grades: Story = {
    render: () => (
        <div className="nl-stack">
            {([1, 2, 4, 7, 10] as const).map((exam) => (
                <ExamBadge key={exam} mode="basic" exam={exam} />
            ))}
        </div>
    ),
};
