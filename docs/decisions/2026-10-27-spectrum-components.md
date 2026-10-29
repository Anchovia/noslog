# 부품 · 자리마다 쓰는 토큰도 Adobe Spectrum 2 를 따른다

- 상태: 일부 대체됨(1 버튼 모서리 · 고스트 글자 · 5 메뉴 고른 항목 · 7 탭 · 8 헤더 면 · 홈 이동 칸 면 · 11 버튼 높이 · 1단 탭 치수 · 12 이동 목록 지금 위치 · 악곡 카드 · 공식 소식 카드 · 14 푸터) → [2026-10-27 운영보다 나빠진 자리](./2026-10-27-production-regression-fixes.md), (7 세그먼트 · 10 글자 단계 · 11 세그먼트 칸 모서리 · 고른 칸 선 · 12 전체 화면 창 면 · 구분선 · 고른 세그먼트 칸 고대비 선 · 칩 모양) → [2026-10-28 글자 계층 · 필터 창](./2026-10-28-typography-filter-dialog.md), (8 글자 역할이 붙은 링크 굵기 · 10 메타 자간 · 12 검정 레일 지금 위치 · 12 숫자 척도 면) → [2026-10-28 전수 검수](./2026-10-28-audit-fixes.md), (12 검색칸 안 범위 셀렉트의 올림 · 누름 면) → [2026-10-29 입력 글자 16](./2026-10-29-input-text-16.md), (1 · 11 버튼 누름의 들어감) → [2026-10-29 누를 때 들어가는 모양 없앰](./2026-10-29-no-press-depth.md)
- 날짜: 2026-10-27
- 분야: 디자인 · 기초값
- 고른 사람: 사용자(자리별 시안 추천대로, 입력칸 포커스 · 툴팁은 사용자 지시)

## 맥락

[무채색 Spectrum 2](./2026-10-27-spectrum-neutrals.md)로 회색 값은 옮겼지만 어느 부품 · 자리에 어느 토큰을 쓰는지는 Geist 때 규칙이 남아 있었다. 사용자는 여러 체계를 섞지 않고 Spectrum 2 가이드를 통째로 쓰기로 했다. 헤더부터 글자 단계까지 26자리를 지금 값과 Spectrum 2 값으로 나란히 찍은 시안에서 자리마다 골랐다. 「Spectrum 2 그대로」 는 색뿐 아니라 그 부품의 높이 · 안쪽 여백 · 모서리 · 선 두께 · 굵기 · 글자 크기 · 줄 높이 · 상태별 값까지 React Spectrum S2 구현을 따른다는 뜻이다. 유채색(파랑 accent · 파랑 포커스 · 파랑 체크)은 쓰지 않는다.

## 결정

1. 버튼: 모서리는 원(높이 ÷ 2)이고 글자는 bold(라틴 700 · 한국어 · 일본어 500)다. 주 버튼은 primary fill(#dbdbdb · 올림 #f2f2f2 · 글자 #111)이다. 보조 버튼은 secondary fill(#2c2c2c · 올림 #323232 · 올림 글자 #f2f2f2)이고, 고스트는 ActionButton quiet(면 없음 · 올림 #323232 · 모서리 8 · medium)다. 위험 버튼은 negative(#cd2e1d · 올림 #b12617)다. 비활성은 면 #2c2c2c · 글자 #444 이고, 누르면 원근 안에서 2px 들어간다(즉시).
2. 입력칸은 면 #111 에 2px 경계 #393939(올림 #444) · 모서리 8 이다. 포커스는 커서가 들어가면 경계가 #f2f2f2 로 바뀌는 것 하나만 쓴다. 파랑 링과 바깥 포커스 선을 겹쳐 그리지 않는다(사용자). 위험 글자 · 잘못된 칸 경계는 #fc432e 다.
3. 셀렉트는 picker(면 #2c2c2c · 경계 없음 · 올림 #323232)다. 체크박스 · 라디오는 2px 경계 #dbdbdb(올림 #f2f2f2) · 면 #111 이고, 라디오는 고르면 경계가 6 으로 굵어진다. 스위치는 26 × 16 이다(꺼짐: 면 #111 + 2px #dbdbdb · 손잡이 #dbdbdb, 켜짐: 면 #dbdbdb · 손잡이 #111). 이 셋의 비활성은 투명도 대신 #444 다.
4. 카드(`SurfaceCard`)는 primary 카드(면 #222 · 둘레 없음 · emphasized 그림자 · 모서리 10 · 제목 14 bold)다.
5. 메뉴 · 팝오버 판은 면 #222 · 다크 둘레 1px #323232 · elevated 그림자 · 모서리 10 · 안쪽 8 이다. 항목은 모서리 8 · medium 이고, 올리면 면 #323232 · 글자 #f2f2f2 다. 고른 항목은 면을 바꾸지 않고 굵기 600 이다. Spectrum 의 파랑 체크는 쓰지 않는다(유채색 규칙).
6. 대화상자는 면 #222 · 모서리 16 · 그림자 없음 · 머리 · 발 구분선 없음이다. 제목은 22 bold, 본문은 body M 이다. 가림막은 60% 그대로다.
7. 탭: 탭 줄 아래 선이 없고 글자는 regular 다. 고른 표시선은 2px 둥근 끝이고, 고른 탭을 올리면 글자가 #f2f2f2 다. 세그먼트: 판 #2c2c2c · 모서리 8 이고, 고른 칸은 #111 면에 2px #f2f2f2 선 · 모서리 10 이다.
8. 목록 · 표 줄 선은 #393939 이고 줄 올림은 #f2f2f2 7% 다. 헤더는 바탕과 같은 면이고 아래 선이 없으며, 지금 위치는 bold 다. 홈 이동 칸은 ActionButton(면 #2c2c2c · medium · 올림 면 #323232 · 글자 #f2f2f2)이다. 글자 링크는 secondary 링크(medium · 올리면 #f2f2f2 + 밑줄)다.
9. 모서리 단계는 small 4 · medium 8 · large 10 · extra-large 16 · 원이다. 그림자는 Spectrum 2 3겹 elevated(떠 있는 창) · emphasized(카드)다.
10. 글자: 제목 글자는 #f2f2f2 · 비활성 #444 이고, 누르는 부품 글자는 올리면 #f2f2f2 로 한 단계 밝아진다. 크기 · 줄 높이 · 굵기는 Spectrum 2 desktop 단계이고, 한국어 · 일본어는 CJK 값이다. 페이지 제목은 heading XL(라틴 36/42 · 800, CJK 32/48 · 700), 구역 제목은 heading L(라틴 28/32, CJK 25/38)이다. 본문 · 컨트롤은 14 · 줄 18(CJK 21), 읽기 본문은 16 · 줄 24(CJK 27), 3차 정보는 detail S(12 · medium · 자간 0.06em, CJK 자간 0)다. 제목 자간은 0 이다. 글꼴은 Pretendard 그대로다(Adobe Clean 은 Adobe 라이선스 글꼴).
11. 치수는 React Spectrum S2 1.8.2 의 desktop 값이다. 높이는 NosLog 컨트롤 높이 토큰 그대로 쓴다(데스크톱 32 · 폰 40 이 S2 desktop · 터치 높이와 같다).
    - 버튼: 좌우 안쪽 = 제 높이 ÷ 2(원 끝) · 아이콘 ↔ 글자 6. 누름은 `perspective(max(높이, 24px)) translate3d(0, 0, -2px)` 이다. S2 의 「폭 ÷ 3」 은 CSS 로 읽지 못해 뺐다.
    - ActionButton(고스트 · 홈 이동 칸 · 면 없는 누르는 것): 좌우 12 · 아이콘만이면 높이 정사각 · 모서리 8 · medium.
    - 텍스트 필드: 2px 선 안쪽 좌우 12. 검색칸은 SearchField 라 모서리 원 · 시작 쪽 16 이다.
    - 세그먼트: 판 안쪽 0 · 칸 사이 4 · 판 모서리 8 · 칸 높이 = 컨트롤 높이 · 칸 좌우 12 · 칸 모서리 8 · 글자는 고름 · 안 고름 모두 400(색만 다름) · 아이콘 칸 = 컨트롤 높이 정사각 · 고른 칸 2px 선은 칸 안쪽.
    - 1단 탭: 항목 좌우 안쪽 0 · 탭 사이 32 · 표시선 = 글자 폭 · 높이 48. 줄 폭을 똑같이 나누지 않는다.
    - 체크박스 · 라디오: 상자 16 · 선 2 · 모서리 4 · 체크 10 · 라벨 사이 10. 스위치: 26 × 16 · 손잡이 꺼짐 8 · 켜짐 10.
    - 메뉴: 판 안쪽 8 · 항목 높이 = 컨트롤 높이 · 항목 좌우 12 · 모서리 8.
    - 카드: 안쪽 16 · 모서리 10.
    - 6 · 10 처럼 눈금에 없는 값은 토큰 식(`calc(var(--nl-spacing-4) + var(--nl-spacing-2))`)으로 쓴다.
12. 화면 전체에 옮기는 기준:
    - 면 없는 누르는 것(헤더 로그인 · ≡ · 아이콘 버튼 · 쪽 번호 · 스테퍼 버튼 · 숫자 척도 · ×, 검색칸 안 버튼 · 좋아요 · 답글 토글 · 미디어 위 버튼)은 ActionButton quiet 다. 올림 · 누름 · 키 포커스에 면 #323232 · 글자 #f2f2f2 이고, 흰 6% 겹침은 쓰지 않는다.
    - 폭이 꽉 찬 목록 · 표 줄 · 펼침 줄은 TableView 줄이다. 올림 #f2f2f2 7%.
    - 이동 목록(헤더 ≡ 줄 · 검정 레일)은 메뉴 항목 규칙이고, 지금 위치는 면 없이 굵기 600 이다.
    - 떠 있는 것(시트 · 패널 · 팝오버 · 토스트 · 지도 위 버튼 · 핀 이름 판)은 면 #222 · 둘레 1px #323232 · elevated 그림자 · 모서리 10 이다. 전체 화면 창(`FullScreenDialog`)은 대화상자와 같은 면 #222 · 구분선 없음이다. 지도 위 검색칸은 검색칸 모양 그대로이고 그림자만 떠 있는 창 값이다.
    - 카드는 두 종류다. 한 덩어리로 누르는 카드(악곡 · 홈 이벤트 · 오락실 결과)는 primary 카드(면 #222), 누르지 않는 묶음 상자(과제곡 · 합격까지 · 공식 소식 · 미션 · 상세 판 · 동기화 안내 단계)는 secondary 카드(면 #1b1b1b)다. 둘 다 둘레 없음 · emphasized 그림자 · 모서리 10 이다.
    - 입력 계열(스테퍼 · 파일 줄 · 마크다운 입력 · 단위 입력 · 검색칸)은 2번과 같은 2px 경계다. 잘못된 칸은 올림 · 포커스에도 빨간 경계를 지킨다.
    - 단독 링크(뒤로 · 「초기화」 · 「게시물 보기」 · 「더보기」 · 제목 줄 링크)는 secondary 링크다(#dbdbdb · medium · 올림 · 키 포커스 #f2f2f2 + 밑줄).
    - 올림 색은 키 포커스 · 누름에도 같은 색으로 준다. hover 만 `(hover: hover)` 안에 둔다.
    - 비활성은 글자 · 아이콘 · 선을 #444 로 그린다. 그림 · 사진을 품은 줄(고르기 줄 · 업적 고르기 · 사진 썸네일)만 투명도를 남긴다.
    - 선을 inset 그림자로 그리던 스위치 트랙 · 고른 세그먼트 칸은 고대비 모드에서도 보이게 실제 선으로 그린다.
    - 칩 · 적용 조건 알약은 2026-10-26 사용자 결정 모양 그대로이고 바뀐 토큰 값만 따른다.
13. 줄 높이 값은 `--nl-type-line-height-*` 스케일에 이름을 붙이고(21 · 26 · 27 · 33 · 38 · 42 를 더함), 역할 토큰(`-ui` · `-body` · `-detail` · 제목)은 그 이름을 쓴다. Tailwind 별칭에 새 토큰(떠 있는 창 면 · 둘레, 강한 글자, 목록 줄 선, 입력 면 · 올림, 큰 모서리, 카드 그림자)을 더한다. 글자 조합은 별칭 없이 글자 클래스로만 쓴다.
14. 그대로 두는 것: 푸터 · 태그(배지) · 포커스 흰 2px 한 줄(입력 계열만 2번) · 툴팁 어두운 회색 면([툴팁 결정](./2026-10-27-tooltip-dark-surface.md)).

## 고르지 않은 안

- 주 버튼 · 링크 · 메뉴 체크 · 포커스의 Spectrum 파랑 — 유채색은 정해진 뜻에만 쓴다.
- 툴팁 Spectrum 밝은 면(#dbdbdb) — 보조 장치가 주 동작처럼 눈에 띈다(사용자, 이미 정한 결정).
- 태그를 Spectrum Tag 로 — Spectrum Tag 는 고르고 지우는 컨트롤이라 쓰임이 다르고, 쓰임이 같은 Badge 값은 확인하지 못했다.
- 헤더 면을 Photoshop 웹처럼 #323232 로, 또는 배경 층 문서대로 #222 로 — 실측 세 곳 중 두 곳이 바탕과 같은 면이다.
- 1단 탭 균등 분할 유지(2026-09-30) — S2 Tabs 는 글자 폭 + 사이 32 이고, 균등 분할은 S2 에 대응이 없다.

## 근거

- 정본: `@adobe/spectrum-tokens` 13.0.0(다크 · desktop), `@react-spectrum/s2` 1.8.2 부품 소스, Spectrum CSS S2 판(npm `next`), spectrum.adobe.com 문서(2026-10-27). 소스끼리 다른 값(accent 면 · 툴팁 모서리 · 가림막 · 필드 포커스 선)은 React Spectrum 값을 따랐다.
- 치수 출처: S2 부품 소스의 `Button` · `ActionButton` · `TextField` · `SearchField` · `SegmentedControl` · `Tabs` · `Checkbox` · `Radio` · `Switch` · `Menu` · `Card` · `TableView`(1.8.2).
- 실측(다크 · 로그인 전): React Spectrum S2 문서 · Adobe Firefly · Photoshop 웹 3곳(근거 약함). 세 곳 모두 헤더 아래 선이 없고, 버튼은 모서리 원 · 32 · 14 bold, 입력칸은 면 #111 · 2px #393939 · 포커스 경계 #f2f2f2, 회색 단계는 토큰과 같았다. Adobe Express · Acrobat 은 로그인 벽이라 세지 않았다.
- 적용 뒤 실측(localhost, 1280 · 390): 아이콘 세그먼트 판 · 칸 32 × 32 · 판 안쪽 0, 고른 칸 2px · 모서리 10 · 글자 400, 주 버튼 좌우 15(높이 32) · 19(높이 40), 아이콘 간격 6, 1단 탭 높이 48 · 사이 32 · 안쪽 0.
- 대비: 위험 버튼 흰 글자 5.2 : 1, 위험 글자 #fc432e 는 #222 위 4.5 : 1, 고른 세그먼트 칸(#111) 위 난이도 글자 6.1 : 1.

## 바뀌는 곳

- 문서: [기초값](../design/foundations.md) 색 · 글자 · 모서리 · 포커스 · 올림 · 누름 · 떠 있는 창, 부품 [버튼](../design/components/button.md) · [입력](../design/components/field.md) · [폼 컨트롤](../design/components/form-controls.md) · [세그먼트](../design/components/segmented-control.md) · [밑줄 탭](../design/components/tabs.md) · [메뉴](../design/components/menu.md) · [대화상자](../design/components/dialog.md) · [면 카드](../design/components/surface-card.md) · [마크다운 입력](../design/components/markdown-editor.md) · [쪽 번호](../design/components/pagination.md) · [수치 띠](../design/components/stat-strip.md) · [필터](../design/components/filter.md) · [펼침](../design/components/disclosure.md) · [사진 뷰어](../design/components/photo-viewer.md), 화면 문서(홈 · 악곡 목록 · 악곡 상세 · 서열표 · 빙고 · 검정 · 프로필 · 업적 · 설정 · 개인정보 · 동기화 · 오락실 · 랭킹 · 소식 · 이벤트 · 채보 뷰어)
- 코드(CSS): `app/styles/tokens.css` · `foundation.css` · `app/globals.css` · `tailwind-theme.css` · `layout.css` · `home.css` · `search.css` · `filters.css` · `exams.css` · `arcades.css` · `chartViewer.css` · `community.css` · `data-charts.css` · `achievements.css` · `bingos.css` · `discovery.css` · `entity.css` · `events.css` · `announcements.css` · `feedback.css` · `global-rankings.css` · `music-detail.css` · `player-identity.css` · `privacy.css` · `profile.css` · `ranking.css` · `settings.css` · `sync.css` · `tiers.css` · `admin.css`
- 코드(TS · TSX): `lib/design-token-values.ts` · `lib/chart-pattern/stageColors.ts` · `lib/bookmarklet.ts` · `lib/metadata/brand-image.tsx` · `components/ui/modal-dialog.tsx` · `components/layout/header-navigation.tsx` · `features/admin/components/admin-dashboard-chart.tsx` · `features/music/components/score-scatter.tsx` · `features/tiers/lib/tier-export-image.ts` · `features/tiers/components/tier-board.tsx` · `features/tiers/components/tier-board/sortable-tier-chart.tsx` · `features/tiers/components/tier-list-switcher.tsx` · `features/exams/components/exam-navigation.tsx` · `features/achievements/components/achievement-info-badge.tsx` · `features/partner/components/partner-consent-page.tsx` · `features/arcades/components/arcade-discovery-map.tsx` · `components/admin/chart-pattern/chartTimingEditor.tsx` · `snapCheckSection.tsx` · `vid2bmapImportPanel.tsx`
