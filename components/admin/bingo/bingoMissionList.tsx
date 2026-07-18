import type { BingoEditorCellData, BingoMusicOption } from "./bingoEditorTypes";
import BingoMissionCard from "./bingoMissionCard";

interface BingoMissionListProps {
    cells: BingoEditorCellData[];
    musics: BingoMusicOption[];
}

export default function BingoMissionList({
    cells,
    musics,
}: BingoMissionListProps) {
    return (
        <section className="flex flex-col gap-2">
            <h2 className="text-section font-bold">미션 25칸</h2>
            {cells.map((cell) => (
                <BingoMissionCard
                    key={cell.position}
                    cell={cell}
                    musics={musics}
                />
            ))}
        </section>
    );
}
