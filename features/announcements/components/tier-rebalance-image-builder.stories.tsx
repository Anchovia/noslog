import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { TIER_REBALANCE_2026_10_08 } from "@/features/announcements/lib/tier-rebalance-image";

import TierRebalanceImageBuilder from "./tier-rebalance-image-builder";

const meta = {
    title: "Features/Announcements/TierRebalanceImageBuilder",
    component: TierRebalanceImageBuilder,
    args: {
        locale: "ko",
        onAttach: fn(async () => {}),
        initialData: TIER_REBALANCE_2026_10_08,
    },
    decorators: [
        (Story) => (
            <div className="nl-admin-form">
                <Story />
            </div>
        ),
    ],
    parameters: {
        docs: {
            description: {
                component:
                    "승인된 한글 전체 재배치 요약 양식. PNG 생성은 실제 코드, 첨부는 mock이며 DB·Blob·공지 저장을 실행하지 않습니다.",
            },
        },
    },
} satisfies Meta<typeof TierRebalanceImageBuilder>;
export default meta;
type Story = StoryObj<typeof meta>;
async function open(canvasElement: HTMLElement) {
    const canvas = within(canvasElement);
    await userEvent.click(
        canvas.getByText("서열 전체 재배치 요약 이미지", { exact: true })
    );
    return canvas;
}
async function generate(canvas: ReturnType<typeof within>) {
    await userEvent.click(
        canvas.getByRole("button", { name: "요약 이미지 미리보기" })
    );
    const image = (await canvas.findByRole("img")) as HTMLImageElement;
    await waitFor(() => expect(image.naturalWidth).toBe(1200));
    await expect(image.naturalHeight).toBe(960);
    return image;
}
export const KoreanSummary: Story = {
    play: async ({ args, canvasElement }) => {
        const canvas = await open(canvasElement);
        const image = await generate(canvas);
        await expect(image).toHaveAttribute(
            "alt",
            expect.stringContaining("값 변경 7,542건")
        );
        await expect(args.onAttach).not.toHaveBeenCalled();
    },
};
export const EmptyAndPreset: Story = {
    args: { initialData: undefined },
    play: async ({ canvasElement }) => {
        const canvas = await open(canvasElement);
        await userEvent.click(
            canvas.getByRole("button", { name: "요약 이미지 미리보기" })
        );
        await expect(canvas.getByRole("alert")).toHaveTextContent(
            "숫자를 입력"
        );
        await userEvent.click(
            canvas.getByRole("button", {
                name: "2026-10-08 재배치 값 불러오기",
            })
        );
        await expect(
            canvas.getByRole("spinbutton", { name: "서열표마다 채보 수" })
        ).toHaveValue(2172);
        await generate(canvas);
    },
};
export const AttachFailureRetryAndInvalidate: Story = {
    play: async ({ args, canvasElement }) => {
        args.onAttach.mockRejectedValueOnce(new Error("요약 첨부 실패 예시"));
        const canvas = await open(canvasElement);
        await generate(canvas);
        const attach = canvas.getByRole("button", {
            name: "현재 언어 본문에 요약 이미지 첨부",
        });
        await userEvent.click(attach);
        await expect(await canvas.findByRole("alert")).toHaveTextContent(
            "요약 첨부 실패 예시"
        );
        await userEvent.click(attach);
        await waitFor(() => expect(args.onAttach).toHaveBeenCalledTimes(2));
        await expect(args.onAttach).toHaveBeenLastCalledWith(
            expect.any(File),
            TIER_REBALANCE_2026_10_08
        );
        const count = canvas.getByRole("spinbutton", {
            name: "베이직 S 값 변경",
        });
        await userEvent.clear(count);
        await userEvent.type(count, "1900");
        await expect(canvas.queryByRole("img")).not.toBeInTheDocument();
        await expect(canvas.getByText(/값 유지 1,184건/)).toBeVisible();
    },
};
export const InconsistentCounts: Story = {
    play: async ({ canvasElement }) => {
        const canvas = await open(canvasElement);
        const count = canvas.getByRole("spinbutton", {
            name: "베이직 S 값 변경",
        });
        await userEvent.clear(count);
        await userEvent.type(count, "2172");
        await userEvent.click(
            canvas.getByRole("button", { name: "요약 이미지 미리보기" })
        );
        await expect(canvas.getByRole("alert")).toHaveTextContent(
            "합은 채보 수를 넘을 수 없습니다"
        );
        await expect(canvas.queryByRole("img")).not.toBeInTheDocument();
    },
};

export const PendingAttachment: Story = {
    play: async ({ args, canvasElement }) => {
        let finish!: () => void;
        args.onAttach.mockImplementationOnce(
            () =>
                new Promise<void>((resolve) => {
                    finish = resolve;
                })
        );
        const canvas = await open(canvasElement);
        await generate(canvas);
        await userEvent.dblClick(
            canvas.getByRole("button", {
                name: "현재 언어 본문에 요약 이미지 첨부",
            })
        );
        await expect(args.onAttach).toHaveBeenCalledTimes(1);
        await expect(
            canvas.getByRole("spinbutton", { name: "서열표마다 채보 수" })
        ).toBeDisabled();
        await expect(
            canvas.getByRole("button", { name: "요약 이미지 미리보기" })
        ).toBeDisabled();
        finish();
        await waitFor(() =>
            expect(
                canvas.getByRole("spinbutton", { name: "서열표마다 채보 수" })
            ).toBeEnabled()
        );
    },
};
