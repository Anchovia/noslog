"use client";

import { usePathname } from "next/navigation";
import {
    type FocusEvent,
    type ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";

import { readTokenPixels } from "@/lib/design-tokens";

const DESKTOP_MEDIA_QUERY = "(min-width: 1056px)";
const TOP_SCROLL_THRESHOLD = 8;
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
    const headerRef = useRef<HTMLElement>(null);
    const previousScrollYRef = useRef(0);
    const animationFrameRef = useRef<number | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [hasFocusWithin, setHasFocusWithin] = useState(false);

    useEffect(() => {
        const desktopMedia = window.matchMedia(DESKTOP_MEDIA_QUERY);
        // 헤더 높이만큼 내려간 뒤부터 숨긴다
        const hideThreshold = readTokenPixels(
            headerRef.current!,
            "--nl-header-height"
        );

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
                    currentScrollY >= hideThreshold &&
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
            ref={headerRef}
            data-scroll-state={isVisible ? "visible" : "hidden"}
            onFocusCapture={handleFocus}
            onBlurCapture={handleBlur}
            className={`sticky top-0 z-nl-header flex h-nl-header items-center border-b-nl-stroke border-nl-divider bg-nl-canvas px-nl-16 transition-transform duration-nl-move ease-nl-enter motion-reduce:transition-none min-[672px]:px-nl-24 min-[1056px]:translate-y-0 ${
                isVisible ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            {children}
        </header>
    );
}
