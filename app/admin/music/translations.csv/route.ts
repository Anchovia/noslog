import type { NextRequest } from "next/server";

import { createMusicTranslationCsvExport } from "@/features/music/server/musicTranslationAdminService";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    const { csv, filename } = await createMusicTranslationCsvExport(
        request.nextUrl.searchParams.get("locale"),
        request.nextUrl.searchParams.get("status")
    );

    return new Response(csv, {
        headers: {
            "Cache-Control": "private, no-store",
            "Content-Disposition": 'attachment; filename="' + filename + '"',
            "Content-Type": "text/csv; charset=utf-8",
            "X-Content-Type-Options": "nosniff",
        },
    });
}
