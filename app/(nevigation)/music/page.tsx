import MusicList from "@/components/music/musicList";
import MusicSearch from "@/components/music/musicSearch";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

interface SearchParamsProps {
    qurry?: string;
    normal?: string;
    hard?: string;
    expert?: string;
    real?: string;
}

async function getInitialMusics({
    qurry,
    normal,
    hard,
    expert,
    real,
}: SearchParamsProps) {
    // 문자열을 숫자로 변환
    const initialMusics = await db.music.findMany({
        where: {
            AND: [
                qurry
                    ? {
                          OR: [
                              { title: { contains: qurry } },
                              { artist: { contains: qurry } },
                          ],
                      }
                    : {},
                normal
                    ? {
                          normal: {
                              equals: parseInt(normal),
                          },
                      }
                    : {},
                hard
                    ? {
                          hard: {
                              equals: parseInt(hard),
                          },
                      }
                    : {},
                expert
                    ? {
                          expert: {
                              equals: parseInt(expert),
                          },
                      }
                    : {},

                real
                    ? {
                          real: {
                              equals: parseInt(real),
                              not: null,
                          },
                      }
                    : {},
            ],
        },
        select: {
            index: true,
            title: true,
            artist: true,
            category_short: true,
            background: true,
            sheet_len: true,
            difficulty_levels: true,
        },
        take: 20,
    });
    revalidatePath("/music");
    return initialMusics;
}

export default async function Music(props: {
    searchParams: Promise<SearchParamsProps>;
}) {
    const searchParams = await props.searchParams;
    const initialMusics = await getInitialMusics(searchParams);

    return (
        <main className="mx-auto flex h-full min-h-screen max-w-(--breakpoint-sm) flex-col gap-4">
            <MusicSearch />
            <MusicList
                initialMusics={initialMusics}
                searchParams={searchParams}
            />
        </main>
    );
}
