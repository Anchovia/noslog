import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";

import ActionMenu from "./action-menu";
const meta = {
    title: "UI/ActionMenu",
    component: ActionMenu,
    args: {
        label: "기록 작업",
        items: [
            { label: "편집", onSelect: fn() },
            { label: "삭제", onSelect: fn(), destructive: true },
        ],
    },
    parameters: {
        docs: {
            description: {
                component:
                    "동작 메뉴. End·Enter로 항목을 선택하고 트리거로 포커스가 돌아오는지 확인합니다.",
            },
        },
    },
} satisfies Meta<typeof ActionMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement, args }) => {
        const opener = within(canvasElement).getByRole("button", {
            name: "기록 작업",
        });
        await userEvent.click(opener);
        const menu = await screen.findByRole("menu", { name: "기록 작업" });
        within(menu).getByRole("menuitem", { name: "편집" }).focus();
        await userEvent.keyboard("{End}{Enter}");
        await expect(args.items[1].onSelect).toHaveBeenCalledOnce();
        await waitFor(() =>
            expect(screen.queryByRole("menu")).not.toBeInTheDocument()
        );
        await expect(opener).toHaveFocus();
    },
};
// 행 = 컨트롤 높이 · 글자 14
export const ItemRows: Story = {
    play: async ({ canvasElement }) => {
        await userEvent.click(
            within(canvasElement).getByRole("button", { name: "기록 작업" })
        );
        const menu = await screen.findByRole("menu", { name: "기록 작업" });
        const height = window.matchMedia("(min-width: 1056px)").matches
            ? "32px"
            : "40px";
        for (const item of within(menu).getAllByRole("menuitem")) {
            const style = getComputedStyle(item);
            await expect(style.height).toBe(height);
            await expect(style.fontSize).toBe("14px");
        }
        await userEvent.keyboard("{Escape}");
    },
};
export const Disabled: Story = { args: { disabled: true } };
