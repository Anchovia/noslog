import { deleteBingo } from "@/app/admin/bingos/actions";
import { Save, Trash2 } from "lucide-react";

export function SaveBingoButton() {
    return (
        <button className="bg-text-primary text-bg sticky bottom-3 z-10 flex h-11 items-center justify-center gap-2 rounded-md text-sm font-bold shadow-lg">
            <Save className="size-4" /> 빙고 저장
        </button>
    );
}

export function DeleteBingoForm({ bingoId }: { bingoId: number }) {
    return (
        <form action={deleteBingo}>
            <input type="hidden" name="id" value={bingoId} />
            <button className="border-danger/50 text-danger flex h-10 w-full items-center justify-center gap-2 rounded-md border text-sm font-bold">
                <Trash2 className="size-4" /> 진행 기록이 없을 때 삭제
            </button>
        </form>
    );
}
