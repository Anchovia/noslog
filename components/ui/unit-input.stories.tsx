import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import UnitInput from "./unit-input";

const meta = {
    title: "UI/UnitInput",
    component: UnitInput,
    args: {
        unit: "대",
        defaultValue: "1",
        type: "number",
        "aria-label": "대수",
    },
    parameters: {
        docs: {
            description: {
                component:
                    "단위 붙은 입력칸 — 공용 입력칸 모양 안에 오른쪽 단위 글자.",
            },
        },
    },
} satisfies Meta<typeof UnitInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        await expect(
            within(canvasElement).getByRole("spinbutton", { name: "대수" })
        ).toHaveValue(1);
    },
};
// 잘못된 칸 = 안 입력의 aria-invalid 를 겉 상자가 받아 빨간 경계. 포커스해도 흰 경계로 덮이지 않는다
export const Invalid: Story = {
    args: { "aria-invalid": true },
    play: async ({ canvasElement }) => {
        const field = within(canvasElement).getByRole("spinbutton", {
            name: "대수",
        });
        const box = field.closest(".nl-unit-input")!;
        const destructive = getComputedStyle(box)
            .getPropertyValue("--nl-feedback-destructive")
            .trim();
        const probe = document.createElement("span");
        probe.style.color = destructive;
        box.append(probe);
        const expected = getComputedStyle(probe).color;
        probe.remove();
        await expect(getComputedStyle(box).borderTopColor).toBe(expected);
        await userEvent.tab();
        await expect(field).toHaveFocus();
        await expect(getComputedStyle(box).borderTopColor).toBe(expected);
        // 빨간 경계는 그대로 두고 키 포커스는 바깥 흰 선으로 보인다
        await expect(getComputedStyle(box).outlineStyle).toBe("solid");
        await expect(getComputedStyle(box).outlineOffset).toBe("2px");
    },
};
export const Disabled: Story = { args: { disabled: true } };
