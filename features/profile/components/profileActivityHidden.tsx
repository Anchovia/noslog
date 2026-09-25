"use client";

import { Lock } from "lucide-react";

import { useTranslations } from "@/components/i18n/localeProvider";
import { StatusMessage } from "@/components/ui/statusMessage";

/** 「플레이 활동 비공개」 프로필의 활동 탭 주소 — 탭은 없고, 들어오면 잠금 한 줄(점수 비공개 잠금과 같은 모양) */
export default function ProfileActivityHidden() {
    const t = useTranslations();
    return (
        <div className="nl-profile-empty">
            <StatusMessage icon={Lock} title={t("profile.activity.hidden")} />
        </div>
    );
}
