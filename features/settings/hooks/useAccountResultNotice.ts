"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/components/i18n/localeProvider";

export default function useAccountResultNotice() {
    const t = useTranslations();
    const pathname = usePathname();
    const consumed = useRef(false);
    useEffect(() => {
        if (consumed.current) return;
        const url = new URL(window.location.href);
        if (!/^\/(ko|ja|en)\/?$/.test(url.pathname)) return;
        const status = url.searchParams.get("accountStatus");
        if (status !== "logged-out" && status !== "deleted") return;
        // This parent effect runs after the Toaster child's subscription effect.
        consumed.current = true;
        url.searchParams.delete("accountStatus");
        window.history.replaceState(window.history.state, "", url);
        toast.success(
            t(status === "deleted" ? "settings.deleted" : "settings.loggedOut")
        );
    }, [t, pathname]);
}
