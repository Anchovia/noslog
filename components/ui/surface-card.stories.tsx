import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import SurfaceCard from "./surface-card";

const meta = {
    title: "UI/SurfaceCard",
    component: SurfaceCard,
    args: {
        children: (
            <>
                <p className="nl-emphasis-label">일반 공지</p>
                <p className="nl-body-secondary nl-muted">
                    영업시간 안내 — 주말에는 05시까지 영업합니다.
                </p>
            </>
        ),
    },
    parameters: {
        docs: {
            description: {
                component:
                    "면 카드 — 1px 테두리 · 모서리 6 · 안쪽 16 · 안 사이 8.",
            },
        },
    },
} satisfies Meta<typeof SurfaceCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        await expect(
            within(canvasElement).getByText("일반 공지")
        ).toBeInTheDocument();
    },
};
