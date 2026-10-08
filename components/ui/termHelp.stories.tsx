import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import TermHelp from "./termHelp";
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
    },
};
export const Plain: Story = { args: { plain: true } };
export const NoIcon: Story = { args: { icon: false } };
