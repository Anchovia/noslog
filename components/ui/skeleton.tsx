import { cn } from "@/lib/utils";

/**
 * 스켈레톤 글자 자리(2026-09-19 로딩 시안 S1) — 실제 글자 스타일 클래스(`nl-body` · `nl-entity-title` …)를 넘기면
 * 그 줄 높이만큼 자리를 잡고 글자 크기 높이의 막대를 그린다. 실제 글자가 들어와도 자리가 움직이지 않는다.
 */
export function SkeletonText({
    className,
    width = "full",
    sample,
}: {
    /** 대신할 글자의 글자 스타일 클래스 */
    className: string;
    width?: "s" | "m" | "l" | "full";
    /** 짧은 값(순위 · 숫자) 자리 — 흔한 값을 보이지 않게 넣어 그 글자 폭만큼만 막대를 그린다(예: 「0,000」) */
    sample?: string;
}) {
    return (
        <span
            className={cn("nl-skeleton-text", className)}
            data-width={sample || width === "full" ? undefined : width}
            data-sample={sample ? "" : undefined}
            aria-hidden="true"
        >
            <span className="nl-skeleton">{sample}</span>
        </span>
    );
}

/**
 * 로딩 안내(화면 읽기용, 2026-09-19) — 무엇을 불러오는지 한 번만 알린다. 스켈레톤 자체는 `aria-hidden`.
 * 로딩 중인 영역에는 `aria-busy` 를, 화면 안 다시 불러오기의 스켈레톤 묶음에는 `nl-loading-delay` 를 붙인다
 * (짧게 끝나면 스켈레톤이 보이지 않게 `--nl-motion-delay-skeleton` 동안 숨김, 자리는 차지).
 */
export function LoadingStatus({ label }: { label: string }) {
    return (
        <span className="sr-only" role="status">
            {label}
        </span>
    );
}
