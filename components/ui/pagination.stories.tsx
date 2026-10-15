import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import Pagination from "./pagination";
const meta = {
    title: "UI/Pagination",
    component: Pagination,
    args: {
        page: 1,
        totalPages: 12,
        onPageChange: fn(),
        label: "페이지 이동",
        pageLabel: (page: number) => `${page}페이지`,
        previousLabel: "이전 페이지",
        nextLabel: "다음 페이지",
    },
    parameters: {
        docs: {
            description: {
                component:
                    "너비에 맞춘 페이지 번호와 앞뒤 이동. busy는 조작을 막고 링크 형태는 href를 유지합니다.",
            },
        },
    },
    render: function Render(args) {
        const [value, setValue] = useState(args.page);
        return (
            <>
                <Pagination
                    {...args}
                    page={value}
                    onPageChange={(next) => {
                        setValue(next);
                        args.onPageChange(next);
                    }}
                />
            </>
        );
    },
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(
            canvas.getByRole("button", { name: "이전 페이지" })
        ).toBeDisabled();
        await userEvent.click(
            canvas.getByRole("button", { name: "다음 페이지" })
        );
        await expect(
            canvas.getByRole("button", { name: "2페이지" })
        ).toHaveAttribute("aria-current", "page");
    },
};
export const LastPage: Story = { args: { page: 12 } };
export const Busy: Story = { args: { busy: true } };
export const SingleHidden: Story = { args: { totalPages: 1 } };
export const SingleShown: Story = { args: { totalPages: 1, showSingle: true } };
export const Links: Story = {
    args: { pageHref: (page: number) => `#page-${page}` },
};
