import { NextResponse } from "next/server";

import { getPrivateImageUrl } from "@/features/admin/server/private-image-data";
import { getPrivateImageBlob } from "@/lib/blob";
import { getSessionUser } from "@/lib/user";

export const dynamic = "force-dynamic";

export async function GET(
    _request: Request,
    {
        params,
    }: {
        params: Promise<{ kind: string; id: string }>;
    }
) {
    const { session, user: admin } = await getSessionUser();
    if (!session.id) {
        return NextResponse.json(
            { message: "로그인이 필요합니다." },
            { status: 401 }
        );
    }

    if (admin?.role !== "admin") {
        return NextResponse.json(
            { message: "접근할 수 없습니다." },
            { status: 404 }
        );
    }

    const { kind, id: idValue } = await params;
    const id = Number(idValue);
    if (!Number.isInteger(id) || !["feedback", "exam"].includes(kind)) {
        return NextResponse.json(
            { message: "이미지를 찾을 수 없습니다." },
            { status: 404 }
        );
    }

    const imageUrl = await getPrivateImageUrl(
        kind === "feedback" ? "feedback" : "exam",
        id
    );

    if (!imageUrl) {
        return NextResponse.json(
            { message: "이미지가 삭제되었거나 존재하지 않습니다." },
            { status: 404 }
        );
    }

    try {
        const result = await getPrivateImageBlob(imageUrl);
        if (!result || result.statusCode !== 200) {
            return NextResponse.json(
                { message: "이미지를 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        return new Response(result.stream, {
            headers: {
                "Content-Type": result.blob.contentType,
                "Content-Length": String(result.blob.size),
                "Cache-Control": "private, no-store",
                "X-Content-Type-Options": "nosniff",
            },
        });
    } catch {
        return NextResponse.json(
            { message: "이미지를 불러오지 못했습니다." },
            { status: 502 }
        );
    }
}
