import Link from "next/link";
import { StatusMessage } from "@/components/ui/statusMessage";
import { getServerI18n } from "@/lib/i18n/server";
import { getLocalizedHref } from "@/lib/i18n/routing";
import type { PublicAnnouncement } from "@/features/announcements/schemas/publicAnnouncementSchema";

export default async function CriticalAnnouncement({
    announcement,
}: {
    announcement: PublicAnnouncement | null;
}) {
    if (!announcement) return null;
    const { locale, t } = await getServerI18n();
    return (
        <StatusMessage
            severity="warning"
            className="nl-home-critical"
            title={t("announcements.critical")}
            description={
                <Link
                    className="nl-home-critical__link"
                    href={getLocalizedHref(
                        `/announcements/${announcement.slug}`,
                        locale
                    )}
                >
                    {announcement.title}
                </Link>
            }
        />
    );
}
