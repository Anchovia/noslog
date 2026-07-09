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
            className="flex cursor-pointer gap-2"
        >
            <span>Recital</span>
            <div
                className={`flex h-6 w-10 items-center rounded-full px-1 transition-all ${
                    isRecital ? "bg-blue-500" : "bg-dark-secondary"
                }`}
            >
                <div
                    className={`bg-white-secondary size-4 rounded-full transition-all ${
                        isRecital ? "translate-x-4" : "translate-x-0"
                    }`}
                />
            </div>
        </div>
    );
}
