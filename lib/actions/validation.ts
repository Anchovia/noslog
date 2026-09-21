import type { ZodError } from "zod";

import type { ActionFailure, ActionFieldErrors } from "./result";

type FieldPath = "first" | "full";

type ValidationMessageContext<TFieldName extends string> = {
    fieldErrors: ActionFieldErrors<TFieldName>;
    firstIssueMessage: string | undefined;
};

type ValidationFailureOptions<TFieldName extends string> = {
    message: string;
    preferFirstIssue?: boolean;
    resolveMessage?: (context: ValidationMessageContext<TFieldName>) => string;
    messageFields?: readonly TFieldName[];
    fieldPath?: FieldPath | false;
    omitFields?: readonly string[];
    pickFields?: readonly TFieldName[];
    alwaysIncludeFieldErrors?: boolean;
};

function issueFieldName(path: readonly PropertyKey[], fieldPath: FieldPath) {
    const parts = fieldPath === "first" ? path.slice(0, 1) : path;
    if (
        parts.length === 0 ||
        parts.some(
            (part) => typeof part !== "string" && typeof part !== "number"
        )
    ) {
        return null;
    }
    return parts.join(".");
}

export function actionFieldErrorsFromZod<TFieldName extends string = string>(
    error: ZodError,
    options: {
        fieldPath?: FieldPath;
        omitFields?: readonly string[];
        pickFields?: readonly TFieldName[];
    } = {}
): ActionFieldErrors<TFieldName> {
    const fieldPath = options.fieldPath ?? "first";
    const omitted = new Set(options.omitFields);
    const picked = options.pickFields
        ? new Set<string>(options.pickFields)
        : null;
    const fieldErrors: ActionFieldErrors<TFieldName> = {};

    for (const issue of error.issues) {
        const fieldName = issueFieldName(issue.path, fieldPath);
        const isOmitted = [...omitted].some(
            (field) => fieldName === field || fieldName?.startsWith(`${field}.`)
        );
        if (
            fieldName === null ||
            isOmitted ||
            (picked && !picked.has(fieldName))
        ) {
            continue;
        }
        const field = fieldName as TFieldName;
        (fieldErrors[field] ??= []).push(issue.message);
    }

    if (options.pickFields) {
        for (const field of options.pickFields) {
            if (!(field in fieldErrors)) fieldErrors[field] = undefined;
        }
    }

    return fieldErrors;
}

export function actionValidationFailure<TFieldName extends string = string>(
    error: ZodError,
    options: ValidationFailureOptions<TFieldName>
): ActionFailure<TFieldName> {
    const fieldErrors: ActionFieldErrors<TFieldName> =
        options.fieldPath === false
            ? {}
            : actionFieldErrorsFromZod<TFieldName>(error, {
                  fieldPath: options.fieldPath,
                  omitFields: options.omitFields,
                  pickFields: options.pickFields,
              });
    const firstIssueMessage = error.issues[0]?.message;
    const fieldMessage = options.messageFields
        ?.map((field) => fieldErrors[field]?.[0])
        .find((value): value is string => Boolean(value));
    const message = options.resolveMessage
        ? options.resolveMessage({ fieldErrors, firstIssueMessage })
        : fieldMessage
          ? fieldMessage
          : options.preferFirstIssue
            ? (firstIssueMessage ?? options.message)
            : options.message;
    const includeFieldErrors =
        options.fieldPath !== false &&
        (options.alwaysIncludeFieldErrors ||
            Object.keys(fieldErrors).length > 0);

    return {
        success: false,
        message,
        ...(includeFieldErrors ? { fieldErrors } : {}),
    };
}
