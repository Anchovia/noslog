import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import FileRow from "./fileRow";
const meta = {
    title: "UI/FileRow",
    component: FileRow,
    args: {
        file: new File(["로컬 예제"], "example.txt", { type: "text/plain" }),
        removeLabel: "첨부 지우기",
        onRemove: fn(),
    },
    parameters: {
        docs: {
            description: {
                component:
                    "브라우저 안에서 만든 임시 파일의 이름·크기·삭제 동작. 실제 업로드는 하지 않습니다.",
            },
        },
    },
} satisfies Meta<typeof FileRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement, args }) => {
        await userEvent.click(
            within(canvasElement).getByRole("button", { name: "첨부 지우기" })
        );
        await expect(args.onRemove).toHaveBeenCalledOnce();
    },
};
export const Disabled: Story = { args: { disabled: true } };
export const LongName: Story = {
    args: {
        file: new File(
            ["로컬 예제"],
            "긴-파일-이름을-가진-로컬-첨부-예제.txt",
            { type: "text/plain" }
        ),
    },
};
