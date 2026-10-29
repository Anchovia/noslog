import { z } from "zod";
import {
    recordClientDiagnostic,
    recordClientError,
} from "@/lib/observability/client";

// 강제 CSP 가 eval 을 막아, zod 가 객체 스키마를 만들 때 하는 eval 시험(new Function)이 페이지마다 위반 보고로 나간다.
// 화면 모듈이 스키마를 만들기 전에 이 시험과 eval 빠른 길을 끈다
z.config({ jitless: true });

try {
    performance.mark("noslog:instrumentation-ready");

    window.addEventListener("error", (event) => {
        recordClientError(event.error ?? event.message, "window");
    });

    window.addEventListener("unhandledrejection", (event) => {
        const reason =
            event.reason instanceof Error
                ? `${event.reason.name}: ${event.reason.message}`
                : String(event.reason);
        recordClientDiagnostic("unhandled-rejection", reason);
    });
} catch (error) {
    console.warn("NosLog client diagnostics could not start.", error);
}

export function onRouterTransitionStart(
    url: string,
    navigationType: "push" | "replace" | "traverse"
) {
    recordClientDiagnostic(
        "navigation",
        `${navigationType}: ${url.split(/[?#]/, 1)[0]}`
    );
}
