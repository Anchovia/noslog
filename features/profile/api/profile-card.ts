import { queryOptions } from "@tanstack/react-query";

export function profileCardOptions(imageUrl: string) {
    return queryOptions({
        queryKey: ["profile-card-preview", imageUrl],
        queryFn: async ({ signal }) => {
            const response = await fetch(imageUrl, {
                signal,
                cache: "no-store",
            });
            if (!response.ok)
                throw new Error("Profile card generation failed.");
            const blob = await response.blob();
            if (blob.type !== "image/png")
                throw new Error("Profile card is not a PNG image.");
            return blob;
        },
        staleTime: 0,
        gcTime: 0,
        retry: false,
    });
}
