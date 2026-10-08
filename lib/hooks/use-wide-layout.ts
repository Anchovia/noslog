"use client";

import useMediaQuery from "@/lib/hooks/use-media-query";

// Shell mode follows the viewport; the centered content remains capped at 1200px.
export default function useWideLayout() {
    return useMediaQuery("(min-width: 1056px)");
}
