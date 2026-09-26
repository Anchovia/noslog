import { Lock } from "lucide-react";

/**
 * 로그인 안내(2026-09-26 F1 — Instagram · Pinterest · Spotify 가입 유도 창) — 로그아웃 상태로 연 폼 창의 본문.
 * 자물쇠 원 40 · 제목(emphasis-label) · 한 줄 설명. 「취소 · 로그인」 버튼은 창의 발에 둔다
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
            <span className="nl-login-prompt__mark" aria-hidden>
                <Lock className="nl-icon" />
            </span>
            <p className="nl-emphasis-label">{title}</p>
            {description ? (
                <p className="nl-body-secondary nl-muted">{description}</p>
            ) : null}
        </div>
    );
}
