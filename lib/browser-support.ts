export type ChartBrowserSupport = "checking" | "supported" | "safari";

export function isSafariUserAgent(userAgent: string) {
    return (
        /Safari/i.test(userAgent) &&
        !/(Chrome|Chromium|CriOS|Edg|EdgiOS|OPR|Opera|Android)/i.test(userAgent)
    );
}

export function subscribeBrowserSupport(onStoreChange: () => void) {
    const timeoutId = window.setTimeout(onStoreChange, 0);
    return () => window.clearTimeout(timeoutId);
}

export function getBrowserSupportSnapshot(): ChartBrowserSupport {
    return isSafariUserAgent(window.navigator.userAgent)
        ? "safari"
        : "supported";
}

export function getServerBrowserSupportSnapshot(): ChartBrowserSupport {
    return "checking";
}
