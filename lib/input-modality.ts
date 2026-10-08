// 마지막 입력이 키보드인지 마우스·터치인지 문서 루트(data-input)에 적는다.
// 셀렉트 목록은 열 때 선택된 항목으로 포커스를 옮기는데 브라우저가 이것도 :focus-visible 로 쳐서
// 마우스로 열어도 키보드 위치 표시(흰 1px)가 떴다 — CSS 가 마우스일 때만 그 표시를 끈다(2026-09-14 M2)
declare global {
    interface Window {
        __nlInputModality?: boolean;
    }
}

if (typeof window !== "undefined" && !window.__nlInputModality) {
    window.__nlInputModality = true;
    const root = document.documentElement;
    document.addEventListener(
        "keydown",
        () => {
            root.dataset.input = "keyboard";
        },
        true
    );
    document.addEventListener(
        "pointerdown",
        () => {
            root.dataset.input = "pointer";
        },
        true
    );
}

export {};
