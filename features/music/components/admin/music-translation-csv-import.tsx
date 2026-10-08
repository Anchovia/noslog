"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileCheck2, Upload } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import {
    importMusicTranslationsCsv,
    validateMusicTranslationsCsv,
} from "@/app/admin/music/actions";
import { AdminFieldError } from "@/components/admin/admin-form";
import {
    type MusicTranslationCsvFormValues,
    musicTranslationCsvTextSchema,
} from "@/features/music/schemas/music-translation-admin-schema";
import type { MusicTranslationCsvPreview } from "@/features/music/types/music-admin";
import { applyFormActionFailure, applyFormRootError } from "@/lib/forms/errors";

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
                applyFormActionFailure(setError, result);
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
            applyFormRootError(setError, errorMessage);
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
                applyFormActionFailure(setError, result, toast.error);
                setValidationErrors(result.fieldErrors?.csv ?? []);
                return;
            }

            setPreview(null);
            toast.success(result.message);
        } catch {
            const errorMessage = "악곡 번역 CSV를 반영하지 못했습니다.";
            applyFormRootError(setError, errorMessage);
            setMessage(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsApplying(false);
        }
    }

    return (
        <section className="flex flex-col gap-3 rounded-card bg-surface p-4">
            <div>
                <h2 className="text-section">악곡 번역 CSV</h2>
                <p className="mt-1 text-caption">
                    Music.index 기준 · locale은 ko/en · approved만 사용자에게
                    표시됩니다.
                </p>
            </div>
            <div className="flex gap-2">
                <label className="flex h-10 cursor-pointer items-center gap-2 rounded-card border border-border px-3 text-sm font-semibold hover:bg-surface-muted">
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
                    className="flex h-10 items-center rounded-card border border-border px-3 text-sm font-semibold hover:bg-surface-muted"
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
                    className="w-full resize-y rounded-card border border-border bg-bg px-3 py-2 font-mono text-input text-xs"
                    {...csvField}
                    onChange={(event) => {
                        void csvField.onChange(event);
                        setPreview(null);
                        setValidationErrors([]);
                        setMessage("");
                    }}
                />
                <AdminFieldError
                    message={
                        validationErrors.length === 0
                            ? errors.csv?.message
                            : undefined
                    }
                    className="text-xs text-danger"
                />
                <button
                    type="submit"
                    disabled={isSubmitting || isApplying || !csv.trim()}
                    className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-card border border-border text-sm font-bold hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <FileCheck2 className="size-4" aria-hidden />
                    {isSubmitting ? "검증 중" : "CSV 검증"}
                </button>
            </form>
            {validationErrors.length > 0 ? (
                <ul
                    className="max-h-32 list-disc overflow-y-auto pl-5 text-xs text-danger"
                    role="alert"
                >
                    {validationErrors.map((error, index) => (
                        <li key={index + ":" + error}>{error}</li>
                    ))}
                </ul>
            ) : null}
            {preview ? (
                <div className="flex flex-col gap-2">
                    <div className="overflow-x-auto rounded-md border border-border">
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
                                        className="border-t border-divider"
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
                        className="h-10 cursor-pointer rounded-card bg-text-primary text-sm font-bold text-bg disabled:cursor-not-allowed disabled:opacity-50"
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
