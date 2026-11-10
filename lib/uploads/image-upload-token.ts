import "server-only";

import type { ActionFailure, ActionResult } from "@/lib/actions/result";
import {
    createImageUploadToken,
    createPrivateImageUploadToken,
} from "@/lib/blob";
import {
    claimUploadTokenQuota,
    releaseUploadTokenQuota,
    type UploadPurpose,
} from "@/lib/upload-rate-limit";

interface ImageUploadTokenRequest {
    userId: number;
    purpose: UploadPurpose;
    access: "public" | "private";
    pathnameWithoutExtension: string;
    contentType: string;
    /** 한도를 차지하기 전에 보는 조건 — 실패 결과를 돌려주면 차지하지 않고 그대로 답한다 */
    beforeClaim?: () => Promise<ActionFailure | null>;
    limitMessage: string;
    /** 토큰이 형식 때문에 나오지 않았을 때의 답. null 이면 오류로 다뤄 기록하고 errorMessage 로 답한다 */
    refusedTypeMessage: string | null;
    errorMessage: string;
    logError: (error: unknown) => void;
    /** 반납이 실패했을 때 — 없으면 넘어간다 */
    onReleaseError?: (error: unknown) => void;
}

// 한도 차지 → 토큰 발급 → 발급하지 못하면 차지한 한도 반납. 로그인 · 형식 확인은 부르는 쪽이 먼저 한다
export async function requestImageUploadToken({
    userId,
    purpose,
    access,
    pathnameWithoutExtension,
    contentType,
    beforeClaim,
    limitMessage,
    refusedTypeMessage,
    errorMessage,
    logError,
    onReleaseError = () => null,
}: ImageUploadTokenRequest): Promise<
    ActionResult<{ pathname: string; token: string }>
> {
    let grantId: number | null = null;
    try {
        const rejection = beforeClaim ? await beforeClaim() : null;
        if (rejection) return rejection;

        const quota = await claimUploadTokenQuota(userId, purpose);
        if (!quota.allowed) return { success: false, message: limitMessage };
        grantId = quota.grantId;

        const upload =
            access === "private"
                ? await createPrivateImageUploadToken(
                      pathnameWithoutExtension,
                      contentType
                  )
                : await createImageUploadToken(
                      pathnameWithoutExtension,
                      contentType
                  );
        if (!upload) {
            if (refusedTypeMessage === null)
                throw new Error("invalid image type");
            await releaseUploadTokenQuota(userId, grantId).catch(
                onReleaseError
            );
            return { success: false, message: refusedTypeMessage };
        }
        return { success: true, message: "", ...upload };
    } catch (error) {
        logError(error);
        if (grantId !== null)
            await releaseUploadTokenQuota(userId, grantId).catch(
                onReleaseError
            );
        return { success: false, message: errorMessage };
    }
}
