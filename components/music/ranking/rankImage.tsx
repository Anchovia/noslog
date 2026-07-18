import { rankAssetNames } from "../musicDetailConfig";
import Image from "next/image";

interface RankImageProps {
    rank: string;
    size?: number;
}

// 랭크 코드에 맞는 공식 아이콘을 표시함
export default function RankImage({ rank, size = 18 }: RankImageProps) {
    const assetName = rankAssetNames[rank.toUpperCase()];

    if (!assetName) {
        return <span className="text-text-disabled w-5 text-center">-</span>;
    }

    return (
        <Image
            src={`https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_${assetName}.png`}
            alt={`${rank} 랭크`}
            width={size}
            height={size}
            className="shrink-0 object-contain"
        />
    );
}
