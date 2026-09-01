import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const clientEnv = createEnv({
    client: {
        NEXT_PUBLIC_KAKAO_MAP_APP_KEY: z.string().trim().min(1).optional(),
    },
    runtimeEnv: {
        NEXT_PUBLIC_KAKAO_MAP_APP_KEY:
            process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY,
    },
    emptyStringAsUndefined: true,
});
