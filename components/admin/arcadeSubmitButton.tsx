"use client";

import { Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { type MouseEvent, useRef, useState } from "react";

import { createArcade, updateArcade } from "@/app/admin/arcades/actions";
import { loadKakaoMaps, type KakaoMapsApi } from "@/lib/kakaoMaps";

interface ArcadeSubmitButtonProps {
    appKey: string;
    mode: "create" | "update";
    originalAddress?: string;
}

function addressQueries(address: string) {
    const roadAddress = address.match(
        /^(.+(?:대로|로|길)\s+\d+(?:-\d+)?)/
    )?.[1];
    const parcelAddress = address.match(
        /^(.+(?:동|읍|면|리)\s+\d+(?:-\d+)?)/
    )?.[1];
    return [
        ...new Set([address, roadAddress, parcelAddress].filter(Boolean)),
    ] as string[];
}

function geocode(kakao: KakaoMapsApi, address: string) {
    const geocoder = new kakao.maps.services.Geocoder();
    return new Promise<{ latitude: string; longitude: string } | null>(
        (resolve, reject) => {
            const queries = addressQueries(address);
            let isSettled = false;
            const timeout = window.setTimeout(() => {
                isSettled = true;
                reject(new Error("GEOCODING_TIMEOUT"));
            }, 10000);

            function finish(
                coordinates: { latitude: string; longitude: string } | null
            ) {
                if (isSettled) return;
                isSettled = true;
                window.clearTimeout(timeout);
                resolve(coordinates);
            }

            function search(index: number) {
                if (isSettled) return;
                const query = queries[index];
                if (!query) {
                    finish(null);
                    return;
                }
                geocoder.addressSearch(query, (result, status) => {
                    if (status === kakao.maps.services.Status.OK && result[0]) {
                        finish({
                            latitude: result[0].y,
                            longitude: result[0].x,
                        });
                        return;
                    }
                    search(index + 1);
                });
            }

            search(0);
        }
    );
}

export default function ArcadeSubmitButton({
    appKey,
    mode,
    originalAddress,
}: ArcadeSubmitButtonProps) {
    const router = useRouter();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [message, setMessage] = useState("");
    const [isPending, setIsPending] = useState(false);

    async function prepareAndSubmit(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        const form = buttonRef.current?.form;
        if (!form || !form.reportValidity()) return;

        const addressInput = form.elements.namedItem("address");
        const latitudeInput = form.elements.namedItem("latitude");
        const longitudeInput = form.elements.namedItem("longitude");
        if (
            !(addressInput instanceof HTMLInputElement) ||
            !(latitudeInput instanceof HTMLInputElement) ||
            !(longitudeInput instanceof HTMLInputElement)
        ) {
            return;
        }

        setIsPending(true);
        setMessage("주소에서 위치를 찾는 중입니다.");
        const address = addressInput.value.trim();
        try {
            const canReuseCoordinates =
                mode === "update" &&
                address === originalAddress &&
                latitudeInput.value &&
                longitudeInput.value;

            if (!canReuseCoordinates) {
                const kakao = await loadKakaoMaps(appKey);
                const coordinates = await geocode(kakao, address);
                if (!coordinates) {
                    setMessage("주소에 맞는 위치를 찾지 못했습니다.");
                    return;
                }

                latitudeInput.value = coordinates.latitude;
                longitudeInput.value = coordinates.longitude;
            }

            setMessage("위치를 확인했습니다. 저장 중입니다.");
            const result =
                mode === "create"
                    ? await createArcade(new FormData(form))
                    : await updateArcade(new FormData(form));
            setMessage(result.message);
            if (result.success) {
                if (mode === "create") form.reset();
                router.refresh();
            }
        } catch (error) {
            setMessage(
                error instanceof Error && error.message === "GEOCODING_TIMEOUT"
                    ? "주소 검색 응답이 지연되고 있습니다. 다시 시도해주세요."
                    : "저장하지 못했습니다. 카카오맵 설정과 입력 내용을 확인해주세요."
            );
        } finally {
            setIsPending(false);
        }
    }

    const isCreate = mode === "create";
    return (
        <div className="flex min-w-0 flex-col items-stretch gap-1">
            <button
                ref={buttonRef}
                type="submit"
                disabled={isPending}
                onClick={prepareAndSubmit}
                className={
                    isCreate
                        ? "bg-text-primary text-bg focus-visible:ring-focus/40 flex h-10 items-center justify-center gap-1.5 rounded-md text-sm font-bold focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
                        : "border-border hover:bg-surface-muted focus-visible:ring-focus/40 flex h-9 items-center justify-center gap-1.5 rounded-md border px-3 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
                }
            >
                {isCreate ? (
                    <Plus className="size-4" aria-hidden="true" />
                ) : (
                    <Save className="size-4" aria-hidden="true" />
                )}
                {isPending ? "위치 확인 중" : isCreate ? "추가" : "저장"}
            </button>
            {message ? (
                <span className="text-caption text-center" role="status">
                    {message}
                </span>
            ) : null}
        </div>
    );
}
