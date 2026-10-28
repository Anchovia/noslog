"use client";

import { Toaster } from "sonner";

import { useTranslations } from "@/components/i18n/locale-provider";
import useAccountResultNotice from "@/features/settings/hooks/use-account-result-notice";

export default function AppToaster() {
    const t = useTranslations();
    useAccountResultNotice();

    // 알림 = 떠 있는 창 규격 · 글자만(상태 메시지와 같이 색 아이콘 없음) — foundation.css `nl-toast`.
    // 토큰이 걸리게 noslog-ui 안에 둔다(포털과 같은 방식). 가장자리 거리도 그래서 토큰 이름으로 준다
    return (
        <div className="noslog-ui">
            <Toaster
                position="top-center"
                duration={3000}
                visibleToasts={3}
                offset="var(--nl-spacing-16)"
                mobileOffset="var(--nl-spacing-16)"
                containerAriaLabel={t("common.notifications")}
                icons={{
                    success: null,
                    info: null,
                    warning: null,
                    error: null,
                }}
                toastOptions={{
                    unstyled: true,
                    classNames: {
                        toast: "nl-toast",
                        title: "nl-emphasis-label",
                        content: "nl-toast__content",
                    },
                }}
            />
        </div>
    );
}
