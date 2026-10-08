import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import FilterChips from "./filter-chips";
import FilterGroup from "./filter-group";
const meta = {
    title: "UI/FilterGroup",
    component: FilterGroup,
    args: {
        label: "난이도",
        aside: <span className="nl-metadata">1개 선택</span>,
        children: (
            <FilterChips
                label="난이도 선택"
                value={["normal"]}
                onValueChange={fn()}
                options={[
                    { value: "normal", label: "Normal" },
                    { value: "hard", label: "Hard" },
                ]}
            />
        ),
    },
    parameters: {
        docs: {
            description: {
                component:
                    "필터 그룹의 제목·보조 정보·선택 부품을 조합하는 틀입니다.",
            },
        },
    },
} satisfies Meta<typeof FilterGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
