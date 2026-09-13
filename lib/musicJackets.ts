import { musicBG } from "@/lib/constants";
import localJacketIndexes from "@/lib/generated/music-jacket-indexes.json";

const localJacketIndexSet = new Set<string>(localJacketIndexes);

function normalizeJacketUrl(url: string) {
    return url.replace(/^http:\/\//, "https://");
}

export function getLocalJacketUrl(index: string) {
    return localJacketIndexSet.has(index) ? `/bg/${index}.png` : null;
}

// 공식 jacket.html 은 KONAMI 로그인 쿠키가 있어야 이미지를 주고(없으면 404) 방문자 브라우저에서는 항상 실패해 후보에서 뺐다.
// 없는 자켓은 관리자 동기화 때 북마클릿이 받아 DB background 에 채운다(jacketCollectionService)
export function getJacketCandidates(index: string, background: string | null) {
    return [getLocalJacketUrl(index), background, musicBG[index]]
        .filter((url): url is string => Boolean(url))
        .map(normalizeJacketUrl)
        .filter((url, position, urls) => urls.indexOf(url) === position);
}

export function getJacketUrl(index: string, background: string | null) {
    return getJacketCandidates(index, background)[0] ?? null;
}
