import type { UseFormRegisterReturn } from "react-hook-form";

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
        <div className="flex gap-2">
            <div className="border-border bg-surface rounded-card flex h-9.5 flex-1 items-center gap-2 border px-3">
                <span className="border-text-disabled size-4 rounded-full border-2" />
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
                className="bg-surface-muted text-section rounded-card flex h-9.5 items-center px-3"
            >
                필터
            </button>
        </div>
    );
}
