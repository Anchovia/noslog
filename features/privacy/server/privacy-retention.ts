import "server-only";

import { del, list } from "@vercel/blob";
import { subDays, subHours, subMonths } from "date-fns";

import {
    ACCOUNT_UPLOADS_SELECT,
    deleteAccountData,
} from "@/features/settings/server/account-deletion-service";
import { ANALYTICS_RETENTION_DAYS, analyticsDateKey } from "@/lib/analytics";
import { deleteBlobStrict } from "@/lib/blob";
import db from "@/lib/db";
import { serverEnv } from "@/lib/env/server";

const RETENTION_MONTHS = 6;
const BATCH_SIZE = 500;
// 프로필 사진 · 이벤트 대표 · 본문 이미지는 올린 뒤 저장해야 주소가 DB 에 남는다
const UPLOAD_PREFIXES = ["avatars/", "events/"];
// 피드백 · 제보 사진과 검정 증빙도 올린 뒤 제출해야 주소가 DB 에 남는다
const PRIVATE_UPLOAD_PREFIXES = ["feedback/", "exam-proofs/"];
const UPLOAD_GRACE_HOURS = 24;
const UPLOAD_DELETE_CHUNK = 100;
const PUBLIC_BLOB_MARK = ".public.blob.vercel-storage.com/";
const INCOMPLETE_ACCOUNT_DAYS = 7;
// 계정 하나를 지우는 데 파일 삭제와 쿼리가 여럿 들어, 실행 시간 안에 끝나도록 다른 정리보다 적게 잡는다
const INCOMPLETE_ACCOUNT_BATCH = 100;

export interface PrivacyRetentionResult {
    cutoff: string;
    feedbackDeleted: number;
    approvedExamRedacted: number;
    rejectedExamDeleted: number;
    analyticsVisitorsDeleted: number;
    analyticsSaltsDeleted: number;
    analyticsCountsDeleted: number;
    orphanUploadsDeleted: number;
    opinionReportsDeleted: number;
    musecatActionsDeleted: number;
    partnerOutboxDeleted: number;
    oauthCredentialsDeleted: number;
    musecatTokensCleared: number;
    incompleteAccountsDeleted: number;
    failed: number;
}

// 방문 통계 — 방문자 해시와 그날의 무작위 값은 오늘(서울) 이전 것을 전부, 날짜별 합계는 90일이 지난 것을 지운다
async function cleanAnalytics(now: Date, result: PrivacyRetentionResult) {
    const today = analyticsDateKey(now);
    const countsCutoff = analyticsDateKey(
        subDays(now, ANALYTICS_RETENTION_DAYS)
    );
    try {
        result.analyticsVisitorsDeleted = await db.$executeRaw`
            DELETE FROM "analytics_visitors" WHERE "date" < ${today}::date`;
        result.analyticsSaltsDeleted = await db.$executeRaw`
            DELETE FROM "analytics_salts" WHERE "date" < ${today}::date`;
        result.analyticsCountsDeleted = await db.$executeRaw`
            DELETE FROM "analytics_daily_counts" WHERE "date" < ${countsCutoff}::date`;
    } catch (error) {
        result.failed += 1;
        console.error("방문 통계 보관 만료 정리 실패", error);
    }
}

// 처리방침 「보유 기간」 에 적은 나머지 기록 — 처리한 신고(신고된 글 사본 포함)는 처리한 시각부터, 뮤즈캣에 보낸 요청 · 파트너 알림은 만든 시각부터 6개월,
// 만료된 OAuth 코드 · 토큰과 뮤즈캣 연결 토큰은 만료 하루 뒤(만료 직후 들어온 요청을 거절 사유로 구분하려고 하루를 둔다)
async function cleanExpiredRecords(
    now: Date,
    cutoff: Date,
    result: PrivacyRetentionResult
) {
    const steps: [string, () => Promise<void>][] = [
        [
            "처리한 신고",
            async () => {
                const { count } = await db.communityOpinionReport.deleteMany({
                    where: { status: "resolved", resolvedAt: { lte: cutoff } },
                });
                result.opinionReportsDeleted = count;
            },
        ],
        [
            "뮤즈캣 요청 기록",
            async () => {
                const { count } = await db.musecatAction.deleteMany({
                    where: { createdAt: { lte: cutoff } },
                });
                result.musecatActionsDeleted = count;
            },
        ],
        [
            "파트너 알림 대기열",
            async () => {
                // 받을 주소가 없어 보내지 못한 해제 알림은 pending 으로 남으므로 상태를 가리지 않는다
                const { count } = await db.partnerOutboxMessage.deleteMany({
                    where: { createdAt: { lte: cutoff } },
                });
                result.partnerOutboxDeleted = count;
            },
        ],
        [
            "만료된 OAuth 코드 · 토큰",
            async () => {
                const expired = { expiresAt: { lt: subDays(now, 1) } };
                const counts = await Promise.all([
                    db.oAuthAuthorizationCode.deleteMany({ where: expired }),
                    db.oAuthAccessToken.deleteMany({ where: expired }),
                    db.oAuthRefreshToken.deleteMany({ where: expired }),
                ]);
                result.oauthCredentialsDeleted = counts.reduce(
                    (sum, { count }) => sum + count,
                    0
                );
            },
        ],
        [
            "만료된 뮤즈캣 연결 토큰",
            async () => {
                // 줄과 상태는 다시 연결 안내에 쓰여 그대로 두고 암호화한 토큰만 비운다
                const { count } = await db.musecatConnection.updateMany({
                    where: {
                        familyExpiresAt: { lt: subDays(now, 1) },
                        OR: [
                            { accessTokenEnc: { not: null } },
                            { refreshTokenEnc: { not: null } },
                        ],
                    },
                    data: { accessTokenEnc: null, refreshTokenEnc: null },
                });
                result.musecatTokensCleared = count;
            },
        ],
    ];
    for (const [label, run] of steps) {
        try {
            await run();
        } catch (error) {
            result.failed += 1;
            console.error(`${label} 보관 만료 정리 실패`, error);
        }
    }
}

async function listOldUploads(
    cutoff: Date,
    prefixes = UPLOAD_PREFIXES,
    token?: string
) {
    const uploads: { url: string; pathname: string }[] = [];
    for (const prefix of prefixes) {
        let cursor: string | undefined;
        do {
            const page = await list({ prefix, cursor, token });
            for (const blob of page.blobs)
                if (blob.uploadedAt <= cutoff)
                    uploads.push({ url: blob.url, pathname: blob.pathname });
            cursor = page.hasMore ? page.cursor : undefined;
        } while (cursor);
    }
    return uploads;
}

// 저장소 주소가 든 칸을 모두 이어 붙인다. 파일 경로에 무작위 값이 있어 글 어디에든 그 경로가 있으면 쓰는 파일로 본다.
// 공지 본문도 이벤트 폴더 이미지를 그릴 수 있어 함께 본다
async function uploadReferences() {
    const mark = { contains: PUBLIC_BLOB_MARK };
    const [users, events, translations] = await Promise.all([
        db.user.findMany({ where: { avatar: mark }, select: { avatar: true } }),
        db.communityEvent.findMany({
            where: {
                OR: [
                    { bannerUrl: mark },
                    { publishedBannerUrl: mark },
                    { content: mark },
                    { publishedContent: mark },
                ],
            },
            select: {
                bannerUrl: true,
                publishedBannerUrl: true,
                content: true,
                publishedContent: true,
            },
        }),
        db.announcementTranslation.findMany({
            where: { content: mark },
            select: { content: true },
        }),
    ]);
    return [
        ...users.map((user) => user.avatar),
        ...events.flatMap((event) => [
            event.bannerUrl,
            event.publishedBannerUrl,
            event.content,
            event.publishedContent,
        ]),
        ...translations.map((translation) => translation.content),
    ]
        .filter((value): value is string => Boolean(value))
        .join("\n");
}

// 올리고 저장하지 않은 공개 업로드 — 올린 지 24시간이 지났고 DB 어디에도 주소가 없는 파일만 지운다.
// 로컬 · 미리보기는 다른 DB 를 보면서 같은 저장소 토큰을 쓸 수 있어 운영 배포에서만 돈다
async function cleanOrphanUploads(now: Date, result: PrivacyRetentionResult) {
    if (process.env.VERCEL_ENV !== "production") return;
    let orphans: string[];
    try {
        const uploads = await listOldUploads(subHours(now, UPLOAD_GRACE_HOURS));
        if (!uploads.length) return;
        const references = await uploadReferences();
        orphans = uploads
            .filter((upload) => !references.includes(upload.pathname))
            .slice(0, BATCH_SIZE)
            .map((upload) => upload.url);
    } catch (error) {
        result.failed += 1;
        console.error("저장하지 않은 공개 업로드 찾기 실패", error);
        return;
    }
    for (let start = 0; start < orphans.length; start += UPLOAD_DELETE_CHUNK) {
        const chunk = orphans.slice(start, start + UPLOAD_DELETE_CHUNK);
        try {
            await del(chunk);
            result.orphanUploadsDeleted += chunk.length;
        } catch (error) {
            result.failed += 1;
            console.error("저장하지 않은 공개 업로드 삭제 실패", error);
        }
    }
}

// 올리고 제출하지 않은 비공개 업로드 — 공개 업로드와 같은 기준으로 지운다
async function cleanOrphanPrivateUploads(
    now: Date,
    result: PrivacyRetentionResult
) {
    const token = serverEnv.PRIVATE_BLOB_READ_WRITE_TOKEN;
    if (process.env.VERCEL_ENV !== "production" || !token) return;
    let orphans: string[];
    try {
        const uploads = await listOldUploads(
            subHours(now, UPLOAD_GRACE_HOURS),
            PRIVATE_UPLOAD_PREFIXES,
            token
        );
        if (!uploads.length) return;
        const [reports, submissions] = await Promise.all([
            db.feedbackReport.findMany({
                where: { imageUrl: { not: null } },
                select: { imageUrl: true },
            }),
            db.examSubmission.findMany({
                where: { proofImageUrl: { not: null } },
                select: { proofImageUrl: true },
            }),
        ]);
        const references = [
            ...reports.map((report) => report.imageUrl),
            ...submissions.map((submission) => submission.proofImageUrl),
        ].join("\n");
        orphans = uploads
            .filter((upload) => !references.includes(upload.pathname))
            .slice(0, BATCH_SIZE)
            .map((upload) => upload.url);
    } catch (error) {
        result.failed += 1;
        console.error("제출하지 않은 비공개 업로드 찾기 실패", error);
        return;
    }
    for (let start = 0; start < orphans.length; start += UPLOAD_DELETE_CHUNK) {
        const chunk = orphans.slice(start, start + UPLOAD_DELETE_CHUNK);
        try {
            await del(chunk, { token });
            result.orphanUploadsDeleted += chunk.length;
        } catch (error) {
            result.failed += 1;
            console.error("제출하지 않은 비공개 업로드 삭제 실패", error);
        }
    }
}

// 가입을 끝내지 않은 계정 — 온보딩을 마치지 않은 채 만든 지 7일이 지나면 탈퇴와 같은 순서(업로드 파일 → 계정)로 지운다
async function cleanIncompleteAccounts(
    now: Date,
    result: PrivacyRetentionResult
) {
    const accounts = await db.user
        .findMany({
            where: {
                profileCompletedAt: null,
                createdAt: { lt: subDays(now, INCOMPLETE_ACCOUNT_DAYS) },
            },
            select: { id: true, ...ACCOUNT_UPLOADS_SELECT },
            orderBy: { id: "asc" },
            take: INCOMPLETE_ACCOUNT_BATCH,
        })
        .catch((error: unknown) => {
            result.failed += 1;
            console.error("가입을 끝내지 않은 계정 찾기 실패", error);
            return [];
        });
    for (const account of accounts) {
        try {
            await deleteAccountData(account.id, account);
            result.incompleteAccountsDeleted += 1;
        } catch (error) {
            result.failed += 1;
            console.error(
                `가입을 끝내지 않은 계정 ${account.id} 정리 실패`,
                error
            );
        }
    }
}

export async function runPrivacyRetention(
    now = new Date()
): Promise<PrivacyRetentionResult> {
    const cutoff = subMonths(now, RETENTION_MONTHS);
    const [feedbackReports, approvedSubmissions, rejectedSubmissions] =
        await Promise.all([
            db.feedbackReport.findMany({
                where: {
                    status: "resolved",
                    reviewedAt: { lte: cutoff },
                },
                select: { id: true, imageUrl: true },
                take: BATCH_SIZE,
            }),
            db.examSubmission.findMany({
                where: {
                    status: "approved",
                    reviewedAt: { lte: cutoff },
                    OR: [
                        { proofImageUrl: { not: null } },
                        { reviewNote: { not: null } },
                    ],
                },
                select: { id: true, proofImageUrl: true },
                take: BATCH_SIZE,
            }),
            db.examSubmission.findMany({
                where: {
                    status: "rejected",
                    reviewedAt: { lte: cutoff },
                },
                select: { id: true, proofImageUrl: true },
                take: BATCH_SIZE,
            }),
        ]);

    const result: PrivacyRetentionResult = {
        cutoff: cutoff.toISOString(),
        feedbackDeleted: 0,
        approvedExamRedacted: 0,
        rejectedExamDeleted: 0,
        analyticsVisitorsDeleted: 0,
        analyticsSaltsDeleted: 0,
        analyticsCountsDeleted: 0,
        orphanUploadsDeleted: 0,
        opinionReportsDeleted: 0,
        musecatActionsDeleted: 0,
        partnerOutboxDeleted: 0,
        oauthCredentialsDeleted: 0,
        musecatTokensCleared: 0,
        incompleteAccountsDeleted: 0,
        failed: 0,
    };

    for (const report of feedbackReports) {
        try {
            await deleteBlobStrict(report.imageUrl);
            const deleted = await db.feedbackReport.deleteMany({
                where: {
                    id: report.id,
                    status: "resolved",
                    reviewedAt: { lte: cutoff },
                },
            });
            result.feedbackDeleted += deleted.count;
        } catch (error) {
            result.failed += 1;
            console.error(`피드백 ${report.id} 보관 만료 정리 실패`, error);
        }
    }

    for (const submission of approvedSubmissions) {
        try {
            await deleteBlobStrict(submission.proofImageUrl);
            const updated = await db.examSubmission.updateMany({
                where: {
                    id: submission.id,
                    status: "approved",
                    reviewedAt: { lte: cutoff },
                },
                data: {
                    proofImageUrl: null,
                    reviewNote: null,
                },
            });
            result.approvedExamRedacted += updated.count;
        } catch (error) {
            result.failed += 1;
            console.error(
                `승인 검정 제출 ${submission.id} 보관 만료 정리 실패`,
                error
            );
        }
    }

    for (const submission of rejectedSubmissions) {
        try {
            await deleteBlobStrict(submission.proofImageUrl);
            const deleted = await db.examSubmission.deleteMany({
                where: {
                    id: submission.id,
                    status: "rejected",
                    reviewedAt: { lte: cutoff },
                },
            });
            result.rejectedExamDeleted += deleted.count;
        } catch (error) {
            result.failed += 1;
            console.error(
                `반려 검정 제출 ${submission.id} 보관 만료 정리 실패`,
                error
            );
        }
    }

    await cleanAnalytics(now, result);
    await cleanExpiredRecords(now, cutoff, result);
    await cleanOrphanUploads(now, result);
    await cleanOrphanPrivateUploads(now, result);
    await cleanIncompleteAccounts(now, result);

    return result;
}
