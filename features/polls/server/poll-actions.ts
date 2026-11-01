"use server";

import { pollVoteSchema } from "@/features/polls/schemas/poll-schema";
import {
    castVote,
    getPublicPoll,
    type PollVoteResult,
} from "@/features/polls/server/poll-service";
import { getServerI18n } from "@/lib/i18n/server";
import { logServerError } from "@/lib/observability/server";
import { getUser } from "@/lib/user";

const VOTE_MESSAGE_KEYS = {
    closed: "poll.error.closed",
    "unknown-option": "poll.voteFailed",
    "too-many": "poll.error.maxChoices",
} as const;

/**
 * 표 내기 (2026-09-23) — 로그인한 사람만, 마감 전에는 고른 것을 통째로 바꿔 넣는다.
 * 비로그인은 결과만 보이고 여기서 막는다(디시 · 아카 · GitHub 과 같은 규칙).
 */
export async function votePoll(
    pollId: number,
    optionIds: number[]
): Promise<PollVoteResult> {
    const { locale, t } = await getServerI18n();
    const user = await getUser();
    if (!user) return { success: false, message: t("poll.loginToVote") };
    const input = pollVoteSchema.safeParse({ pollId, optionIds });
    if (!input.success)
        return { success: false, message: t("poll.voteFailed") };
    try {
        const failed = await castVote(
            input.data.pollId,
            user.id,
            input.data.optionIds
        );
        if (failed)
            return { success: false, message: t(VOTE_MESSAGE_KEYS[failed]) };
        // 표를 내기 전에는 표 수를 받지 못했으니, 이 표로 열린 결과를 함께 돌려준다
        const poll = await getPublicPoll(
            { id: input.data.pollId },
            locale,
            user.id
        );
        if (!poll) return { success: false, message: t("poll.voteFailed") };
        return { success: true, poll };
    } catch (error) {
        logServerError(error, {
            event: "poll.vote.failed",
            routeType: "action",
        });
        // 서버 · 연결 문제만 같은 표를 다시 보내 볼 수 있다(마감 · 개수 초과는 다시 보내도 같다)
        return {
            success: false,
            message: t("poll.voteFailed"),
            retryable: true,
        };
    }
}
