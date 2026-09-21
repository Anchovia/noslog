import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";

import type { ActionFailure, ActionFieldErrors } from "@/lib/actions/result";

type FormFieldName<TFieldValues extends FieldValues> = FieldPath<TFieldValues>;

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

        setError(field, {
            type: "server",
            message,
        });
    }
}

export function applyFormActionFailure<TFieldValues extends FieldValues>(
    setError: UseFormSetError<TFieldValues>,
    failure: ActionFailure<FormFieldName<TFieldValues>>,
    notify: (message: string) => unknown
) {
    applyFormFieldErrors(setError, failure.fieldErrors);
    setError("root.server", {
        type: "server",
        message: failure.message,
    });
    notify(failure.message);
}
