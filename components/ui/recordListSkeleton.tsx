export default function RecordListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="nl-record-list-skeleton" aria-hidden="true">
            {Array.from({ length: count }, (_, index) => (
                <div key={index} className="nl-result-skeleton">
                    <span />
                    <div>
                        <span />
                        <span />
                    </div>
                    <span />
                </div>
            ))}
        </div>
    );
}
