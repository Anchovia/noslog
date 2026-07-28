import {
    recordClientDiagnostic,
    recordClientError,
} from "@/lib/observability/client";

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
