"use client";

import { useEffect, useState } from "react";

import { parseDuration } from "@/lib/motion";

/**
 * 짧게 끝나는 로딩은 표시하지 않기(2026-09-19 로딩 시안 결정 4) — `flag` 가 `--nl-motion-delay-skeleton` 넘게
 * 이어질 때만 true. 끝나면 곧바로 false.
 */
export default function useDelayedFlag(flag: boolean) {
    const [shown, setShown] = useState(false);
    if (!flag && shown) setShown(false);
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
        const timer = window.setTimeout(() => setShown(true), delay);
        return () => window.clearTimeout(timer);
    }, [flag]);
    return flag && shown;
}
