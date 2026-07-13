"use client";

import { useRef } from "react";

import { moveTierEntry } from "@/app/admin/tiers/actions";

export default function TierBandSelect({
    entryId,
    currentBandId,
    title,
    bands,
}: {
    entryId: number;
    currentBandId: number;
    title: string;
    bands: { id: number; value: number }[];
}) {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <form ref={formRef} action={moveTierEntry} className="shrink-0">
            <input type="hidden" name="id" value={entryId} />
            <select
                name="tierBandId"
                defaultValue={currentBandId}
                aria-label={`${title} 상수 구간`}
                onChange={() => formRef.current?.requestSubmit()}
                className="border-border bg-bg h-9 w-18 cursor-pointer rounded-md border px-2 text-xs font-bold tabular-nums"
            >
                {bands.map((band) => (
                    <option key={band.id} value={band.id}>
                        {band.value.toFixed(2)}
                    </option>
                ))}
            </select>
        </form>
    );
}
