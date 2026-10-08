"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { parseDuration } from "@/lib/motion";

type Phase = "idle" | "running" | "done";

// 사이트 안 이동이 이 시간 넘게 끝나지 않으면(실패 · 막힌 이동) 막대를 거둔다
const GIVE_UP_MS = 15_000;

/**
 * 사이트 안 이동 — 위쪽 진행 막대(2026-09-19 로딩 시안 N1). 사이트 안 링크를 누르고 `--nl-motion-delay-progress`
 * 안에 이동이 끝나지 않으면 맨 위 2px 막대가 차오르고, 새 화면이 들어오면 채우고 사라진다. 이전 화면은 그대로 둔다.
 * 링크를 공용 부품으로 바꾸지 않고 셸 한 곳에서 클릭을 본다 — 다른 처리가 클릭을 가로채 이동을 막으면
 * (저장 안 한 변경 안내 등) 전파가 멈춰 여기까지 오지 않는다.
 */
export default function NavigationProgress() {
    const route = `${usePathname()}?${useSearchParams().toString()}`;
    const [phase, setPhase] = useState<Phase>("idle");
    const element = useRef<HTMLDivElement>(null);
    const waiting = useRef(0);
    const giveUp = useRef(0);
    const pending = useRef(false);

    useEffect(() => {
        const begin = () => {
            window.clearTimeout(waiting.current);
            window.clearTimeout(giveUp.current);
            pending.current = true;
            const delay = element.current
                ? parseDuration(
                      getComputedStyle(element.current).getPropertyValue(
                          "--nl-motion-delay-progress"
                      )
                  )
                : 0;
            waiting.current = window.setTimeout(() => {
                if (pending.current) setPhase("running");
            }, delay);
            giveUp.current = window.setTimeout(() => {
                pending.current = false;
                setPhase("idle");
            }, GIVE_UP_MS);
        };
        const onClick = (event: MouseEvent) => {
            if (
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            )
                return;
            const link =
                event.target instanceof Element
                    ? event.target.closest<HTMLAnchorElement>("a[href]")
                    : null;
            if (
                !link ||
                (link.target && link.target !== "_self") ||
                link.hasAttribute("download") ||
                link.getAttribute("aria-disabled") === "true" ||
                link.getAttribute("aria-current") === "page"
            )
                return;
            const target = new URL(link.href, location.href);
            if (target.origin !== location.origin) return;
            if (
                target.pathname === location.pathname &&
                target.search === location.search
            )
                return;
            begin();
        };
        // 거품 단계 — 링크의 이동 처리가 끝난 뒤에 본다(Next 링크는 기본 동작만 막고 전파는 두므로 여기로 온다)
        window.addEventListener("click", onClick);
        return () => {
            window.removeEventListener("click", onClick);
            window.clearTimeout(waiting.current);
            window.clearTimeout(giveUp.current);
        };
    }, []);

    // 새 화면(주소)이 들어오면 끝 — 막대가 떠 있었으면 채우고 사라진다
    const [seenRoute, setSeenRoute] = useState(route);
    if (seenRoute !== route) {
        setSeenRoute(route);
        if (phase === "running") setPhase("done");
    }
    useEffect(() => {
        if (!pending.current) return;
        pending.current = false;
        window.clearTimeout(waiting.current);
        window.clearTimeout(giveUp.current);
    }, [route]);

    return (
        <div
            ref={element}
            className="nl-progress"
            data-phase={phase}
            aria-hidden="true"
        >
            <div
                className="nl-progress__bar"
                onAnimationEnd={() => {
                    if (phase === "done") setPhase("idle");
                }}
            />
        </div>
    );
}
