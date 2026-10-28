import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, screen, userEvent, within } from "storybook/test";

import { contractStory } from "@/.storybook/responsive-contract";

import SortMenu from "./sort-menu";
import { SortMenuSection } from "./sort-menu";
const meta = {
    title: "UI/SortMenu",
    component: SortMenu,
    args: {
        label: "정렬",
        value: "recent",
        onValueChange: fn(),
        options: [
            { value: "recent", label: "최근 순" },
            { value: "disabled", label: "사용 불가", disabled: true },
            { value: "name", label: "이름 순" },
        ],
    },
    parameters: {
        docs: {
            description: {
                component:
                    "정렬의 배타 선택과 종속 옵션. 비활성 항목을 건너뛰며 선택 뒤 일반 메뉴는 닫습니다.",
            },
        },
    },
    render: function Render(args) {
        const [value, setValue] = useState(args.value);
        return (
            <>
                <SortMenu
                    {...args}
                    value={value}
                    onValueChange={(next) => {
                        setValue(next);
                        args.onValueChange(next);
                    }}
                />
            </>
        );
    },
} satisfies Meta<typeof SortMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const opener = within(canvasElement).getByRole("button", {
            name: "정렬: 최근 순",
        });
        await userEvent.click(opener);
        const recent = await screen.findByRole("menuitemradio", {
            name: "최근 순",
        });
        recent.focus();
        await userEvent.keyboard("{ArrowDown}{Enter}");
        await expect(opener).toHaveAccessibleName("정렬: 이름 순");
        await expect(opener).toHaveFocus();
    },
};
// 메뉴 행 = 컨트롤 높이 · 글자 14, 판 둘레는 고대비에서도 남는 실제 border(안쪽을 그만큼 줄여 판 크기 그대로)
const menuRowsMatchControls: Story["play"] = async ({ canvasElement }) => {
    await userEvent.click(
        within(canvasElement).getByRole("button", { name: "정렬: 최근 순" })
    );
    const items = await screen.findAllByRole("menuitemradio");
    const height = window.matchMedia("(min-width: 1056px)").matches
        ? "32px"
        : "40px";
    for (const item of items) {
        const style = getComputedStyle(item);
        await expect(style.height).toBe(height);
        await expect(style.fontSize).toBe("14px");
    }
    const panel = getComputedStyle(items[0].closest(".nl-sort-menu")!);
    await expect(panel.borderTopStyle).toBe("solid");
    await expect(
        parseFloat(panel.paddingTop) + parseFloat(panel.borderTopWidth)
    ).toBe(8);
    await userEvent.keyboard("{Escape}");
};
export const MenuRows: Story = { play: menuRowsMatchControls };
export const MenuRowsWide: Story = {
    ...contractStory(1056),
    play: menuRowsMatchControls,
};
export const Compact: Story = { args: { size: "sm" } };
export const Dependent: Story = {
    args: {
        children: (
            <SortMenuSection label="난이도">
                <p className="nl-body">선택한 난이도: Normal</p>
            </SortMenuSection>
        ),
    },
};
