export const judgementLabels = {
    sjust: "◆JUST",
    just: "JUST",
    good: "GOOD",
    near: "NEAR",
    miss: "MISS",
} as const;

export default function JudgementMarker({
    judgement,
}: {
    judgement: keyof typeof judgementLabels;
}) {
    return (
        <span
            className="nl-judgement-marker nl-control"
            data-judgement={judgement}
        >
            <i aria-hidden />
            {judgementLabels[judgement]}
        </span>
    );
}
