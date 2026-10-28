# 바탕 위 면 카드에 둘레 링 — Geist 원래 값으로

- 상태: 대체됨 → [2026-10-27 무채색 Spectrum 2](./2026-10-27-spectrum-neutrals.md)
- 날짜: 2026-10-27
- 분야: 디자인 · 기초값
- 고른 사람: 사용자(시안 추천대로)

## 맥락

홈 이동 칸 · 악곡 카드 · 보조 버튼 · 세그먼트 판처럼 바탕 #000 위에 `surface/surface` #0a0a0a 면만 두고 선을 긋지 않은 곳은 면과 바탕의 대비가 1.06 : 1 이라 칸이 보이지 않았다. Geist 는 같은 면에 1px 링을 둘러 띄우는데, [2026-10-26 Geist](./2026-10-26-geist-color-radius.md)에서 면 값만 옮기고 이 자리들을 「면만」 으로 정해 링이 빠졌다.

## 결정

1. 바탕 위에 `surface/surface` 면만 두던 곳은 둘레 링 `0 0 0 1px border/default`(#2e2e2e)를 더한다. 면 · 모서리 · 올림은 그대로다.
2. 해당: 홈 이동 칸 · 공식 소식 카드 · 소식 상태 상자, 악곡 카드 · 자켓 위 카테고리, 보조 버튼 · 외곽선 셀렉트, 세그먼트 판, 펼침 카드, 수치 띠 칸 · 그레이드 칸 · 동작 묶음 칸, 개요 카드 · 최근 플레이 · 상세 카테고리 태그, 고정 공지 줄 · 이웃 글 링크 · 글 안 코드 · 투표 카드, 오락실 결과 · 지도 · 레일 상자 · 기체 펼침 · 사진 줄 빈 자리(폰), 빙고 상세 판 · 미션, 채보 뷰어 정보 · 자리표시자 · 무대 · 줄 틀, 평가 목록, 검정 단계 줄 · 합격까지 · 레일 · 인증 상자, 내 의견 답, 내 순위 줄, 개인정보 목차, 프로필 핵심 칸 · 소개, 서열 밴드 고르기 · 서열 카드 난이도.
3. 넣지 않는 곳: 이미 둘레 선 · 그림자가 있는 떠 있는 창, 화면 끝에 닿는 면(폰 사진 자리 · 하단 고정 바 · 대화상자 안 버튼 줄), 목록 안 내 행 강조(목록 줄은 카드로 만들지 않는다), 육각 업적 안쪽 면, 활동 달력 칸, 관리자 화면.

## 고르지 않은 안

- B. GitHub(Primer) 실선 #333333 — Primer 대비 1.92 를 맞추려면 새 값이 필요하다.
- C. YouTube · Spotify 면만 #1a1a1a — 면 위의 고른 칸 · 구분선 · 진행 막대 트랙까지 한 단계씩 올려야 하고, 고른 면과 보통 면이 같은 색이 된다.
- 지금 그대로 — #000 바탕에서 1.1 : 1 이하 면을 선 없이 쓰는 서비스가 실측 17곳 중 없었다.

## 근거

- 실제 서비스 17곳 · 누르는 면 30개(390 폭 · 다크 · 로그인 안 함): 면만 15 · 면과 선 13 · 선만 2. 면 대비 1.10 이하 13개 중 11개가 선을 둔다. 면만 쓰는 곳의 면 대비는 1.19–2.04(중앙값 1.31).
- Vercel 보조 버튼: 바탕 #000 · 면 #0a0a0a · 링 #2e2e2e(선 대비 1.55). 같은 「약한 면 + 선」 방식이 GitHub(면 1.09 · 선 1.92) · Linear · Supabase · Tailwind 에 있다.
- 디자인 시스템 8곳: Geist · Primer · shadcn/ui · Radix · Atlassian 은 면 + 선, Material 3 · Carbon 은 더 밝은 면, Apple HIG 는 값 미확인.
- 개발 서버 홈 · 악곡 목록 · 악곡 상세 · 랭킹에 A · C 를 입혀 지금과 나란히 비교한 시안에서 골랐다.

## 바뀌는 곳

- 문서: [기초값 — 색](../design/foundations.md#색) · [버튼](../design/components/button.md) · [세그먼트](../design/components/segmented-control.md) · [필드](../design/components/field.md) · [펼침](../design/components/disclosure.md) · [악곡 목록](../design/pages/music-list.md) · [홈](../design/pages/home.md)
- 코드: `app/styles/` 의 announcements · arcades · bingos · chartViewer · community · entity · exams · feedback · foundation · global-rankings · home · music-detail · privacy · profile · search · tiers
