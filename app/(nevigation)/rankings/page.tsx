import UserRankingTable, {
    type RankingMode,
    type RankingRegion,
    type UserRankingRow,
} from "@/components/rankings/userRankingTable";
import { cn } from "@/lib/utils";
import db from "@/lib/db";
import { getUser } from "@/lib/user";
import type { Prisma } from "@/lib/generated/prisma";
import { Globe2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface RankingsPageProps {
    searchParams: Promise<{
        mode?: string;
        region?: string;
        page?: string;
    }>;
}

const PAGE_SIZE = 7;
const rankingModes: { value: RankingMode; label: string }[] = [
    { value: "basic", label: "Basic" },
    { value: "recital", label: "Recital" },
];
const rankingRegions: {
    value: RankingRegion;
    label: string;
    icon?: "kr" | "jp" | "global";
}[] = [
    { value: "all", label: "전체" },
    { value: "kr", label: "KR", icon: "kr" },
    { value: "jp", label: "JP", icon: "jp" },
    { value: "global", label: "GLO", icon: "global" },
];

function normalizeMode(value?: string): RankingMode {
    return value === "recital" ? "recital" : "basic";
}

function normalizeRegion(value?: string): RankingRegion {
    return value === "kr" || value === "jp" || value === "global"
        ? value
        : "all";
}

function regionWhere(region: RankingRegion): Prisma.UserWhereInput {
    if (region === "kr") return { country: "ko-KR" };
    if (region === "jp") return { country: "ja-JP" };
    if (region === "global") {
        return { country: { notIn: ["ko-KR", "ja-JP"] } };
    }
    return {};
}

function RegionIcon({ icon }: { icon?: "kr" | "jp" | "global" }) {
    if (icon === "kr") {
        return (
            <Image
                src="/flag/ko-KR.svg"
                alt=""
                width={16}
                height={12}
                className="rounded-[2px]"
            />
        );
    }
    if (icon === "jp") {
        return (
            <span className="relative h-3 w-4 rounded-[2px] bg-white">
                <span className="bg-danger absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            </span>
        );
    }
    if (icon === "global") return <Globe2 size={13} aria-hidden />;
    return null;
}

export default async function Rankings({ searchParams }: RankingsPageProps) {
    const params = await searchParams;
    const mode = normalizeMode(params.mode);
    const region = normalizeRegion(params.region);
    const requestedPage = Number.parseInt(params.page || "1", 10);
    const page = Number.isFinite(requestedPage)
        ? Math.max(1, requestedPage)
        : 1;
    const gradeField = mode === "basic" ? "grade_basic" : "grade_recital";
    const examField = mode === "basic" ? "exam_basic" : "exam_recital";
    const where: Prisma.UserWhereInput = {
        ...regionWhere(region),
        [gradeField]: { gt: 0 },
    };

    const [totalCount, users, user] = await Promise.all([
        db.user.count({ where }),
        db.user.findMany({
            where,
            select: {
                id: true,
                username: true,
                avatar: true,
                country: true,
                grade_basic: true,
                grade_recital: true,
                exam_basic: true,
                exam_recital: true,
            },
            orderBy: [{ [gradeField]: "desc" }, { id: "asc" }],
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        }),
        getUser(),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    if (page > totalPages) {
        redirect(`/rankings?mode=${mode}&region=${region}&page=${totalPages}`);
    }

    const rows: UserRankingRow[] = users.map((rankingUser, index) => ({
        id: rankingUser.id,
        rank: (page - 1) * PAGE_SIZE + index + 1,
        username: rankingUser.username,
        avatar: rankingUser.avatar,
        country: rankingUser.country,
        grade: rankingUser[gradeField] ?? 0,
        exam: rankingUser[examField],
    }));

    let currentUser: UserRankingRow | null = null;
    const userGrade = user?.[gradeField] ?? 0;
    const userMatchesRegion =
        !!user &&
        (region === "all" ||
            (region === "kr" && user.country === "ko-KR") ||
            (region === "jp" && user.country === "ja-JP") ||
            (region === "global" &&
                user.country !== "ko-KR" &&
                user.country !== "ja-JP"));

    if (user && userGrade > 0 && userMatchesRegion) {
        const higherUserCount = await db.user.count({
            where: {
                AND: [
                    where,
                    {
                        OR: [
                            { [gradeField]: { gt: userGrade } },
                            {
                                AND: [
                                    { [gradeField]: userGrade },
                                    { id: { lt: user.id } },
                                ],
                            },
                        ],
                    },
                ],
            },
        });

        currentUser = {
            id: user.id,
            rank: higherUserCount + 1,
            username: user.username,
            avatar: user.avatar,
            country: user.country,
            grade: userGrade,
            exam: user[examField],
        };
    }

    const filterHref = (nextMode: RankingMode, nextRegion: RankingRegion) =>
        `/rankings?mode=${nextMode}&region=${nextRegion}&page=1`;

    return (
        <main className="flex flex-col gap-4 px-4 py-5">
            <h1 className="text-title">유저 랭킹</h1>

            <nav
                className="bg-surface-muted rounded-card grid grid-cols-2 p-1"
                aria-label="랭킹 모드"
            >
                {rankingModes.map((item) => (
                    <Link
                        key={item.value}
                        href={filterHref(item.value, region)}
                        aria-current={item.value === mode ? "page" : undefined}
                        className={cn(
                            "flex h-10 items-center justify-center rounded-md text-sm font-semibold",
                            item.value === mode
                                ? "bg-border text-text-primary"
                                : "text-text-secondary"
                        )}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <nav
                className="border-border rounded-card grid grid-cols-4 overflow-hidden border"
                aria-label="랭킹 지역"
            >
                {rankingRegions.map((item) => (
                    <Link
                        key={item.value}
                        href={filterHref(mode, item.value)}
                        aria-current={
                            item.value === region ? "page" : undefined
                        }
                        className={cn(
                            "border-divider flex h-9 items-center justify-center gap-1.5 border-l text-xs font-semibold first:border-l-0",
                            item.value === region
                                ? "bg-surface-muted text-text-primary"
                                : "text-text-secondary"
                        )}
                    >
                        <RegionIcon icon={item.icon} />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <UserRankingTable
                mode={mode}
                region={region}
                page={page}
                pageSize={PAGE_SIZE}
                totalCount={totalCount}
                rows={rows}
                currentUser={currentUser}
            />
        </main>
    );
}
