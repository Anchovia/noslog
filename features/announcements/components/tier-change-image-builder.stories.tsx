import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import type { TierChangeImageData } from "@/features/announcements/schemas/tier-change-image-schema";
import type { SearchPreview } from "@/features/music/schemas/search-preview-schema";

import TierChangeImageBuilder from "./tier-change-image-builder";

const reference: TierChangeImageData = {
    mode: "basic",
    goal: "pianist",
    date: "2026-09-26",
    rows: [
        {
            musicIndex: "sample-sonatine",
            title: "ソナチネ Op.20−1",
            difficulty: "Expert",
            level: 11,
            before: 11,
            after: 11.5,
        },
        {
            musicIndex: "sample-stray",
            title: "ストレイ・マーチ",
            difficulty: "Expert",
            level: 12,
            before: 11.8,
            after: 11.5,
        },
    ],
};
const searchResults: SearchPreview = {
    total: 1,
    items: [
        {
            index: "sample-sonatine",
            title: reference.rows[0].title,
            localizedTitle: null,
            artist: "参考データ",
            category_short: "CLASSICAL",
            background: null,
            normal: 4,
            hard: 8,
            expert: 11,
            real: null,
            difficulty: null,
            level: null,
        },
    ],
};
function Isolated({ children }: { children: ReactNode }) {
    const [client] = useState(
        () => new QueryClient({ defaultOptions: { queries: { retry: false } } })
    );
    return (
        <QueryClientProvider client={client}>
            <div className="nl-admin-form">{children}</div>
        </QueryClientProvider>
    );
}
const meta = {
    title: "Features/Announcements/TierChangeImageBuilder",
    component: TierChangeImageBuilder,
    args: {
        locale: "ko",
        initialData: reference,
        onAttach: fn(async () => {}),
        searchMusics: fn(async () => searchResults),
    },
    decorators: [
        (Story) => (
            <Isolated>
                <Story />
            </Isolated>
        ),
    ],
    parameters: {
        docs: {
            description: {
                component:
                    "서열 변경 공지 이미지 생성 칸. 검색·첨부는 mock이며 DB·Blob·공지 저장·게시를 실행하지 않습니다. PNG는 실제 브라우저 캔버스와 자체 호스팅 폰트로 생성합니다.",
            },
        },
    },
} satisfies Meta<typeof TierChangeImageBuilder>;
export default meta;
type Story = StoryObj<typeof meta>;
async function preview(canvasElement: HTMLElement) {
    const canvas = within(canvasElement);
    await userEvent.click(
        canvas.getByText("서열 변경 이미지", { exact: true })
    );
    await userEvent.click(
        canvas.getByRole("button", { name: "이미지 미리보기" })
    );
    const image = (await canvas.findByRole("img")) as HTMLImageElement;
    await waitFor(() => expect(image.naturalWidth).toBe(1200));
    return { canvas, image };
}
export const Reference: Story = {
    play: async ({ args, canvasElement }) => {
        const { image } = await preview(canvasElement);
        await expect(image.naturalHeight).toBe(706);
        await expect(image).toHaveAttribute(
            "alt",
            expect.stringContaining("11.0 → 11.5")
        );
        await expect(args.onAttach).not.toHaveBeenCalled();
    },
};
export const SearchAndGenerate: Story = {
    args: { initialData: { ...reference, rows: [] } },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.click(
            canvas.getByText("서열 변경 이미지", { exact: true })
        );
        await userEvent.click(
            canvas.getByRole("button", { name: "이미지 미리보기" })
        );
        await expect(canvas.getByRole("alert")).toHaveTextContent("변경할 곡");
        await userEvent.type(
            canvas.getByRole("searchbox", { name: "곡 추가" }),
            "ソナチネ"
        );
        await userEvent.click(
            await canvas.findByRole("button", { name: /ソナチネ.*参考データ/ })
        );
        await expect(
            canvas.getByRole("combobox", {
                name: /ソナチネ.*難易度|ソナチネ.*난이도/,
            })
        ).toHaveTextContent("Expert Lv.11");
        await userEvent.type(
            canvas.getByRole("spinbutton", { name: /ソナチネ.*변경 전/ }),
            "11.0"
        );
        await userEvent.type(
            canvas.getByRole("spinbutton", { name: /ソナチネ.*변경 후/ }),
            "11.5"
        );
        await userEvent.click(
            canvas.getByRole("button", { name: "이미지 미리보기" })
        );
        await canvas.findByRole("img");
        await expect(args.searchMusics).toHaveBeenCalled();
        await expect(args.onAttach).not.toHaveBeenCalled();
    },
};
export const AttachAndInvalidate: Story = {
    play: async ({ args, canvasElement }) => {
        const { canvas } = await preview(canvasElement);
        await userEvent.click(
            canvas.getByRole("button", { name: "현재 언어 본문에 이미지 첨부" })
        );
        await waitFor(() => expect(args.onAttach).toHaveBeenCalledTimes(1));
        await expect(args.onAttach).toHaveBeenCalledWith(
            expect.any(File),
            reference
        );
        const input = canvas.getByRole("spinbutton", {
            name: /ソナチネ.*변경 후/,
        });
        await userEvent.clear(input);
        await userEvent.type(input, "11.6");
        await expect(canvas.queryByRole("img")).not.toBeInTheDocument();
        await expect(
            canvas.queryByRole("button", {
                name: "현재 언어 본문에 이미지 첨부",
            })
        ).not.toBeInTheDocument();
    },
};
export const AttachmentFailureAndRetry: Story = {
    play: async ({ args, canvasElement }) => {
        args.onAttach.mockRejectedValueOnce(new Error("첨부 실패 예시"));
        const { canvas } = await preview(canvasElement);
        await userEvent.click(
            canvas.getByRole("button", { name: "현재 언어 본문에 이미지 첨부" })
        );
        await expect(await canvas.findByRole("alert")).toHaveTextContent(
            "첨부 실패 예시"
        );
        await expect(canvas.getByRole("img")).toBeVisible();
        await userEvent.click(
            canvas.getByRole("button", { name: "현재 언어 본문에 이미지 첨부" })
        );
        await waitFor(() => expect(args.onAttach).toHaveBeenCalledTimes(2));
        await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
    },
};
