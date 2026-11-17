# 디자인 작업 순서와 방법 — 순서 · 타이포 계층 · 부품 · 레이아웃 · Figma

2026-11-11. 데스크톱 공통 층을 새 한 벌로 통일하기 전에 사용자가 「디자인 작업은 계층과 틀을 먼저 정하고 시작하지 않나, 가이드와 방법을 찾아 정리해 보라」 고 해서 조사했다. 값 자체(글자 크기 · 컨트롤 높이)의 통계는 [타이포 디자인 시스템 19곳](./research-typography-guides.md) · [체계 묶음](./2026-10-25-design-system-cluster.md)에, 토큰 파일 구성은 [파운데이션 구성](./2026-11-11-foundation-structure.md)에, Figma 파일 · 페이지 나누기는 [Figma 파일 정리 방식](./2026-11-11-figma-file-organization.md)에 있어 다시 하지 않았다. 이 기록은 방법과 순서만 다룬다.

## 방법과 한계

- 네 갈래로 나눠 웹 문서를 열어 읽었다. 확인한 수는 작업 순서 21곳(독립 저자 18), 타이포 계층 34쪽(출처 23곳), 부품 · 레이아웃 19곳(항목 31), Figma 사용법 41곳이다. 열지 못한 곳은 갈래마다 「미확인」 절에 적고 세지 않았다.
- 실제 서비스 화면 실측이 아니라 가이드 · 공식 문서 · 실무자 글 조사다. 디자인 시스템 문서와 실무 글을 한데 셌다.
- 본문은 요약 도구를 거쳐 읽었다. 인용 구절은 아래 12곳만 원문과 다시 대조했고 나머지는 대조하지 않았다.
- 한국 · 일본 자료는 갈래마다 1–5곳이라 근거가 약하다. Nathan Curtis 글 일부 · Material 3 본문 · Refactoring UI 본책은 열지 못했다.

## 원문 대조 12곳

2026-11-11 에 쪽을 다시 열어 주장과 원문을 맞춰 봤다. 9곳은 맞았고 3곳은 요약이 원문과 달라 아래 본문을 고쳤다.

| 곳                                   | 주장                                                     | 결과                                                                                                |
| ------------------------------------ | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Figma 블로그 Design systems 102      | 지금 있는 UI 조사가 부품 만들기보다 앞                   | 맞음. 큰 단계는 Lay the groundwork · Define your foundations · Build your design system in Figma    |
| Brad Frost Interface Inventory       | 화면을 캡처해 종류별로 모아 불일치를 드러냄              | 맞음                                                                                                |
| GitHub Primer Typography             | 줄 높이가 4px 격자에 맞음 · 임의 굵기 숫자 금지          | 맞음. 4px 문장은 Primer 토큰 설명이다                                                               |
| デジタル庁 タイポグラフィ            | 본문 줄 높이 1.5배 이상 · Dense 와 Standard 구분         | 맞음. Dense 는 120–130%                                                                             |
| GOV.UK Type scale                    | 새 스타일도 눈금의 점에 맞춤 · 줄 높이 5px 배수          | 맞음                                                                                                |
| Radix Themes Container               | 최대 폭 448 · 688 · 880 · 1136                           | 맞음                                                                                                |
| IBM Carbon UI shell left panel       | 패널 폭 256                                              | 맞음                                                                                                |
| Figma Help 변수와 스타일의 차이      | 변수는 값 하나 · 스타일은 묶음                           | 맞음. 그림자 예는 이 쪽이 아니라 토큰 입문 쪽에 있다                                                |
| Figma Help 토큰 · 변수 · 스타일 입문 | primitive · semantic 두 층 권장 · primitive 는 범위를 끔 | 다름. 세 종류(primitive · semantic · component-specific)를 소개하고 필요한 것만 쓰라고 한다         |
| Figma Help Check designs             | 날값을 찾아 줌 · Organization 이상                       | 요금제가 다름. Education(K-12) · Organization · Government · Enterprise                             |
| Figma Help Selection colors          | 색 하나를 바꾸면 그 색을 쓰는 레이어가 한 번에 바뀜      | 「한 번에 바뀐다」 는 문장은 본문에서 못 찾음. 고른 색에 스타일 · 변수를 입힐 수 있다는 문장은 있다 |
| IBM Carbon Type sets                 | productive 14px 기준 · expressive 16px 기준              | 맞음                                                                                                |

## 디자인 시스템 작업 순서 조사

확인한 날짜: 2026-11-11. 페이지를 직접 열어 문장을 확인한 곳만 센다.

### 확인한 곳

#### 1. Brad Frost — Interface Inventory (블로그 글)

- URL: https://bradfrost.com/blog/post/interface-inventory/
- 확인: 2026-11-11
- 요약: 지금 화면을 캡처해 부품 종류별 칸에 모으고(모든 사례가 아니라 서로 다른 모양만), 같은 부품의 변형을 나란히 놓아 본 뒤 이해관계자에게 보여 준다. 이 목록이 스타일 가이드 · 패턴 라이브러리의 출발점이 되고, 뜻하지 않은 불일치와 작업 범위를 드러낸다.
- 원문: "An interface inventory is the first step toward establishing a common interface language."

#### 2. Brad Frost — 『Atomic Design』 4장 The Atomic Workflow

- URL: https://atomicdesign.bradfrost.com/chapter-4/
- 확인: 2026-11-11
- 요약: 순서는 인터페이스 인벤토리 → 방향 잡기(로파이 스케치, 스타일 타일, 요소 콜라주) → 패턴 완성(방향 합의 뒤 정적 시안, 이어서 브라우저) → 다듬기 · 출시. 단계는 겹치고 되풀이되며, 부분과 전체를 오가며 충실도를 올린다고 한다. 부품을 따로 떼어 혼자 만들지 말라는 뜻이다.
- 원문: "sculpted in iterative loops, building up fidelity as the project progresses."

#### 3. NN/g — Design Systems 101

- URL: https://www.nngroup.com/articles/design-systems-101/
- 확인: 2026-11-11
- 요약: 작업 순서나 감사는 다루지 않는다. 대신 접근을 셋으로 나눈다 — 기존 시스템 채택, 기존 시스템 고쳐 쓰기, 직접 만들기. 기존 시스템을 쓰는 것이 가장 싸고, 조직에 무엇이 필요한지 알고 나서 시작하라고 한다.
- 원문: "using an existing design system is the lowest-cost approach"

#### 4. Figma 블로그 — Design systems 102: How to build your design system

- URL: https://www.figma.com/blog/design-systems-102-how-to-build-your-design-system/
- 확인: 2026-11-11
- 요약: 세 단계다. 목표 정하기 · 지금 UI 와 코드 감사 · 원칙 → 파운데이션(접근성 · 색 · 글자 · 높이 · 아이콘 · 토큰 · 간격) → 라이브러리 만들기(감사 다시 보기 → 변수 · 스타일 → 부품). 부품은 토큰에 기대므로 파운데이션 뒤에 온다.
- 원문: "Gather examples of your UI across different platforms and devices"

#### 5. Refactoring UI — Building Your Color Palette (Adam Wathan · Steve Schoger)

- URL: https://www.refactoringui.com/previews/building-your-color-palette
- 확인: 2026-11-11
- 요약: 색 단계는 그때그때 만들지 말고 정해진 묶음을 먼저 만들어 그 안에서 고르라고 한다. 다만 숫자 공식보다 눈을 믿고, 쓰다 보면 단계의 채도를 손보게 되는 것은 당연하다고 본다. 새 단계를 자주 더하면 체계가 무너진다고 경고한다.
- 원문: "Trust your eyes, not the numbers."

#### 6. GOV.UK Design System — Contribution criteria

- URL: https://design-system.service.gov.uk/community/contribution-criteria/
- 확인: 2026-11-11
- 요약: 부품 · 패턴은 제안 때 「쓸모 있음 · 겹치지 않음」, 공개 전 「사용성 검증 · 일관됨 · 여러 서비스에 맞음」 을 채워야 한다. 근거는 실제 서비스에서 쓰는 화면 캡처나 링크다. 부품을 진공에서 만들지 않고 실제 쓰임으로 증명한다는 쪽이다.
- 원문: "It reuses existing styles and components in the Design System where relevant."

#### 7. GitHub Primer — Color usage

- URL: https://primer.style/product/getting-started/foundations/color-usage/
- 확인: 2026-11-11
- 요약: 토큰은 base → functional → component/pattern 세 층이다. base 는 다른 토큰이 참조만 하고, 화면에서는 functional 을 먼저 쓰며, component 토큰은 functional 로 안 될 때만 적게 둔다.
- 원문: "These tokens are limited and functional tokens are preferred."

#### 8. IBM Carbon — 2x Grid overview

- URL: https://carbondesignsystem.com/guidelines/2x-grid/overview/
- 확인: 2026-11-11
- 요약: 그리드가 글자 · 레이아웃 · 아이콘의 기하학적 바탕이고 부품도 같은 크기 논리(고정 · 유동 상자)를 따른다고 한다. 작업 순서는 직접 적지 않았다(바탕 → 부품 관계만 확인).
- 원문: "provides the geometric foundation for typography, layouts, icons, and illustrations"
- 같은 곳 추가 확인(https://carbondesignsystem.com/elements/color/overview/): 토큰은 역할로 이름 짓고 테마가 값을 정한다. 역할은 테마가 바뀌어도 그대로다. "Tokens are role-based, and themes specify the color values."

#### 9. UXPin — Design System Checklist

- URL: https://www.uxpin.com/studio/blog/launching-design-system-checklist/
- 확인: 2026-11-11
- 요약: 14단계로 순서를 명시한다. 감사가 먼저(UI 패턴 → 색 → 글자 스타일 → 아이콘 → 그리드 · 간격), 다음 합의 · 팀 · 원칙, 그다음 값 줄이기(색 팔레트 → 글자 단계 → 아이콘 → 그리드 · 간격), 마지막에 첫 재사용 패턴을 만들어 시험하고 돌아본다. 회색이 너무 많은 것 같은 이상값을 적어 팔레트를 줄이라고 하고, 한 번에 다 고칠 필요는 없다고 한다.
- 원문: "Take note of anomalies, like too many shades of gray, and streamline the palette."

#### 10. U.S. Web Design System — Maturity model

- URL: https://designsystem.digital.gov/maturity-model/
- 확인: 2026-11-11
- 요약: 이미 있는 사이트에 뒤늦게 입히는 순서를 세 수준으로 준다 — 디자인 원칙 반영 → UX 지침 따르기 → 시스템 코드 쓰기. 한 번에 다 바꾸지 말고 수준을 따라 조금씩 올리라고 한다.
- 원문: "You don't need to adopt the design system all at once."
- 같은 곳 추가 확인(https://designsystem.digital.gov/design-principles/): 직접 만들기 전에 검증된 공용 해법을 먼저 써 보라고 한다. "Have you tried and tested shared solutions before developing your own?"

#### 11. 화해 기술 블로그(요즘IT 전재) — 사용 가능한 진짜 디자인 시스템을 만드는 여정

- URL: https://yozm.wishket.com/magazine/detail/2365
- 확인: 2026-11-11
- 요약: 쓰고 있는 모든 페이지 · 부품을 모아 기능별로 묶어 「같은 기능인데 다른 UI」 를 찾고 → 디자인 원칙 → 파운데이션(색 · 글자 · 그리드) → 부품 → 부품을 조합한 템플릿 → 개발 · 배포(Storybook 으로 디자인 QA) 순서로 했다. 이미 만든 화면을 옮기는 순서는 다루지 않는다.
- 원문: "같은 기능이지만 다른 UI를 사용하는 케이스"

#### 12. Mainmatter — How to create an interface inventory

- URL: https://mainmatter.com/blog/2021/06/02/how-to-create-an-interface-inventory/
- 확인: 2026-11-11
- 요약: 범위 정하기(핵심 기능 · 주 흐름부터) → 모을 특성 정하기(파운데이션: 색 · 글자 · 아이콘 · 간격 · 그리드 · 움직임, 부품) → CSS 통계 도구로 1차 → 손으로 캡처해 종류별 정리 → 감사(불일치 · 낡은 것 · 빈 곳 · 없앨 후보) → 팀과 계획. 감사 결과로 남길 것 · 바꿀 것 · 없앨 것을 가른다.
- 원문: "An audit examines and evaluates the quality of the interface in the inventory."

#### 13. Smashing Magazine — The Atomic Workflow (Brad Frost 기고, 2번과 같은 저자 · 같은 책 발췌)

- URL: https://www.smashingmagazine.com/atomic-design-workflow/
- 확인: 2026-11-11
- 요약: 엄격한 폭포수 순서를 반대한다. 인벤토리는 일찍 해서 불일치를 보여 주는 데 쓰되, 디자인 탐색과 프런트 준비는 나란히 가고 과정은 직선이 아니라고 한다. 2번과 내용이 겹치므로 독립 출처로는 약하다.
- 원문: "There is much work that can and should happen in parallel."

#### 14. 토스 기술 블로그 — 디자인 시스템 다시 생각해보기

- URL: https://toss.tech/article/rethinking-design-system
- 확인: 2026-11-11
- 요약: 순서를 말하는 글은 아니다. 디자인 시스템을 제품으로 보고 쓰는 팀의 수요를 먼저 파악하라고 하며, 시스템이 화면에 안 맞으면 팀이 떼어 내거나 포크해 우회하므로 규칙 강화보다 우회할 이유를 줄이는 설계가 필요하다고 한다. 시스템 값이 실제 화면 요구와 어긋날 때의 조언으로 읽을 수 있다.
- 원문: "디자인 시스템도 하나의 제품이고, 제품은 수요에 맞게 준비 되어야 합니다."

#### 15. Adobe Spectrum — Design tokens

- URL: https://spectrum.adobe.com/page/design-tokens/
- 확인: 2026-11-11
- 요약: primitive(전역) 토큰이 디자인 언어에서 쓸 수 있는 값의 묶음을 정하고, 화면 · 부품은 주로 semantic 토큰으로 쓴다. 전역 토큰을 직접 쓰는 것은 마지막 수단이고 부품 전용 토큰은 그 부품에만 쓴다. 7번 Primer 와 같은 층 순서다.
- 원문: "Semantic tokens are the primary way consumers interact with Spectrum design tokens."

#### 16. Brad Frost — The design system ecosystem (1 · 2 · 13번과 같은 저자, 다른 글)

- URL: https://bradfrost.com/blog/post/the-design-system-ecosystem/
- 확인: 2026-11-11
- 요약: 층을 아래부터 코어(토큰 · 아이콘 · 부품) → 기술별 구현 → 레시피(제품 전용 조합) → 스마트 부품 → 제품 화면으로 나눈다. 토큰은 부품과 떼어 따로 층으로 두고, 단순하게 시작해 실제 필요가 생길 때 층을 더하며, 제품에서 검증된 레시피를 코어로 올린다. 공용 레이아웃 · 화면 조합은 코어가 아니라 그 위 층이라는 구분이다.
- 원문: "Start simple and iterate your way to a more complex ecosystem."

#### 17. 라이너 기술 블로그 — 디자인 시스템 프런트엔드 1편

- URL: https://liner.com/ko/blog/liner-design-system-fronted-1
- 확인: 2026-11-11
- 요약: 1편은 도입 배경과 설계 원칙만 다루고 토큰 → 부품 순서는 2편으로 미뤘다(순서 근거로는 쓰지 못함). 전담 팀이 없는 조직이라 제품 변화에 맞추려고 강제 · 일관성보다 자유도 · 확장성을 앞에 두기로 합의했다는 점만 확인했다.
- 원문: "자유도, 확장성 > 강제성, 일관성"

#### 18. Apple Human Interface Guidelines — Layout

- URL: https://developer.apple.com/design/human-interface-guidelines/layout (본문은 같은 쪽의 데이터 주소 https://developer.apple.com/tutorials/data/design/human-interface-guidelines/layout.json 로 열어 확인)
- 확인: 2026-11-11
- 요약: 작업 순서는 말하지 않는다. 레이아웃은 일관되게 적응하도록 만들고, 여러 크기 · 언어 · 글자 크기로 미리 보며 가장 큰 것과 가장 작은 것부터 시험하라고 한다. HIG 첫 쪽은 시스템이 정한 부품을 쓰고 맞추는 법을 배우라고 안내한다(기존 체계에서 출발). 값을 실제 화면에서 확인하라는 쪽의 근거로만 쓸 수 있다.
- 원문: "Preview your app on multiple devices, using different size classes, localizations, and text sizes."

#### 19. Smashing Magazine — The Anatomy Of Themed Design System Components

- URL: https://www.smashingmagazine.com/2022/12/anatomy-themed-design-system-components/
- 확인: 2026-11-11
- 요약: 기존 제품이면 감사로 실제 쓰는 것을 먼저 분명히 하라고 한다. 토큰은 코어 값에서 시작해 의미 층이 필요해지면 더하고 옮기는 길을 찾으며, 부품 전용 토큰은 새 테마가 그 유연성을 요구할 때만 만든다. 층을 처음부터 다 세우지 말고 필요할 때 더하라는 쪽이다.
- 원문: "having a semantic layer can be really important"

#### 20. Smashing Magazine — How To Improve UX In Legacy Systems (2026-04)

- URL: https://www.smashingmagazine.com/2026/04/legacy-systems/
- 확인: 2026-11-11
- 요약: 옮기는 전략을 다섯으로 나눈다(한 번에 다시 내기 · 조금씩 옮기기 · 나란히 옮기기 · 조금씩 나란히 · 옛 UI 손질 + 공개 베타). 먼저 지금 기능 · 흐름 · 우선순위와 의존 관계를 그려 놓고 전략을 고르며, 한 번에 다시 내기는 위험하고 비싸니 할 수 있으면 조금씩 하라고 한다. 디자인 시스템 전용 글은 아니고 옛 화면 이전 일반론이다.
- 원문: "whenever possible, try to increment gradually"

#### 21. Sparkbox — Design System Maturity Model

- URL: https://sparkbox.com/foundry/design_system_maturity_model
- 확인: 2026-11-11
- 요약: 네 단계(첫 판 만들기 → 쓰는 팀 늘리기 → 유연성과 일관성 사이 균형 → 지속되는 제품)로 본다. 위에서 시작하는 경우 지금 경험을 감사하고 쓸 사람의 의견을 모으는 발견 단계로 시작한다. 값 정하는 순서는 다루지 않는다.
- 원문: "audits of existing experiences"

### 미확인(열지 못해 세지 않음)

- Nathan Curtis(EightShapes) 「Starting a Design System」 — eightshapes.com 500 두 번, medium.com 403. 검색 요약으로만 「시각 언어를 정한 뒤 부품에 입힌다 · 부품 순서보다 범위가 중요」 라고 보였으나 본문 미확인.
- Nathan Curtis 「Tokens in Design Systems」 — medium.com 403.
- 「We're focused too much on design tokens」(Curtis 인터뷰, Design Systems Collective) — 403.
- Material Design 3 — Design tokens(m3.material.io) — 본문이 스크립트로만 그려져 제목만 옴. design.google 글은 404.
- Atlassian Design System — Foundations 쪽은 한 줄 소개만 열림(순서 내용 없음), Design tokens 쪽은 빈 본문.
- Shopify Polaris — polaris-react.shopify.com 은 shopify.dev 로 넘어가고 거기에는 파운데이션 · 토큰 설명 없음.
- Smashing Magazine 「design system UI audit」 로 짐작한 주소 — 404(그런 글이 있는지 확인 못 함).
- 스포카 기술 블로그 디자인 시스템 글 — 짐작한 주소 404. 우아한형제들 기술 블로그 — 디자인 시스템 구축기 글을 찾지 못함(Figma 고객 사례 쪽은 디자인 시스템 순서 내용 없음). 라인 · 카카오 — 구축 순서를 적은 공식 글을 찾지 못함.
- Design Systems Handbook(DesignBetter) — 주소가 첫 쪽으로 넘어감. designsystems.com 가이드 — 404.
- Refactoring UI 본책의 「Start with a feature, not a layout」 · 「Define systems in advance」 — 남이 쓴 요약만 검색에 나와 원문 미확인.
- 열렸지만 내용이 약해 세지 않음: IBM Carbon 「Get started(designing)」 — 순서 문장 없음.

### 출처들이 공통으로 말하는 순서

표본: 확인 21곳. 이 가운데 순서를 직접 적은 곳은 6곳(Figma 102 · UXPin · 화해 · Atomic Design 4장 · Mainmatter · USWDS), 층 순서(토큰 층)를 적은 곳 4곳(Primer · Spectrum · Carbon · Smashing 2022), 나머지는 부분 조언이다. Brad Frost 글이 넷(1 · 2 · 13 · 16)이라 독립 저자로 세면 18곳이다.

1. 지금 있는 것 모으기(인터페이스 인벤토리 · UI 감사). 화면을 캡처해 종류별로 나란히 놓고, 색 · 글자 · 간격 값도 따로 센다. 코드도 같이 센다. — Brad Frost, Figma 102, UXPin, Mainmatter, 화해, Smashing 2022, Sparkbox(7곳)
2. 목표 · 원칙 · 합의. — Figma 102, UXPin, 화해, USWDS(4곳)
3. 파운데이션 값 줄이기 · 정하기(색 → 글자 → 아이콘 → 그리드 · 간격 순으로 적은 곳이 UXPin, 묶어서 적은 곳이 Figma 102 · 화해). 값은 정해진 묶음을 먼저 만들고 그 안에서 고른다(Refactoring UI).
4. 토큰 층: 원시 값 → 역할(의미) 토큰 → 꼭 필요할 때만 부품 토큰. 화면과 부품은 역할 토큰을 쓴다. — Primer, Spectrum, Carbon, Smashing 2022(4곳)
5. 부품. 파운데이션 · 토큰에 기대므로 그 뒤. — Figma 102, UXPin, 화해(3곳)
6. 부품을 조합한 템플릿 · 레시피 · 화면. 제품 전용 조합은 코어 위 층. — 화해, Brad Frost ecosystem, Atomic Design(3곳)
7. 실제 쓰임으로 검증 · 되돌아 고치기. 단계는 겹치고 되풀이된다. — Atomic Design 4장, Refactoring UI, GOV.UK(실제 서비스 근거), Apple HIG(여러 조건 미리 보기), UXPin(첫 패턴 시험 뒤 돌아보기)(5곳)
8. 이미 있는 화면에는 한 번에 말고 조금씩 입힌다. — USWDS, UXPin, Smashing 2026, Brad Frost ecosystem(4곳)

질문별로 줄이면:

- 질문 1(순서): 감사 → 원칙 → 파운데이션 → 토큰 → 부품 → 조합 · 화면. 순서를 적은 6곳이 모두 감사를 맨 앞에 둔다.
- 질문 2(제각각인 화면 통일): 모든 사례가 아니라 서로 다른 모양만 모아 종류별로 나란히 놓고, 겹치는 값(회색이 너무 많음 등)을 적어 줄이고, 남길 것 · 바꿀 것 · 없앨 것을 가른 뒤, 핵심 흐름부터 조금씩 옮긴다.
- 질문 3(파운데이션 먼저 + 반복): 부품이 토큰에 기대므로 파운데이션이 먼저다. 다만 값은 실제로 써 보면 손보게 되는 것이 당연하고(Refactoring UI), 부분과 전체를 오가며 충실도를 올리라고 한다(Atomic Design). 값을 화면 없이 확정하라는 자료는 없었다.
- 질문 4(다른 시스템 값 가져오기): NN/g 는 기존 시스템 채택 · 고쳐 쓰기 · 직접 만들기 셋 중 채택이 가장 싸다고 하고, USWDS 는 직접 만들기 전에 검증된 공용 해법을 먼저 써 보라고 하며, Apple HIG 는 시스템이 정한 부품에서 출발하라고 한다. 3곳이라 근거 약함.

### 출처끼리 갈리는 점

- 직선 순서인가 나란히인가: UXPin · Figma 102 · 화해는 번호를 매긴 단계로 적는다. Brad Frost(Atomic Design 4장 · Smashing 기고)는 폭포수 순서를 반대하고 디자인 탐색과 구현 준비가 나란히 가며 과정이 직선이 아니라고 한다.
- 원칙이 감사보다 앞인가 뒤인가: Figma 102 는 목표 → 감사 → 원칙, UXPin 은 감사 → 합의 · 팀 → 원칙, USWDS(기존 사이트에 입히기)는 원칙 반영이 첫 수준이다.
- 토큰 층을 처음부터 다 세우나: Primer · Spectrum · Carbon 은 원시 · 역할 · 부품 세 층을 완성된 구조로 내놓는다. Smashing 2022 는 코어 토큰에서 시작해 필요해질 때 의미 층을, 새 테마가 요구할 때만 부품 토큰을 더하라고 한다. Brad Frost ecosystem 도 단순하게 시작해 층을 더하라는 쪽이다.
- 일관성을 얼마나 세게 잡나: GOV.UK 는 기존 스타일 · 부품 재사용과 겹치지 않음을 기준으로 삼는다. 토스 · 라이너는 규칙 강화보다 수요에 맞춘 확장 지점, 강제 · 일관성보다 자유도 · 확장성을 앞에 둔다.
- 기존 시스템에서 출발하나 직접 만드나: NN/g 는 채택이 가장 싸다고 하면서도 조직에 필요한 것을 먼저 알라고만 하고 어느 쪽을 권하지는 않는다. 화해 · 토스 같은 한국 사례는 직접 만든 경우만 다룬다.
- 옮기는 방식: USWDS · UXPin · Smashing 2026 은 조금씩을 권한다. Smashing 2026 은 조금씩 옮기면 빨리 얻지만 섞인 상태가 불안정해질 수 있다는 대가도 적었고, 한 번에 다시 내기는 때로 유일한 선택이라고도 한다.

### 한계

- Nathan Curtis · Material 3 · Atlassian · Polaris 는 요청한 우선 출처인데 본문을 열지 못했다.
- 한국 자료는 3곳(화해 · 토스 · 라이너)이고 순서를 적은 곳은 화해 1곳이다. 근거 약함.
- 요약과 인용은 WebFetch 의 요약 모델이 돌려준 문장에 기댄다. 인용 구절을 원문 쪽에서 글자 단위로 다시 맞춰 보지는 않았다.

## 타이포 계층 · 시각 위계를 정하는 방법 조사

확인한 날짜는 모두 2026-11-11. 질문 번호: 1 스케일 정하기 · 2 화면 글자 배정 · 3 크기 밖 위계(굵기 · 색 · 면) · 4 줄 높이 · 간격 눈금 · 5 CJK · 6 UI 대 본문.
WebFetch 로 페이지를 열어 확인한 것만 적었다. 요약 모델을 거친 인용이라 원문 구절은 옮기기 전에 한 번 더 대조하면 좋다.

### 확인한 곳

#### IBM Carbon — Typography overview

- URL: https://carbondesignsystem.com/elements/typography/overview/
- 1: 타입 토큰은 크기 · 굵기 · 줄 높이를 미리 묶은 설정이다. 스케일은 12px 에서 92px 까지 17단계이고 식으로 만든다(네 단계마다 증가 폭이 커진다).
- 2: 어떤 스타일을 쓸지는 레이아웃 · 템플릿 구조가 정한다.
- 6: productive(`-01`, 제품 화면용, 조밀함, 제목 크기 고정)와 expressive(`-02`, 편집 · 마케팅용, 제목이 중단점마다 바뀜) 두 벌을 따로 둔다.
- 원문: "The productive type set uses fixed headings"

#### GitHub Primer — Typography

- URL: https://primer.style/product/getting-started/foundations/typography/
- 1: 스타일마다 크기 · 글꼴 · 굵기 · 줄 높이를 `font` 선언 하나로 주는 shorthand 토큰을 쓴다.
- 2: 굵기는 임의 숫자가 아니라 굵기 변수로만 준다. 제목 태그 순서를 시각 모양 때문에 바꾸지 않는다(의미 마크업과 스타일을 분리).
- 3: 색을 강조의 첫 수단으로 쓰지 말라고 한다.
- 4: 줄 높이는 단위 없는 값이고 스타일마다 다르며 4px 격자에 맞춘다. 한 줄은 80자 안팎.
- 원문: "Refrain from utilizing color as a primary method of emphasis."

#### Atlassian Design System — Typography

- URL: https://atlassian.design/foundations/typography
- 1: 역할은 heading · body · metric 셋(+ code). heading 6단계(XXL–XXS), body 3단계(L · M · S), metric 3단계, code 1. 토큰 하나가 글꼴 · 크기 · 줄 높이를 묶는다.
- 2: 크기는 쓰이는 자리로 고른다(XL · L 은 페이지 제목, M 은 모달, S · XS 는 작은 부품). 제목 수준(h1–h6)과 보이는 크기는 따로 다룬다. 굵게 · 손 크기 조절 대신 제목 스타일을 쓴다. 숫자 강조는 metric 역할.
- 4: 줄 높이는 12 · 16 · 20 · 24 · 28 · 32 · 36 으로 모두 4의 배수(규칙으로 적지는 않음).
- 원문: "Use metric when you want to emphasize certain numbers."

#### Microsoft Fluent 2 — Typography

- URL: https://fluent2.microsoft.design/typography
- 1: 램프 이름은 Caption · Body · Subtitle · Title · Large Title · Display. 웹 16 스타일(Strong · Stronger 변형 포함). 스타일마다 크기 · 줄 높이 · 굵기가 한 묶음.
- 3: 같은 크기에서 굵기(Regular · Semibold · Bold)로 수준을 나누고, 색으로 강조를 조절한다(옅은 중립색은 아래 수준). 대비 4.5:1 · 큰 글자 3:1.
- 4: 4px 줄 높이 규칙은 적혀 있지 않다.
- 원문: "Using a primary color on text will give it more visual prominence"

#### Material Design 3 — Android 공식 문서(Compose 의 Material 3)

- URL: https://developer.android.com/develop/ui/compose/designsystems/material3 (m3.material.io 본문은 스크립트 렌더라 열리지 않아 공식 Android 문서로 확인)
- 1: 역할 다섯(display · headline · title · body · label) × 크기 셋(large · medium · small) = 15 스타일. 스타일 하나(TextStyle)가 굵기 · 크기 · 줄 높이 · 자간을 묶는다. 기본값 줄 높이는 16 · 20 · 24 · 28 · 32 · 36 · 40 · 44 · 52 · 64 로 모두 4의 배수.
- 2: 제품이 15개를 다 쓸 필요는 없다고 하고, 예제는 다섯 크기만 골라 쓴다. 코드에서는 숫자가 아니라 `typography.titleLarge` 같은 역할 이름으로 부른다.
- 3: 강조는 두 길이라고 적는다. 면 · 글자 색 짝(surface / on-surface / on-surface-variant)과 글자 굵기. 높이(elevation)는 그림자보다 색조 겹침(tonal overlay)으로 나타내고 다크 테마도 같다.
- 원문: "Your product will likely not need all 15 default styles"

#### Radix Themes — Typography

- URL: https://www.radix-ui.com/themes/docs/theme/typography
- 1: 9단계 `size` 눈금(1–9) 하나. 단계마다 글자 크기 · 줄 높이 · 자간이 짝으로 정해져 있고 함께 쓰도록 설계됐다(12/16 · 14/20 · 16/24 · 18/26 · 20/28 · 24/30 · 28/36 · 35/40 · 60/60). 큰 단계일수록 자간이 좁아진다. 굵기는 Light · Regular · Medium · Bold 넷.
- 2: 역할 이름이 아니라 번호 눈금이다. 제목 · 본문은 Text · Heading 부품이 같은 눈금을 쓴다.
- 원문: "The typographic system is based on a 9-step `size` scale."

#### Vercel Geist — Typography

- URL: https://vercel.com/geist/typography
- 1: 클래스 하나가 크기 · 줄 높이 · 자간 · 굵기를 묶는다. 분류는 Heading · Button · Label · Copy 넷이고 이름에 크기 숫자를 붙인다(예: Label 14, Copy 13).
- 2: 분류마다 쓰임을 적는다. Label 13 은 다른 라벨 옆 둘째 줄, Label 12 는 복잡한 화면의 셋째 수준 글, Copy 14 가 가장 흔한 본문, Button 은 버튼 부품 안에서만.
- 3: 같은 크기에 Subtle · Strong 변형을 둔다.
- 6: 한 줄짜리(Label)와 여러 줄 글(Copy)을 따로 두고, 같은 크기라도 Copy 의 줄 높이가 더 높다.
- 원문: "Designed for multiple lines of text, having a higher line height than Label."

#### IBM Carbon — Type sets

- URL: https://carbondesignsystem.com/elements/typography/type-sets/
- 1: 토큰 이름이 쓰임을 말한다. utility(`code` · `label` · `helper-text` · `legal`), body(`body-compact` · `body`), 고정 제목(`heading-compact` · `heading-01`–`07`), fluid heading, fluid display.
- 2: 토큰마다 쓸 자리를 적는다. label 은 칸 라벨 · 오류 · 캡션용이고 본문에 쓰지 않는다. 제목은 같은 벌 · 같은 크기의 본문과 짝짓는다. 부품(버튼 · 링크)은 body-compact.
- 4 · 6: 같은 크기에 줄 높이만 다른 두 스타일을 둔다. 14px 는 compact 18 · 일반 20, 16px 는 compact 22 · 일반 24. compact 는 네 줄 안팎 짧은 글 · 부품, 일반은 긴 문단. productive 는 14px 기준, expressive 는 16px 기준.
- 원문: "Productive styles are named with a suffix of `-01`"

#### Tim Brown — More Meaningful Typography (A List Apart)

- URL: https://alistapart.com/article/more-meaningful-typography/
- 1: 모듈러 스케일은 비율과 기준 수에서 곱하고 나눠 만든 수열이다. 기준은 본문이 잘 읽히는 크기에서 잡는다.
- 2: 스케일은 규칙이 아니라 안내다. 반올림하거나 스케일 밖 값(사이드바 15px)을 쓸 수 있고, 스케일에서 나오지 않은 값은 계산 근거를 주석으로 남긴다.
- 원문: "Modular scales are tools, they're not magic."

#### modularscale.com (Tim Brown · Scott Kellum)

- URL: https://www.modularscale.com/
- 1: 스케일을 자처럼 쓴다. 기준은 본문 크기에서 시작하고 비율은 음정(단2도 15:16 – 겹옥타브 1:4)에서 고른다. 기준 · 비율을 여러 개 섞으면 수가 서로 무관해진다고 경고한다.
- 4: 같은 수열을 글자뿐 아니라 간격 · 격자에도 쓴다고 적는다.
- 원문: "Body text type size is a good place to start."

#### Material Components Android — Dark theme 문서

- URL: https://github.com/material-components/material-components-android/blob/master/docs/theming/Dark.md
- 3: 다크 배경 · 면은 검정이 아니라 짙은 회색이다. 어두운 배경에서는 그림자가 덜 보여서 높은 면일수록 밝게 한다. 옛 elevation overlay 는 tonal surface 색 체계로 바뀌었다. 겹친 면에서는 글자 대비를 다시 확인하라고 한다.
- 원문: "Surface with elevation overlays has been replaced in Material components with the tonal surface"

#### Apple HIG — Typography

- URL: https://developer.apple.com/design/human-interface-guidelines/typography (본문은 같은 쪽의 JSON https://developer.apple.com/tutorials/data/design/human-interface-guidelines/typography.json 으로 확인, 앞 10만 자만 읽음)
- 1: text style 은 굵기 · 크기 · 줄 높이(leading) 값을 한 묶음으로 정한 것이다. 내장 text style 을 쓰라고 권한다. 서체 수는 줄인다.
- 2: 글자 크기가 바뀌어도 요소 사이의 상대 위계와 구분을 지키라고 한다.
- 3: 위계는 굵기 · 크기 · 색을 조절해 만든다. Light 계열 굵기는 피하고 Regular · Medium · Semibold · Bold 를 쓴다.
- 4 · 6: 넓은 단 · 긴 글은 줄 사이를 넓게(loose leading), 목록 줄처럼 높이가 좁은 곳은 좁게(tight leading). 세 줄 넘는 글에는 좁은 줄 높이를 쓰지 않는다.
- 원문: "Adjust font weight, size, and color as needed to emphasize important information"

#### Apple HIG — Dark Mode

- URL: https://developer.apple.com/design/human-interface-guidelines/dark-mode (JSON 으로 확인)
- 3: 다크에서는 배경색을 base 와 elevated 두 벌로 둔다. base 는 어두워 물러나 보이고 elevated 는 밝아 앞으로 나와 보인다. 글자는 primary · secondary · tertiary · quaternary 라벨 색을 쓴다. 대비는 최소 4.5:1, 작은 글자는 7:1 을 목표로.
- 원문: "The base colors are dimmer, making background interfaces appear to recede"

#### Linear — How we redesigned the Linear UI

- URL: https://linear.app/now/how-we-redesigned-the-linear-ui
- 1: 제목에는 Inter Display, 나머지는 Inter.
- 3: LCH 색 공간에서 기준색 · 강조색 · 대비 세 값으로 테마를 만든다. 배경 · 전경 · 패널 · 다이얼로그 · 모달의 높이(elevation)를 색으로 관리하고, 다크에서 글자 · 중립 아이콘을 더 밝게 했다. 내비게이션 요소의 위계와 밀도를 높이는 것이 목표였다.
- 원문: "increase the hierarchy and density of navigation elements"

#### デジタル庁デザインシステム — タイポグラフィ

- URL: https://design.digital.go.jp/dads/foundations/typography/
- 1: 스타일 이름이 종류 · 크기 · 굵기 · 줄 높이를 함께 적는다(`Std-17N-170`). 종류는 Display · Standard · Dense · Oneline · Mono 다섯. 굵기는 400 · 700 두 단계가 기본.
- 2: 종류를 쓰임으로 고른다. 머리 문구는 Dsp, 제목 · 본문은 Std, 관리 화면 · 표는 Dns, 버튼 같은 한 줄 UI 는 Oln, 코드는 Mono.
- 4: 줄 높이는 종류마다 정해져 있다. Oneline 100%, Dense 120 · 130%, 큰 제목 140%, 본문 150–175%. 글자가 클수록 줄 사이를 좁힌다.
- 5: 일본어 읽을거리 본문은 1.5배 이상을 유지한다. 본문 · UI 는 16px 이상, 14px 미만은 원칙적으로 안 쓴다. 일본어 이탤릭은 피한다. 자간은 작을수록 넓히고 클수록 좁힌다.
- 6: 정보량이 우선인 업무 화면용 Dense 를 일반 Standard 와 따로 둔다.
- 원문: "少なくとも1.5倍を維持することを推奨します"

#### SmartHR Design System — タイポグラフィ

- URL: https://smarthr.design/products/design-tokens/typography/
- 1: 크기는 XXS–XXL 의 의미 이름 토큰, 기준 M = 16px. 줄 높이는 따로 세 토큰: 제목 TIGHT 1.25, 문단 NORMAL 1.5, 라벨 NONE 1.
- 2: 기본은 M 만 쓰고, 레이아웃에 문제가 있을 때만 다른 크기를 고른다. 굵기 · 강조는 Text 부품으로, 제목 모양은 Heading 부품이 정한다. 작은 크기는 적극적으로 쓰지 않는다.
- 4: 줄 높이를 역할(제목 · 문단 · 라벨)로 나눈다.
- 원문: "フォントサイズは基本的に`M`を使います。"

#### 토스 TDS Mobile — Typography

- URL: https://tossmini-docs.toss.im/tds-mobile/foundation/typography/
- 1: 토큰이 계층을 이룬다. Typography 1–7(주 7단계)과 sub Typography 1–13(보조 13단계)로 20개. 토큰 하나가 크기와 줄 높이 짝이다(예: 17/25.5, 15/22.5, 13/19.5 — 줄 높이는 대체로 크기의 1.5배 안팎이고 4px 격자가 아니다). 굵기는 Light–Bold 5종을 토큰마다 변형으로 준다.
- 2: 주 단계에 쓰임을 붙인다(매우 큰 제목 · 큰 제목 · 일반 제목 · 작은 제목 · 일반 본문 · 작은 본문 · 안 읽어도 됨). 표의 숫자를 고정 값으로 직접 쓰지 말고 계층 토큰을 쓰라고 한다(큰 글씨 모드 대응).
- 5: 한글 서비스의 본문 줄 높이가 1.5배 근처라는 실제 예.
- 원문: "표에 나온 값을 고정 값으로 하드코딩하지 않는 것이 중요해요."

#### W3C — Requirements for Hangul Text Layout and Typography(KLREQ)

- URL: https://www.w3.org/TR/klreq/
- 4 · 5: 줄 간격은 비례 · 고정 줄 높이 · 고정 줄 사이 · 최소 줄 높이 네 방식으로 설명하고 비례 방식의 예로 160% 를 든다(권장값을 정하지는 않는다). 한글 · 한자 · 가나의 글자 사이는 기본 0. 한글은 대소문자가 없고, 줄바꿈은 글자 단위나 어절 단위를 고를 수 있다.
- 원문: "applied by using a certain percentage of the character size"

#### Smashing Magazine — Typographic Hierarchies

- URL: https://www.smashingmagazine.com/2022/10/typographic-hierarchies/
- 1: 연습에서는 크기를 셋(본문 · 제목 · 소제목/강조)으로 제한한다.
- 3: 크기는 여섯 변수 가운데 하나일 뿐이고 굵기 · 색 · 간격(가까움) · 시각 구두점과 섞어 위계를 만든다. 굵기는 같은 뜻에 일관되게 쓰고, 색은 두세 개로 줄여야 위계 도구가 된다. 간격으로 묶음과 순서를 나타낼 수 있다.
- 원문: "For the purposes of this exercise, we will limit ourselves to three sizes."

#### Figma — Typography systems in Figma (best practices)

- URL: https://www.figma.com/best-practices/typography-systems-in-figma/
- 1: 이름 붙이기는 크기 이름(XS–XL) · 의미 이름(HTML 태그에 대응) · 쓰임을 말하는 이름 셋이 있고, 쓰임 이름은 값이 같은 스타일이 여러 개 생겨 수가 늘 수 있다. 스타일 수에 정답은 없다. 이름은 개발과 함께 정한다. 큰 배수의 모듈러 스케일은 제목이 너무 커져 제목용 비율을 따로 쓸 수 있다.
- 3: 색은 텍스트 스타일에 넣지 않고 색 스타일로 따로 입힌다(색 조합마다 스타일을 만들지 않는다).
- 4: 4pt 기준선 체계에서는 모든 줄 높이를 4의 배수로 둔다. 본문은 크기의 1.5배쯤에서 시작하고 제목은 줄 사이를 줄인다. 모든 크기에 한 비율을 쓰지 않는다.
- 원문: "There is no magic number that defines how many styles or sizes you will need."

#### Atlassian Design System — Spacing

- URL: https://atlassian.design/foundations/spacing
- 4: 기준 단위 8px. 토큰은 숫자 이름(`space.100` = 8px, 접미 숫자는 기준의 백분율)이고 0–80px. 쓰임은 범위로 안내한다: 작음(0–8, 아이콘 틈 · 조밀한 UI), 중간(12–24, 부품 안), 큼(32–80, 페이지 배치).
- 3: 가까움(관련 있는 것끼리 가깝게) · 비슷함(같은 것은 같은 간격) 원리로 간격을 고른다. 요소 둘레의 여백 양으로 묶음과 중요도를 나타낸다.
- 원문: "Our spacing system is built around a base unit of 8 pixels."

#### IBM Carbon — Spacing

- URL: https://carbondesignsystem.com/elements/spacing/overview/
- 4: 2 · 4 · 8 의 배수로 13단계(`$spacing-01` 2px – `$spacing-13` 160px), 번호 이름. 타입 스케일 · 2x 격자와 맞물리게 만든다. 눈금 밖 값은 예외로 허용하지만 피하라고 한다. 중단점에서는 값을 바꾸지 않고 눈금 단계를 옮긴다.
- 원문: "by using multiples of two, four, and eight"

#### 당근 SEED Design — Typography

- URL: https://seed-design.io/docs/foundation/typography/overview
- 1: 크기 토큰 `t1`–`t14` 14단계(11–48px)와 같은 번호의 줄 높이 토큰(15–60px)을 짝으로 쓴다. 굵기는 regular · medium · bold 셋. 스케일 스타일 이름은 크기 + 굵기(`t4Regular`).
- 2: 번호 눈금 위에 의미 스타일(`screenTitle`, `articleBody`)을 얹고, 역할이 정해진 자리에는 의미 스타일을 먼저 쓰라고 한다. 범위 안내: t1–t5 본문 · 보조, t6–t10 제목, t11–t14 큰 화면 제목.
- 5: medium 굵기는 플랫폼 시스템 글꼴에 따라 한글이 다르게 보일 수 있다고 적는다.
- 6: 게시물 본문용 의미 스타일(`articleBody`)을 따로 둔다.
- 원문: "사용자의 폰트 크기 설정을 존중"

#### Shopify Polaris — Typography(Using type · Font and typescale)

- URL: https://polaris.shopify.com/design/typography/using-type · https://polaris.shopify.com/design/typography/font-and-typescale (사이트가 shopify.dev 로 넘어가 공식 저장소 Shopify/polaris 의 같은 문서 원문 `polaris.shopify.com/content/design/typography/*.mdx` 로 확인)
- 1: 스케일은 heading 과 body 두 벌. 조밀하고 복잡한 소프트웨어 UI 용으로 만들었다고 적는다.
- 2: heading 은 구역 · 하위 구역을 여는 글, body 는 그 밖의 모든 UI 글(버튼 · 입력 · 문단 · 내비게이션). 제목은 뒤따르는 글보다 같거나 크다. 제목 굵기는 일관되게.
- 3: 복잡한 부품 안에서는 본문 크기와 색을 달리해 위계를 만든다. 굵기는 색 · 위치와 함께 주의를 끈다. 본문 크기를 모든 곳에 똑같이 쓰면 핵심 요소를 찾기 어렵다고 한다.
- 4: 관리 화면의 글자는 4px 격자에 맞추고 줄 높이는 모두 4px 의 배수.
- 6: 스케일 자체가 조밀한 관리 화면 전용.
- 원문: "Type in the admin is aligned on the 4px grid."

#### web.dev — Learn Design: Typography

- URL: https://web.dev/learn/design/typography
- 1: 위계를 먼저 생각하고 디자인 시스템에 타입 스케일을 넣어 두라고 한다(만드는 법은 설명하지 않음).
- 4: 줄 높이는 단위 없는 값으로 쓴다. 줄 높이는 줄 길이에 따라 다르다(예: 66ch 글에 1.65).
- 원문: "Use unitless values for your line-height declarations."

#### DEV Community — Why many design systems only need 4 text sizes (개인 글, 무게 낮음)

- URL: https://dev.to/7twilight/why-many-design-systems-only-need-4-text-sizes-and-why-thats-totally-fine-3oj2
- 1: 제품 화면은 글자 크기 네 개쯤으로 충분하다고 주장한다. 토큰은 번호가 아니라 기능 이름(display · title · body · caption)을 권한다.
- 3: 같은 크기에서 굵기와 색으로 1차 · 2차 · 강조를 가른다.
- 원문: "Typography hierarchy is often created with weight and color, not just size."

#### KRDS(대한민국 정부 디자인 시스템) — 타이포그래피

- URL: https://www.krds.go.kr/html/site/style/style_03.html
- 1: 역할 이름으로 나눈다. Display 3단계 · Heading 6단계(xlarge–xxsmall) · Body 8(large–xsmall 과 bold 변형) · Navigation 6 · Label 4. 굵기는 400 · 700 이 기본이고 많아도 네 종까지.
- 2: Navigation 은 머리 · 메뉴 · 페이지 안 탐색, Label 은 버튼 · 입력 칸 라벨처럼 부품 역할마다 전용 토큰을 둔다.
- 3: 제목은 본문보다 크게 하거나 크기가 같으면 굵기로 가른다. 강조는 밑줄이 아니라 색 · 굵기로. 본문 색은 회색 계열, 대비 4.5:1 이상.
- 4 · 5: 줄 간격은 150% 이상, 단위는 em · %. 본문 최소 16px 이고 Pretendard GOV 는 작게 보여 기본 17px. 제목과 본문 크기 차는 1.25–1.5배. 자간은 대부분 0.
- 원문: "줄 간격(line-height)은 가독성과 접근성을 위해 최소 150% 이상으로 설정하여"

#### Material Web(공식 저장소) — Typography 문서

- URL: https://github.com/material-components/material-web/blob/main/docs/theming/typography.md (Material 3 항목을 보강, 따로 세지 않음)
- 1: typescale 은 쓰임을 말하는 역할로 묶은 글꼴 스타일이다. 역할 다섯(Display · Headline · Title · Body · Label), 역할마다 small · medium · large, 크기마다 font · size · line-height · weight 네 속성. 토큰 꼴은 `--md-sys-typescale-<role>-<size>-<property>`.
- 원문: "are organized into roles that describe their purpose"

#### Radix Colors — Understanding the scale

- URL: https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
- 3: 12단계 색 눈금의 단계마다 쓰임이 정해져 있다. 1–2 앱 배경 · 옅은 면, 3–5 UI 요소 면(기본 · 호버 · 눌림), 6–8 테두리, 11 낮은 대비 글자, 12 높은 대비 글자. 글자 밝기 2단계와 면 층을 같은 눈금 안에서 역할로 고른다.
- 원문: "Steps 1 and 2 are designed for app backgrounds and subtle component backgrounds."

#### GitHub Primer — Color usage

- URL: https://primer.style/product/getting-started/foundations/color-usage/
- 3: 중립 눈금 앞 여섯 단계가 배경(`bgColor-default` · `bgColor-muted` 가 가장 흔함), 9–10 단계가 글자 · 아이콘. 글자 · 테두리 대비는 muted 배경 기준으로 계산한다. 색 모드를 따르는 기능 토큰만 쓰고 기본(base) 토큰은 직접 쓰지 않는다. 라이트 · 다크 눈금이 반대로 흘러 같은 기능 토큰을 함께 쓴다.
- 원문: "All contrast values for text and borders are calculated against `bgColor-muted`."

#### Microsoft Fluent 2 — Elevation

- URL: https://fluent2.microsoft.design/elevation
- 3: 높이는 그림자 여섯 수준(2 · 4 · 8 · 16 · 28 · 64)으로 나타내고 수준마다 쓰는 부품을 정한다. 다크에서는 그림자를 없애지 않고 불투명도를 올린다(Low 14% → 28%). 다크에서 면을 밝게 하라는 말은 이 쪽에 없다(Material · Apple 과 갈림).
- 원문: "sharp and crisp shadows indicate closeness to a surface"

#### Adobe Spectrum CSS(공식 저장소) — typography 부품

- URL: https://github.com/adobe/spectrum-css/blob/main/components/typography/index.css (가이드 쪽 spectrum.adobe.com 의 「Typography system」 은 열리지 않아 코드로 확인. 값은 이 파일에 없고 토큰 이름만 확인)
- 1: 부류는 Heading(XXS–XXXL 8단계) · Body(XS–XXXL 7) · Detail(S–XL 4) · Code(XS–XL 5).
- 5: `:lang(zh)` · `:lang(ja)` · `:lang(ko)` 일 때 부류마다 CJK 전용 토큰으로 바꾼다. Heading 은 글꼴 · 굵기 · 크기 · 줄 높이 · 자간 모두, Body 는 글꼴 · 굵기 · 줄 높이 · 자간(크기는 라틴과 같음), Detail 은 글꼴 · 굵기 · 줄 높이. 곧 CJK 는 같은 역할 이름을 유지한 채 줄 높이 · 굵기 · 자간 값을 따로 둔다.
- 원문(토큰 이름): "--spectrum-body-cjk-line-height"

#### W3C — Requirements for Japanese Text Layout(JLREQ)

- URL: https://www.w3.org/TR/jlreq/ (2.4 절 주석, 10만–20만 자 구간)
- 5: 일본어 본문의 줄 사이(line gap)는 글자 크기의 반(二分)에서 전각 사이로 잡는 것이 보통이다. 줄 높이로 바꾸면 1.5–2.0배. 한 줄이 35자를 넘으면 전각 쪽, 짧은 줄은 반각도 된다. 본문 글자 크기에는 하한이 있다(인쇄 기준 8포인트).
- 원문: "set to a value between half-em spacing and the one em spacing"

#### GOV.UK Design System — Type scale

- URL: https://design-system.service.gov.uk/styles/type-scale/
- 1: 눈금 7점(80 · 48 · 36 · 27 · 24 · 19 · 16). 점마다 크기와 줄 높이가 짝이고 화면 크기별 값이 있다. 제목(heading-xl · l · m · s)과 본문(body-l · body · body-s)이 같은 점을 나눠 쓴다.
- 2: 있는 스타일을 먼저 쓰고, 새 스타일이 필요하면 눈금의 한 점에 맞춘다. 80 과 27 은 예외 상황 전용으로 못박아 둔다.
- 4: 줄 높이는 모두 5px 의 배수(4px 이 아니라 5px 격자).
- 원문: "If you need to create a new style, align it with one of the points on the type scale."

#### SmartHR Design System — Heading 부품

- URL: https://smarthr.design/products/components/heading/ (SmartHR 항목 보강, 따로 세지 않음)
- 2 · 3: 제목 종류를 역할 이름으로 둔다(screenTitle · sectionTitle · blockTitle · subBlockTitle · subSubBlockTitle). blockTitle 과 subBlockTitle 은 크기 M · 굵게로 같고 색만 다르다(TEXT_BLACK 대 TEXT_GREY). 크기가 아니라 글자 밝기로 한 수준을 내린다. 종류는 문서 개요 순서대로 쓴다.
- 원문(표 값): "subBlockTitle | M | bold | TEXT_GREY"

#### Smashing Magazine — Technical Web Typography: Guidelines and Techniques(2011, 편집자 주 「오래됨」)

- URL: https://www.smashingmagazine.com/2011/03/technical-web-typography-guidelines-and-techniques/
- 4: 본문 줄 높이(16 × 1.5 = 24px)를 「마법의 수」 로 삼아 모든 줄 높이와 여백을 그 수나 배수로 둔다. 이어지는 글은 줄 사이를 넓게, 짧은 정보는 좁게.
- 원문: "All line heights and margins will be this number or multiples thereof."

### 미확인(세지 않음)

- m3.material.io 의 Typography(type scale tokens · applying type · overview) — 스크립트 렌더라 본문이 안 열림. Android 공식 문서와 Material Web 저장소로 대신 확인. M3 의 CJK · dense script 지침은 미확인.
- Material 2 Language support(dense · tall script 줄 높이) — 본문 안 열림. 검색 요약만 봤으므로 미확인.
- Material 2 Dark theme(글자 불투명도 87 · 60 · 38%) — 본문 안 열림, 미확인.
- Refactoring UI — 「7 Practical Tips」(Medium) 403. 공식 미리보기 「Building your color palette」 만 열었고 거기에는 회색 눈금을 가장 짙은 글자색에서 시작해 고르게 올린다는 말만 있다. 「크기 대신 굵기 · 색으로 위계」 조언은 원문 미확인.
- Adobe Spectrum 가이드 쪽(Typography system · Applying the type system) — 404. 줄 높이 배수 값 미확인.
- LINE LDSM typography — 403.
- Google Fonts Knowledge 의 CJK 웹 타이포 — 본문 안 열림.
- Ameba Spindle UI typography — 개요 쪽만 열림, 하위 쪽 404.
- 네이버 · 카카오 디자인 글 — 찾지 못함.

### 질문별 정리

#### 1. 타입 스케일을 어떻게 정하나

공통으로 말하는 것

- 크기만 정하지 않는다. 크기 · 줄 높이 · 굵기(많은 곳은 자간까지)를 한 묶음(text style · 토큰)으로 정해 묶음째 쓴다(Material 3 · Apple · Carbon · Primer · Atlassian · Fluent · Radix · Geist · 디지털청 · 토스 · SEED · GOV.UK).
- 이름은 쓰임을 말한다. Material 3 은 display · headline · title · body · label, Atlassian 은 heading · body · metric · code, Carbon 은 label · helper-text · body · heading, KRDS 는 Display · Heading · Body · Navigation · Label, Polaris 는 heading · body, Geist 는 Heading · Button · Label · Copy.
- 역할(부류) 수는 3–5개, 역할 안 크기 단계는 3–6개가 흔하다. 전체 스타일 수는 13–20개 안팎(Material 15, Atlassian 13, Fluent 웹 16, 토스 20). 다 쓰라는 뜻이 아니라고 Material 이 직접 적는다.
- 굵기 종류는 적게 둔다(디지털청 2, SEED 3, Radix 4, KRDS 최대 4, Apple 은 Light 계열 금지).

갈리는 점

- 이름 방식: 역할 이름(Material · Atlassian · Carbon · KRDS) 대 번호 눈금(Radix 1–9, SEED t1–t14, 토스 Typography 1–7) 대 부류 + 크기 숫자(Geist, 디지털청 `Std-17N-170`). 번호 눈금을 쓰는 곳도 그 위에 쓰임 설명이나 의미 스타일을 얹는다(토스 「일반 본문」, SEED `screenTitle`).
- 만드는 법: 식 · 비율(Carbon 의 식, Polaris 1.2 비율 뒤 4px 반올림 — 뒤쪽은 검색 요약으로만 확인, Tim Brown 의 모듈러 스케일) 대 손으로 고른 값(Radix · Geist · GOV.UK). Tim Brown 본인도 스케일은 안내일 뿐이고 반올림 · 스케일 밖 값을 쓸 수 있다고 한다. Figma 글은 큰 비율이 제목을 너무 키운다고 경고한다.
- 「스타일 수에 정답은 없다」(Figma) 대 「네 크기면 충분」(개인 글).

#### 2. 화면의 글자를 스케일에 배정하는 방법

공통으로 말하는 것

- 숫자를 직접 쓰지 않고 토큰 · 스타일 이름으로 쓴다(토스 「하드코딩하지 않는다」, Primer 「임의 굵기 숫자 금지」, SEED · GOV.UK 「있는 스타일 먼저」).
- 스타일마다 쓰는 자리를 글로 적어 둔다. Carbon(label 은 본문에 쓰지 않음), Geist(Label 13 은 둘째 줄), Atlassian(XL · L 은 페이지 제목, M 은 모달), 디지털청(종류별 장면), SmartHR(제목 종류 다섯), KRDS(Navigation · Label 전용).
- 보이는 크기와 문서 제목 수준(h1–h6)은 따로 다룬다(Atlassian · Primer · SmartHR).
- 기본 하나를 정하고 나머지는 이유가 있을 때만 쓴다(SmartHR 「기본은 M」, Geist 「Copy 14 가 가장 흔함」).

갈리는 점

- 예외 다루기: GOV.UK 는 새 스타일도 눈금의 점에 맞추고 예외용 점을 따로 못박는다. Carbon 은 눈금 밖 값을 허용하되 피하라고 한다. Tim Brown 은 스케일 밖 값을 쓰되 계산 근거를 적어 두라고 한다. 「가까운 숫자로 옮기라」 는 지침은 어느 곳에도 없고, 모두 쓰임(역할)에서 스타일을 고르는 순서로 적는다.

#### 3. 크기만으로 위계를 만들지 않는 방법

공통으로 말하는 것

- 위계 수단은 크기 · 굵기 · 색(밝기) 셋이고 간격이 넷째다(Apple 「굵기 · 크기 · 색」, Material 3 「색 짝과 굵기」, Fluent, Polaris, KRDS 「크기가 같으면 굵기로」, Smashing, Atlassian spacing 의 가까움 원리).
- 같은 크기에서 한 수준 내릴 때는 글자 밝기를 낮춘다. SmartHR 의 blockTitle 과 subBlockTitle 은 크기 · 굵기가 같고 색만 다르다. Geist 는 Subtle · Strong 변형, Fluent 는 Strong 변형을 둔다.
- 글자 밝기는 2–4단계의 역할 색으로 둔다(Apple primary–quaternary, Radix 11 · 12, Material on-surface / on-surface-variant, Primer 기능 토큰). 색은 텍스트 스타일에 넣지 않고 따로 입힌다(Figma).
- 다크에서 면 층은 밝기로 가른다. 위에 뜬 면일수록 밝게(Apple base / elevated, Material tonal surface, Material Components 「그림자가 덜 보여서」, Radix 1–2 배경 · 3–5 요소 면, Linear 의 elevation 색 관리). 배경은 검정이 아닌 짙은 회색(Material Components).
- 대비 하한은 4.5:1(Apple · Fluent · KRDS).

갈리는 점

- Primer 는 색을 강조의 첫 수단으로 쓰지 말라고 하고(굵기 먼저), Polaris · Fluent · Material 은 색을 굵기와 나란한 수단으로 든다.
- 다크의 높이 표현: Material · Apple 은 면을 밝게, Fluent 2 는 그림자를 유지하고 불투명도를 올린다.

#### 4. 줄 높이 규칙과 간격 눈금

공통으로 말하는 것

- 줄 높이는 스타일마다 정해 두고 격자 배수로 맞춘다. 4px 배수가 가장 많다(Primer · Polaris 는 규칙으로 명시, Material 3 · Atlassian 은 값이 모두 4의 배수, Figma 글). 본문은 크기의 1.5배쯤에서 시작하고 큰 글자일수록 비율을 낮춘다(Figma · 디지털청 · SmartHR 1.25 / 1.5 / 1).
- 줄 높이는 글의 쓰임으로 갈린다. 한 줄 라벨 · 버튼은 낮게, 여러 줄 글은 높게(Geist Label / Copy, Carbon compact / 일반, 디지털청 Oneline 100% · Dense 120–130% · 본문 150–175%, Apple tight / loose).
- 간격은 4 · 8 기준의 정해진 눈금에서만 고른다(Atlassian 8px 기준 0–80, Carbon 2 · 4 · 8 배수 13단계). 가까움 · 비슷함 원리로 고른다.

갈리는 점

- 격자: 4px(Primer · Polaris · Material) 대 5px(GOV.UK) 대 격자 없이 비율(토스 ×1.5 → 25.5 · 22.5, KRDS 150%, web.dev 단위 없는 값). Radix 는 26 · 30 처럼 4의 배수가 아닌 값도 쓴다.
- 간격 이름: 확인한 두 곳(Atlassian · Carbon)은 번호 이름이고, 역할은 이름이 아니라 범위 안내(작음 = 부품 안, 큼 = 페이지 배치)로 준다. 간격을 역할로 이름 붙이는 예는 이번 조사에서 확인하지 못했다(근거 약함: 2곳).

#### 5. 한글 · 일본어(CJK)

공통으로 말하는 것

- 본문 줄 높이를 라틴보다 넉넉히 잡는다. 150% 이상이 하한(디지털청 「1.5배 이상」, KRDS 「최소 150%」, SmartHR 문단 1.5, 토스 약 1.5배, JLREQ 는 줄 사이 반각–전각 = 1.5–2.0배, KLREQ 예시 160%).
- 본문 크기 하한을 높게 둔다(디지털청 · KRDS · SmartHR 모두 16px 기준, KRDS 는 Pretendard GOV 가 작게 보여 17px, 디지털청은 14px 미만 금지).
- 굵기 단계를 줄인다(디지털청 400 · 700, KRDS 400 · 700 기본). 자간은 기본 0(KLREQ · KRDS). 일본어 이탤릭은 피한다(디지털청).
- 여러 언어를 함께 다루는 시스템은 역할 이름은 그대로 두고 CJK 일 때 줄 높이 · 굵기 · 자간 값만 바꾼다(Spectrum 의 `:lang(ja|zh|ko)` 전용 토큰).

갈리는 점

- 4px 격자와 충돌한다. 한 · 일 시스템은 비율(150% · 170%)로 줄 높이를 정해 소수 값이 나오고, 영어권 시스템은 4px 배수로 정한다. 둘을 함께 맞추는 방법을 적은 곳은 찾지 못했다(미확인).
- 조밀한 UI 의 CJK 줄 높이: 디지털청은 Dense 120–130% 를 허용하고, KRDS 는 150% 이상을 일괄로 요구한다.
- Material 의 dense script 지침(줄 높이를 더 주라는 내용으로 알려짐)은 본문을 열지 못해 미확인.

#### 6. 조밀한 UI 와 글 본문을 따로 두나

공통으로 말하는 것

- 따로 둔다. Carbon productive(14px 기준, 고정 제목) / expressive(16px 기준, 유동 제목), 디지털청 Dense / Standard, Geist Label / Copy, Carbon body-compact / body, Apple tight / loose leading, SEED `articleBody`, Polaris 는 스케일 전체를 조밀한 관리 화면용이라고 밝힌다.
- 가르는 기준은 대체로 줄 높이와 기준 크기이고 역할 이름 체계는 공유한다. 같은 크기에 줄 높이만 다른 두 스타일을 두는 꼴이 흔하다(Carbon 14/18 과 14/20, Geist).
- 세 줄 넘는 글에는 조밀한 줄 높이를 쓰지 않는다(Apple), 네 줄 안팎까지만 compact(Carbon).

갈리는 점

- 두 벌을 통째로 따로 두는 곳(Carbon, 디지털청)과 한 벌 안에 본문용 스타일 몇 개만 더하는 곳(SEED, Geist, Atlassian 은 구분 없음).

## 부품 · 레이아웃 설계와 규격화 조사

확인한 날짜는 모두 2026-11-11. 페이지를 직접 열어 확인한 것만 적었다. 질문 번호는 1 부품 정의 · 2 만드는 순서 · 3 맞물리는 크기 · 4 레이아웃 체계 · 5 패턴과 부품 나누기.

### 1. Brad Frost 『Atomic Design』 2장 · 4장

- URL: https://atomicdesign.bradfrost.com/chapter-2/ · https://atomicdesign.bradfrost.com/chapter-4/
- 1: 부품을 다섯 층으로 나눈다. 원자(라벨 · 입력 · 버튼처럼 더 쪼개면 기능이 없어지는 것), 분자(원자 몇 개가 한 단위로 일하는 것, 검색 폼), 유기체(분자 · 원자 · 다른 유기체가 모인 구역, 머리), 템플릿, 페이지.
- 2: 인터페이스 인벤토리로 시작한다. 모든 직군이 모여 고유한 패턴마다 화면 캡처를 하나씩만 모은다(첫 회 30–90분). 분류 예: 전역 요소 · 내비게이션 · 이미지 · 아이콘 · 폼 · 버튼 · 제목 · 블록 · 목록 · 상호작용 부품 · 미디어 · 메시지 · 색 · 움직임. 모은 뒤 무엇을 남기고 버리고 합칠지 작업 모임이 정한다. 합치는 수치 기준은 주지 않는다. 브라우저 작업은 머리(header)부터 권한다.
- 4: 템플릿은 부품을 레이아웃에 놓는 페이지 수준 물건이고 내용 구조(이미지 크기 · 글 길이)를 드러낸다. 페이지는 템플릿에 실제 내용을 넣은 한 사례다.
- 5: 층 구분이 곧 기준이다. 레이아웃 뼈대는 템플릿, 실제 내용이 든 것은 페이지.
- 원문: "page-level objects that place components into a layout" · "capture one instance of each unique UI pattern"

### 2. IBM Carbon — 2x Grid

- URL: https://carbondesignsystem.com/elements/2x-grid/overview/
- 3: 기본 단위는 8px 정사각형(mini unit). 열 · 행 · 상자 · 여백 · 안쪽 여백이 모두 그 배수다. 고정 크기 눈금은 8 · 16 · 24 · 32 · 48 · 64 · 80 이고 아이콘 · 고정 상자 · 세로 간격에 쓴다. 부품도 같은 눈금을 써서 높이는 고정, 폭은 유동인 혼합형이 많다. 부품이 한 눈금을 함께 쓰면 격자 관계가 저절로 맞는다고 적는다.
- 4: 중단점 다섯 개. Small 320(4열 · 여백 0) · Medium 672(8열 · 16) · Large 1056(16열 · 16) · X-Large 1312(16열 · 16) · Max 1584(16열 · 24). 거터는 넣을 때 32(상자 양쪽 16씩), 붙은 내용은 거터 없는 모드. 바깥 여백은 중단점 안에서 고정.
- 원문: "The basic unit of 2x Grid geometry is the 8-pixel square mini unit."

### 3. GitHub Primer — PageLayout

- URL: https://primer.style/product/components/page-layout/
- 4: 페이지 틀 자체가 부품이다. 영역은 Header · Content · Pane · Footer 이고 전체 높이를 쓰는 Sidebar 가 따로 있다. Pane 폭은 small · medium(기본) · large 세 단계 또는 min · max · default 를 준 사용자 값(최소 폭 기본 256). 그릇 폭 `containerWidth` 는 full · medium · large · xlarge(기본). 바깥 여백 · 열 간격 · 행 간격은 none · condensed · normal 세 단계. 영역마다 구분선 none · line, 중단점(narrow · regular · wide)마다 숨김 · 위치를 준다. 768 아래에서 Sidebar 는 전체 화면 덮개로 바뀔 수 있다. 단계 이름의 px 값은 이 쪽에 없어 「미확인」.
- 원문: "PageLayout defines the header, main, pane, and footer areas of a page."

### 4. GOV.UK Design System — Layout

- URL: https://design-system.service.gov.uk/styles/layout/
- 4: 페이지 최대 폭 기본 1020px(내용이 필요하면 넓힘). 그릇 클래스 `govuk-width-container` 와 `govuk-main-wrapper` 두 겹. 열은 분수 클래스(one-third · two-thirds 등). 대부분 쪽에 「3분의 2」 또는 「3분의 2 + 3분의 1」 을 권하고 본문은 늘 3분의 2 열에 둔다. 이유는 줄 길이로, 보통 한 줄 75자 이하. 작은 화면 한 열부터 설계한다.
- 원문: "The default maximum page width is 1020px"

### 5. Radix Themes — Container

- URL: https://www.radix-ui.com/themes/docs/components/container
- 4: 그릇 최대 폭이 네 단계 부품 prop 이다. size 1 = 448 · 2 = 688 · 3 = 880 · 4 = 1136(기본). 값은 CSS 변수(`--container-1`–`4`)라 바꿀 수 있다.
- 원문: "Constrains the maximum width of page content."

### 6. Every Layout — The Sidebar

- URL: https://every-layout.dev/layouts/sidebar/
- 4: 「사이드바 + 본문」 을 레이아웃 원시 부품으로 둔다. 사이드바 폭은 `sideWidth`(예 20rem)로 주거나 내용 폭에 맡기고, 본문은 `contentMin`(기본 50%) 아래로 줄면 사이드바 밑으로 내려간다. 화면 폭 중단점이 아니라 그릇 기준이다. 50% 인 까닭은 더 좁은 쪽이 아니면 사이드바가 아니기 때문.
- 원문: "Generally, we should err on the side of intrinsic sizing"

### 7. Android Developers(Material 3 창 크기 등급 · 정형 레이아웃)

- URL: https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes · https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts
- m3.material.io 원문 쪽은 404 · 스크립트 렌더라 열지 못했다(미확인). 같은 내용을 싣고 Material 지침에서 왔다고 밝힌 Android 공식 문서로 확인했다.
- 4: 폭 등급 다섯 개. Compact < 600dp · Medium 600–839 · Expanded 840–1199 · Large 1200–1599 · Extra-large ≥ 1600(데스크톱). 기기가 아니라 앱 창 크기로 정한다. 등급은 「어느 정형 레이아웃을 쓸지」 같은 큰 결정에 쓴다.
- 4: 정형 레이아웃 셋. 목록-상세(Expanded 부터 두 판 나란히, 그 아래는 한 판씩) · 피드(최소 칸 폭을 주고 들어가는 만큼 열, 예 180dp) · 보조 판(주 영역이 약 3분의 2, Medium 은 50:50, Expanded 는 70:30). 각각 `ListDetailPaneScaffold` · `SupportingPaneScaffold` 라는 부품으로 제공된다.
- 5: 목록-상세와 보조 판의 차이는 내용 관계다. 보조 판 내용은 주 내용 없이는 뜻이 없고, 상세 판 내용은 혼자서도 뜻이 있다.
- 원문: "Canonical layouts are proven, versatile layouts"

### 8. Atlassian Design System — Grid · Layout

- URL: https://atlassian.design/foundations/grid/ · https://atlassian.design/components/navigation-system/layout/usage
- 4: 그리드는 본문(main) 영역 안에만 적용하고 내비게이션 · 패널은 레이아웃 부품이 맡는다. 열 2(xxs 320–479) · 6(xs 480–767, s 768–1023) · 12(m 1024–1439, l 1440–1767, xl 1768+). 거터 12(모바일 · 태블릿) · 16(데스크톱), 여백 16 · 32. 중단점은 본문 폭이 아니라 뷰포트 폭 기준이라 사이드 내비를 접어도 안 바뀐다.
- 4: 그릇 최대 폭 세 가지. fixed-wide 1296(기본, 대시보드 · 목록 · 검색 결과) · fixed-narrow 864(긴 글) · fluid(제한 없음, 칸반 · 화이트보드, 아껴 씀). 최대 폭 아래에서는 고정 그리드도 유동처럼 움직인다.
- 4: 레이아웃 부품의 영역은 banner · top nav · side nav · main · panel. side nav 와 panel 은 크기 조절 · 접기가 되고 1024 이하에서 panel 은 덮개가 된다. 영역 폭 px 는 이 쪽에 없어 미확인.
- 원문: "Expands to fill available space."

### 9. Microsoft Fluent 2 — Layout

- URL: https://fluent2.microsoft.design/layout
- 3: 간격 기본 단위 4px, 눈금은 0–56(size560). 2 · 6 · 10 은 아이콘을 4px 격자에 맞추려는 값. 최소 터치 영역 웹 · iOS 44×44, Android 48×48.
- 4: 그리드는 열 · 거터 · 여백과 그것을 묶는 region 으로 이룬다. 12열이 흔하다. 크기 등급 여섯 개: small 320–479 · medium 480–639 · large 640–1023 · x-large 1024–1365 · xx-large 1366–1919 · xxx-large 1920+. 반응 기법 다섯: reposition · resize · reflow · show/hide · re-architect.
- 원문: "The base unit is four pixels"

### 10. GitHub Primer — Layout foundations

- URL: https://primer.style/product/getting-started/foundations/layout/
- 4: 중단점 xsmall 320 · small 544 · medium 768 · large 1012 · xlarge 1280 · xxlarge 1400. 뷰포트 범위 narrow < 768(한 열) · regular ≥ 768(두 열까지) · wide ≥ 1400(세 열까지, 선택).
- 4: 페이지 종류를 셋으로 고정한다. 전체 페이지(내용과 pane 이 가운데, 최대 폭 xlarge 1280 — 문단 줄이 너무 길어지지 않게) · 분할 페이지(pane 이 왼쪽에 붙고 따로 스크롤, 사이드 내비 · 필터 · 목록-상세용, 본문은 최대 폭을 둘 수 있고 가운데) · 중간 페이지(로그인 · 인증 · 대기, 보통 xsmall 320). 안쪽 여백은 xsmall–large 16, xlarge 부터 본문 24 · pane 16. 좁은 화면에서 pane 은 별도 쪽 · 아래 시트 · 위아래 쌓기 중 하나.
- 원문(3번 항목과 같은 체계): breakpoints 는 "a unit in a ruler"

### 11. Shopify Polaris — Page

- URL: https://shopify.dev/docs/api/app-home/polaris-web-components/structure/page (옛 polaris-react.shopify.com 은 여기로 넘어감)
- 4: 페이지 폭이 Page 부품의 prop 하나다. `inlineSize` small(폼 · 단순 흐름) · base(기본, 일반 쪽) · large(대시보드 · 데이터 많은 쪽). `aside` 슬롯은 base 일 때만 그려진다. px 값은 쪽에 없어 미확인.
- 원문: "corresponds to a set default inline size"

### 12. Apple Human Interface Guidelines — Layout

- URL: https://developer.apple.com/design/human-interface-guidelines/layout (본문은 같은 쪽의 JSON 데이터로 읽음)
- 4: 크기 등급은 가로 · 세로 각각 compact · regular 두 개뿐이고 기기가 아니라 창 · 멀티태스킹 상태로 정해진다. 시스템이 주는 안전 영역 · 여백 · 가이드를 지키라고 한다. 가장 큰 레이아웃과 가장 작은 레이아웃부터 시험한다.
- 5: 정렬은 관계를, 들여쓰기는 종속을 뜻한다. 관련 항목은 빈 공간 · 그릇 모양 · 구분선으로 묶는다.
- 원문: "Design a layout that adapts gracefully and consistently."

### 13. Nathan Curtis(EightShapes) — Component Specifications

- URL: https://nathanacurtis.substack.com/p/component-specifications-1492ca4c94c (Medium 원문은 403, 같은 글의 저자 Substack 판으로 확인)
- 1: 규격 문서는 부품 하나에 한 쪽. 절은 해부도 · 속성 · 레이아웃과 간격 · 동작(애니메이션) · 접근성 · 부품 토큰 · 버전 기록. 해부도는 부품을 조각으로 나눠 하나씩 이름을 붙인다. 속성 절은 기본값과 다른 선택지를 나란히 보여 준다. 레이아웃 절은 안쪽 여백 · 항목 간격 · 방향을 그린다. 상태는 따로 절을 두지 않고 동작 절에서 이벤트와 함께 다룬다. 부품 토큰 절은 부품 수준의 토큰 모형과 덮어쓰기를 적는다.
- 원문: "An anatomy breaks down a component into parts, itemizes and names each one"

### 14. Nathan Curtis — Size in Design Systems

- URL: https://nathanacurtis.substack.com/p/size-in-design-systems-64f234aec519
- 1 · 3: 크기 단계는 둘, 많아야 셋(small · medium 기본 · large). XS · XL 같은 촘촘한 단계나 연속 눈금은 유지가 어렵다고 본다. 티셔츠 이름은 크기 단계에만 쓰고 폭 하나만 바꾸는 선택지에는 값을 그대로 쓴다(예 `modal--width-500`).
- 3: 핵심 부품(버튼 · 입력 · 선택 등)의 높이를 단계마다 하나로 맞추는 것이 목표. 높이는 글자 크기 · 줄 높이 · 안쪽 여백 · 테두리의 합으로 나오니, 감사(audit)에서 단계별 목표 높이를 정하고 글자와 여백을 조정한다. 값은 공용 토큰 · 믹스인에 두고 부품마다 덮어쓴다(테두리만큼 세로 여백 줄이기). 아이콘 크기는 부품 크기에 짝짓는다(small · medium 버튼은 작은 아이콘, large 는 중간 아이콘).
- 1: 부품 목적에 따라 단계를 고른다. 알림은 medium · large 만, 태그는 small · medium 만.
- 원문: "A component library likely requires two or (at most) three sizes."

### 15. Nathan Curtis — Space in Design Systems

- URL: https://nathanacurtis.substack.com/p/space-in-design-systems-188bcbae0d62
- 3: 간격을 쓰임새로 나눈다. inset(사방 같은 안쪽 여백) · squish inset(위아래를 50% 줄임, 버튼 · 표 칸 · 목록 항목) · stretch inset(입력칸) · stack(세로 쌓기) · inline(가로 나열) · grid. 눈금은 16 을 바탕으로 두 배씩(2 · 4 · 8 · 16 · 32 · 64), 이름은 티셔츠(기본 M).
- 4: 그리드는 간격 체계 전체가 아니라 간격을 쓰는 부품 하나로 본다. 그래서 여백 · 거터 값이 부품 간격 눈금과 같아야 한다.
- 원문 요지: 그리드 값은 라이브러리 전체 간격과 맞춘다(짧은 직접 인용은 확보하지 못함).

### 16. SmartHR Design System — ページレイアウト

- URL: https://smarthr.design/products/design-patterns/page-layout/
- 4 · 5: 페이지 틀을 「디자인 패턴」 으로 둔다(부품 목록과 별도 구역). 일곱 가지: 컬렉션(표) · 컬렉션(목록) · 싱글 1열 · 싱글 2열 · Panel 이 있는 제목 영역 · 사이드 내비게이션 + 내용 2열 · 컬렉션 + 싱글 2열. 틀마다 언제 쓰는지 적는다(정보가 모두 나란하면 1열, 양 · 중요도 차가 크면 2열, 대상을 자주 바꾸면 컬렉션 + 싱글).
- 4: 싱글 2열은 주 정보 영역이 부 정보 영역의 2배 이상. 그릇 폭은 Container 부품의 `size` prop 으로 준다. 표 · 2열 틀은 모바일에 맞지 않아 목록 · 1열 · 쪽 나누기로 바꾼다.
- 원문: "主情報を表示する領域の横幅は副情報を表示する領域の横幅の2倍以上"

### 17. GOV.UK Design System — Contribution criteria

- URL: https://design-system.service.gov.uk/community/contribution-criteria/
- 5: 공용으로 올리는 기준 다섯. 제안 단계에 Useful(여러 팀 · 서비스에 쓸모 있다는 증거) · Unique(이미 있는 것을 되풀이하지 않음, 바꾸려면 더 낫다는 증거). 공개 전에 Usable(사용자 조사) · Consistent(기존 스타일 · 부품 재사용) · Versatile(여러 서비스에서 쓸 수 있음).
- 원문: "It does not replicate something already in the Design System."

### 18. IBM Carbon — Patterns overview · Button style

- URL: https://carbondesignsystem.com/patterns/overview/ · https://carbondesignsystem.com/components/button/style/
- 5: 부품은 설계 · 코드가 끝나 바로 가져다 쓰는 것. 패턴은 부품 · 템플릿 · 흐름의 재사용 조합이고 사용자 요구를 푸는 길이 여럿이라 모든 경우의 코드를 주지 못한다.
- 1 · 3: 버튼 규격 쪽(Style 탭)은 크기 · 여백 · 아이콘 · 글자를 토큰 이름과 함께 표로 적는다. 높이 24(xs) · 32(sm) · 40(md) · 48(lg) · 64(xl) · 80(2xl), 모두 8의 배수. 좌우 여백 16(`$spacing-05`), 아이콘 16×16(expressive 20×20), 라벨 14px. 버튼 묶음에서 크기를 섞지 않는다.
- 원문: "reusable combinations of components, templates, flows, and sequences"

### 19. NN/g — Design Systems 101

- URL: https://www.nngroup.com/articles/design-systems-101/
- 1 · 5: 디자인 시스템 저장소는 스타일 가이드 · 부품 라이브러리 · 패턴 라이브러리로 이룬다. 부품은 단일 UI 요소로 이름 · 설명 · 속성 · 상태 · 코드를 적는다. 패턴은 부품을 묶은 더 큰 배치(페이지 머리)와 내용 구조 · 페이지 템플릿이다.
- 원문: "Style guides contain specific implementation guidelines, visual references, and design principles."

### 20. Adobe Spectrum — Design tokens

- URL: https://spectrum.adobe.com/page/design-tokens/
- 1: 토큰 세 층. 원시(값 자체, `blue-800`) · 의미(쓰임, `container-padding-medium`, 주로 쓰는 층) · 부품 전용(한 부품의 결정, `tooltip-maximum-width`). 부품 고유 폭 같은 값은 부품 전용 토큰에 두되 그 수를 적게 유지한다.
- 원문: "Component-specific tokens represent design decisions that apply to a specific component or implementation."

### 21. デジタル庁デザインシステム — レイアウト

- URL: https://design.digital.go.jp/dads/foundations/layout/
- 4: 12열 그리드. 2열 예시 비율 9+3 · 3+9 · 8+4 · 4+8 · 6+6. 열 폭은 본문 글자 크기의 정수배, 거터는 원칙으로 본문 글자 크기의 2배. 중단점 768(미만 모바일 · 태블릿, 이상 데스크톱). 메뉴 영역은 고정 폭 · 가변 폭 둘 다 가능. 본문 최대 폭 · 사이드바 폭 수치는 없음.
- 원문: "本文の文字サイズの整数倍"

### 22. Vercel Geist — Grid

- URL: https://vercel.com/geist/grid
- 4: Grid 는 안내선이 보이는 칸 배치용 부품(마케팅 · 문서 첫 쪽)이고, 일반 카드 · 목록 배치는 Tailwind grid 유틸리티를 쓰라고 한다. 열 · 행은 sm · md · lg 세 중단점에 모두 준다. 페이지 폭 · 중단점 px 는 쪽에 없음(미확인).
- 원문: "Display elements in a grid layout."

### 23. SmartHR Design System — Container

- URL: https://smarthr.design/products/components/layout/container/
- 4: 그릇 폭이 부품 prop 네 단계이고 단계마다 쓰는 화면이 정해져 있다. NARROW 880(`col6`, 폼 중심 화면) · DEFAULT 1184(`col8`, 컬렉션 · 싱글 표준, 이유가 없으면 이것) · WIDE 1336(`col9`, 여러 열 틀: 사이드 내비 + 내용, 컬렉션 + 싱글, 싱글 2열) · FULL 100%(가로 스크롤이 필요한 대량 데이터). 폭 값은 열 수 토큰에서 나온다.
- 원문: 단계 이름과 값 표(NARROW `col6` 880px 등)

### 24. GitHub Primer — SplitPageLayout

- URL: https://primer.style/product/components/split-page-layout/
- 4: 본문 + 사이드바 두 열 틀을 PageLayout 과 별도 부품으로 둔다. pane 폭은 small · medium(기본) · large 또는 `{min, max, default}`, 최소 폭 기본 256. pane 은 기본으로 sticky, 사용자가 폭을 조절하는 기능은 기본 꺼짐(켜면 localStorage 에 저장). 단계 이름의 px 는 쪽에 없어 미확인.
- 원문: "The minimum width of the pane."

### 25. IBM Carbon — UI shell left panel(Style)

- URL: https://carbondesignsystem.com/components/UI-shell-left-panel/style/ · https://carbondesignsystem.com/components/UI-shell-header/usage/
- 4: 셸(머리 · 왼쪽 패널 · 오른쪽 패널)은 따로 써도 되지만 함께 쓰도록 만든 부품 묶음이다. 왼쪽 패널 폭 256px(16rem) 고정, 창 왼쪽 끝에 붙는다. 항목 높이 32px. 머리 높이 · 레일 폭은 연 쪽에 없어 미확인.
- 원문: "fixed to the left edge of the window"

### 26. Nathan Curtis — Picking Parts, Products & People

- URL: https://nathanacurtis.substack.com/p/picking-parts-products-people-a06721e81742
- 2: 무엇부터 만들지는 팀이 표로 정한다. 각자 중요한 부품을 25개까지 고르고 가장 중요한 것에 표시, 부품마다 들일 노력을 매긴다. 팀에서 뜻이 모이는 것을 먼저 하고 한두 명만 고른 것은 경계로 두고 논의한다. 제품도 주력(최대 4) · 그다음(4)으로 등급을 나눠 주력 제품에 맞춘다. 「몇 곳 이상 쓰면 공용」 같은 수치 기준은 없다.
- 원문: "Check up to 25 important parts for your system."

### 27. Brad Frost — Interface Inventory(블로그)

- URL: https://bradfrost.com/blog/post/interface-inventory/
- 2: 내용 감사처럼 인터페이스 조각을 모은다. 부품 종류마다 칸을 둔 틀에 서로 다른 판만 캡처해 변형을 나란히 놓는다. 그러면 거의 같은 것이 얼마나 많은지와, 의도한 변형과 우연한 불일치가 갈린다. 그 목록이 패턴 라이브러리의 바탕이 된다.
- 원문: "comprehensive collection of the bits and pieces"

### 28. Atlassian Design System — Spacing

- URL: https://atlassian.design/foundations/spacing/
- 3: 기본 단위 8px, 토큰 `space.0`–`space.1000`(0–80px). 범위로 쓰임을 나눈다. 0–8 은 촘촘한 부품 안(아이콘과 글 사이, 입력 여백), 12–24 는 덜 촘촘한 부품(버튼 여백), 32–80 은 레이아웃. 부품 안과 페이지 구조가 같은 눈금의 다른 구간을 쓴다.
- 원문: "a base unit of 8 pixels"

### 29. Radix Themes — Layout

- URL: https://www.radix-ui.com/themes/docs/overview/layout
- 4 · 5: 레이아웃 전용 부품 다섯(Box · Flex · Grid · Section · Container)을 내용 부품과 따로 둔다. Section 은 페이지 큰 구역 사이 세로 간격을 미리 정한 몇 단계로, Container 는 최대 폭을 미리 정한 단계로 준다.
- 원문: "Layout components are used to separate layout responsibilities from content and interactivity."

### 30. 당근 SEED Design — Action Button

- URL: https://seed-design.io/docs/components/action-button
- 1: 부품 문서가 variant(7종) · size(XSmall · Small · Medium · Large 4단계) · state(Enabled · Pressed · Loading · Disabled) 축으로 짜여 있고 값은 px 가 아니라 토큰으로 적는다. 크기마다 최소 높이(`$dimension.x8` · `x9` · `x10` · `x13`) · 모서리 · 글자 크기 토큰이 한 줄로 묶인다. 함께 쓰면 안 되는 조합(Solid 와 Outline, 앞 아이콘과 뒤 아이콘)도 적는다.
- 3: 높이가 공용 치수 눈금(`$dimension.*`)에서 나온다.
- 원문: "총 7가지 Variant로 구성됩니다."

### 31. Material Web(Material 3 구현) — Button 문서

- URL: https://github.com/material-components/material-web/blob/main/docs/components/button.md
- 1: 변형마다 부품 토큰 표를 둔다(`--md-elevated-button-container-color` 기본값 `--md-sys-color-surface`). 부품 토큰이 시스템 토큰을 가리키는 두 층 구조이고 전체 목록은 `tokens/_md-comp-*.scss` 에 있다. 변형은 다섯(elevated · filled · filled tonal · outlined · text).
- 원문: "There are five types of common buttons"

### 미확인(세지 않음)

- m3.material.io 원문(window size classes · canonical layouts): 404 · 스크립트 렌더. Android 공식 문서로 대신 확인(7번).
- Medium 의 EightShapes 원문: 403. 저자 Substack 판으로 확인(13–15 · 26번).
- Salesforce Lightning Design System 2 레이아웃: 색인만 열리고 본문 없음.
- LINE Design System 레이아웃: 403.
- 토스 TDS: 공개 문서는 부품 11개 목록뿐, 규격 · 레이아웃 내용 없음.
- Refactoring UI: 유료 책이라 열지 않음.
- Every Layout 의 Center(읽기 폭): 유료 쪽.
- Primer pane 단계 px · Polaris Page 단계 px · Atlassian 사이드 내비 폭 · Carbon 머리 높이: 연 쪽에 수치 없음.

### 정리

확인한 곳은 조직 · 저자 기준 19곳(항목 31개): Brad Frost · Nathan Curtis · Carbon · Primer · GOV.UK · Radix Themes · Every Layout · Android/Material 3 · Material Web · Atlassian · Fluent 2 · Polaris · Apple HIG · SmartHR · NN/g · Spectrum · デジタル庁 · Geist · 당근 SEED.

#### 질문 1 — 부품 정의

- 공통: 규격은 부품 하나에 한 쪽이고, 축은 해부도(조각 이름) · 변형 · 크기 단계 · 상태 · 간격 그림 · 토큰이다(Curtis · Carbon · SEED · Material Web · NN/g). 값은 px 가 아니라 토큰 이름으로 적는다(Carbon · SEED · Material Web). 토큰은 원시 → 의미 → 부품 전용 층이고 부품 고유 값(예 최대 폭)은 부품 전용 토큰에 둔다(Spectrum · Material Web · Curtis).
- 갈림: 크기 단계 수. Curtis 는 2–3개, SEED 는 4개, Carbon 버튼은 6개. 부품 전용 토큰의 양도 갈린다. Spectrum 은 적게, Material 은 변형마다 표 전체. 상태를 따로 절로 두는 곳(SEED)과 동작 절에 넣는 곳(Curtis).

#### 질문 2 — 만드는 순서

- 공통: 먼저 기존 화면을 캡처해 종류별로 나란히 놓는 인벤토리를 한다. 서로 다른 판만 하나씩 모으고, 남길 것 · 버릴 것 · 합칠 것을 정한다(Brad Frost 두 글). 우선순위는 팀이 중요하다고 뜻이 모인 것, 주력 화면이 쓰는 것부터다(Curtis).
- 갈림: 「원자부터」 인지 「많이 쓰는 것부터」 인지 수치로 정한 자료는 없다. Atomic Design 은 층 이름을 주지만 실제 작업은 머리(header) 같은 눈에 띄는 구역부터 권한다. 합치는 수치 기준도 없다(근거 약함).

#### 질문 3 — 맞물리는 크기

- 공통: 바탕 단위 하나(4 또는 8)의 배수로 높이 · 여백 · 아이콘을 정한다(Carbon 8 · Atlassian 8 · Fluent 4 · Curtis 16 을 두 배씩). 컨트롤 높이는 크기 단계마다 핵심 부품이 같은 값을 쓰게 목표를 먼저 정하고 글자 · 여백을 거기에 맞춘다(Curtis, Carbon 24 · 32 · 40 · 48, SEED 의 `$dimension`). 아이콘 크기는 부품 크기 단계에 짝짓는다(Curtis · Carbon 16 · 20). 한 묶음 안에서 크기를 섞지 않는다(Carbon).
- 갈림: 바탕이 4 인지 8 인지, 눈금이 선형인지 두 배씩인지. 부품 안 간격과 레이아웃 간격을 같은 눈금의 다른 구간으로 쓰는 곳(Atlassian)과 따로 말하지 않는 곳.

#### 질문 4 — 레이아웃 체계

- 공통: 그릇 최대 폭을 2–4단계로 이름 붙여 부품 prop 으로 주고 단계마다 쓰는 화면 종류를 정한다. Radix 448 · 688 · 880 · 1136, SmartHR 880 · 1184 · 1336 · 100%, Atlassian 864 · 1296 · fluid, Primer 320 · 1280, GOV.UK 1020, Polaris small · base · large. 좁은 단계는 폼 · 긴 글, 기본 단계는 목록 · 상세, 넓은 단계는 여러 열 · 대시보드다. 페이지 틀은 부품(Primer PageLayout · SplitPageLayout, Atlassian Layout, Carbon UI shell, Material 의 Scaffold) 또는 패턴(SmartHR 일곱 틀, Material 정형 레이아웃 셋)으로 이름을 붙여 둔다. 사이드바는 고정 폭, 본문은 남는 폭을 채우되 최대 폭을 두고 가운데 놓는다(Primer · Atlassian · Carbon). 확인된 사이드바 값은 256(Carbon 패널 폭, Primer pane 최소 폭). 읽기 폭은 줄 길이로 정한다(GOV.UK 75자, 본문은 3분의 2 열).
- 갈림: 열 수(Carbon 16 · Atlassian · Fluent · デジタル庁 12), 중단점 값과 개수(2–6개), 사이드바 폭을 값 하나로 고정(Carbon)할지 단계 + 사용자 조절(Primer · Atlassian)로 둘지, 비율로 둘지(Material 70:30, SmartHR 2배 이상, GOV.UK 2:1), 화면 폭 중단점(대부분)인지 그릇 기준 내재 크기(Every Layout)인지. 그리드를 본문 안에만 적용(Atlassian)하는지 페이지 전체에 적용(Carbon)하는지.

#### 질문 5 — 패턴 · 부품 · 화면 고유

- 공통: 부품은 설계 · 코드가 끝난 단일 요소, 패턴은 부품 · 템플릿 · 흐름의 조합으로 푸는 길이 여럿이라 지침으로 둔다(Carbon · NN/g · SmartHR). 레이아웃 뼈대는 템플릿, 실제 내용이 든 것은 페이지(Atomic Design). 레이아웃 부품은 내용 부품과 따로 둔다(Radix). 공용으로 올리는 기준은 여러 곳에서 쓰인다는 증거와 기존 것과 겹치지 않음이다(GOV.UK 의 Useful · Unique · Usable · Consistent · Versatile).
- 갈림: 페이지 틀을 부품으로 둘지(Primer · Atlassian · Carbon) 패턴으로 둘지(SmartHR · Material 지침). 「몇 화면 이상」 같은 수치 기준을 적은 자료는 없다(근거 약함).

## Figma 를 디자인 시스템 용도로 쓰는 방법 조사

확인한 날짜는 모두 2026-11-11. 페이지를 실제로 열어 읽은 곳만 번호를 붙여 센다. 열지 못한 곳은 맨 아래 「미확인」 에 둔다.
질문 번호: 1 변수 · 2 스타일과 변수 · 3 컴포넌트 · 4 오토 레이아웃 · 격자 · 5 기존 화면 맞추기 · 6 게시 · 버전 · 브랜치.

### 확인한 곳

#### 1. Figma Help — Overview of variables, collections, and modes

- URL: https://help.figma.com/hc/en-us/articles/14506821864087-Overview-of-variables-collections-and-modes
- 문서 날짜: 페이지에 표시 없음
- 질문 1: 변수 종류는 색 · 숫자 · 문자열 · 불리언(문서에는 timing · easing 도 올라 있다). 컬렉션은 변수와 모드의 묶음이고 용도별로 나눈다(문구 컬렉션, 공간 값 컬렉션). 컬렉션 안에서는 그룹으로 더 나눈다. 모드는 변수 하나에 맥락별 값 하나씩(라이트 · 다크, 언어, 기기 크기). 같은 종류 변수끼리 참조(별칭)할 수 있고 이것이 디자인 토큰 층을 만든다.
- 원문: "A collection is a set of variables and modes."

#### 2. Figma Help — Create and manage variables

- URL: https://help.figma.com/hc/en-us/articles/15145852043927-Create-and-manage-variables
- 문서 날짜: 표시 없음
- 질문 1: 컬렉션 하나에 변수 5,000개까지. 그룹은 중첩할 수 있다. 값 칸에서 「Create alias」 로 별칭을 건다. 범위(scoping)는 숫자(오토 레이아웃 gap · padding, 모서리, 글자 속성, 투명도, 효과, 선, 폭 · 높이), 색(효과 · 프레임 채움 · 도형 채움 · 선 · 글자 채움), 문자열(글꼴 · 굵기 · 글 내용)로 나뉜다. 코드 문법은 변수마다 Web · Android · iOS 이름 하나씩이고 Dev Mode 코드에 나온다. 변수를 게시에서 숨길 수 있고, 설명 칸에 쓰임을 적는다.
- 원문: "Scope a variable to limit which properties the variable can be applied to."

#### 3. Figma Help — Modes for variables

- URL: https://help.figma.com/hc/en-us/articles/15343816063383
- 문서 날짜: 표시 없음
- 질문 1: 모드는 레이어 · 프레임 · 컴포넌트 · 섹션 · 페이지에 건다. 기본은 Auto 로 가장 가까운 부모의 모드를 물려받고, 부모에 없으면 컬렉션의 기본 모드(맨 왼쪽 열)를 쓴다. 명시적으로 건 모드는 기본 모드가 바뀌어도 그대로 남는다. 쓰임 예는 색 테마, 언어, 기기 크기별 간격. 모드 수는 요금제에 따라 다르다.
- 질문 5: 다크만 쓰는 파일이라면 다크를 맨 왼쪽(기본) 모드로 두면 화면마다 모드를 걸지 않아도 된다(문서의 기본 모드 규칙에서 따라 나오는 내용).
- 원문: "Objects with variables have their modes set to Auto by default."

#### 4. Figma Help — The difference between variables and styles

- URL: https://help.figma.com/hc/en-us/articles/15871097384471
- 문서 날짜: 표시 없음
- 질문 2: 스타일은 여러 속성을 한 번에 입히는 묶음(글꼴 · 크기 · 굵기를 함께, 그라데이션, 겹친 채움). 변수는 값 하나이고 모드마다 값이 다르다. 변수는 별칭과 범위가 있고 스타일에는 없다. 스타일은 없어지지 않으며 변수가 스타일을 대신하지 않는다. 둘을 함께 쓴다 — 스타일 안의 값을 변수로 채운다.
- 원문: "Styles don't support aliasing."

#### 5. Figma Help — Extend a variable collection

- URL: https://help.figma.com/hc/en-us/articles/36346281624471
- 문서 날짜: 표시 없음(플러그인 API 변경 기록은 2025-11-20 에 ExtendedVariableCollection 을 올렸다 — 검색 결과로만 확인)
- 질문 1 · 2: 확장 컬렉션은 부모 컬렉션에 연결된 사본으로 브랜드마다 값만 덮어쓴다. 변수 · 모드를 더하거나 설명 · 범위를 바꾸는 일은 부모에서만 한다. Enterprise(와 교육 · 정부) 요금제 전용이다. 브랜드가 하나인 파일에는 필요 없다.
- 원문: "Extended collections help you manage multi-brand design systems."

#### 6. Figma Help — Create and use variants

- URL: https://help.figma.com/hc/en-us/articles/360056440594-Create-and-use-variants
- 문서 날짜: 표시 없음
- 질문 3: 변형은 거의 같고 상태 · 크기 · 색 모드만 다른 컴포넌트를 한 묶음(component set)에 넣는 것. 상태(default · hover · pressed · disabled)는 state 속성의 값으로 둔다. 슬래시 이름(`Button/Primary/Large`)을 합치면 첫 마디가 묶음 이름, 뒤 마디가 속성 값이 된다. 「Property 1」 같은 기본 이름은 뜻 있는 이름으로 바꾼다. 묶음 안에는 컴포넌트만 들어가고(글 · 주석 프레임 못 넣음), 왼쪽 위 변형이 기본이다. 서로 다른 아이콘을 변형으로 묶지 않는다. 묶음이 크면 인스턴스 하나를 넣을 때 모든 변형이 불려 와 느려진다.
- 원문: "Component sets can only contain components"

#### 7. Figma Help — Explore component properties

- URL: https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties
- 문서 날짜: 표시 없음(본문에 2026-03-23 폐기 일정이 적혀 있다)
- 질문 3: 속성은 variant · boolean(레이어 보이기만) · instance swap(기본 인스턴스 + preferred 목록) · text · slot 다섯 가지. 중첩 인스턴스의 속성은 「expose」 로 위 인스턴스 패널에 올린다. preferred 는 바꿔 끼울 후보를 줄인 목록(아이콘 100개 중 8개). simplified instances 는 2026-03-23 부터 폐기되어 모든 속성 · 레이어가 기본으로 보인다. 속성을 들이기 전에 지금 시스템에서 무엇을 변형으로, 무엇을 속성으로 둘지 먼저 검토하라고 한다.
- 원문: "Simplified instances will be deprecated starting on March 23, 2026"

#### 8. Figma Help — Use slots to build flexible components

- URL: https://help.figma.com/hc/en-us/articles/38231200344599
- 문서 날짜: 표시 없음(플러그인 API 변경 기록 2026-06-10 이 GA 를 알린다 — 검색 결과로만 확인. Schema 2025 글에서는 조기 접근 신청 단계였다)
- 질문 3: 슬롯은 메인 컴포넌트 안에 두는 자유 영역으로, 인스턴스에서 떼지 않고 내용을 더하고 줄 세운다. 되풀이 항목(목록 · 탭 · 폼 칸), 카드 · 모달 같은 자유 배치, 변형 수와 숨긴 레이어 줄이기에 쓴다. 컴포넌트 맨 위 레이어에는 못 걸고, 슬롯 안 레이어에는 컴포넌트 속성을 못 건다. 슬롯 속성을 지우면 인스턴스에 넣은 내용이 사라지므로 브랜치에서 먼저 해 보라고 한다. 모든 요금제에서 쓴다.
- 질문 4: 페이지 틀(헤더 · 사이드바 · 본문)을 컴포넌트로 두고 본문 자리를 슬롯으로 비우는 구성이 이 기능으로 가능해졌다(문서의 카드 · 모달 예와 같은 원리).
- 원문: "You cannot bind a slot property to the top level layer of a component."

#### 9. Figma Help — Check designs in Figma

- URL: https://help.figma.com/hc/en-us/articles/39592284074263-Check-designs-in-Figma
- 문서 날짜: 표시 없음
- 질문 5: 날값 색 · 글자 스타일 · 모서리 · 간격 · 패딩을 찾아 변수 · 스타일 후보를 낸다. 값이 꼭 같으면 「Match」. 순위는 값의 가까움 · 변수 이름과 층 · 쓰인 횟수로 정한다. 엉뚱한 라이브러리의 컴포넌트 · 변수 · 스타일도 잡는다. 컴포넌트는 알리기만 하고 바꾸기는 손으로 한다. 한 번에 한 페이지, 선택은 2만 5천 레이어까지. 색 스타일로는 못 바꾸고 변수로만 묶는다. 생성 AI 를 쓰지 않는다. Organization · Enterprise(와 교육 · 정부) 요금제.
- 질문 1: primitive 를 숨기고 변수 범위를 좁혀 두면 후보가 정확해진다 — 범위 설정이 검사 품질을 좌우한다.
- 원문: "Check designs only runs on one page at a time."

#### 10. Figma Blog — Schema 2025: Design systems for a new era

- URL: https://www.figma.com/blog/schema-2025-design-systems-recap/
- 문서 날짜: 2025-10-28
- 질문 1 · 2: 확장 컬렉션은 2025-11 예정, 변수 가져오기 · 내보내기와 변수 편집 개선도 2025-11 예정으로 발표. 모드 수 상한을 올렸다(Professional 10 · Organization 20).
- 질문 3: 슬롯은 조기 접근 신청 단계로 발표.
- 질문 5: Check designs(린터)는 Organization · Enterprise full seat 조기 접근으로 발표.
- 질문 6: Code Connect UI 는 Organization · Enterprise 에 배포 중, MCP 서버는 모든 사용자에게.
- 원문: "Variables import and export will be available in November."

#### 11. Figma Help — Components collection: Tips for component management

- URL: https://help.figma.com/hc/en-us/articles/39747637290263-Components-collection-Tips-for-component-management
- 문서 날짜: 표시 없음(문서 번호로 보아 2026년 글)
- 질문 3: 이름 규칙(대소문자 · 줄임말 · 불리언 말투 · 값 이름)을 먼저 정한다. 모양이 아니라 무엇인지로 이름 짓고 코드 이름과 맞춘다. 슬래시 이름(`button/primary/hover`)으로 Assets 폴더가 생긴다. 변형은 모양 · 구조가 다른 상태(스타일 · 크기 · 인터랙션 상태)에, 속성은 내용 수준 변화(불리언 · 인스턴스 교체 · 글 · 슬롯)에 써서 변형 수를 불리지 않는다. 컴포넌트 설명 칸에 쓰임 · 제약 · 바깥 문서 링크를 적고, 잘못 쓰기 쉬운 부품은 do · don't 그림을 둔다. focus 를 포함한 모든 상태를 만든다.
- 질문 6: 속성을 지우거나 이름을 바꾸면 깨지는 변경, 숨김 기본값 속성을 더하면 안 깨지는 변경. 게시 전에 쓰는 파일에서 시험하고(Organization 이상은 브랜치), 변경 기록에 `[UPDATE]` · `[BREAKING]` · `[DEPRECATED]` 표시를 단다. 폐기는 대체 부품을 알리고 천천히 한다.
- 원문: "Use variants to handle visually or structurally distinct states."

#### 12. Figma Help — View and adjust colors in a mixed selection (Selection colors)

- URL: https://help.figma.com/hc/en-us/articles/360042553434
- 문서 날짜: 표시 없음
- 질문 5: 채움이 섞인 선택을 잡으면 오른쪽에 Selection colors 가 뜨고 색을 변수 · 스타일 · 날값으로 묶어 한 번씩 보여 준다. 날값 옆 Style 단추로 있는 변수 · 스타일을 입히면 그 색을 쓰는 레이어 전부가 바뀐다. 과녁 아이콘은 그 색을 쓰는 레이어를 모두 고른다. 이미지 · 패턴 · 영상 채움, 숨긴 채움, 마스크는 빠진다. 모든 요금제.
- 원문: "Figma groups colors by variable, style, and normal fills"

#### 13. Joey Banks — Baseline #17: Typography variables in Figma are here

- URL: https://buttondown.com/joeyabanks/archive/baseline-17-typography-variables-in-figma-are-here
- 문서 날짜: 2024-04-19
- 질문 2: 타이포 변수가 베타를 벗어났다. 변수는 값 하나(font-family 문자열, font-size · line-height · letter-spacing · font-weight 숫자)를 맡고, 글자 스타일은 그 변수들을 묶은 합성물로 계속 쓴다. 순서는 Typography 컬렉션을 만들고 → 글자 속성에 변수를 걸고 → 그 상태를 text style 로 저장. 스타일이 변수를 참조하므로 모드를 바꾸면 스타일이 따라 바뀐다.
- 질문 1: 크기 모드(desktop · mobile)와 브랜드 모드를 둔다. 한계는 line-height 에 % 를 못 넣는다는 것(당시 기준).
- 원문: "styles allow us to bundle all selected variables into one repeatable style"

#### 14. Joey Banks — Baseline #3: Base Components

- URL: https://buttondown.com/joeyabanks/archive/baseline-3-base-components/
- 문서 날짜: 2022-01-25
- 질문 3: base component 는 변형마다 안에 넣어 두는 뼈대로, 한 곳을 고치면 모든 변형에 퍼진다. 하지만 숨긴 레이어가 수십 개로 늘고 변형 설정과 레이어 상태가 어긋나 쓰는 사람이 헷갈린다. 지은이는 base 에 덜 기대고 변형마다 필요한 레이어만 넣는 쪽으로 옮겼다. 유지보다 쓰기 쉬움을 먼저 본다.
- 원문: "I'm no longer relying so heavily on base components"

#### 15. Figma — Simple Design System(SDS) 저장소 README

- URL: https://github.com/figma/sds
- 문서 날짜: 표시 없음(README 는 「alpha」 라고 적는다)
- 질문 1: Figma 변수 · 스타일을 REST 스크립트로 읽어 `src/theme.css` 로 만든다. 반대로 CSS 이름을 변수의 code syntax 에 써넣는 스크립트(`tokensCodeSyntaxes.js`)가 있다 — 코드 문법 칸을 CSS 변수 이름과 맞춰 두는 것이 공식 예시의 방식이다.
- 질문 3: 코드의 primitives(더 쪼갤 수 없는 부품)와 compositions(부품을 엮은 예시 쪽)가 Figma 컴포넌트와 짝을 이루고 Code Connect 로 묶는다. 컴포넌트 설명 · dev resource 를 스크립트로 한꺼번에 관리한다.
- 질문 4: 레이아웃 컴포넌트(`src/ui/layout`)는 코드에만 있고 Figma 짝이 없다 — 페이지 틀은 Figma 에서 오토 레이아웃 프레임으로 두었다는 뜻이다.
- 원문: "Gets all variables and styles from Figma, and converts them to src/theme.css."

#### 16. Luis Ouriach(Figma) — Building Components For Consumption, Not Complexity (Part 2), Smashing Magazine

- URL: https://www.smashingmagazine.com/2023/12/building-components-consumption-not-complexity-part2/
- 문서 날짜: 2023-12-18
- 질문 1: 의미(semantic) 변수를 컴포넌트에 입힌다. 컴포넌트 전용 토큰 층은 선택 사항이고 대부분 팀은 의미 묶음 하나면 된다.
- 질문 3: 속성을 너무 많이 달면 패널이 「prop soup」 가 된다. 의도 · 크기 · 상태를 한 컴포넌트에 다 넣지 말고 쓰임별로 쪼갠다(primary · secondary 버튼을 따로). 코드와 1 : 1 이 깨져도 문서로 메운다. 이름은 짧음보다 찾기 쉬움. 설명 칸에 검색될 별명을 적는다. Design Lint 플러그인으로 설명 없는 컴포넌트를 찾는다.
- 질문 4: 컴포넌트는 전부 오토 레이아웃으로 만들고 패딩 · gap 에 변수를 건다.
- 질문 6: 버전 기록과 브랜치 설명을 날짜 찍힌 작은 변경 문서로 쓴다.
- 원문: "Component-level tokens are an optional step in design systems."

#### 17. Figma Best Practices — Creating and organizing Variants

- URL: https://www.figma.com/best-practices/creating-and-organizing-variants/
- 문서 날짜: 표시 없음(변형이 나온 2020–2021 무렵 글, 속성 기능 이전 내용)
- 질문 3: 상태 · 크기 · 개수 · 배치처럼 속성을 나눠 갖는 것만 변형으로. 변형 속성은 코드 컴포넌트의 prop · 값과 맞춘다. 색 · 테마 조합처럼 가짓수가 곱으로 불어나면 변형으로 두지 않는다. 아이콘 종류는 변형이 아니라 중첩 인스턴스를 바꿔 끼운다. 묶음과 변형마다 설명을 적는다. 작은 묶음은 「Forms」 같은 넓은 페이지로 합친다.
- 원문: "Not everything needs to be a variant"

#### 18. Figma Help — Create layout guides(옛 이름 layout grid)

- URL: https://help.figma.com/hc/en-us/articles/360040450513
- 문서 날짜: 표시 없음(본문에 2025-05 이름 변경이 적혀 있다)
- 질문 4: 2025-05 에 layout grid 가 layout guide 로 이름이 바뀌었고 오토 레이아웃의 grid 와는 다른 기능이다. 종류는 균일 격자 · 열 · 행. 열 · 행은 고정(폭 + offset) 또는 stretch(여백 + gutter, 프레임 크기를 따라감). 격자를 스타일로 저장해 다른 프레임에 입힌다. 열 · 행 개수 칸에 변수를 걸 수 있다.
- 질문 2: 격자는 스타일로 둔다(변수는 개수 같은 값 하나만 맡는다).
- 원문: "has been renamed to \"layout guide\" as of May 2025"

#### 19. Figma Help — Use the grid auto layout flow

- URL: https://help.figma.com/hc/articles/31289469907863
- 문서 날짜: 표시 없음(Config 2025, 2025-05 에 나온 기능. 열어 본 본문에는 베타 표시가 없고 모든 요금제)
- 질문 4: 오토 레이아웃의 세 번째 흐름으로 행 · 열 칸에 레이어를 놓는다. 대시보드 · 벤토 · 표에 맞다. 트랙은 고정 · fill(fr) · hug 로 두고, 자식은 fill 로 둔 뒤 여러 칸에 걸친다(span). 맨 위 프레임은 fill 을 못 쓴다. min · max 는 다른 크기 설정 위에 덧붙이는 층이다. 변수 연결은 문서에 없다(미확인).
- 원문: "grid is great when you need a more structured or complex layout"

#### 20. Figma Help — Guide to auto layout

- URL: https://help.figma.com/hc/en-us/articles/360040451373
- 문서 날짜: 표시 없음
- 질문 4: 흐름은 세로 · 가로 · 격자. 크기는 hug(오토 레이아웃 프레임만) · fill(오토 레이아웃의 자식만) · fixed. 프레임과 자식에 min · max 폭 · 높이를 두고 그 칸에 숫자 변수를 건다. 화면 폭에 따라 바뀌는 웹 쪽은 오토 레이아웃 프레임을 중첩해 만든다. 흐름에서 빼는 것은 「Ignore auto layout」(옛 absolute position). 스크롤 내용을 자르려면 오토 레이아웃 프레임을 보통 프레임 안에 넣는다.
- 원문: "Fill container can be applied only to child objects of auto layout frames"

#### 21. Figma Help — Swap style and component libraries

- URL: https://help.figma.com/hc/en-us/articles/4404856784663
- 문서 날짜: 표시 없음
- 질문 5: 파일 안의 스타일 · 인스턴스 · 변수를 다른 게시 라이브러리의 같은 이름 자산으로 한꺼번에 바꾼다. 짝은 이름으로만 맞춘다(변형 포함). 안 맞은 자산은 그대로 남아 손으로 바꾼다. 두 라이브러리 모두 게시되어 있어야 하고 유료 요금제에서 쓴다. 「Swap default styles in instances」 를 켜면 맞은 스타일이 오버라이드로 남는다. 되돌리기는 Cmd+Z 나 같은 방법으로 거꾸로.
- 주의: 검색 결과에 잡힌 옛 문구는 「변수는 바꾸지 못한다」 였고, 2026-11-11 에 연 본문은 변수도 대상에 넣는다. 본문을 따랐다. 파일 하나 안의 로컬 자산끼리는 이 기능 대상이 아니다(다른 라이브러리의 자산이 있어야 한다).
- 원문: "Figma matches styles and components by name only."

#### 22. Figma Help — Publish a library

- URL: https://help.figma.com/hc/en-us/articles/360025508373
- 문서 날짜: 표시 없음
- 질문 6: 게시 대상은 스타일 · 컴포넌트 · 변수. 게시하지 않은 자산은 그 파일 안에서만 쓴다 — 파일 하나 안에서 쓰는 동안은 게시가 필요 없다. 게시할 때마다 변경 설명을 적고 이 글은 업데이트를 받는 쪽과 버전 기록에 보인다. 자산별로 「Hide when publishing」 을 켠다. 게시 창에서 이번에 내보낼 변경을 골라 뺄 수 있다. 게시는 Professional 이상.
- 원문: "you'll be prompted to add a description"

#### 23. Figma Best Practices — Branching in Figma

- URL: https://www.figma.com/best-practices/branching-in-figma/
- 문서 날짜: 표시 없음
- 질문 6: 메인 파일이 게시된 정본이고 브랜치는 라이브러리 유지 · 실험에 쓴다. 이름에 티켓 번호 · 작업 종류 같은 머리말을 붙인다. 보기 권한 사용자는 검토를 요청해야 병합된다. 병합한 브랜치는 보관되고 되살릴 수 없으며, 병합을 되돌리려면 버전 기록에서 옛 버전을 복원한다. 브랜치의 브랜치는 못 만들고, 브랜치에서는 게시하지 못하고, 댓글은 병합되지 않는다. 처음부터 다시 짜는 큰 개편은 브랜치가 아니라 새 파일로 한다. 혼자 하는 작은 수정에는 브랜치를 쓰지 않는다.
- 원문: "you can't make a branch of a branch."

#### 24. Figma Best Practices — Make the most of design system analytics

- URL: https://www.figma.com/best-practices/make-the-most-of-design-system-analytics/
- 문서 날짜: 표시 없음
- 질문 5 · 6: 라이브러리 분석은 컴포넌트별 삽입 수 · 인스턴스 수 · 떼어 낸(detach) 수와 쓰는 팀 · 파일을 보여 준다(Organization 이상). 떼어 낸 수가 많으면 그 부품이 필요를 못 채운다는 신호지만, 화면 틀처럼 떼어 쓰라고 만든 것은 예외다. 새 시스템은 새 라이브러리로 게시하면 옛 것과 나란히 채택률을 잴 수 있다. 파일 안에서 떼어진 자리를 찾아 주지는 않는다.
- 원문: "a brand new library will allow you to track adoption of your new system."

#### 25. GitHub Primer — Contributing to Figma

- URL: https://primer.style/product/contribute/contributing-to-figma
- 문서 날짜: 표시 없음
- 질문 3: 컴포넌트 이름은 PascalCase 로 코드 이름과 같게(`ActionList`). 속성 이름도 코드 prop 그대로, 변형 값은 소문자, 불리언은 끝에 `?`(`label?`). 변형 속성을 컴포넌트 속성보다 위에 둔다. 모양 · 상태 변화는 변형, 기능이 달라지면 다른 컴포넌트. 레이어 이름에 「Frame 403」 같은 기본값을 남기지 않는다. API 가 바뀌면 파일 안 문서 시트와 overview 쪽을 같이 고친다.
- 질문 4: 슬롯은 오토 레이아웃 컨테이너 안에 둔다.
- 질문 1: 새 컴포넌트는 Primer Primitives 라이브러리의 값을 스타일로 받아 쓴다.
- 질문 6: 직접 고치지 않고 `@username/changes-being-made` 브랜치 → 담당자 검토 → 관리자가 병합 · 게시.
- 원문: "Component names use PascalCase."

#### 26. GitLab Pajamas — UI kit release process

- URL: https://design.gitlab.com/get-started/uik-release-process
- 문서 날짜: 2026-10-09 고침
- 질문 6: 토큰 라이브러리와 컴포넌트 라이브러리를 나눈다. 토큰 브랜치는 병합하자마자 게시해야 컴포넌트 쪽이 새 변수를 묶을 수 있다(순서: 토큰 → 컴포넌트). 다른 디자이너가 브랜치를 검토하고, 게시는 디자인 시스템 팀만 한다. 변경 기록은 Additions · Enhancements · Changes · Fixes 로 나눠 현재형으로 쓴다. 깨지는 변경은 버전 기록과 전용 쪽에 적는다. 작은 수정은 수시로 내보낸다.
- 원문: "Publish the Design tokens library as soon as a token branch is merged"

#### 27. Atlassian Design System — Use tokens in design

- URL: https://atlassian.design/foundations/tokens/use-tokens-in-design
- 문서 날짜: 표시 없음(바닥글 2026)
- 질문 2: Atlassian 라이브러리는 토큰을 스타일과 컴포넌트 안에 넣어 준다(이 쪽은 Figma 변수를 말하지 않는다).
- 질문 5: 옛 파일의 색을 토큰으로 바꾸고 다크로 뒤집는 일은 전용 플러그인(Atlassian Design Tokens)으로 한다 — 큰 조직은 기존 화면 맞추기를 플러그인으로 자동화한다.
- 원문: "design tokens built-in as styles and in components"

#### 28. GitLab Pajamas — Working with components (UI kit)

- URL: https://design.gitlab.com/get-started/uik-components
- 문서 날짜: 2026-07-13 고침
- 질문 3: base component 를 쓰지 않는다 — 평평한 구조가 파일 크기를 줄이고 수정 범위를 가두고 오버라이드가 잘 남는다. 속성 키는 대문자로 시작, 값은 소문자, 모양이 아니라 의도로 이름 짓는다. 긍정 불리언 먼저, 크기는 작은 것부터. 딸린 속성은 `↳` 머리말. 기본값 표시는 `(default)`. 가장 많이 쓰는 변형을 첫 자리에 둬 기본으로 들어가게 한다.
- 질문 1: 컴포넌트 속성은 되도록 디자인 토큰(변수)으로 채운다. 컴포넌트 전용 변수는 다른 부품 안에 들어가는 축약 부품에만 만들고 「Integrated components」 컬렉션에 부품 이름별로 묶어 게시에서 숨긴다.
- 질문 4: 패딩 · 간격이 일정해야 하는 부품(버튼)은 오토 레이아웃, 고정돼야 하는 조각(툴팁 꼬리)은 constraints. 슬롯을 써서 간격은 부모가 쥔다.
- 원문: "We don't use base components in the UI kit."

#### 29. Red Hat Design System — Figma variables and styles

- URL: https://ux.redhat.com/get-started/designers/figma-variables-and-styles
- 문서 날짜: 표시 없음(바닥글 2026)
- 질문 2: 변수는 토큰의 날것(값 하나), 스타일은 여러 토큰을 묶은 지름길. 단색은 변수, 그라데이션은 색 스타일. 글자는 text style(글꼴 · 줄 높이 · 크기 · 굵기 묶음)이고 타이포 변수도 함께 둔다. 간격 · 길이 · 테두리 · 브레이크포인트 · 투명도는 변수. 그림자는 effect style. 격자는 layout grid style.
- 질문 1: 모드로 라이트 · 다크를 바꾼다. 앞으로 접근성 · 멀티 브랜드 · 밀도 · 플랫폼에도 모드를 쓸 계획. 화면에는 primitive 를 쓰지 않고 semantic 을 쓴다.
- 질문 5: 변수 · 스타일을 떼지(detach) 않는다 — 불일치가 가장 많이 생기는 원인.
- 원문: "Do not use primitive variables unless absolutely necessary."

#### 30. Figma Blog — Updating our web system for a new era

- URL: https://www.figma.com/blog/updating-our-web-system-for-a-new-era/
- 문서 날짜: 2024-11-13(Becca Ramos)
- 질문 1: 컬렉션 둘 — 팔레트를 담은 「Color Library」 와 배경 · 글자 · 버튼 색 토큰을 담은 「Color Pairs」. 이름은 코드와 맞춘다. 라이트 · 다크 컴포넌트를 따로 두던 것을 변수 모드로 없앴다.
- 질문 2: 글자 · 격자는 전역 스타일로. 글자 스타일은 기기별 묶음 대신 headline · body 크기로 정리.
- 질문 3: 쓰임 조사로 변형을 줄였다(Flex 48 → 24). 변형 대신 중첩 컴포넌트와 변수로 차이를 처리. 페이지 템플릿과 조립용 블록 컴포넌트를 둔다.
- 질문 4: 브레이크포인트 이름은 XS–XXL, 항목이 몇 열을 차지하는지는 Dev Mode 주석으로 적는다.
- 질문 5 · 6: 브랜치에서 새 서체를 시스템 전체에 시험. 부품 묶음별로 나눠 차례로 QA 하고 Notion 표로 진행을 쫓았다.
- 원문: "The nomenclature was actually a big part of our process."

#### 31. IBM Carbon — Design kits: Figma

- URL: https://carbondesignsystem.com/designing/kits/figma/
- 문서 날짜: 2026-07-01 고침
- 질문 6: 라이브러리를 용도별로 나눠 함께 설치하게 한다 — (v11) 테마 라이브러리(컴포넌트 + 테마 변수), Type Sets, 색, 아이콘, 픽토그램. 차트 · 모바일은 보조 라이브러리. Code Connect 와 채택률 확인 플러그인(Coverage Plugin)을 함께 내놓는다.
- 질문 1 · 2: 이 쪽 본문에는 변수 · 모드 설명이 없다. 네 테마를 모드 넷으로 합친 「All themes」 라이브러리 소개 글(Medium)은 403 으로 열지 못했다(미확인).
- 원문: "meant to be installed together"

#### 32. Figma Help — Update 1: Tokens, variables, and styles(디자인 시스템 입문 과정)

- URL: https://help.figma.com/hc/en-us/articles/18490793776023
- 문서 날짜: 표시 없음(변수 출시 뒤인 2023 하반기 과정)
- 질문 1: 토큰 세 층 — primitive(날값, 참조 전용) · semantic(쓰임: surface · button) · component(자리: button-primary background). 예제 Habitz 는 컬렉션 둘(「Primitives」 와 「Tokens」)이고 Tokens 안에 semantic 과 component 를 같은 층에 둔다. 다른 나누기도 된다. primitive 는 「Show in all supported properties」 를 끄고 「hide from publishing」 을 켠다. 테마는 Tokens 컬렉션에 모드를 더하고 참조만 다른 primitive 로 돌린다(이름은 그대로). 이름은 줄임말 없이 온전한 낱말, 머리말을 일정하게, 브랜드 이름 금지, 컴포넌트 토큰은 자산-종류-속성-상태 순.
- 질문 2: 변수는 그라데이션을 담지 못하므로 그라데이션 · 겹친 채움 · 그림자는 스타일로 남긴다.
- 질문 5: 순서는 지금 쓰는 값 조사 → primitive → semantic · component(별칭) → 테마 모드 → 간격 숫자 변수.
- 원문: "Design token structures should always begin with a foundation of primitive tokens."

#### 33. Molly Hellmuth(UI Prep) — 디자인 시스템 첫 실수 10가지(스레드)

- URL: https://threadreaderapp.com/thread/1598732143877726208
- 문서 날짜: 2022-12-02(변수 이전 글)
- 질문 3: 큰 컴포넌트 묶음 하나보다 종류별 작은 묶음으로 쪼갠다(버튼 종류별). 안에서만 쓰는 조립용 부품은 이름 앞에 `.` 이나 `_` 를 붙여 Assets 에서 숨긴다. 스타일 · 컴포넌트의 설명 칸에 언제 쓰는지와 검색어를 적는다. 아이콘은 정사각 프레임 · 벡터 하나, 가까운 것만 변형으로.
- 질문 4: 그룹 대신 프레임(오토 레이아웃 · 제약 · 격자가 프레임에만 된다). 프레임 폭은 기기 크기가 아니라 브레이크포인트로.
- 질문 2 · 6: 색 단계 전체는 문서로만 두고 꼭 쓰는 것만 스타일로 올린다. 스타일과 컴포넌트를 다른 파일에 둔다(여러 제품 · 테마 대비).
- 원문: "Frames are better 99% of the time."

#### 34. Figma 고객 사례 — Adyen(Bento 디자인 시스템)

- URL: https://www.figma.com/customers/figma-helps-adyen-streamline-design-system/
- 문서 날짜: 표시 없음(2023 Config 뒤)
- 질문 1: core 층(모든 색 정의, 디자이너 · 개발자는 못 쓰고 시스템 팀만 고르는 팔레트)과 그 위 semantic 층(색상 이름이 아니라 UI 역할로 이름). 다크는 변수 모드로.
- 질문 5: 순서 — 색 · 간격 · 모서리를 변수로 옮기고 → 모든 컴포넌트를 그 변수로 고침 → 라이브러리로 배포. 컴포넌트를 고치면 인스턴스를 쓰는 화면은 따라온다. Figma API 로 만든 대시보드에서 가져오기 수 · 인스턴스 수 · 떼어진 컴포넌트를 쫓는다.
- 원문: "changing a theme takes just a few clicks and is fully automated"

#### 35. Supernova — Figma Variables Playbook 1.2: Structuring your variables for scale

- URL: https://www.supernova.io/guide-supernova-figma-variables-playbook/1-2-structuring-your-variables-for-scale
- 문서 날짜: 표시 없음(바닥글 2026)
- 질문 1: 컬렉션 나누는 축은 셋 중 하나 — 종류별(색 · 간격 · 타이포 · 모서리), 테마 · 브랜드별, 층별(foundation · components). 모드는 컬렉션마다 정해지므로 컬렉션 구조가 테마 방식을 정한다. 이름은 `[목적]/[분류]/[역할 · 크기]`(`color/bg/default`, `spacing/xs`), 소문자와 슬래시. `button-blue` 같은 날값 이름 금지. 한 번 쓰는 변수는 만들지 않고 폐기 값에 표시를 한다. 설명과 code syntax 는 문서 · 코드 내보내기로 이어진다.
- 원문: "Collections in Figma are like folders for your variables."

#### 36. 당근(하태영, FEConf 2023) — Cross-Platform Design System: A 1.5-Year Journey (Part 1)

- URL: https://dev.to/feconf/cross-platform-design-system-a-15-year-journey-part-1-4e4d
- 문서 날짜: 2025-06-15 게시(발표는 2023)
- 질문 1: 토큰을 층으로 둔다 — 날값 층, 의도 층(브랜드 주색이 어느 색인지), 맥락(라이트 · 다크)은 같은 값의 갈래. 이 구조가 Figma Variables 와 뜻이 맞는다고 적는다.
- 질문 3: Figma 컴포넌트를 정본으로 삼고 컴포넌트 프레임 구조를 코드 구조와 되도록 같게 둔다. Figma 를 개발 플랫폼의 하나처럼 보고 구조 · 상태 인터페이스를 먼저 합의한 뒤 Figma 와 코드를 함께 만든다. 웹훅으로 플랫폼별 코드를 만든다.
- 원문: "use these components as the source of truth"

#### 37. Figma Forum — How to find detached nodes

- URL: https://forum.figma.com/t/how-to-find-detached-nodes/10755/6
- 문서 날짜: 2021-11 – 2024-10 답글
- 질문 5: 떼어진 인스턴스는 보통 프레임이 되어 인스턴스였다는 기록이 남지 않는다 — 내장 검색이 없다(Figma 직원 답은 없음, 커뮤니티 답). 우회로는 컴포넌트마다 표시용 숨은 조각을 넣어 두기(Uber, Config 2021), 플러그인(dominate.design/detached, 찾기는 무료), API 로 훑기.
- 원문: "It's free to use to find them."

#### 38. Zenn(nabekou29, Unipos) — Style Dictionary で Figma のデザイントークンを管理する

- URL: https://zenn.dev/nabekou29/articles/figma-style-dictionary
- 문서 날짜: 2024-12-15(2024-12-22 고침)
- 질문 1: 토큰 경로를 슬래시 이름(`color/red/200`, `font-size/md`)으로 변수에 넣는다. 글자 크기 · 글꼴 · 굵기 변수는 해당 글자 범위로만 좁힌다. 코드는 Style Dictionary 로 CSS 변수를 낸다.
- 질문 2: 색 · 숫자 · 글꼴은 변수, 타이포 토큰은 text style 로 만들고 그 칸을 변수에 묶는다.
- 원문: "Scope を指定することで、Figma で使用できる箇所を限定する"

#### 39. Figma — AI file cleaner(Figma 에이전트)

- URL: https://www.figma.com/solutions/ai-file-cleaner/
- 문서 날짜: 표시 없음(오픈 베타)
- 질문 5: Figma 에이전트가 파일을 훑어 안 쓰는 컴포넌트 · 떼어진 인스턴스 · 숨은 레이어 · 중복을 표시하고 사용자가 하나씩 보고 정한다. 유료 요금제, 오픈 베타 동안 AI 크레딧을 쓰지 않는다. 안 묶인 값이나 변수 바꾸기는 이 쪽에 적혀 있지 않다(그 일은 Check designs).
- 원문: "Nothing gets permanently deleted without your approval."

#### 40. Figma Help — Apply changes to instances

- URL: https://help.figma.com/hc/en-us/articles/360039150733
- 문서 날짜: 표시 없음
- 질문 5: 인스턴스를 다른 컴포넌트 · 변형으로 바꿔 끼울 때 오버라이드는 레이어 이름이 같아야 남는다. 글 내용은 글 레이어 이름이 같고 층 구조가 비슷하면 남는다 — 옛 부품과 새 부품의 레이어 이름을 맞춰 두어야 화면을 갈아 끼울 때 문구가 안 날아간다. 인스턴스의 오버라이드를 메인으로 올리는(push) 일은 같은 파일 안에서만 된다. 인스턴스 구조(레이어 순서)는 못 바꾸고 바꾸려면 떼어야 한다. 떼어진 것을 되붙이는 기능은 문서에 없다.
- 원문: "It's not possible to push changes to components in another file."

#### 41. Figma Help — Edit main components

- URL: https://help.figma.com/hc/en-us/articles/360038665934
- 문서 날짜: 표시 없음
- 질문 6: 같은 파일 안에서는 메인 컴포넌트를 고치면 인스턴스에 바로 퍼진다. 라이브러리로 나눈 경우에는 게시해야 다른 파일에 닿고, 메인은 원래 파일에서만 고친다. 중첩된 컴포넌트에는 오버라이드를 올릴 수 없다.
- 원문: "You can only edit main components in the original files where they live."

### 미확인(열지 못했거나 본문이 안 온 곳 — 세지 않음)

- Luis Ouriach 「A case for primitive semantic」(medium.com/@disco_lu) — 403. 검색 요약으로만: primitive 는 게시하지 않고 semantic 만 게시한다는 주장.
- UX Collective 「Migrating from color styles to local variables in Figma」 — 403.
- IBM Carbon 「Introducing Figma variables and a consolidated All themes library」(Medium) — 403. 검색 요약으로만: 네 테마를 한 라이브러리의 모드로 합침.
- Nathan Curtis(EightShapes) 「Naming Tokens in Design Systems」(Medium) — 403. Figma 변수를 다룬 그의 글은 검색에서도 찾지 못함.
- Francesco Improta 「Using design tokens as variables: best practices」(Substack, 2025-11-06) — 유료 벽, 머리말만.
- Material 3 「Material Theme Builder 2.0」 블로그 — 제목만 옴. 검색 요약으로만: 2.0 부터 스타일과 함께 변수도 만든다.
- Uber Base(base.uber.com) — 제목만 옴.
- Shopify Polaris Figma 키트 안내 — 검색 결과만, 본문 미확인.
- GitLab Pajamas 「UI kit structure」 — 로그인 쪽으로 넘어감.
- Figma Help 미러 「Apply variables to designs」(helpjuice) — 402. 본가 주소는 찾지 못함.
- Figma Help 35794667554839 — 404.
- 토스 · 라인 · 카카오 디자인 블로그의 Figma 변수 · 컴포넌트 글 — 검색에서 나오지 않음(한국 자료는 당근 1곳, 일본 자료는 Zenn 1곳만 확인).
- 날짜로만 확인한 것: 확장 컬렉션 출시(플러그인 API 기록 2025-11-20), 슬롯 GA(플러그인 API 기록 2026-06-10)는 검색 결과 요약에서 본 것이고 그 기록 쪽은 열지 않았다.

읽은 방식의 한계: 쪽 본문은 WebFetch 가 돌려준 요약과 인용으로 읽었다. 인용 구절은 그 도구가 본문에서 뽑아 준 것이라, 글자 하나까지 맞는지는 원문 쪽에서 다시 대조하지 않았다. Figma Help 는 쪽에 고친 날짜를 싣지 않아 대부분 「표시 없음」 이다.

### 질문별 정리

#### 1. 변수

공통으로 말하는 것

- 층은 primitive(날값) · semantic(쓰임) · component-specific 세 종류이고 필요한 것만 쓴다(Figma Help 32, 원문 대조로 고침). 예제 파일과 실무 사례는 primitive → semantic 두 컬렉션이 많고, 화면과 컴포넌트에는 semantic 을 입힌다(Red Hat 29, Adyen 34, 당근 36, Figma 웹 팀 30).
- primitive 는 디자인에 바로 쓰이지 않게 한다. 「Show in all supported properties」 를 끄고 게시에서 숨긴다(32, 원문 대조로 고침).
- 테마는 semantic 컬렉션의 모드로 둔다. 이름은 그대로 두고 모드마다 다른 primitive 를 가리킨다(32, 3, 34).
- 모드는 Auto 로 부모를 물려받고 없으면 맨 왼쪽 모드가 기본이다(3). 다크만 쓰면 다크를 첫 모드로 둔다.
- 이름은 슬래시로 그룹을 만든 소문자 경로, 줄임말 없이, 색상 이름 · 브랜드 이름이 아니라 역할로(32, 35, 38).
- 범위(scoping)를 좁혀 둔다. 고르는 창이 짧아지고 Check designs 후보가 정확해진다(2, 9, 38).
- code syntax 칸에 코드 쪽 이름(CSS 변수)을 넣어 Dev Mode 와 맞춘다. Figma 공식 예시는 스크립트로 채운다(2, 15).

갈리는 점

- component 층: Figma Help(32)는 semantic 과 같은 컬렉션에 함께 두는 예를 든다. Luis Ouriach(16)는 선택 사항이고 대부분 팀에 필요 없다고 한다. GitLab(28)은 다른 부품 안에 들어가는 축약 부품에만 만들고 숨긴다.
- 컬렉션 나누는 축: 층별 둘(Primitives · Tokens, 32) 대 종류별(색 · 간격 · 타이포, 35, 13). 모드가 컬렉션 단위라서, 모드 축이 다른 것(색 테마 대 화면 폭)은 컬렉션을 나눠야 한다는 데는 이견이 없다.
- 밀도 · 폭 모드: 문서가 예로는 들지만(3, 13, 29) 실제로 쓰는 곳은 적다. Figma 웹 팀(30)은 브레이크포인트를 모드가 아니라 브레이크포인트별 컴포넌트와 주석으로 처리했다.
- 확장 컬렉션은 멀티 브랜드 · Enterprise 전용이라 브랜드 하나인 파일에는 해당 없다(5).

#### 2. 스타일과 변수

공통으로 말하는 것

- 변수는 값 하나, 스타일은 여러 값의 묶음. 변수가 스타일을 대신하지 않는다(4, 29, 32).
- 색 단색 · 간격 · 모서리 · 크기 · 선 굵기는 변수. 그라데이션 · 겹친 채움 · 그림자(effect) · 격자(layout guide)는 스타일(4, 18, 29, 32).
- 글자는 둘을 겹쳐 쓴다 — 글꼴 · 크기 · 줄 높이 · 자간 · 굵기를 변수로 두고, 그 변수들을 묶어 text style 로 저장해 화면에는 text style 을 입힌다(13, 4, 38).

바뀐 기능(날짜)

- 2024-04: 타이포 변수 베타 종료(13).
- 2025-05: layout grid 가 layout guide 로 이름 바뀜, 그리드 오토 레이아웃 추가(18, 19).
- 2025-10-28 Schema: 모드 상한 올림(Professional 10 · Organization 20), 확장 컬렉션 · 변수 가져오기 내보내기 2025-11 예고, 슬롯 · Check designs 조기 접근(10).
- 2026-03-23: simplified instances 폐기 시작(7).
- 2026-06 무렵: 슬롯 정식(검색으로만 확인). 지금 Help 는 모든 요금제라고 적는다(8).

갈리는 점

- 글자를 변수까지 내릴지: Joey Banks(13) · Zenn(38)은 변수 + 스타일, Figma 웹 팀(30)과 Carbon(31)은 text style(Type Sets)만 말한다. 줄 높이 % 를 변수에 못 넣는다는 한계가 2024-04 글에 있고 지금도 그런지는 미확인.
- 색을 스타일로도 내놓을지: Atlassian(27)은 아직 토큰을 스타일로 준다. 나머지는 색 변수.

#### 3. 컴포넌트

공통으로 말하는 것

- 변형은 모양 · 구조가 다른 것(종류 · 크기 · 인터랙션 상태)에, 속성(boolean · instance swap · text · slot)은 내용 변화에 쓴다. 상태는 변형의 state 속성으로 둔다(6, 7, 11, 17, 25).
- 가짓수가 곱으로 불어나면 변형을 멈추고 쪼개거나 중첩 인스턴스 · 변수 모드로 뺀다. 아이콘은 instance swap + preferred 목록(17, 7, 16, 30, 33).
- 이름과 속성은 코드와 맞춘다(Primer 는 PascalCase 이름 · 소문자 값 · `?` 불리언, GitLab 은 대문자 키 · 소문자 값). 기본 이름(Property 1, Frame 403)을 남기지 않는다(25, 28, 11, 6).
- 설명 칸에 쓰임 · 검색 별명 · 문서 링크를 적는다. 파일 안에 부품마다 문서 시트를 둔다(11, 16, 25, 33).
- 조립용 안쪽 부품은 `.` · `_` 머리말이나 「Hide when publishing」 으로 숨긴다(33, 22).
- 슬롯으로 떼어 쓰던 자리를 대신한다. 맨 위 레이어에는 못 걸고 오토 레이아웃 안에 둔다(8, 25, 28).

갈리는 점

- base component: Joey Banks(14, 2022)와 GitLab(28, 2026)은 쓰지 않는다 — 숨긴 레이어가 늘고 오버라이드가 잘 깨진다. Figma Best Practices(17)는 가짓수가 넘칠 때의 대안으로만 이름을 든다. 최근 자료일수록 평평한 구조 쪽이다.
- 한 묶음에 다 넣기 대 쪼개기: Luis Ouriach(16) · Molly Hellmuth(33)는 쓰임별로 쪼개라 하고(코드와 1 : 1 이 깨져도), Primer(25) · 당근(36)은 코드 컴포넌트와 같은 단위를 지킨다.

#### 4. 오토 레이아웃 · 격자

공통으로 말하는 것

- 컴포넌트는 전부 오토 레이아웃, 패딩 · gap 에 숫자 변수(16, 20, 28).
- 쪽 틀은 오토 레이아웃 프레임을 중첩해 만든다. 본문 열은 fill + max 폭, 폭 값은 숫자 변수로(20).
- 격자는 layout guide 스타일로 저장해 화면 프레임에 입힌다. stretch 열은 여백 · gutter 로 프레임을 따라간다(18, 29).
- 그리드 오토 레이아웃은 대시보드 · 표 · 벤토 같은 2차원 배치용이고 layout guide 와 다른 기능이다(19, 18).

갈리는 점 · 비는 곳

- 헤더 · 사이드바 · 본문 틀을 컴포넌트로 두라는 공식 문장은 찾지 못했다. Figma 웹 팀(30)은 페이지 템플릿과 블록 컴포넌트를 두었고, SDS(15)는 레이아웃 컴포넌트가 코드에만 있다. 분석 글(24)은 화면 틀을 「떼어 쓰라고 만든 컴포넌트」 의 예로 든다. 슬롯이 나온 뒤로는 틀 컴포넌트 + 본문 슬롯이 떼지 않는 방법이 됐다(8). 근거 약함.
- 그리드 오토 레이아웃의 트랙에 변수를 거는지는 미확인.

#### 5. 기존 화면을 시스템에 맞추기

공통으로 말하는 것

- 순서: 쓰는 값 조사 → primitive → semantic(별칭 · 모드) → 스타일(글자 · 그림자 · 격자) → 컴포넌트를 변수로 고침 → 화면(32, 34, 26). 토큰이 먼저 있어야 컴포넌트가 묶을 수 있다(26).
- 색 날값 → 변수: 화면을 잡고 Selection colors 에서 고른 색에 스타일 · 변수를 입힐 수 있다(12). 그 색을 쓰는 레이어가 한 번에 바뀐다는 문장은 원문 대조에서 찾지 못했다(미확인). 모든 요금제.
- 날값 찾기 · 검증: Check designs 가 색 · 글자 스타일 · 모서리 · 간격 · 패딩의 날값을 찾아 후보를 낸다. 한 페이지씩, 2만 5천 레이어까지, Education(K-12) · Organization · Government · Enterprise 요금제(9, 원문 대조로 고침). 그 아래 요금제는 플러그인(Design Lint 등, 16)과 Selection colors 로 본다.
- 인스턴스 교체: 오버라이드는 레이어 이름이 같아야 남는다(40). 라이브러리 사이라면 Swap libraries 가 이름으로 한꺼번에 바꾼다(21).
- 변수 · 스타일 · 인스턴스를 떼지 않는다(29).

갈리는 점 · 비는 곳

- 떼어진 인스턴스 찾기: 내장 검색이 없다 — 떼면 보통 프레임이 된다(37). 방법은 플러그인, Figma 에이전트의 파일 청소(39, 베타), 라이브러리 분석의 detach 수(24, 자리는 안 알려 줌)로 갈린다.
- 처음부터 컴포넌트가 아니었던 날 프레임을 인스턴스로 바꾸는 내장 일괄 기능은 어느 자료에도 없다. Check designs 도 컴포넌트는 알리기만 한다(9). 손으로 갈아 끼우거나 플러그인 · 스크립트다. Atlassian(27)처럼 전용 플러그인을 만든 곳이 있다.
- Swap libraries 가 변수도 바꾸는지: 2026-11-11 Help 본문은 된다고 하고 옛 문구와 포럼은 안 된다고 한다(21). 파일 하나 안의 로컬 자산에는 해당 없다.

#### 6. 게시 · 버전 · 브랜치

공통으로 말하는 것

- 파일 하나 안에서 쓰면 게시가 필요 없고 메인을 고치면 바로 퍼진다. 라이브러리로 나누면 게시해야 닿고, 게시 때마다 변경 설명을 적는다(22, 41).
- 메인 파일이 정본. 브랜치에서 고치고 → 검토 → 병합 → 게시. 브랜치에서는 게시 못 하고 병합은 전부 아니면 전무(23, 25, 26). 브랜치는 Organization 이상.
- 변경 기록은 깨지는 변경을 따로 표시한다. 속성 삭제 · 이름 바꾸기가 깨지는 변경이다(11, 26).
- 슬롯 속성 지우기 · 확장 컬렉션 이전처럼 위험한 변경은 브랜치나 사본에서 먼저 해 본다(8, 5).

갈리는 점

- 나누는 정도: GitLab(26) · Carbon(31) · Molly Hellmuth(33)는 토큰(스타일) 라이브러리와 컴포넌트 라이브러리를 나눈다. Figma SDS(15)와 Figma Help 예제(32)는 파일 하나다. 나누면 게시 순서(토큰 먼저)가 생긴다.
- 큰 개편: Figma Best Practices(23)는 처음부터 다시 짜는 일은 브랜치가 아니라 새 파일, 분석 글(24)은 새 시스템을 새 라이브러리로 내면 옛 것과 채택률을 나란히 잴 수 있다고 한다. Figma 웹 팀(30)은 브랜치에서 서체 교체를 시험했다.
- 혼자 하는 작은 수정에 브랜치를 쓸지: Figma(23)는 쓰지 말라 하고 Primer(25)는 모든 변경을 브랜치로 받는다(팀 크기 차이).
