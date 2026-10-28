"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { disconnectMusecat } from "@/features/musecat/server/musecat-connection-service";
import {
    revokeGrantByUser,
    updateSharedItems,
} from "@/features/partner/server/oauth-service";
import {
    dispatchPartnerOutbox,
    PARTNER_SHARE_ITEMS,
} from "@/features/partner/server/partner-outbox";
import { MUSECAT_OAUTH_CLIENT_ID } from "@/features/partner/server/partner-settings-data";
import getSession from "@/lib/session";

/** 아직 형식을 맞추기 전이라 저장하지 않는 항목 */
const UNAVAILABLE = ["song_records"];

/** 보낼 항목 바꾸기 — 줄었으면 뮤즈캣 캐시 무효화를 같은 트랜잭션에서 outbox 에 넣고, 응답 뒤 바로 한 번 보낸다 */
export async function updateMusecatSharedItems(items: string[]) {
    const session = await getSession();
    if (!session.id) return { ok: false as const };
    const next = PARTNER_SHARE_ITEMS.filter(
        (item) => items.includes(item) && !UNAVAILABLE.includes(item)
    );
    const saved = await updateSharedItems(
        session.id,
        MUSECAT_OAUTH_CLIENT_ID,
        next
    );
    if (!saved) return { ok: false as const };
    after(() => dispatchPartnerOutbox().catch(() => null));
    revalidatePath("/settings");
    return { ok: true as const };
}

/** 뮤즈캣과의 연결 모두 끊기 — B(기록 읽기)와 A(내 뮤즈캣 계정) 둘 다. NosLog 쪽은 바로 막는다 */
export async function disconnectMusecatAll() {
    const session = await getSession();
    if (!session.id) return { ok: false as const };
    await revokeGrantByUser(session.id, MUSECAT_OAUTH_CLIENT_ID);
    await disconnectMusecat(session.id);
    after(() => dispatchPartnerOutbox().catch(() => null));
    revalidatePath("/settings");
    return { ok: true as const };
}
