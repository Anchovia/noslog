"use client";

import { useEffect, useState } from "react";

import { parseDuration } from "@/lib/motion";

/**
 * 짧게 끝나는 로딩은 표시하지 않기(2026-09-19 로딩 시안 결정 4) — `flag` 가 `--nl-motion-delay-skeleton` 넘게
 * 이어질 때만 true. 끝나면 곧바로 false. `key` 가 바뀌면(새 요청) 처음부터 다시 잰다.
 */
export default function useDelayedFlag(flag: boolean, key = "") {
    const [shownFor, setShownFor] = useState<string | null>(null);
    if (!flag && shownFor !== null) setShownFor(null);
    useEffect(() => {
        if (!flag) return;
        const root = document.querySelector(".noslog-ui");
        const delay = root
            ? parseDuration(
                  getComputedStyle(root).getPropertyValue(
                      "--nl-motion-delay-skeleton"
                  )
              )
            : 0;
        const timer = window.setTimeout(() => setShownFor(key), delay);
        return () => window.clearTimeout(timer);
    }, [flag, key]);
    return flag && shownFor === key;
}
