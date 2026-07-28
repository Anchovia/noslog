import { cn } from "@/lib/utils";
import { useTranslations } from "@/components/i18n/localeProvider";

import { MUSIC_CATEGORIES, type MusicCategory } from "./musicSearchTypes";

interface MusicCategoryFilterProps {
    selected: MusicCategory[];
    onToggle: (category: MusicCategory) => void;
}

// 악곡 카테고리 선택 버튼을 한곳에서 관리함
export default function MusicCategoryFilter({
    selected,
    onToggle,
}: MusicCategoryFilterProps) {
    const t = useTranslations();

    return (
        <div className="flex flex-col gap-2">
            <span className="text-caption font-semibold">
                {t("music.category")}
            </span>
            <div className="flex flex-wrap gap-2">
                {MUSIC_CATEGORIES.map((category) => (
                    <button
                        key={category.value}
                        type="button"
                        onClick={() => onToggle(category.value)}
                        className={cn(
                            "rounded-full border px-3 py-1 text-xs leading-normal transition-colors",
                            selected.includes(category.value)
                                ? category.className
                                : "border-border bg-surface-muted text-text-secondary"
                        )}
                    >
                        {category.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
