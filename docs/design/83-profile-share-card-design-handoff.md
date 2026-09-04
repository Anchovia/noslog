# 83 · Profile Share Card — High-Fidelity Design Handoff

**Asset family** P16 · Share Card (프로필 공유 카드 — 생성 이미지)
**Governing authority** 사용자 지시(2026-09-02) — **문서 09 Share Card Contract 및 브리프는 이 작업에 적용하지 않는다**(사용자가 명시적으로 무시를 지시). 기준은 현행 제품 카드(`app/(nevigation)/profile/[id]/card/route.tsx`)의 개선.
**Figma page** `P16 · Share Card 조립` (file `NosLog v2.0.0`, `cVbWCxhkfxFfHmAKLCyKrD`, page `2986:2`)
**Built** 2026-09-02 ~ 2026-09-03

---

## 1. What is in the file

2 sections, 3 frames, no page-level stray nodes. **다크 전용** — 카드는 raw 팔레트의
생성 이미지(1200×630 PNG)라 Light/Dark 모드 개념이 없고 Light 판은 존재하지 않는다.

| Section                                   | Frames |
| ----------------------------------------- | ------ |
| `Share Card · 기본 (Basic · 데이터 있음)` | 1      |
| `Share Card · 상태`                       | 2      |

- **기본** — Basic 모드 · 데이터 있는 픽스처(계롤 · Grd 5,713 · #482 · KR #57 ·
  P 12 / FC 87 / S 214 · Basic 8급 · Recital 10급 · 플레이 1,204회)
- **기록 없음(신규 유저)** — 동기화 전 상태의 전 폴백
- **부분 공개** — 순위 없음 + 검정 없음 + 플레이 횟수 비공개

의사결정 이력은 Z1 `✅ 승인 완료` 의 보드 ⑬(1차 5안 전부 폐기)과 보드 ⑭
(재작업 — **V10 채택** · 하단 행 비교 4종 중 **B-a 채택**)에 있다.

---

## 2. Decisions realised here

| Decision                                                                                                                                         | Record             |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| 기준 = 현행 제품 카드의 언어(그라디언트 배경 · 아바타 골드 링 · 고 weight · 다색 성취 마크) — 1차 5안은 제품 UI 절제를 포스터에 이식해 전부 기각 | Z1 보드 ⑬ 폐기     |
| **V10 채택** — Grd 히어로: 카드 중단에 공식 Grd 값을 대형 골드로. 기존 카드의 죽은 중앙과 「Grd 부재」 문제를 함께 해결                          | Z1 보드 ⑭          |
| **하단 행 B-a** — 알약 칩 제거. 색 글자 마크(P/FC/S) + 흰 수치, 구분선만(osu! 프로필 등급 카운트 문법). 검정도 색 글자 `Basic 8급` 동일 언어     | Z1 보드 ⑭ 비교 4종 |
| **커스터마이징 없음** — 1회성 공유 PNG 라 기본값 하나가 설정면보다 가치. 액센트 프리셋·표시 토글 안은 철회(2026-09-03 합의)                      | RESUME (47)        |
| **다크 전용 · 등급 메달 이미지 금지 · NosLog 브랜드 강조** — 사용자 제약(2026-09-02)                                                             | RESUME (45)        |

### Card anatomy (측정값 — 기본 프레임 기준)

- **캔버스** 1200×630 · 패딩 54/64 · 배경 GRADIENT_LINEAR 135°
  `#17171f → #0b0b10 → #17140c`(현행 카드 값 그대로)
- **top row** — 아바타 링 132(링 `#d8b54f`) · 국기 칩 + 사용자명 46 Bold `#f2f2f5` ·
  `GRADE {n}` 배지(20 Bold `#facc15`, n = grade/100) · 서브라인
  `{모드} · {날짜} 기준` 22 `#a0a0aa` · 우측 브랜드(N 링 54 + `NosLog` 28 Bold)
- **mid row**(y 258 · gap 54) — 라벨 `공식 GRD` 18 caps ls3 `#666674` · **히어로
  값 120 Bold `#facc15`** · 구분선 1×92 `#34343f` · 순위 열(라벨 19 `#a0a0aa` +
  `#{값}` 54 Bold, KR 순위 라벨에 국기 칩)
- **bottom row**(y 526) — 성취 인라인: 마크 26 Bold(`P #f5d98b` · `FC #a3e635` ·
  `S #d8b54f`) + 수치 26 Bold 흰색, 그룹 사이 구분선 1×26 `#34343f` · 검정
  `Basic`/`Recital` 22 Bold(`#7c9cc6`/`#c98fb0`) + 급수 22 흰색 · 우측 메타
  (`플레이 {n}회` + 프로필 URL, 18 `#666674` 우정렬 2줄)

### Empty/fallback states

기존 구현의 폴백 동작을 그대로 계승한다 — **신규 문자열 0**
(`profile.playCountPrivate` = `플레이 비공개` · `profile.noRecord` = `기록 없음` ·
`formatProfileGrade(null)` = `-` 전부 실재 카탈로그/유틸 값).

| 원천 없음          | 처리                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------ |
| grade (Grd)        | 히어로 `-` — 단, **54 · `#666674` 로 강등**(골드·대형은 성취 표현이라 부재에 쓰지 않는다)  |
| GRADE 배지         | **배지 생략**(원천 grade/100 이 없으므로 `GRADE -` 를 만들지 않는다)                       |
| 순위               | `-` 54 흰색(현행 동작 그대로)                                                              |
| 검정               | 해당 그룹·구분선 생략(현행 동작 그대로)                                                    |
| 마지막 플레이 날짜 | 서브라인 `{모드} · 기록 없음 기준`                                                         |
| 플레이 횟수 비공개 | `플레이 비공개`                                                                            |
| 커스텀 아바타      | **사용자명 이니셜**(`PROF-36` 계승 — 현행 카드의 `N` 고정 폴백을 대체) · 42 Bold `#a0a0aa` |

---

## 3. Fixtures and their boundaries

- 픽스처 수치는 P5·P6 과 같은 대표 데이터 세트(계롤)다 — 런타임에 프로필 DB 값으로
  대체된다.
- 아바타의 베이지 원은 `media render` 플레이스홀더(토큰 감사 제외)다.
- **국기 칩** — `public/flags/kr.png`·`jp.png`(P5 결정 계승) · 기타 지역은 현행
  카드의 `G` 원형 폴백 대신 **P5 `Icon/globe` 관례를 따르는 것이 구현 계약**이다
  (프레임에는 KR 칩만 그려져 있다).
- Recital 모드 판은 별도로 그리지 않았다 — 레이아웃 동일, 값 원천만
  `grade_recital`/`rank_recital` 로 갈리는 현행 `getModeData` 구조 유지.

---

## 4. Validation

```
A 레이아웃  페이지 stray 0 · 섹션 이탈 0 · 하단 행 centerY 오차 0.00 · 이니셜 잉크 중심
            0.00/0.00 · 우측 넘침 0 (1차 작업에서 수리: 차트 FILL 재적용 · 도넛 arcData)
B 타이포    토큰 비대상 규약 — 생성 이미지라 Text Style 미사용, 카드 자체 스케일
            (18/19/20/22/26/28/46/54/120). 렌더 폰트는 IBM Plex(렌더러 한계, §5-1)
C 색        raw 팔레트 규약(변수 바인딩 비대상 · 다크 전용) · 부재 값은 성취색 제외
시각        1x 렌더 — 기본 · 기록 없음 · 부분 공개 · 하단 행 확대(사용자 검수)
```

**Not executed — not a pass:**

- WCAG 대비 전수 — 생성 이미지의 적용 기준 자체가 협의 대상(§5-2)
- ja/en 로케일 판(서브라인 날짜 형식 · `플레이 {n}회` · 검정 라벨의 로케일 변형)
- Recital 모드 실렌더

---

## 5. Open items

1. **폰트** — 프레임은 IBM Plex 로 렌더됐다(렌더러 한계 · 파일 전역 규약).
   현행 카드는 satori `sans-serif` + weight 800/900 을 쓴다. 구현 시 서비스 폰트
   교체(Pretendard) 방침과 함께 카드 폰트·최대 weight 를 정해야 한다 — 프레임의
   Bold(700)를 그대로 상한으로 볼지, 현행 900 을 유지할지는 미결정.
2. **WCAG 적용 기준** — 공유 카드는 UI 가 아니라 이미지 산출물이다. 깊은 검증
   단계에서 카드를 대비 전수 대상에 포함할지, 포함한다면 어떤 기준(텍스트 4.5:1)
   으로 볼지 결정 필요. 현재 톤(`#666674` 메타 등)은 현행 카드 값 계승이다.
3. **긴 사용자명** — 현행 구현의 `maxWidth 500 + ellipsis` 계약을 계승한다(프레임은
   짧은 픽스처만 그렸다). GRADE 배지와의 행 폭 경쟁은 구현에서 재검 필요.
4. **기타 지역 유저** — `Icon/globe` 폴백(§3)의 실렌더는 그리지 않았다.
5. **ja/en 카드** — 서브라인·메타의 로케일 문자열은 카탈로그에 실재하나 카드
   프레임은 ko 만 그렸다. 날짜 형식은 P6 `PROF-45`(JA 단축)와 무관 — 카드는
   `Intl.DateTimeFormat` 날짜만 쓴다.
6. **접근성 대체 텍스트** — 공유 다이얼로그의 `profile.cardPreview` alt 계약은
   현행 유지(카드 자체는 이미지라 내부 시맨틱 없음).

## 6. Decoration layer — approved 2026-09-04 (Z1 ⑲, C-5)

Behind the content layer (unchanged), every card now carries four raw-palette decoration
nodes, in z-order from the bottom:

1. `gold tint · linear top-right` — 1200×630 linear gradient, `#d8b54f` 5 % → 0 % toward the
   centre (diagonal from the top-right corner; **linear, not radial** — radial halos are an
   AI-slop tell and were excluded on purpose).
2. `diagonal band` — 1600×140, `#d8b54f` 5 %, rotated −18°, anchored bottom-left.
3. `ring accent 2` — 1040 circle, 1 px `#d8b54f` at 12 %, centred top-right off-canvas.
4. `ring accent` — 720 circle, 2 px `#d8b54f` at 24 %, same centre.

Card background gradient strengthened to `#1a1a26 → #0b0b10 (60 %) → #241b0c`, 135° — the
1.0 card's gradient with a warmer end. `clipsContent` on.

The rings extend the avatar's gold ring and the brand mark's ring into the whole card; on the
empty-state cards they fill the right half that used to be blank. Stronger versions
(ring 35 / 18 %, tint 10 %) were rejected because the ring crossed the rank values.

Contrast over the decoration (worst-case composites): bottom-row marks over the 5 % band —
P 11.2 · FC 10.3 · S 7.9 · white 13.9 · Basic 5.5 · Recital 5.9; where a 24 % ring line
crosses text — Basic 4.37, Recital 4.73, everything else ≥ 6.3. `#666674` meta stays the
open WCAG item from §5-2 (2.74 / 2.19 here).

Implementation: four absolutely positioned layers under the content in the `ImageResponse`
tree (satori supports linear gradients, borders and `border-radius: 50%`; no blur or SVG
filters are needed).
