export interface ServerErrorContext {
    event: string;
    method?: string;
    path?: string;
    routePath?: string;
    routeType?: string;
    routerKind?: string;
    renderSource?: string;
    revalidateReason?: string;
}

function normalizeError(error: unknown) {
    if (error instanceof Error) {
        const digest =
            "digest" in error && typeof error.digest === "string"
                ? error.digest
                : undefined;

        return {
            name: error.name,
            message: error.message.slice(0, 1_000),
            digest,
        };
    }

    return {
        name: "UnknownError",
        message: String(error).slice(0, 1_000),
        digest: undefined,
    };
}

function sanitizePath(path: string | undefined) {
    if (!path) return undefined;
    return path.split(/[?#]/, 1)[0]?.slice(0, 500);
}

export function createServerErrorEvent(
    error: unknown,
    context: ServerErrorContext
) {
    return {
        level: "error",
        timestamp: new Date().toISOString(),
        event: context.event,
        error: normalizeError(error),
        request: {
            method: context.method,
            path: sanitizePath(context.path),
        },
        route: {
            path: context.routePath,
            type: context.routeType,
            router: context.routerKind,
            renderSource: context.renderSource,
            revalidateReason: context.revalidateReason,
        },
    };
}

export function logServerError(error: unknown, context: ServerErrorContext) {
    console.error(JSON.stringify(createServerErrorEvent(error, context)));
}

/** 칸을 정해 두어 토큰 · 비밀값 · 세션 원문이 로그에 들어가지 않게 한다 */
export interface SecurityEvent {
    event: string;
    actorUserId?: number;
    targetUserId?: number;
    mode?: string;
    reason?: string;
    role?: string;
}

export function logSecurityEvent(event: SecurityEvent) {
    console.warn(
        JSON.stringify({
            level: "warn",
            timestamp: new Date().toISOString(),
            ...event,
        })
    );
}
