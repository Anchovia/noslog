"use client";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import BackLink from "@/components/ui/backLink";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import PageContainer from "@/components/layout/pageContainer";
import Button, { foundationButtonClass } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/statusMessage";
import { setPreferredArcade } from "@/app/(nevigation)/gamecenter/actions";
import type { PublicArcade } from "@/features/arcades/schemas/publicArcadeSchema";
import {
    arcadeDirections,
    arcadeDistance,
    arcadeOpenState,
    arcadeTodayHours,
    formatArcadeTime,
} from "@/features/arcades/arcadeDiscovery";
import { useArcadeSession } from "@/features/arcades/hooks/useArcadeSession";
import { ArcadeAvailability } from "./arcadeResultCard";
import ArcadeDiscoveryMap from "./arcadeDiscoveryMap";
import ArcadeHours from "./arcadeHours";
import ArcadePhotos from "./arcadePhotos";
import ArcadeReportDialog from "./arcadeReportDialog";
import ArcadeContactDetails from "./arcadeContactDetails";

export default function ArcadeDetailPage({
    arcade,
    appKey,
    isAuthenticated,
    preferredArcadeId,
}: {
    arcade: PublicArcade;
    appKey: string;
    isAuthenticated: boolean;
    preferredArcadeId: number | null;
}) {
    const locale = useLocale();
    const href = useLocalizedHref();
    const t = useTranslations();
    const router = useRouter();
    const origin = useArcadeSession((state) => state.origin);
    const discoveryQuery = useArcadeSession((state) => state.discoveryQuery);
    const [now, setNow] = useState(() => new Date());
    const [preferred, setPreferred] = useState(preferredArcadeId === arcade.id);
    const [notice, setNotice] = useState<{
        success: boolean;
        message: string;
    } | null>(null);
    const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
        "idle"
    );
    const [busy, startTransition] = useTransition();
    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 60_000);
        return () => window.clearInterval(timer);
    }, []);
    const directions = arcadeDirections(arcade);
    const distance = arcadeDistance(arcade, origin);
    const open = arcadeOpenState(arcade, now);
    const today = arcadeTodayHours(arcade, now);
    const alias = arcade.identities.find(
        (item) => item.locale === locale
    )?.name;
    const loginHref = `${href("/login")}?returnTo=${encodeURIComponent(href(`/gamecenter/${arcade.slug}`))}`;
    const verifiedDays = arcade.cabinetVerifiedAt
        ? Math.max(
              0,
              Math.floor(
                  (now.getTime() -
                      new Date(arcade.cabinetVerifiedAt).getTime()) /
                      86_400_000
              )
          )
        : null;
    function choosePreferred() {
        setNotice(null);
        startTransition(async () => {
            const result = await setPreferredArcade(arcade.id, locale).catch(
                () => ({
                    success: false as const,
                    message: t("arcades.preferredFailed"),
                })
            );
            setNotice(result);
            if (result.success) {
                setPreferred(true);
                router.refresh();
            }
        });
    }
    async function copyAddress() {
        if (!arcade.address) return;
        try {
            await navigator.clipboard.writeText(arcade.address);
            setCopyState("copied");
        } catch {
            setCopyState("error");
        }
    }
    const preference = (
        <div className="nl-arcade-detail__preference">
            <p className="nl-body-secondary nl-arcade-detail__preferred-count">
                {arcade.preferredCount === null
                    ? t("arcades.collectingPreference")
                    : t("arcades.preferredPeople", {
                          count: arcade.preferredCount,
                      })}
            </p>
            {isAuthenticated ? (
                <Button
                    appearance="foundation"
                    variant="secondary"
                    size="sm"
                    disabled={busy || preferred}
                    onClick={choosePreferred}
                >
                    {t(
                        busy
                            ? "arcades.settingPreferred"
                            : preferred
                              ? "arcades.currentPreferred"
                              : "arcades.setPreferred"
                    )}
                </Button>
            ) : (
                <Link
                    className={foundationButtonClass({
                        variant: "secondary",
                        size: "sm",
                    })}
                    href={loginHref}
                >
                    {t("arcades.loginToSetPreferred")}
                </Link>
            )}
            {notice ? (
                <StatusMessage
                    severity={notice.success ? "success" : "danger"}
                    title={notice.message}
                    role="status"
                />
            ) : null}
            <div className="nl-arcade-detail__compact-report">
                <ArcadeReportDialog
                    arcade={arcade}
                    isAuthenticated={isAuthenticated}
                />
            </div>
        </div>
    );
    return (
        <PageContainer className="nl-arcade-detail">
            <BackLink
                href={href(
                    `/gamecenter${discoveryQuery ? `?${discoveryQuery}` : ""}`
                )}
            >
                {t("arcades.title")}
            </BackLink>
            <div>
                <h1
                    className="nl-page-title"
                    lang={arcade.nativeLanguage ?? undefined}
                >
                    {arcade.name}
                </h1>
                {alias && alias !== arcade.name ? (
                    <p className="nl-body-secondary nl-muted">{alias}</p>
                ) : null}
            </div>
            <ArcadePhotos photos={arcade.photos} />
            <div className="nl-arcade-detail__composition">
                <div className="nl-arcade-detail__action-rail">
                    <div className="nl-arcade-detail__visit">
                        <p className="nl-body-secondary nl-arcade-detail__open-state">
                            {t(
                                open === "unknown"
                                    ? "arcades.hoursUnverified"
                                    : open === "open"
                                      ? "arcades.open"
                                      : "arcades.closed"
                            )}
                            {today
                                ? ` · ${t("arcades.todayHours", { hours: `${formatArcadeTime(today.open)}–${formatArcadeTime(today.close)}` })}`
                                : ""}
                            {distance !== null ? (
                                <span className="nl-arcade-detail__compact-distance">
                                    {` · ${t("arcades.distance", { distance: distance.toFixed(1) })}`}
                                </span>
                            ) : null}
                        </p>
                        {distance !== null ? (
                            <p className="nl-body-secondary nl-muted nl-arcade-detail__wide-distance">
                                {t("arcades.distance", {
                                    distance: distance.toFixed(1),
                                })}
                            </p>
                        ) : null}
                        {directions ? (
                            <a
                                className={foundationButtonClass({
                                    size: "sm",
                                })}
                                href={directions}
                                aria-label={`${t("arcades.directions")} · ${t("shell.externalLink")}`}
                            >
                                {t("arcades.directions")}
                            </a>
                        ) : null}
                        <div className="nl-arcade-detail__wide-preference">
                            {preference}
                        </div>
                    </div>
                    {arcade.phone || arcade.website ? (
                        <div className="nl-arcade-detail__wide-contact nl-arcade-detail__card">
                            <dl className="nl-arcade-detail__facts">
                                <ArcadeContactDetails arcade={arcade} />
                            </dl>
                        </div>
                    ) : null}
                </div>
                <div className="nl-arcade-detail__cards">
                    <section className="nl-arcade-detail__card nl-arcade-detail__location">
                        <h2 className="nl-component-title">
                            {t("arcades.locationHours")}
                        </h2>
                        <div className="nl-arcade-detail__location-grid">
                            <div className="nl-arcade-detail__location-map">
                                {arcade.latitude !== null &&
                                arcade.longitude !== null ? (
                                    <div className="nl-arcade-detail__map">
                                        <ArcadeDiscoveryMap
                                            appKey={appKey}
                                            arcades={[arcade]}
                                            selectedId={null}
                                            onSelect={() => {}}
                                        />
                                    </div>
                                ) : null}
                                {arcade.address ? (
                                    <button
                                        type="button"
                                        className="nl-arcade-detail__address nl-body"
                                        onClick={copyAddress}
                                        aria-label={`${arcade.address} · ${t("arcades.copyAddress")}`}
                                    >
                                        <span>{arcade.address}</span>
                                        <span className="nl-arcade-detail__copy">
                                            <Copy
                                                className="nl-icon"
                                                aria-hidden
                                            />
                                        </span>
                                    </button>
                                ) : (
                                    <p className="nl-body-secondary nl-muted">
                                        {t("arcades.addressPending")}
                                    </p>
                                )}
                                {copyState !== "idle" ? (
                                    <p className="nl-metadata" role="status">
                                        {t(
                                            copyState === "copied"
                                                ? "arcades.copied"
                                                : "arcades.copyFailed"
                                        )}
                                    </p>
                                ) : null}
                            </div>
                            <div className="nl-arcade-detail__location-hours">
                                <ArcadeHours arcade={arcade} />
                                {open === "unknown" ? (
                                    <p className="nl-metadata nl-muted">
                                        {t("arcades.hoursUnverified")}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </section>
                    <section className="nl-arcade-detail__card">
                        <div className="nl-arcade-detail__card-heading">
                            <h2 className="nl-component-title">
                                {t("arcades.cabinets")}
                            </h2>
                            <p className="nl-body nl-arcade-detail__cabinet-summary">
                                <ArcadeAvailability arcade={arcade} />
                            </p>
                            <p className="nl-metadata nl-muted">
                                {verifiedDays !== null
                                    ? verifiedDays === 0
                                        ? t("arcades.cabinetVerifiedToday")
                                        : t("arcades.cabinetVerifiedAgo", {
                                              count: verifiedDays,
                                          })
                                    : t("arcades.cabinetUnverified")}
                            </p>
                        </div>
                        <ul className="nl-arcade-detail__cabinets">
                            {arcade.cabinets.map((cabinet, index) => (
                                <li key={cabinet.id}>
                                    <div className="nl-arcade-detail__cabinet-heading">
                                        <span className="nl-control">
                                            {cabinet.label ??
                                                t("arcades.cabinetLabel", {
                                                    count: index + 1,
                                                })}
                                        </span>
                                        <span className="nl-body-secondary">
                                            {t(
                                                cabinet.stale ||
                                                    cabinet.availability ===
                                                        "unknown"
                                                    ? "arcades.unknown"
                                                    : cabinet.availability ===
                                                        "unavailable"
                                                      ? "arcades.status.unavailable"
                                                      : "arcades.cabinetAvailable"
                                            )}
                                            {!cabinet.stale &&
                                            cabinet.availability ===
                                                "available" &&
                                            cabinet.condition !== "unknown"
                                                ? ` · ${t(`arcades.status.${cabinet.condition}`)}`
                                                : ""}
                                            {!cabinet.stale &&
                                            cabinet.availability ===
                                                "unavailable" &&
                                            cabinet.note
                                                ? ` · ${cabinet.note}`
                                                : ""}
                                        </span>
                                    </div>
                                    {cabinet.note &&
                                    (cabinet.stale ||
                                        cabinet.availability !==
                                            "unavailable") ? (
                                        <p className="nl-metadata nl-muted">
                                            {cabinet.note}
                                        </p>
                                    ) : null}
                                    {cabinet.stale ? (
                                        <p className="nl-metadata nl-muted">
                                            {t("arcades.cabinetUnverified")}
                                        </p>
                                    ) : null}
                                </li>
                            ))}
                        </ul>
                    </section>
                    {arcade.playPrice !== null ||
                    arcade.phone ||
                    arcade.website ||
                    arcade.notes ? (
                        <section className="nl-arcade-detail__card">
                            <dl className="nl-arcade-detail__facts">
                                {arcade.playPrice !== null ? (
                                    <div>
                                        <dt className="nl-control">
                                            {t("arcades.price")}
                                        </dt>
                                        <dd className="nl-body">
                                            {new Intl.NumberFormat(locale, {
                                                style: "currency",
                                                currency: arcade.currencyCode,
                                            }).format(arcade.playPrice)}
                                            {arcade.creditLabel
                                                ? ` / ${arcade.creditLabel}`
                                                : arcade.coinCount
                                                  ? ` / ${t("arcades.coins", { count: arcade.coinCount })}`
                                                  : ""}
                                        </dd>
                                    </div>
                                ) : null}
                                <ArcadeContactDetails
                                    arcade={arcade}
                                    className="nl-arcade-detail__compact-contact"
                                />
                                {arcade.notes ? (
                                    <div>
                                        <dt className="nl-control">
                                            {t("arcades.notes")}
                                        </dt>
                                        <dd className="nl-body-secondary">
                                            {arcade.notes}
                                        </dd>
                                    </div>
                                ) : null}
                            </dl>
                        </section>
                    ) : null}
                </div>
                <div className="nl-arcade-detail__wide-report">
                    <ArcadeReportDialog
                        arcade={arcade}
                        isAuthenticated={isAuthenticated}
                    />
                </div>
                <div className="nl-arcade-detail__compact-preference">
                    {preference}
                </div>
            </div>
        </PageContainer>
    );
}
