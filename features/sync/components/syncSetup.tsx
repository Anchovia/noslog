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
        <div className="nl-sync-column">
            <section className="nl-sync-setup">
                {showHeading ? (
                    <h2 className="nl-section-title">{t("sync.setup")}</h2>
                ) : null}
                <div className="nl-sync-install-card">
                    <div className="nl-sync-install-card__target">
                        <a
                            ref={anchor}
                            onClick={(event) => event.preventDefault()}
                            draggable
                            className={foundationButtonClass({
                                variant: "secondary",
                            })}
                        >
                            {t("sync.bookmarklet")}
                        </a>
                    </div>
                    <p className="nl-body-secondary nl-muted">
                        {t("sync.drag")}
                    </p>
                </div>
                <GuideMedia
                    src="/images/guides/bookmarklet-install.gif"
                    label={t("sync.installDesktopAlt")}
                    width={640}
                    height={360}
                />
                <Disclosure
                    title={t("sync.mobileGuide")}
                    className="nl-sync-mobile-guide"
                >
                    <div className="nl-stack">
                        <p className="nl-body">{t("sync.mobileAdd")}</p>
                        <GuideMedia
                            src="/images/guides/mobile-bookmark-add.gif"
                            label={t("sync.mobileAddAlt")}
                            width={332}
                            height={430}
                        />
                        <p className="nl-body">{t("sync.mobileEdit")}</p>
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
            </section>
            <section className="nl-sync-setup">
                <h2 className="nl-section-title">{t("sync.step.run")}</h2>
                <div className="nl-sync-step">
                    <p className="nl-body nl-sync-step__label">
                        <span className="nl-sync-step__number nl-metadata">
                            1
                        </span>
                        <a
                            className="nl-text-link"
                            href={NOSTALGIA_PLAY_DATA_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onOfficial}
                        >
                            {t("sync.pegateLogin")}
                        </a>
                    </p>
                    <GuideMedia
                        src="/images/guides/nostalgia-login.gif"
                        label={t("sync.pegateLoginAlt")}
                        width={1280}
                        height={720}
                    />
                </div>
                <div className="nl-sync-step">
                    <p className="nl-body nl-sync-step__label">
                        <span className="nl-sync-step__number nl-metadata">
                            2
                        </span>
                        {t("sync.runBookmarklet")}
                    </p>
                    <GuideMedia
                        src="/images/guides/noslog-sync.gif"
                        label={t("sync.runBookmarkletAlt")}
                        width={1280}
                        height={720}
                    />
                </div>
            </section>
        </div>
    );
}
