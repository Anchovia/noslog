import type { UseFormSetError } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import {
    applyFormActionFailure,
    applyFormFieldErrors,
    applyFormRootError,
} from "@/lib/forms/errors";

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

    it("액션 실패를 필드·폼 전체 오류와 알림에 함께 반영한다", () => {
        const setError = vi.fn() as unknown as UseFormSetError<FormValues>;
        const notify = vi.fn();

        applyFormActionFailure(
            setError,
            {
                success: false,
                message: "저장하지 못했습니다.",
                fieldErrors: {
                    username: ["이미 사용 중인 이름입니다."],
                },
            },
            notify
        );

        expect(setError).toHaveBeenNthCalledWith(1, "username", {
            type: "server",
            message: "이미 사용 중인 이름입니다.",
        });
        expect(setError).toHaveBeenNthCalledWith(2, "root.server", {
            type: "server",
            message: "저장하지 못했습니다.",
        });
        expect(notify).toHaveBeenCalledOnce();
        expect(notify).toHaveBeenCalledWith("저장하지 못했습니다.");
    });

    it("폼 전체 오류를 설정하고 선택적으로 알림을 보낸다", () => {
        const setError = vi.fn() as unknown as UseFormSetError<FormValues>;
        const notify = vi.fn();

        applyFormRootError(setError, "다시 시도해주세요.", notify);

        expect(setError).toHaveBeenCalledWith("root.server", {
            type: "server",
            message: "다시 시도해주세요.",
        });
        expect(notify).toHaveBeenCalledWith("다시 시도해주세요.");
    });
});
