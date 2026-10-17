import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { INTENT_HOVER_DELAY_MS } from "@/components/ui/intent-link";
import { createHoverIntent } from "@/lib/hover-intent";

describe("마우스 의도 판정(링크 미리 불러오기)", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("마우스가 100ms 머물러야 한 번 의도로 본다", () => {
        const onIntent = vi.fn();
        const hover = createHoverIntent(INTENT_HOVER_DELAY_MS, onIntent);
        expect(INTENT_HOVER_DELAY_MS).toBe(100);
        expect(hover.enter("mouse")).toBe(true);
        vi.advanceTimersByTime(99);
        expect(onIntent).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1);
        expect(onIntent).toHaveBeenCalledTimes(1);
        expect(hover.waiting).toBe(false);
    });

    it("떠나거나 스크롤되면 기다리던 것을 버린다", () => {
        const onIntent = vi.fn();
        const hover = createHoverIntent(100, onIntent);
        hover.enter("mouse");
        vi.advanceTimersByTime(60);
        hover.leave();
        hover.enter("mouse");
        vi.advanceTimersByTime(60);
        hover.cancel(); // 휠 스크롤로 줄이 지나감
        vi.advanceTimersByTime(500);
        expect(onIntent).not.toHaveBeenCalled();
    });

    it("터치 · 펜은 의도로 보지 않는다", () => {
        const onIntent = vi.fn();
        const hover = createHoverIntent(100, onIntent);
        expect(hover.enter("touch")).toBe(false);
        expect(hover.enter("pen")).toBe(false);
        vi.advanceTimersByTime(500);
        expect(onIntent).not.toHaveBeenCalled();
        expect(hover.waiting).toBe(false);
    });

    it("다시 들어오면 시간을 처음부터 잰다", () => {
        const onIntent = vi.fn();
        const hover = createHoverIntent(100, onIntent);
        hover.enter("mouse");
        vi.advanceTimersByTime(80);
        hover.enter("mouse");
        vi.advanceTimersByTime(80);
        expect(onIntent).not.toHaveBeenCalled();
        vi.advanceTimersByTime(20);
        expect(onIntent).toHaveBeenCalledTimes(1);
    });
});
