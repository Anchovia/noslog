"use client";

import { put } from "@vercel/blob/client";

interface ClientImageUploadGrant {
    pathname: string;
    token: string;
}

export async function uploadGrantedImage(
    file: File,
    grant: ClientImageUploadGrant,
    access: "public" | "private"
) {
    const blob = await put(grant.pathname, file, {
        access,
        token: grant.token,
        contentType: file.type,
    });

    return blob.url;
}
