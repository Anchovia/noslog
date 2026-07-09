"use client";

import { useFormStatus } from "react-dom";

interface FormButtonProps {
    text: string;
}

export default function FormButton({ text }: FormButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            disabled={pending}
            className="bg-dark-tertiary rounded-xl px-4 py-2 text-center disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-neutral-300"
        >
            {pending ? "로딩 중" : text}
        </button>
    );
}
