"use client";

import { ExternalLink } from "lucide-react";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";

const OFFICIAL_X_URL = "https://x.com/NOSTALGIA_573";
type XWidgetsWindow = Window & {
    twttr?: { widgets?: { load: (element?: HTMLElement) => Promise<unknown> } };
};
type TimelineState = "loading" | "ready" | "empty" | "error";

export default function OfficialXTimeline() {
    const locale = useLocale();
    const t = useTranslations();
    const timelineRef = useRef<HTMLDivElement>(null);
    const loadRequestedRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [state, setState] = useState<TimelineState>("loading");

    useEffect(() => {
        const container = timelineRef.current;
        if (!container) return;
        const resize = new ResizeObserver(() => {
            const frame = container.querySelector("iframe");
            if (frame && frame.getBoundingClientRect().height > 0) {
                setState("ready");
                if (timerRef.current) clearTimeout(timerRef.current);
            }
        });
        const mutation = new MutationObserver(() => {
            const frame = container.querySelector("iframe");
            if (frame) resize.observe(frame);
        });
        mutation.observe(container, { childList: true, subtree: true });
        return () => {
            mutation.disconnect();
            resize.disconnect();
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    async function loadTimeline() {
        const container = timelineRef.current;
        const widgets = (window as XWidgetsWindow).twttr?.widgets;
        if (!container || !widgets || loadRequestedRef.current) return;
        loadRequestedRef.current = true;
        const link = container.querySelector("a");
        if (link)
            link.dataset.theme =
                document.documentElement.dataset.theme === "light"
                    ? "light"
                    : "dark";
        timerRef.current = setTimeout(() => setState("error"), 8000);
        try {
            await widgets.load(container);
            if (!container.querySelector("iframe")) {
                setState("empty");
                if (timerRef.current) clearTimeout(timerRef.current);
            }
        } catch {
            setState("error");
            if (timerRef.current) clearTimeout(timerRef.current);
        }
    }

    return (
        <section className="nl-home-update">
            <div className="nl-home-update__heading">
                <h2 className="nl-component-title">{t("home.officialNews")}</h2>
                <a
                    href={OFFICIAL_X_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="nl-control"
                >
                    {t("home.officialLink")}
                    <ExternalLink aria-hidden />
                </a>
            </div>
            <div
                ref={timelineRef}
                className="nl-home-timeline"
                hidden={state === "empty" || state === "error"}
            >
                <a
                    className="twitter-timeline nl-body-secondary nl-muted"
                    data-lang={locale}
                    data-tweet-limit="1"
                    data-chrome="noheader nofooter noborders transparent"
                    data-dnt="true"
                    href={OFFICIAL_X_URL}
                >
                    {t("home.officialXFallback")}
                </a>
            </div>
            {state === "empty" || state === "error" ? (
                <p className="nl-home-news-state nl-body-secondary nl-muted">
                    {t(state === "empty" ? "home.newsEmpty" : "home.newsError")}
                </p>
            ) : null}
            <Script
                id="x-widgets"
                src="https://platform.twitter.com/widgets.js"
                strategy="lazyOnload"
                onReady={() => {
                    void loadTimeline();
                }}
                onError={() => setState("error")}
            />
        </section>
    );
}
