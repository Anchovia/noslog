# 툴팁은 어두운 회색 면 — Spotify 웹 툴팁 값

- 상태: 유효
- 날짜: 2026-10-27
- 분야: 디자인 · 부품
- 고른 사람: 사용자(시안 추천대로)

## 맥락

용어 도움말 창(`TermHelp`)이 검정 바탕 위에 흰 면(#fff · 글자 #171717)으로 떴다. [2026-10-25 체계 묶음](./2026-10-25-design-system-cluster.md) 8번이 툴팁을 반전 색으로 정했고, [2026-10-26 Geist](./2026-10-26-geist-color-radius.md)가 그 면을 Geist 의 #fff 로 옮겼다. 사용자는 다크 서비스에서 흰 툴팁을 본 적이 없다고 했고, 실측해 보니 서비스 쪽에서는 드물었다.

## 결정

1. 툴팁 면 `surface/inverse` #282828 · 글자 `content/on-inverse` #fff(Spotify 웹).
2. 모서리 `radius/small` 4 · 안쪽 4 8 · 그림자 `--nl-tooltip-shadow`(`0 16px 24px rgb(0 0 0 / 30%), 0 6px 8px rgb(0 0 0 / 20%)`).
3. 제목 · 설명 구성과 최대 폭 280 은 그대로다. 고대비 모드에서 둘레를 그리는 투명 1px 선도 그대로 둔다.
4. 업적 배지 정보 카드는 툴팁이 아니라 떠 있는 창이라 `--nl-overlay-shadow` 를 따로 쓴다.

토큰 이름 `surface/inverse` · `content/on-inverse` 는 그대로 두었다. 다크에서는 더 이상 반전이 아니다.

## 고르지 않은 안

- GitHub(Primer) #3d444d — 면에 푸른 기가 있어 무채색 바탕에서 이 창만 색이 돈다.
- Linear 흰 10% 반투명 + 흰 10% 선 — 아래 글자가 비치고 유리 효과 금지와 부딪힐 수 있다. 잰 곳도 제품 앱이 아니라 체인지로그 플레이어였다.
- 지금 값(Vercel · Geist #fff) 그대로.

## 근거

- 실제 서비스 22곳(다크 모드 · 마우스를 올려 계산값 읽기): 어두운 면 18 · 반전 4. 순백 #fff 는 Vercel · Twitch 2곳, 밝은 회색은 Steam #c2c2c2 · Stripe #a9b2c2.
    - 어두운 면: GitHub #3d444d · YouTube #606060 · Spotify #282828 · GitLab #3a383f · crates.io #3a3c47 · Docker Hub rgba(97,97,97,.92) · Dotabuff #242f39 · Grafana #22252b · Linear 흰 10% · u.gg #0b0b23 · osu! #18171c · op.gg #000 · Chess.com 검정 77% · speedrun.com 검정 90% · Monkeytype #101010 95% · Lichess · Bluesky · AniList(호버 카드).
- 디자인 시스템 10곳: 어두운 면 5(Primer · MUI · Spectrum · Ant · Fluent 2) · 반전 5(Geist · shadcn/ui · Radix Themes · Atlassian · Carbon g100). 순백에 가까운 것은 Geist · shadcn/ui 둘이다.
- Spotify 를 고른 까닭: 같은 패턴(바탕보다 한 단계 밝은 무채색 · 선 없음)이 YouTube · GitLab · crates.io · Docker Hub · MUI · Spectrum · Ant 에도 있고, NosLog 무채색 체계에 푸른 기 없는 회색이 맞는다.
- 한계: Carbon g100 · Fluent 2 는 문서 화면이 다크로 열리지 않아 공개 패키지를 빈 페이지에 그려 쟀다. 툴팁이 잡히지 않은 15곳은 세지 않았다. 1440 폭만 쟀다.

## 바뀌는 곳

- 문서: [기초값](../design/foundations.md) 색 · 모서리 · 그림자 · 떠 있는 창, [도움말](../design/components/help.md)
- 코드: `app/styles/tokens.css` · `app/styles/foundation.css`(용어 도움말 창) · `app/styles/achievements.css`(업적 카드 그림자)
