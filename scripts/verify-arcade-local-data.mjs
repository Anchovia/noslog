import { PrismaClient } from "@prisma/client";
import { readFile, writeFile, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const url = new URL(process.env.DATABASE_URL ?? "http://invalid");
if (
    url.hostname !== "127.0.0.1" ||
    url.port !== "55432" ||
    url.pathname !== "/noslog_v2"
)
    throw new Error("Only the explicit local NosLog test database is allowed.");
const manifest = "/tmp/noslog-p12-local-data.json";
const db = new PrismaClient({ datasourceUrl: url.href });
try {
    if (process.argv[2] === "create") {
        try {
            await readFile(manifest);
            throw new Error(
                "Clean up the existing P12 fixture before creating another."
            );
        } catch (error) {
            if (error.code !== "ENOENT") throw error;
        }
        const owner = await db.user.findUnique({
            where: { id: 1 },
            select: { username: true, preferred_arcade_id: true },
        });
        if (owner?.username !== "E2E_RANKER")
            throw new Error(
                "The expected local E2E account is missing; no mutation performed."
            );
        const suffix = randomUUID();
        const records = await db.$transaction(async (tx) => {
            const result = [];
            for (const [index, coordinates] of [
                [37.4979, 127.0276],
                [37.49791, 127.02761],
                [37.556, 126.923],
            ].entries()) {
                const slug = `noslog-p12-${suffix}-${index}`;
                result.push(
                    await tx.arcade.create({
                        data: {
                            name: `NosLog P12 local verification ${suffix} ${index + 1}`,
                            region: "서울",
                            address:
                                "검증용 임시 주소 · Temporary test address",
                            latitude: coordinates[0],
                            longitude: coordinates[1],
                            play_price: 1000,
                            coin_count: 2,
                            publicDetails: {
                                create: {
                                    slug,
                                    countryCode: "KR",
                                    timeZone: "Asia/Seoul",
                                    currencyCode: "KRW",
                                    nativeLanguage: "ko",
                                    locality: index === 2 ? "마포구" : "강남구",
                                    cabinetVerifiedAt: new Date(),
                                    hoursVerifiedAt: new Date(),
                                    hoursValidUntil: new Date(
                                        Date.now() + 86400000
                                    ),
                                    hours: {
                                        weekly: Object.fromEntries(
                                            Array.from(
                                                { length: 7 },
                                                (_, day) => [
                                                    String(day),
                                                    { open: 0, close: 1440 },
                                                ]
                                            )
                                        ),
                                        exceptions: {},
                                    },
                                },
                            },
                            cabinets: {
                                create: [
                                    {
                                        position: 0,
                                        availability: "available",
                                        condition: "good",
                                        verifiedAt: new Date(),
                                    },
                                    {
                                        position: 1,
                                        availability: "unavailable",
                                        condition: "unknown",
                                        note: "검증용 점검 · Test maintenance",
                                        verifiedAt: new Date(),
                                    },
                                ],
                            },
                            slugAliases: { create: { slug: `${slug}-old` } },
                        },
                        select: {
                            id: true,
                            name: true,
                            publicDetails: { select: { slug: true } },
                        },
                    })
                );
            }
            return result;
        });
        await writeFile(
            manifest,
            JSON.stringify(
                { records, originalPreference: owner.preferred_arcade_id },
                null,
                2
            ),
            { flag: "wx" }
        );
        console.log(JSON.stringify({ records }));
    } else if (process.argv[2] === "cleanup") {
        const state = JSON.parse(await readFile(manifest, "utf8"));
        const ids = state.records.map((record) => record.id);
        await db.$transaction(async (tx) => {
            const actual = await tx.arcade.findMany({
                where: { id: { in: ids } },
                select: { id: true, name: true },
            });
            if (
                actual.some(
                    (record) =>
                        !state.records.some(
                            (expected) =>
                                expected.id === record.id &&
                                expected.name === record.name
                        )
                )
            )
                throw new Error("Fixture identity changed; cleanup stopped.");
            await tx.user.updateMany({
                where: {
                    id: 1,
                    username: "E2E_RANKER",
                    preferred_arcade_id: { in: ids },
                },
                data: { preferred_arcade_id: state.originalPreference },
            });
            await tx.feedbackReport.deleteMany({
                where: { arcadeId: { in: ids } },
            });
            await tx.arcade.deleteMany({ where: { id: { in: ids } } });
        });
        await unlink(manifest);
        console.log(
            "Owned P12 fixtures removed; local test preference restored when still pointing at a fixture."
        );
    } else throw new Error("Use create or cleanup.");
} finally {
    await db.$disconnect();
}
