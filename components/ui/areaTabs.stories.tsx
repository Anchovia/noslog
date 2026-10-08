import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import AreaTabs from "./areaTabs";

const meta = {
    title: "UI/AreaTabs",
    component: AreaTabs,
    args: {
        onValueChange: fn(),
        label: "Music sections",
        value: "overview",
        options: [
            { value: "overview", label: "Overview" },
            { value: "records", label: "Records" },
        ],
        children: null,
    },
    render: function Render(args) {
        const [value, setValue] = useState(args.value);
        return (
            <AreaTabs
                {...args}
                value={value}
                onValueChange={(next) => {
                    setValue(next);
                    args.onValueChange(next);
                }}
            >
                <p className="nl-body">
                    {value === "overview" ? "Music overview" : "Play records"}
                </p>
            </AreaTabs>
        );
    },
} satisfies Meta<typeof AreaTabs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ManualActivation: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        canvas.getByRole("tab", { name: "Overview" }).focus();
        await userEvent.keyboard("{ArrowRight}");
        const records = canvas.getByRole("tab", { name: "Records" });
        await expect(records).toHaveFocus();
        await expect(records).toHaveAttribute("aria-selected", "false");
        await userEvent.keyboard("{Enter}");
        await expect(records).toHaveAttribute("aria-selected", "true");
        await expect(
            canvas.getByRole("tabpanel", { name: "Records" })
        ).toHaveTextContent("Play records");
    },
};
