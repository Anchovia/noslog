import LegacyNotFound from "@/features/recovery/components/legacy-not-found";
import RecoveryBoundary from "@/features/recovery/components/recovery-boundary";
import RecoveryContent from "@/features/recovery/components/recovery-content";
export { generateMetadata } from "@/app/not-found";

export default function OrdinaryNotFound() {
    return (
        <RecoveryBoundary
            ordinary={<RecoveryContent />}
            legacy={<LegacyNotFound />}
        />
    );
}
