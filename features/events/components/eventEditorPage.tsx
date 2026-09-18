import PageContainer, { PageHeading } from "@/components/layout/pageContainer";
import BackLink from "@/components/ui/backLink";
import { StatusMessage } from "@/components/ui/statusMessage";
import {
    eventDateInput,
    type EventStatus,
} from "@/features/events/schemas/eventSchema";
import type { getOwnEvent } from "@/features/events/server/eventService";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/metadata/site";
import EventDeleteButton from "./eventDeleteButton";
import EventEditor from "./eventEditor";

type OwnEvent = NonNullable<Awaited<ReturnType<typeof getOwnEvent>>>;
const WEEK_MS = 6 * 24 * 60 * 60 * 1000;

// 글쓰기 · 고치기 페이지 — 수정 요청 · 반려 사유는 편집 화면 맨 위(2026-09-18 결정 2)
export default async function EventEditorPage({
    event,
    eligible,
}: {
    event: OwnEvent | null;
    eligible: boolean;
}) {
    const { locale, t } = await getServerI18n();
    const status = event?.status as EventStatus | undefined;
    const today = new Date();
    const values = event
        ? {
              title: event.title,
              content: event.content,
              startDate: eventDateInput(event.startsAt),
              endDate: eventDateInput(event.endsAt, true),
              bannerUrl: event.bannerUrl ?? "",
          }
        : {
              title: "",
              content: "",
              startDate: eventDateInput(today),
              endDate: eventDateInput(new Date(today.getTime() + WEEK_MS)),
              bannerUrl: "",
          };
    const showNote =
        event?.reviewNote &&
        (status === "CHANGES_REQUESTED" || status === "REJECTED");
    return (
        <PageContainer width="reading" className="nl-events">
            <BackLink href={localizePath("/events/mine", locale)}>
                {t("events.mine")}
            </BackLink>
            <PageHeading
                title={event ? t("events.editor.edit") : t("events.editor.new")}
            />
            {showNote ? (
                <StatusMessage
                    severity={status === "REJECTED" ? "danger" : "info"}
                    title={
                        status === "REJECTED"
                            ? t("events.rejected.title")
                            : t("events.changes.title")
                    }
                    description={event.reviewNote}
                />
            ) : null}
            {status === "REJECTED" && event ? (
                <div className="nl-events__rejected">
                    <p className="nl-body nl-muted">
                        {t("events.rejected.body")}
                    </p>
                    {/* 반려된 글은 고칠 수 없으니 남는 동작은 삭제 하나 */}
                    <EventDeleteButton
                        id={event.id}
                        title={event.title}
                        isPublic={false}
                    />
                </div>
            ) : !eligible ? (
                <p className="nl-body nl-muted">{t("events.lock.record")}</p>
            ) : (
                <EventEditor
                    event={{
                        id: event?.id,
                        values,
                        submittedBefore: Boolean(event?.submittedAt),
                        isPublic: Boolean(event?.publishedAt),
                    }}
                    siteUrl={SITE_URL}
                />
            )}
        </PageContainer>
    );
}
