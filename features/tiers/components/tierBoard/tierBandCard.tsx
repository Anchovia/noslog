import TierBandDropArea from "./tierBandDropArea";
import TierBandHeader from "./tierBandHeader";
import TierChartSearch from "./tierChartSearch";
import TierSelectedEntry from "./tierSelectedEntry";
import type { TierBandData, TierChartSearchResult } from "./tierBoardTypes";

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
        <article className="bg-surface border-real/70 rounded-card overflow-hidden border-l-3">
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
