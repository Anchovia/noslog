import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import RadioGroup from "./radioGroup";
const meta = {
    title: "UI/RadioGroup",
    component: RadioGroup,
    args: {
        label: "공개 범위",
        description: "프로필 표시 범위",
        value: "public",
        onValueChange: fn(),
        options: [
            { value: "public", label: "공개" },
            { value: "private", label: "비공개" },
        ],
    },
    parameters: {
        docs: {
            description: {
                component:
                    "폼의 배타 선택. 네이티브 방향키 선택과 필드 전체 disabled·오류 설명 연결을 확인합니다.",
            },
        },
    },
    render: function Render(args) {
        const [value, setValue] = useState(args.value);
        return (
            <>
                <RadioGroup
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
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        canvas.getByRole("radio", { name: "공개" }).focus();
        await userEvent.keyboard("{ArrowRight}");
        await expect(
            canvas.getByRole("radio", { name: "비공개" })
        ).toBeChecked();
        await expect(
            canvas.getByRole("radio", { name: "비공개" })
        ).toHaveAccessibleDescription("프로필 표시 범위");
    },
};
export const Disabled: Story = { args: { disabled: true } };
export const Error: Story = { args: { error: "공개 범위를 선택하세요." } };
export const Field: Story = { args: { labelStyle: "field" } };
