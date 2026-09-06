"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import { productDestinations } from "@/components/layout/destinations";

const destinationOrder = [
    "/music",
    "/music?scope=chart",
    "/tiers",
    "/rankings",
    "/bingo",
    "/exams",
    "/gamecenter",
    "/bookmarklet",
];

export default function HomeDestinations() {
    const t = useTranslations();
    const href = useLocalizedHref();
    const navigation = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = navigation.current;
        if (!element) return;
        let disposed = false;
        const fit = () => {
            if (disposed) return;
            for (const label of element.querySelectorAll<HTMLElement>(
                ".nl-home-tile__label"
            )) {
                label.dataset.fit = "control";
                if (label.scrollWidth <= label.clientWidth) continue;
                label.dataset.fit = "compact";
                if (label.scrollWidth > label.clientWidth)
                    label.dataset.fit = "wrap";
            }
        };
        const observer = new ResizeObserver(fit);
        observer.observe(element);
        void document.fonts.ready.then(fit);
        return () => {
            disposed = true;
            observer.disconnect();
        };
    }, [t]);

    return (
        <nav
            ref={navigation}
            className="nl-home-navigation"
            aria-label={t("home.destinations")}
        >
            <ul className="nl-home-destinations">
                {destinationOrder.map((destination) => {
                    const item = productDestinations.find(
                        (entry) => entry.href === destination
                    )!;
                    const Icon = item.icon;
                    const label = destination.includes("scope=chart")
                        ? t("home.tileCharts")
                        : destination === "/bookmarklet"
                          ? t("home.tileSync")
                          : t(item.labelKey);
                    return (
                        <li key={destination}>
                            <Link
                                href={href(destination)}
                                className="nl-home-tile nl-control"
                            >
                                <Icon className="nl-icon" aria-hidden />
                                <span className="nl-home-tile__label">
                                    {label}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
