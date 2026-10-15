import { Suspense } from "react";

import BingoCatalogLoading from "@/features/bingos/components/bingo-catalog-loading";
import BingoCatalogPage from "@/features/bingos/components/bingo-catalog-page";
import { getPublicBingoCatalog } from "@/features/bingos/server/public-bingo-service";

async function Catalog() {
    return <BingoCatalogPage {...await getPublicBingoCatalog()} />;
}

export default function BingoPage() {
    return (
        <Suspense fallback={<BingoCatalogLoading />}>
            <Catalog />
        </Suspense>
    );
}
