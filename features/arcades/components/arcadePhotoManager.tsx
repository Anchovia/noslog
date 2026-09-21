"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import {
    deleteArcadePhoto,
    requestArcadePhotoUpload,
    saveArcadePhoto,
    setArcadeMainPhoto,
} from "@/app/admin/arcades/actions";
import {
    AdminFieldError,
    adminCompactInputClass as inputClass,
    adminCompactPrimaryButtonClass as primaryButtonClass,
    adminSecondaryButtonClass as secondaryButtonClass,
} from "@/components/admin/adminForm";
import {
    ARCADE_PHOTO_ALT_MAX_LENGTH,
    ARCADE_PHOTO_MAX,
} from "@/features/arcades/schemas/arcadeSchema";
import { IMAGE_ACCEPT, imageFileValidationError } from "@/lib/imageUploadRules";
import useObjectUrl from "@/lib/hooks/useObjectUrl";
import { uploadGrantedImage } from "@/lib/uploads/clientImageUpload";

export interface ArcadeFormPhoto {
    id: number;
    url: string;
    alt: string;
}

/**
 * 공개 상세 맨 위 사진 관리 — 올리기·지우기·대표로. 오락실 저장 버튼과 따로 바로 저장한다.
 * 올릴 때 촬영자의 게시 권리와 공개 동의 확인이 필수다
 */
export default function ArcadePhotoManager({
    arcadeId,
    arcadeName,
    photos,
}: {
    arcadeId: number;
    arcadeName: string;
    photos: ArcadeFormPhoto[];
}) {
    const router = useRouter();
    const fileInput = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const preview = useObjectUrl(file);
    const [alt, setAlt] = useState("");
    const [capturedAt, setCapturedAt] = useState("");
    const [consent, setConsent] = useState(false);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [pending, startTransition] = useTransition();
    const busy = uploading || pending;

    function clearDraft() {
        setFile(null);
        setAlt("");
        setCapturedAt("");
        setConsent(false);
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
        setAlt(`${arcadeName} 매장 사진`);
    }

    async function upload() {
        if (!file) return;
        if (!alt.trim()) {
            setError("사진 설명을 입력해주세요.");
            return;
        }
        if (!consent) {
            setError("촬영자의 게시 권리와 공개 동의를 확인해주세요.");
            return;
        }
        setError("");
        setUploading(true);
        try {
            const grant = await requestArcadePhotoUpload(arcadeId, file.type);
            if (!grant.success) {
                setError(grant.message);
                return;
            }
            const imageUrl = await uploadGrantedImage(file, grant, "public");
            const formData = new FormData();
            formData.set("arcadeId", String(arcadeId));
            formData.set("url", imageUrl);
            formData.set("alt", alt);
            formData.set("capturedAt", capturedAt);
            formData.set("consent", String(consent));
            const result = await saveArcadePhoto(formData);
            if (!result.success) {
                setError(result.message);
                return;
            }
            toast.success(result.message);
            clearDraft();
            router.refresh();
        } catch {
            setError("사진을 올리지 못했습니다. 다시 시도해주세요.");
        } finally {
            setUploading(false);
        }
    }

    function change(
        action: typeof deleteArcadePhoto | typeof setArcadeMainPhoto,
        photoId: number
    ) {
        setError("");
        startTransition(async () => {
            const formData = new FormData();
            formData.set("photoId", String(photoId));
            const result = await action(formData);
            if (!result.success) {
                setError(result.message);
                return;
            }
            toast.success(result.message);
            router.refresh();
        });
    }

    return (
        <fieldset className="border-border rounded-card grid gap-2 border p-3">
            <legend className="text-label px-1">사진</legend>
            <p className="text-caption">
                공개 상세 맨 위에 보입니다. 첫 번째 사진이 대표 사진이며{" "}
                {ARCADE_PHOTO_MAX}장까지 올릴 수 있습니다. 사진 추가·삭제는 바로
                반영됩니다.
            </p>
            {photos.map((photo, index) => (
                <div key={photo.id} className="flex items-center gap-2">
                    <div className="bg-surface-muted relative size-16 shrink-0 overflow-hidden rounded-md">
                        <Image
                            src={photo.url}
                            alt={photo.alt}
                            fill
                            sizes="64px"
                            className="object-cover"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-body truncate">{photo.alt}</p>
                        <p className="text-caption">
                            {index === 0 ? "대표 사진" : `${index + 1}번째`}
                        </p>
                    </div>
                    {index > 0 ? (
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => change(setArcadeMainPhoto, photo.id)}
                            className={secondaryButtonClass}
                        >
                            대표로
                        </button>
                    ) : null}
                    <button
                        type="button"
                        aria-label={`${index + 1}번째 사진 삭제`}
                        disabled={busy}
                        onClick={() => {
                            if (
                                window.confirm(
                                    "이 사진을 지울까요? 되돌릴 수 없습니다."
                                )
                            )
                                change(deleteArcadePhoto, photo.id);
                        }}
                        className="text-body-muted hover:text-danger focus-visible:ring-focus/40 flex size-9 shrink-0 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
                    >
                        <Trash2 className="size-4" aria-hidden />
                    </button>
                </div>
            ))}
            {photos.length === 0 ? (
                <p className="text-caption">등록된 사진이 없습니다.</p>
            ) : null}
            <input
                ref={fileInput}
                type="file"
                hidden
                accept={IMAGE_ACCEPT}
                aria-label="오락실 사진 파일"
                onChange={(event) => choose(event.target.files?.[0])}
            />
            {file && preview ? (
                <div className="border-border grid gap-2 rounded-md border p-2">
                    <div className="bg-surface-muted relative aspect-video overflow-hidden rounded-md">
                        <Image
                            src={preview}
                            alt=""
                            fill
                            unoptimized
                            sizes="400px"
                            className="object-cover"
                        />
                    </div>
                    <label className="text-caption flex flex-col gap-1">
                        사진 설명 (화면 읽기용)
                        <input
                            value={alt}
                            maxLength={ARCADE_PHOTO_ALT_MAX_LENGTH}
                            onChange={(event) => setAlt(event.target.value)}
                            // 사진 칸은 오락실 저장 폼 안에 있다 — Enter 가 오락실 저장을 누르지 않게
                            onKeyDown={(event) => {
                                if (event.key === "Enter")
                                    event.preventDefault();
                            }}
                            className={inputClass}
                        />
                    </label>
                    <label className="text-caption flex flex-col gap-1">
                        촬영 날짜 (선택)
                        <input
                            type="date"
                            value={capturedAt}
                            onChange={(event) =>
                                setCapturedAt(event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>
                    <label className="text-body-muted flex items-start gap-2">
                        <input
                            type="checkbox"
                            className="mt-1"
                            checked={consent}
                            onChange={(event) =>
                                setConsent(event.target.checked)
                            }
                        />
                        촬영자에게 게시 권리와 공개 동의를 받았습니다
                    </label>
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
            ) : photos.length < ARCADE_PHOTO_MAX ? (
                <button
                    type="button"
                    disabled={busy}
                    onClick={() => fileInput.current?.click()}
                    className={secondaryButtonClass}
                >
                    <ImagePlus className="size-4" aria-hidden /> 사진 추가
                </button>
            ) : null}
            <AdminFieldError message={error} className="text-danger text-xs" />
        </fieldset>
    );
}
