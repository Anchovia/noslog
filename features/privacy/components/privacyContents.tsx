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
    const [active, setActive] = useState<string | null>(null);
    const disclosure = useRef<HTMLDetailsElement>(null);
    useEffect(() => {
        const targets = sections
            .map(({ id }) => document.getElementById(`privacy-${id}`))
            .filter((node): node is HTMLElement => !!node);
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries)
                    if (entry.isIntersecting) setActive(entry.target.id);
            },
            { rootMargin: "-80px 0px -65% 0px" }
        );
        targets.forEach((target) => observer.observe(target));
        return () => observer.disconnect();
    }, [sections]);

    function navigate(id: string) {
        if (disclosure.current) disclosure.current.open = false;
        requestAnimationFrame(() => {
            const target = document.getElementById(`privacy-${id}`);
            target?.focus({ preventScroll: true });
            target?.scrollIntoView({ block: "start", behavior: "instant" });
        });
    }
    const links = sections.map((section) => (
        <li key={section.id}>
            <a
                href={`#privacy-${section.id}`}
                aria-current={
                    active === `privacy-${section.id}` ? "location" : undefined
                }
                onClick={() => navigate(section.id)}
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
