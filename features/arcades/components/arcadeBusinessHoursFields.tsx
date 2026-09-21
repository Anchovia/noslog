import type { FieldErrors, UseFormRegister } from "react-hook-form";

import {
    AdminFieldError,
    adminCompactInputClass as inputClass,
} from "@/components/admin/adminForm";
import type { ArcadeFormValues } from "@/features/arcades/schemas/arcadeSchema";
import { ARCADE_WEEKDAYS } from "@/lib/arcadeDetails";

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

    return undefined;
}

// 영업시간은 확인 단계 없이 입력값 그대로 공개된다 — 틀리면 이용자 제보를 받아 고친다
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
                체크를 해제한 요일은 휴무로 표시됩니다. 자정을 넘겨 영업하면
                종료 시간을 다음 날 시간으로 입력합니다.
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
            {legacyNote ? (
                <p className="text-caption whitespace-pre-wrap">
                    기존 입력: {legacyNote}
                </p>
            ) : null}
            <AdminFieldError
                message={errorMessage}
                className="text-danger text-xs"
            />
        </fieldset>
    );
}
