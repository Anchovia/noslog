import { NextResponse } from "next/server";

import { getOAuthIssuer } from "@/features/partner/server/oauth-issuer";
import { buildAuthorizationServerMetadata } from "@/features/partner/server/oauth-metadata";

export const dynamic = "force-dynamic";

/** RFC 8414 인가 서버 메타데이터 — 뮤즈캣이 issuer · 엔드포인트를 확인한다 */
export function GET(request: Request) {
    return NextResponse.json(
        buildAuthorizationServerMetadata(getOAuthIssuer(request.url)),
        { headers: { "Cache-Control": "public, max-age=3600" } }
    );
}
