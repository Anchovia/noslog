import { clientEnv } from "@/lib/env/client";

// Temporary developer switch while the Light design is unfinished.
export const themeSwitchingEnabled =
    clientEnv.NEXT_PUBLIC_ENABLE_THEME_SWITCHING === "true";
