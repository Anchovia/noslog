import BookmarkletInstall from "@/components/bookmarklet/bookmarkletInstall";
import SyncResultSummary from "@/components/bookmarklet/syncResultSummary";
import SyncTokenRegenerateButton from "@/components/bookmarklet/syncTokenRegenerateButton";
import { createBookmarkletHref, createSyncToken } from "@/lib/bookmarklet";
import { createPageMetadata } from "@/lib/metadata/site";
import { getUser } from "@/lib/user";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Bookmark, CircleCheck, LogIn } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { getLatestSyncSummary } from "./data";

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
        user ? getLatestSyncSummary(user.id) : null,
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
    const syncDate = latestSync?.completedAt ?? latestSync?.startedAt;
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
                    북마클릿 등록으로 NOSTALGIA 기록을 동기화할 수 있습니다.
                </p>
            </header>

            <section className="border-border rounded-card flex min-h-15 items-center gap-3 border px-4 py-3">
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
                        {!user
                            ? "로그인 후 연동 상태를 확인할 수 있습니다."
                            : latestSync?.status === "processing"
                              ? "완료되면 처리 결과를 확인할 수 있습니다."
                              : latestSync?.status === "failed"
                                ? "로그인 상태를 확인한 뒤 다시 동기화해주세요."
                                : latestSync
                                  ? "최근 처리 결과를 아래에서 확인할 수 있습니다."
                                  : "동기화하면 처리 결과가 여기에 표시됩니다."}
                    </p>
                </div>
                {user ? (
                    <SyncTokenRegenerateButton />
                ) : (
                    <CircleCheck
                        size={18}
                        className="text-text-disabled"
                        aria-hidden
                    />
                )}
            </section>

            {latestSync ? <SyncResultSummary summary={latestSync} /> : null}

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
                        <span className="flex items-center gap-2">
                            <span className="bg-text-disabled size-1.5 shrink-0 rounded-full" />
                            p.eagate NOSTALGIA 페이지에 로그인
                        </span>
                        <Image
                            src="/images/guides/nostalgia-login.gif"
                            alt="p.eagate NOSTALGIA 페이지에 로그인하는 방법"
                            width={1280}
                            height={720}
                            unoptimized
                            className="border-border h-auto w-full rounded-md border"
                        />
                    </li>
                    <li className="flex flex-col gap-2">
                        <span className="flex items-center gap-2">
                            <span className="bg-text-disabled size-1.5 shrink-0 rounded-full" />
                            <span className="whitespace-nowrap">
                                북마크바의 <strong>NosLog 동기화</strong> 클릭
                                및 동기화 완료
                            </span>
                        </span>
                        <Image
                            src="/images/guides/noslog-sync.gif"
                            alt="북마크바에서 NosLog 동기화를 실행하는 방법"
                            width={1280}
                            height={720}
                            unoptimized
                            className="border-border h-auto w-full rounded-md border"
                        />
                    </li>
                </ol>
            </section>
        </div>
    );
}
