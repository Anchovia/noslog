import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackLink from "@/components/ui/backLink";
import PrivacyPage from "@/features/privacy/components/privacyPage";
import {
    getPrivacyVersion,
    getPrivacyVersionCopy,
    privacyHistoryCopy,
    privacyVersionPeriod,
} from "@/features/privacy/content/privacyContent";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata/site";
import getSession from "@/lib/session";

type Props = { params: Promise<{ version: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const [{ version: id }, { locale }] = await Promise.all([
        params,
        getServerI18n(),
    ]);
    const version = getPrivacyVersion(id);
    if (!version) return {};
    return createPageMetadata({
        title: `${getPrivacyVersionCopy(version, locale).title} · ${privacyVersionPeriod(version, locale)}`,
        path: localizePath(`/privacy/history/${version.id}`, locale),
    });
}

// 이전 시행 버전 — 보관한 방침을 현재 방침과 같은 모양으로 보여 주고 머리에 적용 기간을 적는다
export default async function PrivacyVersionPage({ params }: Props) {
    const [{ version: id }, { locale }, session] = await Promise.all([
        params,
        getServerI18n(),
        getSession(),
    ]);
    const version = getPrivacyVersion(id);
    if (!version) notFound();
    const history = privacyHistoryCopy[locale];
    return (
        <PrivacyPage
            locale={locale}
            isAuthenticated={!!session.id}
            copy={getPrivacyVersionCopy(version, locale)}
            period={history.period(privacyVersionPeriod(version, locale))}
            back={
                <BackLink href={localizePath("/privacy/history", locale)}>
                    {history.title}
                </BackLink>
            }
        />
    );
}
