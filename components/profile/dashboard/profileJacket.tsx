import MusicJacket from "@/components/music/musicJacket";

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
        <MusicJacket
            index={index}
            background={background}
            title={title}
            className="size-10 shrink-0 rounded-md"
        />
    );
}
