"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// 피드백 새 답변 수(2026-09-18 F1) — 헤더 메뉴 줄 · 홈 칸 어느 쪽으로 창을 열어도 같은 값을 본다.
// 「내 제보」 를 열어 읽으면 0 으로(서버에서도 읽음 처리됨)
const FeedbackUnreadContext = createContext<{
    count: number;
    markSeen: () => void;
}>({ count: 0, markSeen: () => {} });

export function FeedbackUnreadProvider({
    initial,
    children,
}: {
    initial: number;
    children: ReactNode;
}) {
    const [count, setCount] = useState(initial);
    // 셸이 새 값을 받으면(새로고침 · 로그인 전환) 따라간다
    const [seenInitial, setSeenInitial] = useState(initial);
    if (seenInitial !== initial) {
        setSeenInitial(initial);
        setCount(initial);
    }
    return (
        <FeedbackUnreadContext.Provider
            value={{ count, markSeen: () => setCount(0) }}
        >
            {children}
        </FeedbackUnreadContext.Provider>
    );
}

export function useFeedbackUnread() {
    return useContext(FeedbackUnreadContext);
}
