import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import Button from "./Button";
import { fieldDescription, FormField, Input, TextArea } from "./formField";

const meta = {
    title: "UI/FormField",
    component: FormField,
    args: { id: "nickname", label: "닉네임", children: null },
    parameters: {
        docs: {
            description: {
                component:
                    "Input의 id와 FormField의 id를 맞추고, fieldDescription으로 도움말·오류를 aria-describedby에 연결합니다. 오류가 있으면 aria-invalid를 함께 지정합니다.",
            },
        },
    },
} satisfies Meta<typeof FormField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <FormField {...args}>
            <Input id={args.id} placeholder="닉네임을 입력하세요" />
        </FormField>
    ),
};
export const Error: Story = {
    args: { help: "2자 이상 입력하세요.", error: "닉네임을 입력하세요." },
    render: (args) => (
        <FormField {...args}>
            <Input
                id={args.id}
                aria-invalid
                aria-describedby={fieldDescription(args.id, {
                    help: true,
                    error: true,
                })}
            />
        </FormField>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole("textbox", { name: "닉네임" });
        await expect(input).toHaveAttribute("aria-invalid", "true");
        await expect(input).toHaveAccessibleDescription(
            "2자 이상 입력하세요. 닉네임을 입력하세요."
        );
        await expect(canvas.getByRole("alert")).toHaveTextContent(
            "닉네임을 입력하세요."
        );
    },
};
export const Disabled: Story = {
    render: (args) => (
        <FormField {...args}>
            <Input id={args.id} disabled defaultValue="NosLog" />
        </FormField>
    ),
};
export const Success: Story = {
    args: { success: "사용할 수 있는 닉네임입니다." },
    render: (args) => (
        <FormField {...args}>
            <Input
                id={args.id}
                defaultValue="NosLog"
                aria-describedby={`${args.id}-success`}
            />
        </FormField>
    ),
};
export const Multiline: Story = {
    args: { id: "introduction", label: "소개" },
    render: (args) => (
        <FormField {...args}>
            <TextArea id={args.id} rows={4} />
        </FormField>
    ),
};
export const ValidateAndRecover: Story = {
    render: function Render(args) {
        const [error, setError] = useState(false);
        return (
            <form
                noValidate
                className="nl-stack"
                onSubmit={(event) => {
                    event.preventDefault();
                    const value = new FormData(event.currentTarget).get(
                        "nickname"
                    );
                    setError(
                        typeof value !== "string" || value.trim().length < 2
                    );
                }}
            >
                <FormField
                    {...args}
                    error={error ? "2자 이상 입력하세요." : undefined}
                >
                    <Input
                        id={args.id}
                        name="nickname"
                        aria-invalid={error || undefined}
                        aria-describedby={fieldDescription(args.id, { error })}
                    />
                </FormField>
                <Button type="submit">검사</Button>
            </form>
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole("textbox", { name: "닉네임" });
        await userEvent.click(canvas.getByRole("button", { name: "검사" }));
        await expect(input).toHaveAccessibleDescription("2자 이상 입력하세요.");
        await userEvent.type(input, "NosLog");
        await userEvent.click(canvas.getByRole("button", { name: "검사" }));
        await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
        await expect(input).not.toHaveAttribute("aria-invalid");
    },
};

export const ErrorOverridesSuccess: Story = {
    args: { error: "입력 내용을 확인해 주세요.", success: "사용할 수 있어요." },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByRole("alert")).toHaveTextContent(
            "입력 내용을 확인해 주세요."
        );
        await expect(canvas.queryByRole("status")).not.toBeInTheDocument();
    },
};
