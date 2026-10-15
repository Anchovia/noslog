import HomePage from "@/features/home/components/home-page";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata, SITE_NAME } from "@/lib/metadata/site";

export async function generateMetadata() {
    const { locale } = await getServerI18n();
    return {
        ...createPageMetadata({ path: localizePath("/", locale) }),
        title: { absolute: SITE_NAME },
    };
}

export default function Home() {
    return <HomePage />;
}
