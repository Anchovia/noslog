"use client";

export interface ClientDiagnostic {
    type: "error" | "unhandled-rejection" | "navigation";
    message: string;
    path: string;
    timestamp: string;
}

const MAX_DIAGNOSTICS = 30;

declare global {
    interface Window {
        __NOSLOG_DIAGNOSTICS__?: ClientDiagnostic[];
    }
}

function currentPath() {
    return window.location.pathname.slice(0, 500);
}

export function recordClientDiagnostic(
    type: ClientDiagnostic["type"],
    message: string
) {
    const diagnostics = (window.__NOSLOG_DIAGNOSTICS__ ??= []);
    diagnostics.push({
        type,
        message: message.slice(0, 500),
        path: currentPath(),
        timestamp: new Date().toISOString(),
    });

    if (diagnostics.length > MAX_DIAGNOSTICS) {
        diagnostics.splice(0, diagnostics.length - MAX_DIAGNOSTICS);
    }
}

export function recordClientError(error: unknown, source: string) {
    const message =
        error instanceof Error
            ? `${source}: ${error.name}: ${error.message}`
            : `${source}: ${String(error)}`;
    recordClientDiagnostic("error", message);
}
