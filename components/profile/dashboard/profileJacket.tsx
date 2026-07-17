import { getJacketUrl } from "@/lib/tiers";

// 프로필 기록 목록의 악곡 자켓을 한곳에서 표시함
export default function ProfileJacket({
    index,
    background,
    title,
}: {
    index: string;
    background: string | null;
    title: string;
}) {
    return (
        <span
            className="bg-surface-muted size-10 shrink-0 rounded-md bg-cover bg-center"
            style={{
                backgroundImage: `url(${getJacketUrl(index, background)})`,
            }}
            aria-label={`${title} 자켓`}
        />
    );
}
