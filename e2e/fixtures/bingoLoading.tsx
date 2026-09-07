import { setTimeout as pause } from "node:timers/promises";
import { Suspense } from "react";
import BingoCatalogLoading from "@/features/bingos/components/bingoCatalogLoading";
import BingosFixture from "@/e2e/fixtures/bingos";

async function LoadedCatalog() {
    await pause(3000);
    return <BingosFixture />;
}

export default function BingoLoadingFixture() {
    return (
        <Suspense fallback={<BingoCatalogLoading authenticated />}>
            <LoadedCatalog />
        </Suspense>
    );
}
