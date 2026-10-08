import TierBandDropArea from "./tier-band-drop-area";
import TierBandHeader from "./tier-band-header";
import type { TierBandData, TierChartSearchResult } from "./tier-board-types";
import TierChartSearch from "./tier-chart-search";
import TierSelectedEntry from "./tier-selected-entry";

interface TierBandCardProps {
    band: TierBandData;
    selectedEntryId: number | null;
    searchOpen: boolean;
    query: string;
    results: TierChartSearchResult[];
    isSearching: boolean;
    onSelectEntry: (id: number) => void;
    onOpenSearch: () => void;
    onQueryChange: (query: string) => void;
    onCloseSearch: () => void;
    onAddChart: (chartId: number) => void;
}

// 한 상수 구간의 헤더, 채보와 검색 영역을 조립함
export default function TierBandCard({
    band,
    selectedEntryId,
    searchOpen,
    query,
    results,
    isSearching,
    onSelectEntry,
    onOpenSearch,
    onQueryChange,
    onCloseSearch,
    onAddChart,
}: TierBandCardProps) {
    const selectedEntry = band.entries.find(
        (entry) => entry.id === selectedEntryId
    );

    return (
        <article className="overflow-hidden rounded-card border-l-3 border-real/70 bg-surface">
            <TierBandHeader band={band} />
            <TierBandDropArea
                band={band}
                selectedEntryId={selectedEntryId}
                searchOpen={searchOpen}
                onSelectEntry={onSelectEntry}
                onOpenSearch={onOpenSearch}
            />
            {selectedEntry ? <TierSelectedEntry entry={selectedEntry} /> : null}
            {searchOpen ? (
                <TierChartSearch
                    query={query}
                    results={results}
                    isSearching={isSearching}
                    onQueryChange={onQueryChange}
                    onClose={onCloseSearch}
                    onAdd={onAddChart}
                />
            ) : null}
        </article>
    );
}
