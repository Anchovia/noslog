"use client";

import { Save } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function AdminSaveButton({ label }: { label: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-text-primary text-bg ml-auto flex h-10 items-center gap-1 rounded-md px-3 text-sm font-bold disabled:cursor-wait disabled:opacity-60"
        >
            <Save className="size-4" />
            {pending ? "저장 중..." : label}
        </button>
    );
}
