import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

interface FormFieldProps {
    /** 자식 입력 id와 일치해야 한다. 설명 id는 -help/-error/-success 접미사를 쓴다. */
    id: string;
    /** 보이는 라벨. 실제 입력 값과 ref는 children의 입력이 소유한다. */
    label: ReactNode;
    /** 오류/성공과 별도로 남는 설명. 호출부가 aria-describedby에 연결한다. */
    help?: ReactNode;
    /** success보다 우선하며 role=alert로 알린다. 입력 aria-invalid는 호출부 책임이다. */
    error?: ReactNode;
    /** 확인이 끝나 문제가 없다는 한 줄(예: 쓸 수 있는 닉네임) — 오류와 같은 자리, 성공 표시색 */
    success?: ReactNode;
    children: ReactNode;
    className?: string;
}

export function FormField({
    id,
    label,
    help,
    error,
    success,
    children,
    className,
}: FormFieldProps) {
    return (
        <div className={cn("nl-field", className)}>
            <label htmlFor={id} className="nl-field__label">
                {label}
            </label>
            {children}
            {help ? (
                <p id={`${id}-help`} className="nl-field__help">
                    {help}
                </p>
            ) : null}
            {error ? (
                <p
                    id={`${id}-error`}
                    className="nl-field__help nl-field__error"
                    role="alert"
                >
                    {error}
                </p>
            ) : success ? (
                <p
                    id={`${id}-success`}
                    className="nl-field__help nl-field__success"
                    role="status"
                >
                    {success}
                </p>
            ) : null}
        </div>
    );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
    return <input className={cn("nl-input", className)} {...props} />;
}

export function TextArea({ className, ...props }: ComponentProps<"textarea">) {
    return <textarea className={cn("nl-input", className)} {...props} />;
}

export function fieldDescription(
    id: string,
    options: { help?: boolean; error?: boolean }
) {
    return (
        [options.help && `${id}-help`, options.error && `${id}-error`]
            .filter(Boolean)
            .join(" ") || undefined
    );
}
