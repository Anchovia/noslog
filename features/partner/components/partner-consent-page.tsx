import Link from "next/link";
import { redirect } from "next/navigation";

import {
    approvePartnerConsent,
    denyPartnerConsent,
    switchPartnerAccount,
} from "@/app/(auth)/authorize/actions";
import Avatar from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import AuthShell from "@/features/auth/components/auth-shell";
import { getConsentPageData } from "@/features/partner/server/consent-page-data";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";

import PartnerConsentForm from "./partner-consent-form";

/**
 * 파트너 동의 화면(/{언어}/authorize, 뮤즈캣 연동 B). /oauth/authorize 가 검사한 요청을 세션에서 읽는다.
 * 믿을 수 없는 요청 · 만료는 파트너로 돌려보내지 않고 여기서 멈춘다(RFC 9700 §4.11.2).
 */
export default async function PartnerConsentPage({
    error,
}: {
    error?: string;
}) {
    const [{ locale, t }, data] = await Promise.all([
        getServerI18n(),
        getConsentPageData(error),
    ]);
    if (data.kind === "login") {
        redirect(`${localizePath("/login", locale)}?returnTo=/authorize`);
    }
    if (data.kind === "error") {
        return (
            <AuthShell>
                <div className="nl-auth-head">
                    <h1 className="nl-page-title">
                        {t("partner.consent.errorTitle")}
                    </h1>
                    <p className="nl-metadata nl-muted">
                        {t(`partner.consent.error.${data.code}`)}
                    </p>
                    <p className="nl-metadata nl-muted">
                        {t("partner.consent.errorCode", { code: data.code })}
                    </p>
                </div>
                <Link
                    prefetch={false}
                    className="nl-auth-browse nl-control nl-link"
                    href={localizePath("/", locale)}
                >
                    {t("partner.consent.home")}
                </Link>
            </AuthShell>
        );
    }
    // 머리 = 파트너 표시 · 「○○에 내 NosLog 기록 보내기」 · 「고른 기록만 보내요」 → 계정 줄(아바타 · 이름 · 다른 계정)
    // (2026-10-21 전면 대조 ⑪ — GitHub · Google · Discord 동의 화면)
    return (
        <AuthShell>
            <div className="nl-auth-head">
                <span
                    className="nl-settings__logo nl-settings__logo--mark nl-component-title"
                    aria-hidden
                >
                    {data.clientName.slice(0, 1)}
                </span>
                <h1 className="nl-page-title">
                    {t("partner.consent.title", { client: data.clientName })}
                </h1>
                <p className="nl-metadata nl-muted">
                    {t("partner.consent.subtitle")}
                </p>
            </div>
            <div className="nl-auth-account">
                <div className="nl-auth-account-row">
                    <Avatar
                        src={data.userAvatar}
                        className="nl-avatar--compact"
                        fallbackName={data.userName}
                    />
                    <p className="nl-body nl-auth-account-row__name">
                        {data.userName}
                    </p>
                    <form action={switchPartnerAccount}>
                        <Button type="submit" variant="ghost" size="sm">
                            {t("partner.consent.otherAccount")}
                        </Button>
                    </form>
                </div>
            </div>
            <PartnerConsentForm
                requestId={data.requestId}
                clientName={data.clientName}
                host={data.host}
                wantsRecords={data.wantsRecords}
                initialItems={data.initialItems}
                scoresPrivate={data.scoresPrivate}
                activityPrivate={data.activityPrivate}
                approve={approvePartnerConsent}
                deny={denyPartnerConsent}
            />
        </AuthShell>
    );
}
