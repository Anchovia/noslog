# NosLog 2.0 C5 Feedback/Status Source 시각 비교

## 문서 관리

- 상태: `Approved — 2026-08-10 13A에 FS-BN 채택`
- 정본 언어: English
- 영문 정본:
  [54-foundation-c5-feedback-status-source-visual-comparison.md](./54-foundation-c5-feedback-status-source-visual-comparison.md)
- 날짜: 2026-08-10
- Interactive artifact:
  [C5 feedback/status source 비교](./specimens/c5-feedback-status-source-comparison.html)
- 범위: 동등한 NosLog feedback/status content에서 `FS-BN`을 비교하고 승인한 작업 묶음
  `13A`
- 입력: 문서 `53`; 승인된 Spectrum surface, foreground, boundary, focus 및 material
  mapping; 아래의 정확한 공식 token package
- 제외: `13B` domain color, `13C` data color, 최종 iconography, 더 넓은 component
  승격 및 production 구현

이 artifact는 완전한 semantic recipe를 실제 맥락에서 비교하고 사용자의 `FS-BN` 승인을
기록한다. Palette strip, 기억에 의존한 brand color 또는 고립된 보기 좋은 swatch를 design
근거로 취급하지 않는다.

## Version-pin한 token 근거

| Candidate                | 공식 artifact                                                | 추출한 role                                                                           |
| ------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `FS-A` Adobe Spectrum S2 | `@adobe/spectrum-tokens@14.15.0`                             | Light/Dark informative, positive, notice 및 negative visual + subtle background alias |
| `FS-B` Atlassian         | `@atlaskit/tokens@16.3.0`                                    | Light/Dark information, success, warning 및 danger text, icon, background alias       |
| `FS-C` IBM Carbon        | `@carbon/themes@11.78.0` 및 현행 Notification style guidance | White와 `g100`의 support info/success/warning/error 및 notification background role   |

Package archive는 임시 directory에서만 조사했으며 NosLog dependency로 추가하지 않았다.

## Controlled 비교 규칙

1. 모든 candidate는 동일한 한국어, 일본어 및 영어 NosLog content를 사용한다.
2. 모든 candidate는 이미 승인된 Spectrum `canvas`, `surface`, foreground 및 boundary
   값 위에 배치한다.
3. 각 candidate는 자신이 소유하는 role에 정확한 published status 값을 유지한다.
4. Spectrum과 Carbon은 message title과 body copy를 승인된 neutral foreground로
   유지한다. Atlassian은 published semantic status-title color를 유지하고 body copy는
   승인된 neutral foreground를 사용한다.
5. 어느 candidate에도 발명한 tint, shifted hue, replacement step, gradient, glow 또는
   Tailwind 값을 주지 않는다.
6. 모든 message에는 명시적인 title, body, symbol placeholder 및 structural marker가
   있다. Symbol은 non-color-cue 검사용이며 승인된 iconography가 아니다.
7. Specimen에서 chromatic cue를 제거해도 text와 shape가 완전한 의미를 전달하는지
   확인할 수 있다.

## Candidate recipe

### `FS-A` — Adobe Spectrum S2

- Light와 Dark 모두 role-specific semantic background와 semantic visual을 사용한다.
- Message title과 body는 neutral로 유지해 message 전체가 colored text가 되는 것을 막는다.
- Visual/background contrast가 네 role에서 일관적이다.

### `FS-B` — Atlassian

- Light와 Dark에 별도 semantic text, icon 및 background 값을 사용한다.
- Title이 뚜렷하게 chromatic해 status scanning이 가장 강하지만 조밀한 content의 color
  양도 늘어난다.
- Compatibility specimen에서 body copy는 neutral을 유지한다.

### `FS-C` — IBM Carbon

- Light는 네 role-specific notification background를 사용한다.
- Dark `g100`은 네 role 모두 같은 neutral `#262626` background를 사용하고 support
  marker/icon과 명시적인 copy에 의미를 남긴다.
- 비교 후보 중 chromatic하게 가장 절제된 Dark recipe다.
- Carbon의 neutral title/body token은 이미 승인된 NosLog neutral owner에 mapping하며,
  Carbon은 정확한 notification background와 support 값을 그대로 소유한다.

### `FS-BN` — Atlassian semantic color + neutral message typography

- Status message background, marker, border, compact-state marker, invalid-input
  border, destructive accent 및 field-error text는 `FS-B`의 정확한 Atlassian
  Light/Dark semantic 값을 유지한다.
- Message container의 title과 body copy는 active appearance에 이미 승인된 Spectrum
  neutral foreground를 사용한다.
- IBM Carbon에서는 관찰한 절제 원칙만 참고한다. Carbon color 값은 `FS-BN`에 가져오지
  않으므로 이는 새로운 mixed palette가 아니라 하나의 chromatic source 위에서 만든
  승인된 component-role mapping이다.
- Status title, symbol, structural marker 및 copy는 계속 중복된 의미를 전달한다. 사용자는
  2026-08-10 이 rendering mapping을 승인했다.

## 승인된 `FS-BN` mapping

| Role        | Light background / marker | Dark background / marker |
| ----------- | ------------------------- | ------------------------ |
| Information | `#E9F2FE / #357DE8`       | `#1C2B42 / #4688EC`      |
| Success     | `#EFFFD6 / #6A9A23`       | `#28311B / #82B536`      |
| Warning     | `#FFF5DB / #E06C00`       | `#3A2C1F / #FBC828`      |
| Danger      | `#FFECEB / #C9372C`       | `#42221F / #F15B50`      |

| Component role                  | Light                           | Dark                            |
| ------------------------------- | ------------------------------- | ------------------------------- |
| Message title 및 body           | Spectrum neutral `#292929`      | Spectrum neutral `#DBDBDB`      |
| Field-error 및 destructive text | Atlassian danger text `#AE2E24` | Atlassian danger text `#FD9891` |
| Invalid/destructive boundary    | Danger marker `#C9372C`         | Danger marker `#F15B50`         |
| Compact status symbol           | 해당 role marker                | 해당 role marker                |

Message-container typography에 Atlassian semantic text를 대신 사용하거나 Carbon
notification 값을 가져오거나 추가 step을 만들지 않는다. 위의 정확한 boundary는 승인에
포함된다.

## 정확한 Carbon 추출

| Role        | White marker              | White background                          | `g100` marker             | `g100` background                         |
| ----------- | ------------------------- | ----------------------------------------- | ------------------------- | ----------------------------------------- |
| Information | `support-info #0043CE`    | `notification-background-info #EDF5FF`    | `support-info #4589FF`    | `notification-background-info #262626`    |
| Success     | `support-success #24A148` | `notification-background-success #DEFBE6` | `support-success #42BE65` | `notification-background-success #262626` |
| Warning     | `support-warning #F1C21B` | `notification-background-warning #FCF4D6` | `support-warning #F1C21B` | `notification-background-warning #262626` |
| Error       | `support-error #DA1E28`   | `notification-background-error #FFF1F1`   | `support-error #FA4D56`   | `notification-background-error #262626`   |

## 측정한 contrast

Ratio는 specimen에 rendering된 정확한 sRGB 값으로 계산했다. `Title`은 candidate
notification background와 비교하고 `Marker`는 semantic visual과 그 background를
비교한다.

| Candidate   | Appearance | Information title / marker | Success title / marker | Warning title / marker | Danger title / marker |
| ----------- | ---------- | -------------------------: | ---------------------: | ---------------------: | --------------------: |
| Spectrum S2 | Light      |             `12.63 / 3.45` |         `12.66 / 3.44` |         `12.57 / 3.43` |        `12.68 / 3.46` |
| Spectrum S2 | Dark       |             `10.18 / 4.01` |         `10.10 / 3.98` |         `10.13 / 4.00` |        `10.19 / 4.02` |
| Atlassian   | Light      |              `5.90 / 3.54` |          `5.81 / 3.19` |          `5.54 / 3.06` |         `5.74 / 4.54` |
| Atlassian   | Dark       |              `7.03 / 4.07` |          `8.87 / 5.57` |          `8.59 / 8.59` |         `6.81 / 4.29` |
| `FS-BN`     | Light      |             `12.88 / 3.54` |         `13.82 / 3.19` |         `13.40 / 3.06` |        `12.78 / 4.54` |
| `FS-BN`     | Dark       |             `10.29 / 4.07` |          `9.81 / 5.57` |          `9.72 / 8.59` |        `10.25 / 4.29` |
| Carbon      | Light      |             `13.24 / 7.09` |         `13.20 / 3.04` |         `13.20 / 1.53` |        `13.23 / 4.55` |
| Carbon      | Dark       |             `10.93 / 4.52` |         `10.93 / 6.33` |         `10.93 / 8.99` |        `10.93 / 4.51` |

모든 title pair는 `4.5:1`을 넘는다. Spectrum과 Atlassian의 모든 marker/background pair는
`3:1`을 넘는다. Carbon Light warning은 `1.53:1`이므로 marker를 독립적으로 필요한
graphical status cue로 취급할 수 없다. 정확한 Carbon recipe는 명시적인 warning title,
symbol shape 및 programmatic semantics가 의미를 전달할 때만 유지할 수 있다. Source 값은
변경할 수 없으므로 독립적인 warning icon에 `3:1`이 필요하다면 yellow를 어둡게 바꾸는
것이 아니라 `FS-C`를 부적격 처리해야 한다.

`FS-BN`은 Atlassian의 모든 marker/background ratio를 유지하며 message title
typography를 승인된 neutral foreground에 배정해 title contrast를 높인다. Field error는
정확한 Atlassian danger text인 Light `#AE2E24`, Dark `#FD9891`을 유지한다.

## Specimen의 대표 content

- non-blocking data-sync information
- 새 record와 갱신 record 수를 포함한 성공한 sync
- 악곡 세 개를 제외한 partial mismatch warning
- recovery instruction을 포함한 expired-session failure
- 보이는 error association이 있는 invalid public-name field
- compact information, healthy, review-needed 및 error state
- outlined danger action을 포함한 destructive consequence
- Light/Dark appearance, 한국어/일본어/영어 content 및 color-disabled mode

## 검토 결과

비교에서 다음 검토 질문을 해결했다.

1. 어느 candidate가 status를 놓치기 어렵게 유지하면서 Dark NosLog를 가장 차분하게
   만드는가?
2. 어느 Light treatment가 tinted-card clutter 없이 네 state를 구분하는가?
3. Atlassian의 colored title은 scanning에 유용한가, 아니면 불필요하게 chromatic한가?
4. Carbon의 단일 neutral Dark background가 더 나은가? Warning을 명시적으로 이름 붙였을
   때 약한 Light warning marker를 허용할 수 있는가?
5. Spectrum의 균일한 visual/background contrast가 가장 안정적인 균형을 제공하는가?
6. `FS-BN`은 선호한 Atlassian 색상 identity를 유지하면서 조밀한 message copy를
   `FS-B`보다 차분하게 만드는가?

사용자는 `FS-BN`을 선택했다. 결정적인 적합성은 Atlassian의 선호한 semantic color 성격과
명시적인 danger-colored field validation을 유지하면서 두 appearance의 message container
typography를 neutral·고대비로 만든 점이다. Carbon의 neutral-copy precedent는 role
boundary에 참고했지만 Carbon 값은 채택하지 않았다.

## Acceptance check

- `320px`, `390px` 및 desktop에서 horizontal overflow 없음
- 동등한 candidate content와 component 순서
- Light/Dark 및 locale 전환에서 layout과 의미 유지
- color-disabled mode에서 title, symbol, copy 및 structure로 모든 status 유지
- invalid input과 text error의 보이는 association 유지
- 모든 control에서 keyboard focus 표시
- exact value와 measured-ratio record가 source package와 일치
- 승격 전 명시적인 사용자 승인 기록

## 브라우저 검증 — 2026-08-10

In-app Chromium browser에서 interactive artifact를 실제 `1440px`, `390px` 및
`320px` CSS viewport 폭으로 검증했다.

| Check                                  | 관찰 결과                                                                                    |
| -------------------------------------- | -------------------------------------------------------------------------------------------- |
| Document horizontal overflow           | 세 폭 모두 없음                                                                              |
| Candidate fragment horizontal overflow | 각 폭에서 `0 / 8` fragment                                                                   |
| Candidate layout                       | `1440px`에서 `FS-BN` Light/Dark pair와 세 source 열, `390px`와 `320px`에서 1열               |
| Appearance control                     | Both, Light-only 및 Dark-only state가 예상 fragment를 표시                                   |
| Locale control                         | 한국어, 일본어 및 영어 copy가 duplicate ID나 layout 손실 없이 갱신                           |
| Color-cue control                      | Color-disabled mode에서도 title, symbol, copy, boundary 및 structure 유지                    |
| Console                                | 완료한 run에 warning 또는 error entry 없음                                                   |
| Keyboard focus                         | 승인된 `FI-C` mapping 유지: Light `#000000`, Dark `#FFFFFF`, `2px`, zero gap, 추가 halo 없음 |

`320px`에서 intrinsic text 폭이 보이는 box보다 길었던 유일한 element는 의도적으로 긴
single-line invalid-name input이었다. Input box와 page에는 horizontal overflow가 없었고,
보이는 error copy가 전체 제약을 제공했다. 이는 layout failure가 아니라 의도한 input-value
pressure test다.

## Decision log

| ID       | Entry                                                                                                                              | Status                         |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `FSV-01` | Swatch strip이 아니라 동일한 실제 NosLog feedback content로 Spectrum, Atlassian 및 Carbon을 비교한다.                              | `Completed evidence`           |
| `FSV-02` | Carbon을 `@carbon/themes@11.78.0`에 pin하고 White/`g100` notification background 및 support 값을 정확히 유지한다.                  | `Observed source evidence`     |
| `FSV-03` | 승인된 Spectrum neutral을 shared surface 및 ordinary-copy owner로 유지하고 각 candidate는 published status role만 소유한다.        | `Enforced upstream constraint` |
| `FSV-04` | Carbon Light warning marker `1.53:1`을 standalone으로 취급하지 않으며 source yellow를 어둡게 만들거나 교체하지 않는다.             | `Measured limitation`          |
| `FSV-05` | 사용자 검토 후 `13A` source 하나를 선택한다.                                                                                       | `Approved — FS-BN, 2026-08-10` |
| `FSV-06` | 실제 desktop, `390px` 및 `320px` browser 폭에서 theme, locale, color-cue 및 keyboard-focus check로 controlled artifact를 검증한다. | `Completed — 2026-08-10`       |
| `FSV-07` | Atlassian chromatic role은 유지하고 message typography를 승인된 neutral owner에 배정한 사용자 요청 `FS-BN` 예시 하나를 추가한다.   | `Approved — 2026-08-10`        |
| `FSV-08` | `FS-A`와 `FS-C`는 not-selected 근거로 보존하고 original colored-title `FS-B` component mapping을 `FS-BN`으로 대체한다.             | `Approved disposition`         |

## 승인 기록

2026-08-10 사용자는 `FS-BN · Atlassian semantic color + neutral message typography`를
Gate `13A`의 NosLog 2.0 universal feedback/status mapping으로 승인했다. Atlassian은 정확한
feedback chromatic을 소유하고 승인된 Spectrum S2 neutral은 message container title/body
typography를 소유한다. 이 승인은 `13B` NOSTALGIA-domain color, `13C` comparison-local data
color, 최종 iconography 또는 production 구현을 승인하지 않는다.
