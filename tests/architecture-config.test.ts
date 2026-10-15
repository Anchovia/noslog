import { ESLint } from "eslint";
import { beforeAll, describe, expect, it } from "vitest";

const eslint = new ESLint();
const rule = "noslog/boundaries";
async function violations(source: string, filePath: string) {
    const [result] = await eslint.lintText(source, { filePath });
    return result.messages.filter(({ ruleId }) => ruleId === rule);
}

describe("architecture boundaries", () => {
    beforeAll(async () => {
        await eslint.calculateConfigForFile("lib/boundary-example.ts");
    }, 30_000);
    it("rejects upward imports and re-exports from infrastructure", async () => {
        for (const source of [
            'export { default as Button } from "@/components/ui/button";',
            'export * from "@/features/music/api/music-detail";',
            'export const load = () => import("@/components/ui/button");',
            'export { default as Button } from "../components/ui/button";',
        ]) {
            expect(
                await violations(source, "lib/boundary-example.ts")
            ).toHaveLength(1);
        }
    });
    it("rejects feature imports of route implementations and private folders", async () => {
        for (const source of [
            'export { default as Page } from "@/app/(site)/profile/[id]/page";',
            'export { Thing } from "@/app/music/_components/thing";',
        ]) {
            expect(
                await violations(
                    source,
                    "features/music/components/boundary-example.tsx"
                )
            ).toHaveLength(1);
        }
    });
    it("allows private helpers inside their owning route", async () => {
        expect(
            await violations(
                'export { Thing } from "@/app/music/_components/thing";',
                "app/music/page.tsx"
            )
        ).toEqual([]);
    });
    it("allows real Server Action modules as Next.js client entry points", async () => {
        expect(
            await violations(
                '"use client"; export { saveProfile } from "@/app/(site)/settings/actions";',
                "features/settings/components/boundary-example.tsx"
            )
        ).toEqual([]);
    });
    it("rejects direct server code in clients but permits erased types", async () => {
        expect(
            await violations(
                '"use client"; export { getCachedProfileData } from "@/features/profile/server/public-profile-data";',
                "features/profile/components/boundary-example.tsx"
            )
        ).toHaveLength(1);
        expect(
            await violations(
                '"use client"; export type { getCachedProfileData } from "@/features/profile/server/public-profile-data";',
                "features/profile/components/boundary-example.tsx"
            )
        ).toEqual([]);
    });
    it("keeps retained infrastructure contracts type-only", async () => {
        expect(
            await violations(
                'import type { Difficulty } from "@/components/music/music-detail-types"; export type Example = Difficulty;',
                "lib/music/max-grade.ts"
            )
        ).toEqual([]);
        expect(
            await violations(
                'export { Difficulty } from "@/components/music/music-detail-types";',
                "lib/music/max-grade.ts"
            )
        ).toHaveLength(1);
    });
    it("does not impose shared-UI import sorting on preserved editors", async () => {
        const config = await eslint.calculateConfigForFile(
            "components/admin/chart-pattern/chartEditor.tsx"
        );
        expect(config.rules["simple-import-sort/imports"]).toBeUndefined();
        expect(config.rules[rule]).toBeUndefined();
    });
});
