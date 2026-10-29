# 오락실 결과 카드의 올림 · 고름

- 상태: 유효
- 날짜: 2026-10-29
- 분야: 디자인 · 화면
- 고른 사람: 사용자(추천대로 — 판 10 안 A)

## 맥락

오락실 찾기 목록 카드에 포인터를 올리거나 키 포커스하면 그 카드가 고른 상태(안쪽 2 선 + 그림자)가 되고 지도 핀도 고른 핀이 됐다. 포인터가 떠나도 고름이 남았다.
어느 문서에도 없는 동작이었고, 카드 올림 모양도 arcades.md(`interaction/row`)와 surface-card.md(그림자)가 서로 달랐다.

## 결정

1. 카드에 올리거나 키 포커스한 동안만 지도의 그 핀을 강조한다. 흰 핀 · 이름 판 · 맨 위이고 크기는 그대로다. 떠나면 원래대로다.
2. 카드 고름(카드 선 · 고른 핀)은 누를 때만이다.
3. 카드 자체의 올림은 arcades.md 대로 면 위 `interaction/row` 다. surface-card.md 의 「누르는 카드 올림 = 그림자」 에서 오락실 결과 카드를 뺀다.
4. 강조할 오락실이 묶음 버블 안에 있으면 핀이 없어 강조하지 않는다.

## 고르지 않은 안

- B 지금처럼 올리면 고름(떠나도 남음) — 실제 서비스 0곳(핀 강조만 남는 곳 Resy 1).
- C 카드에 올려도 지도 핀은 그대로(네이버 지도 · 당근 부동산 · IKEA · OSM · 스타벅스 코리아 · 디스코).

## 근거

- 실제 서비스 17곳(30곳 미달, 대형 지도 · 숙박 50곳 넘게 봇 차단 · 접속 오류라 근거 약함): 떠나면 카드가 원래대로인 곳 17곳 모두. 핀 강조 8곳(카카오맵 · Airbnb · Bing 지도 · 직방 · Google 여행 · Recreation.gov · Zumper · Hipcamp), 핀 그대로 6곳.
- 카드 올림 면: 면 변화 6곳(Google 지도 · 네이버 지도 · 카카오맵 · 직방 · OSM · 디스코)이 가장 많다.
- 지도 라이브러리 2곳(Kakao Maps API 예제 · Mapbox Store locator): 고름은 클릭 때만.

## 바뀌는 곳

- 문서: `docs/design/pages/arcades.md` 「목록」, `docs/design/components/surface-card.md`
- 코드: `features/arcades/components/arcade-result-card.tsx`(올림 · 포커스 = 강조), `features/arcades/components/arcade-discovery-page.tsx`(강조 상태), `features/arcades/components/arcade-discovery-map.tsx`(핀 강조), `app/styles/arcades.css`(강조 핀)
