"use server";

import { deleteAccount as deleteAccountService } from "@/features/profile/server/accountDeletionService";
import type { Locale } from "@/lib/i18n/routing";

export async function deleteAccount(
    confirmationInput: string,
    locale: Locale = "ko"
) {
    return deleteAccountService(confirmationInput, locale);
}
