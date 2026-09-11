import type {
    ArcadeDiscoveryValues,
    PublicArcade,
} from "@/features/arcades/schemas/publicArcadeSchema";
import type {
    ArcadeBounds,
    ArcadeOrigin,
} from "@/features/arcades/types/arcadeGeography";

export function arcadeOpenState(
    arcade: PublicArcade,
    now: Date
): "open" | "closed" | "unknown" {
    if (
        !arcade.hours ||
        !arcade.hoursVerifiedAt ||
        !arcade.hoursValidUntil ||
        new Date(arcade.hoursVerifiedAt) > now ||
        new Date(arcade.hoursValidUntil) <= now
    )
        return "unknown";
    try {
        const parts = new Intl.DateTimeFormat("en-CA", {
            timeZone: arcade.timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
        }).formatToParts(now);
        const values = Object.fromEntries(
            parts.map(({ type, value }) => [type, value])
        );
        const date = `${values.year}-${values.month}-${values.day}`;
        const calendar = new Date(`${date}T12:00:00Z`);
        const day = (calendar.getUTCDay() + 6) % 7;
        const minutes = Number(values.hour) * 60 + Number(values.minute);
        const weekly = arcade.hours.weekly;
        const today = Object.hasOwn(arcade.hours.exceptions, date)
            ? arcade.hours.exceptions[date]
            : weekly[String(day) as keyof typeof weekly];
        // An exceptional closure also cancels an overnight opening from yesterday.
        if (Object.hasOwn(arcade.hours.exceptions, date) && today === null)
            return "closed";
        if (today && minutes >= today.open && minutes < today.close)
            return "open";
        calendar.setUTCDate(calendar.getUTCDate() - 1);
        const previousDate = calendar.toISOString().slice(0, 10);
        const previous = Object.hasOwn(arcade.hours.exceptions, previousDate)
            ? arcade.hours.exceptions[previousDate]
            : weekly[String((day + 6) % 7) as keyof typeof weekly];
        if (
            previous &&
            previous.close > 1440 &&
            minutes < previous.close - 1440
        )
            return "open";
        return today === undefined ? "unknown" : "closed";
    } catch {
        return "unknown";
    }
}

export function arcadeDistance(
    arcade: Pick<PublicArcade, "latitude" | "longitude">,
    origin: ArcadeOrigin | null
) {
    if (!origin || arcade.latitude === null || arcade.longitude === null)
        return null;
    const radians = (value: number) => (value * Math.PI) / 180;
    const latitude = radians(arcade.latitude - origin.latitude);
    const longitude = radians(arcade.longitude - origin.longitude);
    const a =
        Math.sin(latitude / 2) ** 2 +
        Math.cos(radians(origin.latitude)) *
            Math.cos(radians(arcade.latitude)) *
            Math.sin(longitude / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}

export function arcadeTodayHours(arcade: PublicArcade, now: Date) {
    if (!arcade.hours || arcadeOpenState(arcade, now) === "unknown")
        return undefined;
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: arcade.timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(now);
    const values = Object.fromEntries(
        parts.map(({ type, value }) => [type, value])
    );
    const date = `${values.year}-${values.month}-${values.day}`;
    if (Object.hasOwn(arcade.hours.exceptions, date))
        return arcade.hours.exceptions[date];
    const day = (new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7;
    return arcade.hours.weekly[String(day) as keyof typeof arcade.hours.weekly];
}

/** 가장 최근 확인 시각 — 이용자 가동 확인과 관리자 검증 중 늦은 쪽 */
export function arcadeLastVerifiedAt(arcade: PublicArcade) {
    const candidates = [
        arcade.lastCheckedAt,
        arcade.cabinetVerifiedAt,
        ...arcade.cabinets.map((cabinet) => cabinet.verifiedAt),
    ].filter((value): value is string => Boolean(value));
    if (!candidates.length) return null;
    return candidates.reduce((latest, value) =>
        value > latest ? value : latest
    );
}

/** 며칠 전인지 — 0 은 오늘. 미래 시각은 0 으로 본다 */
export function daysAgo(iso: string | null, now: Date) {
    if (!iso) return null;
    const at = new Date(iso).getTime();
    if (!Number.isFinite(at)) return null;
    return Math.max(0, Math.floor((now.getTime() - at) / 86_400_000));
}

export function arcadeCabinetSummary(arcade: PublicArcade) {
    const known = arcade.cabinets.filter(
        (cabinet) => cabinet.availability !== "unknown" && !cabinet.stale
    );
    return {
        total: arcade.cabinets.length,
        known: known.length,
        available: known.filter(
            (cabinet) => cabinet.availability === "available"
        ).length,
        caution: known.filter((cabinet) => cabinet.condition === "caution")
            .length,
        reported: arcade.cabinets.filter((cabinet) => cabinet.openReports > 0)
            .length,
    };
}

/** 오늘 영업의 끝(영업 중이면 마감, 아니면 다음 개점) — 「23:00까지」·「10:00 개점」 */
export function arcadeScheduleHint(
    arcade: PublicArcade,
    now: Date
): { kind: "closes" | "opens"; time: string } | null {
    const today = arcadeTodayHours(arcade, now);
    const state = arcadeOpenState(arcade, now);
    if (state === "unknown" || !today) return null;
    if (state === "open")
        return { kind: "closes", time: formatArcadeTime(today.close % 1440) };
    return { kind: "opens", time: formatArcadeTime(today.open) };
}

/** 플레이 요금 — 「₩500 / 1코인」. 요금 정보가 없으면 null */
export function formatArcadePrice(
    arcade: Pick<
        PublicArcade,
        "playPrice" | "currencyCode" | "creditLabel" | "coinCount"
    >,
    locale: string,
    coins: (count: number) => string
) {
    if (arcade.playPrice === null) return null;
    const amount = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: arcade.currencyCode,
    }).format(arcade.playPrice);
    const unit =
        arcade.creditLabel ||
        (arcade.coinCount ? coins(arcade.coinCount) : null);
    return unit ? `${amount} / ${unit}` : amount;
}

export function formatArcadeTime(minutes: number) {
    return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

const normalized = (value: string) =>
    value.normalize("NFKC").trim().toLocaleLowerCase();

export function selectArcades(
    arcades: PublicArcade[],
    values: ArcadeDiscoveryValues,
    locale: string,
    origin: ArcadeOrigin | null,
    bounds: ArcadeBounds | null,
    now: Date
) {
    const query = normalized(values.q);
    const relevance = (arcade: PublicArcade) => {
        if (!query) return 0;
        const names = [
            arcade.name,
            ...arcade.identities.flatMap((item) => [
                item.name,
                ...item.aliases,
            ]),
        ].map(normalized);
        if (names.some((name) => name === query)) return 3;
        if (names.some((name) => name.startsWith(query))) return 2;
        return [...names, arcade.region, arcade.locality, arcade.address].some(
            (value) => value && normalized(value).includes(query)
        )
            ? 1
            : 0;
    };
    return arcades
        .filter((arcade) => {
            if (query && !relevance(arcade)) return false;
            if (values.region && arcade.region !== values.region) return false;
            if (values.open && arcadeOpenState(arcade, now) !== "open")
                return false;
            if (
                values.available &&
                !arcade.cabinets.some(
                    (cabinet) =>
                        cabinet.availability === "available" && !cabinet.stale
                )
            )
                return false;
            if (bounds) {
                if (arcade.latitude === null || arcade.longitude === null)
                    return false;
                if (
                    arcade.latitude < bounds.south ||
                    arcade.latitude > bounds.north
                )
                    return false;
                if (
                    bounds.west <= bounds.east
                        ? arcade.longitude < bounds.west ||
                          arcade.longitude > bounds.east
                        : arcade.longitude < bounds.west &&
                          arcade.longitude > bounds.east
                )
                    return false;
            }
            return true;
        })
        .sort((a, b) => {
            const byName = a.name.localeCompare(b.name, locale) || a.id - b.id;
            const byDistance = () => {
                const da = arcadeDistance(a, origin);
                const db = arcadeDistance(b, origin);
                if (da === null && db === null) return 0;
                if (da === null) return 1;
                if (db === null) return -1;
                return da - db;
            };
            const byVerified = () =>
                (arcadeLastVerifiedAt(b) ?? "").localeCompare(
                    arcadeLastVerifiedAt(a) ?? ""
                );
            const chosen =
                values.sort === "preferred"
                    ? (b.preferredCount ?? 0) - (a.preferredCount ?? 0) ||
                      byName
                    : values.sort === "distance"
                      ? byDistance() || byName
                      : values.sort === "verified"
                        ? byVerified() || byName
                        : byName;
            // 검색어가 있으면 일치도가 먼저
            const byRelevance = relevance(b) - relevance(a);
            if (byRelevance) return byRelevance;
            if (values.near && origin) {
                const distance =
                    (arcadeDistance(a, origin) ?? Infinity) -
                    (arcadeDistance(b, origin) ?? Infinity);
                if (Number.isFinite(distance) && distance !== 0)
                    return distance;
                if (
                    arcadeDistance(a, origin) === null &&
                    arcadeDistance(b, origin) !== null
                )
                    return 1;
                if (
                    arcadeDistance(b, origin) === null &&
                    arcadeDistance(a, origin) !== null
                )
                    return -1;
            }
            return chosen;
        });
}

export function arcadeDirections(arcade: PublicArcade) {
    const hasCoordinates =
        arcade.latitude !== null && arcade.longitude !== null;
    if (arcade.countryCode === "KR") {
        if (hasCoordinates)
            return `https://map.kakao.com/link/to/${encodeURIComponent(arcade.name)},${arcade.latitude},${arcade.longitude}`;
        return arcade.address
            ? `https://map.kakao.com/link/search/${encodeURIComponent(arcade.address)}`
            : null;
    }
    const destination = hasCoordinates
        ? `${arcade.latitude},${arcade.longitude}`
        : arcade.address;
    return destination
        ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
        : null;
}
