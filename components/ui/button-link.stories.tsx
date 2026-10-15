import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { MouseEvent } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import Button, { foundationButtonClass } from "./button";
import ButtonLink from "./button-link";

const meta = {
    title: "UI/ButtonLink",
    component: ButtonLink,
    args: {
        href: "/ko/music",
        children: "악곡으로 이동",
        onClick: fn((event: MouseEvent<HTMLAnchorElement>) =>
            event.preventDefault()
        ),
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Button과 같은 모양의 이동용 링크입니다. 기본은 Next Link이며 OAuth·외부 주소·북마클릿은 plain으로 일반 a를 사용합니다. disabled/busy 상태는 호출부에서 기존 링크 정책으로 처리합니다.",
            },
        },
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["primary", "secondary", "ghost", "danger", null],
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg", "icon", "icon-sm", null],
        },
        plain: { control: "boolean" },
    },
} satisfies Meta<typeof ButtonLink>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Internal: Story = {
    args: {
        href: { pathname: "/ko/music", query: { difficulty: "hard" } },
        prefetch: false,
    },
    play: async ({ args, canvasElement }) => {
        const link = within(canvasElement).getByRole("link", {
            name: "악곡으로 이동",
        });
        await expect(link.tagName).toBe("A");
        await expect(link).toHaveAttribute("href", "/ko/music?difficulty=hard");
        link.focus();
        await userEvent.keyboard(" ");
        await expect(args.onClick).not.toHaveBeenCalled();
        await userEvent.keyboard("{Enter}");
        await expect(args.onClick).toHaveBeenCalledTimes(1);
        await userEvent.click(link);
        await expect(args.onClick).toHaveBeenCalledTimes(2);
    },
};

export const External: Story = {
    args: {
        plain: true,
        href: "https://example.com/",
        target: "_blank",
        rel: "noopener noreferrer",
        children: "외부 페이지 · 새 창",
    },
    play: async ({ canvasElement }) => {
        const link = within(canvasElement).getByRole("link", {
            name: "외부 페이지 · 새 창",
        });
        await expect(link).toHaveAttribute("href", "https://example.com/");
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    },
};

export const NativeRefAndPending: Story = {
    args: {
        plain: true,
        href: "/discord/start",
        "aria-disabled": true,
        "aria-busy": true,
        children: "Discord로 계속하기",
    },
    render: (args) => (
        <ButtonLink
            {...args}
            plain
            href="/discord/start"
            ref={(anchor) => {
                if (anchor) anchor.dataset.refConnected = "true";
            }}
            draggable
        />
    ),
    play: async ({ args, canvasElement }) => {
        const link = within(canvasElement).getByRole("link", {
            name: "Discord로 계속하기",
        });
        await expect(link).toHaveAttribute("data-ref-connected", "true");
        await expect(link).toHaveAttribute("draggable", "true");
        await expect(link).toHaveAttribute("aria-disabled", "true");
        await expect(link).toHaveAttribute("aria-busy", "true");
        await userEvent.click(link);
        await expect(args.onClick).toHaveBeenCalledTimes(1);
    },
};

export const MatchingButtonAppearance: Story = {
    render: () => (
        <div className="nl-stack">
            {(["primary", "secondary", "ghost", "danger"] as const).flatMap(
                (variant) =>
                    ([undefined, "sm"] as const).map((size) => (
                        <div
                            key={`${variant}-${size}`}
                            className="flex items-center gap-nl-16"
                        >
                            <Button variant={variant} size={size}>
                                {variant}
                            </Button>
                            <ButtonLink
                                plain
                                href="#"
                                variant={variant}
                                size={size}
                                onClick={(event) => event.preventDefault()}
                            >
                                {variant}
                            </ButtonLink>
                        </div>
                    ))
            )}
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const buttons = canvas.getAllByRole("button");
        const links = canvas.getAllByRole("link");
        for (let index = 0; index < buttons.length; index++) {
            const button = buttons[index],
                link = links[index];
            await expect(link.className).toBe(button.className);
            const buttonStyle = getComputedStyle(button),
                linkStyle = getComputedStyle(link);
            for (const property of [
                "height",
                "paddingLeft",
                "paddingRight",
                "borderRadius",
                "fontSize",
                "backgroundColor",
                "color",
            ] as const)
                await expect(linkStyle[property]).toBe(buttonStyle[property]);
        }
        await expect(links[0].className).toBe(foundationButtonClass());
    },
};
