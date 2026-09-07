import HomePage from "@/features/home/components/homePage";
import { createPageMetadata, SITE_NAME } from "@/lib/metadata/site";
import { getServerI18n } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/routing";

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
