"use client";

import { useEffect, useRef, useState } from "react";
import ModalDialog from "@/components/ui/modalDialog";
import Button from "@/components/ui/Button";
import { useTranslations } from "@/components/i18n/localeProvider";

export default function UnsavedChangesGuard({
    dirty,
    busy = false,
}: {
    dirty: boolean;
    busy?: boolean;
}) {
    const t = useTranslations();
    const [destination, setDestination] = useState<string | null>(null);
    const cancel = useRef<HTMLButtonElement>(null);
    const origin = useRef<HTMLElement | null>(null);
    const leaving = useRef(false);
    useEffect(() => {
        if (!dirty) return;
        const unload = (event: BeforeUnloadEvent) => {
            if (leaving.current) return;
            event.preventDefault();
            event.returnValue = "";
        };
        const navigate = (event: MouseEvent) => {
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            )
                return;
            const link =
                event.target instanceof Element
                    ? event.target.closest<HTMLAnchorElement>("a[href]")
                    : null;
            if (
                !link ||
                link.target === "_blank" ||
                link.hasAttribute("download")
            )
                return;
            const target = new URL(link.href, location.href);
            if (target.protocol !== "http:" && target.protocol !== "https:")
                return;
            if (
                target.origin === location.origin &&
                target.pathname === location.pathname &&
                target.search === location.search
            )
                return;
            event.preventDefault();
            event.stopPropagation();
            if (busy) return;
            origin.current = link;
            setDestination(target.href);
        };
        window.addEventListener("beforeunload", unload);
        document.addEventListener("click", navigate, true);
        return () => {
            window.removeEventListener("beforeunload", unload);
            document.removeEventListener("click", navigate, true);
        };
    }, [dirty, busy]);
    return (
        <ModalDialog
            className="nl-settings-dialog"
            open={Boolean(destination)}
            onOpenChange={(open) => {
                if (!open) setDestination(null);
            }}
            title={t("settings.unsaved")}
            description={t("settings.leaveWarning")}
            showClose={false}
            onOpenAutoFocus={(event) => {
                event.preventDefault();
                cancel.current?.focus();
            }}
            onCloseAutoFocus={(event) => {
                event.preventDefault();
                origin.current?.focus();
            }}
            footer={
                <>
                    <Button
                        ref={cancel}
                        appearance="foundation"
                        size="sm"
                        variant="secondary"
                        onClick={() => setDestination(null)}
                    >
                        {t("settings.stay")}
                    </Button>
                    <Button
                        appearance="foundation"
                        size="sm"
                        onClick={() => {
                            if (destination) {
                                leaving.current = true;
                                window.location.assign(destination);
                            }
                        }}
                    >
                        {t("settings.leave")}
                    </Button>
                </>
            }
        />
    );
}
