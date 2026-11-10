"use client";

export default function useImageShare(
    payload: { files: File[]; title: string; text: string; url: string } | null
) {
    const canCopy =
        typeof navigator !== "undefined" &&
        typeof navigator.clipboard?.write === "function" &&
        typeof ClipboardItem !== "undefined" &&
        (typeof ClipboardItem.supports !== "function" ||
            ClipboardItem.supports("image/png"));
    const canShare =
        payload !== null &&
        typeof navigator.share === "function" &&
        Boolean(navigator.canShare?.(payload));

    function download(url: string, fileName: string) {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = fileName;
        anchor.click();
    }
    async function copy(png: () => Blob | null | Promise<Blob | null>) {
        try {
            const blob = await png();
            if (!blob) throw new Error("png");
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
            ]);
            return "copied" as const;
        } catch {
            return "error" as const;
        }
    }
    async function share(onStart: () => void) {
        if (!payload) return null;
        if (canShare) {
            onStart();
            try {
                await navigator.share(payload);
                return "idle" as const;
            } catch (error) {
                return error instanceof Error && error.name === "AbortError"
                    ? ("idle" as const)
                    : ("error" as const);
            }
        } else {
            const intent = new URL("https://x.com/intent/post");
            intent.searchParams.set("text", `${payload.text}\n${payload.url}`);
            window.open(intent.href, "_blank", "noopener,noreferrer");
            return null;
        }
    }

    return { canCopy, canShare, download, copy, share };
}
