import { hasBearerSecret } from "@/lib/api/bearer-secret";
import { withRouteErrorLog } from "@/lib/api/route-response";

export function runCronRoute(
    request: Request,
    {
        secret,
        event,
        routePath,
        unauthorized,
        run,
        failed,
    }: {
        secret: string | undefined;
        event: string;
        routePath: string;
        unauthorized: () => Response;
        run: () => Promise<Response>;
        failed: () => Response;
    }
) {
    if (!hasBearerSecret(request, secret)) return unauthorized();
    return withRouteErrorLog({ event, routePath }, run, failed);
}
