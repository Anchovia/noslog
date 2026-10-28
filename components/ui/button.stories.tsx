import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Heart } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";

import { contractStory } from "@/.storybook/responsive-contract";

import Button from "./button";

const meta = {
    title: "UI/Button",
    component: Button,
    args: { children: "기록 저장", onClick: fn() },
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
        size: {
            control: "select",
            options: ["sm", "md", "lg", "icon", "icon-sm", "icon-lg"],
        },
    },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ args, canvasElement }) => {
        const button = within(canvasElement).getByRole("button", {
            name: "기록 저장",
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
            name: "기록 저장",
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

// 좌우 안쪽은 제 높이 ÷ 2(경계 포함). 넓은 폭에서 줄의 컨트롤 높이(32)가 아니라 버튼 높이(40)를 따르는지 본다. 고스트만 12
const paddingFollowsOwnHeight: Story["play"] = async ({ canvasElement }) => {
    for (const button of within(canvasElement).getAllByRole("button")) {
        const style = getComputedStyle(button);
        const ink =
            parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth);
        await expect(ink).toBe(
            button.classList.contains("nl-button--ghost")
                ? 12
                : parseFloat(style.height) / 2
        );
        await expect(style.paddingRight).toBe(style.paddingLeft);
    }
};
export const PaddingFollowsOwnHeight: Story = {
    ...VariantsAndSizes,
    play: paddingFollowsOwnHeight,
};
export const PaddingFollowsOwnHeightWide: Story = {
    ...VariantsAndSizes,
    ...contractStory(1056),
    play: paddingFollowsOwnHeight,
};

// 아이콘 버튼은 자기 줄의 단계 — icon-lg 는 기본 주 · 보조 버튼 줄에서 옆 버튼과 같은 높이
export const IconSizes: Story = {
    render: () => (
        <div className="nl-stack">
            {(
                [
                    ["sm", "icon-sm"],
                    [undefined, "icon"],
                    [undefined, "icon-lg"],
                ] as const
            ).map(([size, iconSize]) => (
                <div
                    key={iconSize}
                    className="flex items-center gap-nl-8"
                    data-testid={iconSize}
                >
                    {iconSize === "icon" ? (
                        <Button variant="ghost">길찾기</Button>
                    ) : (
                        <Button size={size}>길찾기</Button>
                    )}
                    <Button
                        variant="secondary"
                        size={iconSize}
                        aria-label={`즐겨찾기 ${iconSize}`}
                    >
                        <Heart className="nl-icon" aria-hidden />
                    </Button>
                </div>
            ))}
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        for (const iconSize of ["icon-sm", "icon", "icon-lg"] as const) {
            const row = within(canvas.getByTestId(iconSize));
            const [text, icon] = row.getAllByRole("button");
            const textBox = text.getBoundingClientRect(),
                iconBox = icon.getBoundingClientRect();
            await expect(iconBox.height).toBe(textBox.height);
            await expect(iconBox.width).toBe(iconBox.height);
        }
    },
};
// 넓은 폭은 기본(32)과 크게(40)가 갈라져 icon · icon-lg 차이가 드러난다
export const IconSizesWide: Story = { ...IconSizes, ...contractStory(1056) };
