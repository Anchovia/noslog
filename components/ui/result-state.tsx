import type { ReactNode } from "react";

export default function ResultState({
    message,
    action,
    error = false,
}: {
    message: ReactNode;
    action?: ReactNode;
    error?: boolean;
}) {
    return (
        <div className="nl-result-state" role={error ? "alert" : "status"}>
            <p className="nl-body-secondary nl-muted">{message}</p>
            {action}
        </div>
    );
}
