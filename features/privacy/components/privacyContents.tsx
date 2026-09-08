"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function PrivacyContents({
    title,
    sections,
}: {
    title: string;
    sections: { id: string; title: string }[];
}) {
    const [active, setActive] = useState(`privacy-${sections[0]?.id ?? ""}`);
    const disclosure = useRef<HTMLDetailsElement>(null);
    const anchor = useRef<{ id: string; scrollY: number } | null>(null);

    function selectTarget(id: string) {
        const target = document.getElementById(id);
        if (!target) return;
        if (disclosure.current) disclosure.current.open = false;
        setActive(id);
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: "start", behavior: "instant" });
        anchor.current = { id, scrollY: window.scrollY };
    }

    useEffect(() => {
        const targets = sections
            .map(({ id }) => document.getElementById(`privacy-${id}`))
            .filter((node): node is HTMLElement => !!node);
        let frame = 0;
        let navigationFrame = 0;
        function update() {
            if (anchor.current?.scrollY === window.scrollY) return;
            anchor.current = null;
            const readingTop = targets[0]
                ? parseFloat(getComputedStyle(targets[0]).scrollMarginTop) + 1
                : 0;
            const current =
                targets.findLast(
                    (target) => target.getBoundingClientRect().top <= readingTop
                ) ?? targets[0];
            if (current) setActive(current.id);
        }
        function onScroll() {
            if (navigationFrame) return;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(update);
        }
        function onHistory() {
            cancelAnimationFrame(frame);
            cancelAnimationFrame(navigationFrame);
            navigationFrame = requestAnimationFrame(() => {
                navigationFrame = 0;
                const id = window.location.hash.slice(1);
                if (targets.some((target) => target.id === id))
                    selectTarget(id);
                else {
                    anchor.current = null;
                    update();
                }
            });
        }
        onHistory();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        window.addEventListener("hashchange", onHistory);
        window.addEventListener("popstate", onHistory);
        return () => {
            cancelAnimationFrame(frame);
            cancelAnimationFrame(navigationFrame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            window.removeEventListener("hashchange", onHistory);
            window.removeEventListener("popstate", onHistory);
        };
    }, [sections]);

    function navigate(id: string) {
        const targetId = `privacy-${id}`;
        if (window.location.hash !== `#${targetId}`)
            window.history.pushState(null, "", `#${targetId}`);
        selectTarget(targetId);
    }
    const links = sections.map((section) => (
        <li key={section.id}>
            <a
                href={`#privacy-${section.id}`}
                aria-current={
                    active === `privacy-${section.id}` ? "location" : undefined
                }
                onClick={(event) => {
                    if (
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey
                    )
                        return;
                    event.preventDefault();
                    navigate(section.id);
                }}
            >
                {section.title}
            </a>
        </li>
    ));
    return (
        <div className="nl-privacy-contents">
            <details ref={disclosure} className="nl-privacy-contents__compact">
                <summary className="nl-component-title">
                    {title}
                    <ChevronDown className="nl-icon" aria-hidden />
                </summary>
                <nav aria-label={title}>
                    <ol>{links}</ol>
                </nav>
            </details>
            <nav className="nl-privacy-contents__wide" aria-label={title}>
                <p className="nl-component-title">{title}</p>
                <ol>{links}</ol>
            </nav>
        </div>
    );
}
