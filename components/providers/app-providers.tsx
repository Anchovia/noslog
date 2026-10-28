"use client";

import {
    QueryClient,
    QueryClientProvider,
    isServer,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";

const ONE_HOUR_MS = 60 * 60 * 1000;

function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: ONE_HOUR_MS,
                // 서버는 요청마다 새 클라이언트를 만든다. 유한한 gcTime 은 정리 타이머가 요청 객체를 그 시간만큼 붙잡게 한다
                gcTime: isServer ? Infinity : ONE_HOUR_MS,
                retry: 1,
                refetchOnWindowFocus: false,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
    if (isServer) return createQueryClient();

    browserQueryClient ??= createQueryClient();
    return browserQueryClient;
}

export function AppProviders({ children }: { children: ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <NuqsAdapter>
            <QueryClientProvider client={queryClient}>
                {children}
                {process.env.NODE_ENV === "development" ? (
                    <ReactQueryDevtools initialIsOpen={false} />
                ) : null}
            </QueryClientProvider>
        </NuqsAdapter>
    );
}
