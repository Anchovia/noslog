import { describe, expect, it, vi } from "vitest";

import { announceSessionEnded, onSessionEnded } from "@/lib/session-broadcast";

// 한 탭의 로그아웃 · 탈퇴를 같은 브라우저의 다른 탭이 받는다(Node 의 BroadcastChannel 도 같은 동작)
describe("세션 종료 탭 알림", () => {
    it("다른 탭이 보낸 종료 알림을 받고, 구독을 끊으면 더 받지 않는다", async () => {
        const handler = vi.fn();
        const stop = onSessionEnded(handler);
        announceSessionEnded();
        await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
        stop();
        announceSessionEnded();
        await new Promise((resolve) => setTimeout(resolve, 20));
        expect(handler).toHaveBeenCalledTimes(1);
    });
});
