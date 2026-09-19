import type { OfficialXPostContent } from "@/features/home/officialXPostContent";

export const realTimeline = {
    data: [
        {
            id: "2097492558306033739",
            text: "【 Real譜面追加 】\n9月10日(木)10:00より、『Just Be Friends』に高難度の“Real”譜面が追加。 #ノスタルジア\n\nhttps://t.co/98Ze9MjIOV https://t.co/4I9QNGPXxb",
            created_at: "2026-09-09T01:09:30.000Z",
            attachments: { media_keys: ["3_2097492484444364800"] },
            entities: {
                urls: [
                    {
                        url: "https://t.co/98Ze9MjIOV",
                        expanded_url:
                            "https://p.eagate.573.jp/game/nostalgia/op3/news/entrance.html#20260909-01",
                        display_url: "p.eagate.573.jp/game/nostalgia…",
                    },
                    {
                        url: "https://t.co/4I9QNGPXxb",
                        expanded_url:
                            "https://x.com/NOSTALGIA_573/status/2097492558306033739/photo/1",
                        display_url: "pic.x.com/4I9QNGPXxb",
                        media_key: "3_2097492484444364800",
                    },
                ],
            },
        },
        {
            id: "2095015245991510252",
            text: "older",
            created_at: "2026-09-02T05:05:32.000Z",
        },
    ],
    includes: {
        media: [
            {
                media_key: "3_2097492484444364800",
                type: "photo",
                url: "https://pbs.twimg.com/media/HRvKTTZboAAZuVA.jpg",
                width: 640,
                height: 360,
            },
        ],
        users: [
            {
                id: "831685375735132160",
                name: "ノスタルジア公式@Op.3好評稼働中！",
                username: "NOSTALGIA_573",
                profile_image_url:
                    "https://pbs.twimg.com/profile_images/2075145444016209920/AK864Pkk_normal.png",
            },
        ],
    },
    meta: { result_count: 2 },
};

export const storedPost: OfficialXPostContent = {
    id: "2097492558306033739",
    url: "https://x.com/NOSTALGIA_573/status/2097492558306033739",
    text: realTimeline.data[0].text,
    createdAt: "2026-09-09T01:09:30.000Z",
    author: { name: "NOSTALGIA", username: "NOSTALGIA_573", avatarUrl: null },
    image: null,
    links: [],
    translations: { ko: "한국어 번역", en: "English translation" },
};
