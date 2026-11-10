"use client";

import {
    type ChangeEvent,
    type CompositionEvent,
    useRef,
    useState,
} from "react";

// 검색어는 입력 칸이 직접 든다 — URL 을 거쳐 되받으면 한 박자 늦은 값이 덮여 한글 조합이 끊긴다(「ㅉ짜짱ㄱ구」).
// URL 반영은 조합이 끝났을 때만. 뒤로가기처럼 밖에서 바뀐 검색어만 입력 칸으로 받아 온다
export default function useUrlSearchField({
    query,
    onCommit,
}: {
    /** 주소에 있는 지금 검색어 */
    query: string;
    onCommit: (q: string) => void;
}) {
    const [value, setValue] = useState(query);
    const [committed, setCommitted] = useState(query);
    const composing = useRef(false);
    if (query !== committed) {
        setCommitted(query);
        setValue(query);
    }
    function commit(q: string) {
        setValue(q);
        setCommitted(q);
        onCommit(q);
    }
    return {
        clear() {
            commit("");
        },
        inputProps: {
            value,
            onChange(event: ChangeEvent<HTMLInputElement>) {
                setValue(event.target.value);
                if (!composing.current) commit(event.target.value);
            },
            onCompositionStart() {
                composing.current = true;
            },
            onCompositionEnd(event: CompositionEvent<HTMLInputElement>) {
                composing.current = false;
                commit(event.currentTarget.value);
            },
        },
    };
}
