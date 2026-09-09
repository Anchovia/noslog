"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileCheck2, Upload } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import {
    importMusicTranslationsCsv,
    validateMusicTranslationsCsv,
} from "@/app/admin/music/actions";
import {
    musicTranslationCsvTextSchema,
    type MusicTranslationCsvFormValues,
} from "@/features/music/schemas/musicTranslationAdminSchema";
import type { MusicTranslationCsvPreview } from "@/features/music/types/musicAdmin";
import { applyFormFieldErrors } from "@/lib/forms/errors";

const templateCsv =
    "index,locale,title,status\n59d7b7a3714e108fd09e98971aa90161,ko,알테일,draft\n59d7b7a3714e108fd09e98971aa90161,en,Altale,approved\n";

interface Preview {
    previews: MusicTranslationCsvPreview[];
    totalCount: number;
}

export default function MusicTranslationCsvImport() {
    const [preview, setPreview] = useState<Preview | null>(null);
    const [message, setMessage] = useState("");
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isApplying, setIsApplying] = useState(false);
    const {
        clearErrors,
        control,
        formState: { errors, isSubmitting },
        getValues,
        handleSubmit,
        register,
        setError,
        setValue,
    } = useForm<MusicTranslationCsvFormValues>({
        resolver: zodResolver(musicTranslationCsvTextSchema),
        defaultValues: { csv: "" },
        shouldFocusError: false,
    });
    const csv = useWatch({ control, name: "csv" });
    const csvField = register("csv");

    async function loadFile(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setValue("csv", await file.text());
            clearErrors();
            setPreview(null);
            setValidationErrors([]);
            setMessage("");
        } catch {
            toast.error("CSV 파일을 읽지 못했습니다.");
        }
    }

    async function validate(values: MusicTranslationCsvFormValues) {
        clearErrors();
        setValidationErrors([]);

        try {
            const result = await validateMusicTranslationsCsv(values.csv);
            setMessage(result.message);
            if (!result.success) {
                applyFormFieldErrors(setError, result.fieldErrors);
                setError("root.server", {
                    type: "server",
                    message: result.message,
                });
                setValidationErrors(result.fieldErrors?.csv ?? []);
                setPreview(null);
                return;
            }

            setPreview({
                previews: result.previews,
                totalCount: result.totalCount,
            });
        } catch {
            const errorMessage = "CSV를 검증하지 못했습니다.";
            setError("root.server", {
                type: "server",
                message: errorMessage,
            });
            setMessage(errorMessage);
            setPreview(null);
        }
    }

    async function apply() {
        setIsApplying(true);
        clearErrors();
        setValidationErrors([]);

        try {
            const result = await importMusicTranslationsCsv(getValues("csv"));
            setMessage(result.message);
            if (!result.success) {
                applyFormFieldErrors(setError, result.fieldErrors);
                setError("root.server", {
                    type: "server",
                    message: result.message,
                });
                setValidationErrors(result.fieldErrors?.csv ?? []);
                toast.error(result.message);
                return;
            }

            setPreview(null);
            toast.success(result.message);
        } catch {
            const errorMessage = "악곡 번역 CSV를 반영하지 못했습니다.";
            setError("root.server", {
                type: "server",
                message: errorMessage,
            });
            setMessage(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsApplying(false);
        }
    }

    return (
        <section className="bg-surface rounded-card flex flex-col gap-3 p-4">
            <div>
                <h2 className="text-section">악곡 번역 CSV</h2>
                <p className="text-caption mt-1">
                    Music.index 기준 · locale은 ko/en · approved만 사용자에게
                    표시됩니다.
                </p>
            </div>
            <div className="flex gap-2">
                <label className="border-border hover:bg-surface-muted rounded-card flex h-10 cursor-pointer items-center gap-2 border px-3 text-sm font-semibold">
                    <Upload className="size-4" aria-hidden />
                    CSV 선택
                    <input
                        type="file"
                        accept=".csv,text/csv"
                        onChange={loadFile}
                        className="sr-only"
                    />
                </label>
                <a
                    href={
                        "data:text/csv;charset=utf-8," +
                        encodeURIComponent(templateCsv)
                    }
                    download="noslog-music-translations.csv"
                    className="border-border hover:bg-surface-muted rounded-card flex h-10 items-center border px-3 text-sm font-semibold"
                >
                    템플릿
                </a>
            </div>
            <form
                noValidate
                onSubmit={handleSubmit(validate)}
                className="flex flex-col gap-3"
            >
                <textarea
                    rows={6}
                    placeholder="index,locale,title,status"
                    aria-invalid={Boolean(errors.csv)}
                    className="border-border bg-bg text-input rounded-card w-full resize-y border px-3 py-2 font-mono text-xs"
                    {...csvField}
                    onChange={(event) => {
                        void csvField.onChange(event);
                        setPreview(null);
                        setValidationErrors([]);
                        setMessage("");
                    }}
                />
                {errors.csv?.message && validationErrors.length === 0 ? (
                    <p className="text-danger text-xs" role="alert">
                        {errors.csv.message}
                    </p>
                ) : null}
                <button
                    type="submit"
                    disabled={isSubmitting || isApplying || !csv.trim()}
                    className="border-border hover:bg-surface-muted rounded-card flex h-10 cursor-pointer items-center justify-center gap-2 border text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <FileCheck2 className="size-4" aria-hidden />
                    {isSubmitting ? "검증 중" : "CSV 검증"}
                </button>
            </form>
            {validationErrors.length > 0 ? (
                <ul
                    className="text-danger max-h-32 list-disc overflow-y-auto pl-5 text-xs"
                    role="alert"
                >
                    {validationErrors.map((error, index) => (
                        <li key={index + ":" + error}>{error}</li>
                    ))}
                </ul>
            ) : null}
            {preview ? (
                <div className="flex flex-col gap-2">
                    <div className="border-border overflow-x-auto rounded-md border">
                        <table className="w-full min-w-140 text-left text-xs">
                            <thead className="bg-surface-muted">
                                <tr>
                                    <th className="p-2">index</th>
                                    <th className="p-2">원제</th>
                                    <th className="p-2">언어</th>
                                    <th className="p-2">번역</th>
                                    <th className="p-2">상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {preview.previews.map((row) => (
                                    <tr
                                        key={row.index + ":" + row.locale}
                                        className="border-divider border-t"
                                    >
                                        <td className="max-w-36 truncate p-2 font-mono">
                                            {row.index}
                                        </td>
                                        <td className="max-w-36 truncate p-2">
                                            {row.originalTitle}
                                        </td>
                                        <td className="p-2">{row.locale}</td>
                                        <td className="max-w-48 truncate p-2">
                                            {row.title}
                                        </td>
                                        <td className="p-2">{row.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {preview.totalCount > preview.previews.length ? (
                        <p className="text-caption">
                            앞 {preview.previews.length}개만 미리봅니다.
                        </p>
                    ) : null}
                    <button
                        type="button"
                        disabled={isApplying || isSubmitting}
                        onClick={apply}
                        className="bg-text-primary text-bg rounded-card h-10 cursor-pointer text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isApplying
                            ? "반영 중"
                            : preview.totalCount + "개 반영"}
                    </button>
                </div>
            ) : null}
            {message ? (
                <p className="text-caption" role="status">
                    {message}
                </p>
            ) : null}
        </section>
    );
}
