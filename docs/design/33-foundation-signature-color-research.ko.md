# NosLog 2.0 시그니처 컬러 조사

## 문서 관리

- 상태: `조사 완료 — 절제된 사용 경계 승인, 시그니처 계약·색조 영역·측정 specimen 대기`
- 정본 언어: 영어
- 영어 정본:
  [33-foundation-signature-color-research.md](./33-foundation-signature-color-research.md)
- 시작일: 2026-08-08
- 범위: 하나의 인지 가능한 NosLog 시그니처 컬러, Light/Dark 제품용 ramp,
  유지되는 N 마크, interaction accent 역할 및 기존 NOSTALGIA/NosLog 도메인
  컬러 사이의 관계
- 입력: 승인된 문서 `22`, `24`, `32`, 현재 NosLog 로고·브라우저·컬러 토큰
  근거 및 아래 집중 비교
- 제외: 승인된 색조, hexadecimal 또는 OKLCH 값, 다시 칠한 로고, 최종 neutral
  값, 데이터 시각화 컬러, high-fidelity 화면 및 애플리케이션 구현

이 문서는 선호만으로 색을 선택하지 않고 C5 범위를 좁힌다. 모든 후보 영역과
계약은 사용자가 승인하고 측정 specimen을 검토하기 전까지 `Proposed`다.

## 관련 문서

- [교차 레퍼런스 매트릭스](./22-cross-cutting-reference-matrix.ko.md)
- [Foundation v0.1 조사 브리프](./24-foundation-v0.1-research-brief.ko.md)
- [Foundation 컬러 및 material 후보](./32-foundation-color-material-candidates.ko.md)
- [S1 탐색 검증](./27-foundation-s1-discovery-structural-validation.ko.md)
- [S2 악곡 상세 검증](./28-foundation-s2-music-detail-structural-validation.ko.md)
- [S3 랭킹 검증](./29-foundation-s3-global-rankings-structural-validation.ko.md)
- [S4 채보 뷰어 검증](./30-foundation-s4-chart-viewer-structural-validation.ko.md)
- [S5 Home 검증](./31-foundation-s5-home-structural-validation.ko.md)

## 지배 제약

시그니처 컬러 결정은 다음 승인된 규칙을 다시 열 수 없다.

1. Dark는 대표 art-direction 기준으로 유지되고 System, Dark, Light는 완전한
   semantic parity를 제공한다.
2. 재킷 아트, 악곡 정체성, 점수 및 NOSTALGIA 콘텐츠가 제품 표현의 많은 부분을
   제공하며 시그니처 컬러가 모든 surface를 채우지 않는다.
3. 향후 signature/accent family는 keyboard focus와 분리하지만 primary action, link,
   selected state, filter 또는 container를 자동으로 소유하지 않는다. neutral
   interaction이 기본이며 드물게 색을 쓰는 각 사례는 별도 근거와 승인이 필요하다.
4. hand, difficulty, Basic/Recital, rank, achievement, score, feedback, external
   brand 및 이후 data color는 별도의 semantic ownership을 유지한다.
5. 색상은 의미나 상태의 유일한 단서가 될 수 없다.
6. 현재 monochrome N 마크를 유지한다. 시그니처 컬러 영역을 마크 뒤나 옆의 어느
   위치에 둘지는 이후 specimen 결정이며, 이 조사는 마크를 다시 칠하거나 그리지
   않는다.

## 현재 NosLog 근거

### 정체성과 상호작용

- `public/logo.png`는 원 안에 있는 monochrome 발광 흰색 N/음표 마크다. 형태는
  인지 가능하지만 소유하는 시그니처 색조가 없다.
- 생성되는 metadata art는 거의 검은 영역과 흰색 N 마크를 사용한다.
- Dark theme의 primary와 focus 표현은 거의 흰색이며 Light theme의 interaction과
  focus는 `#3182f6`을 사용한다. Light 값은 확립된 NosLog 정체성보다는 기능적
  blue다.
- 승인된 C2-B 계약은 이미 signature/action accent를 keyboard focus에서
  분리하므로 접근성이 brand hue에 의존하지 않아도 된다.

### 기존 색조 점유

현재 값은 2.0 승인 값이 아니라 migration evidence다. 그럼에도 대략적인 OKLCH
색조 위치는 충돌 문제를 드러낸다.

| 기존 소유권      | 현재 예시             |     대략적 색조 | 충돌 의미                                                            |
| ---------------- | --------------------- | --------------: | -------------------------------------------------------------------- |
| 왼손             | `#62d4e8`             |          `211°` | 강한 분리 없이 cyan/teal을 일반 NosLog action color로 취급할 수 없음 |
| 일반 chart       | `#38bdf8`             |          `233°` | 밝은 sky blue는 이미 분석 의미를 가짐                                |
| Basic            | `#7c9cc6`             |          `255°` | muted blue는 이미 플레이 모드 정체성임                               |
| Discord          | `#5865f2`             |          `274°` | Blurple은 external brand 역할이며 사용 위치에서 인지 가능해야 함     |
| Real             | `#8f7fb8`             |          `297°` | purple은 이미 난이도 역할임                                          |
| Recital          | `#c98fb0`             |          `344°` | rose는 이미 플레이 모드 역할임                                       |
| 오른손 / danger  | `#f06b68` / `#ef4444` |   `24°` / `25°` | red/coral은 이미 도메인 및 feedback 의미를 가짐                      |
| Hard             | `#b08a5e`             |           `70°` | warm brown/amber는 이미 난이도 역할임                                |
| Score            | `#facc15`             |           `92°` | yellow/gold는 이미 score emphasis를 가짐                             |
| Success / Normal | `#22c55e` / `#6e9a7c` | `150°` / `154°` | green은 이미 feedback 및 난이도 의미를 가짐                          |

따라서 진정으로 비어 있는 색조 영역은 없다. 색상환에서 빈자리를 찾는 방식으로
선택할 수 없다. 성공적인 시그니처 계열에는 다음이 필요하다.

- 분리된 semantic ownership
- 인지 가능한 master color
- 동일한 perceptual family 안의 통제된 Light/Dark UI 값
- 근접한 domain color가 등장할 때 충분히 다른 명도, 채도, 면적, 위치, label 및
  문맥
- 도메인 의미를 바꾸지 않으면서 현재 migration 값을 나중에 다듬을 수 있는 허용

## 집중 레퍼런스 매트릭스

집중 비교는 독립적인 외부 조직 또는 표준 community 열여섯 곳과 현재 NosLog
근거를 포괄한다. 추가로 확인한 신뢰할 수 있는 레퍼런스는 고정 master color,
theme-aware product ramp, content-led expression 및 semantic collision 통제라는
주요 대안을 더 바꾸지 않았다.

| 출처                                                                                                                                                                                                                                                              | 전이 가능한 근거                                                                                                                  | NosLog 적용                                                                                             | 한계                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [W3C Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), [Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | 색상은 유일한 단서가 될 수 없고 일반 텍스트는 `4.5:1`, 필수 비텍스트 경계와 상태 표시는 인접색 대비 `3:1`이 필요하다.             | 모든 signature/action pair와 비색상 보강을 지배한다.                                                    | 색조나 정체성을 선택하지 않는다.                                                                |
| [Apple Color](https://developer.apple.com/design/human-interface-guidelines/color)                                                                                                                                                                                | Adaptive semantic color는 한 swatch를 기계적으로 반전하는 대신 appearance 간 계층과 가독성을 보존해야 한다.                       | appearance별 product value를 뒷받침한다.                                                                | native platform styling은 NosLog art direction이 아니다.                                        |
| [Material 3 color system](https://m3.material.io/styles/color/system/overview)                                                                                                                                                                                    | 하나의 source color에서 역할 기반 tonal palette와 foreground/container pair를 만들 수 있다.                                       | master family를 product role에 매핑하는 방식을 뒷받침한다.                                              | 동적 사용자 개인화와 Material component 외관은 채택하지 않는다.                                 |
| [Carbon Color](https://carbondesignsystem.com/elements/color/overview/)                                                                                                                                                                                           | neutral gray가 지배하고 blue는 primary action에 제한되며 theme 값이 바뀌어도 role name은 유지된다.                                | 제한적인 signature 사용과 invariant semantic token을 뒷받침한다.                                        | IBM blue와 layer 값은 NosLog 후보가 아니다.                                                     |
| [Radix Colors use cases](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)                                                                                                                                                        | 하나의 hue scale에는 하나의 hex를 모든 곳에 재사용하는 대신 background, interaction, border, solid, text 단계가 분리된다.         | 현재 Radix stack과 제한된 accent ramp를 직접 뒷받침한다.                                                | 12단계 구현은 근거이며 필수 token 수가 아니다.                                                  |
| [Toss Brand Resources](https://brand.toss.im/)                                                                                                                                                                                                                    | Toss Blue `#0064FF`는 흰색과 검은색에서 인지되도록 정해진 고정 대표 컬러다.                                                       | 하나의 명시적 master color가 갖는 identity 가치를 보여준다.                                             | NosLog는 흔한 금융/기술 blue를 복사하거나 한 hex가 모든 UI 대비를 해결한다고 가정할 수 없다.    |
| [NAVER Brand Resources](https://www.navercorp.com/en/company/brandGuide)                                                                                                                                                                                          | NAVER Green `#03C75A`는 touchpoint 전반에 일관되게 적용되며 제공된 monochrome logo 예외가 있다.                                   | 이름 있는 signature master와 통제된 logo variant를 뒷받침한다.                                          | green은 NosLog success 및 Normal 역할과 강하게 충돌한다.                                        |
| [Kakao Talk Calendar Design Guide](https://developers.kakao.com/docs/en/talkcalendar/design-guide)                                                                                                                                                                | Kakao Yellow `#FAE100`는 지정된 black/white logo 표현 및 background 규칙과 함께 동작한다.                                         | 시그니처 컬러에는 swatch뿐 아니라 foreground와 placement 계약이 필요함을 보여준다.                      | yellow는 NosLog score 및 warning 영역과 강하게 충돌한다.                                        |
| [Spotify Design and Branding](https://developer.spotify.com/documentation/design)                                                                                                                                                                                 | Spotify Green은 인지 가능한 “resting color”이고 artwork와 넓은 palette는 표현을 유지하며 logo color는 background에 따라 달라진다. | content-led music identity와 절제된 하나의 시그니처 계열에 대한 강한 근거다.                            | Spotify는 playback-first이고 green은 NosLog success/Normal과 충돌한다.                          |
| [SoundCloud Media Kit](https://soundcloud.com/company/media-kit)                                                                                                                                                                                                  | SoundCloud는 Orange `#FF5500`을 강하게 소유하고 black/white와 조합하며 목적 있는 secondary palette를 사용한다.                    | 음악 제품이 하나의 master와 통제된 보조색으로 인지될 수 있음을 보여준다.                                | orange/red는 오른손, danger, Hard 및 score 영역과 충돌한다.                                     |
| [Discord Brand](https://discord.com/branding?lang=en), [Dark/Light rebrand note](https://support.discord.com/hc/en-us/articles/1500009438682-A-Fresh-New-Look-to-Celebrate-Our-6th-Birthday)                                                                      | Discord는 Blurple `#5865F2`를 소유하지만 Dark/Light 가독성을 위해 in-app color를 marketing 값과 다르게 조정한다고 명시한다.       | 안정적인 brand master와 theme-tested product value를 직접 뒷받침한다.                                   | 현재 NosLog Discord 역할이 이 external brand color를 그대로 사용하므로 NosLog가 모방할 수 없다. |
| [Twitch: Beyond Purple](https://blog.twitch.tv/en/2019/12/03/beyond-purple/)                                                                                                                                                                                      | Twitch는 brand purple에서 gray 및 purple ramp를 시작하고 theme hierarchy에 맞춰 명도를 바꾸며 Light/Dark의 AA 조합을 검증한다.    | 하나의 family와 분리된 semantic product step에 대한 가장 강한 production 선례다.                        | Twitch purple은 이미 인지 가능하고 NosLog Real/Discord 영역에 가깝다.                           |
| [osu! Brand Identity](https://osu.ppy.sh/wiki/en/Brand_identity_guidelines)                                                                                                                                                                                       | full-color pink cookie는 고정되지만 single-color mark는 필수 대비를 유지하며 다양한 구성에 적응할 수 있다.                        | canonical full-color identity와 유연한 monochrome mark를 분리하는 rhythm-game 근거다.                   | osu! pink와 원형 정체성을 모방할 수 없고 pink는 Recital에도 가깝다.                             |
| [NOSTALGIA 공식 제품 설명](https://www.konami.com/amusement/corporate/ja/topics/20210201/)                                                                                                                                                                        | NOSTALGIA는 명시적으로 피아노 motif, 연주 지향, 동화풍이며 클래식 및 BEMANI 콘텐츠를 포함한다.                                    | domain tone을 제공하며 generic esports-only palette를 피하게 한다.                                      | 공식 게임 marketing은 NosLog service identity 또는 UI color 권위가 아니다.                      |
| [beatmania IIDX 33](https://www.konami.com/arcadegames/products/am_bmiidx33/)                                                                                                                                                                                     | edition art direction은 매우 표현적이며 각 release concept에 따라 달라진다.                                                       | game/version art를 안정된 service signature가 아니라 content expression으로 유지하는 방식을 뒷받침한다. | 재사용 가능한 archive-product palette를 제공하지 않는다.                                        |
| [maimai official](https://maimai.sega.jp/)                                                                                                                                                                                                                        | 현재 rhythm-game 표현은 조밀하고 version별 character 및 event color를 사용한다.                                                   | 다양한 게임 콘텐츠가 공존할 때 조용한 service shell이 필요함을 확인한다.                                | surface styling과 character art는 NosLog로 전이할 수 없다.                                      |
| 현재 NosLog code, browser 및 승인 문서                                                                                                                                                                                                                            | N 마크는 인지 가능하지만 무채색이고 주요 색조 영역은 모두 domain, status, score 또는 external-brand ownership이 있다.             | 실제 collision map과 승인된 content-led 방향을 제공한다.                                                | 기존 값은 migration evidence이며 2.0 palette 권위가 아니다.                                     |

## 조사 수렴점

1. 인지 가능한 제품은 보통 화면마다 무관한 accent를 고르게 두는 대신 하나의
   canonical master color 또는 colorway를 정의한다.
2. canonical brand master가 있다고 모든 UI role에 문자 그대로 하나의 hex를
   써야 하는 것은 아니다. 성숙한 제품은 가독성을 위해 theme 및 state별 값을
   계열 안에서 매핑한다.
3. Logo 규칙과 UI color 규칙은 관련 있지만 동일하지 않다. monochrome mark는
   안정적으로 유지하면서 signature-colored field 또는 인접 accent가 정체성을
   제공할 수 있다.
4. 음악 및 creator 제품은 artwork를 위한 공간을 남긴다. NosLog에서 시그니처
   컬러는 안정적인 identity touchpoint에서 시작한다. universal card background,
   일반 link color, filter-state tint, selected-container fill 또는 자동 difficulty
   treatment가 아니다. 드문 primary-action 사용은 별도로 입증할 예외다.
5. 정확한 색조만으로 충돌을 막을 수 없다. semantic ownership, 상대 명도와 채도,
   면적, placement, label, shape 및 context가 함께 작동한다.
6. NosLog는 Dark와 Light를 함께 시험해야 한다. Dark canvas에서만 보기 좋은 swatch를
   고르는 것은 승인된 appearance model에 반한다.

## 시그니처 계약 후보

### `SC-A` — 모든 곳에 하나의 리터럴 hex

- 하나의 승인 값이 logo field, button, link, selected state 및 두 appearance에
  모두 나타난다.
- 장점: 가장 단순한 문자 그대로의 일관성
- 위험: 하나의 값이 Dark와 Light 모두에서 동등한 대비, state 구분 및 perceived
  weight를 제공하기 어렵다. 또한 brand identity와 component accessibility를
  결합한다.

### `SC-B` — 하나의 master color와 통제된 product ramp

- 하나의 canonical `brand-master`가 identity와 배포 artifact에서 NosLog를 대표한다.
- 제한된 동일 계열 ramp는 별도 승인된 identity 및 드문 action treatment에만 값을
  공급할 수 있다. ramp를 정의하는 것은 모든 hover, selected, border, link 또는
  text role로 확산해도 된다는 허가가 아니다.
- Light와 Dark는 해당 역할을 서로 다른 명도와 채도에 매핑할 수 있다. 색조 이동이
  필요하면 component별 즉흥 조정이 아니라 최소화하고 측정하며 문서화한다.
- monochrome N 마크는 계속 사용할 수 있다. Signature-colored logo field 또는
  인접 표현은 승인 전 별도로 시험한다.
- 장점: 인지, 접근성, theme parity의 가장 강한 균형
- 위험: product value가 관련 없는 색으로 drift하지 않도록 governance가 필요함

### `SC-C` — 다색 또는 gradient 시그니처

- gradient 또는 변하는 spectrum이 주 정체성이 된다.
- 장점: 에너지와 표현력이 강함
- 위험: 한 색상 기억을 약화하고 jacket 및 domain color와 충돌을 늘리며 대비를
  복잡하게 하고 content-led interface를 시끄럽게 만들 수 있음

**제안 추천:** `SC-B`는 향후 master color와 측정된 appearance variant를 위한 기술
모델 후보로만 유지하고 `SC-A`는 universal UI rule로 거부하며 `SC-C`는 Foundation
v0.1에서 제외한다. 승인된 절제 사용 경계는 모든 안에 적용된다. 이후 campaign 또는
illustration은 semantic interaction color가 되지 않는 경우에만 통제된 gradient를
사용할 수 있다.

## 색조 영역 shortlist

이는 측정 비교를 위한 방향성 계열이며 승인된 색상이 아니다. 정확한 anchor는
사용자가 shortlist를 승인한 뒤에만 생성한다.

| 영역                               | specimen 가치                                                                                                                                                         | 측정할 주요 위험                                                                                                                                                                    |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `H1` Ultramarine / blue-violet     | Dark anchor에서 명확하게 읽히며 분석 및 음악 문맥을 지원하고 차분한 archive utility와 통제된 rhythm-game energy를 연결할 수 있음                                      | generic technology 제품처럼 보일 수 있고 Basic, Real, Twitch 또는 Discord에 접근할 수 있음. external Discord branding 및 현재 mode/difficulty role과 perceptual separation이 필요함 |
| `H2` Warm amber / piano gold       | NOSTALGIA art를 문자 그대로 복사하지 않으면서 stage light, acoustic instrument의 온기 및 클래식 연주 문맥과 연결되고 dark shell과 뚜렷한 warm contrast를 만들 수 있음 | score, warning, Hard 및 Kakao-like 영역에 직접 접근함. 큰 filled surface는 task-focused보다 promotional 또는 premium처럼 보일 수 있음                                               |
| `H3` Rose-magenta / musical accent | 표현적인 rhythm 및 performance energy를 전달하고 dark/light neutral 모두에서 두드러질 수 있음                                                                         | Recital, Real, 오른손/danger, osu!, Twitch 영역에 접근함. 높은 saturation은 jacket art와 조밀한 분석을 압도할 수 있음                                                               |
| `H0` Achromatic control            | 현재 white/black identity를 비교 기준으로 유지함                                                                                                                      | 기억에 남는 signature color라는 사용자 목표를 해결하지 못하고 NosLog를 시각적으로 generic하게 남길 수 있음                                                                          |

### 1차에서 진행하지 않는 영역

- green/lime은 success와 Normal이 이미 소유하고 NAVER/Spotify 때문에 다른 서비스의
  signature로 특히 익숙하므로 진행하지 않는다.
- cyan/teal은 왼손과 chart 역할이 viewer 및 분석 surface에서 높은 salience를
  유지해야 하므로 진행하지 않는다.
- red/orange는 오른손, danger, Hard/score 인접 의미, YouTube-like video 연상 및
  SoundCloud ownership으로 충돌 비용이 과도하므로 진행하지 않는다.

한 영역을 진행하지 않는다고 그 안의 모든 값이 사용할 수 없다는 뜻은 아니다.
첫 specimen round는 identity와 collision의 균형 가능성이 더 높은 후보에 시간을
사용한다는 뜻이다.

## Shortlist 승인 후 필수 specimen 매트릭스

첫 color specimen은 모든 후보 영역에서 정확히 같은 구조와 콘텐츠를 비교해야 한다.
이는 guide artifact이며 최종 page design이 아니다.

1. neutral, candidate field, 대표 jacket edge 위의 유지된 흰색 N 마크
2. Dark와 Light의 `canvas`, `surface`, `sunken`, `raised`, `overlay` 문맥
3. neutral interaction baseline, 별도로 정당화한 드문 primary-action 후보, hover,
   pressed, disabled 및 독립 focus-visible 표현
4. 모든 destination card를 다시 칠하지 않은 Home search와 destination region
5. 밝고 어둡고 따뜻하고 차갑고 높은 saturation인 jacket 옆의 Music list/grid
6. Normal/Hard/Expert/Real 및 Basic/Recital 색상 옆의 Music Detail identity
7. score band, achievement, feedback 및 chart color 옆의 ranking/record analysis
8. 왼손/오른손 note의 domain priority를 약화하지 않는 chart viewer
9. external brand가 구분되도록 signature accent 옆에 놓인 Discord link
10. normal 및 `200%` text size의 한국어, 일본어, 영어
11. `320`, `390`, intermediate 및 wide content region
12. 측정된 text, non-text, state-to-state, adjacent-color contrast report와 대표
    color-vision-deficiency simulation

## 다음 검토 질문

다음 시각 작업에는 두 가지 명시적 승인이 필요하다.

1. 먼저 neutral Dark/Light 값을 승인한 뒤 NosLog가 `SC-B`, 즉 하나의 canonical
   signature master와 엄격히 제한된 Light/Dark identity 및 드문 action 값을
   사용하고 일반 interaction과 keyboard focus는 neutral 또는 독립적으로 통제할
   것인가?
2. 첫 equal-condition specimen에서 `H1` ultramarine/blue-violet, `H2` warm
   amber/piano gold, `H3` rose-magenta 및 `H0` achromatic baseline을 비교할 것인가?

이 질문의 승인은 비교 specimen만 허가한다. 색조, 값, logo recoloring, gradient
또는 component styling을 승인하지 않는다.

## 결정 로그

| ID       | 항목                                                                                                                                                                                                   | 상태                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| `SIG-01` | 현재 N 마크 형태를 유지하고 monochrome 사용을 유효한 identity asset으로 취급한다.                                                                                                                      | `Approved upstream`                                    |
| `SIG-02` | 현재 `#3182f6` Light interaction blue 및 모든 현재 domain value를 승인된 signature가 아니라 migration evidence로 취급한다.                                                                             | `Observed`                                             |
| `SIG-03` | `SC-B`를 통해 하나의 canonical master와 통제된 Light/Dark product ramp를 사용한다.                                                                                                                     | `Proposed`                                             |
| `SIG-04` | signature color를 identity 우선으로 사용하고 일반 link, filter, selection, container, difficulty text, focus, feedback, hand, mode, rank, score, external brand 또는 data 의미에 자동 적용하지 않는다. | `Approved usage boundary / value pending — 2026-08-08` |
| `SIG-05` | 색조 선택 전 하나의 측정 specimen matrix에서 H1, H2, H3, H0를 비교한다.                                                                                                                                | `Proposed`                                             |
| `SIG-06` | 현재 semantic 및 external-brand collision 비용 때문에 첫 specimen round에서 green/lime, cyan/teal 및 red/orange를 진행하지 않는다.                                                                     | `Proposed`                                             |
| `SIG-07` | link, filter state, selected container, difficulty text 및 여러 경쟁 요소에 색을 칠한 과도한 interactive 비교는 거부되며 design authority가 없다.                                                      | `Rejected — 2026-08-08`                                |

## 거부된 specimen 기록 — 2026-08-08

이 단계에서 만든 interactive signature-color 비교는 각 candidate를 너무 많은 반복
interface 요소에 퍼뜨렸다. 이는 승인된 차분하고 content-led인 방향과 충돌했으며
유효한 NosLog 제안이 아니라 실패 사례를 보여줬다. Claude Design에 전달하거나 구현
reference로 사용해서는 안 된다. 대체 비교는 neutral 값을 먼저 확정한 뒤에만 만들 수
있으며 color를 identity와 명시적으로 정당화한 드문 action 사례 최대 하나로 제한해야
한다.
