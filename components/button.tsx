"use client";

import { useFormStatus } from "react-dom";

interface FormButtonProps {
    text: string;
}

export default function Button({ text }: FormButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            disabled={pending}
            className="bg-dark-tertiary px-4 py-2 text-center rounded-xl disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
        >
            {pending ? "로딩 중" : text}
        </button>
    );
}
