# 끌어 옮기기 움직임 — 칸 · 줄 사이로 항목을 옮기는 방식 실측

공통 층 3단계 움직임 판 3-k(서열표에서 곡을 끌어 등급 칸 사이로 옮기기)의 근거다. 실제 서비스와 라이브러리 · 디자인 시스템이 항목을 집고, 끌고, 놓고, 취소할 때 어떻게 움직이는지 잰 값과 출처만 둔다.

- 확인 날짜: 2026-11-19
- 방법: headless Chromium(Playwright 1.61) · `colorScheme: dark` · 1440×900 · `ko-KR` · `permissions: []`. 쪽을 열고 5–9초 뒤 항목 가운데를 누르고 250ms 기다린 뒤 아래로 6·16px 움직여 집고(0.5초 대기), 40걸음 × 25ms 로 놓을 자리까지 끈 뒤 0.9초 머물고 놓았다. 취소는 같은 자리에서 놓는 대신 Esc, 키보드는 항목에 포커스한 뒤 Space · ArrowDown · Space.
- 값 출처: 「애니」 = `document.getAnimations()` 가 준 CSS 전환 · Web Animations 값(시간 · 곡선 · 키프레임), 「프레임」 = rAF 마다 읽은 `getBoundingClientRect` · `getComputedStyle`(옮겨 간 거리와 걸린 시간), 「캡처」 = 들린 · 끄는 중 · 놓은 뒤 캡처로 확인.
- 캡처 · 영상 · 원 기록: `~/noslog-research/motion-drag-2026-11-19/` 의 `shot/<곳>-{0-before,1-lifted,2-over,3-drop150,4-after}.png`, `video/<곳>/*.webm`, `json/<곳>[-cancel|-keyboard|-reduce].json`.
- HTML5 끌기(`draggable="true"`)는 끄는 동안 따라오는 그림을 브라우저가 그려 DOM 으로 잴 수 없다. 이런 곳은 「브라우저 끌기 그림」 으로 적고, 원래 자리 · 다른 항목 쪽만 잰다.
- 막힌 곳(캡차 · 403 · 로그인 벽)은 표에 「막힘」 으로만 두고 세지 않는다.

## 지금 NosLog

`features/tiers/components/tier-board.tsx` · `tier-board/sortable-tier-chart.tsx` · `tier-board/tier-drag-overlay.tsx` · `tier-board/tier-band-drop-area.tsx`, dnd-kit core 6.3.1.

| 자리         | 지금                                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| 집기         | 포인터 6px 움직이면, 터치는 180ms 누르고 6px 안이면(`PointerSensor` · `TouchSensor`)                                 |
| 들린 모습    | `DragOverlay` 안 재킷이 같은 48 크기 그대로, `shadow-nl-overlay` 만 더함. 크기 · 기울기 · 투명도 바뀜 없음           |
| 원래 자리    | `opacity-0`(빈 자리로 남음)                                                                                          |
| 비켜남       | dnd-kit 기본 `transform 200ms ease`(`@dnd-kit/sortable/dist/sortable.esm.js:376-379`), 칸 안은 `rectSortingStrategy` |
| 놓일 칸 표시 | 칸 배경 `bg-nl-surface`, `transition-colors duration-nl-state`(100ms)                                                |
| 놓을 때      | dnd-kit 기본 `250ms ease`(`@dnd-kit/core/dist/core.esm.js:3743-3753`), 원래 자리는 끝날 때까지 투명                  |
| 취소         | 같은 250ms ease 로 원래 자리로 돌아감(dnd-kit 기본, 아래 실측과 같음)                                                |
| 키보드       | `KeyboardSensor` + `sortableKeyboardCoordinates`. 알림 글은 dnd-kit 기본 영어(「Picked up draggable item …」)        |
| 동작 줄이기  | 처리 없음                                                                                                            |

## 라이브러리 · 디자인 시스템

### dnd-kit (공식 Storybook)

- URL: https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/iframe.html?id=presets-sortable-vertical--basic-setup (세로) · `presets-sortable-grid--basic-setup`(격자)
- json: `dndkit-sortable.json` · `-cancel` · `-keyboard` · `-reduce` · `dndkit-grid.json`
- 들린 모습: 겹침 판(`position: fixed`)이 따로 생김. Storybook 꾸밈은 `pop 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22)` 로 `scale(1)→scale(1.05)` · 그림자 커짐, 원래 자리 `opacity: .5`(애니 키프레임, [Item.module.css](https://raw.githubusercontent.com/clauderic/dnd-kit/master/stories/components/Item/Item.module.css)). 이 꾸밈은 예시이고 라이브러리 기본은 겹침 판에 아무 모양도 더하지 않는다.
- 비켜남: `transform 200ms ease`(애니). 프레임 경로 64px 이 183ms 동안 0 → 4.5 → 14.1 → 26.1 → 36.8 → 44.8 → 51.4 → 55.9 → 59.2 → 61.5 → 62.9 → 63.7.
- 격자에서 줄이 바뀌는 항목은 대각선으로 이동(150px 위 · 600px 오른쪽을 200ms 에 한 번에, 프레임).
- 놓음: 겹침 판이 `250ms ease` 로 제자리로(WAAPI, 프레임 257ms 에 멈춤). 원래 자리는 놓을 때까지 투명도 그대로였다가 끝나며 1.
- 취소(Esc): 비켜난 항목이 `200ms ease` 로 되돌아가고 겹침 판이 `250ms ease` 로 원래 자리로(애니).
- 키보드: Space 로 집으면 겹침 판 `transform 250ms ease`, 화살표 한 번에 옆 항목이 200ms 로 비켜남. 알림 글 「Sortable item 0 was dropped at position 2 of 50」(aria-live, 이 Storybook 의 글).
- 동작 줄이기: `reducedMotion: reduce` 에서도 200 · 250 그대로(애니). 라이브러리 안에 처리 없음(소스에 `prefers-reduced-motion` 없음).

### Atlassian Pragmatic drag and drop (Trello · Jira 가 쓰는 라이브러리)

- URL: https://atlassian.design/components/pragmatic-drag-and-drop/examples (List 예시) · 지침 https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines
- json: `pragmatic.json`
- 들린 모습: 브라우저 끌기 그림. 원래 자리는 흐려짐(캡처, 지침 「dim to 40% opacity (`opacity: 0.4`)」).
- 끄는 동안: 다른 항목은 움직이지 않는다. 놓일 자리에 2px 선과 왼쪽 끝 8px 원(캡처 `pragmatic-2-over.png`, 지침 「Stroke size 2px」 · 「Terminal diameter 8px」 · 색 `color.border.selected`).
- 놓음: 항목들이 한 프레임에 새 자리로(프레임 18ms), 옮긴 항목 배경이 `color.background.selected` 에서 사라지는 깜빡임 `700ms cubic-bezier(0.25, 0.1, 0.25, 1)`(애니 WAAPI, 지침 「Duration 700ms (largeDurationMs)」).
- 지침의 다른 값: 놓일 칸 배경 바뀜 `350ms cubic-bezier(0.15, 1.0, 0.3, 1.0)`, 카드 끌기 그림은 기울이지 않음(예외: Trello 4deg), 끌기 그림 오프셋 x 16 · y 8, 최대 280×280. 키보드는 「더 보기」 메뉴 안 이동 동작으로 대신. 동작 줄이기 언급 없음.

### react-beautiful-dnd (Storybook)

- URL: https://react-beautiful-dnd.netlify.app/iframe.html?id=board--simple · 소스 [animation.js](https://raw.githubusercontent.com/atlassian/react-beautiful-dnd/master/src/animation.js)
- json: `rbd-card.json`
- 들린 모습: 카드가 그 자리에서 `position: fixed` 로 떠서 포인터를 따라감. 크기 · 기울기 그대로, 그림자 `2px 2px 1px` 와 배경색 바뀜은 Storybook 꾸밈(프레임). 원래 자리에는 같은 크기 빈 자리(placeholder)가 남음.
- 비켜남: `transform 200ms cubic-bezier(0.2, 0, 0, 1)`(애니, 소스 `outOfTheWay`). 120px 이 183ms 동안 0 → 10.6 → 48.2 → 71.9 → 87.8 → 98 → 105 → 110.5 → 114.4 → 117.1 → 118.7 → 119.7(프레임).
- 다른 칸으로 넘어갈 때 그 칸의 빈 자리가 `height · width · margin 200ms cubic-bezier(0.2, 0, 0, 1)` 로 0 → 112 로 열림(애니).
- 놓일 칸 표시: 칸 배경 `background-color 200ms ease`(애니, Storybook 꾸밈).
- 놓음: `transform 340ms cubic-bezier(0.2, 1, 0.1, 1)`(애니). 소스 값은 거리에 따라 330–550ms(`minDropTime 0.33` · `maxDropTime 0.55`).
- 취소(Esc): 비켜난 항목이 `200ms cubic-bezier(0.2, 0, 0, 1)` 로 되돌아가고 카드가 `transform 250ms cubic-bezier(0.2, 1, 0.1, 1)` 로 원래 자리로(애니, 프레임 278ms 에 멈춤). json `rbd-card-cancel.json`.
- 키보드: Space 로 집고 ArrowDown 한 번에 카드와 옆 카드가 함께 `200ms cubic-bezier(0.2, 0, 0, 1)` 로 자리를 바꿈(애니). 알림 글 「You have dropped the item. You have moved the item from position 1 to position 2」. json `rbd-card-keyboard.json`.
- 동작 줄이기: 값 그대로(200 · 340, 애니). json `rbd-card-reduce.json`.
- @hello-pangea/dnd(포크)는 소스 [animation.ts](https://raw.githubusercontent.com/hello-pangea/dnd/main/src/animation.ts) 의 값이 같다.

### FormKit drag-and-drop

- URL: https://drag-and-drop.formkit.com/ · json: `formkit-dnd.json`
- 들린 모습: 브라우저 끌기 그림. 원래 자리 `opacity: .6` · `filter: blur(2px)`(첫 쪽 예시의 꾸밈, 프레임).
- 비켜남 · 놓음: 움직임 없이 한 프레임에 자리 바뀜(프레임 17ms). 움직임은 별도 플러그인(animations)으로만.

### Swapy (자리 맞바꾸기)

- URL: https://swapy.tahazsh.com/ · json: `swapy.json`
- 들린 모습: 크기 · 그림자 바뀜 없이 포인터를 따라감. 자리를 맞바꾸는 방식이라 서열표처럼 한 줄에 끼워 넣는 꼴과는 다르다.
- 비켜남: 맞바뀌는 항목 170px 을 267ms(프레임), 놓은 항목 316ms 에 제자리(프레임). 곡선은 JS 계산이라 애니에 잡히지 않음(미확인).

### SortableJS (공식 쪽 첫 예시 「Simple list」)

- URL: https://sortablejs.github.io/Sortable/ · README https://github.com/SortableJS/Sortable
- json: `sortablejs.json`
- 들린 모습: 브라우저 끌기 그림. 원래 자리에 남은 항목은 예시 꾸밈 클래스(`blue-background-class`, 하늘색 배경)로 표시(프레임).
- 비켜남: `transform 150ms ease`(애니). 예시 설정 `animation: 150`, 곡선은 README 「easing … Defaults to null」 이라 브라우저 기본 ease. 49px 이 150ms 동안 0 → 5.5 → 17 → 28.3 → 36.2 → 41.6 → 45.4 → 47.5 → 48.7 → 49(프레임).
- 놓음: 브라우저 끌기 그림이 사라지고 항목은 이미 그 자리(프레임 13ms).
- README 기본값: `animation` 은 예시 값 150 만 있고 「0 — without animation」, ghost(놓일 자리) 클래스 `sortable-ghost` · 집은 항목 `sortable-chosen` · 끄는 그림 `sortable-drag`.
- 격자(`#gridDemo`, json `sortablejs-grid.json`): 같은 `transform 150ms ease` 로 124px 옆으로(애니 · 프레임).
- 동작 줄이기: 값 그대로 150ms(json `sortablejs-reduce.json`).

### Shopify Draggable (공식 예시 「Simple list」)

- URL: https://shopify.github.io/draggable/examples/simple-list.html · json: `shopify-sortable.json`
- 들린 모습: 항목 사본(mirror)이 DOM 으로 생겨 포인터를 따라감, 커서가 손 그림으로 바뀜(프레임).
- 비켜남 · 놓음: 움직임 없이 한 프레임에 자리 바뀜(78px 을 16ms, 프레임).

### Angular CDK drag-drop (Angular Material 공식 예시 CSS)

- 공식 예시 쪽(material.angular.dev)은 v22 에서 angular.dev 안내로 넘어가 끌 항목이 잡히지 않았다(실측 안 됨). 값은 공식 저장소 예시 CSS [table-drag-drop-example.css](https://raw.githubusercontent.com/angular/components/main/src/components-examples/material/table/table-drag-drop/table-drag-drop-example.css) 에서 옮긴다.
- 들린 모습 `.cdk-drag-preview`: `border-radius: 4px`, 그림자 `0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)`(Material 2 높이 8 그림자), 크기 · 기울기 그대로.
- 원래 자리 `.cdk-drag-placeholder { opacity: 0 }`(빈 자리).
- 비켜남 · 놓음: 둘 다 `transform 250ms cubic-bezier(0, 0, 0.2, 1)`.

### Material Design 3 (상태 지침)

- URL: https://m3.material.io/foundations/interaction/states/state-layers · https://m3.material.io/foundations/interaction/states/applying-states (Playwright 로 연 본문)
- 끄는 상태 겹침 층 「Drag +16% opacity」 · 「0.16 Dragged state layer opacity」.
- 「Dragged states should be low emphasis」, 목록 항목 · 칩 · 카드는 높이(그림자)를 올려 끄는 상태를 보일 수 있다. 시간 · 곡선 값은 없다.

### @hello-pangea/dnd

- react-beautiful-dnd 포크. 소스 값이 react-beautiful-dnd 와 같아(위 절) 따로 재지 않았다. Storybook https://dnd.hellopangea.com/ 의 보드 예시는 주소를 맞추지 못해 끌기가 잡히지 않았다.

## 실제 서비스

로그인이 필요한 곳은 화면을 끌지 않고, 로그인 전에도 받아지는 공개 JS · CSS 번들에 적힌 값(「번들」)이나 공식 문서(「문서」)로 적었다. 번들 값은 코드에 적힌 값이고 화면에서 잰 값이 아니다. 번들 사본은 세션 임시 폴더에만 두었다.

### Linear (번들, dnd-kit)

- 근거: `static.linear.app/client/assets/startup-root.DTvg0x-u.js`(2026-11-19 받음)
- 정렬 목록 옮김 값 `{duration:150,easing:"ease"}`, 놓을 때 겹침 판 `dropAnimation: {duration:150}` 동안 그림자를 빼며 미끄러짐. 다른 목록은 `duration:100` · 원래 자리 `opacity: 0.1`. 보드 · 끌기 층은 `dropAnimation:null`(미끄러짐 없이 바로 놓임).
- 들린 모습: 겹침 판 그림자 `shadowMedium`, 크기 `scaleX:1, scaleY:1` 고정.
- 집기: 포인터 `distance:4`, 터치 `delay:200, tolerance:5`. 화면 읽기 안내 글은 비워 둠(`screenReaderInstructions:{draggable:""}`).
- 놓일 자리 표시 · 키보드 · 동작 줄이기: 미확인.

### Notion (번들, 직접 구현)

- 근거: `notion.so/_assets/UISpacePermissionGroupToken-a6a576c1bd734ee2.js`
- 놓일 자리: 위 · 아래에 4px 선 `rgba(35, 131, 226, 0.43)`, 블록 안으로 넣을 때는 면 `rgba(35,131,226,0.14)`. 다른 항목은 비켜나지 않음(선 표시 방식).
- 표의 행 · 열 끌기 사본 `opacity: 0.9`. 시간 · 곡선 · 키보드 · 동작 줄이기 미확인.

### Spotify 재생 목록 (번들, HTML5 끌기)

- 근거: `open.spotifycdn.com/cdn/build/web-player/web-player.34bf70f2.css` · `web-player.53c03159.js`
- 끄는 그림은 `setDragImage` 로 만든 글자 라벨(카드 모양 아님). 끄는 동안 놓을 수 없는 대상 `opacity: .25`, 보관함 항목 `.3` 에 `transition: opacity .15s ease-in-out`.
- 곡 줄의 놓일 자리 · 비켜남 · 놓음: 미확인(나중에 불러오는 조각에 있는 것으로 보임).

### Jira · Trello (문서, Pragmatic drag and drop)

- 근거: 위 「Atlassian Pragmatic drag and drop」 절의 지침 · 공식 예시 실측(`atl-list.json` 도 같은 값: 형제 한 프레임 −45px, 2px 선 `rgb(24,104,219)`, 놓은 뒤 700ms 깜빡임).
- Trello 만 카드 끌기 그림을 4deg 기울임(지침의 예외 문구). Trello 앱 안 값은 미확인. 같은 라이브러리로 만든 Trello 꼴 공개 데모 https://pragmatic-board.vercel.app/board (Trello 본체 아님, `pdnd-board.json`): 원래 카드 `opacity: .4`, 놓일 자리에 빈 상자, 형제는 한 프레임에 48px.

### GitHub (문서, Primer 공통 부품)

- 근거: https://primer.style/accessibility/patterns/drag-and-drop · https://primer.style/product/internal-components/drag-and-drop/
- 키보드: 손잡이 버튼으로 끌기 모드, ↑↓(가로는 ←→)로 옮기고 Enter · Space 로 놓고 Esc 로 취소. 위치 안내는 100ms 늦춰 `aria-live assertive`. 옮기기 대화상자도 둠.
- 동작 줄이기: 화면 밖 항목을 다시 보일 때 `scrollIntoView` 를 `behavior: instant` 로.
- 들림 · 시간 · 놓일 자리: 미확인.

### 문서로 방식만 확인한 곳(모양 · 값 미확인, 세지 않음)

- YouTube 재생목록(https://support.google.com/youtube/answer/57792): 위아래로 끌어 바꿈.
- Google Keep(https://support.google.com/keep/answer/12862970): Shift+J/K 로 메모 순서 옮김.
- Todoist(https://todoist.com/help/articles/use-keyboard-shortcuts-in-todoist-Wyovn2): 끌어 옮긴 뒤 실행 취소 알림.
- 토스: 「순서 바꾸기」 편집 모드에서 길게 눌러 끌고 저장(개인 블로그 근거, 근거 약함).
- Asana · 멜론: 근거를 찾지 못함.

### 로그인 없이 끌 수 있는 서비스(실측)

곳마다 json 은 `<이름>.json` · `-cancel` · `-keyboard` · `-reduce`. 「즉시」 는 한 프레임(16–17ms)에 자리가 바뀐 것.

#### KanbanThing (https://kanbanthing.com/ 첫 쪽 예시 보드, dnd-kit 으로 보임)

- json: `kanbanthing`. 근거: `aria-roledescription`, 고정 위치 겹침 판, `translate3d` 비켜남.
- 들린 모습: 겹침 판 사본 `matrix(1.02, …)`(크기 1.02) · 투명도 0.9 · 청록 테두리 그림자. 원래 자리와 들어갈 자리에 점선 빈 칸(캡처 `kanbanthing-2-over.png`).
- 비켜남: `transform 200ms ease`(45px 을 183ms, 프레임). 놓음: 겹침 판 `250ms ease`(WAAPI, 프레임 262ms 에 멈춤). 취소: 같은 값으로 원래 자리(278ms).
- 키보드: Space 로 들고 놓기 됨. 알림 「Card … was dropped in column "To Do"」.
- 동작 줄이기: 비켜남 · 점선 칸은 `0.01ms` 로 즉시가 되고, 놓음 250ms 는 그대로 남음(애니 `transform 0.01 linear`).

#### shadcn.io Kanban (https://www.shadcn.io/tools/kanban-board)

- json: `shadcn-kanban`. 라이브러리 미확인(항목에 draggable 없음, `data-handle`).
- 들린 모습: 원래 카드가 제자리에서 `opacity: .4`, 크기 · 그림자 그대로. 들어갈 자리에 2px 밝은 가로줄.
- 비켜남 · 놓음: 없음, 놓는 순간 즉시 재배치(getAnimations 0).
- 취소: Esc 로 취소. 키보드: 손잡이 단추에서 한 칸씩 즉시 이동, 알림 「Moved … to To do, 2 of 3.」.

#### Tweek (https://tweek.so/, @hello-pangea/dnd)

- json: `tweek`. 근거 `data-rfd-draggable-id`.
- 들린 모습: 글줄이 고정 위치로 떠서 따라감, 그림자 · 크기 · 기울기 없음. 들어갈 칸에 빈 줄이 `height · width 200ms cubic-bezier(0.2, 0, 0, 1)` 로 0 → 42px 열림(애니).
- 놓음: `transform 330ms cubic-bezier(0.2, 1, 0.1, 1)`(애니, 프레임 335ms). 취소: 같은 곡선으로 221ms(프레임).
- 키보드: 들고 놓기 됨(rbd 식 알림). 동작 줄이기: 바뀐 것 없음.

#### Photopea 레이어 패널 (https://www.photopea.com/, 새 문서 · 새 레이어 2개, 저장 안 함)

- json: `photopea`. HTML5 끌기(`div.head draggable=true`).
- 원래 줄 그대로, 들어갈 사이에 흰 가로줄. 놓으면 패널을 다시 그려 즉시 순서 바뀜. 키보드 없음.

#### Jasper Bernaers Kanban (https://jasperbernaers.com/kanban-board/)

- json: `jasper`. 자체 포인터 방식.
- 들린 모습: 고정 위치 사본 투명도 0.96, 그림자 `4px 4px 0` 검정. 원래 자리는 칸에서 빠짐. 들어갈 자리에 청록 점선 빈 칸, 대상 칸 테두리 청록.
- 비켜남 · 놓음: 즉시. 놓은 카드에 `kflash 900ms`(초록 3px 테두리 그림자가 옅어짐, 애니 ease-out).
- 취소: Esc 안 먹음. 키보드 없음. 동작 줄이기: 바뀐 것 없음.

#### Dynalist 데모 (https://dynalist.io/demo)

- json: `dynalist`. 자체 방식.
- 원래 줄 파란 면(`background-color 100ms ease`), 포인터 옆에 「Move 1 item」 작은 표. 들어갈 자리는 대상 줄 아래 테두리선 `border-bottom-color 100ms ease`(애니).
- 놓음: 즉시. 취소: Esc. 동작 줄이기: 바뀐 것 없음.

#### Logseq 데모 (https://demo.logseq.com/)

- json: `logseq`. HTML5 끌기.
- 원래 블록 청록 면, 들어갈 자리에 전체 폭 흰 가로줄. 비켜남 · 놓음 즉시, 놓은 뒤 블록 배경 강조가 `300ms cubic-bezier(0.16, 1, 0.3, 1)` 로 사라짐(애니). 취소: Esc.

#### Google 지도 길찾기 경유지 (https://www.google.com/maps/dir/서울역/강남역/홍대입구역)

- json: `gmaps-dir`. 자체 방식(goog-* 클래스).
- 줄 사본이 떠서 따라감(높이 40 → 48), 그림자 없음. 비켜남 · 놓음 즉시(48px). Esc 안 먹음. 키보드 없음.

#### diagrams.net 페이지 탭 (https://app.diagrams.net/?splash=0, 저장 안 함)

- json: `drawio-pages`. HTML5 끌기(`div.gePageTab`).
- 끄는 탭이 줄에서 사라지고 빈 자리. 비켜남 · 놓음 즉시(getAnimations 0), 놓은 뒤 순서 바뀐 것을 캡처로 확인. Esc 안 먹음.

#### AFFiNE (https://app.affine.pro/, 브라우저에만 저장되는 작업공간)

- json: `affine`. 원래 블록 `opacity: .7` 회색 면, 들어갈 자리에 파란 가로줄. 비켜남 · 놓음 즉시. 취소: Esc.

#### Workflowy 할 일 (https://workflowy.com/guide/to-do-list-maker)

- json: `workflowy`. 원래 줄 회색 면, 잡은 글머리가 포인터를 따라감, 들어갈 자리에 회색 가로줄. 비켜남 · 놓음 즉시. 취소: Esc.

#### Online Notepad 할 일 (https://onlinenotepad-c3z.pages.dev/todo/)

- json: `onlinenotepad-todo`. HTML5 끌기.
- 원래 줄 `opacity: .4`(200ms ease) · 점선 테두리, 대상 줄 테두리 청록(150ms ease). 비켜남 · 놓음 즉시(56px). 취소: Esc.
- 동작 줄이기: 전이가 모두 `0.01ms` 로 바뀜(애니).

#### abacktools Kanban (https://abacktools.com/tools/productivity/planning/kanban-board)

- json: `abacktools`. HTML5 끌기.
- 원래 카드 `scale: .95` · `opacity: .4`(프레임), 들어갈 대상 카드 흰 테두리(캡처 `abacktools-2-over.png`). 비켜남 · 놓음 즉시(155px 을 16ms).

#### tierlistmaker.io (https://tierlistmaker.io/templates/fruit-tier-list, dnd-kit)

- json: `tlmio`(줄 손잡이로 줄 옮기기) · `tlmio-item`(항목을 다른 줄로). 근거 `aria-roledescription=sortable`, DragOverlay.
- 줄 옮기기: 비켜남 `200ms ease`(105px 을 201ms, 프레임 0 → 6.5 → 23.4 → 43.1 → 60.7 → 74.2 → 84.3 → 91.8 → 97.2 → 100.9 → 103.3 → 104.6 → 105), 놓음 겹침 판 `250ms ease`. 겹침 판은 반투명 판(`rgba(16,22,34,.72)` · 그림자 `0 25px 50px -12px rgba(0,0,0,.25)` · 안 내용 흐림). 취소: 줄 200ms · 겹침 판 250ms 로 되돌아감. 키보드: Space · ArrowDown · Space 로 들고 놓기 됨(알림 「Draggable item s was dropped over droppable area 7」). 동작 줄이기: 바뀐 것 없음.
- 항목 옮기기: 겹침 판 80×80 그림자 없음, 놓을 줄에 자리 표시 없음. 놓으면 새 줄 항목이 `scale(.8) → 1` 250ms `cubic-bezier(0.18, 0.67, 0.6, 1.22)`(넘쳤다 돌아오는 곡선) · 페이드로 나타나고, 빈 자리는 남은 항목이 350ms 스프링(넘침 있음)으로 메움(프레임 −90 → −52.8 → −90). 키보드 없음.

#### tier-list-maker.com (https://tier-list-maker.com/minecraft-tier-list/)

- json: `tlmcom`. 포인터 끌기, 고정 위치 `.tlm-ghost`.
- 들린 모습: 사본 `matrix(1.07934, 0.0377, -0.0377, 1.07934)`(크기 약 1.08 · 기울기 약 2°), 그림자 `0 14px 32px rgba(0,0,0,.55)` + 보라 2px 고리. 원래 자리 `opacity: .3`(캡처 `tlmcom-2-over.png`).
- 놓을 줄: 배경 `rgba(139,124,246,.12)` + 안쪽 2px 보라 선이 `150ms ease` 로 나타남.
- 놓음: 사본이 바로 사라지고 남은 항목은 한 프레임에 자리 바뀜(87px 을 17ms). Esc 취소 안 됨. 키보드 없음.
- 동작 줄이기: 사본 `transform: none`(크기 · 기울기 없음), 전환 없음, 그림자는 그대로(json `tlmcom-reduce`).

#### Zap-Hosting 티어표 메이커 (https://zap-hosting.com/en/tools/gaming-tools/tier-list-maker)

- json: `zap`. HTML5 끌기(`button aria-pressed`).
- 들린 모습: 원래 자리 `opacity: .4`. 미분류 상자 테두리 · 배경이 `150ms cubic-bezier(0.4, 0, 0.2, 1)` 로 바뀌고 올린 줄 배경 강조.
- 놓음: 즉시(남은 항목 86px 을 16ms). Esc 취소: 즉시 원래대로.
- 키보드: Space 로 고르면 「Move to: S A B C D F / Back to pool」 단추 줄이 나옴(화살표 이동은 없음). 동작 줄이기: 바뀐 것 없음.

#### tierlistmaker.org (https://tierlistmaker.org/text-maker/genshin-impact-characters-tier-list-2026)

- json: `tlm-text`. HTML5 끌기.
- 원래 자리 그대로. 미분류 칸이 점선 · 배경으로 바뀌고(`200ms cubic-bezier(0.4, 0, 0.2, 1)`), 올린 줄 배경이 진해지며 「DROP HERE」 글자가 200ms 로 나타남.
- 놓음: 즉시(남은 항목 88px 을 17ms). 키보드 없음. 동작 줄이기: 같음.

#### Common Ninja 티어표 메이커 (https://www.commoninja.com/free-tools/engagement/tier-list-maker, 밝은 화면)

- json: `commoninja`. HTML5 끌기. 원래 자리 변화 없음, 올린 줄에 점선 테두리와 옅은 면이 `150ms ease` 로. 놓음 즉시. 키보드 없음. 동작 줄이기: 같음.

#### Rankly (https://tierlistmaker.pro/trending-tier-lists/hsr-tier-list-maker/, 밝은 화면)

- json: `rankly`. HTML5 끌기. 원래 그림 `opacity: .35`, 끄는 동안 항목이 줄 안으로 미리 옮겨지고 남은 항목은 한 프레임에 메워짐. 놓으면 투명도 1 로 즉시. 키보드 없음.

#### MetaTFT 팀 빌더 · 챔피언 서열표 (https://www.metatft.com/team-builder · https://www.metatft.com/tier-lists, 한 곳으로 셈)

- json: `metatft-b` · `metatft-tl`. 포인터 끌기, 고정 `.DragPreview`.
- 들린 모습: 원래 자리 `opacity: .3`, 미리보기 `opacity: .8` · `filter: drop-shadow(0 4px 8px rgba(0,0,0,.3))`, 기울기 없음. 서열표는 올린 줄 끝에 흐린 자리 표시가 미리 들어감.
- 놓음: 즉시. Esc 취소 안 됨. 키보드 끌기 없음, 대신 「누른 뒤 S/1 키」 로 등급 넣기.

#### tactics.tools 팀 빌더 (https://tactics.tools/team-builder)

- json: `tactics-b`. 포인터 끌기. 원래 자리 그대로, 미리보기 52×52(원래 48)가 포인터 오른쪽 아래에 붙음(그림자 · 기울기 없음). 올린 칸 테두리 청록. 놓음 · 취소 즉시. 키보드 없음.

#### lolchess.gg 빌더 (https://lolchess.gg/builder)

- json: `lolchess-b`. HTML5 끌기. 원래 자리 그대로, 끄는 순간 칸마다 배치% 덧판이 뜨고 올린 칸이 청록으로 채워짐. 놓음 · 취소 즉시. 키보드 없음.

#### TFT Academy 서열표 메이커 (https://tftacademy.com/tools/tierlist_maker)

- json: `tfta-tier`. HTML5 끌기. 원래 자리 그대로(올리면 크기 1.05 만), 줄 강조 없음, 놓으면 즉시(원본은 도구함에 남는 복사). 키보드 없음.

#### YGOPRODeck 덱 빌더 (https://ygoprodeck.com/deckbuilder)

- json: `ygopro`. SortableJS(HTML5 모드, 목록은 복사). 덱 칸 안에 `sortable-ghost` 자리 표시가 미리 들어감. 놓음 즉시. Esc 취소 안 됨. 키보드 없음.

#### 끌기가 없거나 막힌 곳(세지 않음)

- 공개 Trello 보드(손님은 끌리지 않음, `trello-pub.json`) · GitHub 공개 프로젝트(카드에 `dragDisabled`).
- 막힘: tiermaker.com(Cloudflare 확인) · tierlists.com(403) · seemeta.com(403) · ende.app(Cloudflare) · uiineed.com(525) · mobalytics.gg(Cloudflare) · schale.gg(점검 중) · op.gg 팀 빌더(403).
- 끌기 없음: genshin.gg 서열표 메이커(목록 쪽으로 넘어감) · tftactics.gg 팀 빌더(툴팁만). 미확인: tierlistcreator.com(headless 멈춤) · Pokemon Showdown · archidekt(항목을 만들어야 해서 안 함).
- 리듬게임 서열표 메이커는 검색에서 tiermaker.com 템플릿(막힘)만 나와 재지 못했다.
- 서버에 보드를 만들어야 해서 뺀 곳: kanban.cx · juzzdo · Tally · Jotform.

## 묶음

실제 서비스 30곳(화면 실측 24 · 번들 코드 3 · 문서 3), 라이브러리 · 디자인 시스템 9곳. 같은 방식끼리 묶고 서비스 수를 적는다. 3곳 안팎은 근거 약함.

| 방식                                                                                                  | 서비스 수             | 서비스                                                                                                                                                                                                                                                                                                                 | 라이브러리 · DS                         |
| ----------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| 다른 항목이 비켜나지 않고, 놓는 순간 한 프레임에 자리 바뀜(놓일 자리는 선 · 칸 강조 · 빈 상자로 표시) | 24                    | shadcn.io · Photopea · Jasper Bernaers · Dynalist · Logseq · Google 지도 · diagrams.net · AFFiNE · Workflowy · Online Notepad · abacktools · lolchess.gg · tierlistmaker.org · tactics.tools · MetaTFT · Common Ninja · Zap-Hosting · TFT Academy · YGOPRODeck · Rankly · tier-list-maker.com · Notion · Jira · Trello | Pragmatic · FormKit · Shopify Draggable |
| 비켜남 200ms ease · 놓음 250ms ease(dnd-kit 기본)                                                     | 2(근거 약함)          | KanbanThing · tierlistmaker.io (지금 NosLog 와 같은 값)                                                                                                                                                                                                                                                                | dnd-kit                                 |
| 비켜남 200ms (0.2, 0, 0, 1) · 놓음 330–550ms (0.2, 1, 0.1, 1)                                         | 1(근거 약함)          | Tweek                                                                                                                                                                                                                                                                                                                  | react-beautiful-dnd · @hello-pangea/dnd |
| 비켜남 · 놓음 150ms ease                                                                              | 1(근거 약함, 코드 값) | Linear                                                                                                                                                                                                                                                                                                                 | SortableJS 예시(비켜남만)               |
| 비켜남 · 놓음 250ms (0, 0, 0.2, 1)                                                                    | 0                     | -                                                                                                                                                                                                                                                                                                                      | Angular CDK 예시                        |

- 놓은 뒤 깜빡임: Jira(700ms) · Jasper Bernaers(900ms) · Logseq(배경 300ms) 3곳, 근거 약함.
- 원래 자리 흐림: `opacity .3–.4` 가 shadcn.io · Online Notepad · abacktools · MetaTFT · Zap-Hosting · Rankly · tier-list-maker.com · Jira(지침) 8곳. 지금 NosLog 는 0(빈 자리).
- 들린 사본 꾸밈: 크기 키움(tier-list-maker.com 1.08 · KanbanThing 1.02 · tactics.tools 52/48) · 기울기(tier-list-maker.com 약 2° · Trello 4deg 문서) · 그림자(tier-list-maker.com · MetaTFT · Jasper Bernaers · Linear). 그대로 크기 · 기울기 없이 그림자만 더한 곳은 지금 NosLog · Linear.
- 키보드로 끌기: KanbanThing · tierlistmaker.io · Tweek · shadcn.io(손잡이) · GitHub(문서) 5곳과 dnd-kit · react-beautiful-dnd. 끌기 대신 다른 수단: Zap-Hosting(옮길 등급 단추) · MetaTFT(S/1 키) · Jira(메뉴) · Trello · Google Keep(단축키).
- 동작 줄이기에서 바뀐 곳: KanbanThing(비켜남만 0, 놓음 250ms 남음) · Online Notepad(전환 모두 0) · tier-list-maker.com(사본 크기 · 기울기 없앰) 3곳. 나머지와 라이브러리 기본값(dnd-kit · react-beautiful-dnd · SortableJS)은 그대로.
