import { ChevronDown, Megaphone } from "lucide-react";
import { getServerI18n } from "@/lib/i18n/server";

interface HomeAnnouncementsProps {
    announcements: {
        id: number;
        title: string;
        content: string;
        publishedAt: string | null;
    }[];
}

export default async function HomeAnnouncements({
    announcements,
}: HomeAnnouncementsProps) {
    if (announcements.length === 0) return null;

    const { locale, t } = await getServerI18n();
    const dateFormatter = new Intl.DateTimeFormat(
        locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }
    );

    return (
        <section className="bg-surface rounded-card overflow-hidden">
            <header className="border-divider flex h-10 items-center gap-2 border-b px-3">
                <Megaphone className="text-basic size-4" aria-hidden="true" />
                <h2 className="text-section">{t("home.announcements")}</h2>
            </header>
            {announcements.map((announcement, index) => (
                <details
                    key={announcement.id}
                    className={`group ${index > 0 ? "border-divider border-t" : ""}`}
                >
                    <summary className="hover:bg-surface-muted flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 py-2 transition-colors [&::-webkit-details-marker]:hidden">
                        <strong className="text-body min-w-0 flex-1 truncate font-semibold">
                            {announcement.title}
                        </strong>
                        {announcement.publishedAt ? (
                            <time className="text-caption shrink-0 tabular-nums">
                                {dateFormatter.format(
                                    new Date(announcement.publishedAt)
                                )}
                            </time>
                        ) : null}
                        <ChevronDown className="text-text-disabled size-4 shrink-0 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="border-divider text-body-muted border-t px-3 py-3 whitespace-pre-wrap">
                        {announcement.content}
                    </p>
                </details>
            ))}
        </section>
    );
}
