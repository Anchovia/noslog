import { ImageIcon } from "lucide-react";

export default function GuideMediaPlaceholder({ label }: { label: string }) {
    return (
        <div
            className="border-border bg-surface-muted text-text-disabled flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed"
            aria-label={`${label} GIF 자리`}
        >
            <ImageIcon className="size-5" aria-hidden />
            <span className="text-caption">예시 GIF 준비 중</span>
        </div>
    );
}
