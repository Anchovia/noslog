"use client";

import { Plus, Trash2 } from "lucide-react";
import {
    type Control,
    type FieldErrors,
    useFieldArray,
    type UseFormRegister,
    useWatch,
} from "react-hook-form";

import {
    adminCompactInputClass as inputClass,
    AdminFieldError,
    adminSecondaryButtonClass as secondaryButtonClass,
} from "@/components/admin/admin-form";
import { foundationButtonClass } from "@/components/ui/button";
import {
    ARCADE_HOURS_EXCEPTION_MAX,
    type ArcadeFormValues,
    type ArcadeValues,
} from "@/features/arcades/schemas/arcade-schema";
import { cn } from "@/lib/cn";

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
        <fieldset className="grid min-w-0 grid-cols-1 gap-nl-8 rounded-nl-container border-nl-stroke border-nl-divider p-nl-12">
            <legend className="nl-emphasis-label px-nl-4 text-nl-content">
                날짜별 예외
            </legend>
            <p className="nl-metadata text-nl-subdued">
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
                    <div key={field.key} className="grid gap-nl-8">
                        <div className="flex items-center gap-nl-8">
                            <input
                                type="date"
                                aria-label={`${name} 날짜`}
                                aria-invalid={Boolean(rowErrors?.date)}
                                className={`${inputClass} flex-1`}
                                {...register(`hoursExceptions.${index}.date`)}
                            />
                            <label className="nl-body-secondary flex shrink-0 items-center gap-nl-8 text-nl-subdued">
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
                                className={cn(
                                    foundationButtonClass({
                                        variant: "ghost",
                                        size: "icon-sm",
                                    }),
                                    "shrink-0"
                                )}
                            >
                                <Trash2 className="nl-icon-small" aria-hidden />
                            </button>
                        </div>
                        {!closed ? (
                            <div className="grid grid-cols-2 gap-nl-8">
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
                            className="nl-metadata text-nl-error"
                            role={null}
                        />
                    </div>
                );
            })}
            {fields.length === 0 ? (
                <p className="nl-metadata text-nl-subdued">
                    등록된 예외가 없습니다.
                </p>
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
                <Plus className="nl-icon-small" aria-hidden /> 날짜 추가
            </button>
            <AdminFieldError
                message={listError}
                className="nl-metadata text-nl-error"
            />
        </fieldset>
    );
}
