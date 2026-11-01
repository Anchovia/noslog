import { ExternalLink } from "lucide-react";

import IntentLink from "@/components/ui/intent-link";

// 셸 푸터와 오락실 시트 끝 푸터가 같이 쓰는 내용 — 링크 줄과 서비스 고지
export default function FooterLinks({
    termsHref,
    termsLabel,
    privacyHref,
    privacyLabel,
    externalLabel,
    notice,
}: {
    termsHref: string;
    termsLabel: string;
    privacyHref: string;
    privacyLabel: string;
    externalLabel: string;
    notice: string;
}) {
    return (
        <>
            <div className="nl-footer__links nl-control">
                <IntentLink href={termsHref}>{termsLabel}</IntentLink>
                <IntentLink href={privacyHref}>{privacyLabel}</IntentLink>
                <a
                    href="https://github.com/Anchovia/noslog"
                    aria-label={`GitHub · ${externalLabel}`}
                >
                    <span lang="en">GitHub</span>
                    <ExternalLink aria-hidden />
                </a>
            </div>
            <p className="nl-footer__notice nl-metadata nl-muted">{notice}</p>
        </>
    );
}
