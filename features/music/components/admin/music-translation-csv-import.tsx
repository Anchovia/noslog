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
import { foundationButtonClass } from "@/components/ui/button";
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
        <section className="flex flex-col gap-nl-12 rounded-nl-container bg-nl-surface p-nl-16">
            <div>
                <h2 className="nl-component-title text-nl-content">
                    악곡 번역 CSV
                </h2>
                <p className="nl-metadata mt-nl-4 text-nl-subdued">
                    Music.index 기준 · locale은 ko/en · approved만 사용자에게
                    표시됩니다.
                </p>
            </div>
            <div className="flex gap-nl-8">
                <label
                    className={foundationButtonClass({ variant: "secondary" })}
                >
                    <Upload className="nl-icon-small" aria-hidden />
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
                    className={foundationButtonClass({ variant: "secondary" })}
                >
                    템플릿
                </a>
            </div>
            <form
                noValidate
                onSubmit={handleSubmit(validate)}
                className="flex flex-col gap-nl-12"
            >
                <textarea
                    rows={6}
                    placeholder="index,locale,title,status"
                    aria-invalid={Boolean(errors.csv)}
                    className="nl-input resize-y"
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
                    className="nl-metadata text-nl-error"
                />
                <button
                    type="submit"
                    disabled={isSubmitting || isApplying || !csv.trim()}
                    className={foundationButtonClass({ variant: "secondary" })}
                >
                    <FileCheck2 className="nl-icon-small" aria-hidden />
                    {isSubmitting ? "검증 중" : "CSV 검증"}
                </button>
            </form>
            {validationErrors.length > 0 ? (
                <ul
                    className="nl-admin-scroll-list--short nl-metadata list-disc overflow-y-auto pl-nl-24 text-nl-error"
                    role="alert"
                >
                    {validationErrors.map((error, index) => (
                        <li key={index + ":" + error}>{error}</li>
                    ))}
                </ul>
            ) : null}
            {preview ? (
                <div className="flex flex-col gap-nl-8">
                    <div className="overflow-x-auto rounded-nl-field border-nl-stroke border-nl-border">
                        <table className="nl-admin-table-wide nl-metadata w-full text-left">
                            <thead className="bg-nl-raised">
                                <tr>
                                    <th className="p-nl-8">index</th>
                                    <th className="p-nl-8">원제</th>
                                    <th className="p-nl-8">언어</th>
                                    <th className="p-nl-8">번역</th>
                                    <th className="p-nl-8">상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {preview.previews.map((row) => (
                                    <tr
                                        key={row.index + ":" + row.locale}
                                        className="border-t-nl-stroke border-nl-divider"
                                    >
                                        <td className="nl-admin-cell-short truncate p-nl-8 font-nl-mono">
                                            {row.index}
                                        </td>
                                        <td className="nl-admin-cell-short truncate p-nl-8">
                                            {row.originalTitle}
                                        </td>
                                        <td className="p-nl-8">{row.locale}</td>
                                        <td className="nl-admin-cell truncate p-nl-8">
                                            {row.title}
                                        </td>
                                        <td className="p-nl-8">{row.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {preview.totalCount > preview.previews.length ? (
                        <p className="nl-metadata text-nl-subdued">
                            앞 {preview.previews.length}개만 미리봅니다.
                        </p>
                    ) : null}
                    <button
                        type="button"
                        disabled={isApplying || isSubmitting}
                        onClick={apply}
                        className={foundationButtonClass()}
                    >
                        {isApplying
                            ? "반영 중"
                            : preview.totalCount + "개 반영"}
                    </button>
                </div>
            ) : null}
            {message ? (
                <p className="nl-metadata text-nl-subdued" role="status">
                    {message}
                </p>
            ) : null}
        </section>
    );
}
