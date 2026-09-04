# NosLog

NOSTALGIA 플레이 기록을 모아 보고, 악곡별 성과·서열·랭킹과 채보를 확인하는 비공식 팬 프로젝트입니다.

현재 버전: **v1.6.0**

> NosLog는 KONAMI 및 공식 NOSTALGIA 서비스와 관련이 없습니다.

## 주요 기능

- **홈**: 공지사항과 주요 메뉴를 간결하게 제공
- **악곡**: 검색, 난이도 필터, 개인 기록 기반 정렬과 악곡별 상세 기록
- **기록 분석**: 점수·콤보·판정·FAST/SLOW·음표별 성공률과 최근 기록 추이
- **랭킹**: Basic·Recital 공식 Grd 및 Basic 서열 레이팅 순위
- **서열표**: S·Full Combo·Pianist 목표별 서열과 상위 70곡 기준 가중치 안내
- **빙고**: 수동 판정 방식의 미션과 달성 현황
- **검정**: 과제곡, 합격 조건, 응시 정보와 선택형 플레이 조언
- **프로필**: 베스트 성과, 최근 플레이, 랭크 분포와 판정 상세
- **데이터 연동**: 북마클릿을 이용한 NOSTALGIA 기록 동기화와 결과 확인
- **다국어**: 한국어·일본어·영어 사용자 화면과 언어별 공유 경로
- **번역 곡명**: 원문 제목을 유지하면서 검수된 한국어·영어 제목 또는 일본어 읽기 표시
- **개인정보 관리**: 개인정보처리방침, 회원 탈퇴, 비공개 증빙 이미지와 보관 기간 관리
- **관리자**: 운영 현황, 사용자, 악곡 번역, 변경 후보, 서열표, 빙고, 검정과 동기화 데이터 관리

사용자 페이지는 `/ko`, `/ja`, `/en` 경로를 사용합니다. 비로그인 사용자는 브라우저 언어에 따라 첫 언어가 결정되며, 로그인 사용자는 설정에서 언어와 번역 곡명 표시 여부를 변경할 수 있습니다. 관리자 페이지는 한국어로만 운영합니다.

관리자는 악곡 번역의 승인·초안·미번역 현황을 확인하고 CSV로 내보내거나 일괄 등록할 수 있습니다. 사용자 화면에는 승인된 번역만 노출됩니다.

### 채보 편집기와 뷰어

- 관리자용 28칸 채보 편집기
- 일반·테누토·글리산도·트릴 4종 노트
- BPM, 박자표, 오프셋과 다중 타이밍 포인트
- 노트 위치·폭·연주 안내 손·경로 제어점 편집
- 실행 취소·다시 실행, 수정 이력과 공개 스냅샷
- 음원을 포함하지 않는 `.noslog-chart.json` 가져오기·내보내기
- 전체 악보형 뷰어와 PixiJS 기반 낙하형 재생 뷰어
- BPM·박자표 기준 4마디 단위 전체 악보와 마디·타이밍 변경 표시
- 메트로놈과 볼륨 조절, 노트 폭을 건반 연주로 해석하는 엄밀한 연주 옵션
- 서버에 전송하지 않는 브라우저 로컬 음원 불러오기

편집 화면은 데스크톱과 가로형 태블릿을 기준으로 하며, 공개 뷰어는 모바일에서도 이용할 수 있습니다.

NosLog 2.0에서도 기존 채보 viewer와 editor 전체는 보존 예외입니다. Page, DOM shell,
control, label, accessibility behavior, responsive composition·containment,
PixiJS/WebGL 낙하형 renderer, Canvas 전체 악보 renderer, note·left/right-hand palette,
renderer geometry·animation·chart mathematics 및 editor rendering model을 모두 현재
구현 그대로 유지합니다. Foundation color·material·motion·icon·data visualization,
component·template·responsive 규칙을 적용하거나 2.0 변형을 만들지 않습니다. 과거
viewer/editor Page Brief와 `S4`/`S6` 계획은 기능을 기록한 역사적 근거일 뿐 변경 권한이
아닙니다. 사용자가 전체 예외 또는 정확히 지목한 하위 범위를 명시적으로 다시 열기 전에는
어떤 부분도 변경하지 않습니다.

## 기술 스택

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4, Radix UI
- React Hook Form, Zod
- TanStack Query, Zustand
- PixiJS 8
- Prisma 6, Neon PostgreSQL
- Discord OAuth, iron-session
- Vercel, Vercel Blob, Vercel Cron
- Vitest, Playwright, ESLint, Prettier, Husky

### 코드 구조 및 스타일

NosLog의 코드 작성·디렉터리·API 응답·Server Action·Zod·React Hook Form 규칙은
[코드 스타일 문서](./docs/code-style.md)를 따릅니다. 기존 Jeongbiseo와 Fit-again
프런트엔드에서 검증된 공통 규칙을 Next.js App Router에 맞게 적용한 기준입니다.

[코드 스타일 전수 점검 기록](./docs/code-style-audit.md)에 실제 미정리 범위와 유지할
예외를 구분합니다. 정적 검사 통과와 전체 리팩터링 완료는 다릅니다. `features/`의
타입 전용 import는 ESLint가 검사하며, 채보 viewer/editor에는 이 이관 규칙을 확대하지
않습니다.

- `app/`은 route, layout, Route Handler와 Server Action 진입점을 담당합니다.
- 재사용되는 도메인 코드는 `features/<domain>/` 아래 `api`, `components`, `hooks`,
  `schemas`, `server`, `types` 책임으로 점진적으로 이동합니다.
- 공통 UI는 `components/ui/`, 교차 도메인 기반 기능은 `lib/`에 둡니다.
- 새 내부 Route Handler는 `isSuccess`, `code`, `message`, `result`가 있는 공통
  `ApiResponse<T>`를 사용하고, 컴포넌트에는 정규화한 도메인 데이터만 전달합니다.
- Axios는 추가하지 않으며 native `fetch`와 TanStack Query를 사용합니다.
- 폼은 React Hook Form과 Zod를 사용하고 같은 스키마를 서버 경계에서 다시 검증합니다.
- 한국어·일본어·영어 사용자 오류 문구를 지원하며 공용 스키마에 한국어 문구만
  하드코딩하지 않습니다.
- 외부 소비자가 있는 기존 API와 채보 viewer/editor 보존 범위는 코드 스타일 정리만으로
  변경하지 않습니다.

### NosLog 2.0 디자인 권위

NosLog 2.0 디자인 가이드의 활성 소스는 `docs/design/` 아래 **영문 문서만** 사용합니다.
더 이상 `.ko.md` companion을 만들거나 한영 문서 동기화를 요구하지 않습니다. 이 정책은
디자인 문서에만 적용되며, 제품 UI의 한국어·일본어·영어 지원과 다국어 검증 요구는 그대로
유지합니다.

현재 권위는 다음 순서로 판단합니다.

1. 사용자의 가장 최근 명시적 결정
2. `AGENTS.md`의 작업·보존 경계
3. 이 `README.md`의 제품 기준선과 여섯 블록 진행 상태
4. [현재 남은 작업 감사](./docs/design/57-design-guide-remaining-work-audit.md)
5. [Downstream 디자인·구현 handoff](./docs/design/64-downstream-design-implementation-handoff.md)
6. [Foundation v0.1 규범](./docs/design/24-foundation-v0.1.md)
7. [Foundation v0.1 출처와 결정 이력](./docs/design/25-foundation-v0.1-provenance.md)
8. 그 밖의 현재 영문 제품 감사·IA·Page Brief·교차 원칙 문서

이후 문서의 명시적 `Approved`·`Rejected`·`Superseded` 기록은 과거 제안, 체크리스트,
specimen, 문서 번호보다 우선합니다. 삭제된 비교 문서는 Git 이력에만 보존하며 현재
남은 작업을 복원하는 근거로 사용하지 않습니다. 정확한 token·alias·source 값은 문서
`24`와 `25`에만 유지하고 이 README나 AGENTS.md에 중복 복사하지 않습니다.

Tailwind CSS는 구현과 반응형 layout 도구일 뿐 palette·starter theme·sample component의
시각적 권위가 아닙니다. 현재 승인된 Foundation은 저명한 design system의 공개 원본값과
사용자 승인 기록을 따르며, 임의 혼합·보간·색조 이동을 허용하지 않습니다.

기존 채보 viewer와 editor 전체는 NosLog 2.0 보존 예외입니다. Page, DOM shell, control,
label, accessibility behavior, responsive composition·containment, PixiJS/WebGL Falling
renderer, Canvas Full-sheet renderer, note·left/right-hand palette, geometry, animation,
chart mathematics와 editor rendering model을 현재 구현 그대로 유지합니다. 일반 UI
Foundation·component·template·handoff 규칙을 적용하거나 새 specimen을 만들지 않습니다.
정확한 경계는 [보존 계약](./docs/design/07-chart-viewer-editor-preservation.md)을 따릅니다.

### NosLog 2.0 디자인 가이드 남은 작업 기준선

고정된 사용자 대면 작업 단위는 아래 여섯 블록뿐입니다. 완료된 블록을 오래된 문서의
미완료 문구로 다시 열지 않으며, 조사·후보·specimen·검증·문서화 같은 내부 단계를 새
top-level 작업으로 세지 않습니다. 사용자가 분모와 계산법을 따로 승인하기 전에는 완료
퍼센트를 표시하지 않습니다.

|   # | 작업 블록                             | 상태       | 현재 범위                                                                                               |
| --: | ------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------- |
|   1 | C5 color 마감                         | `Complete` | difficulty, local-data, judgement color 승인 완료; viewer/editor 제외                                   |
|   2 | Iconography                           | `Complete` | Lucide 일반 UI source, size, stroke, label, target 계약 승인 완료                                       |
|   3 | Motion / Reduced motion               | `Complete` | Atlassian duration/easing과 reduced-motion 대체 계약 승인 완료                                          |
|   4 | Data-visualization anatomy            | `Complete` | GitHub Primer 기반 일반 UI anatomy·interaction 계약 승인 완료                                           |
|   5 | Foundation 승격과 reusable UI 정리    | `Complete` | Foundation v0.1, Pretendard JP delivery, 문서 63의 lean reusable UI alias·pattern 승인 완료             |
|   6 | Downstream handoff와 milestone export | `Complete` | 문서 64의 screen requirements·mapping·QA·downstream design 경계와 English ED-03 milestone PDF 승인 완료 |

여섯 블록이 모두 완료되어 남은 top-level 디자인 가이드 작업은 없습니다. 완료된 Block 5 package는
[문서 63](./docs/design/63-foundation-v0.1-reusable-ui-regression.md)에 기록되어 있으며,
Block 6 downstream package는
[문서 64](./docs/design/64-downstream-design-implementation-handoff.md)에 기록되어 있습니다.
배포용 산출물은
[NosLog 2.0 Design Guide v0.1 PDF](./output/pdf/noslog-2.0-design-guide-v0.1.pdf)입니다.
과거 proposal·specimen·checklist로 완료된 블록을 다시 열지 않습니다.

2026-08-12 사용자 결정에 따라 악곡 검색 결과의 개인 기록 hover/focus preview는
`Superseded`되었습니다. 결과 카드는 입력 방식과 관계없이 악곡 정체성을 유지하고,
개인 성과 상세는 적용 상태 요약 또는 악곡 상세에서 제공합니다. 이 정정은 완료된 여섯
블록을 다시 열거나 chart viewer/editor 경계를 변경하지 않습니다.

현재 downstream high-fidelity Figma 작업은 기존 `NosLog v2.0.0` 파일에서 이어집니다.
특정 도구 이름은 권위가 아니며, 문서 `24`·`25`·`63`의 승인 후 정밀 보정과 문서 `05`의
Music Detail 후속 결정도 현재 권위에 반영했습니다. 이는 완료된 여섯 디자인 가이드
블록을 다시 열지 않으며, 구현은 이후의 별도 Codex 세션에 남습니다.

PDF에 추가하는 시각 자료는 외형만 보고 규범으로 승인하지 않습니다. 현재 Foundation
권위와 고정된 upstream 원본을 일대일로 대조하고,
`scripts/design-guide-visual-core-manifest.json` 및
`scripts/validate-design-guide-visual-core.py` 검증을 통과한 review artifact만 사용자
검토 대상으로 사용합니다. 대체 font, 손으로 근사한 icon, 추정 shadow 또는 역할 밖
chroma는 검증 실패로 처리하며 milestone PDF에 통합하지 않습니다.

## 로컬 개발

### 준비 사항

- Node.js 24 권장
- npm
- PostgreSQL 또는 Neon 데이터베이스

### 1. 저장소와 의존성 준비

```bash
git clone https://github.com/Anchovia/noslog.git
cd noslog
npm install
```

`npm install` 과정에서 Prisma Client가 자동으로 생성됩니다.

### 2. 환경변수 설정

`.env.example`을 복사해 `.env`를 만들고 개발 환경의 실제 값을 입력합니다.

```powershell
Copy-Item .env.example .env
```

주요 환경변수는 다음과 같습니다.

| 구분               | 환경변수                                                             |
| ------------------ | -------------------------------------------------------------------- |
| 데이터베이스       | `DATABASE_URL`, optional `DATABASE_EXPECTED_HOST`                    |
| 로그인 세션        | `COOKIE_PASSWORD`                                                    |
| 북마클릿 서명      | `BOOKMARKLET_SECRET`                                                 |
| 서비스 주소        | `APP_URL`                                                            |
| Discord OAuth      | `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI` |
| Kakao Maps         | `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`                                      |
| 공개 이미지 Blob   | `BLOB_READ_WRITE_TOKEN`, `BLOB_STORE_ID`, `BLOB_WEBHOOK_PUBLIC_KEY`  |
| 비공개 증빙 Blob   | `PRIVATE_BLOB_READ_WRITE_TOKEN`                                      |
| 개인정보 정리 Cron | `CRON_SECRET`                                                        |

`COOKIE_PASSWORD`, `BOOKMARKLET_SECRET`, `CRON_SECRET`에는 충분히 긴 서로 다른 임의 문자열을 사용합니다. 실제 환경변수와 토큰은 Git에 커밋하지 않습니다.

`DATABASE_EXPECTED_HOST`를 설정하면 `DATABASE_URL`의 실제 호스트가 정확히 일치하지
않는 배포와 실행을 차단합니다. Main과 Dev의 Neon 프로젝트 호스트를 각 환경에 따로
지정해 교차 연결을 방지합니다.

Neon의 pooled `DATABASE_URL`을 사용한다면 `DATABASE_EXPECTED_HOST`에도 같은
`-pooler` 호스트를 지정해야 합니다. Vercel에서 내려받은 `.env.production.local`의
Secret 값이 빈 문자열이면 하위 우선순위의 `.env` 값을 가리므로, 로컬 빌드에서는 해당
빈 키를 제거하고 Dev DB 및 로컬 전용 Secret을 사용합니다. Production DB 주소나
Production Secret을 로컬 검증용으로 복사하지 않습니다.

선택 환경변수:

- `MAINTENANCE_MODE=true`: 일반 페이지와 API에 점검 안내 표시
- `GOOGLE_SITE_VERIFICATION`: Google Search Console 인증값

### 3. 데이터베이스 적용

```bash
npm run db:migrate:deploy
```

스키마를 변경한 뒤 Prisma Client만 다시 생성하려면 다음 명령을 사용합니다.

```bash
npx prisma generate
```

팀원이 같은 Neon 개발 DB를 사용한다면 데이터는 별도로 복사할 필요가 없습니다. 각 컴퓨터의 `DATABASE_URL`이 같은 개발 DB를 가리키도록 설정하면 됩니다.

> `npm run db:seed:e2e`는 로컬 E2E 전용 PostgreSQL에서만 실행해야 합니다. 공유 Neon 개발 DB나 Production DB에는 실행하지 마세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

기본 주소는 `http://localhost:3000`입니다.

## 검증

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit
```

Prisma CLI는 빌드·마이그레이션 도구이므로 `devDependencies`에 둡니다. 현재
`@prisma/config`가 고정한 취약 버전 대신 패치된 `deepmerge-ts`를 `overrides`로
적용합니다. Prisma를 업데이트할 때는 upstream 의존성이 패치됐는지 확인한 뒤 불필요해진
override를 제거하고, `prisma validate`, 전체 테스트와 프로덕션 빌드를 다시 실행합니다.

Playwright E2E는 로컬 테스트 DB에 마이그레이션과 E2E 시드를 적용하고 개발 서버를 실행한 상태에서 사용할 수 있습니다.

```bash
npm run test:e2e
```

GitHub Actions에서는 다음 항목을 자동으로 확인합니다.

1. 의존성 설치
2. ESLint
3. Vitest 단위 테스트
4. TypeScript
5. 프로덕션 빌드
6. PostgreSQL 16에 전체 마이그레이션 적용
7. E2E 시드 및 Playwright 모바일·데스크톱 테스트

Playwright는 한국어·일본어·영어 경로, 주요 사용자 흐름, 390px 반응형 오버플로, 기본 접근성 구조, 처리되지 않은 브라우저 오류와 완화된 성능 안전선을 함께 검사합니다.

## 배포

Vercel Production 환경에는 `.env.example`에 명시된 서비스 환경변수와 다음 구성이 필요합니다.

- 공개 아바타용 Blob Store
- 검정·피드백 증빙용 비공개 Blob Store
- `CRON_SECRET`
- Neon Production `DATABASE_URL`

`vercel.json`의 빌드 명령은 배포 시 `prisma migrate deploy`를 먼저 실행한 뒤 Next.js 프로덕션 빌드를 실행합니다. 따라서 Production 환경의 `DATABASE_URL`은 반드시 Production DB를 가리켜야 합니다.

`dev`를 `main`에 병합한 뒤 Vercel Production 배포가 시작되면 다음 순서로 진행됩니다.

1. Production 환경변수 로드
2. Production DB에 미적용 Prisma 마이그레이션 반영
3. Next.js 프로덕션 빌드
4. 새 배포 활성화
5. `/api/health`에서 애플리케이션과 DB 연결 확인

운영 DB에 `db:seed:e2e` 또는 개발용 import 명령을 실행하지 않습니다. 마이그레이션을 수동으로 먼저 적용하는 별도 배포 전략을 사용하지 않는 한, 현재 구성에서는 `main` 병합 후 Vercel 빌드가 적용하도록 둡니다.

개인정보 보관 기간 정리 Cron은 매일 `18:00 UTC`에 실행됩니다. 한국 시간 기준 다음 날 오전 3시입니다.

DB 마이그레이션이 포함된 배포는 Production DB 백업을 확인한 뒤 진행합니다.

## 개인정보 처리 원칙

- 아바타는 공개 Blob에 저장합니다.
- 검정 증빙과 피드백 이미지는 비공개 Blob에 저장하고 권한이 확인된 API를 통해서만 제공합니다.
- 승인된 검정은 심사 완료 6개월 후 증빙 이미지와 심사 메모를 정리하고 합격 이력은 유지합니다.
- 반려된 검정과 처리 완료된 피드백 자료는 6개월 후 정리합니다.
- 회원 탈퇴 시 계정과 연결된 기록 및 업로드 자료를 영구 삭제합니다.
- 채보 편집용 로컬 음원은 브라우저에서만 사용하며 서버로 전송하거나 저장하지 않습니다.

자세한 내용은 서비스의 `/privacy` 페이지에서 확인할 수 있습니다.

## 버전 관리

NosLog는 `vMAJOR.MINOR.PATCH` 형식의 Semantic Versioning을 사용합니다.

| 구분    | 변경 기준                                | 예시                |
| ------- | ---------------------------------------- | ------------------- |
| `PATCH` | 버그 수정, UI 개선, 데이터 정정          | `v1.0.1` → `v1.0.2` |
| `MINOR` | 기존 기능과 호환되는 신규 기능 추가      | `v1.4.0` → `v1.5.0` |
| `MAJOR` | 호환되지 않는 구조·인증·데이터 규격 변경 | `v1.5.0` → `v2.0.0` |

### 배포 절차

1. 기능 개발과 검증은 `dev` 브랜치에서 진행합니다.
2. 배포할 변경에 맞춰 `package.json`과 `package-lock.json`의 버전을 올립니다.
3. 타입 검사, 린트, 테스트, 빌드와 E2E를 통과시킵니다.
4. `dev`에서 `main`으로 `release: NosLog v1.6.0` 형식의 PR을 생성합니다.
5. PR 본문에 주요 변경, DB 마이그레이션과 환경변수 변경 여부를 기록합니다.
6. `Create a merge commit`으로 병합하고 Production 배포를 확인합니다.
7. 병합된 `main` 커밋에 같은 버전의 Git 태그와 GitHub Release를 생성합니다.
