// 마우스 의도 판정(2026-10-17 B) — 링크 위에 delay 만큼 머물면 onIntent 를 한 번 부른다.
// 마우스가 아닌 포인터(터치 · 펜)는 무시하고, 떠나거나(leave) 스크롤되면(cancel) 기다리던 것을 버린다.
export function createHoverIntent(delay: number, onIntent: () => void) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const cancel = () => {
        if (timer !== null) clearTimeout(timer);
        timer = null;
    };
    return {
        enter(pointerType: string) {
            if (pointerType !== "mouse") return false;
            cancel();
            timer = setTimeout(() => {
                timer = null;
                onIntent();
            }, delay);
            return true;
        },
        leave: cancel,
        cancel,
        get waiting() {
            return timer !== null;
        },
    };
}
