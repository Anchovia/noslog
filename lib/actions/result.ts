export type ActionFieldErrors<TFieldName extends string = string> = Partial<
    Record<TFieldName, string[]>
>;

export type ActionSuccess<TData extends object = Record<never, never>> = {
    success: true;
    message: string;
} & TData;

export type ActionFailure<TFieldName extends string = string> = {
    success: false;
    message: string;
    fieldErrors?: ActionFieldErrors<TFieldName>;
};

export type ActionResult<
    TData extends object = Record<never, never>,
    TFieldName extends string = string,
> = ActionSuccess<TData> | ActionFailure<TFieldName>;
