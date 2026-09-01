"use client";

import { FileCheck2, Upload } from "lucide-react";
import { useState, useTransition, type ChangeEvent } from "react";

import {
    importMusicTranslationsCsv,
    validateMusicTranslationsCsv,
} from "@/app/admin/music/actions";

const templateCsv =
    "index,locale,title,status\n59d7b7a3714e108fd09e98971aa90161,ko,알테일,draft\n59d7b7a3714e108fd09e98971aa90161,en,Altale,approved\n";

type PreviewResult = Awaited<ReturnType<typeof validateMusicTranslationsCsv>>;

export default function MusicTranslationCsvImport() {
    const [csv, setCsv] = useState("");
    const [preview, setPreview] = useState<PreviewResult | null>(null);
    const [message, setMessage] = useState("");
    const [isPending, startTransition] = useTransition();

    async function loadFile(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        setCsv(await file.text());
        setPreview(null);
        setMessage("");
    }

    function validate() {
        startTransition(async () => {
            const result = await validateMusicTranslationsCsv(csv);
            setPreview(result);
            setMessage(result.message);
        });
    }

    function apply() {
        startTransition(async () => {
            const result = await importMusicTranslationsCsv(csv);
            setMessage(result.message);
            if (result.success) setPreview(null);
        });
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
                    href={`data:text/csv;charset=utf-8,${encodeURIComponent(templateCsv)}`}
                    download="noslog-music-translations.csv"
                    className="border-border hover:bg-surface-muted rounded-card flex h-10 items-center border px-3 text-sm font-semibold"
                >
                    템플릿
                </a>
            </div>
            <textarea
                value={csv}
                onChange={(event) => {
                    setCsv(event.target.value);
                    setPreview(null);
                }}
                rows={6}
                placeholder="index,locale,title,status"
                className="border-border bg-bg text-input rounded-card w-full resize-y border px-3 py-2 font-mono text-xs"
            />
            <button
                type="button"
                disabled={isPending || !csv.trim()}
                onClick={validate}
                className="border-border hover:bg-surface-muted rounded-card flex h-10 items-center justify-center gap-2 border text-sm font-bold disabled:opacity-50"
            >
                <FileCheck2 className="size-4" aria-hidden />
                {isPending ? "검증 중" : "CSV 검증"}
            </button>
            {preview ? (
                <div className="flex flex-col gap-2">
                    {preview.errors.length > 0 ? (
                        <ul className="text-danger max-h-32 list-disc overflow-y-auto pl-5 text-xs">
                            {preview.errors.map((error) => (
                                <li key={error}>{error}</li>
                            ))}
                        </ul>
                    ) : (
                        <>
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
                                                key={`${row.index}:${row.locale}`}
                                                className="border-divider border-t"
                                            >
                                                <td className="max-w-36 truncate p-2 font-mono">
                                                    {row.index}
                                                </td>
                                                <td className="max-w-36 truncate p-2">
                                                    {row.originalTitle}
                                                </td>
                                                <td className="p-2">
                                                    {row.locale}
                                                </td>
                                                <td className="max-w-48 truncate p-2">
                                                    {row.title}
                                                </td>
                                                <td className="p-2">
                                                    {row.status}
                                                </td>
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
                                disabled={isPending}
                                onClick={apply}
                                className="bg-text-primary text-bg rounded-card h-10 text-sm font-bold disabled:opacity-50"
                            >
                                {isPending
                                    ? "반영 중"
                                    : `${preview.totalCount}개 반영`}
                            </button>
                        </>
                    )}
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
