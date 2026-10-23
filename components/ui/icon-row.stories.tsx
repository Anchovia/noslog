import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AtSign, ChevronDown, Clock, Copy, MapPin } from "lucide-react";
import { expect, within } from "storybook/test";

import Button from "./button";
import IconRow, { IconRows } from "./icon-row";

const meta = {
    title: "UI/IconRow",
    component: IconRow,
    args: { icon: MapPin, children: "서울 은평구 연서로29길 8-8 1층" },
    parameters: {
        docs: {
            description: {
                component:
                    "장소 정보 줄 — 아이콘 · 본문(+ 보조 줄) · 끝 동작. IconRows 안에서 줄 사이 구분선.",
            },
        },
    },
    render: (args) => (
        <IconRows>
            <IconRow {...args} />
        </IconRows>
    ),
} satisfies Meta<typeof IconRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Address: Story = {
    args: {
        detail: "불광역 3호선 · 6호선",
        action: (
            <Button variant="ghost" size="sm">
                <Copy className="nl-icon-small" aria-hidden />
                복사
            </Button>
        ),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText("불광역 3호선 · 6호선")).toBeVisible();
        await expect(
            canvas.getByRole("button", { name: "복사" })
        ).toBeVisible();
    },
};

export const List: Story = {
    render: () => (
        <IconRows>
            <IconRow icon={MapPin} detail="불광역 3호선 · 6호선">
                서울 은평구 연서로29길 8-8 1층
            </IconRow>
            <IconRow
                icon={Clock}
                action={
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="요일별 보기"
                        aria-expanded={false}
                    >
                        <ChevronDown className="nl-icon" aria-hidden />
                    </Button>
                }
            >
                오늘 10:00–24:00
            </IconRow>
            <IconRow icon={AtSign}>@zzanggu_game</IconRow>
        </IconRows>
    ),
};
