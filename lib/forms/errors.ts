import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";

import type { ActionFailure, ActionFieldErrors } from "@/lib/actions/result";

type FormFieldName<TFieldValues extends FieldValues> = FieldPath<TFieldValues>;
type FormErrorNotifier = (message: string) => unknown;

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
    notify?: FormErrorNotifier
) {
    applyFormFieldErrors(setError, failure.fieldErrors);
    applyFormRootError(setError, failure.message, notify);
}

export function applyFormRootError<TFieldValues extends FieldValues>(
    setError: UseFormSetError<TFieldValues>,
    message: string,
    notify?: FormErrorNotifier
) {
    setError("root.server", {
        type: "server",
        message,
    });
    notify?.(message);
}
