"use client";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "@/components/i18n/localeProvider";
import type { PublicArcade } from "@/features/arcades/schemas/publicArcadeSchema";

export default function ArcadeContactDetails({
    arcade,
    className,
}: {
    arcade: PublicArcade;
    className?: string;
}) {
    const t = useTranslations();
    const telephone = arcade.phone?.replace(/[^+\d]/g, "");
    return (
        <>
            {arcade.phone ? (
                <div className={className}>
                    <dt className="nl-control">{t("arcades.phone")}</dt>
                    <dd className="nl-body">
                        {telephone && /\d/.test(telephone) ? (
                            <a href={`tel:${telephone}`}>{arcade.phone}</a>
                        ) : (
                            arcade.phone
                        )}
                    </dd>
                </div>
            ) : null}
            {arcade.website ? (
                <div className={className}>
                    <dt className="nl-control">{t("arcades.website")}</dt>
                    <dd className="nl-body">
                        <a href={arcade.website}>
                            {arcade.website.replace(/^https?:\/\//, "")}
                            <ExternalLink className="nl-icon" aria-hidden />
                            <span className="sr-only">
                                {" "}
                                · {t("shell.externalLink")}
                            </span>
                        </a>
                    </dd>
                </div>
            ) : null}
        </>
    );
}
