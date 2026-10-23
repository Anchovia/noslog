"use client";

import {
    type ReactNode,
    type RefObject,
    useId,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import { readTokenPixels } from "@/lib/design-tokens";

// 시트 끌기 — 이만큼 움직여야 끌기로 본다(그 전엔 탭) · 이만큼 끌고 놓으면 그 방향 단계로 ·
// 올린 목록을 맨 위에서 당길 때는 스크롤과 헷갈리지 않게 더 길게
const SHEET_SLOP = 8;
const SHEET_DRAG = 24;
const SHEET_PULL = 48;

export type MapSheetState = "collapsed" | "expanded";

/**
 * 지도 + 아래 시트(오락실 찾기 · 뮤즈캣 오락실 목록이 함께 쓴다, 2026-10-21 공용화 — 오락실 찾기에서 그대로 옮김).
 * 1056 미만 · 지도가 떠 있을 때(`sheetLayout`): 지도가 화면을 채우고 목록 시트가 아래에서 올라온다.
 * 손잡이 줄을 탭하면 올리고 내리고, 끌면 따라오고 놓으면 그 방향 단계로. 내린 높이는 `peekSelector` 로 찾은 요소까지 재서 넣는다.
 * 겉의 `.nl-arcades` 에 `data-sheet-layout` · `data-sheet` 를 붙이는 것은 부르는 쪽(배치 CSS 가 그 둘을 본다)
 */
export default function ArcadeMapSheet({
    sheetLayout,
    sheet,
    onSheetChange,
    map,
    head,
    toggleLabel,
    peekSelector,
    measureKey,
    bodyRef: externalBodyRef,
    children,
}: {
    sheetLayout: boolean;
    sheet: MapSheetState;
    onSheetChange: (sheet: MapSheetState) => void;
    /** 지도 칸 안 — 지도와 지도 위에 떠 있는 것 */
    map: ReactNode;
    /** 손잡이 아래 머리(요약 줄 등) */
    head?: ReactNode;
    toggleLabel: string;
    /** 내린 시트가 보여 줄 마지막 요소(시트 몸 안) */
    peekSelector: string;
    /** 이 값이 바뀌면 내린 높이를 다시 잰다(결과 수 · 적용 조건 등) */
    measureKey: string;
    bodyRef?: RefObject<HTMLDivElement | null>;
    children: ReactNode;
}) {
    const [peek, setPeek] = useState<number | null>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const catalogRef = useRef<HTMLDivElement>(null);
    const ownBodyRef = useRef<HTMLDivElement>(null);
    const bodyRef = externalBodyRef ?? ownBodyRef;
    const bodyId = useId();
    const gesture = useRef<{
        startY: number;
        from: number;
        range: number;
        threshold: number;
        active: boolean;
    } | null>(null);
    const suppressClick = useRef(false);
    const pointerHandled = useRef(false);

    // 시트 끌기 — 끄는 동안은 손가락 위치로 옮긴다. 놓으면 인라인 위치를 지워 가까운 단계(끈 방향)로 곧바로 바뀐다
    function beginDrag(y: number, threshold: number) {
        const catalog = catalogRef.current;
        if (!sheetLayout || !catalog || peek === null) return;
        const range = catalog.offsetHeight - peek;
        gesture.current = {
            startY: y,
            from: sheet === "expanded" ? 0 : range,
            range,
            threshold,
            active: false,
        };
    }
    function moveDrag(y: number) {
        const drag = gesture.current;
        const catalog = catalogRef.current;
        if (!drag || !catalog) return false;
        const distance = y - drag.startY;
        if (!drag.active) {
            if (Math.abs(distance) < SHEET_SLOP) return false;
            drag.active = true;
            resultsRef.current?.setAttribute("data-dragging", "");
        }
        const offset = Math.min(drag.range, Math.max(0, drag.from + distance));
        catalog.style.transform = `translateY(${offset}px)`;
        return true;
    }
    function endDrag(y: number | null) {
        const drag = gesture.current;
        gesture.current = null;
        if (!drag?.active) return false;
        resultsRef.current?.removeAttribute("data-dragging");
        if (catalogRef.current) catalogRef.current.style.transform = "";
        if (y !== null && Math.abs(y - drag.startY) >= drag.threshold)
            onSheetChange(y < drag.startY ? "expanded" : "collapsed");
        return true;
    }
    function toggleSheet() {
        onSheetChange(sheet === "expanded" ? "collapsed" : "expanded");
    }
    // 내린 시트 높이 = 손잡이 · 머리 · 첫 항목 요약 + 아래 16 — 내용에서 잰다
    useLayoutEffect(() => {
        if (!sheetLayout) return;
        const catalog = catalogRef.current;
        const body = bodyRef.current;
        if (!catalog || !body) return;
        const anchor = body.querySelector<HTMLElement>(peekSelector);
        if (!anchor) return;
        // 잰 높이는 화면마다 달라 토큰이 될 수 없다 — CSS 변수 하나로만 넘기고(배치 CSS 가 읽음) 값은 끌기 범위에도 쓴다
        const measure = () => {
            const next = Math.ceil(
                anchor.getBoundingClientRect().bottom +
                    body.scrollTop -
                    catalog.getBoundingClientRect().top +
                    // 첫 카드 아래 여백 — compact component inset
                    readTokenPixels(catalog, "--nl-spacing-16")
            );
            resultsRef.current?.style.setProperty(
                "--nl-sheet-peek",
                `${next}px`
            );
            setPeek(next);
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(catalog);
        observer.observe(anchor);
        return () => observer.disconnect();
    }, [sheetLayout, peekSelector, measureKey, bodyRef]);

    return (
        <div ref={resultsRef} className="nl-arcades__results">
            <div className="nl-arcades__map-region">{map}</div>
            <div ref={catalogRef} className="nl-arcades__catalog">
                <div className="nl-arcades__sheet-head">
                    {/* 손잡이 줄 전체가 누르는 자리 — 탭하면 올리고 내리고, 끌면 시트가 따라오고 놓으면 그 방향 단계로 */}
                    <button
                        type="button"
                        className="nl-arcades__sheet-toggle"
                        aria-label={toggleLabel}
                        aria-expanded={sheet === "expanded"}
                        aria-controls={bodyId}
                        onPointerDown={(event) => {
                            pointerHandled.current = false;
                            event.currentTarget.setPointerCapture(
                                event.pointerId
                            );
                            beginDrag(event.clientY, SHEET_DRAG);
                        }}
                        onPointerMove={(event) => moveDrag(event.clientY)}
                        // 탭·끌기는 손을 뗄 때 처리한다 — 쓸어 올린 직후의 탭은 브라우저가 클릭을 만들지 않을 때가 있다
                        onPointerUp={(event) => {
                            pointerHandled.current = true;
                            if (!endDrag(event.clientY)) toggleSheet();
                        }}
                        onPointerCancel={() => endDrag(null)}
                        // 키보드(Enter · Space)는 포인터 없이 클릭만 온다. 포인터로 이미 처리한 클릭은 건너뛴다
                        onClick={() => {
                            if (pointerHandled.current) {
                                pointerHandled.current = false;
                                return;
                            }
                            toggleSheet();
                        }}
                    />
                    <span className="nl-arcades__handle" aria-hidden />
                    {head}
                </div>
                <div
                    ref={bodyRef}
                    id={bodyId}
                    className="nl-arcades__sheet-body"
                    // 내린 시트 안으로 포커스가 들어오면(키보드) 가려진 카드가 보이게 올린다
                    onFocusCapture={() => {
                        if (sheetLayout && sheet === "collapsed")
                            onSheetChange("expanded");
                    }}
                    // 내린 시트는 몸 어디를 끌어도 시트가 따라온다(내린 동안 목록은 스크롤하지 않는다)
                    onPointerDown={(event) => {
                        suppressClick.current = false;
                        if (sheet === "collapsed")
                            beginDrag(event.clientY, SHEET_DRAG);
                    }}
                    onPointerMove={(event) => {
                        if (sheet !== "collapsed") return;
                        const target = event.currentTarget;
                        if (
                            moveDrag(event.clientY) &&
                            !target.hasPointerCapture(event.pointerId)
                        )
                            target.setPointerCapture(event.pointerId);
                    }}
                    onPointerUp={(event) => {
                        if (sheet === "collapsed" && endDrag(event.clientY))
                            suppressClick.current = true;
                    }}
                    onPointerCancel={() => {
                        if (sheet === "collapsed") endDrag(null);
                    }}
                    // 끌고 놓은 손가락이 카드를 누른 것으로 이어지지 않게
                    onClickCapture={(event) => {
                        if (!suppressClick.current) return;
                        suppressClick.current = false;
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                    // 올린 목록은 맨 위에서 아래로 당길 때만 시트가 따라 내려온다(그 밖에는 목록 스크롤)
                    onTouchStart={(event) => {
                        if (
                            sheet === "expanded" &&
                            event.currentTarget.scrollTop <= 0
                        )
                            beginDrag(event.touches[0].clientY, SHEET_PULL);
                    }}
                    onTouchMove={(event) => {
                        const drag = gesture.current;
                        if (sheet !== "expanded" || !drag) return;
                        const y = event.touches[0].clientY;
                        if (
                            event.currentTarget.scrollTop > 0 ||
                            (!drag.active && y < drag.startY)
                        ) {
                            endDrag(null);
                            gesture.current = null;
                            return;
                        }
                        moveDrag(y);
                    }}
                    onTouchEnd={(event) => {
                        if (sheet === "expanded")
                            endDrag(event.changedTouches[0].clientY);
                    }}
                    onTouchCancel={() => {
                        if (sheet === "expanded") endDrag(null);
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
