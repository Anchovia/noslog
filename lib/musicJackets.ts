import { musicBG } from "@/lib/constants";
import localJacketIndexes from "@/lib/generated/music-jacket-indexes.json";

const localJacketIndexSet = new Set<string>(localJacketIndexes);

function normalizeJacketUrl(url: string) {
    return url.replace(/^http:\/\//, "https://");
}

export function getLocalJacketUrl(index: string) {
    return localJacketIndexSet.has(index) ? `/bg/${index}.png` : null;
}

export function getJacketCandidates(index: string, background: string | null) {
    return [
        getLocalJacketUrl(index),
        background,
        musicBG[index],
        `https://p.eagate.573.jp/game/nostalgia/op3/img/jacket.html?c=${index}`,
    ]
        .filter((url): url is string => Boolean(url))
        .map(normalizeJacketUrl)
        .filter((url, position, urls) => urls.indexOf(url) === position);
}

export function getJacketUrl(index: string, background: string | null) {
    return getJacketCandidates(index, background)[0];
}
