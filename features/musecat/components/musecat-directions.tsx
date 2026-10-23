"use client";

import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useTranslations } from "@/components/i18n/locale-provider";
import Button from "@/components/ui/button";
import ModalDialog from "@/components/ui/modal-dialog";
import { arcadeDirectionLinks } from "@/features/arcades/arcade-discovery";
import type { PublicArcade } from "@/features/arcades/schemas/public-arcade-schema";

/**
 * 길찾기(뮤즈캣 시안 ③ · ⑤, 2026-10-21 전면 대조 ⑨ — 카카오 · 네이버 장소 화면) — 누르면 시트: 주소 + 복사 → 지도 앱 줄(앱 첫 글자 · 이름 · 바깥 링크).
 * 국내는 네이버 · 카카오 · Google · Apple, 해외는 Google · Apple.
 * 폐업한 오락실은 먼저 「그래도 길찾기를 열까요?」 확인 시트. 트리거 모양은 부르는 곳이 정한다(칩 줄 · 하단 바)
 */
export default function MusecatDirections({
    arcade,
    closed,
    size,
    className,
}: {
    arcade: PublicArcade;
    closed: boolean;
    size?: "sm";
    className?: string;
}) {
    const t = useTranslations();
    const links = arcadeDirectionLinks(arcade);
    const [step, setStep] = useState<"none" | "confirm" | "menu">("none");
    return (
        <>
            <Button
                size={size}
                className={className}
                disabled={!links.length}
                onClick={() => setStep(closed ? "confirm" : "menu")}
            >
                {t("arcades.directions")}
            </Button>
            <ModalDialog
                open={step === "confirm"}
                onOpenChange={(open) => setStep(open ? "confirm" : "none")}
                sheet
                size="small"
                variant="confirm"
                title={t("musecat.closedDirections.title")}
                description={t("musecat.closedDirections.body")}
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setStep("none")}
                        >
                            {t("settings.cancel")}
                        </Button>
                        <Button onClick={() => setStep("menu")}>
                            {t("musecat.closedDirections.open")}
                        </Button>
                    </>
                }
            />
            <ModalDialog
                open={step === "menu"}
                onOpenChange={(open) => setStep(open ? "menu" : "none")}
                sheet
                size="small"
                title={t("arcades.directions")}
            >
                <div className="nl-musecat-head">
                    {arcade.address ? (
                        <div className="nl-heading-row">
                            <span className="nl-body-secondary nl-muted">
                                {arcade.address}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="nl-heading-row__end"
                                aria-label={`${arcade.address} · ${t("arcades.copyAddress")}`}
                                onClick={async () => {
                                    try {
                                        await navigator.clipboard.writeText(
                                            arcade.address!
                                        );
                                        toast.success(t("musecat.copied"));
                                    } catch {
                                        toast.error(t("arcades.copyFailed"));
                                    }
                                }}
                            >
                                <Copy className="nl-icon-small" aria-hidden />
                                {t("musecat.copy")}
                            </Button>
                        </div>
                    ) : null}
                    <ul className="nl-musecat-lines">
                        {links.map((link) => {
                            const name = t(`musecat.directions.${link.key}`);
                            return (
                                <li key={link.key}>
                                    <a
                                        className="nl-musecat-line nl-hover-layer"
                                        href={link.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={() => setStep("none")}
                                    >
                                        <span
                                            className="nl-musecat-app-mark nl-tag-label"
                                            aria-hidden
                                        >
                                            {name.slice(0, 1)}
                                        </span>
                                        <span className="nl-control nl-musecat-line__copy">
                                            {name}
                                        </span>
                                        <ExternalLink
                                            className="nl-icon-small nl-muted"
                                            aria-hidden
                                        />
                                        <span className="sr-only">
                                            {" "}
                                            · {t("shell.externalLink")}
                                        </span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </ModalDialog>
        </>
    );
}
