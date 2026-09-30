"use client";

import { Toaster } from "sonner";
import { useTranslations } from "@/components/i18n/localeProvider";
import useAccountResultNotice from "@/features/settings/hooks/useAccountResultNotice";

export default function AppToaster() {
    const t = useTranslations();
    useAccountResultNotice();

    // 알림 = 떠 있는 창 규격 · 색은 아이콘에만(2026-10-01) — foundation.css `nl-toast`. 토큰이 걸리게 noslog-ui 안에 둔다(포털과 같은 방식)
    return (
        <div className="noslog-ui">
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
                        toast: "nl-toast",
                        title: "nl-emphasis-label",
                        content: "nl-toast__content",
                        icon: "nl-toast__icon",
                        success: "nl-toast--success",
                        error: "nl-toast--error",
                    },
                }}
            />
        </div>
    );
}
