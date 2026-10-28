import { fn } from "storybook/test";

// 스토리북이 sb.mock 으로 바꿔 끼우는 가짜 — 결과는 각 스토리가 정한다
export const votePoll = fn(
    async (
        _pollId: number,
        _optionIds: number[]
    ): Promise<{
        success: boolean;
        message?: string;
        retryable?: boolean;
    }> => ({ success: true })
);
