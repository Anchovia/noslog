"use client";

import { useTranslations } from "@/components/i18n/localeProvider";
import Button, { foundationButtonClass } from "@/components/ui/Button";
import type { SyncAttempt } from "@/features/sync/schemas/syncStatusSchema";
import { syncDateLabel } from "./syncAttemptSummary";
import { NOSTALGIA_PLAY_DATA_URL } from "@/features/sync/officialUrl";

export default function SyncStatusHeader({
    attempt,
    retryAfter,
    reinstall,
    onReinstall,
    onOfficial,
}: {
    attempt?: SyncAttempt;
    retryAfter: number;
    reinstall: boolean;
    onReinstall: () => void;
    onOfficial: () => void;
}) {
    const t = useTranslations();
    const active =
        attempt?.status === "processing" || attempt?.status === "delayed";
    const completed =
        attempt?.status === "completed" || attempt?.status === "partial";
    return (
        <div className="nl-sync-column">
            {attempt?.status === "failed" || attempt?.status === "timedOut" ? (
                <p className="nl-body" role="status">
                    {t(
                        attempt.status === "timedOut"
                            ? "sync.timedOut"
                            : "sync.failed"
                    )}
                </p>
            ) : null}
            <section className="nl-sync-zone">
                <div
                    className="nl-sync-pair nl-sync-status"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <span className="nl-emphasis-label">
                        {attempt
                            ? t(`sync.status.${attempt.status}`)
                            : t("profile.noRecord")}
                    </span>
                    <span className="nl-body-secondary nl-muted">
                        {attempt
                            ? t(
                                  completed
                                      ? "sync.latestAt"
                                      : "sync.startedAt",
                                  {
                                      date: syncDateLabel(
                                          attempt.completedAt ??
                                              attempt.startedAt
                                      ),
                                  }
                              )
                            : t("sync.neverSynced")}
                    </span>
                </div>
                {reinstall ? (
                    <Button
                        appearance="foundation"
                        className="nl-sync-primary"
                        onClick={onReinstall}
                    >
                        {t("sync.reinstall")}
                    </Button>
                ) : attempt && !active ? (
                    retryAfter > 0 ? (
                        <>
                            <Button
                                appearance="foundation"
                                disabled
                                className="nl-sync-primary"
                            >
                                {t("sync.openOfficial")}
                            </Button>
                            <p className="nl-body-secondary nl-muted">
                                {t("sync.cooldown", { count: retryAfter })}
                            </p>
                        </>
                    ) : (
                        <a
                            href={NOSTALGIA_PLAY_DATA_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onOfficial}
                            className={`${foundationButtonClass()} nl-sync-primary`}
                        >
                            {t(
                                completed
                                    ? "sync.openOfficial"
                                    : "sync.tryAgain"
                            )}
                        </a>
                    )
                ) : null}
            </section>
            {active ? (
                <div className="nl-sync-progress" role="status">
                    <p className="nl-body">
                        {t(
                            attempt.status === "delayed"
                                ? "sync.delayed"
                                : "sync.processing"
                        )}
                    </p>
                    <p className="nl-body-secondary nl-muted">
                        {t("sync.processingHelp")}
                    </p>
                </div>
            ) : null}
        </div>
    );
}
