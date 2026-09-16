# 타이포 · 아이콘 크기 — 디자인 시스템 19곳 조사 (2026-09-14)

읽기 전용 웹 조사(WebSearch·WebFetch로 토큰 파일·공식 문서). 브라우저 실측 없음.

- **[V]** 1차 출처(토큰 파일·공식 문서) · **[D]** 확인값으로 계산 · **[S]** 2차 출처만 · **[N]** 못 찾음
- WebFetch 는 페이지를 요약해 돌려준다. 토큰 파일(unpkg·jsDelivr·GitHub raw) 값은 믿을 만하고, 문서 페이지 값은 요약을 거친 값이다.

---

## 1. Material Design 3

출처: `@material/web` 토큰 `tokens/versions/v0_192/_md-sys-typescale.scss`, `_md-comp-{filled-text-field,filled-button,navigation-bar,icon-button}.scss`

| 역할     | Large       | Medium      | Small       |
| -------- | ----------- | ----------- | ----------- |
| Display  | 57/64 · 400 | 45/52 · 400 | 36/44 · 400 |
| Headline | 32/40 · 400 | 28/36 · 400 | 24/32 · 400 |
| Title    | 22/28 · 400 | 16/24 · 500 | 14/20 · 500 |
| Body     | 16/24 · 400 | 14/20 · 400 | 12/16 · 400 |
| Label    | 14/20 · 500 | 12/16 · 500 | 11/16 · 500 |

- 단일 스케일(모바일·데스크톱 같음) [V]. 최소 11(Label Small) [V]
- 입력값·레이블 `body-large` 16 [V] · 버튼 `label-large` 14/20·500, 높이 40, 아이콘 18 [V]
- 아이콘: 필드 앞뒤 24 · 내비 바 24(레이블 12) · 아이콘 버튼 24, 상태 레이어 40×40 [V — 아이콘 버튼 값은 경로 재확인 필요]
- 섹션 제목 역할 지침 [N] (문서가 JS 렌더)

## 2. Apple HIG

출처: developer.apple.com HIG JSON `typography.json` · `buttons.json`

- 기본/최소 [V]: iOS 17/11 · macOS 13/10 · visionOS 17/12 · watchOS 16/12 · tvOS 29/23
- iOS Dynamic Type [V]: Large Title 34/41 · Title1 28/34 · Title2 22/28 · Title3 20/25 · Headline 17/22 Semibold · Body 17/22 · Callout 16/21 · Subhead 15/20 · Footnote 13/18 · Caption1 12/16 · Caption2 11/13
- macOS [V]: Large Title 26/32 · Title1 22/26 · Title2 17/22 · Title3 15/20 · Headline 13/16 Bold · Body 13/16 · Callout 12/15 · Subheadline 11/14 · Footnote·Caption 10/13
- iOS Headline 은 본문과 같은 17, 굵기만 다름 · Title3/Body 1.18 [D]
- 누름 영역 최소 44×44pt (visionOS 60) [V] · 입력·탭 바 아이콘 크기 [N]

## 3. IBM Carbon

출처: `@carbon/type/scss/_styles.scss`·`_scale.scss`, `@carbon/styles` text-input·button, carbon-website `icons/usage.mdx`

- 스케일 [V]: 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 54, 60
- 토큰 [V]: label-01 12/16 · body-compact-01 14/18 · body-01 14/20 · body-compact-02 16/22 · body-02 16/24 · heading-compact-01 14/18 600 · heading-02 16/24 600 · heading-03 20/28 · heading-04 28/36 · heading-05 32/40 · heading-06 42 · heading-07 54
- 본문: 제품 UI 14 · 긴 글 16 · 최소 12 [V]
- 섹션 제목 heading-03 20 / 본문 14 = 1.43 [D]
- 입력값 14 [V] · 버튼 14 + 아이콘 16 (expressive 16 + 20) [V]
- 아이콘 [V]: 기본 16, 20·24·32 도 사용 · "16px and 20px icons are optimized to feel balanced when paired with 14px and 16px IBM Plex" · 텍스트와 가운데 정렬 · 누름 영역 44+

## 4. GitHub Primer

출처: `@primer/primitives` typography·size CSS, primer/react ButtonBase·TextInputWrapper, primer.style icons

- 크기 [V]: 12, 14, 16, 20, 32, 40
- 역할 [V]: body-large 16 · **body-medium 14 (기본 UI)** · body-small 12 · caption 12 · title-small 16·600 · title-medium 20·600 · title-large 32·600 · subtitle 20 · display 40
- 섹션 제목 title-medium 20 / 14 = 1.43 [D]
- 입력 14 — 모바일 16 전환 없음 [V] · 높이 28/32/40 · 버튼 14·500 [V]
- 아이콘 [V]: Octicons 12·16·24·48·96, 모든 아이콘을 16·24 두 벌로 설계

## 5. Microsoft Fluent 2 (웹)

출처: fluent2.microsoft.design, `@fluentui/tokens` fonts·typographyStyles, fluentui Input·Button 스타일

- 램프 [V]: Caption2 10/14 · Caption1 12/16 · **Body1 14/20** · Body2 16/22 · Subtitle2 16/22 600 · Subtitle1 20/26 600 · Title3 24/32 · Title2 28/36 · Title1 32/40 · Large Title 40/52 · Display 68/92
- 섹션 제목 Subtitle1 20 / 14 = 1.43 [D]
- 입력 [V]: small 12·높이 24·아이콘 16 / **medium 14·32·아이콘 20** / large 16·40·아이콘 24
- 버튼 [V]: small 12·아이콘 20 / **medium 14·600·아이콘 20** / large 16·아이콘 24
- 12 아이콘은 정보 전달용, 상호작용엔 너무 작음 [V]

## 6. Atlassian

출처: atlassian.design typography · iconography

- Heading [V] (Bold): XXL 32/36 · XL 28/32 · L 24/28 · M 20/24 · S 16/20 · XS 14/20 · XXS 12/16
- Body [V]: L 16/24 · **M 14/20 (컴포넌트 기본)** · S 12/16
- 용도 [V]: XL·L 페이지 제목 · M 큰 컴포넌트 · S·XS 작은 컴포넌트
- 섹션 제목 M 20 / 14 = 1.43 [D]
- 입력 [S]: 기본 16, 480px 이상 14 (커뮤니티 · 직원 답변)
- 아이콘 [V]: 기본 16 ("balances harmoniously with body text") · small 12 는 셰브론·검증·태그 · 아이콘 옆 글자는 medium weight 권장

## 7. Adobe Spectrum

출처: `@adobe/spectrum-tokens` typography·layout, `@spectrum-css/tokens` (S1/S2 여부 미확인)

| 토큰     | 75  | 100 | 200 | 300 | 400 | 500 | 700 | 800 | 900 |
| -------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 데스크톱 | 12  | 14  | 16  | 18  | 20  | 22  | 28  | 32  | 36  |
| 모바일   | 15  | 17  | 19  | 22  | 24  | 27  | 34  | 39  | 44  |

- body M = 200(16/19) · heading M = 500(22/27) · 비율 1.375 · 컴포넌트 글자 14/17 [D]
- CJK 행간 [V]: 기본 1.3(제목)·1.5(본문) → CJK 1.5·1.7
- 모바일 워크플로 아이콘 100 = 24 [V]

## 8. Shopify Polaris

출처: `@shopify/polaris-tokens`, polaris-react TextField·Icon

- 크기 [V]: 11, 12, 13, 14, 16, 18, 20, 22, 24, 30, 32, 36, 40 · 굵기 450/550/650/700
- 역할 [V]: heading-xl 24/32 · heading-lg 20/24 · heading-md 14/20 · body-lg 14/20 · **body-md 13/20** · body-sm 12/16
- 입력 [V]: **기본 16, md 이상 13** (iOS 확대 방지) · 아이콘 20 고정 [V]

## 9. Ant Design

출처: ant.design spec/font, genFontSizes·seed

- 기본 14/22 [V] · 크기 12, 14, 16, 20, 24, 30, 38, 46, 56, 68 [D] · H4 20 · H3 24
- controlHeight 32 [V] · 입력·버튼 14 [D] · "3 to 5 types" 이내 권장 [V]

## 10. Radix Themes

출처: `@radix-ui/themes/tokens/base.css`, text-field.css

- 스케일 [V]: 12/16 · 14/20 · 16/24 · 18/26 · 20/28 · 24/30 · 28/36 · 35/40 · 60/60
- TextField 기본 size 2 = 14 [D] · 모바일 16 규칙 없음 · 필드 안 아이콘 16 [V]

## 11. Tailwind CSS v4

출처: `tailwindcss/theme.css` — xs 12/16 · sm 14/20 · **base 16/24** · lg 18/28 · xl 20/28 · 2xl 24/32 · 3xl 30/36 · 4xl 36/40 [V]

## 12. shadcn/ui

출처: new-york-v4 input·button — 입력 `text-base md:text-sm` (16 → 768px 이상 14) · 높이 36 · 버튼 14/500 · 버튼 안 SVG 16 [V]

## 13. Vercel Geist

출처: vercel.com/geist/typography — `copy-14` 가장 흔한 본문 · `label-14` 가장 흔한 스타일 · `copy-16` 여유 있는 화면 · `button-14` 표준 버튼 [V] · px 전체 표 [N]

## 14. GOV.UK

출처: design-system.service.gov.uk type-scale·headings, govuk-frontend input

- 스케일 [V] (640px 초과 / 이하): 48→32 · 36→27 · 24→21 · **19→19** · 16→16
- 일반 페이지: h1 36 · h2 24 · h3 19 [V] · 섹션 제목 비율 24/19 = 1.26 (모바일 1.11) [D]
- 입력 19, 높이 40 [V]

## 15. USWDS

출처: designsystem.digital.gov font-size·settings — 본문 16 · small 14 · h1 40 · h2 32 · h3 22 · h4 16 [V/D]

## 16. Salesforce Lightning (SLDS v1)

출처: v1.lightningdesignsystem.com — 크기 10~42 · 본문 13 · heading medium 20 · 아이콘 16/20/24 · 누름 영역 44 [V]

## 17. 한국 시스템

### Toss TDS

출처: tossmini-docs.toss.im tds-mobile typography — T1 30/40 · T2 26/35 · **T3 22/31 일반 제목** · T4 20/29 작은 제목 · **T5 17/25.5 일반 본문** · T6 15/22.5 · T7 13/19.5 [V] · 본문 행간 1.5 [D] · T3/T5 1.29 [D]

### 당근 SEED

출처: seed-design.io typography — t1 11 ~ t10 26 (t5 **16/22** · t7 20/27 · t9 24/32 · t10 26/35) · screenTitle = t10 bold · articleBody = 16/24 [V]

### KRDS (대한민국 정부 디자인 시스템)

출처: krds.go.kr style_03·style_06

- Heading [V] (PC/모바일, 700, 행간 150%): xlarge 40/28 · large 32/24 · medium 24/22 · small 19/19 · xsmall 17 · xxsmall 15
- Body [V]: L 19 · **M 17 (기본)** · S 15 · XS 13
- 규칙 [V]: 본문 최소 16 · 행간 150% 이상 · 굵기 400·700 · **제목과 본문 크기 차이 1.25~1.5배**
- 아이콘 [V]: 기준 24 · 16/20/24/32/40 · 텍스트와 함께면 크기 맞추고 가운데 정렬

### LINE · 카카오 · 네이버 · 배민

- LINE [S]: 12pt 미만 비권장 · 카카오·네이버·배민 공개 스케일 [N]

---

## 종합

### 본문 크기

- 제품 UI(데스크톱) **14 가 압도적**: Carbon · Primer · Fluent · Atlassian · Ant · Radix · Geist
- 읽기·공공·한국 모바일 **16~17**: Toss 17 · KRDS 17 · SEED 16 · USWDS 16 · Spectrum 16 · M3 Body Large 16

### 섹션 제목 : 본문

| 시스템                                     | 섹션 제목 | 본문 | 비율                        |
| ------------------------------------------ | --------- | ---- | --------------------------- |
| KRDS                                       | 24/22     | 17   | 1.41 / 1.29 (권장 1.25~1.5) |
| Atlassian · Carbon · Primer · Fluent · Ant | 20        | 14   | 1.43                        |
| Spectrum · M3                              | 22        | 16   | 1.375                       |
| GOV.UK                                     | 24 (21)   | 19   | 1.26 (1.11)                 |
| Toss                                       | 22 / 20   | 17   | 1.29 / 1.18                 |
| iOS                                        | 20        | 17   | 1.18                        |

- 명시 지침은 KRDS 하나(1.25~~1.5배). 실제 사례는 **1.25~~1.45** 에 몰림
- **14 본문 → 20 제목, 16~~17 본문 → 22~~24 제목** 이 가장 흔함. 스케일로는 본문에서 2단계 위

### 입력 글자

- 모바일 16 → 데스크톱 14 이하로 내리는 곳: shadcn(768+ 14) · Polaris(md+ 13) · Atlassian(480+ 14, [S])
- 항상 16 이상: M3 16 · GOV.UK 19
- 항상 14 (데스크톱 전용 계열): Carbon · Primer · Fluent · Radix · Ant

### 버튼 레이블

- **14 · 500~600 이 사실상 표준** (M3 · Carbon · Primer · Fluent · shadcn · Geist · Ant) · 큰 버튼 16 · 작은 버튼 12

### 아이콘

| 맥락                    | 크기                                                  |
| ----------------------- | ----------------------------------------------------- |
| 14 글자 옆·버튼 안      | **16** (Carbon · Atlassian · Primer · shadcn · Radix) |
| 일반 액션·medium 컨트롤 | **20** (Fluent · Polaris · Carbon expressive · SLDS)  |
| 강조·내비·모바일 기준   | **24** (M3 · KRDS · Fluent large · Spectrum 모바일)   |
| 보조(셰브론·태그)       | 12 (Atlassian · Primer · Fluent)                      |

- 명시적 짝짓기는 Carbon: 16·20 아이콘 ↔ 14·16 글자

### 스케일 단계

- **12 · 14 · 16 · 20 · 24 · 32** 가 거의 모든 시스템에 공통. 그다음 18 · 28
- 한글 행간: KRDS 150%+ · Spectrum CJK 1.5/1.7 · Toss 1.5 · SEED 1.5(본문)/1.375(UI) — 서양식보다 넓게

## 확인하지 못한 것

- M3·Carbon·Primer·Fluent·iOS 의 「섹션 제목에 어느 역할」 명시 지침 (표의 역할 대응은 계산)
- Spectrum 2 문서(403) · 토큰의 S1/S2 여부 · Geist px 전체 · Primer large 입력 20 여부 · Polaris md px · Atlassian 입력 16→14 공식 문서
- USWDS·SLDS·KRDS·Toss·SEED·Apple 입력 글자 · 여러 곳의 버튼 레이블 · Apple 탭 바 아이콘 · LINE 전체 · 카카오·네이버·배민
