import type { UseFormSetError } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import { applyFormFieldErrors } from "@/lib/forms/errors";

type FormValues = {
    username: string;
    country: string;
};

describe("React Hook Form 서버 오류 매핑", () => {
    it("각 필드의 첫 번째 서버 오류를 RHF 오류로 설정한다", () => {
        const setError = vi.fn() as unknown as UseFormSetError<FormValues>;

        applyFormFieldErrors(setError, {
            username: ["이미 사용 중인 이름입니다.", "다른 이름을 입력하세요."],
            country: [],
        });

        expect(setError).toHaveBeenCalledOnce();
        expect(setError).toHaveBeenCalledWith("username", {
            type: "server",
            message: "이미 사용 중인 이름입니다.",
        });
    });

    it("필드 오류가 없으면 폼 상태를 변경하지 않는다", () => {
        const setError = vi.fn() as unknown as UseFormSetError<FormValues>;

        applyFormFieldErrors(setError, undefined);

        expect(setError).not.toHaveBeenCalled();
    });
});
