"use client";

import { useLinkStatus } from "next/link";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { LoadingStatus } from "@/components/ui/skeleton";

type PendingContextValue = {
    pending: boolean;
    update: (key: string, pending: boolean) => void;
};

const PendingContext = createContext<PendingContextValue | null>(null);

/** 기간 링크 하나의 Next 탐색 상태를 대시보드 로딩 영역에 전달한다. */
export function AdminDashboardLinkStatus({ statusKey }: { statusKey: string }) {
    const context = useContext(PendingContext);
    const update = context?.update;
    const { pending } = useLinkStatus();

    useEffect(() => {
        update?.(statusKey, pending);
        return () => update?.(statusKey, false);
    }, [pending, statusKey, update]);

    return null;
}

/** 대시보드 안 기간 탐색 중인 링크를 한 영역의 바쁨 상태로 모은다. */
export function AdminDashboardPending({ children }: { children: ReactNode }) {
    const [pendingKeys, setPendingKeys] = useState<Set<string>>(
        () => new Set()
    );
    const update = useCallback((key: string, pending: boolean) => {
        setPendingKeys((current) => {
            const hasKey = current.has(key);
            if (hasKey === pending) return current;
            const next = new Set(current);
            if (pending) next.add(key);
            else next.delete(key);
            return next;
        });
    }, []);
    const value = useMemo(
        () => ({ pending: pendingKeys.size > 0, update }),
        [pendingKeys, update]
    );

    return (
        <PendingContext.Provider value={value}>
            {value.pending ? (
                <LoadingStatus label="대시보드 통계를 불러오는 중" />
            ) : null}
            {children}
        </PendingContext.Provider>
    );
}

/** 바뀌는 통계 영역만 현재 틀 위에 같은 크기의 지연 스켈레톤으로 교체한다. */
export function AdminDashboardPendingRegion({
    children,
    loading,
}: {
    children: ReactNode;
    loading: ReactNode;
}) {
    const context = useContext(PendingContext);
    const pending = context?.pending ?? false;

    return (
        <div
            className="nl-dashboard__pending-region"
            aria-busy={pending || undefined}
        >
            <div
                className="nl-dashboard__pending-current"
                data-pending={pending || undefined}
                aria-hidden={pending || undefined}
                inert={pending || undefined}
            >
                {children}
            </div>
            {pending ? (
                <div
                    className="nl-dashboard__pending-loading nl-loading-delay"
                    aria-hidden="true"
                >
                    {loading}
                </div>
            ) : null}
        </div>
    );
}
