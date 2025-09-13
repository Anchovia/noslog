import { Dispatch, SetStateAction } from "react";

interface RecitalToggleButtonProps {
    isRecital: boolean;
    setIsRecital: Dispatch<SetStateAction<boolean>>;
}

export default function RecitalToggleButton({
    isRecital,
    setIsRecital,
}: RecitalToggleButtonProps) {
    return (
        <div
            onClick={() => setIsRecital((prev: boolean) => !prev)}
            className="flex gap-2 cursor-pointer"
        >
            <span>Recital</span>
            <div
                className={`flex w-10 h-6 rounded-full items-center px-1 transition-all ${
                    isRecital ? "bg-blue-500" : "bg-dark-secondary"
                }`}
            >
                <div
                    className={`size-4 bg-white-secondary rounded-full transition-all ${
                        isRecital ? "translate-x-4" : "translate-x-0"
                    }`}
                />
            </div>
        </div>
    );
}
