import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import type {
    BingoFormValues,
    BingoValues,
} from "@/features/bingos/schemas/bingoEditorSchema";

import type { BingoMusicOption } from "./bingoEditorTypes";
import BingoMissionCard from "./bingoMissionCard";

interface BingoMissionListProps {
    cells: BingoFormValues["cells"];
    control: Control<BingoFormValues, unknown, BingoValues>;
    errors: FieldErrors<BingoFormValues>;
    musics: BingoMusicOption[];
    register: UseFormRegister<BingoFormValues>;
}

export default function BingoMissionList({
    cells,
    control,
    errors,
    musics,
    register,
}: BingoMissionListProps) {
    const firstInvalidCellIndex = Array.isArray(errors.cells)
        ? errors.cells.findIndex(Boolean)
        : -1;

    return (
        <section className="flex flex-col gap-2">
            <h2 className="text-section font-bold">미션 25칸</h2>
            {cells.map((cell, index) => (
                <BingoMissionCard
                    key={cell.position}
                    control={control}
                    errors={errors}
                    index={index}
                    musics={musics}
                    position={cell.position}
                    register={register}
                    shouldOpen={index === firstInvalidCellIndex}
                />
            ))}
        </section>
    );
}
