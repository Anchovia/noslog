/** 운영 CSP 는 eval 을 막는다. Pixi 8 은 이 모듈이 먼저 깔려 있어야 eval 없이 셰이더를 만들고, 없으면 초기화에서 던진다 */
export async function loadPixi() {
    await import("pixi.js/unsafe-eval");
    return import("pixi.js");
}
