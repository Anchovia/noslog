# 글자색 단계 — 다크 실제 서비스 · 디자인 시스템 실측 (2026-11-20)

공통 층 3단계 색 판의 첫 묶음(글자색) 재료다. 다크 화면에서 글자색을 몇 단계로 나누는지, 단계마다 값과 쓰임이 무엇인지, 흰색 투명도로 쓰는지 단색 회색으로 쓰는지를 쟀다. 어느 꼴이 좋다는 판단은 적지 않는다.

## 방법

- headless Playwright(chromium), `colorScheme: 'dark'`, 뷰포트 1920×1080, `permissions: []`. 페이지를 열기 전마다 `~/noslog-research/wait-capacity.sh` 를 거쳤고 브라우저 하나에서 페이지 하나씩 열었다. 로그인 · 동의 창 누르기 · 폼 제출은 하지 않았다.
- 값은 화면 위 3배 높이 안의 보이는 글자 노드마다 부모 요소의 `getComputedStyle(el).color` 원래 문자열(알파 포함)과 조상 `opacity` 곱, 실제로 깔린 면(조상 바탕색을 겹쳐 합성)을 읽었다. 자리표시자는 `getComputedStyle(input, '::placeholder').color`, 비활성은 `:disabled` · `[aria-disabled="true"]` 요소의 색이다. 같은 출처 스타일시트에서 이름에 text · fg · foreground · label 이 든 사용자 정의 속성도 모았다.
- 「단계」 는 어두운 면 위 글자 가운데 글자 수 1% 넘는 무채색 색이다(색 문자열 · opacity 가 같으면 한 단계). 유채색(채도 0.28 넘음)은 링크 · 상태 · 브랜드라 단계 밖에 따로 적었다.
- 대비는 WCAG 2 비. 같은 글자색을 쪽 바탕 #000 과 줄무늬 줄 · 구역 면 #16171b 위에 놓고 계산했다(알파 글자색은 그 면 위에 합성한 뒤 계산).
- 역할 이름(제목 · 본문 · 메타 · 머리 · 버튼)은 요소 위치로 자동으로 붙였다(`h1–h3` 안 = 제목, `time · small` · 클래스에 meta · date 등 = 메타, 13px 이하 기타 = 작은 글). 자동 분류라 틀린 것이 섞인다.
- 원자료 · 캡처 · 스크립트: 공유 메모 폴더 `common-layer/stage3/color/color-text/`(`raw/<곳>-<n>.json` · `shots/<곳>-<n>.jpg` · `scripts/`). 곳마다 요약은 같은 폴더 `summary.json`.
- [다크 서비스 값 한 벌](./2026-11-12-dark-service-sets.md) 의 「글자색」 줄(곳마다 합성한 글자색 상위 8개)은 이번에 다시 잰 곳의 대조에만 썼다. 그 기록은 알파 · 자리표시자 · 비활성을 재지 않아 이번 묶음에 모자라 새로 쟀다.
- 한계: 공개 쪽만 봤다. 비활성 요소는 공개 쪽에 거의 없어 대부분 미확인이다. 그림 · 그라데이션 위 글자는 셈에서 뺐다.

## 당근 SEED 3.2.1 같은 쓰임 토큰

정본 `common-layer/stage3/daangn-tokens.md`(SEED 3.2.1 base.css 다크 블록).

| 토큰                                            | 값      | 팔레트       | 출처                      | #000 위                  | #16171b 위 |
| ----------------------------------------------- | ------- | ------------ | ------------------------- | ------------------------ | ---------- |
| `fg-neutral`                                    | #f3f4f5 | gray-1000    | daangn-tokens 156줄       | 19.07                    | 16.26      |
| `fg-neutral-muted`                              | #dcdee3 | gray-800     | daangn-tokens 158줄       | 15.60                    | 13.31      |
| `fg-neutral-subtle`                             | #b0b3ba | gray-700     | daangn-tokens 159줄       | 10.00                    | 8.53       |
| `fg-placeholder`                                | #868b94 | gray-600     | daangn-tokens 166줄       | 6.13                     | 5.23       |
| `fg-disabled`                                   | #5b606a | gray-500     | daangn-tokens 153줄       | 3.24                     | 2.76       |
| `fg-neutral-inverted` · `fg-on-neutral-solid`   | #16171b | gray-100     | daangn-tokens 157 · 163줄 | 밝은 면 #f3f4f5 위 16.26 | —          |
| `fg-on-brand-solid` · `fg-on-critical-solid` 등 | #fff    | static-white | daangn-tokens 160–164줄   | —                        | —          |

- 다섯 단계 모두 단색 회색이다. 알파 회색(`palette-gray-alpha-*`)은 팔레트에 있지만 fg 토큰이 가리키지 않는다(daangn-tokens 35–44줄).
- 제목 전용 글자 토큰은 없다. 제목도 `fg-neutral`.

## 디자인 시스템

공식 토큰 값이 있는 곳 9곳. 값이 없는 곳(Apple HIG 이름만 · IBM Carbon 다크 값 못 읽음 · 토스 TDS 역할 토큰 없음 · Spotify · Linear · Discord · Twitch 공개 문서 없음)은 미확인으로 뺐다.

| 시스템          | 기본                    | 보조                        | 약함(메타)                  | 자리표시자            | 비활성                  | 반전 면 위 | 단색 / 알파                                | 출처                                                        |
| --------------- | ----------------------- | --------------------------- | --------------------------- | --------------------- | ----------------------- | ---------- | ------------------------------------------ | ----------------------------------------------------------- |
| 당근 SEED       | #f3f4f5                 | #dcdee3                     | #b0b3ba                     | #868b94               | #5b606a                 | #16171b    | 단색                                       | 위 표                                                       |
| GitHub Primer   | #f0f6fc                 | #9198a1(muted)              | 보조와 같음                 | muted 와 같음         | #656c76                 | #010409    | 단색                                       | `stage2/docs/github-primer.md` 21–25줄(dark.css)            |
| Shopify Polaris | rgba(227,227,227,1)     | rgba(181,181,181,1)         | 미확인                      | 미확인                | rgba(74,74,74,1)        | 미확인     | 단색                                       | `stage2/docs/shopify-polaris.md` 19–23줄                    |
| Vercel Geist    | #ededed(gray-1000)      | #a1a1a1(gray-900)           | 없음(두 단계)               | 미확인                | #8f8f8f(gray-700)       | #0a0a0a    | 단색                                       | `stage2/docs/vercel-geist.md` 18–22줄                       |
| 원티드 Montage  | #f7f7f8(strong #fff)    | #c2c4c8 /88                 | #aeb0b6 /61(quaternary /28) | tertiary(#aeb0b6 /61) | #989ba2 /16             | #171719    | 알파                                       | `stage2/docs/wanted-montage.md` 29–33줄                     |
| 채널톡 Bezier   | #fff /80(heaviest #fff) | #fff /60                    | #fff /40                    | #fff /40              | 부품에 opacity 40%      | #000 /85   | 알파                                       | `stage2/docs/channel-bezier.md` 24–28줄                     |
| Atlassian       | #cecfd2                 | #a9abaf(subtle)             | #96999e(subtlest)           | 미확인                | #e5e9f6 /25             | #1f1f21    | 단색(비활성만 알파)                        | unpkg `@atlaskit/tokens` atlassian-dark.js                  |
| Material 3      | #e6e0e9(on-surface)     | #cac4d0(on-surface-variant) | 없음                        | 미확인                | 미확인(규칙 쪽 못 읽음) | #322f35    | 단색                                       | material-web `_md-sys-color.scss` v0_192 values-dark        |
| Radix Colors    | #eeeeee(gray12)         | #b4b4b4(gray11)             | 없음(두 단계)               | 미확인                | 미확인                  | 미확인     | 둘 다(grayA12 #fff /93 · grayA11 #fff /69) | radix-ui/colors `src/dark.ts` · 「Understanding the scale」 |

- 단계 수(기본 · 보조 · 약함 가운데 값이 따로 있는 것): 셋 4곳(SEED · Montage · Bezier · Atlassian), 둘 5곳(Primer · Polaris · Geist · Material 3 · Radix). Primer 는 muted 하나가 보조 · 약함 · 자리표시자를 겸한다.
- 정의 방식: 단색 6곳(SEED · Primer · Polaris · Geist · Atlassian · Material 3), 알파 2곳(Montage · Bezier, 둘 다 국내), 둘 다 내놓은 곳 1(Radix).
- 비활성 값이 있는 7곳: 단색 4(SEED · Primer · Polaris · Geist), 알파 · opacity 3(Montage · Atlassian · Bezier).
- 자리표시자를 따로 정한 곳은 SEED 하나(#868b94, 약함보다 한 단계 아래). Montage · Bezier · Primer 는 보조나 약함 단계를 그대로 쓴다.

## 실제 서비스

곳마다 값. 확인 날짜는 모두 2026-11-20, 뷰포트 1920×1080, 캡처는 `common-layer/stage3/color/color-text/shots/`. 단계 줄의 두 대비는 그 색을 #000 위 · #16171b 위에 놓은 값이다. 「셈에서 뺌」 · 「못 잰 쪽」 은 막히거나 밝게 열린 곳이고 캡처를 열어 확인했다.

### 당근

- 화면: https://www.daangn.com/kr/buy-sell/ (바탕 #000000, 캡처 `daangn-0.jpg`) · https://www.daangn.com/kr/ (바탕 #000000, 캡처 `daangn-1.jpg`) · https://www.daangn.com/kr/community/ (바탕 #000000, 캡처 `daangn-2.jpg`)
- 무채색 글자 단계 3개(글자 수 1% 넘는 색, 밝은 순): #f3f4f5 27.4% [링크 1447, 버튼 94, 제목 88, 머리 83] #000 위 19.07 · #16171b 위 16.26 / #dcdee3 65.6% [링크 3415, 메타 360, 푸터 328, 머리 44] #000 위 15.6 · #16171b 위 13.31 / #b0b3ba 5.8% [링크 312, 메타 48, 본문 5, 버튼 3] #000 위 10.0 · #16171b 위 8.53
- 유채색 글자(단계 밖): #ff6600 1.1%
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #f3f4f5(19.07 / 16.26) · 본문·링크 #dcdee3(15.6 / 13.31) · 메타·작은 글 #dcdee3(15.6 / 13.31) · 머리 #f3f4f5(19.07 / 16.26)
- 자리표시자: #868b94 「검색어를 입력하세요」 면 #1d2025(6.13 / 5.23)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 밝은 면 위 글자: #16171b 면 #f3f4f5
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--carotene-color-fg-brand-hover` #f60 · `--carotene-color-fg-brand-pressed` #f60 · `--carotene-color-fg-brand` #f60 · `--carotene-color-fg-disabled` #5b606a · `--carotene-color-fg-negative` #ff6e60 · `--carotene-color-fg-neutral-hover` #f3f4f5 · `--carotene-color-fg-neutral-inverted` #16171b · `--carotene-color-fg-neutral-muted` #dcdee3 · `--carotene-color-fg-neutral-pressed` #f3f4f5 · `--carotene-color-fg-neutral-subtle` #b0b3ba · `--carotene-color-fg-neutral` #f3f4f5 · `--carotene-color-fg-on-solid` #fff

### 치지직

- 화면: https://chzzk.naver.com/ (바탕 #141517, 캡처 `chzzk-0.jpg`) · https://chzzk.naver.com/category (바탕 #141517, 캡처 `chzzk-1.jpg`)
- 무채색 글자 단계 7개(글자 수 1% 넘는 색, 밝은 순): #ffffff 27.3% [링크 1536, 머리 62, 작은 글 40, 본문 36] #000 위 21.0 · #16171b 위 17.91 / #ffffff/90 4.0% [링크 217, 버튼 30] #000 위 16.67 · #16171b 위 14.49 / #dfe2ea 24.9% [링크 1190, 머리 337, 버튼 6] #000 위 16.2 · #16171b 위 13.82 / #ffffff/80 2.1% [링크 130] #000 위 13.08 · #16171b 위 11.7 / #9da5b6 18.3% [링크 517, 메타 249, 푸터 194, 머리 116] #000 위 8.49 · #16171b 위 7.24 / #9da5b6/70 5.0% [메타 308] #000 위 4.42 · #16171b 위 4.16 / #697183 9.7% [푸터 555, 머리 34, 버튼 6] #000 위 4.29 · #16171b 위 3.66
- 유채색 글자(단계 밖): #00ffa3/90 4.4% · #00cc82 2.0%
- 투명도: 알파 글자색 16.2% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #ffffff(21.0 / 17.91) · 본문·링크 #ffffff(21.0 / 17.91) · 메타·작은 글 #9da5b6/70(4.42 / 4.16) · 머리 #dfe2ea(16.2 / 13.82)
- 자리표시자: #545a69 「채널, 라이브, 동영상 검색」 면 #141517(3.04 / 2.6)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 밝은 면 위 글자: #0e0f10 면 #ffffff · #545a69 면 #ffffff
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--tnp--button-tooltip--text-color` #fff

### 카카오웹툰

- 화면: https://webtoon.kakao.com/ranking (바탕 #121212, 캡처 `kakaowebtoon-0.jpg`)
- 무채색 글자 단계 4개(글자 수 1% 넘는 색, 밝은 순): #ffffff 38.1% [링크 58, 본문 6] #000 위 21.0 · #16171b 위 17.91 / #ffffff ×opacity0.5 23.8% [링크 40] #000 위 5.32 · #16171b 위 5.25 / #5f5f5f 9.5% [작은 글 16] #000 위 3.29 · #16171b 위 2.8 / #444444 28.6% [본문 42, 링크 6] #000 위 2.16 · #16171b 위 1.84
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 23.8%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 없음 · 본문·링크 #ffffff(21.0 / 17.91) · 메타·작은 글 #5f5f5f(3.29 / 2.8) · 머리 없음
- 자리표시자: 이 쪽에 어두운 입력칸 없음(미확인)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 밝은 면 위 글자: #1c1c1c 면 #ffd200 · #1c1c1c 면 #ffffff

### velog

- 화면: https://velog.io/trending/week (바탕 #f8f9fa, 캡처 `velog-0.jpg`) · https://velog.io/@velopert/about (바탕 #ffffff, 캡처 `velog-1.jpg`)
- 셈에서 뺌: 밝게 열림

### 나무위키

- 화면: https://namu.wiki/w/%EB%A6%AC%EB%93%AC%20%EA%B2%8C%EC%9E%84 (바탕 #000000, 캡처 `namuwiki-0.jpg`)
- 무채색 글자 단계 1개(글자 수 1% 넘는 색, 밝은 순): #e0e0e0 70.3% [본문 7997, 메타 47, 제목 17, 링크 12] #000 위 15.91 · #16171b 위 13.57
- 유채색 글자(단계 밖): #ec9f19 29.4%
- 투명도: 알파 글자색 0.3% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #ec9f19(9.54 / 8.14) · 본문·링크 #e0e0e0(15.91 / 13.57) · 메타·작은 글 #e0e0e0(15.91 / 13.57) · 머리 없음
- 자리표시자: #757575 「여기에서 검색」 면 #000000(4.56 / 3.89)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--light-text-color` #212529 · `--dark-text-color` #e0e0e0 · `--text-color` #e0e0e0 · `--light-text-secondary-color` rgba(33,37,41,.749) · `--dark-text-secondary-color` hsla(0,0%,88%,.749) · `--text-secondary-color` hsla(0,0%,88%,.749) · `--espejo-text-light-color` #212529 · `--espejo-text-color` #e0e0e0 · `--espejo-text-secondary-color` hsla(0,0%,88%,.749) · `--espejo-text-tertiary-color` hsla(0,0%,88%,.502) · `--espejo-text-quaternary-color` hsla(0,0%,88%,.353) · `--espejo-nav-bar-text-color` #fff

### 토스증권

- 화면: https://www.tossinvest.com/ (바탕 #17171c, 캡처 `toss-0.jpg`) · https://www.tossinvest.com/screener (바탕 #17171c, 캡처 `toss-1.jpg`)
- 무채색 글자 단계 8개(글자 수 1% 넘는 색, 밝은 순): #dadfe9 4.0% [작은 글 265] #000 위 15.71 · #16171b 위 13.4 / #f2f6ff/90 52.1% [작은 글 2435, 링크 567, 버튼 229, 본문 181] #000 위 15.47 · #16171b 위 13.54 / #c3c3c6 6.5% [링크 326, 푸터 54, 버튼 27, 제목 18] #000 위 11.94 · #16171b 위 10.18 / #b3b8c2 5.3% [작은 글 354] #000 위 10.55 · #16171b 위 9.0 / #888d97 1.2% [링크 41, 본문 18, 작은 글 13, 버튼 11] #000 위 6.3 · #16171b 위 5.38 / #d8dfed/59 4.2% [작은 글 186, 머리 58, 링크 32, 버튼 5] #000 위 5.58 · #16171b 위 5.38 / #7e7e87 2.4% [푸터 157, 버튼 2] #000 위 5.22 · #16171b 위 4.45 / #d3e0f3/42 1.5% [버튼 86, 작은 글 15] #000 위 3.22 · #16171b 위 3.34
- 유채색 글자(단계 밖): #4391ff 14.4% · #f5445a 5.4%
- 투명도: 알파 글자색 59.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #c3c3c6(11.94 / 10.18) · 본문·링크 #f2f6ff/90(15.47 / 13.54) · 메타·작은 글 #f2f6ff/90(15.47 / 13.54) · 머리 #f2f6ff/90(15.47 / 13.54)
- 자리표시자: 이 쪽에 어두운 입력칸 없음(미확인)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 밝은 면 위 글자: #ffffff 면 #3182f6 · #fdfdfe/89 면 #e3e3e4

### 티빙

- 화면: https://www.tving.com/help/notice (바탕 #000000, 캡처 `tving-0.jpg`)
- 무채색 글자 단계 3개(글자 수 1% 넘는 색, 밝은 순): #ffffff/90 1.3% [머리 19] #000 위 16.83 · #16171b 위 14.62 / #a3a3a3 72.0% [본문 981, 버튼 51, 머리 35] #000 위 8.33 · #16171b 위 7.1 / #6e6e6e 23.2% [푸터 343] #000 위 4.12 · #16171b 위 3.51
- 유채색 글자(단계 밖): #ff0000 1.4%
- 투명도: 알파 글자색 1.3% · opacity 로 흐리게 0.8%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 없음 · 본문·링크 #a3a3a3(8.33 / 7.1) · 메타·작은 글 없음 · 머리 #a3a3a3(8.33 / 7.1)
- 자리표시자: 이 쪽에 어두운 입력칸 없음(미확인)
- 비활성: 보이는 비활성 요소 없음(미확인)

### 라프텔

- 화면: https://laftel.net/finder (바탕 #121212, 캡처 `laftel-0.jpg`)
- 무채색 글자 단계 4개(글자 수 1% 넘는 색, 밝은 순): #ffffff 1.1% [라벨 13] #000 위 21.0 · #16171b 위 17.91 / #f7f7f7 85.9% [링크 994, 본문 22, 제목 16, 버튼 6] #000 위 19.6 · #16171b 위 16.72 / #e2e2e2 10.9% [본문 132] #000 위 16.21 · #16171b 위 13.83 / #ababab 1.2% [버튼 12, 본문 3] #000 위 9.14 · #16171b 위 7.8
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 0.5%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #f7f7f7(19.6 / 16.72) · 본문·링크 #f7f7f7(19.6 / 16.72) · 메타·작은 글 없음 · 머리 없음
- 자리표시자: 이 쪽에 어두운 입력칸 없음(미확인)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 밝은 면 위 글자: #ffffff 면 #816bff
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--foreground-1` #F7F7F7 · `--foreground-2` #E2E2E2 · `--foreground-3` #ABABAB · `--foreground-4` #636363 · `--foreground-slight` #FFFFFF · `--foreground-disable` #636363

### 다음

- 화면: https://news.daum.net/ (바탕 #131416, 캡처 `daum-0.jpg`)
- 무채색 글자 단계 4개(글자 수 1% 넘는 색, 밝은 순): #ffffff 30.7% [링크 1012, 본문 66, 버튼 42, 머리 1] #000 위 21.0 · #16171b 위 17.91 / #ffffff/88 4.1% [링크 147, 버튼 3] #000 위 15.91 · #16171b 위 13.97 / #ffffff/72 56.2% [메타 2020, 머리 31] #000 위 10.59 · #16171b 위 9.64 / #898a8c 7.6% [메타 278] #000 위 6.08 · #16171b 위 5.18
- 투명도: 알파 글자색 61.3% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 없음 · 본문·링크 #ffffff(21.0 / 17.91) · 메타·작은 글 #ffffff/72(10.59 / 9.64) · 머리 #ffffff/72(10.59 / 9.64)
- 자리표시자: 이 쪽에 어두운 입력칸 없음(미확인)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 밝은 면 위 글자: #ffffff 면 #5b92fe

### 네이버 모바일

- 화면: https://m.naver.com/ (바탕 #edf0f4, 캡처 `naver-m-dark-0.jpg`)
- 셈에서 뺌: 밝게 열림

### 네이버페이

- 화면: https://pay.naver.com/ (바탕 #1f1f1f, 캡처 `naver-pay-0.jpg`)
- 셈에서 뺌: 보이는 글자가 거의 없음

### 왓챠

- 화면: https://pedia.watcha.com/ko-KR (바탕 #000000, 캡처 `watcha-0.jpg`)
- 무채색 글자 단계 5개(글자 수 1% 넘는 색, 밝은 순): #ffffff 24.8% [메타 58, 본문 29, 링크 27, 버튼 7] #000 위 21.0 · #16171b 위 17.91 / #babac1 21.0% [푸터 89, 머리 14] #000 위 10.88 · #16171b 위 9.28 / #ffffff/70 19.1% [푸터 94] #000 위 9.9 · #16171b 위 9.14 / #84868d 7.1% [머리 32, 버튼 3] #000 위 5.78 · #16171b 위 4.93 / #ffffff/40 27.1% [푸터 133] #000 위 3.66 · #16171b 위 3.83
- 투명도: 알파 글자색 47.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 없음 · 본문·링크 #ffffff(21.0 / 17.91) · 메타·작은 글 #ffffff(21.0 / 17.91) · 머리 #84868d(5.78 / 4.93)
- 자리표시자: 이 쪽에 어두운 입력칸 없음(미확인)
- 비활성: 보이는 비활성 요소 없음(미확인)

### 바이브

- 화면: https://vibe.naver.com/chart/total (바탕 #ffffff, 캡처 `vibe-0.jpg`)
- 무채색 글자 단계 4개(글자 수 1% 넘는 색, 밝은 순): #ffffff 29.0% [링크 431, 본문 245, 제목 10, 버튼 4] #000 위 21.0 · #16171b 위 17.91 / #cccccc 2.1% [머리 46, 버튼 3] #000 위 13.08 · #16171b 위 11.15 / #888888 37.3% [링크 871, 본문 19] #000 위 5.92 · #16171b 위 5.05 / #747474 1.0% [메타 14, 작은 글 11] #000 위 4.49 · #16171b 위 3.83
- 유채색 글자(단계 밖): #0000ee 28.9%
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #ffffff(21.0 / 17.91) · 본문·링크 #888888(5.92 / 5.05) · 메타·작은 글 #747474(4.49 / 3.83) · 머리 #cccccc(13.08 / 11.15)
- 자리표시자: #ffffff/30 「노래, 앨범, 아티스트 검색」 면 #1a1a1a(2.45 / 2.72)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 밝은 면 위 글자: #ffffff 면 #ff0050

### 리디

- 화면: 없음
- 못 잰 쪽: https://ridibooks.com/bestsellers/general 403

### 레진

- 화면: https://www.lezhin.com/ko/ranking (바탕 #111115, 캡처 `lezhin-0.jpg`)
- 무채색 글자 단계 3개(글자 수 1% 넘는 색, 밝은 순): #ffffff 19.0% [링크 26, 본문 5, 버튼 3] #000 위 21.0 · #16171b 위 17.91 / #dadadd 6.7% [링크 12] #000 위 15.05 · #16171b 위 12.84 / #a1a1a9 18.4% [버튼 33] #000 위 8.19 · #16171b 위 6.98
- 유채색 글자(단계 밖): #66dc7e 8.4% · #dd72fa 41.9% · #ff5254 5.6%
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 없음 · 본문·링크 #dd72fa(7.86 / 6.71) · 메타·작은 글 없음 · 머리 없음
- 자리표시자: 이 쪽에 어두운 입력칸 없음(미확인)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--text-default` #fff · `--text-soft` #dadadd · `--text-subtle` #a1a1a9 · `--text-muted` #6f6f77 · `--text-disabled` #36363a · `--text-alpha` hsla(0,0%,100%,.55) · `--text-inverted` #09090b · `--text-inverted-alpha` rgba(17,17,21,.8) · `--text-white` #fff · `--text-white-subtle` #e9e9ec · `--text-white-muted` #a1a1a9 · `--text-white-alpha` hsla(0,0%,100%,.8)

### 클래스101

- 화면: https://class101.net/ko (바탕 #141414, 캡처 `class101-0.jpg`)
- 무채색 글자 단계 4개(글자 수 1% 넘는 색, 밝은 순): #ffffff 46.6% [제목 262, 본문 26] #000 위 21.0 · #16171b 위 17.91 / #fafafa 46.8% [버튼 135, 제목 72, 링크 47, 본문 35] #000 위 20.12 · #16171b 위 17.16 / #fafafa/65 2.9% [본문 13, 제목 5] #000 위 8.23 · #16171b 위 7.79 / #808080 1.6% [버튼 10] #000 위 5.32 · #16171b 위 4.53
- 유채색 글자(단계 밖): #ff6f3d 1.6%
- 투명도: 알파 글자색 2.9% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #ffffff(21.0 / 17.91) · 본문·링크 #fafafa(20.12 / 17.16) · 메타·작은 글 없음 · 머리 없음
- 자리표시자: 이 쪽에 어두운 입력칸 없음(미확인)
- 비활성: 보이는 비활성 요소 없음(미확인)

### 웨이브

- 화면: https://www.wavve.com/ (바탕 #1b1b1b, 캡처 `wavve-0.jpg`)
- 셈에서 뺌: 첫 화면을 광고 팝업이 가림(캡처 확인)

### DAK.GG

- 화면: https://dak.gg/ (바탕 #161618, 캡처 `dakgg-0.jpg`)
- 무채색 글자 단계 5개(글자 수 1% 넘는 색, 밝은 순): #ffffff 57.4% [제목 202, 버튼 28, 머리 6] #000 위 21.0 · #16171b 위 17.91 / #cfd1d7 1.5% [머리 6] #000 위 13.75 · #16171b 위 11.73 / #a5a8b4 13.4% [링크 44, 작은 글 11] #000 위 8.86 · #16171b 위 7.56 / #999999 9.7% [링크 40] #000 위 7.37 · #16171b 위 6.29 / #848999 18.0% [푸터 53, 버튼 21] #000 위 6.02 · #16171b 위 5.13
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #ffffff(21.0 / 17.91) · 본문·링크 #a5a8b4(8.86 / 7.56) · 메타·작은 글 #a5a8b4(8.86 / 7.56) · 머리 #ffffff(21.0 / 17.91)
- 자리표시자: 이 쪽에 어두운 입력칸 없음(미확인)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--hsds-button-color-blue-outline-text` #0077cc · `--hsds-button-color-blue-outline-textHover` #005ca4 · `--hsds-button-color-blue-outline-textSeamlessHover` #034077 · `--hsds-button-color-red-outline-text` #e9074b · `--hsds-button-color-red-outline-textHover` #c5003b · `--hsds-button-color-red-outline-textSeamlessHover` #c5003b · `--hsds-button-color-green-outline-text` #248451 · `--hsds-button-color-green-outline-textHover` #106236 · `--hsds-button-color-green-outline-textSeamlessHover` #003c1c · `--hsds-button-color-grey-outline-text` #556575 · `--hsds-button-color-grey-outline-textHover` #405261 · `--hsds-button-color-grey-outline-textSeamlessHover` #1d2b36

### 로스트아크

- 화면: https://lostark.game.onstove.com/News/Notice/List (바탕 #ffffff, 캡처 `lostark-0.jpg`)
- 셈에서 뺌: 밝게 열림(캡처 확인)

### 메이플스토리

- 화면: https://maplestory.nexon.com/N23Ranking/World/Total (바탕 #ffffff, 캡처 `maple-0.jpg`)
- 셈에서 뺌: 밝게 열림(캡처 확인)

### Linear

- 화면: https://linear.app/changelog (바탕 #08090a, 캡처 `linear-0.jpg`) · https://linear.app/contact/sales (바탕 #08090a, 캡처 `linear-1.jpg`)
- 무채색 글자 단계 4개(글자 수 1% 넘는 색, 밝은 순): #f7f8f8 16.4% [제목 123, 버튼 85, 링크 50, 본문 49] #000 위 19.74 · #16171b 위 16.83 / #d0d6e0 60.9% [본문 1257, 제목 23, 버튼 16] #000 위 14.38 · #16171b 위 12.26 / #8a8f98 21.4% [푸터 270, 라벨 62, 머리 55, 작은 글 38] #000 위 6.46 · #16171b 위 5.51 / #62666d 1.3% [푸터 26, 버튼 1] #000 위 3.64 · #16171b 위 3.11
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #f7f8f8(19.74 / 16.83) · 본문·링크 #d0d6e0(14.38 / 12.26) · 메타·작은 글 #8a8f98(6.46 / 5.51) · 머리 #8a8f98(6.46 / 5.51)
- 자리표시자: #8a8f98 「Kevin Flynn」 면 #141516(6.46 / 5.51)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 밝은 면 위 글자: #08090a 면 #e5e5e6
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--kbd-text` var(--color-bg-primary) · `--menu-text` #e6e8ec · `--menu-text-active` #fff · `--text-large` 1.0625rem / 1.6 "Inter Variable", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Open Sans", "Helvetica Neue", sans-serif · `--text-regular` .9375rem / 1.6 "Inter Variable", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Open Sans", "Helvetica Neue", sans-serif · `--text-small` .875rem / calc(21 / 14) "Inter Variable", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Open Sans", "Helvetica Neue", sans-serif · `--text-mini` .8125rem / 1.5 "Inter Variable", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Open Sans", "Helvetica Neue", sans-serif · `--text-micro` .75rem / 1.4 "Inter Variable", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Open Sans", "Helvetica Neue", sans-serif · `--text-tiny` .625rem / 1.5 "Inter Variable", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Open Sans", "Helvetica Neue", sans-serif · `--color-text-primary` #f7f8f8 · `--color-text-secondary` #d0d6e0 · `--color-text-tertiary` #8a8f98

### Vercel

- 화면: https://vercel.com/docs/getting-started-with-vercel (바탕 #000000, 캡처 `vercel-0.jpg`) · https://vercel.com/contact/sales (바탕 #000000, 캡처 `vercel-1.jpg`)
- 무채색 글자 단계 4개(글자 수 1% 넘는 색, 밝은 순): #ffffff 1.9% [본문 85, 링크 36, 버튼 4] #000 위 21.0 · #16171b 위 17.91 / #ededed 43.9% [본문 1976, 제목 354, 링크 238, 작은 글 78] #000 위 17.94 · #16171b 위 15.3 / #a1a1a1 44.6% [머리 1565, 본문 1037, 링크 233, 버튼 27] #000 위 8.13 · #16171b 위 6.93 / #7d7d7d 3.9% [본문 122, 머리 106, 제목 12, 버튼 10] #000 위 5.1 · #16171b 위 4.35
- 유채색 글자(단계 밖): #62c073 4.9%
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #ededed(17.94 / 15.3) · 본문·링크 #ededed(17.94 / 15.3) · 메타·작은 글 #62c073(9.31 / 7.94) · 머리 #a1a1a1(8.13 / 6.93)
- 자리표시자: #8f8f8f 「Tammy Triangle」 면 #0a0a0a(6.49 / 5.54) · #858585 「Tell us about your current sta」 면 #0a0a0a(5.69 / 4.85)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 밝은 면 위 글자: #0a0a0a 면 #ededed
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--context-card-tip-stroke` #dbdbdb · `--themed-fg` var(--ds-gray-1000) · `--geist-console-text-color-default` #fff · `--geist-console-text-color-blue` #3291ff · `--geist-console-text-color-pink` #eb367f · `--geist-console-text-color-purple` #7928ca · `--geist-foreground` #fff · `--geist-selection-text-color` hsla(0, 0%, 10%, 1) · `--develop-text` #0a72ef · `--preview-text` #de1d8d · `--ship-text` #ff5b4f · `--ds-contrast-fg` #fff

### GitHub

- 화면: https://github.com/facebook/react/issues (바탕 #0d1117, 캡처 `github-0.jpg`)
- 무채색 글자 단계 4개(글자 수 1% 넘는 색, 밝은 순): #ffffff 2.1% [버튼 38, 링크 24, 제목 15, 머리 15] #000 위 21.0 · #16171b 위 17.91 / #f0f6fc 51.3% [제목 1895, 머리 176, 본문 159, 버튼 16] #000 위 19.29 · #16171b 위 16.45 / #d2c3f9 3.9% [버튼 171] #000 위 12.91 · #16171b 위 11.01 / #9198a1 41.1% [작은 글 968, 버튼 725, 머리 46, 링크 30] #000 위 7.21 · #16171b 위 6.15
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #f0f6fc(19.29 / 16.45) · 본문·링크 #f0f6fc(19.29 / 16.45) · 메타·작은 글 #9198a1(7.21 / 6.15) · 머리 #f0f6fc(19.29 / 16.45)
- 자리표시자: #9198a1 「Search issues」 면 #0d1117(7.21 / 6.15)
- 비활성: a 「Previous」 #656c76 opacity 1 → #656c76 면 #0d1117
- 밝은 면 위 글자: #000000 면 #ffffff
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--buttonCounter-danger-fgColor-rest` #f85149 · `--fgColor-danger` #f85149 · `--button-danger-fgColor-disabled` #f8514980 · `--button-danger-fgColor-rest` #fa5e55 · `--button-inactive-fgColor` #9198a1 · `--buttonCounter-danger-fgColor-disabled` #f8514980 · `--buttonCounter-outline-fgColor-rest` #388bfd · `--codeMirror-syntax-fgColor-constant` #79c0ff · `--codeMirror-syntax-fgColor-entity` #d2a8ff · `--codeMirror-syntax-fgColor-keyword` #ff7b72 · `--codeMirror-syntax-fgColor-storage` #ff7b72 · `--codeMirror-syntax-fgColor-string` #a5d6ff

### Raycast

- 화면: https://www.raycast.com/store (바탕 #07080a, 캡처 `raycast-0.jpg`)
- 무채색 글자 단계 4개(글자 수 1% 넘는 색, 밝은 순): #ffffff 6.7% [링크 112, 제목 57] #000 위 21.0 · #16171b 위 17.91 / #9c9c9d 67.7% [메타 1542, 링크 154, 작은 글 20] #000 위 7.66 · #16171b 위 6.53 / #6a6b6c 19.6% [메타 368, 본문 104, 버튼 18, 머리 7] #000 위 3.93 · #16171b 위 3.35 / #ffffff/40 6.0% [메타 153] #000 위 3.66 · #16171b 위 3.83
- 투명도: 알파 글자색 6.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #ffffff(21.0 / 17.91) · 본문·링크 #9c9c9d(7.66 / 6.53) · 메타·작은 글 #9c9c9d(7.66 / 6.53) · 머리 #6a6b6c(3.93 / 3.35)
- 자리표시자: 이 쪽에 어두운 입력칸 없음(미확인)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 밝은 면 위 글자: #2f3031 면 #e6e6e6
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--color-fg` #f4f4f6 · `--color-fg-200` #c2c7ca · `--color-fg-300` #78787c · `--color-fg-400` #5e6366 · `--color-button-fg` #18191a

### Spotify

- 화면: https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF (바탕 #121212, 캡처 `spotify-0.jpg`)
- 무채색 글자 단계 4개(글자 수 1% 넘는 색, 밝은 순): #ffffff 26.7% [링크 442, 머리 130, 본문 37, 제목 27] #000 위 21.0 · #16171b 위 17.91 / #b3b3b3 53.9% [링크 800, 본문 284, 메타 96, 머리 64] #000 위 10.02 · #16171b 위 8.54 / #ffffff ×opacity0.4 3.0% [링크 72] #000 위 3.66 · #16171b 위 3.83 / #b3b3b3 ×opacity0.4 10.8% [링크 176, 본문 63, 메타 24] #000 위 2.3 · #16171b 위 2.41
- 유채색 글자(단계 밖): #abd0ff 5.4%
- 투명도: 알파 글자색 0.2% · opacity 로 흐리게 13.8%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #ffffff(21.0 / 17.91) · 본문·링크 #b3b3b3(10.02 / 8.54) · 메타·작은 글 #b3b3b3(10.02 / 8.54) · 머리 #ffffff(21.0 / 17.91)
- 자리표시자: #b3b3b3 「What do you want to play?」 면 #1f1f1f(10.02 / 8.54)
- 비활성: button 「Enable shuffle」 #b3b3b3 opacity 0.3 → #363636 면 #000000 · button 「Previous」 #b3b3b3 opacity 0.3 → #363636 면 #000000 · button 「Pause」 #b3b3b3 opacity 1 → #b3b3b3 면 #000000
- 밝은 면 위 글자: #000000 면 #eeeeee · #000000 면 #ffffff

### YouTube

- 화면: https://www.youtube.com/@YouTube (바탕 #ffffff, 캡처 `youtube-0.jpg`)
- 셈에서 뺌: 다크 선호에도 밝게 열림(캡처 확인)

### Twitch

- 화면: https://www.twitch.tv/directory (바탕 #0e0e10, 캡처 `twitch-0.jpg`)
- 무채색 글자 단계 3개(글자 수 1% 넘는 색, 밝은 순): #ffffff 11.2% [본문 127, 푸터 66, 링크 9, 버튼 7] #000 위 21.0 · #16171b 위 17.91 / #efeff1 48.4% [제목 410, 버튼 375, 머리 123, 라벨 6] #000 위 18.29 · #16171b 위 15.6 / #d3d3d9 30.6% [링크 387, 머리 189, 버튼 2] #000 위 14.09 · #16171b 위 12.02
- 유채색 글자(단계 밖): #bf94ff 9.4%
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #efeff1(18.29 / 15.6) · 본문·링크 #d3d3d9(14.09 / 12.02) · 메타·작은 글 없음 · 머리 #d3d3d9(14.09 / 12.02)
- 자리표시자: #ffffff/70 「Search」 면 #18181b(9.9 / 9.14)
- 비활성: button 「Search Button」 #efeff1 opacity 1 → #efeff1 면 #2e2e35
- 밝은 면 위 글자: #000000 면 #ff75e6 · #000000 면 #ffffff
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--color-text-base` #efeff1 · `--color-text-alt-2` #d3d3d9 · `--color-text-link` #bf94ff · `--color-text-link-hover` #a970ff · `--color-text-link-active` #bf94ff · `--color-text-link-focus` #a970ff · `--color-text-link-visited` #bf94ff · `--color-text-live` #ff8280 · `--color-text-alert` #ff8280 · `--color-text-prime` #0e9bd8 · `--color-text-error` #ff8280 · `--color-text-warn` #e69900

### Reddit

- 화면: 없음
- 못 잰 쪽: https://www.reddit.com/r/programming/ 200

### Supabase

- 화면: https://supabase.com/blog (바탕 #131413, 캡처 `supabase-0.jpg`) · https://supabase.com/dashboard/sign-in (바탕 #131413, 캡처 `supabase-1.jpg`)
- 무채색 글자 단계 3개(글자 수 1% 넘는 색, 밝은 순): #edefee 59.6% [제목 2395, 본문 153, 버튼 72, 머리 53] #000 위 18.18 · #16171b 위 15.51 / #bcbdbc 14.1% [링크 594, 제목 23, 작은 글 22, 머리 6] #000 위 11.14 · #16171b 위 9.5 / #989a99 26.3% [링크 1113, 작은 글 87] #000 위 7.42 · #16171b 위 6.33
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #edefee(18.18 / 15.51) · 본문·링크 #989a99(7.42 / 6.33) · 메타·작은 글 #989a99(7.42 / 6.33) · 머리 #edefee(18.18 / 15.51)
- 자리표시자: #989a99 「Search blog」 면 #111211(7.42 / 6.33)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--color-foreground-lighter` oklch(calc(.19 + calc(.95 - .19) * calc(.65 + (1 - .65) * max(0,calc((.5 - .5) / .5)) - .65 * .5 * max(0,calc(calc((.5 - .5) / .5) * -1)))) calc(.005 * .55) calc(157.5 + 0)) · `--foreground` oklch(calc(.19 + calc(.95 - .19) * calc(1 - (1 - .9) * max(0,calc(calc((.5 - .5) / .5) * -1)))) calc(.005 * .55) calc(157.5 + 0)) · `--foreground-contrast` oklch(.19 calc(.005 * .55) calc(157.5 + 0)) · `--card-foreground` oklch(calc(.19 + calc(.95 - .19) * calc(1 - (1 - .9) * max(0,calc(calc((.5 - .5) / .5) * -1)))) calc(.005 * .55) calc(157.5 + 0)) · `--popover-foreground` oklch(calc(.19 + calc(.95 - .19) * calc(1 - (1 - .9) * max(0,calc(calc((.5 - .5) / .5) * -1)))) calc(.005 * .55) calc(157.5 + 0)) · `--primary-foreground` oklch(min(.19,.95) calc(.005 * .45) 157.5) · `--primary-solid-foreground` oklch(.95 .00275 157.5) · `--secondary-foreground` oklch(calc(.19 + calc(.95 - .19) * calc(1 - (1 - .9) * max(0,calc(calc((.5 - .5) / .5) * -1)))) calc(.005 * .55) calc(157.5 + 0)) · `--tertiary-foreground` oklch(calc(.19 + calc(.95 - .19) * calc(.65 + (1 - .65) * max(0,calc((.5 - .5) / .5)) - .65 * .5 * max(0,calc(calc((.5 - .5) / .5) * -1)))) calc(.005 * .55) calc(157.5 + 0)) · `--muted-foreground` oklch(calc(.19 + calc(.95 - .19) * calc(.8 + (1 - .8) * max(0,calc((.5 - .5) / .5)) - .8 * .5 * max(0,calc(calc((.5 - .5) / .5) * -1)))) calc(.005 * .55) calc(157.5 + 0)) · `--accent-foreground` oklch(calc(.19 + calc(.95 - .19) * calc(1 - (1 - .9) * max(0,calc(calc((.5 - .5) / .5) * -1)))) calc(.005 * .55) calc(157.5 + 0)) · `--warning-foreground` oklch(from oklch(.8 .14 clamp(65,calc(75 + (157.5 - 157.5) * .15),95)) clamp(.12,calc((.62 - l) * 100),.99) calc(c * .08) h)

### Steam

- 화면: https://store.steampowered.com/charts/mostplayed (바탕 #0f1924, 캡처 `steam-0.jpg`)
- 무채색 글자 단계 10개(글자 수 1% 넘는 색, 밝은 순): #ffffff 20.6% [링크 87, 본문 67, 작은 글 34, 제목 11] #000 위 21.0 · #16171b 위 17.91 / #f7f8f8 1.6% [링크 15] #000 위 19.74 · #16171b 위 16.83 / #f1f2f3 1.9% [작은 글 18] #000 위 18.74 · #16171b 위 15.98 / #e5e4dc 1.3% [머리 13] #000 위 16.46 · #16171b 위 14.04 / #dcdedf 2.2% [머리 12, 버튼 9] #000 위 15.56 · #16171b 위 13.27 / #c6d4df 34.2% [본문 330] #000 위 13.88 · #16171b 위 11.84 / #c3d3d8 1.1% [링크 11] #000 위 13.63 · #16171b 위 11.62 / #bdbdbd 3.4% [링크 19, 본문 14] #000 위 11.18 · #16171b 위 9.53 / #8b929a 5.0% [작은 글 48] #000 위 6.68 · #16171b 위 5.69 / #8a8a8a 24.9% [푸터 182, 버튼 35, 링크 24] #000 위 6.08 · #16171b 위 5.19
- 유채색 글자(단계 밖): #beee11 2.5%
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #ffffff(21.0 / 17.91) · 본문·링크 #c6d4df(13.88 / 11.84) · 메타·작은 글 #8b929a(6.68 / 5.69) · 머리 #e5e4dc(16.46 / 14.04)
- 자리표시자: #dcdedf 「Search the store」 면 #2d363f(15.56 / 13.27)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--color-text-secondary` #d3d5d980 · `--color-text-light-title` #f1f2f3 · `--color-text-light-subtitle` #d6d9dc · `--color-text-light-body` #acb2b8 · `--color-text-light-description` #9a9fa5 · `--color-text-light-note` #636b74 · `--color-text-red-title` #f30000 · `--color-text-red-subtitle` #db0000 · `--color-text-red-body` #c40000 · `--color-text-red-description` #af0000 · `--color-text-red-note` #6b0000 · `--color-text-yellow-title` #f6eeb4

### osu!

- 화면: https://osu.ppy.sh/rankings/osu/performance (바탕 #171c17, 캡처 `osu-0.jpg`)
- 무채색 글자 단계 3개(글자 수 1% 넘는 색, 밝은 순): #ffffff 19.2% [작은 글 466, 푸터 57, 링크 55, 본문 11] #000 위 21.0 · #16171b 위 17.91 / #aad9a6 15.5% [링크 453, 머리 24] #000 위 13.18 · #16171b 위 11.25 / #91a38f 63.9% [작은 글 1943, 푸터 21] #000 위 7.84 · #16171b 위 6.69
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 0.3%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 없음 · 본문·링크 #aad9a6(13.18 / 11.25) · 메타·작은 글 #91a38f(7.84 / 6.69) · 머리 #aad9a6(13.18 / 11.25)
- 자리표시자: 이 쪽에 어두운 입력칸 없음(미확인)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 밝은 면 위 글자: #232a22 면 #73ff66
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--forum-text` #6cf · `--forum-text-hover` #86e · `--comments-fg` hsl(var(--hsl-c1))

### Chess.com

- 화면: https://www.chess.com/leaderboard/live (바탕 #302e2b, 캡처 `chesscom-0.jpg`)
- 무채색 글자 단계 4개(글자 수 1% 넘는 색, 밝은 순): #ffffff 10.9% [링크 100, 본문 59, 제목 31, 작은 글 15] #000 위 21.0 · #16171b 위 17.91 / #ffffff/85 2.0% [머리 40] #000 위 14.88 · #16171b 위 13.07 / #ffffff/72 55.0% [링크 1054, 본문 23, 머리 15] #000 위 10.59 · #16171b 위 9.64 / #ffffff/50 8.6% [머리 143, 버튼 21, 제목 6] #000 위 5.32 · #16171b 위 5.25
- 유채색 글자(단계 밖): #81b64c 12.0% · #fa412d 11.6%
- 투명도: 알파 글자색 65.5% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #ffffff(21.0 / 17.91) · 본문·링크 #ffffff/72(10.59 / 9.64) · 메타·작은 글 #ffffff(21.0 / 17.91) · 머리 #ffffff/50(5.32 / 5.25)
- 자리표시자: 이 쪽에 어두운 입력칸 없음(미확인)
- 비활성: button 「Previous Page」 #ffffff/72 opacity 0.5 → None 면 None
- 밝은 면 위 글자: #ffffff 면 #f7c631 · #ffffff 면 #bebdb9
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--textColor` var(--color-neutrals-white) · `--textColorHover` var(--color-neutrals-white) · `--buttonTextShadow` var(--color-transparent-black-20) · `--chip-translucent-fg` var(--color-aqua-400) · `--textShadow` var(--elevation-foreground) · `--text-shadow` var(--color-gold-500) · `--color-text` var(--color-gold-300) · `--optionTextColor` var(--color-gray-800) · `--tooltipTextColor` var(--color-text-boldest) · `--color-text-boldest` #FFFFFF · `--color-text-bolder` rgba(255, 255, 255, .85) · `--color-text-default` rgba(255, 255, 255, .72)

### Lichess

- 화면: 없음
- 못 잰 쪽: https://lichess.org/player 403

### MDN

- 화면: https://developer.mozilla.org/en-US/docs/Web/CSS/color (바탕 #18191b, 캡처 `mdn-0.jpg`)
- 무채색 글자 단계 1개(글자 수 1% 넘는 색, 밝은 순): #ffffff 94.0% [머리 4727, 본문 1225, 제목 80, 버튼 43] #000 위 21.0 · #16171b 위 17.91
- 유채색 글자(단계 밖): #a4cefe 6.0%
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #ffffff(21.0 / 17.91) · 본문·링크 #ffffff(21.0 / 17.91) · 메타·작은 글 #ffffff(21.0 / 17.91) · 머리 #ffffff(21.0 / 17.91)
- 자리표시자: 이 쪽에 어두운 입력칸 없음(미확인)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--color-text-primary` light-dark(#000,#fff) · `--color-text-secondary` light-dark(#51565d,#c3c7cb) · `--color-text-red` light-dark(#b7102c,#fc7d92) · `--color-text-orange` light-dark(#c2570a,#febe8f) · `--color-text-yellow` light-dark(#97770c,#fae49e) · `--color-text-green` light-dark(#065b29,#70eba3) · `--color-text-blue` light-dark(#044c9f,#a4cefe) · `--color-text-purple` light-dark(#5f1fad,#d8b8ff) · `--menu-tab-text` var(--color-text-blue)

### Mastodon

- 화면: https://mastodon.social/explore (바탕 #07060e, 캡처 `mastodon-0.jpg`)
- 무채색 글자 단계 5개(글자 수 1% 넘는 색, 밝은 순): #eeedf3 70.6% [본문 668, 메타 246, 링크 146, 머리 78] #000 위 18.04 · #16171b 위 15.39 / #d1c7ff 3.7% [링크 60] #000 위 13.32 · #16171b 위 11.36 / #eeedf3/80 12.9% [머리 169, 링크 37, 메타 2, 작은 글 1] #000 위 11.33 · #16171b 위 10.12 / #eeedf3/70 8.1% [머리 77, 제목 54] #000 위 8.68 · #16171b 위 8.01 / #eeedf3 ×opacity0.7 4.7% [버튼 77] #000 위 8.68 · #16171b 위 8.01
- 투명도: 알파 글자색 21.0% · opacity 로 흐리게 4.7%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #eeedf3/70(8.68 / 8.01) · 본문·링크 #eeedf3(18.04 / 15.39) · 메타·작은 글 #eeedf3(18.04 / 15.39) · 머리 #eeedf3/80(11.33 / 10.12)
- 자리표시자: #eeedf3/70 「Search」 면 #15151e(8.68 / 8.01)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 밝은 면 위 글자: #15151e 면 #d1c7ff
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--base-color-fg` #eeedf3 · `--base-color-fg-on-accent` #15151e · `--base-color-fg-accent` #d1c7ff · `--color-text-primary` #eeedf3 · `--color-text-secondary` rgb(from #eeedf3 r g b/80%) · `--color-text-tertiary` rgb(from #eeedf3 r g b/70%) · `--color-text-inverted` #15151e · `--color-text-brand` #d1c7ff · `--color-text-on-brand-base` #15151e · `--color-text-on-overlay` #eeedf3 · `--color-text-error` #ffc9c9 · `--color-text-on-error-base` #15151e

### Hugging Face

- 화면: https://huggingface.co/models (바탕 #0b0f19, 캡처 `huggingface-0.jpg`)
- 무채색 글자 단계 4개(글자 수 1% 넘는 색, 밝은 순): #ffffff 6.1% [버튼 14, 머리 7] #000 위 21.0 · #16171b 위 17.91 / #e5e7eb 5.2% [머리 12, 제목 6] #000 위 16.96 · #16171b 위 14.47 / #d1d5dc 19.1% [머리 66] #000 위 14.26 · #16171b 위 12.16 / #99a1af 68.7% [버튼 103, 본문 64, 머리 61, 라벨 9] #000 위 8.07 · #16171b 위 6.88
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #e5e7eb(16.96 / 14.47) · 본문·링크 #99a1af(8.07 / 6.88) · 메타·작은 글 없음 · 머리 #d1d5dc(14.26 / 12.16)
- 자리표시자: #99a1af 「Filter by name」 면 #0b0f19(8.07 / 6.88)
- 비활성: 보이는 비활성 요소 없음(미확인)

### GitLab

- 화면: https://docs.gitlab.com/user/project/issues/ (바탕 #18171d, 캡처 `gitlab-0.jpg`)
- 무채색 글자 단계 3개(글자 수 1% 넘는 색, 밝은 순): #ffffff 12.9% [푸터 300, 버튼 36, 제목 20] #000 위 21.0 · #16171b 위 17.91 / #ecebea 81.7% [머리 1405, 본문 774, 버튼 78] #000 위 17.64 · #16171b 위 15.04 / #c1bfbe 1.8% [머리 50] #000 위 11.46 · #16171b 위 9.78
- 유채색 글자(단계 밖): #9dc7f1 3.6%
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #ffffff(21.0 / 17.91) · 본문·링크 #ecebea(17.64 / 15.04) · 메타·작은 글 없음 · 머리 #ecebea(17.64 / 15.04)
- 자리표시자: #8a8888 「Search topics, API and CI/CD r」 면 #101014(5.96 / 5.08)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 밝은 면 위 글자: #171321 면 #ffffff · #7759c2 면 #ffffff
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--gl-avatar-fallback-text-color-red` #fcb5aa · `--gl-avatar-fallback-text-color-purple` #cbbbf2 · `--gl-avatar-fallback-text-color-blue` #9dc7f1 · `--gl-avatar-fallback-text-color-green` #91d4a8 · `--gl-avatar-fallback-text-color-orange` #e9be74 · `--gl-avatar-fallback-text-color-neutral` #c1bfbe · `--gl-badge-muted-text-color-default` #18171d · `--gl-badge-muted-text-color-hover` #18171d · `--gl-badge-muted-text-color-active` #18171d · `--gl-badge-neutral-text-color-default` #18171d · `--gl-badge-neutral-text-color-hover` #18171d · `--gl-badge-neutral-text-color-active` #18171d

### Apple Music

- 화면: https://music.apple.com/kr/browse (바탕 #1f1f1f, 캡처 `apple-music-0.jpg`)
- 무채색 글자 단계 3개(글자 수 1% 넘는 색, 밝은 순): #ffffff 5.3% [메타 131] #000 위 21.0 · #16171b 위 17.91 / #ffffff/92 58.5% [링크 1185, 제목 236, 버튼 26] #000 위 17.62 · #16171b 위 15.17 / #ffffff/64 36.2% [메타 623, 링크 235, 작은 글 39] #000 위 8.33 · #16171b 위 7.81
- 투명도: 알파 글자색 94.7% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #ffffff/92(17.62 / 15.17) · 본문·링크 #ffffff/92(17.62 / 15.17) · 메타·작은 글 #ffffff/64(8.33 / 7.81) · 머리 없음
- 자리표시자: 이 쪽에 어두운 입력칸 없음(미확인)
- 비활성: button 「이전」 #ffffff/92 opacity 1 → #ededed 면 #1f1f1f · button 「재생」 #ffffff/92 opacity 0.4 → #717171 면 #1f1f1f · button 「다음」 #ffffff/92 opacity 1 → #ededed 면 #1f1f1f
- 밝은 면 위 글자: #000000/56 면 #ffffff · #000000/88 면 #ffffff
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--contextMenuBorderColor` #ffffff1a · `--contextMenuTextColor` #ffffffd9 · `--contextMenuOverrideTextColor` #ff3b30 · `--segmentedControlSelectedText` #ffffffd9 · `--segmentedControlSelectedText-default_IC` #000 · `--sk-body-text-color` #ffffffeb · `--sk-headline-text-color` #ffffffeb · `--socialProfileButtonTextColor` #000 · `--navigation-item-text-color` var(--drag-over-color) · `--text-color` var(--button-pill-color) · `--contextMenuEllipsisFillOverride` var(--systemPrimary) · `--buttonTextColor` var(--buttonTextColorOverride,#fff)

### Disney+

- 화면: https://www.disneyplus.com/ko-kr (바탕 #040714, 캡처 `disneyplus-0.jpg`)
- 무채색 글자 단계 4개(글자 수 1% 넘는 색, 밝은 순): #ffffff 47.9% [링크 416] #000 위 21.0 · #16171b 위 17.91 / #fafafa 14.4% [제목 66, 본문 56, 머리 3] #000 위 20.12 · #16171b 위 17.16 / #f9f9f9 5.9% [링크 28, 제목 23] #000 위 19.95 · #16171b 위 17.01 / #b7b8bd 31.9% [본문 155, 작은 글 122] #000 위 10.6 · #16171b 위 9.04
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #fafafa(20.12 / 17.16) · 본문·링크 #ffffff(21.0 / 17.91) · 메타·작은 글 #b7b8bd(10.6 / 9.04) · 머리 #fafafa(20.12 / 17.16)
- 자리표시자: 이 쪽에 어두운 입력칸 없음(미확인)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 밝은 면 위 글자: #17171c 면 #33ddff
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--identity-colors-button_primary_default_text` #FFFFFF · `--identity-colors-button_primary_hover_text` #FFFFFF · `--identity-colors-button_primary_active_text` #FFFFFF · `--identity-colors-button_primary_disabled_text` #FFFFFF99 · `--identity-colors-button_primary_focus_text` #FFFFFF · `--identity-colors-button_primary_loading_text` #FFFFFF · `--identity-colors-button_secondary_default_text` #000000 · `--identity-colors-button_secondary_hover_text` #000000 · `--identity-colors-button_secondary_active_text` #000000 · `--identity-colors-button_secondary_disabled_text` #AEB0B5 · `--identity-colors-button_secondary_focus_text` #000000 · `--identity-colors-button_secondary_loading_text` #000000

### Letterboxd

- 화면: 없음
- 못 잰 쪽: https://letterboxd.com/films/popular/ 200

### Epic Games Store

- 화면: 없음
- 못 잰 쪽: https://store.epicgames.com/ko/browse 403

### Binance

- 화면: https://www.binance.com/ko/markets/overview (바탕 #181a20, 캡처 `binance-0.jpg`)
- 무채색 글자 단계 3개(글자 수 1% 넘는 색, 밝은 순): #eaecef 35.9% [본문 385, 제목 210, 링크 134, 메타 107] #000 위 17.74 · #16171b 위 15.13 / #929aa5 40.6% [푸터 856, 버튼 190, 링크 6, 본문 3] #000 위 7.39 · #16171b 위 6.3 / #707a8a 18.7% [작은 글 355, 링크 69, 메타 62] #000 위 4.84 · #16171b 위 4.13
- 유채색 글자(단계 밖): #2ebd85 2.4% · #f6465d 2.3%
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #eaecef(17.74 / 15.13) · 본문·링크 #eaecef(17.74 / 15.13) · 메타·작은 글 #707a8a(4.84 / 4.13) · 머리 #eaecef(17.74 / 15.13)
- 자리표시자: 이 쪽에 어두운 입력칸 없음(미확인)
- 비활성: div 「」 #333b47 opacity 1 → #333b47 면 #181a20
- 밝은 면 위 글자: #202630 면 #fcd535
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--color-DisableText` #4F5867 · `--color-TertiaryText` #707A8A · `--color-SecondaryText` #929AA5 · `--color-PrimaryText` #EAECEF · `--color-RedGreenBgText` #FFFFFF · `--color-EmphasizeText` #FF693D · `--color-TextOnGray` #EAECEF · `--color-TextOnYellow` #202630 · `--color-TextLink` #F0B90B · `--color-TextToast` #F0B90B · `--color-TextSell` #F6465D · `--color-TextBuy` #2EBD85

### Discord

- 화면: https://discord.com/servers (바탕 #ffffff, 캡처 `discord-0.jpg`)
- 무채색 글자 단계 5개(글자 수 1% 넘는 색, 밝은 순): #ffffff 27.6% [머리 583, 버튼 36, 링크 20, 제목 20] #000 위 21.0 · #16171b 위 17.91 / #fbfbfb 6.4% [제목 144, 머리 13] #000 위 20.29 · #16171b 위 17.31 / #efeff1 55.7% [메타 1364] #000 위 18.29 · #16171b 위 15.6 / #96979e 5.8% [본문 141, 버튼 1] #000 위 7.22 · #16171b 위 6.16 / #ffffff ×opacity0.5 4.4% [머리 108] #000 위 5.32 · #16171b 위 5.25
- 투명도: 알파 글자색 0.0% · opacity 로 흐리게 4.4%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #fbfbfb(20.29 / 17.31) · 본문·링크 #96979e(7.22 / 6.16) · 메타·작은 글 #efeff1(18.29 / 15.6) · 머리 #ffffff(21.0 / 17.91)
- 자리표시자: #ffffff/75 「Search servers for games and i」 면 #1f1f1f(11.42 / 10.38)
- 비활성: span 「Back」 #fbfbfb opacity 0.5 → #7e7e7e 면 #000000
- 밝은 면 위 글자: #696969 면 #ffffff · #00b0f4 면 #ffffff
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--lol-text-dark` #94620f · `--lol-text-light` #cbaa62

### 인벤

- 화면: https://www.inven.co.kr/board/lostark/4811 (바탕 #ffffff, 캡처 `inven-0.jpg`)
- 셈에서 뺌: 밝게 열림

### 아카라이브

- 화면: 없음
- 못 잰 쪽: https://arca.live/b/breaking 403

### GeekNews

- 화면: 없음
- 못 잰 쪽: https://news.hada.io/ 403

### 쿠팡플레이

- 화면: 없음
- 못 잰 쪽: https://www.coupangplay.com/ 403

### 웨이브(목록)

- 화면: https://www.wavve.com/list/VN1000?api=apis.wavve.com%252Fes%252Fvod%252Fpopularcontents (바탕 #1b1b1b, 캡처 `wavve2-0.jpg`)
- 셈에서 뺌: 첫 화면을 광고 팝업이 가림

### OKKY

- 화면: https://okky.kr/community (바탕 #fafafa, 캡처 `okky-0.jpg`)
- 셈에서 뺌: 밝게 열림

### 클리앙

- 화면: https://www.clien.net/service/board/park (바탕 #ffffff, 캡처 `clien-0.jpg`)
- 셈에서 뺌: 밝게 열림

### SOOP

- 화면: https://www.sooplive.co.kr/directory/category (바탕 #ffffff, 캡처 `soop-0.jpg`)
- 셈에서 뺌: 밝게 열림

### STOVE 스토어

- 화면: https://store.onstove.com/ko/ (바탕 #191919, 캡처 `stove-0.jpg`)
- 무채색 글자 단계 6개(글자 수 1% 넘는 색, 밝은 순): #ffffff 62.6% [본문 707, 작은 제목 478, 링크 8, 버튼 4] #000 위 21.0 · #16171b 위 17.91 / #ebebeb 4.1% [링크 36, 본문 33, 버튼 10] #000 위 17.62 · #16171b 위 15.02 / #ffffff/70 1.5% [작은 글 28] #000 위 9.9 · #16171b 위 9.14 / #b2b2b2 3.5% [링크 67] #000 위 9.9 · #16171b 위 8.45 / #ffffff/50 15.3% [작은 글 177, 링크 117] #000 위 5.32 · #16171b 위 5.25 / #ffffff/30 10.1% [작은 글 193] #000 위 2.45 · #16171b 위 2.72
- 투명도: 알파 글자색 27.7% · opacity 로 흐리게 0.0%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 #ffffff(21.0 / 17.91) · 본문·링크 #ffffff(21.0 / 17.91) · 메타·작은 글 #ffffff/30(2.45 / 2.72) · 머리 없음
- 자리표시자: #ffffff/30 「검색하기」 면 #191919(2.45 / 2.72)
- 비활성: 보이는 비활성 요소 없음(미확인)
- 밝은 면 위 글자: #1f1f1f 면 #ffffff · #191919 면 #ebebeb
- 글자색 토큰(스타일시트 사용자 정의 속성, 앞 12개): `--stds-sem-typography-font-size-text1` 1.6rem · `--stds-sem-typography-line-height-text1` 2.6rem · `--stds-sem-typography-font-size-text2` 1.5rem · `--stds-sem-typography-line-height-text2` 2.4rem · `--stds-sem-typography-font-size-text3` 1.4rem · `--stds-sem-typography-line-height-text3` 2.4rem · `--stds-sem-typography-font-size-text4` 1.3rem · `--stds-sem-typography-line-height-text4` 2.2rem

### 검은사막

- 화면: https://www.kr.playblackdesert.com/ko-KR/News/Notice (바탕 #ffffff, 캡처 `blackdesert-0.jpg`)
- 셈에서 뺌: 목록 쪽이 밝은 면(캡처 확인)

### PUBG(크래프톤)

- 화면: https://pubg.com/ko/news (바탕 #f5f5f5, 캡처 `pubg-0.jpg`)
- 셈에서 뺌: 밝게 열림

### OP.GG

- 화면: 없음
- 못 잰 쪽: https://op.gg/ko/lol/champions 403

### 빗썸

- 화면: 없음
- 못 잰 쪽: https://www.bithumb.com/react/trade/order/BTC-KRW Error: page.goto: net::ERR_HTTP2_PROTOCOL_ERROR at https://www.bithumb.com/react

### 아이온2(엔씨)

- 화면: https://aion2.plaync.com/ko-kr/board/notice/list (바탕 #171717, 캡처 `aion2-0.jpg`)
- 무채색 글자 단계 3개(글자 수 1% 넘는 색, 밝은 순): #ffffff/83 57.8% [링크 763, 버튼 6] #000 위 14.17 · #16171b 위 12.54 / #ffffff/60 6.9% [머리 63, 링크 15, 버튼 9, 본문 5] #000 위 7.37 · #16171b 위 7.03 / #ffffff/38 32.8% [푸터 200, 본문 180, 머리 56] #000 위 3.39 · #16171b 위 3.58
- 투명도: 알파 글자색 98.0% · opacity 로 흐리게 0.5%(글자 수 기준)
- 역할별 가장 많은 색(#000 / #16171b 대비): 제목 없음 · 본문·링크 #ffffff/83(14.17 / 12.54) · 메타·작은 글 #2065a6(3.47 / 2.96) · 머리 #ffffff/60(7.37 / 7.03)
- 자리표시자: #ffffff/38 「게시글 검색」 면 #171717(3.39 / 3.58)
- 비활성: 보이는 비활성 요소 없음(미확인)

## 묶음 — 판 재료

셈은 다크로 열려 잰 실제 서비스 33곳(국내 15 · 해외 18)과 디자인 시스템 9곳이다. 국내: 당근 · 치지직 · 카카오웹툰 · 나무위키 · 토스증권 · 티빙 · 라프텔 · 다음 · 왓챠 · 바이브 · 레진 · 클래스101 · DAK.GG · STOVE · 아이온2. 해외: Linear · Vercel · GitHub · Raycast · Spotify · Twitch · Supabase · Steam · osu! · Chess.com · MDN · Mastodon · Hugging Face · GitLab · Apple Music · Disney+ · Binance · Discord. 「주요 단계」 는 어두운 면 위 글자 수 5% 넘는 무채색이다. 곳마다 묶음 원표는 `color-text/agg.json`.

### 단계 수

| 주요 단계 | 실제 서비스                                                                                                                                      | 디자인 시스템(기본 · 보조 · 약함 중 값이 따로 있는 수) |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| 1         | 2(나무위키 · MDN)                                                                                                                                | 0                                                      |
| 2         | 7(티빙 · 라프텔 · 바이브 · 클래스101 · Vercel · GitHub · GitLab)                                                                                 | 5(Primer · Polaris · Geist · Material 3 · Radix)       |
| 3         | 15(당근 · 토스증권 · 다음 · 레진 · STOVE · 아이온2 · Linear · Spotify · Twitch · Supabase · osu! · Chess.com · Mastodon · Apple Music · Binance) | 4(SEED · Montage · Bezier · Atlassian)                 |
| 4         | 7(카카오웹툰 · DAK.GG · Raycast · Steam · Hugging Face · Disney+ · Discord)                                                                      | 0                                                      |
| 5         | 2(치지직 · 왓챠)                                                                                                                                 | 0                                                      |

- 국내만: 1단계 1 · 2단계 4 · 3단계 6 · 4단계 2 · 5단계 2. 해외만: 1 · 3 · 9 · 5 · 0.
- 단계 수에는 자리표시자 · 비활성 · 반전 면 글자를 넣지 않았다. 4–5단계 곳은 흰색과 거의 같은 색(#fff · #fafafa · #f9f9f9, Disney+)이나 알파 단계가 섞여 늘어난 것이 많다.
- 카카오웹툰은 쪽 글자 대부분이 작품 그림 위에 있어 낮은 단계(#444 · #5f5f5f)가 그림 위 글자일 수 있다. 근거로 쓰지 않는 편이 맞고 「근거 약함」 으로 둔다.

### 맨 위 단계 값

- 순백 #fff 가 가장 밝은 주요 단계인 곳 22(국내 10 · 해외 12). 흰색에서 조금 내린 색(#e0–#f7)이 맨 위인 곳 11: 당근 #f3f4f5 · Linear #f7f8f8 · GitHub #f0f6fc · Vercel #ededed · Supabase #edefee · Binance #eaecef · Mastodon #eeedf3 · 라프텔 #f7f7f7 · 나무위키 #e0e0e0 · 토스증권 #f2f6ff/90 · 아이온2 #fff/83.
- 디자인 시스템은 9곳 모두 기본 글자가 순백이 아니다(#cecfd2 – #f7f7f8 · Bezier #fff/80). 순백은 Montage `strong` · Bezier `heaviest` 처럼 따로 이름을 붙인 한 단계 위 값으로만 있다.

### 단색 회색 / 흰색 투명도

| 쓰는 방식                                 | 실제 서비스                                                                                                                                                                                                  | 디자인 시스템                                               |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| 단색 회색만(알파 · opacity 글자 10% 미만) | 22(당근 · 나무위키 · 티빙 · 라프텔 · 바이브 · 레진 · 클래스101 · DAK.GG · Linear · Vercel · GitHub · Raycast · Twitch · Supabase · Steam · osu! · MDN · Hugging Face · GitLab · Disney+ · Binance · Discord) | 6(SEED · Primer · Polaris · Geist · Atlassian · Material 3) |
| 흰색 알파 단계를 주로(알파 글자 10% 넘음) | 9(치지직 16% · 토스증권 59% · 다음 61% · 왓챠 47% · STOVE 28% · 아이온2 98% · Chess.com 66% · Mastodon 21% · Apple Music 95%)                                                                                | 2(Montage · Bezier) · 둘 다 1(Radix)                        |
| opacity 로 흐리게(10% 넘음)               | 2(카카오웹툰 24% · Spotify 14%)                                                                                                                                                                              | 0                                                           |

- 알파를 주로 쓰는 곳은 국내 15곳 중 6, 해외 18곳 중 3이다. 국내 디자인 시스템 둘(원티드 Montage · 채널톡 Bezier)도 알파다. 당근 SEED 는 알파 회색 팔레트가 있어도 글자 토큰은 단색이다.
- 알파 단계 값(흰색 기준): 다음 100 · 88 · 72 / 왓챠 100 · 70 · 40 / STOVE 100 · 50 · 30 / 아이온2 83 · 60 · 38 / Chess.com 100 · 85 · 72 · 50 / Apple Music 100 · 92 · 64 / Mastodon 100 · 80 · 70 / Bezier 100 · 80 · 60 · 40 / Montage 88 · 61 · 28(회색 바탕 색 위 알파).

### 단계마다 쓰임 · 대비

대비는 「#000 위 / #16171b 위」.

| 단계                   | 실제 서비스에서 많이 보인 값(곳)                                                                                                                                                                                                                                                                                  | #16171b 위 대비 범위 | 당근 SEED                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ---------------------------------------------------------- |
| 기본(제목 · 목록 제목) | #fff 22곳 · #e0–#f7 11곳                                                                                                                                                                                                                                                                                          | 12.5 – 17.9          | `fg-neutral` #f3f4f5 16.26                                 |
| 밝은 보조(본문 · 설명) | #d0–#e2 단색(당근 #dcdee3 · Linear #d0d6e0 · 레진 #dadadd · Twitch #d3d3d9 · 치지직 #dfe2ea · Hugging Face #d1d5dc · 라프텔 #e2e2e2) 7곳 · 흰 72–92% 알파 6곳                                                                                                                                                     | 9.6 – 15.2           | `fg-neutral-muted` #dcdee3 13.31                           |
| 보조 · 메타            | #8a–#b7 회색(Vercel #a1a1a1 · GitHub #9198a1 · Spotify #b3b3b3 · Supabase #989a99 · Linear #8a8f98 · Raycast #9c9c9d · Binance #929aa5 · Disney+ #b7b8bd · Hugging Face #99a1af · DAK.GG #a5a8b4 · 치지직 #9da5b6 · 레진 #a1a1a9 · Steam #8a8a8a · 티빙 #a3a3a3 · 다음 #898a8c · 왓챠 #babac1 · 바이브 #888) 17곳 | 5.0 – 9.3            | `fg-neutral-subtle` #b0b3ba 8.53                           |
| 약함(4.5 : 1 언저리)   | 치지직 #697183 3.66 · Raycast #6a6b6c 3.35 · Binance #707a8a 4.13 · 티빙 #6e6e6e 3.51 · 왓챠 #fff/40 3.83 · STOVE #fff/30 2.72 · 아이온2 #fff/38 3.58 · Spotify #b3b3b3 ×0.4 2.41 · 바이브 #747474 3.83 · 카카오웹툰 #5f5f5f 2.8                                                                                  | 2.4 – 4.2            | `fg-placeholder` #868b94 5.23 · `fg-disabled` #5b606a 2.76 |

- 셋째 줄(보조 · 메타)은 둘째 줄이 없는 곳(Vercel · GitHub · Spotify · Raycast 등 2단계 꼴)에서는 본문 보조를 함께 맡는다. 셋째 줄이 있는 곳은 3단계 꼴이다.
- 4.5 : 1 아래 단계를 일반 글자로 쓰는 곳 10(국내 7 · 해외 3). 대부분 푸터 · 메타 · 자리표시자 자리다.

### 제목이 본문과 다른 색인가

역할은 자동 분류(`h1–h3` 와 본문 · 링크의 가장 많은 색)라 「근거 약함」.

- 제목이 본문보다 밝음 13: 당근 · DAK.GG · 바이브 · Linear · Raycast · Spotify · Twitch · Supabase · Steam · Chess.com · Hugging Face · GitLab · Discord. 이 가운데 제목 전용 색이 따로 있는 것으로 보이는 곳은 없다. 모두 기본 단계를 제목에, 보조 단계를 본문에 쓴 꼴이다.
- 같은 색 10: 치지직 · 라프텔 · 클래스101 · STOVE · Vercel · GitHub · MDN · Apple Music · Disney+ · Binance.
- 본문이 더 밝음 2(토스증권 · Mastodon). 제목을 못 잰 곳 8.
- 디자인 시스템 9곳의 읽은 토큰 목록에는 제목 전용 글자색 이름이 없다(SEED 도 제목은 `fg-neutral`).

### 자리표시자

어두운 입력칸에서 잰 17곳.

| 꼴                      | 곳                                                                                                                                                                        | #16171b 위 대비 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| 기존 글자 단계를 그대로 | 8: Linear(약함 #8a8f98) · GitHub(muted #9198a1) · Supabase(#989a99) · Hugging Face(#99a1af) · Spotify(#b3b3b3) · Mastodon(#eeedf3/70) · STOVE(#fff/30) · 아이온2(#fff/38) | 2.7 – 8.5       |
| 자리표시자만의 값       | 9: 당근 #868b94 · 치지직 #545a69 · 나무위키 #757575 · 바이브 #fff/30 · Vercel #858585 · #8f8f8f · Twitch #fff/70 · Steam #dcdedf · GitLab #8a8888 · Discord #fff/75       | 2.6 – 13.3      |

- 4.5 : 1 아래 자리표시자 5곳, 모두 국내(치지직 2.6 · 바이브 2.72 · STOVE 2.72 · 아이온2 3.58 · 나무위키 3.89). 당근 #868b94 는 5.23 으로 넘는다.
- 디자인 시스템: 따로 정한 곳 SEED 하나(#868b94). Montage · Bezier 는 약함 단계(tertiary · lighter), Primer 는 muted 를 쓴다. 나머지 미확인.

### 비활성 글자

공개 쪽에 보이는 비활성 요소가 드물어 6곳만 잡혔다. 「근거 약함」.

- opacity 로 흐리게 4: Spotify 0.3 · Chess.com 0.5 · Apple Music 0.4 · Discord 0.5.
- 단색 회색 2: GitHub #656c76(Primer `fgColor-disabled` 와 같음) · Binance #333b47.
- 디자인 시스템 7곳: 단색 4(SEED #5b606a · Primer #656c76 · Polaris rgba(74,74,74) · Geist #8f8f8f), 알파 · opacity 3(Montage #989ba2/16 · Atlassian #e5e9f6/25 · Bezier 40%).
- 당근 실제 웹은 이번에 비활성 요소를 못 잡았다(미확인). 스타일시트의 `--carotene-color-fg-disabled` 값은 #5b606a 로 SEED 와 같다.

### 반전 면(밝은 면) 위 글자

흰 · 밝은 회색 버튼 · 칩 위 글자를 잰 11곳.

- 쪽 바탕 · 면 색과 같은 어두운 단색 7: 당근 #16171b(면 #f3f4f5) · 치지직 #0e0f10 · STOVE #1f1f1f · Linear #08090a(면 #e5e5e6) · Vercel #0a0a0a(면 #ededed) · Raycast #2f3031 · GitLab #171321.
- 순흑 #000 3: GitHub · Spotify · Twitch.
- 검정 알파 1: Apple Music #000/56 · /88.
- 디자인 시스템: SEED #16171b · Primer #010409 · Geist #0a0a0a · Montage #171719 · Bezier #000/85 · Atlassian #1f1f21 · Material 3 #322f35.

### 당근 실제 웹 화면 계산값

- 잰 쪽: 중고거래 검색 · 첫 화면 · 동네생활(위 「당근」 줄). 글자 단계는 #f3f4f5 · #dcdee3 · #b0b3ba 세 단계, 자리표시자 #868b94, 반전 면 글자 #16171b. 모두 단색이고 알파 · opacity 글자는 0%다.
- 쓰임: #f3f4f5 는 상품 제목 · 구역 제목 · 고른 메뉴, #dcdee3 는 동네생활 글 · 메타(동네 · 시간) · 푸터 링크, #b0b3ba 는 숫자 · 보조 링크. 중고거래 목록의 메타 「신당동 · 끌올 12분 전」 은 #dcdee3 다(캡처 `daangn-0.jpg`). 당근 웹은 SEED 의 `fg-neutral-subtle` 보다 `fg-neutral-muted` 를 메타에 더 많이 쓴다.
- 스타일시트 토큰은 `--carotene-color-fg-*` 이름이고 값은 SEED 3.2.1 과 같다(neutral #f3f4f5 · muted #dcdee3 · subtle #b0b3ba · placeholder #868b94 · disabled #5b606a · inverted #16171b).
- 2026-11-12 기록의 당근 글자색(#f3f4f5 · #dcdee3 · #b0b3ba · #868b94)과 같다.

### 후보 꼴(서비스 실측 그대로)

판에 올릴 꼴을 실측한 묶음 그대로 적었다. 추천은 하지 않는다.

1. 단색 3단계, 맨 위는 흰색에서 조금 내린 색 · 둘째는 밝은 회색 · 셋째는 중간 회색 — 당근(#f3f4f5 · #dcdee3 · #b0b3ba, 자리표시자 #868b94 따로, 비활성 #5b606a), Linear(#f7f8f8 · #d0d6e0 · #8a8f98, 자리표시자 = 셋째), Supabase(#edefee · #bcbdbc · #989a99), Binance(#eaecef · #929aa5 · #707a8a). 비슷한 단계 짝: 레진 · Twitch · Hugging Face(맨 위가 #fff 라 다름). 디자인 시스템 SEED · Atlassian. 실제 서비스 4곳(짝까지 7곳).
2. 단색 2단계, 밝은 기본 + 중간 회색 보조 하나 — Vercel(#ededed · #a1a1a1), GitHub(#f0f6fc · #9198a1, 자리표시자 · 메타도 같은 색), Spotify(#fff · #b3b3b3), Disney+(#fff · #b7b8bd), Raycast(#fff · #9c9c9d). 디자인 시스템 Primer · Geist · Polaris · Material 3 · Radix. 실제 서비스 5곳 넘음(2단계 꼴 전체는 7곳).
3. 흰색 알파 3단계 — 다음(#fff · /72 · 단색 #898a8c), 왓챠(#fff · /70 · /40), STOVE(#fff · /50 · /30), 아이온2(/83 · /60 · /38), Chess.com(#fff · /72 · /50), Apple Music(#fff · /92 · /64). 디자인 시스템 Montage · Bezier(둘 다 국내). 실제 서비스 9곳이 알파를 주로 쓰고, 그중 국내 6.
4. 한 단계(거의 모든 글자가 한 색) — 나무위키 #e0e0e0 · MDN #fff. 2곳이라 「근거 약함」.

### 근거 약함 · 미확인

- 근거 약함: 제목색 셈(자동 역할 분류) · 비활성 글자(6곳) · 꼴 4(2곳) · 카카오웹툰 단계(그림 위 글자 섞임) · Discord(소개 쪽 그라데이션 바탕).
- 미확인: 디자인 시스템의 자리표시자(SEED 밖 5곳) · Material 3 비활성 규칙(문서 쪽이 비어 읽지 못함) · Apple HIG 다크 값(이름만 공개) · IBM Carbon g100 값(토큰 쪽이 밝은 테마 값만 보여 줌) · 토스 TDS 글자 역할(역할 토큰 없음) · 당근 실제 웹의 비활성 글자.
- 못 잰 곳: 리디 · Lichess · Epic Games Store · 아카라이브 · GeekNews · 쿠팡플레이 · OP.GG(403), Reddit · Letterboxd(차단 쪽), 빗썸(접속 오류). 밝게 열려 뺀 곳: velog · 네이버 모바일 · YouTube · 메이플스토리 · 로스트아크 · 인벤 · OKKY · 클리앙 · SOOP · 검은사막 · PUBG. 팝업에 가려 뺀 곳: 웨이브.

## 판 조립 때 더 잰 것 — 입력 아이콘 · 글 본문 링크 (2026-11-20)

글자색 판의 물음 ②(자리표시자와 입력 아이콘)와 ④(링크 색)에 위 셈이 모자라 같은 방법(headless Playwright · 다크 · 1920×1080 · `permissions: []` · `wait-capacity.sh`)으로 더 쟀다. 원자료는 공유 메모 폴더 `common-layer/stage3/color/color-text-board/icons/icons.json` · `links/links.json`, 캡처는 `icons/<곳>.jpg`.

### 입력 아이콘

입력칸 안 SVG 아이콘(입력칸 높이 가운데 30px 안, 폭 6–40px)의 계산 색과 자리표시자 색을 같이 읽었다. 아이콘이 잡힌 곳 11.

| 꼴                                   | 곳(자리표시자 / 아이콘)                                                                                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 아이콘이 입력값 · 기본 글자색        | 6: 당근(#868b94 / #f3f4f5) · 나무위키(#757575 / #e0e0e0) · Twitch(#fff/70 / #efeff1) · Steam(#dcdedf / #fff) · GitLab(#8a8888 / #ecebea) · Mastodon(#eeedf3/70 / #eeedf3) |
| 아이콘 = 자리표시자                  | 2: GitHub(#9198a1 / #9198a1) · Spotify(#b3b3b3 / #b3b3b3)                                                                                                                 |
| 아이콘이 자리표시자와 입력값 사이 값 | 3: 치지직(#545a69 / #6d6e70) · Hugging Face(#99a1af / #d1d5dc) · Supabase(oklch 0.684 / oklch 0.798)                                                                      |

- 당근 실제 웹 돋보기는 #f3f4f5 로, SEED 규격(text-input 앞뒤 아이콘 `fg-neutral-muted` #dcdee3, daangn-tokens md 747)과 다르다.
- 아이콘을 못 잡은 곳: 토스증권 · 라프텔 · 티빙 · Vercel · Raycast · Binance · osu!(어두운 입력칸 없음), STOVE · 아이온2(입력칸에 SVG 아이콘 없음).

### 글 본문 안 링크

`p · td · dd · blockquote` 안에서 앞뒤에 글이 12자 넘게 이어지는 링크만 셌다(머리 · 바닥 · 내비 안은 뺌). 33곳 가운데 8곳에서 잡혔다.

| 꼴     | 곳(링크 / 둘레 본문 / 밑줄)                                                                                                                                 |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 무채색 | 4: Linear(#f7f8f8 / #d0d6e0 / #62666d) · Vercel(#ededed / #ededed / 흰 51%, 500) · Twitch(#fff / #fff / #fff) · Disney+(#f9f9f9 / #b7b8bd / #f9f9f9)        |
| 파랑   | 3: GitHub(#4493f8 / #f0f6fc / 문장 안 링크는 #4493f8 밑줄, 번호 링크는 밑줄 없음) · MDN(#a4cefe / #fff / #a4cefe) · GitLab(#9dc7f1 / #ecebea / 같은 색 35%) |
| 주황   | 1: 나무위키(#ec9f19, 밑줄 없음. 문단 밖 `div` 라 이 셈에는 안 잡혀 위 「나무위키」 줄의 링크 수 99% 로 셈)                                                  |

- 메뉴 · 카드 · 목록 링크까지 넣은 링크 글자(위 원자료 `items` 의 `a`)는 33곳 중 31곳이 무채색이 대부분이다(유채색 50% 넘는 곳은 나무위키 · MDN 둘).
- 국내 곳의 글 본문 링크는 나무위키 말고 잡히지 않았다(미확인). 당근 글 본문 링크도 미확인.
- Chess.com 의 #fff 링크는 기록표 안 칭호(GM) 링크라 본문 링크로 세지 않았다. STOVE 의 링크는 사업자 정보 줄이라 뺐다.
