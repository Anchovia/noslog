"use client";

import PageContainer from "@/components/layout/pageContainer";
import Button from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/statusMessage";
import { useTranslations } from "@/components/i18n/localeProvider";
import { useRouter } from "next/navigation";

export default function ProfileError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations();
    const router = useRouter();
    return (
        <PageContainer className="nl-profile">
            <StatusMessage
                severity="danger"
                role="alert"
                title={t("profile.loadFailed")}
                description={t("profile.recordsUnchanged")}
                action={
                    <Button
                        appearance="foundation"
                        variant="secondary"
                        onClick={() => {
                            router.refresh();
                            reset();
                        }}
                    >
                        {t("common.retry")}
                    </Button>
                }
            />
        </PageContainer>
    );
}
