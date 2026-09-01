import BookmarkletInstall from "@/components/bookmarklet/bookmarkletInstall";
import SyncResultSummary from "@/components/bookmarklet/syncResultSummary";
import SyncTokenRegenerateButton from "@/components/bookmarklet/syncTokenRegenerateButton";
import { createBookmarkletHref, createSyncToken } from "@/lib/bookmarklet";
import { serverEnv } from "@/lib/env/server";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";
import { getUser } from "@/lib/user";
import { formatDistanceToNow } from "date-fns";
import { enUS, ja, ko } from "date-fns/locale";
import { AlertTriangle, Bookmark, CircleCheck, LogIn } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { getLatestSyncSummary } from "./data";

export async function generateMetadata() {
    const { locale, t } = await getServerI18n();

    return createPageMetadata({
        title: t("sync.title"),
        description: t("sync.metaDescription"),
        path: localizePath("/bookmarklet", locale),
    });
}

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
    if (serverEnv.APP_URL) return serverEnv.APP_URL.replace(/\/$/, "");

    throw new Error("Application origin could not be resolved");
}

export default async function BookmarkletPage() {
    const [{ locale, t }, user] = await Promise.all([
        getServerI18n(),
        getUser(),
    ]);
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
        serverEnv.VERCEL_ENV === "preview"
            ? serverEnv.VERCEL_AUTOMATION_BYPASS_SECRET
            : undefined;
    const bookmarkletHref = token
        ? createBookmarkletHref(
              appOrigin,
              token,
              protectionBypassSecret,
              locale
          )
        : null;
    const syncDate = latestSync?.completedAt ?? latestSync?.startedAt;
    const dateLocale = locale === "ja" ? ja : locale === "en" ? enUS : ko;
    const syncLabel = !latestSync
        ? t("sync.none")
        : latestSync.status === "processing"
          ? t("sync.processing")
          : latestSync.status === "failed"
            ? t("sync.failed")
            : t("sync.last", {
                  distance: formatDistanceToNow(syncDate!, {
                      addSuffix: true,
                      locale: dateLocale,
                  }),
              });

    return (
        <div className="flex flex-col gap-3 px-4 py-5">
            <header>
                <h1 className="text-title">{t("sync.title")}</h1>
                <p className="text-body-muted mt-2">{t("sync.description")}</p>
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
                            ? t("sync.loginStatus")
                            : latestSync?.status === "processing"
                              ? t("sync.processingHelp")
                              : latestSync?.status === "failed"
                                ? t("sync.failedHelp")
                                : latestSync
                                  ? t("sync.resultHelp")
                                  : t("sync.emptyHelp")}
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

            {user ? (
                <p className="border-score/30 bg-score/5 text-caption text-score rounded-card flex items-start gap-2 border px-3 py-2.5">
                    <AlertTriangle
                        className="mt-0.5 size-3.5 shrink-0"
                        aria-hidden
                    />
                    {t("sync.regenerateWarning")}
                </p>
            ) : null}

            {latestSync ? <SyncResultSummary summary={latestSync} /> : null}

            <section className="bg-surface rounded-card flex flex-col gap-4 p-4">
                <StepTitle number={1}>{t("sync.step.install")}</StepTitle>

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
                            {t("sync.loginToCreate")}
                        </p>
                        <Link
                            href={localizePath("/login", locale)}
                            className="bg-text-primary text-bg rounded-card flex h-10 items-center gap-2 px-4 text-sm font-bold"
                        >
                            <LogIn size={16} aria-hidden />
                            {t("common.login")}
                        </Link>
                    </div>
                )}
            </section>

            <section className="bg-surface rounded-card flex flex-col gap-4 p-4">
                <StepTitle number={2}>{t("sync.step.run")}</StepTitle>

                <ol className="text-body flex flex-col gap-4">
                    <li className="flex flex-col gap-2">
                        <span className="flex items-center gap-2">
                            <span className="bg-text-disabled size-1.5 shrink-0 rounded-full" />
                            {t("sync.pegateLogin")}
                        </span>
                        <Image
                            src="/images/guides/nostalgia-login.gif"
                            alt={t("sync.pegateLoginAlt")}
                            width={1280}
                            height={720}
                            unoptimized
                            className="border-border h-auto w-full rounded-md border"
                        />
                    </li>
                    <li className="flex flex-col gap-2">
                        <span className="flex items-center gap-2">
                            <span className="bg-text-disabled size-1.5 shrink-0 rounded-full" />
                            <span>{t("sync.runBookmarklet")}</span>
                        </span>
                        <Image
                            src="/images/guides/noslog-sync.gif"
                            alt={t("sync.runBookmarkletAlt")}
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
