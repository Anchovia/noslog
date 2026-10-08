"use server";

import { reviewEvent as reviewEventService } from "@/features/events/server/event-admin-service";

export async function reviewEvent(formData: FormData) {
    return reviewEventService(formData);
}
