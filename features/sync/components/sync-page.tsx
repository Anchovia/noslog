"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import PageContainer from "@/components/layout/page-container";
import Button from "@/components/ui/button";
import Disclosure from "@/components/ui/disclosure";
import IntentLink from "@/components/ui/intent-link";
import { StatusMessage } from "@/components/ui/status-message";
import { syncStatusOptions } from "@/features/sync/api/sync-status";
import type { SyncStatus } from "@/features/sync/schemas/sync-status-schema";
import { ApiError } from "@/lib/api/response";

import SyncAttemptSummary, { syncDateLabel } from "./sync-attempt-summary";
import SyncInvalidation from "./sync-invalidation";
import SyncSetup from "./sync-setup";
import SyncStatusHeader from "./sync-status-header";

export default function SyncPage({
    bookmarklet,
    initialData,
    userId,
}: {
    bookmarklet: string | null;
    initialData: SyncStatus | null;
    userId: number | null;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const router = useRouter();
    const [setupOpen, setSetupOpen] = useState(true);
    const [reinstall, setReinstall] = useState(false);
    const watchUntil = useRef(0);
    const watchedAttempt = useRef<number | null>(null);
    const setupRef = useRef<HTMLDivElement>(null);
    // 브라우저 시계가 늦어도 새것으로 보는 시간이 길어지지 않게 지금 시각으로 자른다(마운트 때 한 번)
    const [initialDataUpdatedAt] = useState(() =>
        initialData
            ? Math.min(Date.parse(initialData.observedAt), Date.now())
            : undefined
    );
    const result = useQuery({
        ...syncStatusOptions(userId),
        initialData: initialData ?? undefined,
        // 서버가 방금 본 상태를 마운트하자마자 다시 받지 않는다 — 관측 시각 기준 몇 초는 새것(2026-10-15 S5).
        // 폴링 · 공식 사이트에서 돌아올 때(창 포커스)의 재요청은 그대로
        initialDataUpdatedAt,
        staleTime: 5_000,
        enabled: Boolean(bookmarklet),
        retry: (count, error) =>
            !(error instanceof ApiError && error.status === 401) && count < 2,
        refetchInterval: (query) => {
            if (query.state.status === "error") return false;
            const data = query.state.data;
            const latest = data?.attempts[0];
            const active = ["processing", "delayed"].includes(
                latest?.status ?? ""
            );
            if (latest && latest.id !== watchedAttempt.current && !active)
                watchUntil.current = 0;
            // 처리 중이거나 공식 사이트를 연 뒤 2분만 서버에 묻는다 — 쿨다운 초읽기는 아래 화면 타이머로(2026-10-15 S10)
            return active || Date.now() < watchUntil.current ? 5000 : false;
        },
    });
    const data = result.data;
    // 쿨다운(다시 누를 수 있을 때까지 남은 초)은 받은 시각부터 화면에서 센다 — 예전에는 1초마다 서버에 다시 물었다
    const cooldownEnd = data?.retryAfter
        ? result.dataUpdatedAt + data.retryAfter * 1000
        : 0;
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        if (!cooldownEnd) return;
        const timer = window.setInterval(() => {
            const current = Date.now();
            setNow(current);
            if (current >= cooldownEnd) window.clearInterval(timer);
        }, 1000);
        return () => window.clearInterval(timer);
    }, [cooldownEnd]);
    const retryAfter = cooldownEnd
        ? Math.min(
              data?.retryAfter ?? 0,
              Math.max(0, Math.ceil((cooldownEnd - now) / 1000))
          )
        : 0;
    const attempt = data?.attempts[0];
    const firstUse = !attempt;
    const completed =
        attempt?.status === "completed" || attempt?.status === "partial";
    // 이 화면에서 새로 끝난 동기화를 본 순간 한 번 — 앞서 둘러본 화면(프로필 · 랭킹 등)의 클라이언트 캐시를 비운다.
    // staleTimes.dynamic(1시간)은 그대로 두고, 기록이 바뀐 때만 새로 받게 한다(2026-10-15 D8)
    const mountedAttempt = initialData?.attempts[0];
    const refreshedAttempt = useRef(
        mountedAttempt?.status === "completed" ||
            mountedAttempt?.status === "partial"
            ? mountedAttempt.id
            : null
    );
    useEffect(() => {
        if (!completed || !attempt || refreshedAttempt.current === attempt.id)
            return;
        refreshedAttempt.current = attempt.id;
        router.refresh();
    }, [attempt, completed, router]);
    const official = () => {
        watchedAttempt.current = attempt?.id ?? null;
        watchUntil.current = Date.now() + 120000;
        void result.refetch();
    };
    const revealSetup = () => {
        setSetupOpen(true);
        setupRef.current?.focus();
    };
    const setup = bookmarklet ? (
        <SyncSetup
            bookmarklet={bookmarklet}
            onOfficial={official}
            showHeading={firstUse}
        />
    ) : null;
    const help = (
        <Disclosure title={t("sync.help")} heading="section">
            <div className="nl-sync-zone">
                <p className="nl-body-secondary nl-muted">
                    {t("sync.security")}
                </p>
                <SyncInvalidation
                    onInvalidated={() => {
                        setReinstall(true);
                        revealSetup();
                    }}
                />
            </div>
        </Disclosure>
    );
    if (
        !bookmarklet ||
        (result.error instanceof ApiError && result.error.status === 401)
    )
        return (
            <PageContainer
                width="reading"
                className="nl-sync-page nl-sync-page--first"
            >
                <h1 className="nl-page-title">{t("sync.title")}</h1>
                <div className="nl-sync-columns">
                    <div className="nl-sync-column">
                        <SyncSetup bookmarklet={null} />
                    </div>
                    <div className="nl-sync-column">
                        <section className="nl-sync-zone">
                            <h2 className="nl-section-title">
                                {t("sync.limitations")}
                            </h2>
                            <p className="nl-body-secondary nl-muted">
                                {t("sync.limitDescription")}
                            </p>
                        </section>
                        <section className="nl-sync-zone">
                            <h2 className="nl-section-title">
                                {t("sync.whatSent")}
                            </h2>
                            <p className="nl-body-secondary nl-muted">
                                {t("sync.sentDescription")}
                            </p>
                        </section>
                    </div>
                </div>
            </PageContainer>
        );
    return (
        <PageContainer
            width="reading"
            className={
                firstUse ? "nl-sync-page nl-sync-page--first" : "nl-sync-page"
            }
        >
            <h1 className="nl-page-title">{t("sync.title")}</h1>
            {result.isError ? (
                <StatusMessage
                    tone="quiet"
                    severity="danger"
                    role="alert"
                    title={t("common.pageError")}
                    action={
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => void result.refetch()}
                        >
                            {t("common.retry")}
                        </Button>
                    }
                />
            ) : null}
            <div className="nl-sync-columns">
                <div className="nl-sync-column">
                    {!firstUse ? (
                        <div ref={setupRef} tabIndex={-1}>
                            <Disclosure
                                title={t("sync.setup")}
                                heading="section"
                                open={setupOpen}
                                onToggle={(event) =>
                                    setSetupOpen(event.currentTarget.open)
                                }
                            >
                                {setupOpen ? setup : null}
                            </Disclosure>
                        </div>
                    ) : null}
                    {(!completed && !firstUse) || reinstall ? (
                        <SyncStatusHeader
                            attempt={attempt}
                            retryAfter={retryAfter}
                            reinstall={reinstall}
                            onReinstall={revealSetup}
                            onOfficial={official}
                        />
                    ) : null}
                    {!firstUse && reinstall ? (
                        <p className="nl-body-secondary">
                            {t("sync.setupSecurity")}
                        </p>
                    ) : null}
                    {completed ? (
                        <Disclosure
                            title={t("sync.latestResult")}
                            heading="section"
                        >
                            <SyncAttemptSummary
                                attempt={attempt}
                                achievementsHref={
                                    userId
                                        ? href(
                                              `/profile/${userId}/achievements`
                                          )
                                        : undefined
                                }
                            />
                        </Disclosure>
                    ) : null}
                    {data?.firstFullImport ? (
                        <section className="nl-sync-zone">
                            <h2 className="nl-section-title">
                                {t("sync.changes")}
                            </h2>
                            <p className="nl-body">{t("sync.firstFull")}</p>
                        </section>
                    ) : data?.previews.length ? (
                        <section className="nl-sync-zone">
                            <h2 className="nl-section-title">
                                {t("sync.changes")}
                            </h2>
                            <ul className="nl-sync-previews">
                                {data.previews.map((item, index) => (
                                    <li
                                        key={`${item.musicId}-${item.difficulty}-${index}`}
                                    >
                                        <IntentLink
                                            href={href(
                                                `/music/${item.musicId}/${item.difficulty.toLowerCase()}`
                                            )}
                                        >
                                            <span className="nl-sync-pair">
                                                <span className="nl-body nl-sync-song">
                                                    {item.title}
                                                </span>
                                                <span className="nl-metric-value">
                                                    {item.score.toLocaleString()}
                                                </span>
                                            </span>
                                            <span className="nl-metadata nl-muted">
                                                {item.difficulty.toUpperCase()}{" "}
                                                {item.level}
                                                {" · "}
                                                {t(
                                                    attempt?.scope === "full"
                                                        ? "sync.previewBest"
                                                        : "sync.previewRecent"
                                                )}
                                            </span>
                                        </IntentLink>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ) : null}
                    {firstUse ? (
                        <div ref={setupRef} tabIndex={-1}>
                            {setup}
                        </div>
                    ) : null}
                </div>
                <div className="nl-sync-column">
                    {!firstUse ? (
                        <div>
                            <Disclosure
                                title={t("sync.history")}
                                heading="section"
                            >
                                <ol className="nl-sync-history">
                                    {data?.attempts.map((entry) => (
                                        <li key={entry.id}>
                                            <div className="nl-sync-pair">
                                                <time
                                                    className="nl-body-secondary"
                                                    dateTime={entry.startedAt}
                                                >
                                                    {syncDateLabel(
                                                        entry.startedAt
                                                    )}
                                                </time>
                                                <span className="nl-emphasis-label">
                                                    {t(
                                                        `sync.status.${entry.status}`
                                                    )}
                                                </span>
                                            </div>
                                            <SyncAttemptSummary
                                                attempt={entry}
                                                compact
                                            />
                                        </li>
                                    ))}
                                </ol>
                            </Disclosure>
                        </div>
                    ) : null}
                    {firstUse ? (
                        <section className="nl-sync-zone">
                            <h2 className="nl-section-title">
                                {t("sync.limitations")}
                            </h2>
                            <p className="nl-body-secondary nl-muted">
                                {t("sync.limitDescription")}
                            </p>
                        </section>
                    ) : null}
                    {help}
                </div>
            </div>
        </PageContainer>
    );
}
