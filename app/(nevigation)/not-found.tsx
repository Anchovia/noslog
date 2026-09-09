import RecoveryBoundary from "@/features/recovery/components/recoveryBoundary";
import RecoveryContent from "@/features/recovery/components/recoveryContent";
import LegacyNotFound from "@/features/recovery/components/legacyNotFound";
export { generateMetadata } from "@/app/not-found";

export default function OrdinaryNotFound() {
    return (
        <RecoveryBoundary
            ordinary={<RecoveryContent />}
            legacy={<LegacyNotFound />}
        />
    );
}
