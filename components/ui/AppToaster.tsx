"use client";

import { Toaster } from "sonner";
import { useTranslations } from "@/components/i18n/localeProvider";

export default function AppToaster() {
    const t = useTranslations();

    return (
        <Toaster
            position="bottom-center"
            duration={3000}
            visibleToasts={3}
            offset={16}
            mobileOffset={16}
            containerAriaLabel={t("common.notifications")}
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: "border-border bg-surface text-text-primary rounded-card flex w-full items-center gap-3 border px-4 py-3 shadow-xl",
                    title: "text-sm font-semibold",
                    content: "min-w-0",
                    icon: "shrink-0",
                    success: "bg-success/10",
                    error: "border-danger/40 bg-danger/10",
                },
            }}
        />
    );
}
