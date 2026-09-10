import { Megaphone } from "lucide-react";
import Link from "next/link";
import { StatusMessage } from "@/components/ui/statusMessage";
import { getServerI18n } from "@/lib/i18n/server";
import { getLocalizedHref } from "@/lib/i18n/routing";
import type { PublicAnnouncement } from "@/features/announcements/schemas/publicAnnouncementSchema";

// 홈 최상단 중대 공지 배너. 보이는 텍스트는 제목 링크 한 줄이고 「중요 공지」 는 영역 이름으로만 남긴다 (2026-09-10 사용자 결정)
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
            icon={Megaphone}
            className="nl-home-critical"
            role="region"
            aria-label={t("announcements.critical")}
            title={
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
