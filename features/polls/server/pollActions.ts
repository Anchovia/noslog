"use server";

import { castVote } from "@/features/polls/server/pollService";
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
export async function votePoll(pollId: number, optionIds: number[]) {
    const { t } = await getServerI18n();
    const user = await getUser();
    if (!user) return { success: false, message: t("poll.loginToVote") };
    try {
        const failed = await castVote(pollId, user.id, optionIds);
        if (failed)
            return { success: false, message: t(VOTE_MESSAGE_KEYS[failed]) };
        return { success: true };
    } catch (error) {
        logServerError(error, {
            event: "poll.vote.failed",
            routeType: "action",
        });
        return { success: false, message: t("poll.voteFailed") };
    }
}
