import { createBrandIcon } from "@/lib/metadata/brandImage";

export const dynamic = "force-static";

// 설치 아이콘 192(2026-10-01 메타데이터 점검 E1 — web.dev 설치 기준: 192 · 512 필수). 512 는 app/icon
export function GET() {
    return createBrandIcon(192);
}
