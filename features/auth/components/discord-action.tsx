"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "@/components/i18n/locale-provider";
import ButtonLink from "@/components/ui/button-link";
import DiscordIcon from "@/components/ui/discord-icon";

export default function DiscordAction({ returnPath }: { returnPath: string }) {
    const t = useTranslations();
    const [pending, setPending] = useState(false);
    useEffect(() => {
        const restore = () => setPending(false);
        window.addEventListener("pageshow", restore);
        return () => window.removeEventListener("pageshow", restore);
    }, []);
    return (
        <>
            <ButtonLink
                plain
                variant="secondary"
                className="nl-auth-discord"
                href={`/discord/start?returnTo=${encodeURIComponent(returnPath)}`}
                aria-disabled={pending || undefined}
                aria-busy={pending}
                onClick={(event) => {
                    if (pending) {
                        event.preventDefault();
                        return;
                    }
                    if (
                        !event.metaKey &&
                        !event.ctrlKey &&
                        !event.shiftKey &&
                        !event.altKey
                    )
                        setPending(true);
                }}
            >
                <DiscordIcon className="nl-icon" />
                {t("auth.continueDiscord")}
            </ButtonLink>
            <span className="sr-only" role="status">
                {pending ? t("auth.openingDiscord") : ""}
            </span>
        </>
    );
}
