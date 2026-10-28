import PartnerConsentPage from "@/features/partner/components/partner-consent-page";

export default async function AuthorizeRoute({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    return <PartnerConsentPage {...await searchParams} />;
}
