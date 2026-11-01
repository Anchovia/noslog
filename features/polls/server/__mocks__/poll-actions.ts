import { fn } from "storybook/test";

import type { PollVoteResult } from "@/features/polls/server/poll-service";

// 스토리북이 sb.mock 으로 바꿔 끼우는 가짜 — 결과는 각 스토리가 정한다
export const votePoll = fn(
    async (_pollId: number, _optionIds: number[]): Promise<PollVoteResult> => ({
        success: false,
        message: "",
    })
);
