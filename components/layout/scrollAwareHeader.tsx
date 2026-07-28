"use client";

import {
    type FocusEvent,
    type ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";
import { usePathname } from "next/navigation";

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const TOP_SCROLL_THRESHOLD = 8;
const HIDE_SCROLL_THRESHOLD = 56;
const DIRECTION_THRESHOLD = 4;

export default function ScrollAwareHeader({
    children,
}: {
    children: ReactNode;
}) {
    const pathname = usePathname();

    return (
        <ScrollAwareHeaderContent key={pathname}>
            {children}
        </ScrollAwareHeaderContent>
    );
}

function ScrollAwareHeaderContent({ children }: { children: ReactNode }) {
    const previousScrollYRef = useRef(0);
    const animationFrameRef = useRef<number | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [hasFocusWithin, setHasFocusWithin] = useState(false);

    useEffect(() => {
        const desktopMedia = window.matchMedia(DESKTOP_MEDIA_QUERY);

        function resetForViewport() {
            previousScrollYRef.current = window.scrollY;
            if (desktopMedia.matches) setIsVisible(true);
        }

        function handleScroll() {
            if (desktopMedia.matches || hasFocusWithin) {
                previousScrollYRef.current = window.scrollY;
                return;
            }
            if (animationFrameRef.current !== null) return;

            animationFrameRef.current = window.requestAnimationFrame(() => {
                const currentScrollY = Math.max(0, window.scrollY);
                const directionDelta =
                    currentScrollY - previousScrollYRef.current;

                if (currentScrollY <= TOP_SCROLL_THRESHOLD) {
                    setIsVisible(true);
                } else if (
                    currentScrollY >= HIDE_SCROLL_THRESHOLD &&
                    directionDelta > DIRECTION_THRESHOLD
                ) {
                    setIsVisible(false);
                } else if (directionDelta < -DIRECTION_THRESHOLD) {
                    setIsVisible(true);
                }

                previousScrollYRef.current = currentScrollY;
                animationFrameRef.current = null;
            });
        }

        resetForViewport();
        window.addEventListener("scroll", handleScroll, { passive: true });
        desktopMedia.addEventListener("change", resetForViewport);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            desktopMedia.removeEventListener("change", resetForViewport);
            if (animationFrameRef.current !== null) {
                window.cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [hasFocusWithin]);

    function handleBlur(event: FocusEvent<HTMLElement>) {
        if (
            event.relatedTarget instanceof Node &&
            event.currentTarget.contains(event.relatedTarget)
        ) {
            return;
        }
        setHasFocusWithin(false);
    }

    function handleFocus() {
        setHasFocusWithin(true);
        setIsVisible(true);
    }

    return (
        <header
            data-scroll-state={isVisible ? "visible" : "hidden"}
            onFocusCapture={handleFocus}
            onBlurCapture={handleBlur}
            className={`border-divider bg-surface sticky top-0 z-50 flex h-14 items-center border-b px-3 transition-transform duration-200 ease-out motion-reduce:transition-none min-[390px]:px-4 lg:translate-y-0 ${
                isVisible ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            {children}
        </header>
    );
}
