import type { UseFormRegisterReturn } from "react-hook-form";
import { Search } from "lucide-react";

interface MusicSearchBarProps {
    registration: UseFormRegisterReturn;
    filterOpen: boolean;
    onToggleFilter: () => void;
}

// 악곡 검색 입력과 필터 열기 버튼을 한곳에서 관리함
export default function MusicSearchBar({
    registration,
    filterOpen,
    onToggleFilter,
}: MusicSearchBarProps) {
    return (
        <div className="flex min-w-0 gap-2">
            <div className="border-border bg-surface rounded-card focus-within:border-text-secondary focus-within:ring-text-secondary/20 flex h-9.5 min-w-0 flex-1 items-center gap-2 border px-3 transition focus-within:ring-2">
                <Search
                    className="text-text-disabled size-4 shrink-0"
                    aria-hidden="true"
                />
                <input
                    placeholder="곡 제목 · 아티스트 검색"
                    className="text-input placeholder:text-text-disabled h-full min-w-0 flex-1 bg-transparent outline-none"
                    {...registration}
                />
            </div>
            <button
                type="button"
                onClick={onToggleFilter}
                aria-expanded={filterOpen}
                className="bg-surface-muted text-section rounded-card flex h-9.5 min-w-14 shrink-0 items-center justify-center px-3 whitespace-nowrap"
            >
                필터
            </button>
        </div>
    );
}
