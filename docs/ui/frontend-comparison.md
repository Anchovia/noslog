# frontend 비교와 적용 기록

2026-10-08 `/Users/carol/Desktop/project/frontend`의 설정·협업 문서·공용 UI·로그인/가입 모델·화면·스토리를 NosLog와 비교했다.
외부 프로젝트 문서는 비교 자료이며 NosLog 작업 지침을 대체하지 않는다. 기능/시각 값의 원본은 NosLog 가이드다.

## 가져온 항목

| 항목                                  | NosLog 적용                                                                                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Storybook·Autodocs·play·axe 오류 처리 | 공용 UI 전체와 기능 화면 스토리. 기존 대비 위반을 숨기지 않는다.                                        |
| import/export 정렬·상위 상대경로 제한 | 공용 UI/feature와 공개 라우트·레이아웃·lib 정렬. 보호 영역 제외, 기존 참조 경계 유지.                   |
| 레이어 책임·실제 재사용 중심 추출     | 기존 features/components/ui/lib 책임을 문서화하고 역방향 참조 검사.                                     |
| 의미 토큰→Tailwind 별칭               | 기존 --nl-* 값의 nl 별칭. 색·규격·새 토큰은 옮기지 않는다.                                              |
| 편집기·포맷·Git hook·협업 양식        | 기존 적용한 컨벤션에 보안·배포/운영 Issue Form을 추가. Git 작업은 사용자 수행.                          |
| 화면 조합 스토리                      | 실제 온보딩·제보 View에 로컬 콜백을 제공해 오류·재시도·키보드·포커스를 검사.                            |
| 제출 잠금·이전 요청 결과 무시         | 폼 수준 submit 잠금, 닉네임 변경 순서 검사, 창 수명에 따른 제보 결과 무시.                              |
| 화면과 연결 책임 분리                 | 실제 actions/업로드/조회는 어댑터에, 표시·폼 검증은 View에 유지.                                        |
| 상세 Props·상태 계약                  | 소스 JSDoc, contracts.md, 오류/성공 동시 상태 스토리.                                                   |
| 시각 비교                             | 기존 Playwright와 공식 Linux 이미지로 로컬/CI 기준을 맞춘 screenshot 검사. Chromatic은 연결하지 않는다. |
| 패키지 매니저 명시                    | npm 버전 메타데이터와 Node 24 설정. pnpm으로 바꾸지 않는다.                                             |

추가 적용: 캐시 공개 범위·최신성·무효화·파생 화면 검증 규칙, 공개 TSX 토큰 검사,
기존 버튼 모양을 쓰는 `ButtonLink`, 목적을 드러내는 자켓 fallback 파일명,
리팩터링 Before/After·테스트 mock/환경·문서 참조 검증 예시를 기존 Issue Form에 보강했다.

## 이미 있거나 NosLog에 더 맞는 항목

| 비교 대상                                         | 유지 이유                                                                                                         |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| React Hook Form·Zod·useWatch·schema에서 타입 추론 | 기존 실제 기능과 서버 재검증에 적용됨. 로그인 예제를 새 인증 정책으로 옮기지 않음.                                |
| QueryClient 서버/브라우저 분리                    | AppProviders에 이미 구현. 실제 데이터의 staleTime/retry 정책 유지.                                                |
| 환경 변수 검증                                    | lib/env의 server/client 분리와 런타임 검증 유지. frontend에는 이에 해당하는 구현이 없음.                          |
| 오류 코드·서버 실패 표시                          | 기존 ActionResult·API envelope·필드/루트 오류·ko/ja/en 메시지 유지.                                               |
| 카운트다운                                        | frontend의 만료 시각 계산은 타당하지만 NosLog 계정 인증 만료도 이미 Date.now 기준. 범용 훅을 새로 만들 이유 없음. |
| 입력/버튼 네이티브 Props·ref, currentColor 아이콘 | 기존 입력/Checkbox/Button/ref와 Lucide 아이콘 유지.                                                               |
| 내비게이션 탭/토글/정보 태그 구분                 | 기존 AreaTabLinks/AreaTabs/FilterChips/상태 태그가 역할을 나눔.                                                   |
| 로컬 폰트·동작 줄이기                             | 자체 호스팅 Pretendard JP와 기존 움직임 토큰/감소 동작 유지.                                                      |
| TypeScript·테스트·의존성 검사                     | NosLog의 엄격한 TS 옵션·Node 단위 테스트·E2E·knip·production audit 유지.                                          |

## 적용하지 않은 항목과 이유

- Base UI/shadcn preset·SVG sprite: Radix/네이티브 UI와 Lucide를 교체할 확인된 이점 없음. 두 기반을 함께 추가하지 않는다.
- FSD 디렉터리로 전면 이동·공용 UI 전체 index export: NosLog 도메인 간 서비스 참조와 Next 서버/클라이언트 경계를 유지한다.
- TODAYIT 색·AstaSans·CTA 변형·모달 무스크롤·고정 크기·새 움직임: NosLog의 승인된 시각/반응형 규칙과 다르다.
- 비밀번호·OTP·Google/Kakao 로그인·약관 모델: NosLog는 Discord 로그인만 쓰고 비밀번호를 관리하지 않는다.
- Chromatic: 애드온 설치/등록은 확인했지만 프로젝트 연결·CI·실제 screenshot 비교 증거는 해당 폴더에 없다. 기존 Playwright로 같은 목적을 구현한다.
- pnpm allowBuilds/ignoredBuiltDependencies: pnpm 전용 설정. npm을 바꾸거나 sharp 설치를 무시하지 않는다.
- `latest` 테스트 의존성: 재현성을 높이는 설정이 아니다. 기존 lockfile과 정확한 브라우저 이미지 버전을 따른다.
- develop 브랜치·Squash·이모지 라벨·모든 작업 Issue 의무: NosLog의 dev/main 릴리스와 사용자 Git 흐름 유지.
- GitHub 라벨 초기화: 문서가 가리키는 scripts/setup-labels.*가 실제 폴더에 없고 기본 라벨 삭제도 포함한다. 실행하지 않는다.
- 기본 Create Next App metadata·임시 mock preview: 실제 운영 메타데이터/라우트로 가져오지 않는다.

이 비교에서 확인한 추가 이식 후보는 위 항목으로 정리했다. 아직 존재하지 않는 실제 API·배포·관측 체계를 frontend에서 가져왔다고 보고하지 않는다.
