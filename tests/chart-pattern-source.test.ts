import { describe, expect, it } from "vitest";

import {
    formatCommentTime,
    parseTimeParam,
    timeParam,
} from "@/components/chart-pattern/playbackClock";
import {
    contributionBaseRevision,
    contributionRevisionMessage,
    isExtractedChart,
} from "@/lib/chart-pattern/chartSource";

describe("공개 채보 출처 — 영상 추출 줄기", () => {
    it("관리자 줄기: 공개 번호 이하의 영상 추출 버전이면 추출", () => {
        expect(isExtractedChart(3, [{ number: 2, kind: "vid2bmap" }])).toBe(
            true
        );
        expect(isExtractedChart(3, [{ number: 5, kind: "vid2bmap" }])).toBe(
            false
        );
    });

    it("빈 채보에서 시작한 기여 채보는 그 전 영상 추출과 관계없다", () => {
        expect(
            isExtractedChart(6, [
                { number: 6, kind: "contribution", baseRevision: null },
                { number: 4, kind: "vid2bmap" },
            ])
        ).toBe(false);
    });

    it("추출 채보를 이어 고친 기여 채보는 추출 표기를 이어받는다", () => {
        expect(
            isExtractedChart(8, [
                { number: 8, kind: "contribution", baseRevision: 3 },
                { number: 2, kind: "vid2bmap" },
            ])
        ).toBe(true);
    });

    it("기준 뒤 관리자 초안에만 있던 영상 추출은 기여 채보의 조상이 아니다", () => {
        expect(
            isExtractedChart(8, [
                { number: 8, kind: "contribution", baseRevision: 3 },
                { number: 5, kind: "vid2bmap" },
            ])
        ).toBe(false);
    });

    it("기여 공개 뒤 운영자가 영상 추출을 넣어 다시 공개하면 추출", () => {
        expect(
            isExtractedChart(10, [
                { number: 9, kind: "vid2bmap" },
                { number: 8, kind: "contribution", baseRevision: null },
            ])
        ).toBe(true);
    });

    it("기여 버전 메시지에 기준 버전을 남기고 다시 읽는다", () => {
        expect(
            contributionBaseRevision(contributionRevisionMessage(1, "하늘", 18))
        ).toBe(18);
        expect(
            contributionBaseRevision(
                contributionRevisionMessage(1, "하늘", null)
            )
        ).toBeNull();
    });
});

describe("의견 시각", () => {
    it("0.1초 단위로 쓰고 주소 t 와 오간다", () => {
        expect(formatCommentTime(42_300)).toBe("0:42.3");
        expect(formatCommentTime(92_960)).toBe("1:33.0");
        expect(timeParam(42_340)).toBe("42.3");
        expect(parseTimeParam("42.3")).toBe(42_300);
        expect(parseTimeParam("-1")).toBeNull();
        expect(parseTimeParam("abc")).toBeNull();
        expect(parseTimeParam(undefined)).toBeNull();
    });
});
