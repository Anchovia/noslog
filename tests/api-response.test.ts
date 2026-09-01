import { describe, expect, it } from "vitest";

import {
    createApiFailure,
    createApiSuccess,
    readApiResponse,
    unwrapApiResponse,
} from "@/lib/api/response";

describe("공통 API 응답", () => {
    it("성공 데이터를 판별 가능한 공통 형식으로 만든다", () => {
        expect(createApiSuccess({ id: 7 })).toEqual({
            isSuccess: true,
            code: "SUCCESS",
            message: "",
            result: { id: 7 },
        });
    });

    it("실패 응답은 result를 null로 고정한다", () => {
        expect(
            createApiFailure({
                code: "INVALID_INPUT",
                message: "입력값을 확인해주세요.",
                fieldErrors: { username: ["필수 항목입니다."] },
            })
        ).toEqual({
            isSuccess: false,
            code: "INVALID_INPUT",
            message: "입력값을 확인해주세요.",
            result: null,
            fieldErrors: { username: ["필수 항목입니다."] },
        });
    });

    it("컴포넌트 경계에는 성공 result만 전달한다", () => {
        expect(unwrapApiResponse(createApiSuccess([1, 2, 3]))).toEqual([
            1, 2, 3,
        ]);
    });

    it("실패 응답을 code와 status가 있는 ApiError로 변환한다", async () => {
        const response = Response.json(
            createApiFailure({
                code: "RANKINGS_FETCH_FAILED",
                message: "Unable to load rankings.",
            }),
            { status: 503 }
        );

        await expect(readApiResponse(response)).rejects.toMatchObject({
            name: "ApiError",
            code: "RANKINGS_FETCH_FAILED",
            status: 503,
        });
    });

    it("공통 형식이 아닌 JSON을 유효한 응답으로 처리하지 않는다", async () => {
        const response = Response.json({ message: "legacy" });

        await expect(readApiResponse(response)).rejects.toEqual(
            expect.objectContaining({
                code: "INVALID_API_RESPONSE",
            })
        );
    });
});
