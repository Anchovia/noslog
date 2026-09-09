"use client";

import * as Popover from "@radix-ui/react-popover";
import { Languages } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import MusicJacket from "@/components/music/musicJacket";
import type {
    ChartDetail,
    Difficulty,
    MusicInfo,
} from "@/components/music/musicDetailTypes";
import ActionButton from "@/components/ui/actionButton";
import { foundationButtonClass } from "@/components/ui/Button";

export default function MusicEntityHeader({
    music,
    difficulty,
    chart,
    pending = false,
}: {
    music: MusicInfo;
    difficulty: Difficulty;
    chart: ChartDetail | null;
    pending?: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const [open, setOpen] = useState(false);
    const identity = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const element = identity.current;
        if (!element) return;
        const title = element.querySelector("h1");
        if (!title) return;
        const fit = () => {
            for (const size of ["page", "section", "component"]) {
                title.dataset.fit = size;
                const lineHeight = Number.parseFloat(
                    getComputedStyle(title).lineHeight
                );
                if (
                    element.scrollHeight <= 96 ||
                    title.scrollHeight <= lineHeight
                )
                    break;
            }
        };
        const observer = new ResizeObserver(fit);
        observer.observe(element);
        void document.fonts.ready.then(fit);
        return () => observer.disconnect();
    }, [music.title, music.artist, music.localizedTitle]);
    const video =
        chart?.play_video_url && /^https?:\/\//i.test(chart.play_video_url)
            ? chart.play_video_url
            : null;
    return (
        <div className="nl-music-entity">
            <div className="nl-music-entity__identity">
                <MusicJacket
                    index={music.index}
                    title={music.title}
                    background={music.background}
                    appearance="foundation"
                >
                    <span className="nl-jacket__category nl-metadata" lang="en">
                        {music.category_short}
                    </span>
                </MusicJacket>
                <div ref={identity} className="nl-music-entity__copy">
                    <div className="nl-music-entity__title-group">
                        <h1
                            className="nl-page-title"
                            data-fit="page"
                            tabIndex={-1}
                        >
                            {music.title}
                        </h1>
                        {music.localizedTitle ? (
                            <Popover.Root open={open} onOpenChange={setOpen}>
                                <Popover.Trigger asChild>
                                    <button
                                        type="button"
                                        className="nl-icon-button"
                                        aria-label={t("detail.translation")}
                                        onMouseEnter={() => setOpen(true)}
                                        onFocus={(event) => {
                                            if (
                                                event.currentTarget.matches(
                                                    ":focus-visible"
                                                )
                                            )
                                                setOpen(true);
                                        }}
                                        onBlur={() => setOpen(false)}
                                    >
                                        <Languages
                                            className="nl-icon"
                                            aria-hidden
                                        />
                                    </button>
                                </Popover.Trigger>
                                <Popover.Portal>
                                    <div className="noslog-ui">
                                        <Popover.Content
                                            className="nl-translation-popover"
                                            sideOffset={8}
                                            collisionPadding={16}
                                            onOpenAutoFocus={(event) =>
                                                event.preventDefault()
                                            }
                                            onCloseAutoFocus={(event) =>
                                                event.preventDefault()
                                            }
                                            onMouseLeave={() => setOpen(false)}
                                            aria-label={t("detail.translation")}
                                        >
                                            <p className="nl-metadata nl-muted">
                                                {locale === "ja"
                                                    ? t("detail.reading")
                                                    : t("detail.translation")}
                                            </p>
                                            <p className="nl-body">
                                                {music.localizedTitle}
                                            </p>
                                        </Popover.Content>
                                    </div>
                                </Popover.Portal>
                            </Popover.Root>
                        ) : null}
                    </div>
                    <p className="nl-body-secondary nl-muted">
                        {music.artist || t("music.unknownArtist")}
                    </p>
                </div>
            </div>
            <div className="nl-music-entity__actions">
                {chart?.has_published_pattern && !pending ? (
                    <Link
                        href={href(
                            `/music/${music.index}/${difficulty.toLowerCase()}/pattern`
                        )}
                        className={foundationButtonClass({
                            variant: "secondary",
                        })}
                    >
                        {t("detail.viewChart")}
                    </Link>
                ) : (
                    <ActionButton variant="secondary" disabled>
                        {t("detail.viewChart")}
                    </ActionButton>
                )}
                {video && !pending ? (
                    <a
                        href={video}
                        className={foundationButtonClass({
                            variant: "secondary",
                        })}
                    >
                        {t("detail.playVideo")}
                    </a>
                ) : (
                    <ActionButton variant="secondary" disabled>
                        {t("detail.playVideo")}
                    </ActionButton>
                )}
            </div>
        </div>
    );
}
