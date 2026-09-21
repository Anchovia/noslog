"use client";

/* eslint-disable @next/next/no-img-element */

import { put } from "@vercel/blob/client";
import { ImageOff, ImagePlus, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import {
    requestMusicJacketUpload,
    resetMusicJacket,
    saveMusicJacket,
} from "@/app/admin/music/actions";
import {
    AdminFieldError,
    adminCompactPrimaryButtonClass as primaryButtonClass,
    adminSecondaryButtonClass as secondaryButtonClass,
} from "@/components/admin/adminForm";
import {
    getJacketUrl,
    getLocalJacketUrl,
    isManualJacketUrl,
} from "@/lib/musicJackets";
import { IMAGE_ACCEPT, imageFileValidationError } from "@/lib/imageUploadRules";

// 지금 화면에 보이는 자켓이 어디서 왔는지 — 잘못된 자켓을 고칠 때 원인을 알 수 있게
function jacketSource(index: string, background: string | null) {
    if (isManualJacketUrl(background)) return "직접 올린 자켓";
    if (getLocalJacketUrl(index)) return "로컬 파일 (public/bg)";
    if (background?.includes(".public.blob.vercel-storage.com/jackets/"))
        return "공식 사이트에서 수집한 자켓";
    if (getJacketUrl(index, background)) return "저장된 주소";
    return "자켓 없음";
}

function JacketBox({ src }: { src: string | null }) {
    return (
        <div className="bg-surface-muted flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-md">
            {src ? (
                <img src={src} alt="" className="size-full object-cover" />
            ) : (
                <ImageOff className="text-text-disabled size-6" aria-hidden />
            )}
        </div>
    );
}

/** 악곡 자켓 교체 — 올린 자켓은 로컬 파일·수집한 자켓보다 먼저 보이고 바로 반영된다 */
export default function MusicJacketForm({
    musicIndex,
    background,
}: {
    musicIndex: string;
    background: string | null;
}) {
    const router = useRouter();
    const fileInput = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [pending, startTransition] = useTransition();
    const busy = uploading || pending;
    const manual = isManualJacketUrl(background);

    useEffect(
        () => () => {
            if (preview) URL.revokeObjectURL(preview);
        },
        [preview]
    );

    function clearDraft() {
        setFile(null);
        setPreview(null);
        if (fileInput.current) fileInput.current.value = "";
    }

    function choose(next: File | undefined) {
        setError("");
        if (!next) return;
        const validationError = imageFileValidationError(next);
        if (validationError === "type") {
            setError("JPG·PNG·WebP 이미지만 올릴 수 있습니다.");
            return;
        }
        if (validationError === "size") {
            setError("이미지는 4MB 이하로 올려주세요.");
            return;
        }
        setFile(next);
        setPreview(URL.createObjectURL(next));
    }

    async function upload() {
        if (!file) return;
        setError("");
        setUploading(true);
        try {
            const grant = await requestMusicJacketUpload(musicIndex, file.type);
            if (!grant.success) {
                setError(grant.message);
                return;
            }
            const blob = await put(grant.pathname, file, {
                access: "public",
                token: grant.token,
                contentType: file.type,
            });
            const formData = new FormData();
            formData.set("musicIndex", musicIndex);
            formData.set("url", blob.url);
            const result = await saveMusicJacket(formData);
            if (!result.success) {
                setError(result.message);
                return;
            }
            toast.success(result.message);
            clearDraft();
            router.refresh();
        } catch {
            setError("자켓을 올리지 못했습니다. 다시 시도해주세요.");
        } finally {
            setUploading(false);
        }
    }

    function reset() {
        if (
            !window.confirm(
                "직접 올린 자켓을 지우고 기본 자켓으로 되돌릴까요? 올린 파일은 삭제됩니다."
            )
        )
            return;
        setError("");
        startTransition(async () => {
            const formData = new FormData();
            formData.set("musicIndex", musicIndex);
            const result = await resetMusicJacket(formData);
            if (!result.success) {
                setError(result.message);
                return;
            }
            toast.success(result.message);
            router.refresh();
        });
    }

    return (
        <section className="bg-surface rounded-card flex flex-col gap-3 p-3">
            <div>
                <h2 className="text-section font-bold">자켓</h2>
                <p className="text-caption mt-1">
                    직접 올린 자켓은 로컬 파일·수집한 자켓보다 먼저 보이고 바로
                    반영됩니다. 정사각 이미지를 올려주세요.
                </p>
            </div>
            <div className="flex items-center gap-3">
                <JacketBox src={getJacketUrl(musicIndex, background)} />
                <div className="min-w-0 flex-1">
                    <p className="text-caption">현재 자켓</p>
                    <p className="text-body">
                        {jacketSource(musicIndex, background)}
                    </p>
                </div>
            </div>
            <input
                ref={fileInput}
                type="file"
                hidden
                accept={IMAGE_ACCEPT}
                aria-label="자켓 이미지 파일"
                onChange={(event) => choose(event.target.files?.[0])}
            />
            {file && preview ? (
                <div className="border-border grid gap-2 rounded-md border p-2">
                    <div className="flex items-center gap-3">
                        <JacketBox src={preview} />
                        <p className="text-caption min-w-0 flex-1 break-all">
                            새 자켓 · {file.name}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            disabled={busy}
                            onClick={clearDraft}
                            className={secondaryButtonClass}
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => void upload()}
                            className={primaryButtonClass}
                        >
                            {uploading ? "올리는 중" : "올리기"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => fileInput.current?.click()}
                        className={secondaryButtonClass}
                    >
                        <ImagePlus className="size-4" aria-hidden /> 자켓 바꾸기
                    </button>
                    {manual ? (
                        <button
                            type="button"
                            disabled={busy}
                            onClick={reset}
                            className={secondaryButtonClass}
                        >
                            <RotateCcw className="size-4" aria-hidden /> 기본
                            자켓으로 되돌리기
                        </button>
                    ) : null}
                </div>
            )}
            <AdminFieldError message={error} className="text-danger text-xs" />
        </section>
    );
}
