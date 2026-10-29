"use server";

import { redirect } from "next/navigation";
import { after } from "next/server";

import {
    consentRequestMatches,
    readPendingConsent,
} from "@/features/partner/server/consent-page-data";
import {
    buildAuthorizationResponseUrl,
    type OAuthScope,
} from "@/features/partner/server/oauth-authorize";
import { getRequestOAuthIssuer } from "@/features/partner/server/oauth-issuer";
import { approveAuthorization } from "@/features/partner/server/oauth-service";
import {
    dispatchPartnerOutbox,
    PARTNER_SHARE_ITEMS,
    type PartnerShareItemName,
} from "@/features/partner/server/partner-outbox";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";

/** 지금은 보낼 수 없는 항목(뮤즈캣과 형식을 맞추기 전) — 골라도 저장하지 않는다 */
const UNAVAILABLE_ITEMS: PartnerShareItemName[] = ["song_records"];

/**
 * 다른 계정으로(2026-10-21 전면 대조 ⑪) — 로그인 정보만 지우고 기다리던 동의 요청 · 언어는 남긴 뒤 로그인으로.
 * 로그인하면 같은 동의 화면으로 돌아온다(요청 수명 10분은 그대로)
 */
export async function switchPartnerAccount() {
    const { session, pending } = await readPendingConsent();
    const { locale } = await getServerI18n();
    if (!pending)
        redirect(`${localizePath("/authorize", locale)}?error=expired`);
    const keep = { locale: session.locale, oauthAuthorize: pending };
    for (const key of Object.keys(session) as (keyof typeof session)[]) {
        if (typeof session[key] !== "function") delete session[key];
    }
    Object.assign(session, keep);
    await session.save();
    redirect(`${localizePath("/login", locale)}?returnTo=/authorize`);
}

/**
 * 동의 → code 를 붙여 파트너로 303(Server Action redirect).
 * 화면을 연 뒤 다른 요청이 세션의 대기 요청을 바꿨으면 code 를 내지 않고 지금 기다리는 요청 화면을 다시 보인다
 */
export async function approvePartnerConsent(formData: FormData) {
    const { session, pending } = await readPendingConsent();
    const { locale } = await getServerI18n();
    if (!pending || !session.id) {
        redirect(`${localizePath("/authorize", locale)}?error=expired`);
    }
    if (!consentRequestMatches(formData.get("requestId"), pending)) {
        redirect(localizePath("/authorize", locale));
    }
    const chosen = formData.getAll("item").map(String);
    const sharedItems = pending.scopes.includes("nostalgia:read")
        ? PARTNER_SHARE_ITEMS.filter(
              (item) =>
                  chosen.includes(item) && !UNAVAILABLE_ITEMS.includes(item)
          )
        : [];
    const code = await approveAuthorization({
        userId: session.id,
        clientId: pending.clientId,
        scopes: pending.scopes as OAuthScope[],
        sharedItems,
        redirectUri: pending.redirectUri,
        codeChallenge: pending.codeChallenge,
    });
    // 항목을 줄여 다시 동의했으면 무효화 알림이 outbox 에 들어 있다 — 설정 화면과 같이 바로 보낸다
    after(() => dispatchPartnerOutbox().catch(() => null));
    delete session.oauthAuthorize;
    await session.save();
    redirect(
        buildAuthorizationResponseUrl(
            pending.redirectUri,
            await getRequestOAuthIssuer(),
            { code, state: pending.state }
        ).toString()
    );
}

/** 취소 → error=access_denied 로 돌려보낸다(RFC 6749 §4.1.2.1). 화면에 보인 요청이 아니면 동의와 같이 다시 보인다 */
export async function denyPartnerConsent(formData: FormData) {
    const { session, pending } = await readPendingConsent();
    const { locale } = await getServerI18n();
    if (!pending) redirect(localizePath("/", locale));
    if (!consentRequestMatches(formData.get("requestId"), pending)) {
        redirect(localizePath("/authorize", locale));
    }
    delete session.oauthAuthorize;
    await session.save();
    redirect(
        buildAuthorizationResponseUrl(
            pending.redirectUri,
            await getRequestOAuthIssuer(),
            { error: "access_denied", state: pending.state }
        ).toString()
    );
}
