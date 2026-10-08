import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Markdown from "react-markdown";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";

import MarkdownEditor from "./markdownEditor";

const meta = {
    title: "UI/MarkdownEditor",
    component: MarkdownEditor,
    args: {
        id: "story-body",
        value: "NosLog",
        onChange: fn(),
        onPrimaryAction: fn(),
        labels: {
            write: "쓰기",
            preview: "미리보기",
            tabs: "편집 모드",
            tools: "서식",
            empty: "본문이 없습니다.",
            back: "편집으로 돌아가기",
            headings: "제목 단계",
            heading: "소제목",
            subheading: "작은 소제목",
            bold: "굵게",
            italic: "기울임",
            strike: "취소선",
            quote: "인용",
            code: "코드",
            table: "표",
            rule: "구분선",
            list: "목록",
            ordered: "번호 목록",
            link: "링크",
        },
        renderPreview: (value: string) => <Markdown>{value}</Markdown>,
    },
    parameters: {
        docs: {
            description: {
                component:
                    "로컬 글 편집·서식·미리보기 예제. 실제 제출과 파일 업로드 콜백은 연결하지 않습니다. 입력칸의 label은 호출부에서 연결합니다.",
            },
        },
    },
    render: function Render(args) {
        const [value, setValue] = useState(args.value);
        return (
            <>
                <label htmlFor={args.id} className="nl-field__label">
                    본문
                </label>
                <MarkdownEditor
                    {...args}
                    value={value}
                    onChange={(next) => {
                        setValue(next);
                        args.onChange(next);
                    }}
                />
            </>
        );
    },
} satisfies Meta<typeof MarkdownEditor>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole("textbox", { name: "본문" });
        await userEvent.click(input);
        await userEvent.keyboard("{Control>}a{/Control}");
        await userEvent.click(canvas.getByRole("button", { name: "굵게" }));
        await expect(input).toHaveValue("**NosLog**");
        await userEvent.click(canvas.getByRole("tab", { name: "미리보기" }));
        const dialog = await screen.findByRole("dialog", { name: "미리보기" });
        await waitFor(() =>
            expect(within(dialog).getByText("NosLog")).toBeVisible()
        );
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
        );
        await expect(input).toHaveValue("**NosLog**");
    },
};
export const Empty: Story = { args: { value: "" } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const Invalid: Story = { args: { invalid: true } };
