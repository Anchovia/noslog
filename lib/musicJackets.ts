import { musicBG } from "@/lib/constants";
import localJacketIndexes from "@/lib/generated/music-jacket-indexes.json";

const localJacketIndexSet = new Set<string>(localJacketIndexes);

function normalizeJacketUrl(url: string) {
    return url.replace(/^http:\/\//, "https://");
}

export function getLocalJacketUrl(index: string) {
    return localJacketIndexSet.has(index) ? `/bg/${index}.png` : null;
}

// 관리자가 직접 올린 자켓의 공개 Blob 경로 — 잘못된 로컬 파일·수집 자켓을 바로잡는 값이라 무엇보다 먼저 쓴다
export const MANUAL_JACKET_PREFIX = "jackets/manual/";

export function isManualJacketUrl(url: string | null | undefined) {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        return (
            parsed.protocol === "https:" &&
            parsed.hostname.endsWith(".public.blob.vercel-storage.com") &&
            parsed.pathname.startsWith(`/${MANUAL_JACKET_PREFIX}`)
        );
    } catch {
        return false;
    }
}

// 공식 jacket.html 은 KONAMI 로그인 쿠키가 있어야 이미지를 주고(없으면 404) 방문자 브라우저에서는 항상 실패해 후보에서 뺐다.
// 없는 자켓은 관리자 동기화 때 북마클릿이 받아 DB background 에 채운다(jacketCollectionService)
export function getJacketCandidates(index: string, background: string | null) {
    return [
        isManualJacketUrl(background) ? background : null,
        getLocalJacketUrl(index),
        background,
        musicBG[index],
    ]
        .filter((url): url is string => Boolean(url))
        .map(normalizeJacketUrl)
        .filter((url, position, urls) => urls.indexOf(url) === position);
}

export function getJacketUrl(index: string, background: string | null) {
    return getJacketCandidates(index, background)[0] ?? null;
}
