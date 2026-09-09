import { Suspense } from "react";
import BingoCatalogLoading from "@/features/bingos/components/bingoCatalogLoading";
import BingoCatalogPage from "@/features/bingos/components/bingoCatalogPage";
import { getPublicBingoCatalog } from "@/features/bingos/server/publicBingoService";
import { getUser } from "@/lib/user";

async function Catalog() {
    return <BingoCatalogPage {...await getPublicBingoCatalog()} />;
}

export default async function BingoPage() {
    const user = await getUser();
    return (
        <Suspense
            fallback={<BingoCatalogLoading authenticated={Boolean(user)} />}
        >
            <Catalog />
        </Suspense>
    );
}
