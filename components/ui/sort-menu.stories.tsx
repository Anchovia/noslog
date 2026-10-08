import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, screen, userEvent, within } from "storybook/test";

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
