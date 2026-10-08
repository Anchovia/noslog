import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import Button from "./Button";

const meta = {
    title: "UI/Button",
    component: Button,
    args: { children: "확인", onClick: fn() },
    parameters: {
        docs: {
            description: {
                component:
                    "동작에는 Button, 이동에는 링크를 사용합니다. 기본은 L, size=sm은 M입니다. busy 표현은 ActionButton을 사용합니다.",
            },
        },
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["primary", "secondary", "ghost", "danger"],
        },
        size: { control: "select", options: ["sm", "md", "lg"] },
    },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ args, canvasElement }) => {
        const button = within(canvasElement).getByRole("button", {
            name: "확인",
        });
        await userEvent.click(button);
        await expect(args.onClick).toHaveBeenCalledTimes(1);
        await userEvent.keyboard("{Enter}");
        await expect(args.onClick).toHaveBeenCalledTimes(2);
    },
};

export const Disabled: Story = {
    args: { disabled: true },
    play: async ({ args, canvasElement }) => {
        const button = within(canvasElement).getByRole("button", {
            name: "확인",
        });
        await expect(button).toBeDisabled();
        await userEvent.click(button);
        await expect(args.onClick).not.toHaveBeenCalled();
    },
};

export const VariantsAndSizes: Story = {
    render: () => (
        <div className="nl-stack">
            {(["primary", "secondary", "ghost", "danger"] as const).map(
                (variant) => (
                    <div
                        key={variant}
                        className="flex flex-wrap items-center gap-nl-16"
                    >
                        <Button variant={variant}>{variant} L</Button>
                        <Button variant={variant} size="sm">
                            {variant} M
                        </Button>
                        <Button variant={variant} disabled>
                            {variant} 비활성
                        </Button>
                    </div>
                )
            )}
        </div>
    ),
};
