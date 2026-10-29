# 링크인 태그의 올림

- 상태: 유효
- 날짜: 2026-10-29
- 분야: 디자인 · 부품
- 고른 사람: 사용자(추천대로 — 판 2 안 A)

## 맥락

프로필 「기여 Lv.N」 은 누르면 아래 「기여」 구역으로 가는 링크인데, 태그 모양이고 올려도 아무것도 바뀌지 않았다(면 `surface/tag` · 흰 글자 그대로).
tag.md 는 태그를 누르지 않는 라벨로만 정했고, 기초값 「누를 수 있는 것은 모두 반응한다」 와 어긋났다.

## 결정

1. 링크인 태그(`a.nl-tag`)는 올림 · 누름 · 키 포커스에 강조형 `--strong` 과 같은 반전이 된다. 면 · 경계 `primary/default`, 글자 `primary/on-primary`.
2. 태그 안의 흐린 접두 글자(「기여」)도 그때 같은 글자색을 따른다. 평소 색 `content/default` 는 반전 면과 같아 글자가 사라지기 때문이다.

## 고르지 않은 안

- B 올리면 글자 밑줄(GitLab 이슈 라벨) — 알약 모양에서는 실제 서비스 1곳.
- C 면을 한 단계 밝게(Codeberg · Letterboxd · Twitch) — `surface/tag` 보다 밝은 면 토큰이 없어 새 값이 필요하다.

## 근거

- 실제 서비스 32곳(그중 알약 모양 10곳): 면 변화 14곳(알약 7곳 — GitHub 저장소 토픽 등), 밑줄 7곳(알약 1), 글자색 5곳(알약 1), 변화 없음 5곳(알약 0), 테두리 1곳(알약 1). 차단 5곳 제외.
- 디자인 시스템 6곳: 모두 면 변화(Primer IssueLabel · Geist Badge · Carbon · Polaris · Material 3 · Fluent 2).
- 측정: 고친 뒤 1280 · 1057 · 1055 · 390 에서 올림 면 #444 → #dbdbdb, 글자 · 접두 #111 확인.

## 바뀌는 곳

- 문서: `docs/design/components/tag.md` 「기본 태그」
- 코드: `app/styles/foundation.css`(`a.nl-tag` 올림 · 누름 · 키 포커스), `app/styles/player-identity.css`(접두 글자)
