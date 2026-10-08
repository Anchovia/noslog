import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import CountryMarker from "./countryMarker";
const meta = {
    title: "UI/CountryMarker",
    component: CountryMarker,
    args: { country: "ko-KR" },
    parameters: {
        docs: {
            description: {
                component:
                    "국가 그림과 접근성 이름. LocaleProvider의 기존 번역을 사용합니다.",
            },
        },
    },
} satisfies Meta<typeof CountryMarker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Japan: Story = { args: { country: "ja-JP" } };
export const Other: Story = { args: { country: "en-US" } };
export const Large: Story = { args: { size: "large" } };
