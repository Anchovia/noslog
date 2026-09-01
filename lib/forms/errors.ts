import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import type { ActionFieldErrors } from "@/lib/actions/result";

type FormFieldName<TFieldValues extends FieldValues> = Extract<
    keyof TFieldValues,
    string
>;

export function applyFormFieldErrors<TFieldValues extends FieldValues>(
    setError: UseFormSetError<TFieldValues>,
    fieldErrors:
        ActionFieldErrors<FormFieldName<TFieldValues>> | null | undefined
) {
    if (!fieldErrors) return;

    for (const field of Object.keys(
        fieldErrors
    ) as FormFieldName<TFieldValues>[]) {
        const message = fieldErrors[field]?.[0];
        if (!message) continue;

        setError(field as unknown as Path<TFieldValues>, {
            type: "server",
            message,
        });
    }
}
