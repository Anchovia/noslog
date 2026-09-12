"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { createArcade, updateArcade } from "@/app/admin/arcades/actions";
import { geocodeArcadeAddress } from "@/features/arcades/api/geocodeArcadeAddress";
import {
    ARCADE_ADDRESS_MAX_LENGTH,
    ARCADE_CABINET_LABEL_MAX_LENGTH,
    ARCADE_CABINET_MAX,
    ARCADE_CABINET_NOTE_MAX_LENGTH,
    ARCADE_NAME_MAX_LENGTH,
    ARCADE_NOTES_MAX_LENGTH,
    arcadeFormSchema,
    createArcadeFormData,
    createArcadeFormDefaultValues,
    type ArcadeFormValues,
    type ArcadeValues,
} from "@/features/arcades/schemas/arcadeSchema";
import { applyFormFieldErrors } from "@/lib/forms/errors";
import {
    ARCADE_CABINET_AVAILABILITIES,
    ARCADE_CABINET_CONDITIONS,
    normalizeArcadeBusinessHours,
} from "@/lib/arcadeDetails";
import { ARCADE_REGIONS } from "@/lib/arcadeRegions";

import ArcadeBusinessHoursFields from "./arcadeBusinessHoursFields";

const inputClass =
    "border-border bg-bg text-input h-10 min-w-0 rounded-md border px-3 outline-none focus:border-focus";
const textareaClass =
    "border-border bg-bg text-body min-h-20 min-w-0 resize-y rounded-md border px-3 py-2 outline-none focus:border-focus";
const secondaryButtonClass =
    "border-border hover:bg-surface-muted focus-visible:ring-focus/40 flex h-9 items-center justify-center gap-1.5 rounded-md border px-3 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50";

// 관리자 화면은 서버·브라우저 시간대가 달라도 같은 날짜가 나오도록 서울 기준으로 적는다
const verifiedDateFormat = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

function verifiedLabel(value: string | null) {
    return value
        ? `확인 ${verifiedDateFormat.format(new Date(value))}`
        : "확인 기록 없음";
}

export interface ArcadeFormCabinet {
    id: number;
    label: string | null;
    note: string | null;
    availability: string;
    condition: string;
    position: number;
    verifiedAt: string | null;
}

interface ArcadeFormRecord {
    id: number;
    name: string;
    region: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    playPrice: number | null;
    coinCount: number | null;
    businessHours: unknown;
    hours: unknown;
    hoursVerifiedAt: string | null;
    cabinets: ArcadeFormCabinet[];
    notes: string | null;
    isActive: boolean;
    userCount: number;
}

type ArcadeFormProps =
    | { mode: "create"; appKey: string }
    | { mode: "update"; appKey: string; arcade: ArcadeFormRecord };

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="text-danger mt-1 text-xs">{message}</p>
    ) : null;
}

export default function ArcadeForm(props: ArcadeFormProps) {
    const router = useRouter();
    const isCreate = props.mode === "create";
    const arcade = props.mode === "update" ? props.arcade : undefined;
    const formKey = `arcade-${arcade?.id ?? "new"}`;
    const defaultValues = useMemo(
        () =>
            createArcadeFormDefaultValues(
                arcade
                    ? {
                          name: arcade.name,
                          region: arcade.region,
                          address: arcade.address,
                          latitude: arcade.latitude,
                          longitude: arcade.longitude,
                          playPrice: arcade.playPrice,
                          coinCount: arcade.coinCount,
                          businessHours: arcade.businessHours,
                          hours: arcade.hours,
                          cabinets: arcade.cabinets,
                          notes: arcade.notes,
                          isActive: arcade.isActive,
                      }
                    : undefined
            ),
        [arcade]
    );
    const savedCabinets = useMemo(
        () =>
            new Map(
                (arcade?.cabinets ?? []).map((cabinet) => [
                    String(cabinet.id),
                    cabinet,
                ])
            ),
        [arcade]
    );
    const legacyNote = normalizeArcadeBusinessHours(
        arcade?.businessHours
    )?.legacyNote;
    const [statusMessage, setStatusMessage] = useState("");
    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<ArcadeFormValues, unknown, ArcadeValues>({
        resolver: zodResolver(arcadeFormSchema),
        defaultValues,
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "cabinets",
        keyName: "key",
    });
    const cabinetValues = useWatch({ control, name: "cabinets" });

    // 저장 뒤 새로고침으로 받은 기체 ID·확인 날짜로 폼을 다시 맞춘다 — 방금 추가한 기체가 다음 저장에서 또 생기지 않게
    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    async function handleArcadeSubmit(values: ArcadeValues) {
        clearErrors();
        let latitude = values.latitude;
        let longitude = values.longitude;

        try {
            const canReuseCoordinates =
                props.mode === "update" &&
                values.address === (props.arcade.address ?? "") &&
                latitude !== null &&
                longitude !== null;

            if (!canReuseCoordinates) {
                setStatusMessage("주소에서 위치를 찾는 중입니다.");
                const coordinates = await geocodeArcadeAddress(
                    props.appKey,
                    values.address
                );
                if (!coordinates) {
                    const message = "주소에 맞는 위치를 찾지 못했습니다.";
                    setError("address", { type: "manual", message });
                    setStatusMessage(message);
                    return;
                }

                latitude = coordinates.latitude;
                longitude = coordinates.longitude;
                setValue("latitude", String(latitude));
                setValue("longitude", String(longitude));
            }

            setStatusMessage("위치를 확인했습니다. 저장 중입니다.");
            const formData = createArcadeFormData(
                { ...values, latitude, longitude },
                arcade?.id
            );
            const result = isCreate
                ? await createArcade(formData)
                : await updateArcade(formData);

            if (!result.success) {
                applyFormFieldErrors(setError, result.fieldErrors);
                setError("root.server", {
                    type: "server",
                    message: result.message,
                });
                setStatusMessage(result.message);
                toast.error(result.message);
                return;
            }

            setStatusMessage(result.message);
            toast.success(result.message);
            if (isCreate) reset(defaultValues);
            router.refresh();
        } catch (error) {
            const message =
                error instanceof Error && error.message === "GEOCODING_TIMEOUT"
                    ? "주소 검색 응답이 지연되고 있습니다. 다시 시도해주세요."
                    : "저장하지 못했습니다. 카카오맵 설정과 입력 내용을 확인해주세요.";
            setError("root.server", { type: "server", message });
            setStatusMessage(message);
            toast.error(message);
        }
    }

    const submit = handleSubmit(handleArcadeSubmit);

    return (
        <form
            onSubmit={submit}
            noValidate
            className="bg-surface rounded-card grid gap-2 p-3"
        >
            {isCreate ? (
                <h2 className="text-section flex items-center gap-2">
                    <Plus className="size-4" aria-hidden /> 오락실 추가
                </h2>
            ) : null}
            <input type="hidden" {...register("latitude")} />
            <input type="hidden" {...register("longitude")} />
            {isCreate ? (
                <input
                    type="checkbox"
                    className="hidden"
                    tabIndex={-1}
                    aria-hidden="true"
                    {...register("isActive")}
                />
            ) : null}
            <label className="sr-only" htmlFor={`${formKey}-name`}>
                오락실 이름
            </label>
            <div className={isCreate ? undefined : "flex items-center gap-2"}>
                {!isCreate ? (
                    <MapPin
                        className="text-chart size-4 shrink-0"
                        aria-hidden
                    />
                ) : null}
                <input
                    id={`${formKey}-name`}
                    maxLength={ARCADE_NAME_MAX_LENGTH}
                    placeholder="오락실 이름"
                    aria-invalid={Boolean(errors.name)}
                    className={`${inputClass} ${isCreate ? "w-full" : "flex-1"}`}
                    {...register("name")}
                />
            </div>
            <FieldError message={errors.name?.message} />
            <label className="sr-only" htmlFor={`${formKey}-region`}>
                지역
            </label>
            <select
                id={`${formKey}-region`}
                aria-invalid={Boolean(errors.region)}
                className={inputClass}
                {...register("region")}
            >
                <option value="" disabled>
                    지역 선택
                </option>
                {ARCADE_REGIONS.map((region) => (
                    <option key={region} value={region}>
                        {region}
                    </option>
                ))}
            </select>
            <FieldError message={errors.region?.message} />
            <label className="sr-only" htmlFor={`${formKey}-address`}>
                주소
            </label>
            <input
                id={`${formKey}-address`}
                maxLength={ARCADE_ADDRESS_MAX_LENGTH}
                placeholder="주소"
                aria-invalid={Boolean(
                    errors.address || errors.latitude || errors.longitude
                )}
                className={inputClass}
                {...register("address")}
            />
            <FieldError
                message={
                    errors.address?.message ??
                    errors.latitude?.message ??
                    errors.longitude?.message
                }
            />
            <div className="grid grid-cols-2 gap-2">
                <label className="text-caption flex min-w-0 flex-col gap-1">
                    플레이 요금 (원)
                    <input
                        type="number"
                        min={1}
                        max={100000}
                        placeholder="예: 500"
                        aria-invalid={Boolean(errors.playPrice)}
                        className={inputClass}
                        {...register("playPrice")}
                    />
                    <FieldError message={errors.playPrice?.message} />
                </label>
                <label className="text-caption flex min-w-0 flex-col gap-1">
                    1회 플레이 코인 수
                    <input
                        type="number"
                        min={1}
                        max={100}
                        placeholder="예: 1"
                        aria-invalid={Boolean(errors.coinCount)}
                        className={inputClass}
                        {...register("coinCount")}
                    />
                    <FieldError message={errors.coinCount?.message} />
                </label>
            </div>
            <ArcadeBusinessHoursFields
                formKey={formKey}
                register={register}
                errors={errors}
                legacyNote={legacyNote}
                verifiedLabel={
                    arcade ? verifiedLabel(arcade.hoursVerifiedAt) : undefined
                }
            />
            <fieldset className="border-border rounded-card grid gap-2 border p-3">
                <legend className="text-label px-1">기체</legend>
                <p className="text-caption">
                    가동·상태·메모를 바꾸거나 「오늘 확인」 을 체크하고 저장하면
                    그 기체의 확인 날짜가 오늘로 기록됩니다.
                </p>
                {fields.map((field, index) => {
                    const saved = savedCabinets.get(field.cabinetId);
                    const name = saved
                        ? `${saved.position + 1}번기`
                        : "새 기체";
                    const available =
                        cabinetValues?.[index]?.availability === "available";
                    const rowErrors = errors.cabinets?.[index];
                    return (
                        <div
                            key={field.key}
                            className="border-border grid gap-2 rounded-md border p-2"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-label">{name}</span>
                                <span className="text-caption ml-auto">
                                    {saved
                                        ? verifiedLabel(saved.verifiedAt)
                                        : "저장하면 추가됩니다"}
                                </span>
                                <button
                                    type="button"
                                    aria-label={`${name} 삭제`}
                                    onClick={() => remove(index)}
                                    className="text-body-muted hover:text-danger focus-visible:ring-focus/40 flex size-9 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none"
                                >
                                    <Trash2 className="size-4" aria-hidden />
                                </button>
                            </div>
                            <input
                                maxLength={ARCADE_CABINET_LABEL_MAX_LENGTH}
                                placeholder={
                                    saved
                                        ? `이름 · 비우면 ${name}`
                                        : "이름 · 비우면 번호로 표시"
                                }
                                aria-label={`${name} 이름`}
                                aria-invalid={Boolean(rowErrors?.label)}
                                className={inputClass}
                                {...register(`cabinets.${index}.label`)}
                            />
                            <div
                                className={
                                    available
                                        ? "grid grid-cols-2 gap-2"
                                        : "grid gap-2"
                                }
                            >
                                <select
                                    aria-label={`${name} 가동`}
                                    className={inputClass}
                                    {...register(
                                        `cabinets.${index}.availability`
                                    )}
                                >
                                    {ARCADE_CABINET_AVAILABILITIES.map(
                                        (option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        )
                                    )}
                                </select>
                                {available ? (
                                    <select
                                        aria-label={`${name} 상태`}
                                        className={inputClass}
                                        {...register(
                                            `cabinets.${index}.condition`
                                        )}
                                    >
                                        {ARCADE_CABINET_CONDITIONS.map(
                                            (option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            )
                                        )}
                                    </select>
                                ) : null}
                            </div>
                            <input
                                maxLength={ARCADE_CABINET_NOTE_MAX_LENGTH}
                                placeholder="메모 · 위치나 상태 이유"
                                aria-label={`${name} 메모`}
                                aria-invalid={Boolean(rowErrors?.note)}
                                className={inputClass}
                                {...register(`cabinets.${index}.note`)}
                            />
                            <FieldError
                                message={
                                    rowErrors?.note?.message ??
                                    rowErrors?.label?.message
                                }
                            />
                            {saved ? (
                                <label className="text-body-muted flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        {...register(
                                            `cabinets.${index}.confirm`
                                        )}
                                    />
                                    오늘 확인
                                </label>
                            ) : null}
                        </div>
                    );
                })}
                {fields.length === 0 ? (
                    <p className="text-caption">등록된 기체가 없습니다.</p>
                ) : null}
                <button
                    type="button"
                    disabled={fields.length >= ARCADE_CABINET_MAX}
                    onClick={() =>
                        append({
                            cabinetId: "",
                            label: "",
                            note: "",
                            availability: "unknown",
                            condition: "unknown",
                            confirm: false,
                        })
                    }
                    className={secondaryButtonClass}
                >
                    <Plus className="size-4" aria-hidden /> 기체 추가
                </button>
                <FieldError
                    message={
                        errors.cabinets?.message ??
                        errors.cabinets?.root?.message
                    }
                />
            </fieldset>
            <label className="text-caption flex flex-col gap-1">
                비고
                <textarea
                    maxLength={ARCADE_NOTES_MAX_LENGTH}
                    placeholder="예: 이벤트 기체, 이어폰 단자 지원"
                    aria-invalid={Boolean(errors.notes)}
                    className={textareaClass}
                    {...register("notes")}
                />
                <FieldError message={errors.notes?.message} />
            </label>
            {props.mode === "update" ? (
                <div className="flex items-start justify-between gap-2">
                    <label className="text-body-muted flex cursor-pointer items-center gap-2">
                        <input type="checkbox" {...register("isActive")} />
                        선택 목록에 표시
                    </label>
                    <span className="text-caption">
                        선택 {props.arcade.userCount}명
                    </span>
                </div>
            ) : null}
            {errors.root?.server?.message ? (
                <p className="text-danger text-xs" role="alert">
                    {errors.root.server.message}
                </p>
            ) : null}
            <div className="flex min-w-0 flex-col items-stretch gap-1">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={
                        isCreate
                            ? "bg-text-primary text-bg focus-visible:ring-focus/40 flex h-10 items-center justify-center gap-1.5 rounded-md text-sm font-bold focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
                            : secondaryButtonClass
                    }
                >
                    {isCreate ? (
                        <Plus className="size-4" aria-hidden />
                    ) : (
                        <Save className="size-4" aria-hidden />
                    )}
                    {isSubmitting ? "위치 확인 중" : isCreate ? "추가" : "저장"}
                </button>
                {statusMessage ? (
                    <span className="text-caption text-center" role="status">
                        {statusMessage}
                    </span>
                ) : null}
            </div>
        </form>
    );
}
