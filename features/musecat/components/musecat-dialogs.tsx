"use client";

import { ExternalLink, Plus, X } from "lucide-react";
import { type ReactNode, useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { submitArcadeReport } from "@/app/(site)/gamecenter/actions";
import {
    editMusecatNostalgiaGame,
    reportMusecatFault,
} from "@/app/(site)/gamecenter/musecat-actions";
import { useLocale, useTranslations } from "@/components/i18n/locale-provider";
import ActionButton from "@/components/ui/action-button";
import ButtonLink from "@/components/ui/button-link";
import FileRow from "@/components/ui/file-row";
import { FormField, Input, TextArea } from "@/components/ui/form-field";
import IconButton from "@/components/ui/icon-button";
import LoginPrompt from "@/components/ui/login-prompt";
import ModalDialog from "@/components/ui/modal-dialog";
import RadioGroup from "@/components/ui/radio-group";
import ResponsiveDialog from "@/components/ui/responsive-dialog";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { StatusMessage } from "@/components/ui/status-message";
import Stepper from "@/components/ui/stepper";
import UnitInput from "@/components/ui/unit-input";
import { FEATURE_VALUE_KEYS } from "@/features/arcades/components/arcade-traits";
import type { PublicArcade } from "@/features/arcades/schemas/public-arcade-schema";
import {
    MUSECAT_DISRUPTIONS,
    type MusecatDisruption,
    type MusecatGame,
} from "@/features/musecat/musecat-arcade";
import { ARCADE_CABINET_FEATURES } from "@/lib/arcade-details";
import {
    IMAGE_ACCEPT,
    imageFileValidationError,
} from "@/lib/image-upload-rules";

/** 동작 결과 → 원인별 문구(401 다시 연결 · 403 방문 인증 · 409 다시 불러오기 · 429 기다리기, 2026-10-20 시안) */
export function musecatErrorKey(error: string) {
    switch (error) {
        case "login":
            return "musecat.error.login" as const;
        case "not_connected":
            return "musecat.error.notConnected" as const;
        case "needs_reconnect":
            return "musecat.error.reconnect" as const;
        case "visit_required":
            return "musecat.error.visitRequired" as const;
        case "conflict":
            return "musecat.error.conflict" as const;
        case "rate_limited":
            return "musecat.error.rateLimited" as const;
        case "unsupported":
            return "musecat.error.unsupported" as const;
        case "invalid":
            return "musecat.error.invalid" as const;
        default:
            return "musecat.error.failed" as const;
    }
}

export interface MusecatLinks {
    loggedIn: boolean;
    loginHref: string;
    connectHref: string;
}

/**
 * 연결 안내 — 연결 안 한 사람이 뮤즈캣 동작(고장 신고 · 즐겨찾기 · 고치기)을 누르면 뜬다.
 * NosLog 로그인 안내 창과 같은 모양(672 미만 아래 시트 · 주 버튼 하나), 로그아웃이면 로그인부터
 */
/** 연결이 있어야 하는 동작 — 안내 창 머리와 문구가 이 동작 이름을 쓴다 */
export type MusecatAction = "favorite" | "fault" | "edit" | "campaign";

const ACTION_TITLE = {
    favorite: "musecat.favorite",
    fault: "musecat.fault.title",
    edit: "musecat.edit.title",
    campaign: "musecat.campaign.title",
} as const;

/**
 * 연결 안내(2026-10-21 전면 대조 ⑧ — 가이드 로그인 안내 LoginPrompt 그대로): 머리 = 동작 이름,
 * 본문 = 「로그인하면 / 뮤즈캣을 연결하면 ○○를 쓸 수 있어요」 →4→ 한 줄 설명, 발 = 취소 · 로그인(또는 연결)
 */
export function MusecatConnectPrompt({
    open,
    onOpenChange,
    links,
    action,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    links: MusecatLinks;
    action: MusecatAction;
}) {
    const t = useTranslations();
    const target = t(`musecat.prompt.action.${action}`);
    return (
        <ModalDialog
            open={open}
            onOpenChange={onOpenChange}
            title={t(ACTION_TITLE[action])}
            size="small"
            footer={
                <>
                    <ActionButton
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                    >
                        {t("settings.cancel")}
                    </ActionButton>
                    {links.loggedIn ? (
                        <ButtonLink plain href={links.connectHref}>
                            {t("partner.settings.connect")}
                        </ButtonLink>
                    ) : (
                        <ButtonLink href={links.loginHref}>
                            {t("common.login")}
                        </ButtonLink>
                    )}
                </>
            }
        >
            <LoginPrompt
                title={t(
                    links.loggedIn
                        ? "musecat.prompt.connectTitle"
                        : "musecat.prompt.loginTitle",
                    { action: target }
                )}
                description={t(
                    links.loggedIn
                        ? "musecat.prompt.connectBody"
                        : "musecat.prompt.loginBody"
                )}
            />
        </ModalDialog>
    );
}

/** 고장 신고 — 뮤즈캣 arcade/flag 그대로(정도 4단계 · 내용 · 사진 3장). 쓰기는 한 번만, 자동 재시도 없음 */
export function MusecatFaultDialog({
    slug,
    musecatId,
    arcadeName,
    game,
    username,
    trigger,
}: {
    slug: string;
    musecatId: string;
    arcadeName: string;
    game: MusecatGame;
    username: string | null;
    trigger: ReactNode;
}) {
    const t = useTranslations();
    const formId = useId();
    const messageId = useId();
    const [open, setOpen] = useState(false);
    const [disruption, setDisruption] = useState<MusecatDisruption | "">("");
    const [message, setMessage] = useState("");
    const [photos, setPhotos] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState<{ xp: number | null } | null>(null);
    const [busy, startTransition] = useTransition();
    const fileInput = useRef<HTMLInputElement>(null);
    function reset() {
        setDisruption("");
        setMessage("");
        setPhotos([]);
        setError(null);
        setDone(null);
    }
    function changeOpen(next: boolean) {
        if (busy) return;
        if (!next) reset();
        setOpen(next);
    }
    function submit(event: React.FormEvent) {
        event.preventDefault();
        if (!disruption || !message.trim()) {
            setError(t("musecat.fault.required"));
            return;
        }
        const data = new FormData();
        data.set("slug", slug);
        data.set("arcade", musecatId);
        data.set("gameId", game.id);
        data.set("disruption", disruption);
        data.set("message", message);
        for (const photo of photos) data.append("photos", photo);
        startTransition(async () => {
            const result = await reportMusecatFault(data).catch(() => ({
                ok: false as const,
                error: "failed" as const,
            }));
            if (!result.ok) {
                setError(t(musecatErrorKey(result.error)));
                return;
            }
            setDone({ xp: result.xp ?? null });
        });
    }
    const close = () => changeOpen(false);
    const submitButton = (
        <ActionButton type="submit" form={formId} busy={busy}>
            {t("musecat.fault.submit")}
        </ActionButton>
    );
    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={changeOpen}
            title={t("musecat.fault.title")}
            size="large"
            trigger={trigger}
            fullScreenFooter={done ? null : submitButton}
            modalFooter={
                done ? (
                    <ActionButton onClick={close}>
                        {t("common.close")}
                    </ActionButton>
                ) : (
                    <>
                        <ActionButton
                            variant="secondary"
                            disabled={busy}
                            onClick={close}
                        >
                            {t("settings.cancel")}
                        </ActionButton>
                        {submitButton}
                    </>
                )
            }
        >
            {done ? (
                <StatusMessage
                    severity="success"
                    role="status"
                    title={
                        done.xp
                            ? t("musecat.fault.sentXp", { xp: done.xp })
                            : t("musecat.fault.sent")
                    }
                />
            ) : (
                <form
                    id={formId}
                    className="nl-stack"
                    noValidate
                    aria-busy={busy}
                    onSubmit={submit}
                >
                    <div className="nl-field">
                        <p className="nl-field__label">
                            {t("arcades.reportTarget")}
                        </p>
                        <p className="nl-body">
                            {arcadeName} · {game.title}
                        </p>
                    </div>
                    <RadioGroup
                        label={t("musecat.fault.disruption")}
                        labelStyle="field"
                        value={disruption}
                        disabled={busy}
                        options={MUSECAT_DISRUPTIONS.map((value) => ({
                            value,
                            label: t(`musecat.disruption.${value}`),
                        }))}
                        onValueChange={(value) =>
                            setDisruption(value as MusecatDisruption)
                        }
                    />
                    <FormField
                        id={messageId}
                        label={t("musecat.fault.message")}
                    >
                        <TextArea
                            id={messageId}
                            value={message}
                            disabled={busy}
                            maxLength={2000}
                            rows={3}
                            placeholder={t("musecat.fault.placeholder")}
                            onChange={(event) => setMessage(event.target.value)}
                        />
                    </FormField>
                    <input
                        ref={fileInput}
                        hidden
                        type="file"
                        accept={IMAGE_ACCEPT}
                        disabled={busy}
                        aria-label={t("musecat.fault.addPhoto")}
                        onChange={(event) => {
                            const next = event.target.files?.[0];
                            event.target.value = "";
                            if (!next) return;
                            const invalid = imageFileValidationError(next);
                            if (invalid) {
                                setError(
                                    t(
                                        invalid === "size"
                                            ? "feedback.imageTooLarge"
                                            : "feedback.invalidImage"
                                    )
                                );
                                return;
                            }
                            setError(null);
                            setPhotos((current) =>
                                [...current, next].slice(0, 3)
                            );
                        }}
                    />
                    {photos.map((photo, index) => (
                        <FileRow
                            key={`${photo.name}-${index}`}
                            file={photo}
                            removeLabel={t("feedback.removeImage")}
                            disabled={busy}
                            onRemove={() =>
                                setPhotos((current) =>
                                    current.filter((_, i) => i !== index)
                                )
                            }
                        />
                    ))}
                    {photos.length < 3 ? (
                        <ActionButton
                            variant="secondary"
                            disabled={busy}
                            onClick={() => fileInput.current?.click()}
                        >
                            {t("musecat.fault.addPhoto")}
                        </ActionButton>
                    ) : null}
                    <p className="nl-metadata nl-muted">
                        {t("musecat.fault.publicNote", {
                            username: username ?? "",
                        })}
                    </p>
                    {error ? (
                        <StatusMessage
                            severity="danger"
                            role="alert"
                            title={error}
                        />
                    ) : null}
                </form>
            )}
        </ResponsiveDialog>
    );
}

interface PriceRow {
    key: number;
    label: string;
    amount: string;
}

/**
 * NOSTALGIA 기체 정보 고치기(정보 수정 안 b) — 대수 · 요금 · 위치만 NosLog 안에서.
 * 영업시간 · 시설 · 사진은 뮤즈캣 편집기로 보낸다. 남이 먼저 고쳤으면(409) 다시 불러오기
 */
type CabinetFeatures = PublicArcade["cabinets"][number]["features"];
type FeatureKey = keyof CabinetFeatures;

export function MusecatGameEditDialog({
    slug,
    game,
    currency,
    musecatUrl,
    arcadeId,
    cabinet,
    open,
    onOpenChange,
}: {
    slug: string;
    game: MusecatGame;
    currency: string;
    musecatUrl: string;
    /** NosLog 기체 특징 칸 — 바꾸면 이 기체 앞으로 「기체 상태」 오락실 제보를 보낸다(운영자 확인 뒤 반영, 2026-10-21 사용자) */
    arcadeId: number;
    cabinet: PublicArcade["cabinets"][number] | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const [features, setFeatures] = useState<CabinetFeatures | null>(
        cabinet?.features ?? null
    );
    const formId = useId();
    const quantityId = useId();
    const locationId = useId();
    const pricesId = useId();
    const traitsId = useId();
    const nextKey = useRef(game.prices.length);
    const initial = () =>
        game.prices.map((price, index) => ({
            key: index,
            label: price.label ?? "",
            amount: price.amount === null ? "" : String(price.amount),
        }));
    const [quantity, setQuantity] = useState(game.quantity);
    // 뮤즈캣 쪽은 이미 저장했고 NosLog 제보만 실패했을 때 — 다시 저장하면 제보만 다시 보낸다(뮤즈캣 편집이 두 번 들어가지 않게, 2026-10-21 전면 대조 ⑩)
    const musecatSaved = useRef(false);
    const [location, setLocation] = useState(game.location ?? "");
    const [prices, setPrices] = useState<PriceRow[]>(initial);
    const [error, setError] = useState<string | null>(null);
    const [busy, startTransition] = useTransition();
    function changeOpen(next: boolean) {
        if (busy) return;
        if (next) {
            setQuantity(game.quantity);
            musecatSaved.current = false;
            setLocation(game.location ?? "");
            setPrices(initial());
            setFeatures(cabinet?.features ?? null);
            setError(null);
        }
        onOpenChange(next);
    }
    function submit(event: React.FormEvent) {
        event.preventDefault();
        const count = quantity;
        const rows = prices
            .filter((row) => row.amount.trim() || row.label.trim())
            .map((row) => ({ label: row.label, amount: Number(row.amount) }));
        startTransition(async () => {
            if (!musecatSaved.current) {
                const result = await editMusecatNostalgiaGame({
                    slug,
                    gameId: game.id,
                    quantity: count,
                    location,
                    prices: rows,
                    currency,
                }).catch(() => ({
                    ok: false as const,
                    error: "failed" as const,
                }));
                if (!result.ok) {
                    setError(t(musecatErrorKey(result.error)));
                    return;
                }
                musecatSaved.current = true;
            }
            const changed = ARCADE_CABINET_FEATURES.filter(
                (feature) =>
                    cabinet &&
                    features &&
                    features[feature.key] !== cabinet.features[feature.key] &&
                    features[feature.key] !== null
            );
            if (cabinet && features && changed.length) {
                const data = new FormData();
                data.set("arcadeId", String(arcadeId));
                data.set("cabinetId", String(cabinet.id));
                data.set("reportType", "condition");
                data.set(
                    "content",
                    t("musecat.edit.traitsReport", {
                        items: changed
                            .map((feature) => {
                                const value = features[feature.key]!;
                                return `${t(`arcades.feature.${feature.key}`)} ${t(
                                    (
                                        FEATURE_VALUE_KEYS[
                                            feature.key
                                        ] as Record<
                                            string,
                                            Parameters<typeof t>[0]
                                        >
                                    )[value]
                                )}`;
                            })
                            .join(" · "),
                    })
                );
                data.set("imageUrl", "");
                data.set("submissionId", crypto.randomUUID());
                data.set("locale", locale);
                const report = await submitArcadeReport(data).catch(() => ({
                    success: false as const,
                    message: t("musecat.edit.traitsFailed"),
                }));
                if (!report.success) {
                    toast.success(t("musecat.edit.saved"));
                    setError(report.message);
                    return;
                }
            }
            toast.success(
                t(
                    cabinet && features && changed.length
                        ? "musecat.edit.savedWithTraits"
                        : "musecat.edit.saved"
                )
            );
            musecatSaved.current = false;
            onOpenChange(false);
        });
    }
    const submitButton = (
        <ActionButton type="submit" form={formId} busy={busy}>
            {t("partner.settings.save")}
        </ActionButton>
    );
    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={changeOpen}
            title={t("musecat.edit.title")}
            size="large"
            fullScreenFooter={submitButton}
            modalFooter={
                <>
                    <ActionButton
                        variant="secondary"
                        disabled={busy}
                        onClick={() => changeOpen(false)}
                    >
                        {t("settings.cancel")}
                    </ActionButton>
                    {submitButton}
                </>
            }
        >
            <form
                id={formId}
                className="nl-stack"
                noValidate
                aria-busy={busy}
                onSubmit={submit}
            >
                <div className="nl-field">
                    <p className="nl-field__label">{t("musecat.edit.game")}</p>
                    <p className="nl-body">{game.title}</p>
                </div>
                {/* 구역 ① 뮤즈캣에 바로 반영(2026-10-21 전면 대조 ⑩) — 제목 →4→ 설명(뮤즈캣에서만 고치는 것 링크) */}
                <div className="nl-musecat-form-section">
                    <h3 className="nl-component-title">
                        {t("musecat.edit.musecatSection")}
                    </h3>
                    <p className="nl-metadata nl-metadata--long nl-muted">
                        {t("musecat.edit.note")}{" "}
                        <a
                            className="nl-link"
                            href={musecatUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {t("musecat.edit.elsewhere")}
                            <ExternalLink
                                className="nl-icon-small nl-musecat-inline-icon"
                                aria-hidden
                            />
                            <span className="sr-only">
                                {" "}
                                · {t("shell.externalLink")}
                            </span>
                        </a>
                    </p>
                </div>
                <div
                    className="nl-field"
                    role="group"
                    aria-labelledby={quantityId}
                >
                    <p id={quantityId} className="nl-field__label">
                        {t("musecat.edit.quantity")}
                    </p>
                    <Stepper
                        aria-labelledby={quantityId}
                        value={quantity}
                        onValueChange={setQuantity}
                        min={0}
                        max={50}
                        unit={t("musecat.edit.unitCount")}
                        decrementLabel={t("musecat.edit.decrease")}
                        incrementLabel={t("musecat.edit.increase")}
                        disabled={busy}
                    />
                </div>
                <div
                    className="nl-field"
                    role="group"
                    aria-labelledby={pricesId}
                >
                    <p id={pricesId} className="nl-field__label">
                        {t("musecat.edit.prices")}
                    </p>
                    {prices.length ? (
                        <div
                            className="nl-musecat-price-row nl-musecat-price-row--head nl-metadata nl-muted"
                            aria-hidden
                        >
                            <span>{t("musecat.edit.priceName")}</span>
                            <span>{t("musecat.edit.priceAmountHead")}</span>
                        </div>
                    ) : null}
                    {prices.map((row, index) => (
                        <div key={row.key} className="nl-musecat-price-row">
                            <Input
                                aria-label={t("musecat.edit.priceLabel", {
                                    count: index + 1,
                                })}
                                placeholder={t("musecat.edit.pricePlaceholder")}
                                maxLength={20}
                                value={row.label}
                                disabled={busy}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setPrices((current) =>
                                        current.map((item) =>
                                            item.key === row.key
                                                ? { ...item, label: value }
                                                : item
                                        )
                                    );
                                }}
                            />
                            <UnitInput
                                unit={
                                    currency === "KRW"
                                        ? t("musecat.edit.unitWon")
                                        : currency
                                }
                                aria-label={t("musecat.edit.priceAmount", {
                                    count: index + 1,
                                    currency,
                                })}
                                type="number"
                                inputMode="numeric"
                                min={0}
                                value={row.amount}
                                disabled={busy}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setPrices((current) =>
                                        current.map((item) =>
                                            item.key === row.key
                                                ? { ...item, amount: value }
                                                : item
                                        )
                                    );
                                }}
                            />
                            <IconButton
                                label={t("musecat.edit.removePrice")}
                                disabled={busy}
                                onClick={() =>
                                    setPrices((current) =>
                                        current.filter(
                                            (item) => item.key !== row.key
                                        )
                                    )
                                }
                            >
                                <X className="nl-icon" aria-hidden />
                            </IconButton>
                        </div>
                    ))}
                    {prices.length < 4 ? (
                        <ActionButton
                            variant="secondary"
                            disabled={busy}
                            onClick={() =>
                                setPrices((current) => [
                                    ...current,
                                    {
                                        key: nextKey.current++,
                                        label: "",
                                        amount: "",
                                    },
                                ])
                            }
                        >
                            <Plus className="nl-icon-small" aria-hidden />
                            {t("musecat.edit.addPrice")}
                        </ActionButton>
                    ) : null}
                </div>
                <FormField id={locationId} label={t("musecat.edit.location")}>
                    <Input
                        id={locationId}
                        maxLength={100}
                        value={location}
                        disabled={busy}
                        placeholder={t("musecat.edit.locationPlaceholder")}
                        onChange={(event) => setLocation(event.target.value)}
                    />
                </FormField>
                {/* 구역 ② NosLog 확인 뒤 반영 — 기체 특징은 오락실 제보로(운영자 확인). 칸마다 「모름」 이 첫 칸 */}
                {cabinet && features ? (
                    <>
                        <hr className="nl-musecat-rule" />
                        <div
                            className="nl-musecat-form-section"
                            role="group"
                            aria-labelledby={traitsId}
                        >
                            <h3 id={traitsId} className="nl-component-title">
                                {t("musecat.edit.noslogSection")}
                            </h3>
                            <p className="nl-metadata nl-metadata--long nl-muted">
                                {t("musecat.edit.traitsNote")}
                            </p>
                        </div>
                        {ARCADE_CABINET_FEATURES.map((feature) => (
                            <div key={feature.key} className="nl-field">
                                <p className="nl-field__label">
                                    {t(`arcades.feature.${feature.key}`)}
                                </p>
                                <SegmentedControl
                                    label={t(`arcades.feature.${feature.key}`)}
                                    value={features[feature.key] ?? ""}
                                    onValueChange={(value) =>
                                        setFeatures((current) =>
                                            current
                                                ? {
                                                      ...current,
                                                      [feature.key as FeatureKey]:
                                                          value || null,
                                                  }
                                                : current
                                        )
                                    }
                                    options={[
                                        {
                                            value: "",
                                            label: t(
                                                "musecat.facilityState.unknown"
                                            ),
                                        },
                                        ...feature.options.map((option) => ({
                                            value: option.value as string,
                                            label: t(
                                                (
                                                    FEATURE_VALUE_KEYS[
                                                        feature.key
                                                    ] as Record<
                                                        string,
                                                        Parameters<typeof t>[0]
                                                    >
                                                )[option.value]
                                            ),
                                        })),
                                    ]}
                                />
                            </div>
                        ))}
                    </>
                ) : null}
                {error ? (
                    <StatusMessage
                        severity="danger"
                        role="alert"
                        title={error}
                    />
                ) : null}
            </form>
        </ResponsiveDialog>
    );
}
