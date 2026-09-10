import { ExternalLink } from "lucide-react";

import OfficialXPostArticle from "@/components/home/officialXPostArticle";
import type { OfficialXPost as OfficialXPostData } from "@/features/home/server/officialXPostService";
import { getServerI18n } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/routing";

const OFFICIAL_X_URL = "https://x.com/NOSTALGIA_573";

function postDateTime(value: string, locale: Locale) {
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: locale === "en" ? "short" : locale === "ja" ? "long" : "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Seoul",
    }).format(new Date(value));
}

export default async function OfficialXPost({
    post,
}: {
    post: OfficialXPostData;
}) {
    const { locale, t } = await getServerI18n();
    return (
        <section className="nl-home-update">
            <div className="nl-home-update__heading">
                <h2 className="nl-component-title">{t("home.officialNews")}</h2>
                <a
                    href={OFFICIAL_X_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="nl-control"
                >
                    {t("home.officialLink")}
                    <ExternalLink aria-hidden />
                </a>
            </div>
            {post.status === "ready" ? (
                <OfficialXPostArticle
                    post={post.post}
                    locale={locale}
                    // 일본어 방문자는 원문만 본다
                    translated={
                        locale === "ja"
                            ? null
                            : (post.post.translations?.[locale] ?? null)
                    }
                    dateText={postDateTime(post.post.createdAt, locale)}
                    labels={{
                        original: t("home.officialOriginalText"),
                        translation: t("home.officialShowTranslation"),
                        postLink: t("home.officialPostLink"),
                    }}
                />
            ) : (
                <p className="nl-home-news-state nl-body-secondary nl-muted">
                    {t(
                        post.status === "empty"
                            ? "home.newsEmpty"
                            : "home.newsError"
                    )}
                </p>
            )}
        </section>
    );
}
