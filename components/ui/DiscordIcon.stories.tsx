import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import DiscordIcon from "./DiscordIcon";
const meta = {
    title: "UI/DiscordIcon",
    component: DiscordIcon,
    args: { className: "nl-icon" },
    parameters: {
        docs: {
            description: {
                component:
                    "장식용 Discord 심볼. 의미는 함께 있는 글자나 버튼 label이 전달합니다.",
            },
        },
    },
    render: (args) => (
        <span className="nl-control">
            <DiscordIcon {...args} /> Discord
        </span>
    ),
} satisfies Meta<typeof DiscordIcon>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
