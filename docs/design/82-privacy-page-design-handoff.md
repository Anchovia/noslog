# 82 · Privacy and Data Practices — High-Fidelity Design Handoff

**Page family** P15 · Privacy
**Governing brief** [18-privacy-data-practices-page-brief.md](18-privacy-data-practices-page-brief.md)
**Figma page** `P15 · Privacy 조립` (file `NosLog v2.0.0`, `cVbWCxhkfxFfHmAKLCyKrD`, page `2923:2`)
**Built** 2026-09-02

---

## 1. What is in the file

11 sections, 21 frames, no page-level stray nodes.

| Section                                      | Frames |
| -------------------------------------------- | ------ |
| `Privacy · Compact 390` / `· Dark`           | 6 + 6  |
| `Privacy · 검증 320 (KO)` / `· Dark`         | 1 + 1  |
| `Privacy · Intermediate 768 (KO)` / `· Dark` | 1 + 1  |
| `Privacy · Wide 1280 (KO)` / `· Dark`        | 1 + 1  |
| `Privacy · 상태 스위트 (인쇄 시편)`          | 1      |
| `Privacy · Compact 390 · JA`, `· EN`         | 1 + 1  |

**Base 390 — 6 screens.** 정책 전문(로그아웃, 5,147px — 12절 재구성 + at-a-glance +
목차 disclosure + **차단자 SM Warning 4곳**) · 목차 펼침(12절 링크, 타겟 44) ·
로그인(설정 열기·탈퇴 링크) · 이전 버전 목록(superseded 1건 포함 대표 데이터) ·
아카이브 열람(종료 배너 + 현행 방침 링크) · 이력 없음.

**Print specimen.** 794 단일 흐름 — 셸·스티키·disclosure 없음, 날짜·버전·연락처
포함, 흰 배경(인쇄 기준이라 토큰 비대상 규약).

### Shell and measures

Ordinary shell, 844 floor. `320`/`768` = 같은 단일 열(m16/m24). `1280` =
**본문 `reading 768` 좌 + 목차 292 스티키 우**(현재 절 `interaction/menu-set` +
`emphasis-label`) — GitHub privacy statement 실측(본문 720 + 우측 목차 384)과
MS Learn의 우측 "In this article" 문법. Footer `Layout=Wide`. 인쇄 시편은 Dark
제외(인쇄물은 모드 없음).

---

## 2. Decisions realised here

| Decision                                                                                                 | Record             |
| -------------------------------------------------------------------------------------------------------- | ------------------ |
| `PRIV-36` — at-a-glance = 플랫 4그룹(emphasis 제목 + 본문 + 밑줄 절 링크, divider 구분, 카드 없음)       | brief Decision Log |
| `PRIV-37` — 차단자 = C4 `StatusMessage` Warning을 해당 위치에(`법률 검토 대기` + 임시값 명시)            | brief Decision Log |
| `PRIV-38` — wide = 본문 768 + 우측 목차 292 스티키; 컴팩트 목차 = 상단 disclosure; 한국어 문구 세트 승인 | brief Decision Log |

### The 12-section reorganization

현행 11절을 브리프의 사용자 질문 순서로 재구성: ①운영자·범위·연령 ②항목·목적
③수집 방법 ④공개·공개 설정 ⑤수집하지 않는 것 ⑥보유·삭제 ⑦위탁·국외 이전
⑧외부 서비스 ⑨쿠키·기기 저장 ⑩권리 ⑪안전성 ⑫변경·이력. 현행의 검증된 문장은
그대로 재사용하고, 신규 절(연령 14세 규칙 · 공개 결과 · 미수집 불릿 8 ·
`noslog-locale`/로컬 저장 3종 · 버전 이력)을 승인 문구로 추가했다.

### Mandated wording repair

현행의 **「즉시 영구 삭제」(直ちに完全削除 / immediately and permanently
deleted)를 3로케일 모두 「활성 시스템에서 삭제」로 완화**하고 백업·제공자 보관
검증 차단자를 병기했다 — 브리프가 검증 전 이 표현을 금지한다(PRIV-B04/B05).

### Release blockers drawn as blockers

SM Warning 4곳: 운영자 명의(PRIV-B01) · 백업/삭제 창(PRIV-B04·B05) · 리전·
하위처리자·로그(PRIV-B03·B06) · 외부 임베드 동의(PRIV-B07). 각각 임시값을
명시적으로 "임시"라 부른다 — 스타일된 플레이스홀더를 확정처럼 보이게 하지 않는다.

---

## 3. Fixtures and their boundaries

- 정책 본문은 현행 `app/(nevigation)/privacy/page.tsx`의 3로케일 실카피가 소스다
  (연락 이메일 `sodacandy77@naver.com` 실제값 포함). 신규 절의 ja/en은 이번 빌드
  드래프트다.
- 이전 버전 목록의 2행(현행 2026-07-27 · 종료 2026-05-01)은 대표 데이터다 —
  실제 이력은 버전 관리 구현이 만든다.
- `자세히 보기`/`詳しく見る`/`See details` 링크 4회 반복은 `bingo.termAria`류의
  aria-label로 대상 절을 식별하는 것이 구현 계약(반복 무명 링크 금지 조항).

---

## 4. Validation

```
A 레이아웃  spacing 0(목차 항목 6→12/8 정정 24곳 · 컴팩트 목차 타겟 44) · 넘침 0
            (EN 절 제목 → 전 로케일 제목 FILL 204곳 정정 후 재검) · 이탈 0 · 겹침 0
B 타이포    Text Style 100% · 절 section-title · 항목 component-title · 본문 body ·
            요약 그룹 emphasis-label+body-secondary · 날짜 metadata
C 색        바인딩 100%(인쇄 시편 흰 배경 = 인쇄 규약) · 링크 = content/interactive+밑줄 ·
            차단자 = feedback warning 토큰(모드 자동) · Dark 9장
시각        1x 렌더 — 기본 전문 · 1280(본문+목차·현재 절) · Dark 차단자 영역
```

**Not executed — not a pass:**

- Full WCAG contrast sweep both modes(깊은 검증 단계)
- 200–400% zoom, text spacing, print-CSS 실동작, 키보드/스크린리더(목차 nav ·
  anchor scroll margin · aria-current는 브리프의 구현 계약)
- JA/EN의 390 외 폭 · 상태 변형 · 법률 번역 검토(PRIV-B08 — 릴리스 차단자)

---

## 5. Open items

1. **9 release blockers stand** (PRIV-B01~B09). 프레임의 SM Warning 4곳은 그중
   시각적으로 표시 가능한 것들이며, 나머지(법적 근거·연령 메커니즘·번역 검토 등)는
   운영·법률 작업이다. 스타일된 플레이스홀더를 승인으로 전환하지 말 것.
2. **신규 절 ja/en은 드래프트** — 법률 번역 검토(PRIV-B08) 전 확정 금지.
3. **버전 이력 라우트와 아카이브 URL 체계**는 구현 계약(브리프 Implementation
   Mapping · policy history 행) — 프레임은 목록/아카이브의 시각 계약만 확정.
4. **컴팩트 목차 disclosure의 앵커 이동 동작**(Focus 이동 · scroll-margin ·
   reduced motion)은 브리프 Interaction 절의 구현 계약.
5. **retention/cookie의 표 형태**는 컴팩트에서 라벨 행 그룹으로 그렸다(브리프의
   재구성 조항). wide에서 진짜 표가 필요해지면 semantic table + 헤더 연관 유지가
   조건.
6. **인쇄 시편의 링크 처리**는 "유용한 링크 텍스트 유지"로 그렸다 — URL 병기가
   필요한 항목(이전 버전 등)은 print-CSS에서 결정.

## 6. Deep-verification amendments — 2026-09-04

- **Defect found and fixed:** `toc disclosure · open` in `Privacy · 390 · 목차 펼침` (Light
  and Dark) was a FIXED 48 frame with 624 of content — the open TOC rendered collapsed.
  Restored to HUG; the screen grew 5,147 → 5,723 and the two Compact sections were reflowed.
  The `§1` height figure above (5,147) is the base screen; the TOC-open screen is 5,723.

- 2026-09-04: at-a-glance group titles `emphasis-label` → `component-title 16/24` (`PRIV-36` amended, Z1 ⑳). Group block 427 → 443 at 390.
