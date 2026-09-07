"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import PageContainer from "@/components/layout/pageContainer";
import Button, { foundationButtonClass } from "@/components/ui/Button";
import Disclosure from "@/components/ui/disclosure";
import { StatusMessage } from "@/components/ui/statusMessage";
import { syncStatusOptions } from "@/features/sync/api/syncStatus";
import type { SyncStatus } from "@/features/sync/schemas/syncStatusSchema";
import SyncAttemptSummary, {
    SyncMetrics,
    syncDateLabel,
} from "./syncAttemptSummary";
import SyncSetup from "./syncSetup";
import SyncInvalidation from "./syncInvalidation";
import SyncStatusHeader from "./syncStatusHeader";
import { ApiError } from "@/lib/api/response";

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
    const [setupOpen, setSetupOpen] = useState(!initialData?.attempts.length);
    const [reinstall, setReinstall] = useState(false);
    const watchUntil = useRef(0);
    const watchedAttempt = useRef<number | null>(null);
    const setupRef = useRef<HTMLDivElement>(null);
    const result = useQuery({
        ...syncStatusOptions(userId),
        initialData: initialData ?? undefined,
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
            return active || Date.now() < watchUntil.current
                ? 5000
                : data?.retryAfter
                  ? 1000
                  : false;
        },
    });
    const data = result.data;
    const attempt = data?.attempts[0];
    const firstUse = !attempt;
    const completed =
        attempt?.status === "completed" || attempt?.status === "partial";
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
        <section className="nl-sync-zone">
            <h2 className="nl-section-title">{t("sync.help")}</h2>
            <p className="nl-body-secondary nl-muted">
                {t(firstUse ? "sync.regenerateWarning" : "sync.security")}
            </p>
            <SyncInvalidation
                onInvalidated={() => {
                    setReinstall(true);
                    revealSetup();
                }}
            />
        </section>
    );
    if (
        !bookmarklet ||
        (result.error instanceof ApiError && result.error.status === 401)
    )
        return (
            <PageContainer className="nl-sync-page">
                <h1 className="nl-page-title">{t("sync.title")}</h1>
                <p className="nl-body nl-muted">{t("sync.description")}</p>
                <div className="nl-sync-columns">
                    <div className="nl-sync-column">
                        <section className="nl-sync-zone">
                            <h2 className="nl-section-title">
                                {t("sync.whatSent")}
                            </h2>
                            <p className="nl-body-secondary nl-muted">
                                {t("sync.sentDescription")}
                            </p>
                        </section>
                        <Link
                            href={href("/login?returnTo=/bookmarklet")}
                            className={`${foundationButtonClass()} nl-sync-primary`}
                        >
                            {t("common.login")}
                        </Link>
                        <section className="nl-sync-zone">
                            <h2 className="nl-section-title">
                                {t("sync.howWorks")}
                            </h2>
                            <ol className="nl-sync-process nl-body-secondary nl-muted">
                                <li>{t("sync.step.install")}</li>
                                <li>{t("sync.pegateLogin")}</li>
                                <li>{t("sync.step.run")}</li>
                            </ol>
                        </section>
                    </div>
                    <section className="nl-sync-zone">
                        <h2 className="nl-section-title">
                            {t("sync.limitations")}
                        </h2>
                        <p className="nl-body-secondary nl-muted">
                            {t("sync.limitDescription")}
                        </p>
                    </section>
                </div>
            </PageContainer>
        );
    return (
        <PageContainer className="nl-sync-page">
            <h1 className="nl-page-title">{t("sync.title")}</h1>
            {result.isError ? (
                <StatusMessage severity="danger" title={t("common.pageError")}>
                    <Button
                        appearance="foundation"
                        variant="secondary"
                        onClick={() => void result.refetch()}
                    >
                        {t("common.retry")}
                    </Button>
                </StatusMessage>
            ) : null}
            <div className="nl-sync-columns">
                <div className="nl-sync-column">
                    <SyncStatusHeader
                        attempt={attempt}
                        retryAfter={data?.retryAfter ?? 0}
                        reinstall={reinstall}
                        onReinstall={revealSetup}
                        onOfficial={official}
                    />
                    {firstUse || reinstall ? (
                        <p className="nl-body-secondary">
                            {t("sync.setupSecurity")}
                        </p>
                    ) : null}
                    {completed ? (
                        <section className="nl-sync-zone">
                            <h2 className="nl-section-title">
                                {t("sync.latestResult")}
                            </h2>
                            <SyncAttemptSummary attempt={attempt} />
                        </section>
                    ) : null}
                    {!firstUse && data ? (
                        <section className="nl-sync-zone">
                            <h2 className="nl-section-title">
                                {t("sync.coverage")}
                            </h2>
                            <p className="nl-body-secondary nl-muted">
                                {t("sync.coverageHelp")}
                            </p>
                            <SyncMetrics
                                items={[
                                    {
                                        label: t("sync.coveragePlayed"),
                                        value: data.coverage.played,
                                    },
                                    {
                                        label: t("sync.coverageJudgement"),
                                        value: data.coverage.judgement,
                                    },
                                    {
                                        label: t("sync.coverageTiming"),
                                        value: data.coverage.timing,
                                    },
                                ]}
                            />
                        </section>
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
                                        <Link
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
                                        </Link>
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
                    {help}
                </div>
            </div>
        </PageContainer>
    );
}
