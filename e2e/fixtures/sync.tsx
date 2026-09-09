import SyncPage from "@/features/sync/components/syncPage";
import { syncFixtureData } from "./syncData";

// Render-only fixture. No account impersonation, signed token or ingestion write.
export default function SyncFixture({ state }: { state?: string }) {
    return (
        <SyncPage
            bookmarklet="javascript:void(0)"
            userId={2147483646}
            initialData={syncFixtureData(state)}
        />
    );
}
