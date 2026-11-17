// 관리자 목록 쪽 나누기(판 2 페이지 줄) — 한 쪽 50줄, 주소의 ?page= 를 읽는다
export const ADMIN_PAGE_SIZE = 50;

export function parseAdminPage(value: string | string[] | undefined) {
    const raw = Array.isArray(value) ? value[0] : value;
    const page = Number.parseInt(raw ?? "", 10);
    return Number.isInteger(page) && page > 0 ? page : 1;
}

export function adminPageArgs(page: number) {
    return { skip: (page - 1) * ADMIN_PAGE_SIZE, take: ADMIN_PAGE_SIZE };
}

// 쪽 이동 링크 — 다른 조건(검색어 · 탭)은 그대로 두고 page 만 바꾼다. 1쪽은 page 를 뺀다
export function adminPageHref(
    pathname: string,
    params: Record<string, string | undefined>,
    page: number
) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (key !== "page" && value) query.set(key, value);
    }
    if (page > 1) query.set("page", String(page));
    const text = query.toString();
    return text ? `${pathname}?${text}` : pathname;
}
