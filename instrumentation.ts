import type { Instrumentation } from "next";

import { logServerError } from "@/lib/observability/server";

export function register() {
    // 외부 SDK 없이 Next.js 서버 오류 훅만 활성화합니다.
}

export const onRequestError: Instrumentation.onRequestError = (
    error,
    request,
    context
) => {
    logServerError(error, {
        event: "next.request.error",
        method: request.method,
        path: request.path,
        routePath: context.routePath,
        routeType: context.routeType,
        routerKind: context.routerKind,
        renderSource: context.renderSource,
        revalidateReason: context.revalidateReason,
    });
};
