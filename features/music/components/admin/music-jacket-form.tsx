"use client";

/* eslint-disable @next/next/no-img-element */

import { ImageOff, ImagePlus, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import {
    requestMusicJacketUpload,
    resetMusicJacket,
    saveMusicJacket,
} from "@/app/admin/music/actions";
import { AdminCard, AdminCardHead } from "@/components/admin/admin-card";
import AdminDeleteDialog from "@/components/admin/admin-delete-dialog";
import AdminDrawer from "@/components/admin/admin-drawer";
import {
    AdminFieldError,
    adminSecondaryButtonClass as secondaryButtonClass,
} from "@/components/admin/admin-form";
import ActionButton from "@/components/ui/action-button";
import ActionMenu from "@/components/ui/action-menu";
import Button from "@/components/ui/button";
import useObjectUrl from "@/lib/hooks/use-object-url";
import {
    IMAGE_ACCEPT,
    imageFileValidationError,
} from "@/lib/image-upload-rules";
import {
    getJacketUrl,
    getLocalJacketUrl,
    isManualJacketUrl,
} from "@/lib/music/jackets";
import { uploadGrantedImage } from "@/lib/uploads/client-image-upload";

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
        <div className="flex size-nl-64 shrink-0 items-center justify-center overflow-hidden rounded-nl-control bg-nl-control">
            {src ? (
                <img src={src} alt="" className="size-full object-cover" />
            ) : (
                <ImageOff
                    className="nl-icon nl-icon--large text-nl-disabled"
                    aria-hidden
                />
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
    const preview = useObjectUrl(file);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [pending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    const busy = uploading || pending;
    const manual = isManualJacketUrl(background);

    function clearDraft() {
        setFile(null);
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
            const imageUrl = await uploadGrantedImage(file, grant, "public");
            const formData = new FormData();
            formData.set("musicIndex", musicIndex);
            formData.set("url", imageUrl);
            const result = await saveMusicJacket(formData);
            if (!result.success) {
                setError(result.message);
                return;
            }
            toast.success(result.message);
            clearDraft();
            setOpen(false);
            router.refresh();
        } catch {
            setError("자켓을 올리지 못했습니다. 다시 시도해주세요.");
        } finally {
            setUploading(false);
        }
    }

    function reset() {
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
            setOpen(false);
            router.refresh();
        });
    }

    function changeOpen(next: boolean) {
        if (!next) {
            clearDraft();
            setError("");
        }
        setOpen(next);
    }

    const source = jacketSource(musicIndex, background);
    const current = getJacketUrl(musicIndex, background);

    return (
        <AdminCard>
            <AdminCardHead
                title="자켓"
                level="h2"
                actions={
                    <ActionMenu
                        label="자켓 메뉴"
                        items={[
                            { label: "고치기", onSelect: () => setOpen(true) },
                        ]}
                    />
                }
            />
            <div className="nl-admin-card__body">
                <div className="flex items-center gap-nl-12">
                    <JacketBox src={current} />
                    <p className="nl-control min-w-0 flex-1 text-nl-content">
                        {source}
                    </p>
                </div>
            </div>
            <AdminDrawer
                open={open}
                onOpenChange={changeOpen}
                title="자켓 고치기"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => changeOpen(false)}
                        >
                            취소
                        </Button>
                        <ActionButton
                            disabled={!file || pending}
                            busy={uploading}
                            busyLabel="올리는 중"
                            onClick={() => void upload()}
                        >
                            올리기
                        </ActionButton>
                    </>
                }
            >
                <p className="nl-metadata text-nl-subdued">
                    직접 올린 자켓은 로컬 파일·수집한 자켓보다 먼저 보이고 바로
                    반영됩니다. 정사각 이미지를 올려주세요.
                </p>
                <div className="flex items-center gap-nl-12">
                    <JacketBox src={current} />
                    <div className="min-w-0 flex-1">
                        <p className="nl-metadata text-nl-subdued">현재 자켓</p>
                        <p className="nl-control text-nl-content">{source}</p>
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
                    <div className="flex items-center gap-nl-12">
                        <JacketBox src={preview} />
                        <p className="nl-metadata min-w-0 flex-1 break-all text-nl-subdued">
                            새 자켓 · {file.name}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-nl-8">
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => fileInput.current?.click()}
                            className={secondaryButtonClass}
                        >
                            <ImagePlus className="nl-icon-small" aria-hidden />{" "}
                            자켓 바꾸기
                        </button>
                        {manual ? (
                            <AdminDeleteDialog
                                title="자켓 되돌리기"
                                description="직접 올린 자켓을 지우고 기본 자켓으로 되돌립니다. 올린 파일은 삭제됩니다."
                                actionLabel="기본 자켓으로 되돌리기"
                                pending={busy}
                                onConfirm={reset}
                                trigger={
                                    <button
                                        type="button"
                                        disabled={busy}
                                        className={secondaryButtonClass}
                                    >
                                        <RotateCcw
                                            className="nl-icon-small"
                                            aria-hidden
                                        />{" "}
                                        기본 자켓으로 되돌리기
                                    </button>
                                }
                            />
                        ) : null}
                    </div>
                )}
                <AdminFieldError
                    message={error}
                    className="nl-metadata text-nl-error"
                />
            </AdminDrawer>
        </AdminCard>
    );
}
