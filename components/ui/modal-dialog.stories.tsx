import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";

import { contractStory } from "@/.storybook/responsive-contract";

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

// 떠 있는 창(672 이상) 닫기 = 컨트롤 높이 정사각 · 모서리 radius/control. 컴팩트 아이콘 버튼 크기에 지지 않아야 한다
function closeIsControlSquare(size: string): Story["play"] {
    return async ({ canvasElement }) => {
        await userEvent.click(
            within(canvasElement).getByRole("button", {
                name: "대화상자 열기",
            })
        );
        const dialog = await screen.findByRole("dialog", {
            name: "닉네임 변경",
        });
        const close = getComputedStyle(
            within(dialog).getByRole("button", { name: "닫기" })
        );
        await expect(close.height).toBe(size);
        await expect(close.width).toBe(size);
        await expect(close.borderTopLeftRadius).toBe("8px");
    };
}
export const CloseButtonFloating: Story = {
    ...contractStory(672),
    play: closeIsControlSquare("40px"),
};
export const CloseButtonFloatingWide: Story = {
    ...contractStory(1056),
    play: closeIsControlSquare("32px"),
};

// 떠 있는 창(672 이상)에 발이 없으면 본문 아래 안쪽도 위 · 좌우와 같은 32, 발이 있으면 발이 아래 32 를 맡는다
export const NoFooterBottomInset: Story = {
    ...contractStory(672),
    args: { open: true, title: "서열표 안내", description: undefined },
    render: function Render(args) {
        return (
            <ModalDialog {...args} title="서열표 안내">
                <p>운영자가 쓰는 표 설명입니다.</p>
            </ModalDialog>
        );
    },
    play: async () => {
        const dialog = await screen.findByRole("dialog", {
            name: "서열표 안내",
        });
        const body = dialog.querySelector(".nl-dialog__body")!;
        await expect(body).toBe(dialog.lastElementChild);
        const style = getComputedStyle(body);
        await expect(style.paddingBottom).toBe("32px");
        await expect(style.paddingLeft).toBe("32px");
    },
};
export const FooterKeepsBodyBottomZero: Story = {
    ...contractStory(672),
    args: { open: true },
    play: async () => {
        const dialog = await screen.findByRole("dialog", {
            name: "닉네임 변경",
        });
        const body = dialog.querySelector(".nl-dialog__body")!;
        await expect(getComputedStyle(body).paddingBottom).toBe("0px");
        await expect(
            getComputedStyle(dialog.querySelector(".nl-dialog__footer")!)
                .paddingBottom
        ).toBe("32px");
    },
};
