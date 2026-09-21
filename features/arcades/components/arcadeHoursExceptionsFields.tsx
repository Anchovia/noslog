"use client";

import { Plus, Trash2 } from "lucide-react";
import {
    useFieldArray,
    useWatch,
    type Control,
    type FieldErrors,
    type UseFormRegister,
} from "react-hook-form";

import {
    AdminFieldError,
    adminCompactInputClass as inputClass,
    adminSecondaryButtonClass as secondaryButtonClass,
} from "@/components/admin/adminForm";
import {
    ARCADE_HOURS_EXCEPTION_MAX,
    type ArcadeFormValues,
    type ArcadeValues,
} from "@/features/arcades/schemas/arcadeSchema";

// 새 예외 줄의 기본 날짜 — 서버·브라우저 시간대가 달라도 서울 기준 오늘(en-CA 는 YYYY-MM-DD)
function todayInSeoul() {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(
        new Date()
    );
}

/**
 * 날짜별 예외 — 임시 휴무·특별 영업시간처럼 그날만 요일 기본값과 다른 날.
 * 공개 상세의 7일 영업시간 표가 요일 기본값보다 먼저 쓴다(arcadeWeekHours)
 */
export default function ArcadeHoursExceptionsFields({
    control,
    register,
    errors,
}: {
    // 폼의 control 은 저장 형식(ArcadeValues)까지 싣는다 — 같은 제네릭으로 받아야 넘길 수 있다
    control: Control<ArcadeFormValues, unknown, ArcadeValues>;
    register: UseFormRegister<ArcadeFormValues>;
    errors: FieldErrors<ArcadeFormValues>;
}) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "hoursExceptions",
        keyName: "key",
    });
    const values = useWatch({ control, name: "hoursExceptions" });
    const listError =
        errors.hoursExceptions?.message ??
        errors.hoursExceptions?.root?.message;

    return (
        <fieldset className="border-border rounded-card grid gap-2 border p-3">
            <legend className="text-label px-1">날짜별 예외</legend>
            <p className="text-caption">
                임시 휴무나 특별 영업시간처럼 그날만 다른 날을 적습니다. 공개
                영업시간 표에서 요일 기본값보다 먼저 쓰입니다. 자정을 넘겨
                영업하면 종료 시간을 다음 날 시간으로 입력합니다.
            </p>
            {fields.map((field, index) => {
                const closed = values?.[index]?.closed ?? true;
                const rowErrors = errors.hoursExceptions?.[index];
                const message =
                    rowErrors?.date?.message ??
                    rowErrors?.open?.message ??
                    rowErrors?.close?.message;
                const name = `예외 ${index + 1}`;
                return (
                    <div key={field.key} className="grid gap-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                aria-label={`${name} 날짜`}
                                aria-invalid={Boolean(rowErrors?.date)}
                                className={`${inputClass} flex-1`}
                                {...register(`hoursExceptions.${index}.date`)}
                            />
                            <label className="text-body-muted flex shrink-0 items-center gap-1.5">
                                <input
                                    type="checkbox"
                                    {...register(
                                        `hoursExceptions.${index}.closed`
                                    )}
                                />
                                휴무
                            </label>
                            <button
                                type="button"
                                aria-label={`${name} 삭제`}
                                onClick={() => remove(index)}
                                className="text-body-muted hover:text-danger focus-visible:ring-focus/40 flex size-9 shrink-0 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none"
                            >
                                <Trash2 className="size-4" aria-hidden />
                            </button>
                        </div>
                        {!closed ? (
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="time"
                                    aria-label={`${name} 영업 시작`}
                                    aria-invalid={Boolean(rowErrors?.open)}
                                    className={inputClass}
                                    {...register(
                                        `hoursExceptions.${index}.open`
                                    )}
                                />
                                <input
                                    type="time"
                                    aria-label={`${name} 영업 종료`}
                                    aria-invalid={Boolean(rowErrors?.close)}
                                    className={inputClass}
                                    {...register(
                                        `hoursExceptions.${index}.close`
                                    )}
                                />
                            </div>
                        ) : null}
                        <AdminFieldError
                            message={message}
                            className="text-danger text-xs"
                            role={null}
                        />
                    </div>
                );
            })}
            {fields.length === 0 ? (
                <p className="text-caption">등록된 예외가 없습니다.</p>
            ) : null}
            <button
                type="button"
                disabled={fields.length >= ARCADE_HOURS_EXCEPTION_MAX}
                onClick={() =>
                    append({
                        date: todayInSeoul(),
                        closed: true,
                        open: "10:00",
                        close: "00:00",
                    })
                }
                className={secondaryButtonClass}
            >
                <Plus className="size-4" aria-hidden /> 날짜 추가
            </button>
            <AdminFieldError
                message={listError}
                className="text-danger text-xs"
            />
        </fieldset>
    );
}
