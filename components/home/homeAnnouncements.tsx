import { ChevronDown, Megaphone } from "lucide-react";

interface HomeAnnouncementsProps {
    announcements: {
        id: number;
        title: string;
        content: string;
        publishedAt: string | null;
    }[];
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

export default function HomeAnnouncements({
    announcements,
}: HomeAnnouncementsProps) {
    if (announcements.length === 0) return null;

    return (
        <section className="bg-surface rounded-card overflow-hidden">
            <header className="border-divider flex h-10 items-center gap-2 border-b px-3">
                <Megaphone className="text-basic size-4" aria-hidden="true" />
                <h2 className="text-section">공지사항</h2>
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
