import NavigationLayout from "@/app/(site)/layout";
import RecoveryBoundary from "@/features/recovery/components/recovery-boundary";
import RecoveryContent from "@/features/recovery/components/recovery-content";
import LegacyNotFound from "@/features/recovery/components/legacy-not-found";
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
