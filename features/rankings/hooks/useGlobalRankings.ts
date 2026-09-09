"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { globalRankingOptions } from "@/features/rankings/api/globalRankings";
import {
    parseGlobalRankingQuery,
    serializeGlobalRankingQuery,
} from "@/features/rankings/schemas/globalRankingSchema";
import type {
    GlobalRankingPayload,
    GlobalRankingQuery,
} from "@/features/rankings/schemas/globalRankingSchema";

export default function useGlobalRankings(
    initialQuery: GlobalRankingQuery,
    initialData: GlobalRankingPayload | null,
    viewerId: number | null
) {
    const params = useSearchParams();
    const pathname = usePathname();
    const query = parseGlobalRankingQuery(params);
    const key = serializeGlobalRankingQuery(query).toString();
    const initialKey = serializeGlobalRankingQuery(initialQuery).toString();
    const result = useQuery({
        ...globalRankingOptions(query, viewerId),
        initialData:
            key === initialKey ? (initialData ?? undefined) : undefined,
        placeholderData: keepPreviousData,
    });
    // A failed replacement must keep the last successful rows and their committed units.
    const [committed, setCommitted] = useState(initialData);
    if (result.data && !result.isPlaceholderData && result.data !== committed)
        setCommitted(result.data);
    const data = result.data ?? committed;
    const focusRequest = useRef<{ key: string; target: string } | null>(null);
    const resolvedKey = result.data
        ? serializeGlobalRankingQuery(result.data.query).toString()
        : null;
    useEffect(() => {
        if (!result.data || result.isPlaceholderData || result.isFetching)
            return;
        if (resolvedKey !== key)
            window.history.replaceState(null, "", `${pathname}?${resolvedKey}`);
        if (focusRequest.current?.key !== key) return;
        const target = document.getElementById(focusRequest.current.target);
        if (target) {
            target.focus({ preventScroll: true });
            target.scrollIntoView({ block: "start" });
            focusRequest.current = null;
        }
    }, [
        key,
        pathname,
        resolvedKey,
        result.data,
        result.isFetching,
        result.isPlaceholderData,
    ]);
    function href(next: GlobalRankingQuery) {
        return `${pathname}?${serializeGlobalRankingQuery(next)}`;
    }
    function navigate(next: GlobalRankingQuery, target?: string) {
        const nextKey = serializeGlobalRankingQuery(next).toString();
        focusRequest.current = target ? { key: nextKey, target } : null;
        if (nextKey !== key) window.history.pushState(null, "", href(next));
        else if (target) {
            const element = document.getElementById(target);
            element?.focus({ preventScroll: true });
            element?.scrollIntoView({ block: "start" });
            focusRequest.current = null;
        }
    }
    return {
        query,
        controls: result.isError && committed ? committed.query : query,
        data,
        result,
        navigate,
        href,
        busy: result.isFetching,
        retry: () => {
            focusRequest.current = { key, target: "global-ranking-results" };
            return result.refetch();
        },
    };
}
