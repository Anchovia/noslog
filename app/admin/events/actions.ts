"use server";

import { reviewEvent as reviewEventService } from "@/features/events/server/eventAdminService";

export async function reviewEvent(formData: FormData) {
    return reviewEventService(formData);
}
