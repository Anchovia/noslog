import "server-only";

import { revalidatePath, unstable_cache, updateTag } from "next/cache";

import {
    canAuthorEdit,
    createEventFormSchema,
    eventDateEnd,
    eventDateStart,
    eventInputFromFormData,
    groupPublicEvents,
    publicEvent,
    type EventFormValues,
    type EventStatus,
} from "@/features/events/schemas/eventSchema";
import type { ActionResult } from "@/lib/actions/result";
import {
    createImageUploadToken,
    deleteBlobIfOwned,
    isImageContentType,
    isValidImageBlob,
} from "@/lib/blob";
import { CACHE_TAGS } from "@/lib/cacheTags";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cachePolicy";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/routing";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";
import {
    claimUploadTokenQuota,
    getUploadLimitMessage,
    releaseUploadTokenQuota,
} from "@/lib/uploadRateLimit";

type EventFieldName = Extract<keyof EventFormValues, string>;

const bannerPrefix = (userId: number) => `events/${userId}/banner`;

export function invalidateEvents() {
    updateTag(CACHE_TAGS.events);
    revalidatePath("/events", "layout");
    revalidatePath("/admin/events", "layout");
}

const queryPublished = unstable_cache(
    async () =>
        db.communityEvent.findMany({
            where: { publishedAt: { not: null }, status: { not: "REJECTED" } },
            select: {
                id: true,
                status: true,
                publishedTitle: true,
                publishedContent: true,
                publishedStartsAt: true,
                publishedEndsAt: true,
                publishedBannerUrl: true,
                publishedAt: true,
                author: { select: { username: true } },
            },
        }),
    ["community-events-v1"],
    { tags: [CACHE_TAGS.events], revalidate: PUBLIC_DATA_REVALIDATE_SECONDS }
);

async function publishedEvents() {
    const now = new Date();
    // unstable_cache 를 거치면 Date 가 ISO 문자열로 돌아온다 — 다시 Date 로
    const date = (value: Date | string | null) =>
        value === null ? null : new Date(value);
    return (await queryPublished()).flatMap((record) => {
        const event = publicEvent(
            {
                ...record,
                publishedStartsAt: date(record.publishedStartsAt),
                publishedEndsAt: date(record.publishedEndsAt),
                publishedAt: date(record.publishedAt),
            },
            now
        );
        return event
            ? [{ ...event, authorName: record.author.username ?? null }]
            : [];
    });
}
export type PublicEventItem = Awaited<
    ReturnType<typeof publishedEvents>
>[number];

export async function getEventBoard() {
    return groupPublicEvents(await publishedEvents()) as Record<
        "live" | "upcoming" | "ended",
        PublicEventItem[]
    >;
}
// 사이트맵 — 공개판이 있는 글 전부(진행 중 · 예정 · 종료). 마지막 수정 = 공개판이 마지막으로 바뀐 때
// (승인 상태면 마지막 검토 시각, 고친 판을 검토 중이면 그 전 공개 시각을 알 수 없어 처음 공개 시각)
export async function getSitemapEvents() {
    const rows = await db.communityEvent.findMany({
        where: { publishedAt: { not: null }, status: { not: "REJECTED" } },
        select: { id: true, status: true, publishedAt: true, reviewedAt: true },
    });
    return rows.map((row) => ({
        id: row.id,
        lastModified:
            row.status === "PUBLISHED" && row.reviewedAt
                ? row.reviewedAt
                : row.publishedAt!,
    }));
}

// 홈 — 진행 중 가운데 끝나는 순 2개. 이벤트 조회가 실패해도 홈은 그대로 뜬다
export async function getHomeLiveEvents() {
    try {
        return (await getEventBoard()).live.slice(0, 2);
    } catch (error) {
        logServerError(error, {
            event: "events.home.failed",
            routePath: "/",
            routeType: "page",
        });
        return [];
    }
}
export async function getPublicEventDetail(id: number) {
    return (await publishedEvents()).find((event) => event.id === id) ?? null;
}

// 쓸 수 있는 사람 = 로그인 + 기록을 한 번 이상 동기화(2026-09-18 결정 3)
export async function getEventWriter() {
    const session = await getSession();
    if (!session.id) return { userId: null, eligible: false } as const;
    const synced = await db.dataSync.findFirst({
        where: { user_id: session.id, status: "completed" },
        select: { id: true },
    });
    return { userId: session.id, eligible: Boolean(synced) } as const;
}

export async function getMyEvents(userId: number) {
    return db.communityEvent.findMany({
        where: { authorId: userId },
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        select: {
            id: true,
            status: true,
            title: true,
            updatedAt: true,
            publishedAt: true,
        },
    });
}

export async function getOwnEvent(userId: number, id: number) {
    return db.communityEvent.findFirst({
        where: { id, authorId: userId },
        select: {
            id: true,
            status: true,
            title: true,
            content: true,
            startsAt: true,
            endsAt: true,
            bannerUrl: true,
            publishedAt: true,
            reviewNote: true,
            submittedAt: true,
        },
    });
}

function localeFrom(formData: FormData): Locale {
    const value = String(formData.get("locale") ?? "");
    return isLocale(value) ? value : "ko";
}

// 임시저장 · 게시 요청 — 한 액션. 게시 요청이면 검토 대기로, 아니면 임시저장.
// 공개판은 건드리지 않는다(승인 때만 바뀐다)
export async function saveEvent(
    formData: FormData
): Promise<ActionResult<{ id: number }, EventFieldName>> {
    const t = createTranslator(getMessages(localeFrom(formData)));
    const writer = await getEventWriter();
    if (!writer.userId)
        return { success: false, message: t("events.loginRequired") };
    if (!writer.eligible)
        return { success: false, message: t("events.lock.record") };
    const parsed = createEventFormSchema(t).safeParse(
        eventInputFromFormData(formData)
    );
    if (!parsed.success)
        return {
            success: false,
            message: t("events.checkInput"),
            fieldErrors: parsed.error.flatten().fieldErrors,
        };
    const idValue = Number(formData.get("id"));
    const id = Number.isSafeInteger(idValue) && idValue > 0 ? idValue : null;
    const submit = formData.get("submit") === "true";
    const existing = id ? await getOwnEvent(writer.userId, id) : null;
    if (id && !existing)
        return { success: false, message: t("events.notFound") };
    if (existing && !canAuthorEdit(existing.status as EventStatus))
        return { success: false, message: t("events.rejected.body") };

    const bannerUrl = parsed.data.bannerUrl || null;
    if (
        bannerUrl &&
        bannerUrl !== existing?.bannerUrl &&
        !(await isValidImageBlob(bannerUrl, bannerPrefix(writer.userId)))
    )
        return {
            success: false,
            message: t("events.invalidBanner"),
            fieldErrors: { bannerUrl: [t("events.invalidBanner")] },
        };

    const now = new Date();
    const data = {
        title: parsed.data.title,
        content: parsed.data.content,
        startsAt: eventDateStart(parsed.data.startDate),
        endsAt: eventDateEnd(parsed.data.endDate),
        bannerUrl,
        // 임시저장은 「수정 요청」 을 그대로 둔다 — 사유가 다시 요청할 때까지 편집 화면 맨 위에 남는다
        status: (submit
            ? "PENDING"
            : existing?.status === "CHANGES_REQUESTED"
              ? "CHANGES_REQUESTED"
              : "DRAFT") as EventStatus,
        ...(submit ? { submittedAt: now } : {}),
    };
    try {
        const saved = existing
            ? await db.communityEvent.update({
                  where: { id: existing.id },
                  data,
                  select: { id: true },
              })
            : await db.communityEvent.create({
                  data: { ...data, authorId: writer.userId },
                  select: { id: true },
              });
        // 바꾼 배너의 옛 파일은 작성자 폴더의 파일이고 공개판이 쓰고 있지 않을 때만 지운다
        // (deleteBlobIfOwned 는 저장소 안 파일이면 무엇이든 지우므로 폴더를 먼저 확인)
        if (
            existing?.bannerUrl &&
            existing.bannerUrl !== bannerUrl &&
            (await isValidImageBlob(
                existing.bannerUrl,
                bannerPrefix(writer.userId)
            ))
        ) {
            const inUse = await db.communityEvent.count({
                where: { publishedBannerUrl: existing.bannerUrl },
            });
            if (!inUse) await deleteBlobIfOwned(existing.bannerUrl);
        }
        invalidateEvents();
        return {
            success: true,
            message: submit ? t("events.submitted") : t("events.saved"),
            id: saved.id,
        };
    } catch (error) {
        logServerError(error, {
            event: "events.save.failed",
            routePath: "/events",
            routeType: "action",
        });
        if (bannerUrl && bannerUrl !== existing?.bannerUrl)
            await deleteBlobIfOwned(bannerUrl).catch(() => null);
        return { success: false, message: t("events.saveFailed") };
    }
}

export async function requestEventBannerUpload(
    contentType: string,
    requestedLocale?: string
): Promise<ActionResult<{ pathname: string; token: string }>> {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const writer = await getEventWriter();
    if (!writer.userId)
        return { success: false, message: t("events.loginRequired") };
    if (!writer.eligible)
        return { success: false, message: t("events.lock.record") };
    if (!isImageContentType(contentType))
        return { success: false, message: t("events.invalidImage") };
    let grantId: number | null = null;
    try {
        const quota = await claimUploadTokenQuota(
            writer.userId,
            "event-banner"
        );
        if (!quota.allowed)
            return { success: false, message: getUploadLimitMessage() };
        grantId = quota.grantId;
        const upload = await createImageUploadToken(
            bannerPrefix(writer.userId),
            contentType
        );
        if (!upload) throw new Error("invalid image type");
        return { success: true, message: "", ...upload };
    } catch (error) {
        logServerError(error, {
            event: "events.banner-upload.request.failed",
            routePath: "/events",
            routeType: "action",
        });
        if (grantId !== null)
            await releaseUploadTokenQuota(writer.userId, grantId).catch(
                () => null
            );
        return { success: false, message: t("events.uploadFailed") };
    }
}

// 저장하지 않고 버린 새 배너 — 내 폴더의 파일이고 어떤 글도 쓰지 않을 때만 지운다
export async function discardEventBanner(url: string) {
    const writer = await getEventWriter();
    if (!writer.userId || !url) return;
    if (!(await isValidImageBlob(url, bannerPrefix(writer.userId)))) return;
    const inUse = await db.communityEvent.count({
        where: { OR: [{ bannerUrl: url }, { publishedBannerUrl: url }] },
    });
    if (!inUse) await deleteBlobIfOwned(url);
}
