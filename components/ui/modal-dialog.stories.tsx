import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";

import Button from "./button";
import { FormField, Input } from "./form-field";
import ModalDialog from "./modal-dialog";

const meta = {
    title: "UI/ModalDialog",
    component: ModalDialog,
    args: {
        onOpenChange: fn(),
        open: false,
        title: "닉네임 변경",
        description: "테스트용 입력입니다. 서버에 저장하지 않습니다.",
    },
    render: function Render(args) {
        const [open, setOpen] = useState(args.open);
        return (
            <ModalDialog
                {...args}
                open={open}
                onOpenChange={(next) => {
                    setOpen(next);
                    args.onOpenChange(next);
                }}
                trigger={<Button>대화상자 열기</Button>}
                footer={<Button onClick={() => setOpen(false)}>완료</Button>}
            >
                <FormField id="dialog-nickname" label="닉네임">
                    <Input id="dialog-nickname" defaultValue="NosLog" />
                </FormField>
            </ModalDialog>
        );
    },
    parameters: {
        docs: {
            description: {
                component:
                    "title은 접근성 이름입니다. trigger를 연결하면 닫을 때 포커스가 돌아옵니다. 크기와 폰의 전체 화면 전환은 공용 CSS가 결정합니다. 본문만 스크롤하며, 확인 창은 variant=confirm을 사용합니다.",
            },
        },
    },
} satisfies Meta<typeof ModalDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const InitiallyOpen: Story = { args: { open: true } };
export const Confirm: Story = {
    args: {
        variant: "confirm",
        title: "변경을 취소할까요?",
        description: "입력한 내용을 버리고 닫습니다.",
    },
    render: function Render(args) {
        const [open, setOpen] = useState(args.open);
        return (
            <ModalDialog
                {...args}
                open={open}
                onOpenChange={(next) => {
                    setOpen(next);
                    args.onOpenChange(next);
                }}
                trigger={<Button variant="secondary">취소 확인</Button>}
                footer={<Button onClick={() => setOpen(false)}>확인</Button>}
            />
        );
    },
};
export const KeyboardAndFocus: Story = {
    globals: { locale: "ko" },
    play: async ({ canvasElement }) => {
        const opener = within(canvasElement).getByRole("button", {
            name: "대화상자 열기",
        });
        await userEvent.click(opener);
        const dialog = await screen.findByRole("dialog", {
            name: "닉네임 변경",
        });
        await expect(dialog).toHaveAccessibleDescription(
            "테스트용 입력입니다. 서버에 저장하지 않습니다."
        );
        await waitFor(() =>
            expect(dialog.contains(document.activeElement)).toBe(true)
        );
        for (let index = 0; index < 5; index++) {
            await userEvent.tab();
            await expect(dialog.contains(document.activeElement)).toBe(true);
        }
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
        );
        await waitFor(() => expect(opener).toHaveFocus());
    },
};
export const CloseButton: Story = {
    globals: { locale: "ko" },
    play: async ({ canvasElement }) => {
        const opener = within(canvasElement).getByRole("button", {
            name: "대화상자 열기",
        });
        await userEvent.click(opener);
        const dialog = await screen.findByRole("dialog", {
            name: "닉네임 변경",
        });
        await userEvent.click(
            within(dialog).getByRole("button", { name: "닫기" })
        );
        await waitFor(() =>
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
        );
        await waitFor(() => expect(opener).toHaveFocus());
    },
};
