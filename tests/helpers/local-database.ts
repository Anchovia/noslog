import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { PRISMA_PG_SESSION_OPTIONS } from "@/lib/prisma-pg";

export function createLocalTestClient(
    url: string | undefined,
    message: string,
    options = PRISMA_PG_SESSION_OPTIONS
) {
    if (url && !["localhost", "127.0.0.1"].includes(new URL(url).hostname))
        throw new Error(message);
    return new PrismaClient({
        adapter: new PrismaPg({ connectionString: url, options }),
    });
}
