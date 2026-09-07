import NavigationLayout from "@/app/(nevigation)/layout";
import RecoveryBoundary from "@/features/recovery/components/recoveryBoundary";
import RecoveryContent from "@/features/recovery/components/recoveryContent";
import LegacyNotFound from "@/features/recovery/components/legacyNotFound";
import { getServerI18n } from "@/lib/i18n/server";

export async function generateMetadata() {
    const { t } = await getServerI18n();
    return {
        title: { absolute: `${t("common.notFoundTitle")} | NosLog` },
        robots: { index: false, follow: false },
    };
}

export default function NotFound() {
    return (
        <RecoveryBoundary
            ordinary={
                <NavigationLayout>
                    <RecoveryContent />
                </NavigationLayout>
            }
            legacy={<LegacyNotFound />}
        />
    );
}
