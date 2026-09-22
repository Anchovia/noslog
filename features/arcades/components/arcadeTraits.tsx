"use client";
import {
    Armchair,
    Cigarette,
    CreditCard,
    Headphones,
    IdCard,
    Lock,
    Radio,
    SquareParking,
    Toilet,
    Wifi,
    type LucideIcon,
} from "lucide-react";
import { useTranslations } from "@/components/i18n/localeProvider";
import { ARCADE_CABINET_FEATURES } from "@/lib/arcadeDetails";
import type { MessageKey } from "@/lib/i18n/messages";
import type {
    ArcadeCabinet,
    PublicArcade,
} from "@/features/arcades/schemas/publicArcadeSchema";

/**
 * 오락실 시설 · 기체 태그 · 기체 특징(2026-09-22 사용자 결정 B2 · S1 · V2 · L1).
 * 있다 / 없다 = 아이콘 + 글자(시설 · 태그), 정도 = 정해진 보기 키-값(특징). 입력한 것만, 없으면 자리 없음
 */
const FACILITY_ICONS: Record<PublicArcade["facilities"][number], LucideIcon> = {
    parking: SquareParking,
    smoking: Cigarette,
    wifi: Wifi,
    restroom: Toilet,
    card_sales: IdCard,
    locker: Lock,
};

const CABINET_TAG_ICONS: Record<ArcadeCabinet["tags"][number], LucideIcon> = {
    broadcast: Radio,
    headphone: Headphones,
    seat: Armchair,
    card_payment: CreditCard,
};

// 특징 보기의 번역 키 — 항목마다 보기가 달라 조합 대신 표로 둔다(없는 조합을 타입으로 막음)
const FEATURE_VALUE_KEYS = {
    keyWeight: {
        light: "arcades.feature.keyWeight.light",
        normal: "arcades.feature.keyWeight.normal",
        heavy: "arcades.feature.keyWeight.heavy",
    },
    screenLag: {
        low: "arcades.feature.screenLag.low",
        normal: "arcades.feature.screenLag.normal",
        high: "arcades.feature.screenLag.high",
    },
    soundVolume: {
        low: "arcades.feature.soundVolume.low",
        normal: "arcades.feature.soundVolume.normal",
        high: "arcades.feature.soundVolume.high",
    },
} as const satisfies {
    [K in keyof ArcadeCabinet["features"]]: Record<
        NonNullable<ArcadeCabinet["features"][K]>,
        MessageKey
    >;
};

/** 「시설」 구역 안 — 아이콘 20 · 글자 본문 보조, 두 열 */
export function ArcadeFacilities({
    facilities,
}: {
    facilities: PublicArcade["facilities"];
}) {
    const t = useTranslations();
    return (
        <ul className="nl-arcade-facilities nl-body-secondary">
            {facilities.map((facility) => {
                const Icon = FACILITY_ICONS[facility];
                return (
                    <li key={facility}>
                        <Icon className="nl-icon" aria-hidden />
                        {t(`arcades.facility.${facility}`)}
                    </li>
                );
            })}
        </ul>
    );
}

/** 기체 카드 안 태그 — 아이콘 16 · 글자 metadata 흐림(위치 메모 · 확인 시각과 같은 급) */
export function CabinetTags({ tags }: { tags: ArcadeCabinet["tags"] }) {
    const t = useTranslations();
    if (!tags.length) return null;
    return (
        <ul
            className="nl-arcade-cabinet__tags nl-metadata nl-muted"
            aria-label={t("arcades.cabinetTags")}
        >
            {tags.map((tag) => {
                const Icon = CABINET_TAG_ICONS[tag];
                return (
                    <li key={tag}>
                        <Icon className="nl-icon-small" aria-hidden />
                        {t(`arcades.cabinetTag.${tag}`)}
                    </li>
                );
            })}
        </ul>
    );
}

/** 기체 카드 안 특징 — 한 단 낮은 판 안 키-값(모르는 항목은 줄 없음) + 맨 아래 기타 글 */
export function CabinetFeatures({
    features,
    note,
}: {
    features: ArcadeCabinet["features"];
    note: string | null;
}) {
    const t = useTranslations();
    const valueKey = {
        keyWeight: features.keyWeight
            ? FEATURE_VALUE_KEYS.keyWeight[features.keyWeight]
            : null,
        screenLag: features.screenLag
            ? FEATURE_VALUE_KEYS.screenLag[features.screenLag]
            : null,
        soundVolume: features.soundVolume
            ? FEATURE_VALUE_KEYS.soundVolume[features.soundVolume]
            : null,
    };
    const rows = ARCADE_CABINET_FEATURES.flatMap((feature) => {
        const message = valueKey[feature.key];
        return message ? [{ key: feature.key, message }] : [];
    });
    if (!rows.length && !note) return null;
    return (
        <div
            className="nl-arcade-cabinet__features nl-body-secondary"
            role="group"
            aria-label={t("arcades.cabinetFeatures")}
        >
            {rows.length ? (
                <dl>
                    {rows.map((row) => (
                        <div key={row.key}>
                            <dt>{t(`arcades.feature.${row.key}`)}</dt>
                            <dd>{t(row.message)}</dd>
                        </div>
                    ))}
                </dl>
            ) : null}
            {note ? (
                <p className="nl-arcade-cabinet__feature-note">
                    <span className="sr-only">
                        {t("arcades.featureNote")} ·{" "}
                    </span>
                    {note}
                </p>
            ) : null}
        </div>
    );
}
