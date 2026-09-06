import Image from "next/image";
import { Globe } from "lucide-react";
import { useTranslations } from "@/components/i18n/localeProvider";

export default function CountryMarker({ country }: { country: string }) {
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
        <span className="nl-country-marker">
            {flag ? (
                <Image
                    src={`/flags/${flag}.png`}
                    alt={label}
                    width={16}
                    height={12}
                />
            ) : (
                <Globe role="img" aria-label={label} />
            )}
        </span>
    );
}
