import { Suspense } from "react";
import BingoCatalogLoading from "@/features/bingos/components/bingoCatalogLoading";
import BingoCatalogPage from "@/features/bingos/components/bingoCatalogPage";
import { getPublicBingoCatalog } from "@/features/bingos/server/publicBingoService";

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
