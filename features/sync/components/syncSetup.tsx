"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "@/components/i18n/localeProvider";
import Button, { foundationButtonClass } from "@/components/ui/Button";
import ModalDialog from "@/components/ui/modalDialog";
import Disclosure from "@/components/ui/disclosure";
import { StatusMessage } from "@/components/ui/statusMessage";
import { NOSTALGIA_PLAY_DATA_URL } from "@/features/sync/officialUrl";

const subscribeMotion = (notify: () => void) => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    query.addEventListener("change", notify);
    return () => query.removeEventListener("change", notify);
};
const reducedSnapshot = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverReducedSnapshot = () => true;

function GuideMedia({
    src,
    label,
    width,
    height,
}: {
    src: string;
    label: string;
    width: number;
    height: number;
}) {
    const [open, setOpen] = useState(false);
    const reduced = useSyncExternalStore(
        subscribeMotion,
        reducedSnapshot,
        serverReducedSnapshot
    );
    return (
        <ModalDialog
            open={open}
            onOpenChange={setOpen}
            title={label}
            width="wide"
            trigger={
                <button
                    type="button"
                    className="nl-sync-media"
                    style={{ aspectRatio: `${width} / ${height}` }}
                    aria-label={label}
                >
                    {reduced ? (
                        <span className="nl-body-secondary">{label}</span>
                    ) : (
                        <Image
                            src={src}
                            alt=""
                            width={width}
                            height={height}
                            unoptimized
                        />
                    )}
                </button>
            }
        >
            {open ? (
                <Image
                    src={src}
                    alt={label}
                    width={width}
                    height={height}
                    unoptimized
                    className="nl-sync-media-expanded"
                />
            ) : null}
        </ModalDialog>
    );
}

export default function SyncSetup({
    bookmarklet,
    onOfficial,
    showHeading = true,
}: {
    bookmarklet: string;
    onOfficial: () => void;
    showHeading?: boolean;
}) {
    const t = useTranslations();
    const StepHeading = showHeading ? "h3" : "h2";
    const anchor = useRef<HTMLAnchorElement>(null);
    const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
        "idle"
    );
    useEffect(() => {
        anchor.current?.setAttribute("href", bookmarklet);
    }, [bookmarklet]);
    async function copy() {
        try {
            await navigator.clipboard.writeText(bookmarklet);
            setCopyState("copied");
        } catch {
            setCopyState("failed");
        }
    }
    return (
        <div className="nl-sync-guide">
            {showHeading ? (
                <header className="nl-sync-guide-intro">
                    <h2 className="nl-section-title">{t("sync.guideTitle")}</h2>
                    <p className="nl-body nl-muted">{t("sync.guideIntro")}</p>
                </header>
            ) : null}
            <ol className="nl-sync-guide-steps">
                <li className="nl-sync-guide-step">
                    <span
                        className="nl-sync-step__number nl-emphasis-label"
                        aria-hidden
                    >
                        1
                    </span>
                    <section className="nl-sync-setup">
                        <div className="nl-sync-step-heading">
                            <StepHeading className="nl-component-title">
                                {t("sync.step.install")}
                            </StepHeading>
                            <span className="nl-metadata nl-sync-step-tag">
                                {t("sync.once")}
                            </span>
                        </div>
                        <div className="nl-sync-install-card">
                            <div className="nl-sync-install-card__target">
                                <a
                                    ref={anchor}
                                    onClick={(event) => event.preventDefault()}
                                    draggable
                                    className={`${foundationButtonClass({
                                        variant: "secondary",
                                    })} nl-sync-step-action`}
                                >
                                    {t("sync.bookmarklet")}
                                </a>
                            </div>
                            <p className="nl-body-secondary nl-muted">
                                {t("sync.drag")}
                            </p>
                        </div>
                        <Disclosure
                            title={t("sync.desktopGuide")}
                            className="nl-sync-guide-detail"
                            compact
                        >
                            <GuideMedia
                                src="/images/guides/bookmarklet-install.gif"
                                label={t("sync.installDesktopAlt")}
                                width={640}
                                height={360}
                            />
                        </Disclosure>
                        <Disclosure
                            title={t("sync.mobileGuide")}
                            className="nl-sync-mobile-guide nl-sync-guide-detail"
                            compact
                        >
                            <div className="nl-stack">
                                <p className="nl-body">{t("sync.mobileAdd")}</p>
                                <GuideMedia
                                    src="/images/guides/mobile-bookmark-add.gif"
                                    label={t("sync.mobileAddAlt")}
                                    width={332}
                                    height={430}
                                />
                                <p className="nl-body">
                                    {t("sync.mobileEdit")}
                                </p>
                                <Button
                                    appearance="foundation"
                                    variant="secondary"
                                    onClick={() => void copy()}
                                >
                                    {t(
                                        copyState === "copied"
                                            ? "sync.copied"
                                            : "sync.copyAddress"
                                    )}
                                </Button>
                                {copyState === "failed" ? (
                                    <StatusMessage
                                        severity="danger"
                                        role="alert"
                                        title={t("common.retryLater")}
                                    />
                                ) : null}
                                {copyState === "copied" ? (
                                    <span className="sr-only" role="status">
                                        {t("sync.copied")}
                                    </span>
                                ) : null}
                                <GuideMedia
                                    src="/images/guides/mobile-bookmark-edit.gif"
                                    label={t("sync.mobileEditAlt")}
                                    width={332}
                                    height={669}
                                />
                            </div>
                        </Disclosure>
                        <p className="nl-metadata nl-muted">
                            {t("sync.privateBookmark")}
                        </p>
                    </section>
                </li>
                <li className="nl-sync-guide-step">
                    <span
                        className="nl-sync-step__number nl-emphasis-label"
                        aria-hidden
                    >
                        2
                    </span>
                    <section className="nl-sync-setup">
                        <StepHeading className="nl-component-title">
                            {t("sync.loginStep")}
                        </StepHeading>
                        <p className="nl-body-secondary nl-muted">
                            {t("sync.loginInstruction")}
                        </p>
                        <a
                            className={`${foundationButtonClass({
                                variant: "secondary",
                            })} nl-sync-step-action`}
                            href={NOSTALGIA_PLAY_DATA_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onOfficial}
                        >
                            {t("sync.openOfficial")}
                        </a>
                        <Disclosure
                            title={t("sync.pegateLoginAlt")}
                            className="nl-sync-guide-detail"
                            compact
                        >
                            <GuideMedia
                                src="/images/guides/nostalgia-login.gif"
                                label={t("sync.pegateLoginAlt")}
                                width={1280}
                                height={720}
                            />
                        </Disclosure>
                    </section>
                </li>
                <li className="nl-sync-guide-step">
                    <span
                        className="nl-sync-step__number nl-emphasis-label"
                        aria-hidden
                    >
                        3
                    </span>
                    <section className="nl-sync-setup">
                        <StepHeading className="nl-component-title">
                            {t("sync.step.run")}
                        </StepHeading>
                        <p className="nl-body">
                            {t("sync.runInstruction", {
                                bookmarklet: t("sync.bookmarklet"),
                            })}
                        </p>
                        <p className="nl-body-secondary nl-muted">
                            {t("sync.returnInstruction")}
                        </p>
                        <Disclosure
                            title={t("sync.runBookmarkletAlt")}
                            className="nl-sync-guide-detail"
                            compact
                        >
                            <GuideMedia
                                src="/images/guides/noslog-sync.gif"
                                label={t("sync.runBookmarkletAlt")}
                                width={1280}
                                height={720}
                            />
                        </Disclosure>
                    </section>
                </li>
            </ol>
        </div>
    );
}
