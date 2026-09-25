import Image from "next/image";
import { Globe } from "lucide-react";
import { useTranslations } from "@/components/i18n/localeProvider";

/** 국기 칸 16(기본) · 24(large — 프로필 이름 옆, 2026-09-26 D5). 그림 높이는 칸의 3/4 */
export default function CountryMarker({
    country,
    size,
}: {
    country: string;
    size?: "large";
}) {
    const t = useTranslations();
    const flag = country === "ko-KR" ? "kr" : country === "ja-JP" ? "jp" : null;
    const label = t(
        flag === "kr"
            ? "country.korea"
            : flag === "jp"
              ? "country.japan"
              : "rankings.region.other"
    );
    return (
        <span className="nl-country-marker" data-size={size}>
            {flag ? (
                <Image
                    src={`/flags/${flag}.png`}
                    alt={label}
                    width={size === "large" ? 24 : 16}
                    height={size === "large" ? 18 : 12}
                />
            ) : (
                <Globe role="img" aria-label={label} />
            )}
        </span>
    );
}
