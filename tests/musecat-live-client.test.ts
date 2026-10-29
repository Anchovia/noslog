import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/env/server", () => ({ serverEnv: {} }));

import { fromMusecatArcade } from "@/features/musecat/server/musecat-live-client";

describe("fromMusecatArcade", () => {
    it("SNS 링크는 http · https 주소만 남긴다", () => {
        const arcade = fromMusecatArcade(
            {
                admin: { id: "arcade-1", country: "KR" },
                basic: { name: "테스트 오락실" },
                sns: {
                    items: [
                        { type: "x", name: "X", link: "https://x.com/arcade" },
                        {
                            type: "web",
                            name: "웹",
                            link: "javascript:alert(1)",
                        },
                        {
                            type: "web",
                            name: "데이터",
                            link: "data:text/html,x",
                        },
                        { type: "web", name: "상대", link: "/arcade" },
                    ],
                },
            },
            [],
            "test-arcade"
        );
        expect(arcade?.social.map((item) => item.link)).toEqual([
            "https://x.com/arcade",
            null,
            null,
            null,
        ]);
    });
});
