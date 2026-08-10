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
- PixiJS 8
- Prisma 6, Neon PostgreSQL
- Discord OAuth, iron-session
- Vercel, Vercel Blob, Vercel Cron
- Vitest, Playwright, ESLint, Prettier, Husky

### NosLog 2.0 디자인 권위

Tailwind CSS는 스타일 구현과 반응형 layout을 위한 기술 스택이며, Tailwind의 기본
palette·theme·starter template은 NosLog 2.0의 시각적 권위가 아닙니다. NosLog 2.0의
색상과 visual Foundation은 승인된 `docs/design/` 문서와 `AGENTS.md`의 조사·승인
규칙을 따릅니다.

현재 Dark/Light neutral primitive source는 Adobe Spectrum S2로 승인되어 있습니다.
공개된 원본값을 그대로 사용하며 Tailwind 색상, 현재 custom palette 또는 다른 design
system의 값을 임의로 혼합하거나 보간하지 않습니다. Primitive source, semantic-role
mapping, component mapping과 실제 구현은 각각 별도의 승인 단계입니다.

현재 signature identity source는 `SS-08` Radix Colors Indigo로 승인되어 있습니다.
공개된 Light/Dark mapping을 하나의 온전한 source set으로 유지합니다. 이 승인은
그 자체로 identity/action component alias, 일반 interaction 재착색 또는 로고
재착색을 승인하지 않습니다. Filled primary action은 아래의 별도 `RPA-A` 정책을
따르며 Radix에는 action alias를 부여하지 않습니다.
Shopify Polaris와 `EXP-01` Polaris Light / Radix Dark split은 문서 `47`에 비교 근거로
보존하지만 현재 downstream design 또는 구현 source가 아닙니다.

Shell identity alias는 `ITA-C · Achromatic`으로 승인되었습니다. Graphical NosLog
mark와 보이는 `NosLog` wordmark는 appearance별 Spectrum S2 neutral foreground를
사용하며 Indigo mark, Indigo field, 기본 white outline을 사용하지 않습니다. Radix
identity source는 유지되지만 현재 승인된 shell 배치는 없으며, 다른 배치나 rare filled
primary action을 Radix에 할당하지 않습니다. 다른 identity 배치는 별도 사용자 승인
gate입니다.

Filled primary-action 정책은 `RPA-A · Achromatic primary`로 승인되었습니다. 실제
primary 자격이 입증된 non-destructive internal action은 page·bounded region·temporary
flow당 최대 하나만 사용하며 모든 화면에 필수적이지 않습니다. Light는 Spectrum S2
`#292929` default, `#131313` hover/pressed, `#FFFFFF` foreground를 사용하고 Dark는
`#DBDBDB` default, `#F2F2F2` hover/pressed, `#111111` foreground를 사용합니다. 일반
action·navigation·link·tool·동급 선택지는 낮은 neutral hierarchy를 유지합니다.
`RPA-B`, `RPA-C`의 Radix action mapping은 Dark hover/pressed에서 `4.28:1`로 측정되어
거절되었으며 downstream target으로 사용하지 않습니다.

Material Geometry는 `MG-A · Adobe Spectrum S2`로 승인되었습니다. 정확한 component
alias는 control/container/overlay/full radius `4px/8px/10px/50%`, justified raised
content의 `drop-shadow-emphasized`, temporary overlay의 `drop-shadow-elevated`, actively
moved content의 `drop-shadow-dragged`, Light/Dark scrim opacity `0.4/0.6`입니다. Flat
canvas·surface·sunken에는 기본 shadow를 사용하지 않으며 scroll boundary는 새 shadow
없이 승인된 `1px` directional boundary를 유지합니다. Fluent `MG-B`와 Atlassian
`MG-C`는 각각 semantic role 누락과 surface provenance 충돌로 거절되었습니다.

일반 UI iconography source는 문서 `60`의 17개 출처와 동일 NosLog 콘텐츠 비교 뒤
`IC-06 · Lucide`로 승인되었습니다. 원본 `24×24` viewBox, `2px` round stroke와 outline
treatment를 유지하며 routine action·wayfinding은 `20px`, visible label이 인접한 compact
supporting·metadata icon만 `16px`를 사용합니다. 일반 UI icon은 `16px`보다 작게 쓰지
않습니다. Primary·unfamiliar·destructive·low-frequency action은 visible label을
유지하고, icon-only control은 보편적인 contextual action으로 제한해 explicit accessible
action name과 mobile `44×44px`, 해당 desktop `40×40px` 이상의 target을 제공합니다.
Icon은 승인된 foreground 또는 semantic control state를 상속하며 임의의 signature·data·
difficulty·judgement·feedback color, selection fill, 다른 system glyph 혼합 또는 source path
수정을 사용하지 않습니다. Tailwind나 설치 편의를 출처 권위로 삼은 결정이 아니며,
viewer/editor 전체와 logo·brand mark·data-visualization mark에는 적용하지 않습니다.

Universal feedback/status mapping은 `FS-BN · Atlassian semantic color + neutral
message typography`로 승인되었습니다. Information·success·warning·danger의
background·marker·border·icon은 문서 `54`에 기록된 정확한 Atlassian Light/Dark 값을
사용하고, message container의 title과 body는 승인된 Spectrum S2 neutral foreground를
사용합니다. Field error와 destructive text는 Atlassian danger text를 유지합니다. IBM
Carbon은 neutral typography 원칙의 비교 근거일 뿐이며 Carbon·Tailwind 색상이나 보간한
값을 이 mapping에 섞지 않습니다. 이 승인은 feedback/status Gate만 완료했습니다.
이후 NOSTALGIA difficulty color와 comparison-local data color도 같은 블록 `1` 안에서
각각 승인됐으며 별도 작업 단위로 세지 않습니다.

완료된 블록 `1`의 C5 color 작업은 위의 채보 viewer/editor 전체 보존 예외를 침범하지 않습니다.
기존 renderer의 note·left/right-hand color는 Foundation token 후보가 아니며 exact-source
비교에서 제외합니다. Viewer/editor 전체 밖의 repeated-scanning 일반 UI에서는
Normal·Hard·Expert·Real을 서로 다른 네 가지 지속 색상으로 구분합니다. 이는 승인된 제품
요구사항이며 color와 neutral 중 하나를 다시 고르는 항목이 아닙니다. 정확한 mapping은
`DU-01 · Adobe Spectrum S2`로 승인했습니다. Normal은 Light/Dark `#0BA45D/#068850`,
Hard는 `#E86A00/#E06400`, Expert는 `#F03823/#CD2E1D`, Real은
`#A65CE7/#AD69E9`입니다. 이 승인은 일반 UI의 작은 난이도 marker 색만 정하며 난이도
text·background·container·selection·focus·feedback·action 또는 viewer/editor 요소를
재착색하지 않습니다. Basic/Recital,
rank/achievement·genre는 기본 neutral을 유지합니다. 일반 UI의 기본 comparison-local
data color는 `LD-03 · SAP Fiori Horizon`으로 승인했습니다. 문서 `58`에 기록한 정확한
`@sap-theming/theming-base-content@11.36.3` Light/Dark mapping을 사용합니다. Single
series는 `#168EFF/#3278BE`, FAST/SLOW는 `#168EFF/#C87B00` 및
`#3278BE/#F2A634`입니다. 여섯 score bucket과 일반 categorical series의 전체 값도 문서
`58`을 그대로 따르며 혼합·보간하지 않습니다. 유일한 더 좁은 예외는 문서 `59`의
`JD-02 · Radix Colors 3.0.0` 판정 domain mapping입니다. S-Just Light/Dark는
`#C2298A/#FF8DCC`, Just는 `#AB6400/#FFCA16`, Good은 `#107D98/#4CCCE6`, Near는
`#0D74CE/#70B8FF`, Miss는 `#646464/#B4B4B4`이며 모두 공개된 Radix step 11
값입니다. 이 색은 판정 marker/bar에만 사용하고 label·count·percentage·surface·container는
Spectrum neutral을 유지합니다. Radix `gray11`도 Foundation neutral primitive가 아니라
판정 domain color이며 Adobe Spectrum S2의 neutral 권위를 대체하지 않습니다. 숫자
threshold/reference line은 기본적으로 Spectrum neutral structural role을 유지합니다.
FAST/SLOW의 direct label과 서로 다른
marker/line style, score bucket의 숫자·label·순서를 함께 유지합니다. Carbon과 GitLab은
선택되지 않은 비교 근거일 뿐 downstream target이 아닙니다. 이 승인으로 블록 `1 · C5
color 마감`이 완료됐습니다.

### NosLog 2.0 디자인 가이드 남은 작업 기준선

이 표는 오래된 디자인 문서의 미완료 체크리스트가 이후 승인 결과를 다시 미완료로
되돌리는 일을 막기 위한 현재 진행 권위입니다. 이후 번호 문서의 명시적 승인·거절·대체
기록은 이전 문서의 계획 문구보다 우선합니다. `Complete` 항목은 사용자가 해당 결정을
명시적으로 다시 열지 않는 한 재조사하거나 남은 작업으로 계산하지 않습니다.

Git 이력 감사 결과, 이전의 고정 `18` package 분모와 `69%` 표시는 사전에 승인된
roadmap에서 나온 값이 아니라 2026-08-10 중간 문서화 과정에서 새로 만들어진 관리
분류였습니다. 사용자가 이 분류가 실제 남은 작업을 부풀렸다고 명시적으로 거부했으므로
폐기합니다. 새 분모가 별도로 승인되기 전에는 완료 퍼센트를 표시하지 않습니다.

완료된 범위는 제품 감사, IA/navigation, Page Brief, 교차 원칙과 예외 거버넌스,
Typography·Spacing·Grid·Layout, `S1`–`S5` 구조 검증, neutral surface/foreground/
boundary/interaction/focus, signature source, achromatic shell과 primary action,
Material Geometry, `FS-BN` feedback mapping, `DU-01` difficulty marker, `LD-03`
local data color 및 `JD-02` judgement domain color를 포함한 C5 color 마감, `IC-06`
Lucide 일반 UI iconography입니다. 이 항목들은 다시 남은 작업으로 세지 않습니다.

아래 표는 고정된 여섯 블록 기준선과 완료 이력을 함께 보존합니다. 블록 `1`과 `2` 완료 뒤
실제로 남은 큰 작업은 블록 `3`–`6`의 네 개입니다. 한 블록의
조사·specimen·검증·문서화는 그 블록의 하위 단계이며 새 top-level 작업으로 늘려 세지
않습니다.

앞으로 사용자에게 남은 작업으로 제시하고 진행하는 단위도 이 네 블록뿐입니다. 한 블록을
시작하면 조사, 후보 비교, specimen, browser 검증, 사용자에게 필요한 핵심 결정,
한영 문서 반영과 정리를 모두 같은 블록 안에서 이어서 수행합니다. 사용자의 material
decision이 필요할 때만 잠시 확인하고, 승인 뒤에는 새 작업을 만들지 않고 같은 블록을
계속합니다. 내부 단계·문서·후보·검증 횟수를 “다음 작업”, 별도 package 또는 남은 작업으로
표현하지 않습니다.

|   # | 남은 작업 블록                        | 상태          | 정확한 범위                                                                                                       |
| --: | ------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------- |
|   1 | C5 color 마감                         | `Complete`    | `DU-01` difficulty, `LD-03` SAP local data, `JD-02` Radix judgement color 승인 완료; viewer/editor 전체 제외      |
|   2 | Iconography                           | `Complete`    | `IC-06` Lucide 20px/16px, 2px stroke, label/icon-only, target 및 accessible-name grammar 승인·검증 완료           |
|   3 | Motion / Reduced motion               | `Not started` | 일반 UI motion purpose, duration/easing, reduced-motion 대체                                                      |
|   4 | Data-visualization anatomy            | `Not started` | 일반 UI axis, legend, exact value, tooltip/focus, non-color/table fallback                                        |
|   5 | Foundation 승격과 reusable UI 정리    | `Not started` | 완료된 일반 UI fixture 회귀, Pretendard JP delivery/fallback 검증, component·pattern·template 통합                |
|   6 | Downstream handoff와 milestone export | `Not started` | 기존 Page Brief의 screen requirement·mapping·QA 통합, Claude Design handoff, 언어/packaging 결정 뒤 versioned PDF |

향후 Foundation 통합 검사는 구조 작업의 반복이 아닙니다. 이후 승인되는 appearance
규칙이 완료된 일반 UI `S1`, `S2`, `S3`, `S5` fixture를 손상하지 않았는지만 확인합니다. 새 `S6`
editor 표본은 없으며 viewer/editor는 최종 회귀·component·template·handoff 변경 범위에서도
제외합니다. 정확한 남은 범위와 오래된 문구의 처리 상태는 문서 `57`을 따릅니다.

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
| 데이터베이스       | `DATABASE_URL`                                                       |
| 로그인 세션        | `COOKIE_PASSWORD`                                                    |
| 북마클릿 서명      | `BOOKMARKLET_SECRET`                                                 |
| 서비스 주소        | `APP_URL`                                                            |
| Discord OAuth      | `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI` |
| Kakao Maps         | `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`                                      |
| 공개 이미지 Blob   | `BLOB_READ_WRITE_TOKEN`, `BLOB_STORE_ID`, `BLOB_WEBHOOK_PUBLIC_KEY`  |
| 비공개 증빙 Blob   | `PRIVATE_BLOB_READ_WRITE_TOKEN`                                      |
| 개인정보 정리 Cron | `CRON_SECRET`                                                        |

`COOKIE_PASSWORD`, `BOOKMARKLET_SECRET`, `CRON_SECRET`에는 충분히 긴 서로 다른 임의 문자열을 사용합니다. 실제 환경변수와 토큰은 Git에 커밋하지 않습니다.

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
```

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
