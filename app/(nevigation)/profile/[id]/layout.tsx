import { notFound } from "next/navigation";
import { Suspense } from "react";

import PageContainer from "@/components/layout/pageContainer";
import { ProfileHeaderSkeleton } from "@/features/profile/components/profileLoading";
import ProfileShell from "@/features/profile/components/profileShell";
import { profileIdSchema } from "@/features/profile/schemas/publicProfileSchema";

/**
 * 프로필 틀(2026-09-25 D2) — 머리 + 구역 탭은 여기서 한 번, 탭 내용(개요 · 업적 …)은 각 페이지가 그린다.
 * 탭을 옮겨도 머리는 그대로 두고 내용 자리만 그 탭의 스켈레톤으로 바뀐다
 */
export default async function ProfileIdLayout({
    params,
    children,
}: {
    params: Promise<{ id: string }>;
    children: React.ReactNode;
}) {
    const { id: rawId } = await params;
    const id = profileIdSchema.safeParse(rawId);
    if (!id.success) notFound();
    return (
        <PageContainer className="nl-profile">
            <Suspense fallback={<ProfileHeaderSkeleton />}>
                <ProfileShell id={id.data} />
            </Suspense>
            {children}
        </PageContainer>
    );
}
