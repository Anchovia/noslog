"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createArcade, updateArcade } from "@/app/admin/arcades/actions";
import { geocodeArcadeAddress } from "@/features/arcades/api/geocodeArcadeAddress";
import {
    ARCADE_ADDRESS_MAX_LENGTH,
    ARCADE_NAME_MAX_LENGTH,
    ARCADE_NOTES_MAX_LENGTH,
    ARCADE_STATUS_NOTE_MAX_LENGTH,
    arcadeFormSchema,
    createArcadeFormData,
    createArcadeFormDefaultValues,
    type ArcadeFormValues,
    type ArcadeValues,
} from "@/features/arcades/schemas/arcadeSchema";
import { applyFormFieldErrors } from "@/lib/forms/errors";
import {
    ARCADE_MACHINE_STATUSES,
    normalizeArcadeBusinessHours,
} from "@/lib/arcadeDetails";
import { ARCADE_REGIONS } from "@/lib/arcadeRegions";

import ArcadeBusinessHoursFields from "./arcadeBusinessHoursFields";

const inputClass =
    "border-border bg-bg text-input h-10 min-w-0 rounded-md border px-3 outline-none focus:border-focus";
const textareaClass =
    "border-border bg-bg text-body min-h-20 min-w-0 resize-y rounded-md border px-3 py-2 outline-none focus:border-focus";

interface ArcadeFormRecord {
    id: number;
    name: string;
    region: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    machineCount: number | null;
    playPrice: number | null;
    coinCount: number | null;
    businessHours: unknown;
    machineStatus: string;
    statusNote: string | null;
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
                          machineCount: arcade.machineCount,
                          playPrice: arcade.playPrice,
                          coinCount: arcade.coinCount,
                          businessHours: arcade.businessHours,
                          machineStatus: arcade.machineStatus,
                          statusNote: arcade.statusNote,
                          notes: arcade.notes,
                          isActive: arcade.isActive,
                      }
                    : undefined
            ),
        [arcade]
    );
    const legacyNote = normalizeArcadeBusinessHours(
        arcade?.businessHours
    )?.legacyNote;
    const [statusMessage, setStatusMessage] = useState("");
    const {
        register,
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
                    기체 수
                    <input
                        type="number"
                        min={1}
                        max={20}
                        placeholder="예: 2"
                        aria-invalid={Boolean(errors.machineCount)}
                        className={inputClass}
                        {...register("machineCount")}
                    />
                    <FieldError message={errors.machineCount?.message} />
                </label>
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
            </div>
            <label className="text-caption flex flex-col gap-1">
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
            <ArcadeBusinessHoursFields
                formKey={formKey}
                register={register}
                errors={errors}
                legacyNote={legacyNote}
            />
            <label className="text-caption flex flex-col gap-1">
                기체 상태
                <select
                    aria-invalid={Boolean(errors.machineStatus)}
                    className={inputClass}
                    {...register("machineStatus")}
                >
                    {ARCADE_MACHINE_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
                <FieldError message={errors.machineStatus?.message} />
            </label>
            <label className="sr-only" htmlFor={`${formKey}-status-note`}>
                상태 사유
            </label>
            <input
                id={`${formKey}-status-note`}
                maxLength={ARCADE_STATUS_NOTE_MAX_LENGTH}
                placeholder="상태 사유 · 예: 일부 건반 반응이 약함"
                aria-invalid={Boolean(errors.statusNote)}
                className={inputClass}
                {...register("statusNote")}
            />
            <FieldError message={errors.statusNote?.message} />
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
                            : "border-border hover:bg-surface-muted focus-visible:ring-focus/40 flex h-9 items-center justify-center gap-1.5 rounded-md border px-3 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
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
