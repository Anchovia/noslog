import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";

import Button from "./button";
import ResponsiveDialog from "./responsive-dialog";
const meta = {
    title: "UI/ResponsiveDialog",
    component: ResponsiveDialog,
    args: {
        open: false,
        onOpenChange: fn(),
        title: "필터 조건",
        children: <p className="nl-body">예제 조건</p>,
        footer: null,
    },
    parameters: {
        docs: {
            description: {
                component:
                    "기존 레이어 그릇과 트리거·본문·발 슬롯. Escape·포커스 복귀를 검증하며 상태는 로컬에서만 바꿉니다.",
            },
        },
    },
    render: function Render(args) {
        const [open, setOpen] = useState(args.open);
        return (
            <ResponsiveDialog
                {...args}
                open={open}
                onOpenChange={(next) => {
                    setOpen(next);
                    args.onOpenChange(next);
                }}
                trigger={<Button>조건 열기</Button>}
                footer={<Button onClick={() => setOpen(false)}>적용</Button>}
            />
        );
    },
} satisfies Meta<typeof ResponsiveDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const trigger = within(canvasElement).getByRole("button", {
            name: "조건 열기",
        });
        await userEvent.click(trigger);
        await waitFor(() =>
            expect(screen.getByText("예제 조건")).toBeVisible()
        );
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
            expect(screen.queryByText("예제 조건")).not.toBeInTheDocument()
        );
        await waitFor(() => expect(trigger).toHaveFocus());
    },
};
export const InitiallyOpen: Story = { args: { open: true } };
