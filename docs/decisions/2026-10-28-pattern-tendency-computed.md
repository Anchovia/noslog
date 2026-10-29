# 개요 패턴 경향을 채보 데이터 계산값으로

- 상태: 일부 대체됨(공개 채보가 없으면 빈 막대 · 「—」) → [2026-10-29 채보 없는 곡의 패턴 경향 가림](./2026-10-29-pattern-tendency-locked.md)
- 날짜: 2026-10-28
- 분야: 기능
- 고른 사람: 사용자(다섯 항목 유지 · 빈 막대 · 투표 유지 · 원점수 표는 사용자 지시, 0–100% 기준은 사용자 결정)

## 맥락

개요의 패턴 경향은 유저 0–4 투표 평균이라 항목이 무엇을 나타내는지 알기 어렵고, 평가한 사람에 따라 값이 흔들렸다.
공개 채보(운영 723개)의 노트 배치로 고정 수치를 만들고, 사용자가 만든 max-scouter 패턴 경향 계산 방식을 빌렸다.

## 결정

- 항목은 그대로 계단 · 연타 · 폴리리듬 · 즈레 · 변박 다섯 개다(아카이브 09-19 축 이름 결정).
- 값 = 손마다 처리량을 1초 감쇠로 쌓고, 가장 센 누적 8초의 RMS 와 최고점을 0.8 : 0.2 로 합친 원점수.
  0–100% = 같은 기준 채보 가운데 상위 1% 의 중앙값을 100% 로 둔 비율, 넘으면 100%(max-scouter 와 같다).
- 기준은 「{난이도} 기준」 과 「전곡 기준」 두 가지이고, 제목 줄 오른쪽 고스트 단추로 바꾼다. 처음은 난이도 기준.
- 공개 채보가 없으면 빈 막대 · 「—」. 영상 추출 그대로인 채보는 변박만 「—」.
- 평가 탭의 패턴 투표 · 업적 · 대시보드 집계는 그대로 둔다. 개요에는 투표 평균과 「평가하기 ›」 를 두지 않는다.
- 원점수는 새 표 `chart_pattern_metrics` 에 채보마다 한 줄. 공개 저장 · 기여 반영 때 그 채보만 다시 계산하고,
  SQL 로 한꺼번에 공개한 채보는 `npm run db:backfill:pattern-metrics` 로 채운다. 식을 바꾸면 버전을 올린다.

## 고르지 않은 안

- 항목을 max-scouter 7항목 · 평 낱말 빈도로 바꾸기 — 노스는 처리 방식과 평균 채보가 달라 이미 다섯 항목으로 정했다.
- 투표 걷어내기 — 다른 기능으로 바꿀 예정이라 지금 치우면 다시 만들어야 한다.
- 표 없이 요청 때 계산 — 100% 기준을 내려면 공개 채보 JSON 전부(약 120MB)를 읽어야 한다.
- 영상 추출 채보의 변박을 0% 로 두기 — 추출기는 박자선만 읽고 마디선을 따로 읽지 않아 박자표가 늘 4/4 · 3/4 하나다(운영 723개 모두). 0% 면 Leviathan 처럼 변박이 있는 곡을 「없음」 으로 보인다.

## 근거

- 계산식: max-scouter `common/patterns.mjs`(PATTERN_VERSION 4) 의 감쇠 누적 · 누적 8초 RMS · 상위 1% 중앙값 비교.
- 대조: BEMANIWiki 詐称・逆詐称・個人差譜面リスト(Op.2 · Op.3 · 무인/FORTE) · ノスしるべ 곡 페이지 409개 · 나무위키 평 2,536줄(432채보).
  평에서 그 패턴이 많다고 한 채보가 계산값에서도 높게 나오는 정도(AUC): 연타 0.72(평 76채보) · 계단 0.69(119) ·
  폴리리듬 0.60(15) · 즈레 0.56(21). 폴리리듬 · 즈레는 평이 적어 근거 약함.
- 막힌 곳: DC 노스텔지어 갤러리(robots 가 수집 막음) · gamerch(봇 확인) · X · arca.live · atwiki 는 넣지 않았다.

## 바뀌는 곳

- 문서: `docs/design/pages/music-detail.md` 개요 · `docs/design/product-rules.md` 패턴 평가 절
- 코드: `lib/chart-pattern/patternMetrics.ts` · `features/music/lib/pattern-tendency.ts` · `features/music/server/pattern-metrics.ts` ·
  `features/music/components/overview-panel.tsx` · `pattern-criteria-dialog.tsx` · 공개 저장 두 곳 · `prisma/schema/music.prisma` ·
  `prisma/migrations/20261028090000_chart_pattern_metrics` · `scripts/backfill-pattern-metrics.ts`
