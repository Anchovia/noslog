import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { ArcadeFormValues } from "@/features/arcades/schemas/arcadeSchema";
import { ARCADE_WEEKDAYS } from "@/lib/arcadeDetails";

const inputClass =
    "border-border bg-bg text-input h-10 min-w-0 rounded-md border px-3 outline-none focus:border-focus";

interface ArcadeBusinessHoursFieldsProps {
    formKey: string;
    register: UseFormRegister<ArcadeFormValues>;
    errors: FieldErrors<ArcadeFormValues>;
    legacyNote?: string;
}

function businessHoursErrorMessage(errors: FieldErrors<ArcadeFormValues>) {
    const hours = errors.businessHours;
    if (!hours) return undefined;
    if (typeof hours.message === "string") return hours.message;

    for (const { key } of ARCADE_WEEKDAYS) {
        const day = hours[key];
        if (typeof day?.enabled?.message === "string") {
            return day.enabled.message;
        }
        if (typeof day?.open?.message === "string") return day.open.message;
        if (typeof day?.close?.message === "string") return day.close.message;
    }

    return typeof hours.openEveryDay?.message === "string"
        ? hours.openEveryDay.message
        : undefined;
}

export default function ArcadeBusinessHoursFields({
    formKey,
    register,
    errors,
    legacyNote,
}: ArcadeBusinessHoursFieldsProps) {
    const errorMessage = businessHoursErrorMessage(errors);

    return (
        <fieldset className="border-border rounded-card grid gap-2 border p-3">
            <legend className="text-label px-1">영업시간</legend>
            <p className="text-caption">
                자정을 넘겨 영업하면 종료 시간을 다음 날 시간으로 입력합니다.
            </p>
            {ARCADE_WEEKDAYS.map(({ key, label }) => (
                <div
                    key={key}
                    className="grid grid-cols-[auto_1fr_1fr] items-center gap-2"
                >
                    <label className="text-label flex items-center gap-1.5">
                        <input
                            type="checkbox"
                            {...register(`businessHours.${key}.enabled`)}
                        />
                        {label}
                    </label>
                    <input
                        id={`${formKey}-${key}-open`}
                        type="time"
                        aria-label={`${label}요일 영업 시작`}
                        aria-invalid={Boolean(
                            errors.businessHours?.[key]?.open
                        )}
                        className={inputClass}
                        {...register(`businessHours.${key}.open`)}
                    />
                    <input
                        id={`${formKey}-${key}-close`}
                        type="time"
                        aria-label={`${label}요일 영업 종료`}
                        aria-invalid={Boolean(
                            errors.businessHours?.[key]?.close
                        )}
                        className={inputClass}
                        {...register(`businessHours.${key}.close`)}
                    />
                </div>
            ))}
            <label className="text-body-muted mt-1 flex items-center gap-2">
                <input
                    type="checkbox"
                    {...register("businessHours.openEveryDay")}
                />
                연중무휴
            </label>
            {legacyNote ? (
                <p className="text-caption whitespace-pre-wrap">
                    기존 입력: {legacyNote}
                </p>
            ) : null}
            {errorMessage ? (
                <p className="text-danger text-xs" role="alert">
                    {errorMessage}
                </p>
            ) : null}
        </fieldset>
    );
}
