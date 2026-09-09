export interface AdminChartEvaluation {
    chart: {
        difficulty: string;
        musicTitle: string;
    };
    comment: string | null;
    id: number;
    patterns: {
        chord: number;
        glissando: number;
        repetition: number;
        stairs: number;
        trill: number;
    };
    perceivedConstant: number;
    reactions: {
        down: number;
        up: number;
    };
    userName: string;
}
