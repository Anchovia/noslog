import AnnouncementArchive from "@/features/announcements/components/announcementArchive";
import AnnouncementDetail from "@/features/announcements/components/announcementDetail";
import CriticalAnnouncement from "@/features/announcements/components/criticalAnnouncement";
import HomeAnnouncements from "@/components/home/homeAnnouncements";
import PageContainer from "@/components/layout/pageContainer";
import { getServerI18n } from "@/lib/i18n/server";

const content = {
    ko: {
        title: "v1.6.0 업데이트 — 악곡 검색과 번역 곡명 개선",
        body: "NosLog v1.6.0을 배포했습니다. 이번 업데이트는 검색 정확도와 번역 곡명 표기를 중심으로 개선했습니다.\n\n## 변경 사항\n\n- 악곡 검색이 초성·부분 일치를 지원합니다\n- 번역 곡명 별칭이 검색에 반영됩니다\n- 검색 결과 정렬 기준을 정리했습니다\n\n### 번역 곡명 표기\n\n**원제 표기는 그대로 유지됩니다.** 번역 곡명은 검색 별칭으로만 사용됩니다.\n\n1. 저장된 검색어는 자동으로 갱신됩니다\n2. 문제가 있으면 아래 창구로 제보해 주세요\n\n자세한 변경 내역은 [데이터 동기화](/bookmarklet) 페이지에서 확인할 수 있습니다.\n\n[공식 Discord 서버](https://discord.com)",
    },
    ja: {
        title: "v1.6.0 アップデート — 楽曲検索と翻訳曲名の改善",
        body: "NosLog v1.6.0を公開しました。楽曲検索と翻訳曲名の表示を改善しました。\n\n## 変更点\n\n- 楽曲検索を改善しました\n- 翻訳曲名を検索に反映しました\n\n### 翻訳曲名\n\n**原題の表示は維持されます。**\n\n1. 保存した検索語が更新されます\n2. 問題があればご連絡ください\n\n[データ同期](/bookmarklet)\n\n[Discord](https://discord.com)",
    },
    en: {
        title: "v1.6.0 update — music search and translated titles",
        body: "NosLog v1.6.0 is available. This update improves music search and translated titles.\n\n## Changes\n\n- Improved music search\n- Added translated search aliases\n\n### Translated titles\n\n**Original titles remain unchanged.**\n\n1. Saved searches update automatically\n2. Report any problems\n\n[Data sync](/bookmarklet)\n\n[Discord](https://discord.com)",
    },
};

// Presentation fixtures only: no published content or database mutations.
export default async function AnnouncementsFixture({
    state,
}: {
    state?: string;
}) {
    const { locale } = await getServerI18n();
    const copy = content[locale];
    const count = state === "empty" ? 0 : state === "twenty" ? 20 : 21;
    const notices = Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        slug: `fixture-${index + 1}`,
        category: (["UPDATE", "MAINTENANCE", "DATA", "NOTICE"] as const)[
            index % 4
        ],
        title: index === 1 ? copy.title.repeat(3).slice(0, 80) : copy.title,
        content: copy.body,
        publishedAt: new Date(
            Date.UTC(2026, 7 - Math.floor(index / 3), 15 - (index % 3))
        ).toISOString(),
        modifiedAt: null as string | null,
    }));
    if (state === "home" || state === "home-empty") {
        return (
            <PageContainer className="nl-home">
                <h1 className="sr-only">NosLog</h1>
                <CriticalAnnouncement
                    announcement={state === "home" ? notices[0] : null}
                />
                <div className="nl-home-updates">
                    <HomeAnnouncements
                        announcements={
                            state === "home" ? notices.slice(1, 4) : []
                        }
                    />
                </div>
            </PageContainer>
        );
    }
    if (state === "detail" || state === "long") {
        const notice = notices[0];
        if (state === "long") {
            notice.title = copy.title.repeat(3).slice(0, 80);
            notice.content =
                `${copy.body}\n\n${"A".repeat(400)}\n\n${copy.body.repeat(20)}`.slice(
                    0,
                    5000
                );
            notice.modifiedAt = "2026-08-20T00:00:00.000Z";
        }
        return <AnnouncementDetail announcement={notice} />;
    }
    return (
        <AnnouncementArchive
            announcements={notices.slice(0, 20)}
            page={1}
            totalPages={Math.max(1, Math.ceil(count / 20))}
        />
    );
}
