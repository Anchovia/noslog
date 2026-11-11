# 토스트 자리 — 디자인 시스템 10곳

2026-11-11. 설정 「계정 - 로그아웃 실패」 를 토스트로 정하면서 사용자가 「토스트를 상단에 주로 배치하나」 를 물어 짧게 본 것. 깊게 보지 않았다. 디자인 시스템 · 라이브러리 10곳의 공식 문서만 봤고, 실제 서비스는 세지 않았다(0곳, 미확인).

지금 NosLog 는 `components/ui/app-toaster.tsx` 에서 Sonner 를 `position="top-center"` 로 쓰고, 가이드도 「화면 위 가운데」 다([2026-10-25 체계 묶음](../decisions/2026-10-25-design-system-cluster.md)).

## 곳마다

| 곳                  | 자리                                                               | 문서에서 확인한 말                                                          |
| ------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Google Material 3   | 아래                                                               | 「Snackbars should be placed at the bottom of a UI」                        |
| Atlassian           | 아래 왼쪽                                                          | 「Flags appear at the bottom left of the screen」                           |
| IBM Carbon          | 위                                                                 | 토스트는 「usually appear at the top of the screen」                        |
| Microsoft Fluent 2  | 위 오른쪽 또는 아래 오른쪽                                         | 「This is usually the top-right or bottom-right」                           |
| Ant Design(message) | 위 가운데                                                          | 「displayed at top and center」                                             |
| Sonner              | 기본값 아래 오른쪽, 여섯 자리 고를 수 있음                         | 원본 `src/index.tsx` 의 `position = 'bottom-right'`                         |
| Chakra UI           | 네 모서리 중 하나를 골라 고정(예시는 위 끝)                        | 「We recommend picking one desired position」 · 예시 `placement: "top-end"` |
| Uber Base Web       | 위 · 아래 × 왼쪽 · 가운데 · 오른쪽 여섯 자리, 기본값은 문서에 없음 | 「top/right, top/center, … bottom/left」                                    |
| Mantine             | 자리 고를 수 있음, 예시는 아래 가운데                              | 예시 `position: 'bottom-center'`, 기본값은 문서에서 못 찾음                 |
| GitHub Primer       | 토스트 없음. 알림은 본문 위 배너 · 줄 안 글                        | 「place it at the top of the body content」                                 |

Adobe Spectrum · Shopify Polaris · Vercel Geist 문서는 스크립트로 그려지는 쪽이라 글을 뽑지 못해 세지 않았다(미확인).

## 요약

- 정해서 권하는 6곳: 아래 2(Material · Atlassian) · 위 2(Carbon · Ant) · 오른쪽 위나 아래 1(Fluent) · 기본값 아래 오른쪽 1(Sonner).
- 고를 수 있게만 둔 곳 3(Chakra · Base Web · Mantine), 토스트가 없는 곳 1(Primer).
- 「위에 주로 둔다」 는 맞지 않는다. 위와 아래가 비슷하고, 가운데보다 모서리가 많다. 위 가운데는 Ant 한 곳이다. 아래 가운데를 권하는 곳은 없고, Mantine 예시와 Sonner · Base Web 고르기 항목에만 있다. 근거 약함(10곳, 실제 서비스 0곳).
