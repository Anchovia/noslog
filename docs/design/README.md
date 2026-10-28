# NosLog 디자인 가이드

화면 모양의 정본이다. 동작과 데이터 의미는 [기능 규칙](./product-rules.md), 작업 방식은 루트 [`AGENTS.md`](../../AGENTS.md), 결정의 이유는 [결정 기록](../decisions/README.md)에 있다.

## 어디에 무엇이

| 알고 싶은 것                                     | 정본                                                                  |
| ------------------------------------------------ | --------------------------------------------------------------------- |
| 토큰 값(색 · 간격 · 모서리 · 높이 · 선 · 움직임) | [`app/styles/tokens.css`](../../app/styles/tokens.css)                |
| 토큰을 어디에 쓰나 · 셸 · 레이아웃 · 로딩        | [기초값](./foundations.md)                                            |
| 공용 부품 모양 · 상태                            | [부품](#부품) — 부품마다 한 파일                                      |
| 공용 부품 Props · 스토리                         | [부품 사용](../ui/README.md) · [계약](../ui/contracts.md) · Storybook |
| 여러 화면이 같이 쓰는 묶음                       | [패턴](./patterns.md)                                                 |
| 화면마다 다른 것                                 | [화면](#화면) — 화면마다 한 파일                                      |
| 왜 그렇게 정했나                                 | [결정 기록](../decisions/README.md)                                   |
| AI 티를 피하는 확인 목록                         | [`docs/ai-check.md`](../ai-check.md)                                  |

같은 사실은 정본 한 곳에만 쓴다. 다른 문서는 링크한다. 값이 문서와 `tokens.css` 에서 다르면 `tokens.css` 가 맞다.

## 우선순위

1. 사용자의 최신 결정
2. 이 가이드(기초값 → 부품 → 패턴 → 화면 순으로 좁은 것이 넓은 것을 따른다. 화면 문서가 부품 규격을 덮어쓰지 않는다)
3. 기능 규칙
4. 코드 · 테스트

Figma · Z1 · 옛 브리프 · 핸드오프 · 감사 문서 · PDF · 레거시 NOSTORY 는 참고하지 않는다.

## 부품

[버튼](./components/button.md) · [입력 · 셀렉트 · 검색](./components/field.md) · [목록 · 메뉴](./components/menu.md) · [필터](./components/filter.md) · [마크다운 입력](./components/markdown-editor.md) · [밑줄 탭](./components/tabs.md) · [세그먼트](./components/segmented-control.md) · [쪽 번호](./components/pagination.md) · [수치 띠](./components/stat-strip.md) · [그래프](./components/charts.md) · [폼 컨트롤](./components/form-controls.md) · [태그](./components/tag.md) · [대화상자](./components/dialog.md) · [상태 메시지](./components/status-message.md) · [판정 이름](./components/judgement.md) · [펼침](./components/disclosure.md) · [도움말](./components/help.md) · [면 카드 · 아이콘 정보 줄](./components/surface-card.md) · [사진 뷰어](./components/photo-viewer.md) · [투표](./components/poll.md)

부품 문서 양식: 쓰는 곳 · 쓰지 않는 곳 · 모양(변형) · 크기 · 상태 · 동작 · 문구 · 하지 않는 것 · 바뀐 기록.

## 화면

[홈](./pages/home.md) · [악곡 목록 · 채보 보기](./pages/music-list.md) · [악곡 상세](./pages/music-detail.md) · [서열표](./pages/tiers.md) · [빙고](./pages/bingo.md) · [검정](./pages/exams.md) · [프로필](./pages/profile.md) · [업적](./pages/achievements.md) · [설정](./pages/settings.md) · [가입 온보딩 · 로그인](./pages/onboarding-login.md) · [개인정보](./pages/privacy.md) · [데이터 동기화](./pages/sync.md) · [오락실](./pages/arcades.md) · [랭킹](./pages/rankings.md) · [파트너 동의](./pages/partner-consent.md) · [피드백 · 오류 제보](./pages/feedback.md) · [소식 · 공지](./pages/news.md) · [이벤트](./pages/events.md) · [관리자 공지 작성](./pages/admin-announcements.md) · [채보 뷰어](./pages/chart-viewer.md) · [채보 에디터](./pages/chart-editor.md)

화면 문서 양식: 구성(위에서 아래) · 폭별 · 상태 · 동작 · 하지 않는 것 · 부품 고유 크기 · 바뀐 기록.

## 쓰는 법

- 규칙이 바뀌면 같은 작업에서 코드 → 해당 문서 한 곳 → [결정 파일](../decisions/README.md) → 테스트 기대값을 맞춘다.
- 본문에는 지금 규칙만 쓴다. 날짜 · 결정 코드 · 근거 수치 · 고른 이유는 결정 파일에 쓰고, 문서 끝 「바뀐 기록」 에 한 줄 링크만 더한다.
- 값은 토큰 이름으로 쓴다. 토큰이 없는 부품 고유 크기만 숫자로, 그 화면 문서의 「부품 고유 크기」 표에.
- 간격 표기 「A →8→ B」 는 구성 목록 · 표 안에서만 쓴다.
- 서술형 짧은 문장으로 쓴다. 굵은 글씨 · 「- **제목:** 설명」 꼴 목록 · 문장 안 화살표를 남용하지 않는다([AI 티 확인](../ai-check.md) 29–32).
- 예외를 덧붙이지 않는다. 코드가 문서와 다르면 코드를 공용 값에 맞추고, 사용자 결정으로 규칙이 바뀌면 정본을 고친다.
- 문서에 없는 시각 · 동작 결정은 만들지 않는다. 비교 시안을 그려 사용자가 고른다(`AGENTS.md`).

## 손대지 않는 곳

[`AGENTS.md` 「손대지 않는 곳」](../../AGENTS.md)을 따른다 — 관리자 화면 재설계 · 채보 에디터 재설계 · 음원 업로드.

## 확인

- 바꾼 화면은 실제 브라우저에서 CSS px 로 잰다. 폭 320 · 390 · 768 · 1280, 바뀐 경계의 양쪽, 한 · 일 · 영.
- 가로 넘침이 없다는 것만으로 통과시키지 않는다. 같은 줄 높이 · 여백 · 정렬을 함께 본다.
- 시안이 있는 화면은 시안과 같은 폭으로 나란히 대조하고, 바꾼 동작(메뉴 · 시트 · 창 · 핀 · 쪽 넘김 · 펼치기 · 복사 · 포커스 이동)을 하나씩 눌러 본다. 폰 · 데스크톱, 로그아웃 · 로그인 둘 다. 저장 · 제출 · 삭제는 누르지 않는다.
- 토큰 검사: `tests/design-foundation.test.ts`(CSS, `admin.css` 포함 — 간격 · 모서리 · 색 · 글자 크기 · 층 · 굵기 · 줄 높이 px · 선 두께 px · 헤더 높이) · `tests/design-tsx-tokens.test.ts`(공개 TSX · TS — 정적 토큰 참조 · nl 밖 CSS 변수 이름 · 인라인 값 · Tailwind 기본 스케일과 임의값 · 중단점 변형 · 색 팔레트 · Radix 자리 숫자 · 정본 색 상수 파일 밖 캔버스 색) · `tests/admin-tsx-tokens.test.ts`(관리자 · 에디터, 같은 검사). 예외는 각 테스트의 목록에 이유와 함께 둔다 · `tests/legacy-theme-tokens.test.ts`(옛 이름 없음) · `tests/ai-tells.test.ts`(AI 티 기계 검사). 떠 있는 창 자리는 `components/ui/overlay-position.ts`, JS 크기 계산은 `lib/design-tokens.ts` 의 `readTokenPixels`.
- 공용 UI 를 바꾸면 `npm run test:storybook`(부품 동작 · WCAG A · AA 자동 검사). 기능 화면 스토리는 실제 View 에 로컬 콜백을 연결하고, 폼 폭 계약(입력 글자 14px · 가로 넘침 · 창 전환 경계)은 같은 스토리 파일의 `Contract*` 가 검사한다.
- typecheck · lint · 테스트 · e2e 명령은 `AGENTS.md` 「스택 · 명령」. e2e 는 로컬 테스트 DB 에서만.
- 보고에는 실제로 돌린 것만 쓴다. 안 돌린 검사는 「안 함」. 실패는 원래 있던 것과 이번에 생긴 것을 나눠 적는다.
