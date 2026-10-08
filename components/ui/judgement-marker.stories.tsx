import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import JudgementMarker from "./judgement-marker";
const meta = {
    title: "UI/JudgementMarker",
    component: JudgementMarker,
    args: { judgement: "sjust" },
    parameters: {
        docs: {
            description: {
                component: "판정의 기존 이름과 표식을 함께 표시합니다.",
            },
        },
    },
} satisfies Meta<typeof JudgementMarker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const All: Story = {
    render: () => (
        <div className="nl-stack">
            {(["sjust", "just", "good", "near", "miss"] as const).map(
                (judgement) => (
                    <JudgementMarker key={judgement} judgement={judgement} />
                )
            )}
        </div>
    ),
};
