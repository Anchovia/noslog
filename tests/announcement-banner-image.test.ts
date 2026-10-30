import { describe, expect, it } from "vitest";

import {
    announcementBannerDate,
    bannerHeadingFromTitle,
    fitBannerHeadingSize,
} from "@/features/announcements/lib/announcement-banner-image";

describe("공지 배너 그림", () => {
    it("날짜는 공지 목록 형식을 언어별로 쓴다", () => {
        expect(announcementBannerDate("2026-10-30", "ko")).toBe(
            "2026. 10. 30."
        );
        expect(announcementBannerDate("2026-10-30", "ja")).toBe(
            "2026年10月30日"
        );
        expect(announcementBannerDate("2026-10-30", "en")).toBe("Oct 30, 2026");
    });
    it("큰 글자 기본값은 제목에서 서비스 이름을 뺀다", () => {
        expect(bannerHeadingFromTitle("NosLog v2.17.1 업데이트")).toBe(
            "v2.17.1 업데이트"
        );
        expect(bannerHeadingFromTitle("점검 안내")).toBe("점검 안내");
    });
    it("칸을 넘는 큰 글자만 줄인다", () => {
        expect(fitBannerHeadingSize(400)).toBe(70);
        expect(fitBannerHeadingSize(1400)).toBeLessThan(70);
    });
});
