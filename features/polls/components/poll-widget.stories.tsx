import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, mocked, userEvent, waitFor, within } from "storybook/test";

import { votePoll } from "@/features/polls/server/poll-actions";

import PollWidget from "./poll-widget";

const poll = {
    id: 1,
    question: "다음 서열표 갱신 때 먼저 볼 구간은?",
    multiple: false,
    maxChoices: null,
    closesAt: null,
    closed: false,
    showResults: false,
    showVoters: false,
    voterCount: 27,
    myOptionIds: [],
    options: [
        { id: 1, text: "Basic 레벨 13 이상", votes: 12 },
        { id: 2, text: "Recital 전 구간", votes: 9 },
        { id: 3, text: "Pianist 서열표", votes: 6 },
    ],
};

const meta = {
    title: "Features/Polls/PollWidget",
    component: PollWidget,
    args: { poll, isAuthenticated: true },
} satisfies Meta<typeof PollWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// 저장하는 동안은 목록 아래 흐린 「저장 중」, 고른 줄은 고른 채로 둔다
export const SingleSaving: Story = {
    beforeEach: () => {
        let finish: (value: { success: boolean }) => void = () => {};
        mocked(votePoll).mockReturnValue(
            new Promise((resolve) => {
                finish = resolve;
            })
        );
        // 끝나지 않은 전환이 남으면 다음 스토리의 전환까지 바쁜 채로 묶인다
        return () => finish({ success: true });
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const option = canvas.getByRole("button", { name: "Recital 전 구간" });
        await userEvent.click(option);
        const status = await canvas.findByText("저장 중");
        await expect(status).toHaveAttribute("role", "status");
        await expect(status).toHaveClass("nl-body-secondary", "nl-muted");
        await expect(option).toHaveAttribute("aria-pressed", "true");
    },
};

// 한 개 투표는 누르면 바로 저장하고, 저장 상태는 목록 아래 한 곳에 흐린 글자로 보인다
export const SingleSaved: Story = {
    beforeEach: () => {
        mocked(votePoll).mockResolvedValue({ success: true });
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.click(
            canvas.getByRole("button", { name: "Recital 전 구간" })
        );
        const status = await canvas.findByText("저장했습니다.");
        await expect(status).toHaveAttribute("role", "status");
        await expect(status).toHaveClass("nl-body-secondary", "nl-muted");
        await expect(canvas.getByText("28명 참여")).toBeVisible();
        // 상태 줄은 결과 목록과 「N명 참여」 줄 사이에 있다
        const section = canvasElement.querySelector(".nl-poll")!;
        await expect(status.previousElementSibling).toHaveClass(
            "nl-poll__results"
        );
        await expect(status.nextElementSibling).toHaveClass("nl-poll__foot");
        await expect(section.querySelector(".nl-status")).toBeNull();
    },
};

// 실패하면 고른 줄을 되돌리고 목록 아래 상태 메시지 + 「다시 시도」
const failOnce: Story["play"] = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const option = canvas.getByRole("button", { name: "Recital 전 구간" });
    await userEvent.click(option);
    const alert = await canvas.findByRole("alert");
    await expect(alert).toHaveClass("nl-status--quiet", "nl-status--danger");
    await expect(alert).toHaveTextContent("표를 저장하지 못했습니다.");
    await expect(alert.nextElementSibling).toHaveClass("nl-poll__foot");
    await expect(option).toHaveAttribute("aria-pressed", "false");
};
export const SingleFailed: Story = {
    beforeEach: () => {
        mocked(votePoll).mockResolvedValue({
            success: false,
            message: "표를 저장하지 못했습니다.",
            retryable: true,
        });
    },
    play: failOnce,
};

// 마감 · 개수 초과처럼 다시 보내도 같은 실패는 「다시 시도」 를 두지 않는다
export const SingleClosedNoRetry: Story = {
    beforeEach: () => {
        mocked(votePoll).mockResolvedValue({
            success: false,
            message: "마감한 투표는 고칠 수 없습니다.",
        });
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.click(
            canvas.getByRole("button", { name: "Recital 전 구간" })
        );
        const alert = await canvas.findByRole("alert");
        await expect(alert).toHaveTextContent(
            "마감한 투표는 고칠 수 없습니다."
        );
        await expect(
            within(alert).queryByRole("button", { name: "다시 시도" })
        ).toBeNull();
    },
};

// 여러 개 투표 실패는 고르던 것을 두고, 다시 내는 것은 「투표하기」 하나다
export const MultipleFailedKeepsPicks: Story = {
    args: { poll: { ...poll, multiple: true, maxChoices: 3 } },
    beforeEach: () => {
        mocked(votePoll).mockResolvedValue({
            success: false,
            message: "표를 저장하지 못했습니다.",
            retryable: true,
        });
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const first = canvas.getByRole("button", { name: "Recital 전 구간" });
        await userEvent.click(first);
        await userEvent.click(canvas.getByRole("button", { name: "투표하기" }));
        const alert = await canvas.findByRole("alert");
        await expect(
            within(alert).queryByRole("button", { name: "다시 시도" })
        ).toBeNull();
        await expect(first).toHaveAttribute("aria-pressed", "true");
        await expect(
            canvas.getByRole("button", { name: "투표하기" })
        ).toBeEnabled();
    },
};

// 「다시 시도」 는 같은 표를 다시 보낸다
export const SingleFailedRetry: Story = {
    beforeEach: () => {
        mocked(votePoll)
            .mockReset()
            .mockResolvedValueOnce({
                success: false,
                message: "표를 저장하지 못했습니다.",
                retryable: true,
            })
            .mockResolvedValueOnce({ success: true });
    },
    play: async (context) => {
        await failOnce(context);
        const canvas = within(context.canvasElement);
        await userEvent.click(
            within(canvas.getByRole("alert")).getByRole("button", {
                name: "다시 시도",
            })
        );
        await expect(votePoll).toHaveBeenLastCalledWith(1, [2]);
        await expect(await canvas.findByText("저장했습니다.")).toBeVisible();
        await waitFor(() =>
            expect(canvas.queryByRole("alert")).not.toBeInTheDocument()
        );
    },
};
