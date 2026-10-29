import { randomBytes } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import {
    buildAuthorizationResponseUrl,
    validateAuthorizeRequest,
} from "@/features/partner/server/oauth-authorize";
import { getOAuthIssuer } from "@/features/partner/server/oauth-issuer";
import {
    approveAuthorization,
    findActiveGrant,
    getAuthorizeClient,
} from "@/features/partner/server/oauth-service";
import {
    isLocale,
    LOCALE_COOKIE_NAME,
    localeFromAcceptLanguage,
    localizePath,
} from "@/lib/i18n/routing";
import getSession from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * 파트너 인가 요청(뮤즈캣 연동 B). 검사 → 로그인 확인 → 동의 화면(/{언어}/authorize).
 * 같은 범위를 이미 허락한 연결이면 다시 묻지 않고 code 를 낸다(prompt=consent 면 늘 묻는다).
 * 모든 리다이렉트는 303(RFC 9700 §4.12), 응답에는 iss(RFC 9207).
 */
export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const issuer = getOAuthIssuer(request.url);
    const session = await getSession();
    const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
    const locale = isLocale(session.locale)
        ? session.locale
        : isLocale(cookieLocale)
          ? cookieLocale
          : localeFromAcceptLanguage(request.headers.get("accept-language"));
    const client = await getAuthorizeClient(params.get("client_id"));
    const result = validateAuthorizeRequest(params, client);

    if (result.kind === "stop") {
        const url = new URL(localizePath("/authorize", locale), request.url);
        url.searchParams.set("error", result.error);
        return NextResponse.redirect(url, 303);
    }
    if (result.kind === "redirect-error") {
        return NextResponse.redirect(
            buildAuthorizationResponseUrl(result.redirectUri, issuer, {
                error: result.error,
                error_description: result.description,
                state: result.state,
            }),
            303
        );
    }

    session.oauthAuthorize = {
        clientId: result.clientId,
        redirectUri: result.redirectUri,
        scopes: result.scopes,
        state: result.state,
        codeChallenge: result.codeChallenge,
        requestId: randomBytes(16).toString("base64url"),
        createdAt: Date.now(),
    };
    await session.save();

    if (!session.id || !session.profileCompleted) {
        const login = new URL(localizePath("/login", locale), request.url);
        login.searchParams.set("returnTo", "/authorize");
        return NextResponse.redirect(login, 303);
    }

    const grant =
        params.get("prompt") === "consent"
            ? null
            : await findActiveGrant(session.id, result.clientId);
    if (grant && result.scopes.every((scope) => grant.scopes.includes(scope))) {
        const code = await approveAuthorization({
            userId: session.id,
            clientId: result.clientId,
            scopes: result.scopes,
            grantScopes: grant.scopes,
            sharedItems: grant.sharedItems,
            redirectUri: result.redirectUri,
            codeChallenge: result.codeChallenge,
        });
        delete session.oauthAuthorize;
        await session.save();
        return NextResponse.redirect(
            buildAuthorizationResponseUrl(result.redirectUri, issuer, {
                code,
                state: result.state,
            }),
            303
        );
    }

    return NextResponse.redirect(
        new URL(localizePath("/authorize", locale), request.url),
        303
    );
}
