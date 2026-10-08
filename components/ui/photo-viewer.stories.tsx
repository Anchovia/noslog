import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";

import Button from "./button";
import PhotoViewer from "./photo-viewer";
const meta = {
    title: "UI/PhotoViewer",
    component: PhotoViewer,
    args: {
        photos: [
            { id: 1, url: "/logo.png", alt: "NosLog 로고" },
            { id: 2, url: "/flags/kr.png", alt: "대한민국 국기" },
        ],
        index: 0,
        open: false,
        onIndexChange: fn(),
        onOpenChange: fn(),
        label: (index: number, total: number) => `${index} / ${total} 사진`,
        previousLabel: "이전 사진",
        nextLabel: "다음 사진",
    },
    parameters: {
        docs: {
            description: {
                component:
                    "공개 저장소 요청 없이 기존 로컬 그림으로 사진 넘김·순환·닫기를 확인합니다.",
            },
        },
    },
    render: function Render(args) {
        const [open, setOpen] = useState(args.open);
        const [index, setIndex] = useState(args.index);
        return (
            <>
                <Button onClick={() => setOpen(true)}>사진 열기</Button>
                <PhotoViewer
                    {...args}
                    open={open}
                    index={index}
                    onIndexChange={(next) => {
                        setIndex(next);
                        args.onIndexChange(next);
                    }}
                    onOpenChange={(next) => {
                        setOpen(next);
                        args.onOpenChange(next);
                    }}
                />
            </>
        );
    },
} satisfies Meta<typeof PhotoViewer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        await userEvent.click(
            within(canvasElement).getByRole("button", { name: "사진 열기" })
        );
        const dialog = await screen.findByRole("dialog", {
            name: "1 / 2 사진",
        });
        await userEvent.click(
            within(dialog).getByRole("button", { name: "다음 사진" })
        );
        await expect(dialog).toHaveAccessibleName("2 / 2 사진");
        await userEvent.keyboard("{ArrowRight}");
        await expect(dialog).toHaveAccessibleName("1 / 2 사진");
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
        );
    },
};
export const InitiallyOpen: Story = { args: { open: true } };
export const Single: Story = {
    args: {
        photos: [{ id: 1, url: "/logo.png", alt: "NosLog 로고" }],
        open: true,
    },
};
export const Empty: Story = { args: { photos: [] } };
