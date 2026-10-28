import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import TermHelp from "./term-help";
const meta = {
    title: "UI/TermHelp",
    component: TermHelp,
    args: {
        children: "Pianist",
        title: "Pianist",
        description: "악곡의 기존 성취 설명",
        ariaLabel: "Pianist 도움말",
    },
    parameters: {
        docs: {
            description: {
                component:
                    "용어 도움말. 포커스 열기와 Escape 닫기를 확인합니다. 한 번에 하나만 열리는 기존 규칙을 유지합니다.",
            },
        },
    },
} satisfies Meta<typeof TermHelp>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const trigger = within(canvasElement).getByRole("button", {
            name: "Pianist 도움말",
        });
        trigger.focus();
        await expect(
            await screen.findByText("악곡의 기존 성취 설명")
        ).toBeVisible();
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
            expect(
                screen.queryByText("악곡의 기존 성취 설명")
            ).not.toBeInTheDocument()
        );
        // 다시 열기 막음(200ms)은 누름 닫기에만 — Escape 뒤 곧바로 Enter 로 다시 연다
        await userEvent.keyboard("{Enter}");
        await expect(
            await screen.findByText("악곡의 기존 성취 설명")
        ).toBeVisible();
        // 창 제목 = 부품 제목 16/24 · 600
        const title = screen.getByText("Pianist", { selector: "strong" });
        await expect(title).toHaveClass("nl-component-title");
        const style = getComputedStyle(title);
        await expect([
            style.fontSize,
            style.lineHeight,
            style.fontWeight,
        ]).toEqual(["16px", "24px", "600"]);
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
            expect(
                screen.queryByText("악곡의 기존 성취 설명")
            ).not.toBeInTheDocument()
        );
    },
};
export const Plain: Story = { args: { plain: true } };
export const NoIcon: Story = { args: { icon: false } };
