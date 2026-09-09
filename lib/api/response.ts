export type ApiFieldErrors<TFieldName extends string = string> = Partial<
    Record<TFieldName, string[]>
>;

export type ApiSuccess<T> = {
    isSuccess: true;
    code: string;
    message: string;
    result: T;
};

export type ApiFailure<TFieldName extends string = string> = {
    isSuccess: false;
    code: string;
    message: string;
    result: null;
    fieldErrors?: ApiFieldErrors<TFieldName>;
};

export type ApiResponse<T, TFieldName extends string = string> =
    ApiSuccess<T> | ApiFailure<TFieldName>;

type ApiSuccessOptions = {
    code?: string;
    message?: string;
};

type ApiFailureOptions<TFieldName extends string> = {
    code: string;
    message: string;
    fieldErrors?: ApiFieldErrors<TFieldName>;
};

export function createApiSuccess<T>(
    result: T,
    options: ApiSuccessOptions = {}
): ApiSuccess<T> {
    return {
        isSuccess: true,
        code: options.code ?? "SUCCESS",
        message: options.message ?? "",
        result,
    };
}

export function createApiFailure<TFieldName extends string = string>({
    code,
    message,
    fieldErrors,
}: ApiFailureOptions<TFieldName>): ApiFailure<TFieldName> {
    return {
        isSuccess: false,
        code,
        message,
        result: null,
        ...(fieldErrors ? { fieldErrors } : {}),
    };
}

export class ApiError extends Error {
    readonly code: string;
    readonly status: number | undefined;

    constructor(message: string, code = "UNKNOWN", status?: number) {
        super(message);
        this.name = "ApiError";
        this.code = code;
        this.status = status;
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export function isApiResponse(value: unknown): value is ApiResponse<unknown> {
    if (
        !isRecord(value) ||
        typeof value.isSuccess !== "boolean" ||
        typeof value.code !== "string" ||
        typeof value.message !== "string" ||
        !("result" in value)
    ) {
        return false;
    }

    return value.isSuccess || value.result === null;
}

export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
    if (!response.isSuccess) {
        throw new ApiError(response.message, response.code);
    }

    return response.result;
}

export async function readApiResponse<T>(response: Response): Promise<T> {
    const payload: unknown = await response.json().catch(() => null);
    if (!isApiResponse(payload)) {
        throw new ApiError(
            "The server returned an invalid API response.",
            "INVALID_API_RESPONSE",
            response.status
        );
    }
    if (!response.ok && payload.isSuccess) {
        throw new ApiError(
            "The server returned an invalid API response.",
            "INVALID_API_RESPONSE",
            response.status
        );
    }

    try {
        return unwrapApiResponse(payload as ApiResponse<T>);
    } catch (error) {
        if (error instanceof ApiError) {
            throw new ApiError(error.message, error.code, response.status);
        }
        throw error;
    }
}
