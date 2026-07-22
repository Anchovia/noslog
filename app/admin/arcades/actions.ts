"use server";

import { revalidatePath, updateTag } from "next/cache";
import { Prisma } from "@prisma/client";

import { requireAdmin } from "@/lib/admin";
import { ARCADE_WEEKDAYS, isArcadeMachineStatus } from "@/lib/arcadeDetails";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";

function optionalText(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();
    return text || null;
}

function coordinatesFrom(formData: FormData) {
    const latitudeText = String(formData.get("latitude") ?? "").trim();
    const longitudeText = String(formData.get("longitude") ?? "").trim();
    if (!latitudeText && !longitudeText) {
        return { latitude: null, longitude: null };
    }
    if (!latitudeText || !longitudeText) return null;

    const latitude = Number(latitudeText);
    const longitude = Number(longitudeText);
    if (
        !Number.isFinite(latitude) ||
        latitude < -90 ||
        latitude > 90 ||
        !Number.isFinite(longitude) ||
        longitude < -180 ||
        longitude > 180
    ) {
        return null;
    }
    return { latitude, longitude };
}

function businessHoursFrom(formData: FormData) {
    const weekly: Record<string, { open: string; close: string }> = {};
    for (const { key } of ARCADE_WEEKDAYS) {
        if (formData.get(`hours_${key}_enabled`) !== "on") continue;
        const open = String(formData.get(`hours_${key}_open`) ?? "");
        const close = String(formData.get(`hours_${key}_close`) ?? "");
        if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(open)) return undefined;
        if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(close)) return undefined;
        weekly[key] = { open, close };
    }

    const openEveryDay = formData.get("openEveryDay") === "on";
    if (openEveryDay && Object.keys(weekly).length !== ARCADE_WEEKDAYS.length) {
        return undefined;
    }
    if (Object.keys(weekly).length === 0) return null;
    return { weekly, openEveryDay };
}

function operationDetailsFrom(formData: FormData) {
    const machineCountText = String(formData.get("machineCount") ?? "").trim();
    const machineCount = machineCountText ? Number(machineCountText) : null;
    const playPriceText = String(formData.get("playPrice") ?? "").trim();
    const coinCountText = String(formData.get("coinCount") ?? "").trim();
    const playPrice = playPriceText ? Number(playPriceText) : null;
    const coinCount = coinCountText ? Number(coinCountText) : null;
    const businessHours = businessHoursFrom(formData);
    const machineStatus = String(formData.get("machineStatus") ?? "unknown");
    const statusNote = optionalText(formData.get("statusNote"));
    const notes = optionalText(formData.get("notes"));

    if (
        (machineCount !== null &&
            (!Number.isInteger(machineCount) ||
                machineCount < 1 ||
                machineCount > 20)) ||
        (playPrice === null) !== (coinCount === null) ||
        (playPrice !== null &&
            (!Number.isInteger(playPrice) ||
                playPrice < 1 ||
                playPrice > 100000)) ||
        (coinCount !== null &&
            (!Number.isInteger(coinCount) ||
                coinCount < 1 ||
                coinCount > 100)) ||
        businessHours === undefined ||
        !isArcadeMachineStatus(machineStatus) ||
        (statusNote?.length ?? 0) > 200 ||
        (notes?.length ?? 0) > 500
    ) {
        return null;
    }

    return {
        machine_count: machineCount,
        play_price: playPrice,
        coin_count: coinCount,
        business_hours: businessHours === null ? Prisma.DbNull : businessHours,
        machine_status: machineStatus,
        status_note: statusNote,
        notes,
    };
}

export async function createArcade(formData: FormData) {
    await requireAdmin();
    const name = String(formData.get("name") ?? "").trim();
    const coordinates = coordinatesFrom(formData);
    const operationDetails = operationDetailsFrom(formData);
    if (!name || name.length > 80 || !coordinates || !operationDetails) {
        return { success: false, message: "입력 내용을 확인해주세요." };
    }

    await db.arcade.create({
        data: {
            name,
            region: optionalText(formData.get("region")),
            address: optionalText(formData.get("address")),
            ...coordinates,
            ...operationDetails,
        },
    });
    updateTag(CACHE_TAGS.arcades);
    revalidatePath("/admin/arcades");
    revalidatePath("/gamecenter");
    return { success: true, message: "오락실을 추가했습니다." };
}

export async function updateArcade(formData: FormData) {
    await requireAdmin();
    const id = Number(formData.get("id"));
    const name = String(formData.get("name") ?? "").trim();
    const coordinates = coordinatesFrom(formData);
    const operationDetails = operationDetailsFrom(formData);
    if (
        !Number.isInteger(id) ||
        !name ||
        name.length > 80 ||
        !coordinates ||
        !operationDetails
    ) {
        return { success: false, message: "입력 내용을 확인해주세요." };
    }

    await db.arcade.update({
        where: { id },
        data: {
            name,
            region: optionalText(formData.get("region")),
            address: optionalText(formData.get("address")),
            ...coordinates,
            ...operationDetails,
            is_active: formData.get("isActive") === "on",
        },
    });
    updateTag(CACHE_TAGS.arcades);
    updateTag(CACHE_TAGS.userProfiles);
    revalidatePath("/admin/arcades");
    revalidatePath("/gamecenter");
    return { success: true, message: "오락실 정보를 저장했습니다." };
}
