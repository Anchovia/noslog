import "server-only";

import { serverEnv } from "@/lib/env/server";

/** 없으면 지금 NosLog 오락실 화면, mock 은 흉내 데이터, live 는 실제 뮤즈캣(2026-10-20 사용자 결정) */
export type MusecatMode = "off" | "mock" | "live";

export function getMusecatMode(): MusecatMode {
    return serverEnv.MUSECAT_MODE ?? "off";
}
