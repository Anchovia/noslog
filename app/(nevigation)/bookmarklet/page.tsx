import { regenerateSyncToken } from "@/app/(nevigation)/bookmarklet/action";
import BookmarkletInstall from "@/components/bookmarklet/bookmarkletInstall";
import GuideMediaPlaceholder from "@/components/bookmarklet/guideMediaPlaceholder";
import Button from "@/components/ui/Button";
import { createBookmarkletHref, createSyncToken } from "@/lib/bookmarklet";
import db from "@/lib/db";
import { createPageMetadata } from "@/lib/metadata/site";
import { getUser } from "@/lib/user";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Bookmark, CircleCheck, LogIn, RefreshCw } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export const metadata = createPageMetadata({
    title: "데이터 연동 가이드",
    description:
        "북마클릿으로 NOSTALGIA 플레이 기록을 NosLog에 안전하게 연동하는 방법을 안내합니다.",
    path: "/bookmarklet",
});

function StepTitle({ number, children }: { number: number; children: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className="bg-border text-text-primary flex size-5 items-center justify-center rounded-full text-xs font-bold">
                {number}
            </span>
            <h2 className="text-section">{children}</h2>
        </div>
    );
}

async function requestOrigin() {
    const requestHeaders = await headers();
    const host =
        requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    const protocol =
        requestHeaders.get("x-forwarded-proto") ??
        (host?.startsWith("localhost") || host?.startsWith("192.168.")
            ? "http"
            : "https");

    if (host) return `${protocol}://${host}`;
    if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");

    throw new Error("Application origin could not be resolved");
}

export default async function BookmarkletPage() {
    const user = await getUser();
    const [appOrigin, latestSync] = await Promise.all([
        requestOrigin(),
        user
            ? db.dataSync.findFirst({
                  where: { user_id: user.id },
                  orderBy: { started_at: "desc" },
                  select: {
                      status: true,
                      sync_scope: true,
                      started_at: true,
                      completed_at: true,
                  },
              })
            : null,
    ]);
    const token = user
        ? createSyncToken({
              userId: user.id,
              version: user.sync_token_version,
          })
        : null;
    const protectionBypassSecret =
        process.env.VERCEL_ENV === "preview"
            ? process.env.VERCEL_AUTOMATION_BYPASS_SECRET
            : undefined;
    const bookmarkletHref = token
        ? createBookmarkletHref(appOrigin, token, protectionBypassSecret)
        : null;
    const syncDate = latestSync?.completed_at ?? latestSync?.started_at;
    const syncLabel = !latestSync
        ? "아직 동기화 기록이 없습니다."
        : latestSync.status === "processing"
          ? "데이터를 동기화하고 있습니다."
          : latestSync.status === "failed"
            ? "마지막 동기화에 실패했습니다."
            : `마지막 동기화 ${formatDistanceToNow(syncDate!, {
                  addSuffix: true,
                  locale: ko,
              })}`;

    return (
        <div className="flex flex-col gap-3 px-4 py-5">
            <header>
                <h1 className="text-title">데이터 연동</h1>
                <p className="text-body-muted mt-2">
                    북마클릿을 한 번 등록하면 NOSTALGIA 페이지에서 클릭 한
                    번으로 기록이 동기화됩니다.
                </p>
            </header>

            <section className="bg-surface rounded-card flex flex-col gap-4 p-4">
                <StepTitle number={1}>북마클릿 등록</StepTitle>

                {bookmarkletHref ? (
                    <BookmarkletInstall href={bookmarkletHref} />
                ) : (
                    <div className="flex flex-col items-center gap-3 py-3 text-center">
                        <Bookmark
                            size={28}
                            className="text-text-disabled"
                            aria-hidden
                        />
                        <p className="text-body-muted">
                            로그인하면 계정 전용 북마클릿을 생성할 수 있습니다.
                        </p>
                        <Link
                            href="/login"
                            className="bg-text-primary text-bg rounded-card flex h-10 items-center gap-2 px-4 text-sm font-bold"
                        >
                            <LogIn size={16} aria-hidden />
                            로그인
                        </Link>
                    </div>
                )}
            </section>

            <section className="bg-surface rounded-card flex flex-col gap-4 p-4">
                <StepTitle number={2}>기록 동기화</StepTitle>

                <ol className="text-body flex flex-col gap-4">
                    <li className="flex flex-col gap-2">
                        <GuideMediaPlaceholder label="NOSTALGIA 로그인" />
                        <span className="flex items-center gap-2">
                            <span className="bg-text-disabled size-1.5 shrink-0 rounded-full" />
                            p.eagate NOSTALGIA 페이지에 로그인
                        </span>
                    </li>
                    <li className="flex flex-col gap-2">
                        <GuideMediaPlaceholder label="NosLog 동기화 실행" />
                        <span className="flex items-center gap-2">
                            <span className="bg-text-disabled size-1.5 shrink-0 rounded-full" />
                            북마크바의 <strong>NosLog 동기화</strong> 클릭
                        </span>
                    </li>
                    <li className="flex flex-col gap-2">
                        <GuideMediaPlaceholder label="동기화 진행 상태" />
                        <span className="flex items-center gap-2">
                            <span className="bg-text-disabled size-1.5 shrink-0 rounded-full" />
                            진행 상태가 표시되고 완료 후 프로필 갱신
                        </span>
                    </li>
                </ol>
            </section>

            <section className="border-border rounded-card flex min-h-15 items-center gap-3 border px-4">
                <span
                    className={
                        latestSync?.status === "failed"
                            ? "bg-danger size-2 shrink-0 rounded-full"
                            : latestSync?.status === "completed"
                              ? "bg-success size-2 shrink-0 rounded-full"
                              : "bg-text-disabled size-2 shrink-0 rounded-full"
                    }
                />
                <div className="min-w-0 flex-1">
                    <p className="text-text-primary truncate text-sm font-semibold">
                        {syncLabel}
                    </p>
                    <p className="text-caption mt-0.5">
                        {user
                            ? latestSync?.status === "completed"
                                ? `${latestSync.sync_scope === "recent" ? "최근 기록" : "전체 기록"} 동기화 · 문제가 있으면 토큰을 재발급하세요.`
                                : "문제가 있으면 연동 토큰을 재발급하세요."
                            : "로그인 후 연동 상태를 확인할 수 있습니다."}
                    </p>
                </div>
                {user ? (
                    <form action={regenerateSyncToken}>
                        <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            aria-label="연동 토큰 재발급"
                            title="연동 토큰 재발급"
                        >
                            <RefreshCw size={16} aria-hidden />
                        </Button>
                    </form>
                ) : (
                    <CircleCheck
                        size={18}
                        className="text-text-disabled"
                        aria-hidden
                    />
                )}
            </section>
        </div>
    );
}
