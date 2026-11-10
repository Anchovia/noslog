"use server";

import { deleteAccount as deleteAccountService } from "@/features/settings/server/account-deletion-service";
import type { Locale } from "@/lib/i18n/routing";

export async function deleteAccount(
    confirmationInput: string,
    locale: Locale = "ko"
) {
    return deleteAccountService(confirmationInput, locale);
}
