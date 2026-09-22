/**
 * 판 위 위치 — 25칸 미니 판(목록 카드 미니 판과 같은 칸 6 · 사이 2)에서 그 칸 하나만 켠다(2026-09-22).
 * 원본 빙고처럼 좌표 글자 없이 위치로 보여 주고, 위치 글(「5행 1열」)은 화면 읽기에만
 */
export default function BingoPosition({
    position,
    label,
}: {
    position: number;
    label: string;
}) {
    return (
        <span className="nl-bingo-position">
            <span className="nl-bingo-mini" aria-hidden="true">
                {Array.from({ length: 25 }, (_, i) => (
                    <span key={i} data-completed={i + 1 === position} />
                ))}
            </span>
            <span className="sr-only">{label}</span>
        </span>
    );
}
