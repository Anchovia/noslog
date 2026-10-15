"use client";

import { useEffect, useMemo } from "react";

export default function useObjectUrl(value: Blob | null | undefined) {
    const url = useMemo(
        () => (value ? URL.createObjectURL(value) : null),
        [value]
    );

    useEffect(
        () => () => {
            if (url) URL.revokeObjectURL(url);
        },
        [url]
    );

    return url;
}
