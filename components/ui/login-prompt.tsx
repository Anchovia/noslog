/**
 * 로그인 안내(2026-09-26 F1 — Instagram · Pinterest · Spotify 가입 유도 창) — 로그아웃 상태로 연 폼 창의 본문.
 * 제목(emphasis-label) →4→ 한 줄 설명. 아이콘 없음(2026-10-01 — 안내 · 상태 글은 글자만). 「취소 · 로그인」 버튼은 창의 발에 둔다
 * 원 면은 뺐다(2026-09-28 인상 점검 A5 — 정보 없는 장식 원)
 */
export default function LoginPrompt({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <div className="nl-login-prompt">
            <p className="nl-emphasis-label">{title}</p>
            {description ? (
                <p className="nl-body-secondary nl-muted">{description}</p>
            ) : null}
        </div>
    );
}
