"use client";

import { X } from "lucide-react";
import Image from "next/image";

import { useLocale } from "@/components/i18n/locale-provider";
import IconButton from "@/components/ui/icon-button";
import useObjectUrl from "@/lib/hooks/use-object-url";

/**
 * 붙인 파일 한 줄(2026-09-18 A2 · Carbon 파일 목록 모양) — 썸네일(줄 높이 − 8) · 이름 · 크기 · 지우기 ×.
 * 첨부 버튼(보조 L)과 높이가 같아 붙여도 자리가 튀지 않는다. 피드백 · 오락실 제보 창이 함께 쓴다.
 * 미리보기는 브라우저 안 임시 주소 — 파일이 바뀌거나 줄이 사라지면 풀어 준다
 */
export default function FileRow({
    file,
    removeLabel,
    onRemove,
    disabled = false,
}: {
    file: File;
    removeLabel: string;
    onRemove: () => void;
    disabled?: boolean;
}) {
    const locale = useLocale();
    const preview = useObjectUrl(file);
    return (
        <div className="nl-file-row">
            {preview ? (
                <Image
                    src={preview}
                    alt=""
                    width={36}
                    height={36}
                    unoptimized
                    className="nl-file-row__thumb"
                />
            ) : null}
            <span className="nl-file-row__name nl-body-secondary">
                {file.name}
            </span>
            <span className="nl-metadata nl-muted">
                {formatBytes(file.size, locale)}
            </span>
            <IconButton
                label={removeLabel}
                disabled={disabled}
                onClick={onRemove}
            >
                <X className="nl-icon" aria-hidden />
            </IconButton>
        </div>
    );
}

function formatBytes(bytes: number, locale: string) {
    const format = (value: number) =>
        value.toLocaleString(locale, { maximumFractionDigits: 1 });
    return bytes >= 1024 * 1024
        ? `${format(bytes / 1024 / 1024)}MB`
        : `${format(Math.max(1, Math.round(bytes / 1024)))}KB`;
}
