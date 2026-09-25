"use client";

import { Lock } from "lucide-react";

import { useTranslations } from "@/components/i18n/localeProvider";

/** 「나에게만 보입니다」 — 공개 설정으로 숨긴 구역을 본인이 볼 때 제목 아래 한 줄(2026-09-26 P1) */
export default function ProfileOnlyMe() {
    const t = useTranslations();
    return (
        <p className="nl-profile-only-me nl-metadata nl-muted">
            <Lock aria-hidden />
            {t("profile.onlyMe")}
        </p>
    );
}
