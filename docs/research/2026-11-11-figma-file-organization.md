# Figma 파일 정리 방식 조사 (2026-11-11)

실무 웹 디자인 팀이 Figma 파일 · 페이지 · 섹션을 어떻게 나누는지 모은 기록이다. 목적은 데스크톱 재설계 시안 파일(여러 세션이 나눠 그린 파일)의 정리 안을 만드는 것이다. 관련 페이지 묶기, 페이지 하나에 여러 씬 묶기, 파운데이션(색 · 글자 · 간격 · 부품) 정리를 본다.

확인 날짜는 모두 2026-11-11. WebSearch · WebFetch 로 공식 문서 · 공개 글 · Community 파일 설명을 읽었다. Figma 파일 자체는 열지 않았으므로 Community 파일의 페이지 목록은 공개 글 · 파일 설명 · 저장소에 적힌 것만 옮겼다. 거기 없는 것은 「미확인」 이다.

표본: 실제 팀 · 공개 파일 22곳, 공식 · 가이드 글 25곳(공식 14 · 가이드 11). 파일 · 페이지 구성은 팀 17 · 글 14, 「페이지 안 배치」 절은 팀 9 · 글 7, 「이름 규칙」 절은 팀 13 · 글 12 로 따로 셌다(같은 곳이 여러 절에 들어간다). 막혀 세지 않은 곳은 「막힘」 표에 있다.

종류 표기: 「공식」 은 Figma 자체 문서, 「실제 팀」 은 자기 팀 · 자기 디자인 시스템 파일을 설명한 글이나 공개 파일, 「가이드」 는 특정 팀이 아닌 일반 권장 글 · 템플릿이다.

## 공식 · 가이드 글

### Figma Best practices — Team, project, and file structure

- URL: https://www.figma.com/best-practices/team-file-organization/
- 종류: 공식
- 파일 나누기: 제품 면(Account · Cart · Homepage) 또는 흐름 단위 파일. 처음부터 끝까지 이어 보는 「Full flow」 파일을 따로 둔다. 본 흐름은 파일 하나, 반복 작업은 다른 파일 · 브랜치에서 하고 출시 주기에 맞춰 합친 뒤 작은 파일은 아카이브. 플랫폼은 같은 개발자가 만들면 한 파일, 다르면 나눈다. 플랫폼 하나가 프레임 수백 개가 되면 페이지 · 파일로 나눈다. 그림이 많은 리서치는 성능 때문에 따로.
- 폴더(프로젝트) 첫 층: 제품 면 · 작업 상태(Production · In progress · Archive) · 디자인 단계(WIP · Review · Shipped) 중 하나로 정하고 가지마다 같은 논리를 쓴다. 디자인 시스템은 자기 팀을 따로 둔다.
- 페이지 구성(순서대로): Cover · Visual research · User research(선택) · Discovery · Flow · Prototype(선택) · Local components(선택) · Ready for development. 단계 사이는 하이픈 구분 페이지.
- 표지: 최소한 파일 이름 · 짧은 설명. 작업 스크린샷 · 상태 · 팀 사진을 더할 수 있다. 표지 프리셋으로 만들고 파일마다 같은 구조.
- 이름 규칙: 검색 결과에서 홀로 읽히게(「Auth」 대신 「Account auth」). 진행 중 파일 · 브랜치는 티켓 번호(「TWIG-813 - Button A/B test」 · 「TWIG-812 → Form fields」). 리서치 파일은 본 파일 이름 + 「- Research」. 큰 변경은 이름 붙은 버전(「January - Full profile user flow」).
- 파운데이션: 공유 라이브러리는 전용 팀에. 파일 전용 부품은 「Local components」 페이지. 긴 부품 문서는 별도 파일로 두어 문서와 부품 버전을 따로 낸다.
- 아카이브: 은퇴한 작업은 활성 폴더 밖으로. 큰 팀은 제품 면마다 Archive 하위 폴더, 작은 팀은 팀 전체 Archive 하나. Archive 전용 팀은 과하다고 적음.

### Figma Help — Create and manage pages

- URL: https://help.figma.com/hc/en-us/articles/360038511293
- 종류: 공식
- 페이지 쓰임 예: 디자인 단계별 페이지, 「ready for development」 전용 페이지, 마일스톤 · 크리틱용 고정 페이지, 메인 부품 · 스타일 정의 전용 페이지, 사용자 흐름마다 페이지(한 페이지에 프로토타입 여럿 가능, 미리보기는 한 번에 흐름 하나), 페이지 복제로 스냅샷 · 변형 만들기, 큰 파일은 레이어를 다른 페이지로 옮겨 나누기(댓글 유지).
- 구분 페이지: 빈 페이지 이름 맨 앞에 「-」 를 넣으면 구분선. 내용 있는 페이지는 구분선이 될 수 없다. 구분선에는 이름을 붙일 수 없다(포럼 기능 요청 https://forum.figma.com/t/add-a-name-for-each-divider/72080).
- 이름 규칙: 「spacer」 페이지 · 이모지로 목적과 상태를 알린다.
- 제한: Starter 팀 파일은 페이지 3개까지, 유료 요금제는 제한 없음. 페이지 캔버스는 축마다 약 ±130,000.

### Figma Help — Organize your canvas with sections

- URL: https://help.figma.com/hc/en-us/articles/9771500257687
- 종류: 공식
- 섹션은 캔버스의 이름 붙은 구역이다. 협업 · 아이디어 구역 지정, 탐색, 묶음 링크 공유, 개발 넘김 표시에 쓴다.
- 섹션은 캔버스 맨 위 층에 놓이고 섹션 안에 섹션을 넣을 수 있다. 프레임 · 그룹 안에는 못 넣는다. 레이어 패널에서 섹션 아이콘을 두 번 눌러 이동, 섹션 링크 공유 가능.
- 상태: 내용이 끝나면 섹션을 골라 「Mark as ready for dev」. 표시 뒤 고치면 자동으로 「Changed」 가 되고, 다시 Ready 로 돌리려면 이유를 적는다. 흐름별 · 상태별 묶기는 이 글에 없음(미확인).

### Figma Help — Dev Mode statuses and notifications

- URL: https://help.figma.com/hc/en-us/articles/26781702258583
- 종류: 공식
- 상태는 「Ready for dev」(Dev Mode 있는 모든 요금제)와 「Completed」(Organization · Enterprise)뿐이다. 표시 뒤 고치면 「Changed」. 그 밖의 상태(검토 중 · 승인 · 아카이브)는 기본 기능에 없고 포럼에서 요청 중이다(https://forum.figma.com/suggest-a-feature-11/section-statuses-besides-ready-for-dev-approved-in-progress-archived-etc-16717/index1.html). 그래서 팀들은 이모지 · 접두사 · 상태 배지 부품으로 대신한다(아래 곳들 참고).

### Figma Best practices — Guide to developer handoff

- URL: https://www.figma.com/best-practices/guide-to-developer-handoff/
- 종류: 공식(여러 회사 사례를 인용)
- 페이지로 「작업 중 · 피드백 준비 · 만들 준비」 를 나눈다. 상태 이모지 예 🏗️ · 💭 · 🚢.
- 인용 사례: Cash App 은 공유할 프레임마다 전용 페이지를 만들고 거기에 인스턴스를 두어, 지저분한 작업 페이지의 원본을 고치면 따라 바뀌게 한다. Dropbox 는 큰 프로젝트 하나에 파일 하나, 페이지에 반복 · 버전을 모두 두고 개발자에게 링크 하나만 준다. 결정은 따로 쓴 디자인 명세 문서에서 반복안 · 문제 정의 · 리서치로 링크한다. Expedia 는 부품 세트마다 이름 · 설명 · 사용법 · 변형 · 상태를 한 프레임에 둔다.
- 섹션 · 아카이브는 이 글에 없음.

### Figma Best practices — Components, styles, and shared libraries

- URL: https://www.figma.com/best-practices/components-styles-and-shared-libraries/
- 종류: 공식
- 라이브러리는 대상 · 플랫폼으로 나눠 필요한 것만 켜게 한다. 색 · 글자 스타일도 공유 라이브러리에.
- 라이브러리 파일 안: 페이지 = 큰 묶음, 프레임 = 관련 부품(예 Buttons 페이지 안에 버튼 종류마다 프레임). 페이지 이름은 부품 패널의 최상위 제목, 프레임 이름은 접히는 하위 제목이 된다. 슬래시 이름(「buttons/primary/default」)은 빠르지만 큰 시스템에선 이름이 길어진다.
- 이름 규칙: 발행하지 않을 도우미 부품은 이름 앞에 「_」 · 「.」.
- 문서는 라이브러리 파일 안 메인 부품 옆에 둔다.

## 실제 팀 · 공개 파일

### GitLab — Pajamas UI Kit

- URL: https://design.gitlab.com/get-started/uik-file-structure · https://design.gitlab.com/get-started/uik-contributing
- 종류: 실제 팀(디자인 시스템 공개)
- 파일 구성(라이브러리 7개, 파일마다 따로 발행): Design tokens(토큰을 Figma 변수로, 색 스타일 포함) · 📙 Component library · GitLab Product Icons · GitLab Product Illustrations · Patterns and Page Templates(기능 팀 소유 자산, 다수는 복사해 쓰는 「sticker sheet」) · Data Visualization · Annotations and utilities(주석 · 발표 도구).
- 파운데이션 위치: 토큰 · 색은 부품 파일과 다른 파일(Design tokens)에 둔다.
- 변경 흐름: 브랜치에서 고치고 디자인 시스템 팀에 브랜치 검토를 요청한다. 브랜치 설명이 릴리스 노트가 되며 줄마다 「-」 와 동사(Adds · Enhances · Changes · Removes · Fixes · Deprecates)로 시작한다.
- 파일 안 페이지 이름 · 순서 · 부품 배치: 공개 문서에 없음(미확인). 현행 구조 문서로 안내되는 gitlab-design 저장소의 CONTRIBUTING-Figma.md 는 404 였다.
- 아카이브: 미확인.

### Kiwi.com — 제품 화면 파일 · Orbit 라이브러리

- URL: https://www.figma.com/blog/how-kiwi-com-handles-project-structure-versioning-and-components-in-figma/ · 후속 글 https://medium.com/designing-kiwi-com/versioning-design-system-with-figma-take-two-124295a91268(403, 검색 요약만)
- 종류: 실제 팀
- 파일 나누기: 프로젝트 · 흐름마다 파일 하나(place picker · date picker · search 같은 단위). 흐름을 한 파일에 많이 넣으면 느리다는 이유. 대가로 파일을 넘는 프로토타입은 못 잇는다. Figma 팀은 도메인(App · Web)으로, 프로젝트는 Booking 처럼 기능으로 묶는다(Orbit 안내 검색 요약).
- 페이지 구성: 버전마다 페이지 하나, 이름은 「XY」(X 큰 버전 · Y 작은 반복), 최신을 맨 위에. 라이브러리로 옮길 후보를 모은 components 페이지가 따로 있다.
- 표지: 프로젝트마다 표지 그림(파일 제목만으로는 훑기 어려워서).
- 파운데이션 위치: 토큰 파일을 따로 두고 페이지 셋(colors · typography · shadows, 그림자 4단계). 아이콘은 자기 페이지에 섹션으로 나누고 24×24 프레임마다 하나. 일러스트는 한 캔버스에 같은 크기로. 부품은 iOS · Android 를 합친 Orbit Mobile 라이브러리.
- 이후: 1년 뒤 글에서 페이지 = 버전 방식이 원본 파일을 어지럽혔다고 돌아보고 흐름 · 바뀌는 부품을 따로 버전 관리하도록 바꿨다(세부는 403 으로 미확인).
- 아카이브: 미확인.

### Hygraph(옛 GraphCMS)

- URL: https://hygraph.com/blog/how-we-organize-our-files-and-projects-in-figma
- 종류: 실제 팀(작은 팀)
- 팀 · 프로젝트: Figma 팀 하나. 큰 프로젝트 셋 「⚡️ Feature」(새 기능 · 개선) · 「🎨 Baukasten」(스타일 가이드 · 부품 = 디자인 시스템) · 「🔥 Marketing」(웹사이트 · 문서 · 블로그). 필요할 때 「Feedback」 같은 임시 프로젝트.
- 기능 파일 페이지(순서대로): Cover · 🔍 Research · 📝 Scratchpad · ✅ UI · ▶️ Prototype(선택) · 👌 QA.
- 페이지 안 배치: UI 페이지가 엔지니어의 정본이고 프레임을 사용자 흐름별로 묶는다. 프레임 제목은 기본 프레임 이름표를 써 확대해도 읽히게. 상태 · 화면 폭별 배치는 글에 없음(미확인).
- 표지: 첫 페이지에 같은 배경으로 따로 만든다(프레임 썸네일은 크기가 안 맞아서). 협업자 · 일정 · 상태, Discovery 에서 Live 까지 이어지는 진행 막대.
- 템플릿: 위 페이지와 기본 프레임을 넣은 템플릿 파일을 Feature 프로젝트 맨 위에 고정.
- 파운데이션 위치: 디자인 시스템은 Baukasten 프로젝트에 따로. 캡처에 「Get Started」 · 「Foundation」 · 「Components」 묶음이 보인다고만 적힘(세부 미확인).
- 이름 규칙: 페이지 이름 앞에 이모지. 상태 이모지 체계는 따로 없음.
- 아카이브: 글에 없음(미확인). QA 페이지에는 개발 뒤 미리보기 환경 스크린샷과 어긋난 곳을 붙인다.

### Akvo

- URL: https://wiki.cloud.akvo.org/books/design/page/figma-content-organization
- 종류: 실제 팀(작은 팀, 공개 위키)
- 팀 · 프로젝트: 「The Akvo Design Team」 팀 하나, 프로젝트는 고객 이름 → 개별 프로젝트.
- 파일 이름: 「ClientName - Project Name」(예 「UNICEF - RTMIS」). 프로젝트마다 파일 셋 Designs(디자인 · 프로토타입) · Assets(그림 자산) · Documentation(FigJam 브레인스토밍).
- 페이지(순서대로): Sandbox · Final Designs. 두 페이지로 탐색과 결정본만 나눈다.
- 표지 · 섹션 · 상태 · 아카이브 · 디자인 시스템: 미확인.

### Phoenix Group — Compound 디자인 시스템

- URL: https://compound.thephoenixgroup.com/latest/figma/overview/setup-and-structure-tqFJ515r
- 종류: 실제 팀(디자인 시스템 공개 문서)
- 팀: 업무 기능마다 팀(브랜드 · 부품 라이브러리 · 탐색). 브랜드 팀은 FigJam 협업 파일과 프로젝트 파일, 프로젝트는 작업별 파일을 묶는다.
- 페이지: 이름을 정해진 꼴로 붙인다. 「Cover」 와 「Graveyard」 는 파일에 하나씩, 나머지는 같은 종류가 여럿 있어도 된다(Graveyard = 버린 것 모으는 페이지로 보이나 설명 없음).
- 부품 파일: 「Overview」 표지 파일이 썸네일을 가진다. 부품마다 페이지 하나, 이름은 메인 부품 이름과 같다. 웹 부품은 부품마다 파일 하나(관리 · 부품 단위 브랜치를 쉽게), React Native 부품은 덜 바뀌어서 파일 하나에 모두.
- 브랜치: 모든 파일에서 브랜치로 본 파일과 따로 작업.
- 파운데이션 위치 · 순서 · 상태: 미확인.

### Figma Blog — 5 ways to structure your workflow with Pages

- URL: https://www.figma.com/blog/five-ways-to-structure-your-workflow-with-pages-in-figma/
- 종류: 공식(사용자 사례 모음)
- 다섯 방식: 플랫폼 · 화면 폭마다 페이지(페이지마다 프로토타입) · 앱 기능마다 페이지 · 디자인 단계마다 페이지 · 아토믹(atoms · molecules · organisms) · 섞어 쓰기(디자인 시스템 파일은 아토믹, 앱 파일은 OS 별 페이지).
- 이름 붙은 단계 예: Cameron McNab 「Thumbnail · wireframes · designs · archive」, Nick McVey 「Docs · staging · ready for review」, Michael Robson 「Sitemap · wireframes · mockups · QA · screenshots for marketing」. 개인 사례라 실제 팀 표본에는 세지 않는다.

### WordPress 디자인 팀

- URL: https://make.wordpress.org/design/handbook/get-involved/tools-figma/
- 종류: 실제 팀(공개 핸드북)
- 프로젝트: 프로젝트로 파일을 묶고 하위 폴더는 없다. 프로젝트 이름은 문장형 대소문자 · 띄어쓰기.
- 페이지(순서대로): Cover(늘 맨 위) · Iterations(최신이 위, 내림차순) · Current UI(작업 전 지금 화면 스크린샷, 변화 기록용) · Explorations(다른 접근 시험, 버린 안 포함). 필요하면 플랫폼 · 기기별, 부품 · 스타일 정리, 단계 추적, 프로토타입 흐름별 페이지를 더한다.
- 표지: 첫 페이지 「Cover」 에 「figma-cover」 자산을 넣는다. 상태마다 표지 색이 정해져 있다: Archived (do not use) #D94F4F · In design #F0B849 · In development #4AB866 · Shipped #00669B · Design resource/library #23282D. 파일 배경도 표지에 맞춘다(2021 사본 기준 검색 요약).
- 파운데이션 위치: 부품 · 스타일 · 아이콘을 하나로 합친 「WordPress Design Library」(읽기 전용, 복제해 편집). 웹사이트용 「WordPress.org Design Library」, 작업 중 라이브러리 「System」 은 따로.
- 이름 규칙: 제목 25자 이하 · 명령형, 설명 140자 이하로 무엇 · 왜.
- 아카이브: 표지 상태 「Archived (do not use)」 로만 표시. 따로 옮기는 곳은 없음.

### GitHub — Primer

- URL: https://primer.style/guides/figma
- 종류: 실제 팀(디자인 시스템 공개)
- 파일 구성: Primer Primitives(토큰: 색 · 글자 · 간격. 색 · 크기는 변수, 글자 · 그림자는 스타일) · Primer Web(웹 부품, 라이트 · 다크 모드를 변수로) · Primer Mobile(내부) · Octicons(아이콘) · Primer Interfaces(GitHub 공통 화면 템플릿) · Primer Email(메일 템플릿). 핵심 라이브러리는 내부 「Core libraries」 프로젝트에.
- 파운데이션 위치: 토큰 파일과 부품 파일을 나눈다. 변수는 다른 변수를 참조한다(예 `fgColor/danger` → `base/color/red/4`). 변수 범위를 칠 · 글자 · 선으로 묶는다.
- 브랜치: Primer Web 기여는 `@username/changes-being-made` 꼴 브랜치(예 `@lukasoppermann/update-button-radius`).
- 파일 안 페이지 이름 · 순서 · 아카이브: 미확인(CONTRIBUTION.md 원문 404).

### IBM — Carbon

- URL: https://carbondesignsystem.com/designing/kits/figma/ · https://medium.com/carbondesign/introducing-figma-variables-and-a-consolidated-all-themes-library-d4893d1b8920(403, 검색 요약만)
- 종류: 실제 팀(디자인 시스템 공개)
- 파일 구성: 함께 켜는 기본 라이브러리 다섯 「(v11) Carbon Design System」(테마 · 부품) · 「(v11) Carbon Type Sets」 · 「IBM® Color Library」 · 「IBM® UI Icon Library」 · 「IBM® Pictogram Library」, 그리고 확장 라이브러리(차트 · 네이티브 모바일 · 접근성 · 중간 충실도 키트).
- 파운데이션 위치: 글자 · 색 · 아이콘을 부품 파일과 다른 파일로. 테마 넷(White · Gray 10 · Gray 90 · Gray 100)은 변수 모드로 「(v11) All themes」 파일 하나에 합쳤다(검색 요약).
- 이름 규칙: 파일 이름 앞에 버전 · 성숙도 괄호 「(v11)」 · 「(Alpha)」 · 「(Beta)」.
- 아카이브: 옛 테마 파일(Gray 10 · 90 · 100)은 지우지 않고 「deprecated」 로 두고 갱신만 멈춘다(검색 요약).
- 파일 안 페이지: 미확인.

### Atlassian Design System

- URL: https://atlassian.design/get-started/design/figma-libraries/atlassians · https://atlassian.design/resources/figma-library
- 종류: 실제 팀(디자인 시스템 공개)
- 파일 구성: 공개 라이브러리는 「ADS Foundations」 와 「ADS Components」 를 함께 켠다. 커뮤니티 질문 글에는 ADS Components · ADS Tokens · ADS Foundations 세 파일로 내려받았다고 적힘(https://community.atlassian.com/forums/Jira-questions/Figma-Atlassian-Design-System-Files-Questions/qaq-p/2563634). 내부용은 토큰 플러그인 · 접근성 주석 라이브러리가 따로.
- 파운데이션 위치: 부품과 다른 파일.
- 파일 안 페이지 · 아카이브: 미확인(내부 전용).

### British Red Cross 디자인 시스템

- URL: https://design.redcross.org.uk/design-system/designers-get-started-guide
- 종류: 실제 팀
- 라이브러리 하나에 세 구역 Foundations(색 · 글자 · 간격 · 그리드 · 아이콘) · Components · Patterns.
- 제품 파일 · 페이지 · 아카이브: 미확인(문의하라고만 적힘).

### Government of Alberta 디자인 시스템

- URL: https://design.alberta.ca/get-started/designers/
- 종류: 실제 팀
- 디지털 서비스 프로젝트 폴더마다 시작 Figma 템플릿이 들어 있다(파일 정리 · 개발 넘김 · 탐색용). 도우미 부품도 있다.
- 이름 규칙: 코드에도 있는 부품은 「goa-」 접두사(예 `goa-input`).
- 템플릿 안 페이지 이름 · 순서: 미확인.

### Shopify — 프로젝트 파일 템플릿

- URL: https://www.figma.com/blog/how-shopify-facilitates-collaboration-in-figma/
- 종류: 실제 팀(Shopify 팀이 Figma 블로그에 쓴 글)
- 페이지 구성: 글의 묶음은 Cover · Project overview · Think · Explore · Build · Archive. 페이지 순서는 작업 과정의 거꾸로라 만들 준비가 된 것(Build)이 맨 위에 온다고 적혀 있어 실제 순서는 Cover · Project overview · Build · Explore · Think · Archive 로 읽힌다. Cover · Project overview 와 Build 의 앞뒤는 글에 정확히 없음(미확인).
- 표지: 프로젝트 이름 · 소유 팀 · 상태 표시. 진행에 따라 상태 표시를 바꾼다.
- Project overview: 맥락 · 자료 링크 · 문의할 사람(문서 · Slack 프로필 링크).
- Think: 문제 이해. 사용자 흐름 · 여정 지도 · 문서 링크 · 옛 화면 스크린샷. 가장 먼저 채운다.
- Explore: 여러 안을 펼치는 곳. 기기 · 폼팩터마다 페이지, 탐색안 · 흐름마다 제목, 탐색안마다 상태 배지, 새 페이지마다 날짜, 사용자 테스트용 프로토타입은 페이지 따로, 메모는 스티키 부품.
- Build: 구현할 것만, 페이지 수는 적게. 마일스톤 · 기기(iPhone · iPad)마다 페이지, 마지막 수정 날짜, 티켓에서 이 페이지로 링크, 거쳐야 할 검토 체크리스트.
- 결정 기록: 따로 된 결정 로그는 없음. 상태 표시 · 배지 · 날짜 · 댓글 · Build 체크리스트로 대신.
- 파운데이션 위치: 템플릿 밖. 디자인 시스템(Polaris for Retail)은 Retail Foundations 팀이 따로 낸다.
- 아카이브: 마지막 페이지 「Archive」 에 채택되지 않은 디자인 · 페이지를 남긴다.

### CMS(미국 메디케어 · 메디케이드 센터) 디자인 시스템

- URL: https://design.cms.gov/getting-started/for-designers/
- 종류: 실제 팀
- 파일: 시스템 전체가 주 파일 하나에 있고 공유 라이브러리로 낸다. 원본 편집 권한은 막혀 있다.
- 파운데이션 위치: 같은 파일. 테마 넷(Core · Healthcare.gov · Medicare.gov · CMS.gov)을 모드로 한 파일에 담는다. 제품 테마는 페이지 · 프레임 단위로 걸고 부품은 「auto」 로 두어 부모 테마를 따르게 한다. 레이아웃 그리드도 라이브러리에.
- 페이지: 이름이 드러난 것은 테마 · 하위 시스템 설정 안내 페이지 「Figma Setup」 하나. 나머지 페이지 · 순서는 미확인.

### 영국 법무부(MOJ) 디자인 시스템

- URL: https://design-patterns.service.justice.gov.uk/prototyping/setting-up-figma-prototypes
- 종류: 실제 팀
- 라이브러리: Figma Kit 다섯 개가 모든 MOJ 파일에 자동으로 켜진다. MOJ Figma Kit 는 「GOV.UK & MOJ Styles」 와 「GOV.UK Figma Kit」 가 함께 있어야 한다. 스타일(파운데이션)과 부품 키트가 다른 파일이다.
- 제품 파일 · 페이지 · 아카이브: 미확인.

### Equinor — EDS

- URL: https://eds.equinor.com/docs/about/getting-started/design/figma
- 종류: 실제 팀
- 팀: 프로젝트 하나에 팀 하나.
- 표지: 첫 페이지 이름은 「Cover」, 「Default File Cover」 부품에 프로젝트 정보 · 담당자 · 연락처. 진행에 따라 표지의 상태 배지와 배경색을 바꾼다.
- 페이지: 앱의 구역마다 페이지, 파일 전용 부품 · 스케치도 페이지 따로. 순서는 Cover 말고 미확인.
- 페이지 안 배치: 프레임은 가로로 늘어놓고 위를 맞추고 간격을 같게. 한 화면의 변형은 그 화면 아래로 세로로 쌓는다.
- 탐색: 디자이너끼리 안을 나누는 「EDS Designer Sandbox」 공간이 따로 있다.
- 파운데이션 위치 · 아카이브: 미확인.

### The Interactive Studio(OKB Interactive Studio, 에이전시)

- URL: https://blog---jekyll-static-site.pages.dev/how-we-organize-our-projects-at-figma
- 종류: 실제 팀(에이전시)
- 팀 · 프로젝트: 스튜디오 전체가 팀 하나, Figma 프로젝트 = 고객, 파일 = 고객이 요청한 작업 하나(웹사이트 · 웹앱 · 랜딩 페이지).
- 파일 안 구성(세 묶음 여섯 칸, 모든 프로젝트 같게, 비어도 만든다): Kick-off(The Cover · Client Documentation · Visual Research) → Development(Wireframes · Design System) → Delivery(Prototypes). 페이지 이름 그대로인지 묶음 상자인지는 글에 정확히 없음.
- 파운데이션 위치: 프로젝트 파일 안 「Design System」 칸(최종 색 · 글자 · 그리드 · 재사용 부품). 시안과 따로 고객에게 공유할 수 있게 상자를 나눈다.
- 프로토타입: 첫 프레임 이름을 「Start」 로 하고 사용법 · 버전 링크를 둔다.
- 아카이브 · 상태: 미확인.

### SSW(호주 컨설팅사) — Rules to Better Figma

- URL: https://www.ssw.com.au/rules/outdated-figma · https://www.ssw.com.au/rules/done-tasks-figma · https://www.ssw.com.au/rules/figma-dev-mode
- 종류: 실제 팀(회사 규칙 공개)
- 낡은 디자인 표시: 낡은 작업을 Archive 구역으로 옮긴다. 구분 페이지를 쓰거나 이름 앞에 「zz」 를 붙여 목록 맨 아래로 가라앉힌다. 프레임 맨 위에 잠근 경고 배너(「Out of date — refer to production {{ LINK }}」 또는 「Deprecated」 배지)와 운영 화면 링크, 「Maintainers: {{ DESIGNER }}」 메모.
- 구현 끝 표시: 개발이 구현하면 디자이너가 확인한 뒤 「✅ Done」 댓글을 단다(앞의 「TODO」 댓글과 짝).
- 파일 · 페이지 구성 · 파운데이션: 미확인.

## 공식 · 가이드 글 (이어서)

### Figma Help — Guide to Dev Mode

- URL: https://help.figma.com/hc/en-us/articles/15023124644247
- 종류: 공식
- Dev Mode 는 섹션 안 내용을 먼저 보여 주고 섹션 밖 내용은 사이드바에서 접어 둔다. 페이지 목록에 Ready 표시가 있는 페이지를 아이콘으로 알린다. 상태는 섹션 · 프레임 · 부품에 건다.
- 프레임마다 마지막 수정 날짜가 보이고, 바뀐 디자인은 「Compare changes」 로 이전과 비교한다.

### Figma Help — View a file's version history

- URL: https://help.figma.com/hc/en-us/articles/360038006754
- 종류: 공식
- 이름 붙은 버전: 제목(25자 넘으면 잘림) · 설명(140자 이하 권장)으로 마일스톤을 남긴다. 자동 체크포인트는 약 30분마다. 버전을 새 파일로 복제할 수 있다(댓글 · 기록은 안 따라감). Starter · 초안은 30일, 유료는 전체 기록.

### LogRocket Blog — Organizing Figma files for team collaboration

- URL: https://blog.logrocket.com/ux-design/organizing-figma-files-team-collaboration/
- 종류: 가이드
- 프로젝트 예: Design system · In progress · Approved · Not approved · Archive · Illustrations · Inspiration.
- 파일 한 개 페이지(순서대로): Cover · Production(빈 구분 페이지) · 사용자 스토리 페이지들 · 프로토타입 페이지 · 부품 페이지 · Archive(빈 구분 페이지) · 낡은 탐색안 페이지들. 구분 페이지에 이름을 붙여 묶음 제목처럼 쓴다.
- 이름 규칙: 끝나 넘긴 페이지 이름에 체크 이모지. 아카이브 페이지 이름에 날짜.
- 페이지 안 배치: 흐름은 화면을 차례로 놓고 화살표. 부품 상태는 본 프레임 옆에. 프레임 제목은 큰 제목이나 섹션으로 확대해도 읽히게. 화면 폭 배치는 글에 없음.
- 파운데이션 위치: 라이브러리는 작업 파일과 다른 파일. 큰 시스템은 스타일 라이브러리(색 · 글자 · 그림자) · 플랫폼 라이브러리(iOS · Android · Web) · 테마 라이브러리(라이트 · 다크)로 나눈다.
- 아카이브: 지우지 않고 Archive 아래로, 제목에 날짜.

### Bounteous(에이전시) — Figma full-cycle workflows Part 2

- URL: https://www.bounteous.com/insights/2024/02/28/revolutionizing-web-design-how-figma-streamlines-full-cycle-workflows-part-2/
- 종류: 가이드(에이전시 권장, 고객 사례 포함)
- 부품 라이브러리와 작업 파일을 다른 프로젝트에 둔다. 큰 라이브러리는 쓰임(global · cards · interactive)으로 파일을 나누고, 작으면 한 파일 안 페이지로 같은 분류.
- 표지에 핵심 내용과 상태 깃발. 캔버스 섹션에 「Ready for dev」 라벨. 고객 사례에서 브랜치 이름은 스프린트 번호 · 출시일 · 기능.

### Half Thoughts(Dean Harrison) — Using Figma to highlight progress and process

- URL: https://halfthought.substack.com/p/using-figma-to-highlight-progress
- 종류: 가이드(디자이너 개인 실무)
- 파일: 흐름 · 기능마다 파일 하나(예 공유 모달), 마스터 템플릿을 복제해 시작. 표지에 제목 · 담당 제품 · 기여자 · 상태(「ready for dev」) 또는 버전(「Version 1.0.1」).
- 페이지 묶음(위에서부터, 비디자이너가 많이 보는 것이 위): For dev · In review · Exploration · Archive. 탐색은 Exploration 에서만 하고, 검토할 때 새 페이지를 만들어 In review 로(이름 「V0.1」 · 「V1」, PRD · Loom 링크). 디자인 리드와 PM 이 승인하면 For dev 로. 출시 뒤 그대로 두거나 실제 제품을 비추는 마스터 파일로 옮긴다.
- 상태: 새 페이지마다 준비 상태 아이콘. 빨간 점이면 의견을 받는 중이고, 색이 바뀌면 의견은 다음 반복에만 반영.

### Jobins 블로그 — From chaos to order: how to organize Figma like a pro

- URL: https://blog.jobins.jp/from-chaos-to-order-how-to-organize-figma-like-a-pro
- 종류: 가이드
- 표지 프레임 1920×960 을 썸네일로. 프로젝트 이름 · 시작 날짜.
- 페이지는 분류마다, 이름 앞에 이모지. 구분 페이지는 하이픈 여럿. 시험용 「Playground」 페이지에서 해 본 뒤 본 페이지로 옮긴다.

### Solid Digital(에이전시) — 3 ways to organize Figma

- URL: https://www.soliddigital.com/blog/3-ways-figma-organization
- 종류: 가이드
- 표지 모양을 달리해 「Support」 파일과 고객용 파일을 한눈에 구분. 버전 · 「Last updated」 칸은 표지에 넣지 말라고 권한다(작성자 경험). 내비 · 푸터 · 버튼은 일찍 부품으로.
- 페이지 이름 · 순서 · 아카이브: 글에 없음.

## 막힘 · 세지 않은 곳

| 곳                                                                                       | 이유                                                                                      |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Doctolib · Oda · IDAGIO · Zeelo · Deliveroo · Digital AG Solutions · SpatialChat(Medium) | 403. 검색 요약에 일부만 보여(Oda 「Figma 팀 하나 = 실제 팀 하나」 등) 구성을 옮길 수 없음 |
| UX Collective · Prototypr 글(Medium)                                                     | 403. 검색 요약의 페이지 목록(Ticket info · Master …)은 원문 미확인                        |
| Viget                                                                                    | 429 두 번. 프로젝트 이름 「[고객 약자] 고객 이름」 만 검색 요약으로 봄                    |
| Ataccama Flamingo                                                                        | 본문이 스크립트로 그려져 비어 옴                                                          |
| Liferay 핸드북                                                                           | 404. 검색 요약에 「표지는 늘 1쪽, 이름 cover」 만                                         |
| Sourcegraph 핸드북                                                                       | Notion 으로 옮겨져 비어 옴. 옛 저장소 원문은 프로젝트 = 제품 영역만 적힘                  |
| Joystream(Notion) · Kiwi.com Orbit 안내                                                  | 비어 옴 · 404                                                                             |
| GitLab CONTRIBUTING-Figma.md · Primer CONTRIBUTION.md                                    | 404                                                                                       |
| Material 3 · GOV.UK · Fluent 2 · Polaris · Salesforce SLDS · SAP Fiori · Uber Base       | 공개 문서에 파일 안 페이지 목록이 없고 Figma Community 쪽은 403. SAP 웹 문서도 403        |
| Design Shack · Mantlr                                                                    | 403 · 402                                                                                 |
| Spotify Design · Cuddle(Medium)                                                          | 403. 검색 요약에 「비정상 경로 상태를 파일에 넣는다」 만 보임                             |
| Lee Munroe 블로그                                                                        | 본문이 Twitter · Medium 링크뿐                                                            |
| zeroheight 도움말 · Figma Community 「Design Handoff Template」 설명 · designpixil       | 403 · 403 · 429                                                                           |
| Material 3 디자인 토큰                                                                   | 쪽 본문이 스크립트로 그려져 비어 옴 · 404                                                 |
| Scottish Government 디자인 시스템 블로그 · Red Hat 변수 안내                             | 열렸지만 컬렉션 · 모드 이름이 없음(세지 않음)                                             |
| Swisscom SDX · MOJ 프로토타입 안내                                                       | 열렸지만 배치 · 이름 규칙 없음(「✅ Ready for Dev」 섹션 이름만, 세지 않음)               |
| Figma Sites 화면 폭 도움말 · Figma 포럼 기기 프레임 요청                                 | 화면 폭을 캔버스에 어떻게 늘어놓는지 적지 않음                                            |
| GitLab 제품 디자이너 핸드북 원문                                                         | 404                                                                                       |

## 표본

- 실제 팀 · 공개 파일 17곳(파일을 열어 본 곳 없음, 공개 글 · 문서로 확인): GitLab · Kiwi.com · Hygraph · Akvo · Phoenix Group(Compound) · WordPress · GitHub(Primer) · IBM(Carbon) · Atlassian · British Red Cross · Government of Alberta · Shopify · CMS · 영국 법무부(MOJ) · Equinor · The Interactive Studio · SSW. 이 가운데 페이지 목록까지 확인한 곳은 6곳(Hygraph · Akvo · WordPress · Shopify · Kiwi.com · The Interactive Studio)뿐이다. 디자인 시스템 팀 다수는 파일 나누기만 공개한다.
- 공식 · 가이드 글 14곳: Figma 공식 9(Best practices 셋 · Help 다섯 · 블로그 하나), 가이드 5(LogRocket · Bounteous · Half Thoughts · Jobins · Solid Digital).
- Figma 공식 글이 인용한 Cash App · Dropbox · Expedia 는 실제 팀이지만 직접 쓴 글이 아니라 따로 세지 않았다.
- 「페이지 안 배치」 · 「이름 규칙」 두 절에서 더한 곳: 실제 팀 5곳(Pinterest Gestalt · GitLab 마케팅 · Twilio Paste · Shopify Polaris · Orfium. GitLab 마케팅은 Pajamas 와, Polaris 는 Shopify 프로젝트 템플릿과 다른 팀이라 따로 셈), 공식 5곳(Figma Help 섹션 프로토타이핑 · Help 부품 관리 · Help AI 모범 사례 · 넘김 핸드북 블로그 · Simple Design System 저장소), 가이드 6곳(Nathan Curtis · Joey Banks · Brad Frost · Smashing · Emu · Locofy). 이미 있던 Kiwi.com · GitLab Pajamas · Primer · Compound · Atlassian 은 새 원문(저장소 · 문서)을 더 읽어 두 절에 넣었다.
- 아래 「공통 패턴」 표는 파일 · 페이지 구성만 센 것이다. 두 절의 표는 각 절 끝에 있다.

## 공통 패턴

「팀」 은 실제 팀 17곳, 「글」 은 공식 · 가이드 14곳에서 센 수다. 팀 수가 3곳 안팎이면 「근거 약함」.

| 패턴                                                                                        | 팀  | 글  | 곳                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------- | --- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 디자인 시스템 라이브러리를 제품 작업 파일과 다른 파일 · 프로젝트 · 팀에 둔다                | 14  | 3   | GitLab · Kiwi.com · Hygraph · Compound · WordPress · Primer · Carbon · Atlassian · Red Cross · Alberta · Shopify · CMS · MOJ · Equinor / Figma BP · Bounteous · LogRocket |
| 첫 페이지는 표지(Cover)                                                                     | 7   | 6   | Hygraph · Shopify · WordPress · Kiwi.com · Equinor · Compound · Interactive Studio / Figma BP · LogRocket · Half Thoughts · Jobins · Solid Digital · Bounteous            |
| 탐색(Explore · Scratchpad · Sandbox · Playground)과 확정본(Build · UI · Final · Ready) 분리 | 5   | 5   | Hygraph · Shopify · WordPress · Akvo · Equinor / Figma BP · Figma Help 페이지 · Figma 넘김 가이드 · Half Thoughts · Jobins                                                |
| 템플릿 파일 · 표지 부품으로 모든 파일을 같은 구조로 시작                                    | 6   | 2   | Hygraph · Shopify · Alberta · Interactive Studio · Equinor · WordPress / Figma BP · Half Thoughts                                                                         |
| 표지에 상태(색 · 배지 · 진행 막대)                                                          | 4   | 3   | Hygraph · Shopify · WordPress · Equinor / Figma BP · Half Thoughts · Bounteous                                                                                            |
| 파운데이션(토큰 · 변수 · 스타일)을 부품과 다른 라이브러리 파일로                            | 6   | 1   | GitLab · Primer · Carbon · Atlassian · MOJ · Kiwi.com / LogRocket                                                                                                         |
| 파운데이션과 부품을 한 라이브러리 파일에(위와 반대)                                         | 4   | 1   | CMS · Red Cross · WordPress · Interactive Studio(프로젝트 파일 안) / Figma 라이브러리 BP(페이지 = 묶음)                                                                   |
| 버린 안을 파일 안 맨 아래 Archive · Graveyard 페이지로(근거 약함)                           | 3   | 2   | Shopify · Compound · SSW / LogRocket · Half Thoughts                                                                                                                      |
| 페이지 이름 앞 이모지로 목적 · 상태(팀 근거 약함)                                           | 1   | 4   | Hygraph / Figma Help · Figma 넘김 가이드 · LogRocket · Jobins                                                                                                             |
| 하이픈 구분 페이지(팀 근거 약함)                                                            | 1   | 4   | SSW / Figma Help · Figma BP · LogRocket · Jobins                                                                                                                          |
| 섹션에 Ready for dev 상태(팀 미확인)                                                        | 0   | 4   | Figma Help 섹션 · Dev Mode 안내 · Dev Mode 상태 · Bounteous                                                                                                               |
| 기기 · 화면 폭마다 페이지 따로(근거 약함)                                                   | 2   | 2   | Shopify · WordPress / Figma BP · Figma 블로그 5 ways                                                                                                                      |
| 버전 · 반복을 페이지로, 최신이 위(근거 약함)                                                | 2   | 1   | Kiwi.com(XY) · WordPress(Iterations) / Half Thoughts(V0.1)                                                                                                                |
| 제품 파일 안 파일 전용 부품 페이지(근거 약함)                                               | 2   | 2   | Kiwi.com · Equinor / Figma BP(Local components) · LogRocket                                                                                                               |
| 페이지 안: 흐름은 가로 한 줄, 변형 · 상태는 옆이나 아래(근거 약함)                          | 2   | 1   | Equinor(변형은 아래로) · Hygraph(흐름별 묶음) / LogRocket(상태는 옆)                                                                                                      |
| 결정 기록을 따로 된 페이지로                                                                | 0   | 0   | 미확인. Dropbox 는 Figma 밖 명세 문서, Shopify 는 배지 · 날짜 · 체크리스트, Half Thoughts 는 페이지에 PRD 링크로 대신                                                     |

판(결정 기록)과 시안을 한 파일에 둘지: 결정 로그 페이지를 둔 곳은 찾지 못했다(미확인). 확인한 방식은 셋이다. 확정본 페이지로 옮겨 결정을 드러낸다(Shopify Build · Hygraph UI · Half Thoughts For dev). 버전 페이지를 쌓는다(Kiwi.com · WordPress). 결정 문서를 Figma 밖에 두고 페이지로 링크한다(Dropbox). 버전 표시는 Figma 이름 붙은 버전(공식)과 표지 상태 색 · 배지(WordPress · Equinor · Hygraph)가 쓰인다.

## 그대로 옮길 수 있는 구성 후보

모두 한 곳의 구성을 이름과 순서 그대로 적었다. 「NosLog 로 옮기면」 은 페이지 자리에 NosLog 화면 묶음을 넣기만 한 예다.

### 후보 1 — Shopify 프로젝트 템플릿

- 원래 페이지(위에서부터, 글에서 읽은 순서): Cover · Project overview · Build · Explore · Think · Archive. 만들 준비가 된 것이 맨 위(Cover · Project overview 와 Build 의 앞뒤는 미확인).
- 페이지 안 배치: Build 는 마일스톤 · 기기마다 페이지, 마지막 수정 날짜와 검토 체크리스트. Explore 는 기기마다 페이지, 탐색안마다 제목 · 상태 배지, 새 페이지마다 날짜.
- 파운데이션 위치: 파일 밖, 다른 팀이 내는 라이브러리.
- NosLog 로 옮기면: Cover · Project overview · Build(페이지마다 화면 묶음: 홈 · 악곡 · 랭킹 …) · Explore(판 · 시안) · Think(조사 · 지금 화면 캡처) · Archive.

### 후보 2 — Hygraph 기능 파일

- 원래 페이지(순서대로): Cover · 🔍 Research · 📝 Scratchpad · ✅ UI · ▶️ Prototype(선택) · 👌 QA. 기능마다 파일 하나, 템플릿 파일을 프로젝트 맨 위에 고정.
- 페이지 안 배치: UI 페이지가 정본이고 프레임을 사용자 흐름별로 묶는다. 프레임 이름표로 제목.
- 파운데이션 위치: 다른 프로젝트(🎨 Baukasten)의 디자인 시스템 파일, 묶음은 Get Started · Foundation · Components(캡처 설명만).
- NosLog 로 옮기면: 화면 묶음마다 파일 하나(예 「악곡」 파일: Cover · 🔍 Research · 📝 Scratchpad · ✅ UI · 👌 QA), 파운데이션은 별도 파일.

### 후보 3 — WordPress 디자인 팀

- 원래 페이지(순서대로): Cover(상태 색: Archived · In design · In development · Shipped · Design resource/library) · Iterations(최신이 위) · Current UI(작업 전 지금 화면) · Explorations(버린 안 포함).
- 페이지 안 배치: 공개된 규칙 없음(미확인). 필요하면 플랫폼 · 기기별 페이지를 더한다.
- 파운데이션 위치: 부품 · 스타일 · 아이콘을 하나로 합친 「WordPress Design Library」 파일 하나.
- NosLog 로 옮기면: Cover · Iterations(결정본이 위) · Current UI(지금 운영 화면) · Explorations(판 · 버린 안), 파운데이션은 라이브러리 파일 하나.

### 후보 4 — Figma 공식 Best practices

- 원래 페이지(순서대로): Cover · Visual research · User research(선택) · Discovery · Flow · Prototype(선택) · Local components(선택) · Ready for development. 단계 사이에 하이픈 구분 페이지.
- 페이지 안 배치: 페이지 수준 규칙만 있음. 플랫폼 하나가 프레임 수백 개면 페이지 · 파일로 나눈다. 섹션에 Ready for dev 를 걸면 Changed · Completed 로 이어진다(Help).
- 파운데이션 위치: 공유 라이브러리는 디자인 시스템 전용 팀에. 파일 전용 부품만 Local components 페이지.
- NosLog 로 옮기면: Cover · Visual research · Discovery · Flow · Local components · Ready for development, 구분 페이지로 단계를 나눈다.

파운데이션 파일 자체를 정리할 때 옮길 수 있는 구성: GitLab(Design tokens · 📙 Component library · Product Icons · Product Illustrations · Patterns and Page Templates · Data Visualization · Annotations and utilities 파일 일곱), Kiwi.com(토큰 파일 하나에 colors · typography · shadows 세 페이지, 아이콘은 섹션으로 나눈 페이지), CMS(파일 하나에 모드로 테마, 맨 앞 「Figma Setup」 안내 페이지), Compound(부품마다 페이지 하나, 이름은 부품 이름, 「Cover」 · 「Graveyard」 는 하나씩).

## 페이지 안 배치

판 3 근거. 한 페이지 안에 화면 여러 개 · 화면 폭 · 상태를 어떻게 놓는지, 섹션 · 흐름 화살표 · 제목 주석을 어떻게 쓰는지 모았다. 위 절에 이미 적은 Equinor(가로 한 줄 · 변형은 아래로) · Hygraph(흐름별 묶음) · LogRocket(상태는 옆) · Figma 섹션 문서는 다시 적지 않고 공통 패턴 표에서만 센다.

### Pinterest — Gestalt 「Design file hygiene」

- URL: https://github.com/pinterest/gestalt/tree/master/docs/markdown/team_support/design_file_hygiene(organizing_layout.md · design_handoff.md)
- 종류: 실제 팀(디자인 시스템 공개 문서, 사이트에는 「legacy documentation」 으로 표시)
- 섹션: 「Use sections to organize your canvas by adding labels」. 섹션을 그룹 · 프레임 대신 쓰지 말라고 적는다. 부품은 늘 프레임으로 만든다.
- 넘김 페이지 안: 지금 화면(control surfaces, 「how things currently appear」)부터 놓는다. 넘기기 전 점검 목록에 「Files have a control section」 · 「Use of connectors to indicate user flows」 · 주석이 있다.
- 주석: Handoff Kit 라이브러리의 부품으로 단다. Accessibility annotations · Contextual notes(문제 정의 카드) · Flow notes(기능 · 결정 설명) · Sticky notes. 흐름 화살표 · 제스처 자산도 같은 키트. 모두 라이트 · 다크 둘 다 된다.
- 화면 폭 · 상태 배치 규칙: 미확인.

### GitLab 마케팅(Digital Experience) — Figma Process

- URL: https://handbook.gitlab.com/handbook/marketing/digital-experience/figma (원문 https://gitlab.com/gitlab-com/content-sites/handbook/-/raw/main/content/handbook/marketing/digital-experience/figma.md)
- 종류: 실제 팀(공개 핸드북). 위 Pajamas(디자인 시스템 팀)와 다른 팀이다.
- 설명 프레임: 캔버스에 「READ:ME」 프레임을 둔다. 쓰는 때는 이유 설명이 필요할 때 · 그림으로 못 보이는 기능 · 긴 이슈 · MR 에서 난 결정 목록 · 중요한 이슈 · 문서 링크. 팀 공용 「README-Templates」 Figma 파일이 있다.
- 고칠 때: 남의 프레임을 고치려면 그 아트보드를 복사해 붙여 고친다(반복안을 남기려고).
- 넘김 페이지: 엔지니어링 준비가 된 페이지를 맨 위에 「🚢 PAGE NAME 🚢」 로, 그 아래 구분선 뒤에 작업 페이지.
- 화면 폭 · 상태 배치: 미확인.

### Kiwi.com — Orbit 「Working with Figma」 안내

- URL: https://github.com/kiwicom/orbit/tree/master/docs/src/documentation/06-kiwi-use/03-guides/03-working-with-figma(02-structure.mdx · 03-design-flow.mdx · 05-handoff.mdx). 위 「막힘」 표의 Orbit 안내 404 는 사이트 주소였고, 같은 글을 저장소 원문으로 읽었다. 문서에 「검토 중이라 바뀔 수 있음」 경고가 붙어 있다.
- 종류: 실제 팀(디자인 시스템 공개 문서). 위 Kiwi.com 블로그 항목과 같은 팀이지만 페이지 안 배치는 여기서만 나온다.
- 묶음: 한 기능 안의 흐름(예 항공편 고르기 · 결제)이나 서로 관련된 화면을 「group screens horizontally」. 묶음마다 맨 앞에 Helpers 라이브러리의 「Group cover」 부품을 두어 목적과 상태를 적는다.
- 흐름 화살표: Autoflow 플러그인으로 화면을 잇는다.
- 빈 자리: 아직 안 그린 화면은 Helpers 의 「Empty」 · 「Missing」 화면 부품으로 흐름 안에 자리를 잡아 둔다.
- 화면 폭: 반응형과 데스크톱을 같은 파일에, 반응형부터 그린다. 네이티브와 조금 다른 반응형은 같은 페이지의 다른 묶음으로. 데스크톱은 다른 팀 파일에 두고 링크한다.
- 페이지 머리: 반복 페이지마다 Helpers 의 「Header」 부품. 원문 그림 설명의 예는 제목 「320 v1.8」, 설명 한 줄, 상태 여럿(Design approved · Copy in progress · Dev in progress).
- 주의 표시: 개발자가 볼 곳은 「Willy」 부품으로 가리킨다.

### Phoenix Group — Compound 「Guides for Designers」

- URL: https://compound.thephoenixgroup.com/latest/figma/overview/guides-for-designers-840krVrQ
- 종류: 실제 팀
- 관련 프레임 · 작업 흐름을 섹션으로 묶는다. 그룹 대신 프레임을 쓰고, 묶음용 프레임 이름은 `Layout`. 화면 폭 · 상태 배치 규칙은 이 쪽에 없음(미확인). 이름 규칙은 아래 「이름 규칙」 절.

### Figma Help — Use sections in prototyping

- URL: https://help.figma.com/hc/en-us/articles/16194160540567-Use-sections-in-prototyping
- 종류: 공식
- 섹션 하나에 같은 사용자 흐름의 프레임을 모은다(「group together frames that are a part of the same user flow」). 섹션 이름 예: 쇼핑 앱 「Browse」 · 「Cart」 · 「Checkout」, 소셜 앱 「Feed」 · 「Settings」 · 「Post」, 운동 앱 「Workouts」 · 「Goals」 · 「Profile」. 섹션을 프레임 위로 끌면 그 프레임이 들어간다.
- 프로토타입에서 섹션으로 이으면 그 섹션에서 마지막으로 본 프레임으로 돌아간다. 섹션 안 가로 · 세로 순서는 이 글에 없음(미확인).

### Figma Blog — The Designer's Handbook for Developer Handoff

- URL: https://www.figma.com/blog/the-designers-handbook-for-developer-handoff/
- 종류: 공식
- 다 된 섹션 · 프레임에 Ready for dev 를 걸고 Dev Mode 에서 다시 본 뒤 공유한다. 화면 차례를 보여 줄 때 빠진 상태가 없는지 개발자에게 묻는다.
- 화면 폭: 「Consider how elements will transform between different breakpoints」. 부모 프레임 크기는 그 순간의 스냅숏이라고 적는다. 화면 폭마다 프레임을 어떻게 늘어놓는지는 없음(미확인).
- 주석: Dev Mode 주석에 레이아웃 · 접근성 분류를 따로 둔다. 큰 영역 레이어 이름은 쓰임대로(「feature callout」 · 「main content」 · 「related aside」), 「Frame 123」 금지.

### GitLab — Pajamas UI Kit 부품 파일 · 디자인 토큰 사용

- URL: https://gitlab.com/gitlab-org/gitlab-services/design.gitlab.com/-/raw/main/contents/get-started/uik-components.md · https://gitlab.com/gitlab-org/gitlab-services/design.gitlab.com/-/raw/main/contents/product-foundations/design-tokens-using.md · 옛 제안 https://gitlab.com/gitlab-org/gitlab-design/issues/791(문서 맨 위에 deprecated 표시)
- 종류: 실제 팀(디자인 시스템 공개 문서 원문). 위 「실제 팀」 절의 GitLab 항목은 파일 나누기만 적었고, 페이지 안 배치는 여기서 나온다.
- 부품 페이지 안: 페이지 하나 = 부품 하나, 그 안 프레임은 분류 · 묶음 또는 「Variants」. 옛 제안 때 설문에서 응답자 10명 모두 「변형을 모두 한 페이지에」 를 골랐다고 적혀 있다. 가장 많이 쓰는 변형을 세트의 왼쪽 위에 둔다.
- 라이트 · 다크: 변수 모드를 페이지나 부모 프레임에 걸고, 그 안은 Auto 로 두어 물려받게 한다. 기본 Auto 는 라이트.
- 화면 단위(제품 화면) 배치 규칙: 미확인.

### Smashing Magazine(Ben Shih) — Designing A Better Design Handoff File In Figma

- URL: https://www.smashingmagazine.com/2023/05/designing-better-design-handoff-file-figma/
- 종류: 가이드(디자이너 기고)
- 위아래 배치: 캔버스 맨 위에 디자인 전체를 놓고, 그 아래 섹션들에 세부 설명(호버 · 첫 상태 · 최대 폭 · 높이, 경우마다 결과)을 둔다. 개발자가 한눈에 전체를 보고 섹션 링크로 세부에 간다.
- 제목: 화면에 번호 + 제목(Luis Ouriach 템플릿을 예로 든다, 원문 예 「1. Welcome → 2. Onboarding → 3. Homepage」). 흐름이 바뀌면 번호 다시 매기기가 번거로우니 티켓 · 사용자 여정으로 화면을 묶고 묶음에 번호를 붙이는 방법도 든다.
- 흐름 화살표: 프로토타입 연결 · FigJam · Autoflow 플러그인.
- 파일 안에 변경 기록 · 다음 계획을 적고, 고칠 때는 브랜치로 해서 넘김 파일 링크를 그대로 둔다.
- 화면 폭을 나란히 놓을지 쌓을지 · 간격 값: 없음(미확인).

### Emu Digital(에이전시) — Figma Design Handoff: A Practical Guide

- URL: https://www.emudigitalagency.com.au/figma-design-handoff/
- 종류: 가이드(에이전시 권장)
- 화면 폭: 주요 화면은 데스크톱 · 모바일 둘, 레이아웃이 크게 바뀌면 태블릿까지. 프레임 이름은 화면 + 폭(「Home – Desktop」 · 「Home – Mobile」).
- 승인된 화면은 「Ready for Development」 같은 페이지에, 탐색 · 옛 판은 「Archive」 페이지로. 주석은 디자인 옆에 짧게.
- 캔버스 안 가로 · 세로 배치 · 제목 프레임: 없음(미확인).

### 페이지 안 배치 — 표본 · 공통 패턴

표본: 실제 팀 9곳(이 절의 Pinterest Gestalt · GitLab 마케팅 · Kiwi.com Orbit · Compound · GitLab Pajamas, 위 절의 Equinor · Hygraph · Shopify · WordPress), 공식 · 가이드 7곳(공식 4: Figma Help 섹션 · 섹션 프로토타이핑 · Dev Mode 안내 · 넘김 핸드북, 가이드 3: LogRocket · Smashing · Emu). 화면 폭 · 상태를 캔버스에서 나란히 놓는지 쌓는지 적은 팀 글은 Equinor(변형은 아래) 하나뿐이고, 화면 폭 배치를 묻는 Figma 포럼 글(https://forum.figma.com/archive-21/help-best-practices-for-designing-mobile-desktop-side-by-side-993)에는 답이 없다. 간격 값(px)을 적은 곳은 찾지 못했다(미확인).

| 패턴                                                                               | 팀  | 글  | 곳                                                                                                                                     |
| ---------------------------------------------------------------------------------- | --- | --- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 흐름 · 기능 단위로 화면을 묶고 묶음에 이름표(섹션 · 묶음 표지)                     | 4   | 4   | Gestalt · Compound · Kiwi.com(Group cover) · Hygraph / Figma 섹션 · 섹션 프로토타이핑 · LogRocket · Smashing                           |
| 설명 · 제목을 부품이나 정해진 프레임으로 캔버스에 둔다(주석 키트 · READ:ME · 머리) | 4   | 3   | Gestalt(Handoff Kit) · GitLab 마케팅(READ:ME) · Kiwi.com(Header · Willy) · Shopify(제목 · 스티키) / Figma 넘김 핸드북 · Smashing · Emu |
| 화면 폭(기기)마다 페이지를 나눈다(근거 약함)                                       | 2   | 0   | Shopify · WordPress. Figma BP 와 5 ways 블로그는 위 절에서 셈                                                                          |
| 흐름 안 화면은 가로 한 줄, 변형 · 상태는 아래나 옆(근거 약함)                      | 2   | 1   | Kiwi.com(가로 묶음) · Equinor(변형은 아래) / LogRocket(상태는 옆)                                                                      |
| 흐름 화살표를 그린다(플러그인 · 연결선 부품)(근거 약함)                            | 2   | 2   | Gestalt(connectors) · Kiwi.com(Autoflow) / LogRocket · Smashing(Autoflow · FigJam)                                                     |
| 묶음 · 머리에 진행 상태를 적는다(팀 근거 약함)                                     | 2   | 3   | Kiwi.com(Group cover · Header) · Shopify(상태 배지) / Figma 섹션 · Dev Mode 안내 · 넘김 핸드북(Ready for dev)                          |
| 지금(운영) 화면을 같은 파일 앞쪽에 둔다(근거 약함)                                 | 3   | 0   | Gestalt(control section) · WordPress(Current UI) · Shopify(Think 의 옛 화면)                                                           |
| 폭이 조금 다른 판은 같은 페이지의 다른 묶음으로(근거 약함)                         | 1   | 0   | Kiwi.com(네이티브와 다른 반응형)                                                                                                       |
| 라이트 · 다크는 페이지나 부모 프레임에 변수 모드를 건다(근거 약함)                 | 2   | 0   | GitLab Pajamas · CMS(위 절, 테마를 페이지 · 프레임 단위로)                                                                             |
| 개요(디자인 전체)는 위, 세부 설명은 아래 섹션(근거 약함)                           | 0   | 1   | Smashing                                                                                                                               |
| 안 그린 화면 자리를 빈 화면 부품으로 잡는다(근거 약함)                             | 1   | 0   | Kiwi.com(Empty · Missing)                                                                                                              |

### 페이지 안 배치 — 그대로 옮길 수 있는 후보

모두 한 곳의 규칙만 옮겼다. 「NosLog 로 옮기면」 은 그 규칙 자리에 Build · 악곡 페이지의 화면을 넣기만 한 예다. 원 규칙에 없는 부분은 「미확인」 으로 두었다.

#### 후보 1 — Kiwi.com Orbit(가로 묶음 + 묶음 표지 + 페이지 머리)

- 원래 규칙: 페이지 맨 위에 Header(제목 · 설명 한 줄 · 상태 여럿). 관련 화면을 가로로 묶고 묶음마다 맨 앞에 Group cover(목적 · 상태). 화살표는 Autoflow. 안 그린 화면은 Empty · Missing 부품. 폭이 조금 다른 판은 같은 페이지의 다른 묶음.
- NosLog 로 옮기면: Build · 악곡 페이지 맨 위 Header(「악곡」 · 한 줄 설명 · 상태). 묶음 1 = Group cover 「목록」 → 목록 보기 · 격자 보기 · 촘촘 격자를 가로로. 묶음 2 = Group cover 「상세」 → 상세 머리 · 내 기록 · 랭킹 · 평가 로그인 · 평가 로그아웃을 가로로. 1440 · 1056 판이 있으면 같은 페이지 아래에 따로 묶음. 묶음 사이 간격 값은 원문에 없음(미확인).

#### 후보 2 — Equinor(가로 한 줄 · 변형은 아래로)

- 원래 규칙(위 절): 프레임을 가로로 늘어놓고 위를 맞추고 간격을 같게. 한 화면의 변형은 그 화면 아래로 세로로 쌓는다.
- NosLog 로 옮기면: 가로 한 줄에 목록 보기 · 상세 머리 · 내 기록 · 랭킹 · 평가 로그인. 목록 보기 아래에 격자 보기 · 촘촘 격자, 평가 로그인 아래에 평가 로그아웃. 섹션 · 제목 · 화살표는 원문에 없음(미확인).

#### 후보 3 — Pinterest Gestalt(섹션 라벨 + 지금 화면 먼저 + 주석 키트)

- 원래 규칙: 섹션으로 캔버스 구역에 라벨을 붙인다. 넘김 페이지는 지금 화면(control section)부터 놓는다. 주석은 Handoff Kit 부품(Contextual notes · Flow notes · Sticky notes · 접근성), 흐름은 연결선 자산.
- NosLog 로 옮기면: 섹션 「지금 화면」(운영 악곡 화면 캡처) → 섹션 「목록」(목록 보기 · 격자 보기 · 촘촘 격자) → 섹션 「상세」(상세 머리 · 내 기록 · 랭킹 · 평가 로그인 · 평가 로그아웃). 섹션마다 Flow notes 로 바뀐 점과 결정을 적는다. 섹션 안 가로 · 세로 순서는 원문에 없음(미확인).

## 이름 규칙

판 4 근거. 페이지 · 화면 프레임 · 섹션 · 부품 · 변수 컬렉션 · 모드 · 글자 스타일 이름을 공개한 곳을 모았다. 위 절에 이미 적은 Figma 라이브러리 BP(슬래시 이름 · 「_」 「.」 도우미 부품) · Figma BP(검색에서 홀로 읽히는 이름 · 티켓 번호) · Carbon(파일 이름 앞 「(v11)」) · Alberta(「goa-」) · Kiwi.com(「XY」 버전 페이지) · WordPress(제목 25자) 는 다시 적지 않고 표에서만 센다. 예시 이름은 원문 그대로 옮겼다.

### Pinterest — Gestalt 「Naming convention」 · 「Design handoff」

- URL: https://gestalt.pinterest.systems/team_support/design_file_hygiene/naming_convention · https://github.com/pinterest/gestalt/tree/master/docs/markdown/team_support/design_file_hygiene
- 종류: 실제 팀(디자인 시스템 공개 문서, legacy 표시)
- 부품: 문서 · 코드와 같은 PascalCase(`ComboBox` · `IconButton` · `RadioGroup`). 플랫폼은 끝에 마침표 + 소문자(`Toast.web`). 비공개 부품은 앞에 마침표(`.BannerUpsell/Visuals.web`).
- 아이콘: 소문자 · 하이픈(`heart` · `heart-outline`).
- 페이지: 이모지는 페이지 묶음을 가를 때만(`🧑‍🎨 Design explorations` · `📔 Cover`). 넘김 페이지 이름은 「Handoff」 에 정해진 이모지(`🤝` 최신 승인본 · `✏` 작업 중 넘김), 낡으면 `v1` 같은 버전 표시. 페이지 이름 앞에 공백 4칸을 넣어 들여쓰기로 묶는다. 아무 이모지나 쓰지 말라고 적는다.
- 레이어 · 프레임 · 섹션: 화면 맥락의 이름(`Item name` · `Label` · `Divider` · `Brand collage` · `partner logos`). 쓰지 말 것은 `Text 01` · `Ellipse 2` · `Screenshot 2023-04-26` · `Group 7` · `Frame 220`, 약어 · 이모지.
- 변수 · 글자 스타일: 이 문서에 없음(미확인).

### GitLab 마케팅(Digital Experience) — Figma Process

- URL: https://handbook.gitlab.com/handbook/marketing/digital-experience/figma
- 종류: 실제 팀
- 프로젝트 이름: `Parent page / Child page`(예 `Solutions / DevSecOps` · `Pricing Page`).
- 파일 이름: `Parent page / Child page / Type or Phase / Version`(예 `Solutions / DevSecOps / Wireframes / 1.0` · `Pricing Page / Mock / 1.0`). 버전은 엔지니어링 갱신에 맞춘 1.0 · 1.1 · 2.0.
- 페이지 이름: 짧고 분명하게. 엔지니어링 준비가 된 페이지는 `🚢 PAGE NAME 🚢`.
- 설명 프레임 이름: `READ:ME`.
- 화면 프레임 · 부품 · 변수: 미확인.

### GitHub — Primer Primitives(변수 컬렉션 · 모드)

- URL: https://github.com/primer/primitives/blob/main/contributor-docs/adrs/adr-011-design-token-structure.md · https://github.com/primer/primitives/blob/main/src/schemas/collections.ts
- 종류: 실제 팀(토큰 저장소 원문)
- 변수 컬렉션 이름(Figma 로 들여오는 정해진 목록): `base/color/light` · `base/color/light-high-contrast` · `base/color/dark` · `base/color/dark-dimmed` · `base/color/dark-high-contrast` · `base/typography` · `mode` · `pattern/mode` · `base/size` · `functional/size` · `pattern/size` · `typography`. 층(base · functional · pattern)을 슬래시 앞에 둔다.
- 모드 이름: 소문자 낱말을 띄어 쓴다(`light` · `dark` · `dark dimmed` · `light high contrast` · `dark protanopia deuteranopia` …).
- 변수 이름: 역할 접두사 camelCase + 하이픈 값(`fgColor-default` · `bgColor-default`), Figma 안에서는 슬래시 묶음(위 절의 `fgColor/danger` → `base/color/red/4`). 범위(scope)도 `bgColor` · `fgColor` · `borderColor` 처럼 정해 둔다.

### Nathan Curtis(EightShapes) — Naming Tokens in Design Systems

- URL: https://nathanacurtis.substack.com/p/naming-tokens-in-design-systems-9e86c7444676
- 종류: 가이드(디자인 시스템 컨설팅사)
- 층 순서: namespace(시스템 `esds` · 테마 `ocean` · 도메인) → object(부품 `input` · 요소 `left-icon` · 부품 묶음 `forms`) → base(category `color` · concept `feedback` · property `background`) → modifier(variant `primary` · state `hover` · scale `42` · mode `on-light`). modifier 는 끝, mode 는 흔히 맨 끝.
- 예: `$esds-color-neutral-42` · `$esds-color-feedback-background-error` · `$esds-font-heading-size-1` · `$esds-input-left-icon-color-fill` · `$color-action-background-secondary-hover-on-light`.
- 모드: 모든 토큰에 `on-light` · `on-dark` 를 붙이거나, 기본(보통 라이트)을 두고 다른 쪽에만 `on-dark` 를 붙인다. 테마와 모드는 다른 축.

### Phoenix Group — Compound 「Guides for Designers」

- URL: https://compound.thephoenixgroup.com/latest/figma/overview/guides-for-designers-840krVrQ
- 종류: 실제 팀(위 Compound 항목과 같은 팀)
- 레이어 · 프레임: 모든 레이어에 뜻 있는 이름(`Frame 201` 같은 기본 이름 금지). 묶음용 프레임은 `Layout`. 영국 영어, 낱말마다 첫 글자 대문자(`Primary Button`), 낱말 사이 띄어쓰기, 하이픈 앞뒤 띄어쓰기(`User - Logged Out`). 글자 레이어 이름은 내용과 같게 되돌린다.
- 섹션: 관련 프레임 · 작업 흐름을 섹션으로 묶는다(이름 규칙은 없음).
- 부품 · 변수 · 글자 스타일: 이 쪽에 없음(미확인).

### Joey Banks — Baseline #5 「Naming in Figma」

- URL: https://buttondown.com/joeyabanks/archive/baseline-5-naming-in-figma/
- 종류: 가이드(디자이너 개인 뉴스레터)
- 프레임: 라이브러리 파일의 프레임 이름은 부품 패널의 접히는 제목이 된다(예 프레임 「Apple Pay」 안에 부품 넷).
- 부품: 발행하지 않을 하위 부품은 앞에 `_`(예 `_StatusBar`). 하위 부품 이름은 부모 이름 + 하이픈 + camelCase(`_Calendar-dayRow`). 부품 패널에 보이는 이름은 코드가 PascalCase 여도 띄어 쓰고 낱말마다 대문자(`Date Picker`). 부품 · 변형 이름은 코드와 맞춘다.
- 페이지: 작업 단계 · 부품 분류로 나누고 이모지 허용.

### Figma — Simple Design System(SDS) 저장소

- URL: https://github.com/figma/sds(scripts/tokens/tokens.json · styles.json · figma-plugin-token-json/code.js)
- 종류: 공식(Figma 가 낸 예제 디자인 시스템 · Community 파일과 짝인 코드)
- 변수 컬렉션 여섯: 내보낸 키로 `@color_primitives` · `@color` · `@typography_primitives` · `@typography` · `@size` · `@responsive`. 원시값 컬렉션과 역할 컬렉션을 「~ primitives」 짝으로 나눈다. 내보내기 스크립트가 이름을 소문자 · 밑줄로 바꾸므로 Figma 안 원래 대소문자 · 띄어쓰기는 미확인.
- 모드: color `sds_light` · `sds_dark` · `brand_b_light`(시스템 이름 + 밝기, 브랜드 이름 + 밝기), responsive `desktop` · `mobile` · `tablet`, 원시값은 `value` · `default` 하나(같은 스크립트 변환).
- 변수 이름: 슬래시 묶음, 역할 → 변형 → 상태(color 아래 `background` · `text` · `border` · `icon`, 그 아래 `default` · `neutral` · `brand` · `positive` · `warning` · `danger`, 끝에 `default-hover` · `secondary-hover`). typography 는 `body` 아래 `font-family` · `size-small` · `font-weight-strong`.
- 글자 스타일(원래 이름 그대로): `Title Hero` · `Title Page` · `Subtitle` · `Heading` · `Subheading` · `Body Base` · `Body Strong` · `Body Small Strong` · `Single Line/Body Base` · `Body Code`. 낱말마다 대문자, 띄어쓰기, 묶음은 슬래시. 문서용 내부 스타일은 앞에 마침표(`.Utilities/Component notes/Regular`). 효과 스타일은 `Drop Shadow/300` · `Inner Shadow/100` · `Blur/Overlay`.

### Atlassian Design System — Design tokens

- URL: https://atlassian.design/foundations/tokens/design-tokens
- 종류: 실제 팀(디자인 시스템 공개 문서)
- 토큰 이름: 점으로 세 부분 foundation → property → modifier(선택). 예 `color.icon.success` · `color.text`(기본은 modifier 없음) · `opacity.disabled` · `opacity.loading`. 모두 소문자.
- 테마: Light mode · Dark mode · High-contrast mode 등. Figma 안 모드 · 컬렉션 이름은 이 쪽에 없음(미확인).

### Shopify — Polaris 색 토큰

- URL: https://github.com/Shopify/polaris/blob/main/polaris.shopify.com/content/design/colors/color-tokens.mdx(사이트 polaris.shopify.com 은 shopify.dev 로 넘어가 저장소 원문으로 읽음)
- 종류: 실제 팀(디자인 시스템 공개 문서)
- 의미 토큰: 묶음 `color` → 요소(`bg` · `bg-surface` · `bg-fill` · `text` · `border` · `icon`) → 선택 수식(역할 · 강조 · 상태). 기본값이면 그 자리를 뺀다. 원문 그림 설명 예: 요소 `bg`, 역할 `secondary`, 상태 `hover`.
- 특수 토큰: 개념을 맨 앞에 두고 뒤에 의미 토큰 꼴(개념 `nav` + `bg-surface-selected`). 그 개념에만 쓴다.

### Figma Help — Components collection: Tips for component management

- URL: https://help.figma.com/hc/en-us/articles/39747637290263-Components-collection-Tips-for-component-management
- 종류: 공식
- 부품: 모양이 아니라 무엇인지로 이름 짓는다(「blue-large-button」 은 색 · 크기가 바뀌면 틀린다). 겹치는 낱말(Badge · Chip · Tag)을 피하고 코드 이름과 맞춘다(「Button」 ↔ `<Button>`). 슬래시로 층(`button/primary/default` · `button/primary/hover`). 은퇴한 부품은 이름과 설명에 표시하고 대체 부품을 적는다.
- 속성: 한 개념에 한 낱말(Size · Scale · Dimensions 섞지 않기). 미리 정할 것으로 대소문자(Title Case · lower case · camelCase), 불리언 꼴(「Has Icon」 · 「Show Icon」 · 「Icon Visible」), 값 꼴(「SM/MD/LG」 · 「Small/Medium/Large」, 「Hover」 · 「Hovered」), 용어(modal · dialog)를 든다.
- 레이어: 구조를 가진 레이어는 `card-thumbnail` · `user-avatar` 처럼(`Rectangle 4` · `Frame 22` 금지). 페이지 이름 규칙은 없음.

### Figma Help — Best practices to help Figma AI understand your design system

- URL: https://help.figma.com/hc/en-us/articles/38978644498199-Best-practices-to-help-Figma-AI-understand-your-design-system
- 종류: 공식
- 부품: 라이브러리 안에서 한 규칙. 좋은 예 `Card/Product/Default`, 나쁜 예 `Frame 42 copy`. 그 밖 예 `Button/Primary/Large` · `Icon/Arrow` · `Input/Text/Error`. 변형 축 예 Size(small · medium · large) · Type(primary · secondary · tertiary) · State(default · hover · disabled).
- 변수: 쓰임을 말하는 의미 이름(`color/surface/primary` · `color/brand/primary`), 값만 말하는 `blue-500` 은 피한다. 슬래시로 묶음. 컬렉션은 색 · 간격 · 글자처럼 묶되 정확한 컬렉션 이름 · 모드 이름은 없음(미확인).
- 레이어: `HeroImage` · `PriceLabel`(`Group 7` · `Rectangle 3` 금지).

### GitLab — Pajamas UI Kit 부품 · 토큰 이름

- URL: https://gitlab.com/gitlab-org/gitlab-services/design.gitlab.com/-/raw/main/contents/get-started/uik-components.md · https://gitlab.com/gitlab-org/gitlab-services/design.gitlab.com/-/raw/main/contents/product-foundations/design-tokens-reading.md
- 종류: 실제 팀(디자인 시스템 공개 문서 원문)
- 부품 층: Page `[Component]` → Frame `[Component]` · `[Category]` · `[Group]` · `[Elements]` 또는 「Variants」 → Layer 는 변형이면 `[Property=Value, Property=Value]`, 손으로 묶으면 `[Breakpoint/Item/Size/State]`. 화면 폭 약어 `xs` · `sm` · `md` · `lg` · `xl`, 범위는 `≥md` · `≤sm`. 변형 세트 밖 부품은 폭 · 크기 약어 앞에 숫자를 붙여 부품 패널 순서를 맞춘다.
- 원문 예: `Icons/Actions/Export` · `Alert/Alert`(Layer `Variant=danger, Is max width=false`) · `Pagination/Pagination`(`Variant=full (default), Breakpoint=≥md, Has truncation=false`) · `Badge/Pipeline badge`(`Variant=running, Size=sm`) · `Button/Default`(`Category=primary, Type=dropdown split, Size=md`). 속성 이름은 첫 글자만 대문자 낱말(`Is max width` · `Has truncation`), 값은 소문자.
- 토큰 이름: 점으로 `[group].[component].[variant/category].[element].[position].[relationship].[property].[type].[scale].[state]`. 앞은 맥락(group 이나 component 중 하나만), 가운데 대상, 끝에 수식. 예 `text.color.default` · `feedback.info.background.color` · `dropdown.icon.right.to-edge.space` · `action.danger.[…]` · `[…].color.strong.hover`.
- 변수 컬렉션: 부품 라이브러리 안 내부 변수 컬렉션 이름 `Integrated components`, 그 안은 부품 이름(`Tooltip` · `Badge`)으로 묶는다. 디자인 토큰은 별도 「Design tokens」 라이브러리의 변수, 모드는 라이트 · 다크(정확한 모드 이름 표기는 미확인).

### Smashing Magazine(Ben Shih) — 넘김 파일 이름

- URL: https://www.smashingmagazine.com/2023/05/designing-better-design-handoff-file-figma/
- 종류: 가이드
- 화면 프레임: 번호 + 제목(원문 예 「1. Welcome → 2. Onboarding → 3. Homepage」). 레이어는 `Frame 3123` 같은 기본 이름 금지. 부품 · 스타일 이름은 개발자의 컨테이너 · 토큰 이름과 맞춘다.

### Emu Digital(에이전시) · Locofy(도구 문서) — 화면 + 폭 이름

- URL: https://www.emudigitalagency.com.au/figma-design-handoff/ · https://www.locofy.ai/docs/plugin/lightning/multiple-breakpoints/
- 종류: 가이드 둘(에이전시 권장 · 디자인→코드 도구 문서)
- Emu: `Home – Desktop` · `Home – Mobile`(화면 이름 + 줄표 + 폭 이름).
- Locofy: 「Name + Breakpoint」 `Homepage - Desktop` · `Homepage - Mobile`, 또는 「Name + Pixel Width」 `Homepage - 1440px` · `Homepage - 420px`. 이 꼴로 지은 형제 프레임을 같은 화면의 폭 변형으로 알아본다.

### Twilio — Paste 「Design Library Standards」 · 「Designer workflow」

- URL: https://github.com/twilio-labs/paste/blob/main/internal-docs/design/design-library-standards.md · https://github.com/twilio-labs/paste/blob/main/internal-docs/design/designer-workflow.md
- 종류: 실제 팀(디자인 시스템 저장소의 내부 문서 공개)
- 라이브러리 이름: Title Case(`Paste Components`). 부품 이름 · 부품 페이지 이름: Title Case(`Radio Group`, 문서 사이트와 같은 대소문자).
- 레이어: 고치지 않는 레이어는 문장형(`Bottom border`), 고치라고 둔 레이어는 문장형 + 연필(`✏️ Heading text`), 설정할 하위 부품은 문장형 + 톱니(`⚙️ Checkbox`). 그런 레이어를 감싼 묶음 프레임 이름 끝에 `↓`(`Content ↓`).
- 속성 이름 · 값: 문장형(`Variant=Destructive secondary`), API 속성 이름과 맞추되 패널에서 잘리면 줄인다. 토큰인 값은 kebab + 괄호 실제 값(`size-110 (64px)`).
- 글자 · 레이어 스타일: 토큰 이름 그대로 kebab(`color-text-weak`). 피그마 전용 값은 `utilities (figma-specific)/transparent`.
- 페이지 표시: 작업 중 부품 페이지 앞 `🚧`(`🚧 Button`), 라이브러리 자체 자원(표지 · 로컬 자산) 페이지 앞 `🧰`, 코드에 아직 없는 디자인은 페이지 · 부품 이름 뒤 `(dev)`. 발행하지 않을 하위 부품은 이름 앞 `.`.
- 브랜치 이름: 커밋 규칙과 같은 `type(component): description`(`feat(alert dialog): add a new variant` · `fix(toast): left align text`).

### Orfium — How our team adopted Design Tokens

- URL: https://www.orfium.com/design/how-we-implemented-design-tokens/
- 종류: 실제 팀(회사 블로그)
- 층 이름: Tier-1 `global`(원시값) · Tier-2 `semantic`(줄여 `sem`) · Tier-3 `component`(줄여 `comp`).
- 토큰 이름: 점으로 `tier.category.property.state`, global 은 층 이름을 뺀다. 여러 낱말은 camelCase. 예 `blue.3` · `sem.textColor.active` · `comp.button.compact.iconSize`.
- Figma 컬렉션 · 모드 이름: 글에 없음(미확인). 다크 모드는 같은 semantic 층이 다른 원시값을 가리키는 방식으로 계획만 적혀 있다.

### Brad Frost — Creating Themeable Design Systems

- URL: https://bradfrost.com/blog/post/creating-themeable-design-systems/
- 종류: 가이드
- 층: 「Tier 1: Brand Definitions」 · 「Tier 2: High-level application variables」 · 「Tier 3: Component-specific variables」.
- 예: `--color-brand-starbucks-green` · `--font-family-primary`(1층), `--primary-action-background-color` · `--border-color-subtle`(2층), `--button-background-color` · `--button-border-width`(3층). 소문자 · 하이픈, 3층은 부품 이름이 앞. 명시된 규칙 문장은 없음.

### Kiwi.com — Orbit 「Working with Figma」 이름

- URL: https://github.com/kiwicom/orbit/blob/master/docs/src/documentation/06-kiwi-use/03-guides/03-working-with-figma/02-structure.mdx
- 종류: 실제 팀
- 표지: 페이지 이름 `Cover`, 감싼 프레임 이름도 `Cover`, 안에 `File cover` 부품.
- 반복 페이지: 버전 번호(머리 부품 예 「320 v1.8」). 넘길 판은 이름에 표시(「NPS v1.6---Handoff」). 지운 반복은 이름 붙은 버전(「v 1.6 Redesigned all buttons」)으로 남긴다. 파일 전용 부품 페이지는 Local components.
- 파일: 태그 `[Main flow]` · `[Feature]` · `[Usability testing]`. 아카이브로 옮길 때 `[<ProjectName>] <FileName>`(예 `[Search] Travel Restrictions`).

### 이름 규칙 — 표본 · 공통 패턴

표본: 실제 팀 13곳(이 절의 Pinterest Gestalt · GitLab 마케팅 · GitHub Primer · Compound · Atlassian · Shopify Polaris · GitLab Pajamas · Twilio Paste · Orfium · Kiwi.com, 위 절의 IBM Carbon · CMS · Government of Alberta), 공식 · 가이드 12곳(공식 6: Figma SDS · Help 부품 관리 · Help AI 모범 사례 · 넘김 핸드북 · 라이브러리 BP · 파일 정리 BP, 가이드 6: Nathan Curtis · Joey Banks · Brad Frost · Smashing · Emu · Locofy). 화면 프레임 이름에 폭 · 로그인 상태를 함께 넣는 규칙을 공개한 실제 팀은 찾지 못했다. 가장 가까운 것은 Compound 의 `User - Logged Out`(상태)과 Pajamas 의 부품 레이어 `Breakpoint=≥md`(폭)다. 글자 스타일 이름을 원문 그대로 확인한 곳은 Figma SDS 하나다.

| 패턴                                                                    | 팀  | 글  | 곳                                                                                                                                                   |
| ----------------------------------------------------------------------- | --- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 슬래시로 층을 만든다(부품 · 변수 · 스타일 · 파일)                       | 5   | 4   | Gestalt · GitLab 마케팅 · Primer · Pajamas · Twilio / Figma SDS · Help 부품 관리 · Help AI · 라이브러리 BP                                           |
| 토큰 · 변수: 큰 분류 → 대상(요소) → 수식(변형 · 크기 · 상태), 상태가 끝 | 5   | 4   | Atlassian · Polaris · Pajamas · Orfium · Primer / Curtis · Figma SDS · Help AI · Brad Frost                                                          |
| 페이지 이름에 진행 상태 표시(이모지 · 꼬리말)                           | 4   | 0   | Gestalt(🤝 · ✏) · GitLab 마케팅(🚢) · Twilio(🚧 · (dev)) · Kiwi.com(---Handoff). 공식 · 가이드 3곳은 위 절에서 셈                                    |
| 대소문자 · 띄어쓰기를 문서로 못박는다                                   | 4   | 1   | Gestalt(PascalCase) · Twilio(Title Case · 문장형) · Compound(Title Case · 「 - 」) · Pajamas(속성 첫 글자만) / Help 부품 관리                        |
| 이름에 버전(1.0 · v1.6 · (v11))                                         | 4   | 1   | GitLab 마케팅 · Kiwi.com · Gestalt · Carbon / 파일 정리 BP(이름 붙은 버전)                                                                           |
| 모드 이름 = 밝기(+ 대비 · 브랜드 · 테마)                                | 4   | 2   | Primer(`light` · `dark dimmed`) · Carbon(White · Gray 100) · CMS(Core · Healthcare.gov) · Atlassian / Figma SDS(`sds_light`) · Curtis(`on-dark`)     |
| 부품 이름은 코드 · 문서 이름과 같게                                     | 3   | 3   | Gestalt · Twilio · Alberta(`goa-`) / Help 부품 관리 · Joey Banks · Smashing                                                                          |
| 기본 이름(Frame 201 · Group 7) 금지, 쓰임으로 이름                      | 2   | 4   | Gestalt · Compound / Figma 넘김 핸드북 · Help 부품 관리 · Help AI · Smashing                                                                         |
| 발행하지 않을 부품 · 내부 스타일은 앞에 「.」 「_」(팀 근거 약함)       | 2   | 3   | Gestalt · Twilio / 라이브러리 BP · Joey Banks(`_`) · Figma SDS(`.Utilities`)                                                                         |
| 변형 속성 `Property=Value`(근거 약함)                                   | 2   | 1   | Pajamas(`Variant=danger`) · Twilio(`Variant=Destructive secondary`) / Help AI(Size · Type · State)                                                   |
| 원시값 층과 역할 층을 컬렉션 · 층 이름으로 나눈다(근거 약함)            | 2   | 2   | Primer(`base/…` · `functional/…` · `pattern/…`) · Orfium(`global` · `sem` · `comp`) / Figma SDS(`color_primitives` · `color`) · Brad Frost(Tier 1–3) |
| 화면 프레임 이름 = 화면 + 「 - 」 + 폭 또는 상태(팀 근거 약함)          | 1   | 2   | Compound(`User - Logged Out`) / Emu(`Home – Desktop`) · Locofy(`Homepage - 1440px`)                                                                  |
| 글자 스타일: 역할 이름 Title Case, 묶음은 슬래시(근거 약함)             | 0   | 1   | Figma SDS(`Body Small Strong` · `Single Line/Body Base`)                                                                                             |
| 화면 프레임에 번호 + 제목(근거 약함)                                    | 0   | 1   | Smashing(「1. Welcome → 2. Onboarding」)                                                                                                             |

### 이름 규칙 — 그대로 옮길 수 있는 후보

모두 한 곳의 규칙을 그대로 옮겼다. 예는 Build · 악곡 페이지 화면들의 프레임 이름이다. 원 규칙에 없는 자리는 「미확인」 으로 두고 채우지 않았다.

#### 후보 1 — Phoenix Group Compound(Title Case · 띄어 쓴 하이픈)

- 원래 규칙: 낱말 사이 띄어쓰기, 하이픈 앞뒤 띄어쓰기(`User - Logged Out`), 영어는 낱말마다 첫 글자 대문자, 기본 이름 금지, 묶음 프레임은 `Layout`.
- NosLog 프레임 이름: `악곡 - 목록 보기` · `악곡 - 격자 보기` · `악곡 - 촘촘 격자` · `악곡 상세 - 머리` · `악곡 상세 - 내 기록` · `악곡 상세 - 랭킹` · `악곡 상세 - 평가 - 로그인` · `악곡 상세 - 평가 - 로그아웃`. 폭(1920 · 1440 · 1056)을 이름에 넣는 규칙은 원문에 없음(미확인).

#### 후보 2 — GitLab Pajamas(Page / Frame / `Property=Value`)

- 원래 규칙: Page `[Component]` → Frame 분류 · 묶음 → Layer `[Property=Value, Property=Value]`. 폭은 `Breakpoint=` 에 `xs` … `xl` 이나 `≥md`. 속성 이름은 첫 글자만 대문자, 값은 소문자. 부품용 규칙이고 제품 화면에 쓴다는 말은 없다.
- NosLog 프레임 이름: 페이지 `악곡`, 섹션(프레임 자리) `목록` · `상세`, 화면 프레임 `View=목록, Breakpoint=1920` · `View=격자, Breakpoint=1920` · `View=촘촘 격자, Breakpoint=1920` · `Part=머리, Breakpoint=1920` · `Part=내 기록, Breakpoint=1920` · `Part=랭킹, Breakpoint=1920` · `Part=평가, Breakpoint=1920, Is logged in=true` · `Part=평가, Breakpoint=1920, Is logged in=false`. 속성 이름(View · Part · Is logged in)은 원문 예(Variant · Is max width)의 꼴을 따라 붙인 것이다.

#### 후보 3 — Locofy(화면 + 픽셀 폭, 가이드 한 곳 · 근거 약함)

- 원래 규칙: 「Name + Pixel Width」 `Homepage - 1440px` · `Homepage - 420px`(또는 「Name + Breakpoint」 `Homepage - Desktop`). 같은 이름 앞부분의 형제 프레임을 폭 변형으로 본다.
- NosLog 프레임 이름: `악곡 목록 보기 - 1920px` · `악곡 격자 보기 - 1920px` · `악곡 촘촘 격자 - 1920px` · `악곡 상세 머리 - 1920px` · `악곡 상세 내 기록 - 1920px` · `악곡 상세 랭킹 - 1920px` · `악곡 상세 평가 로그인 - 1920px` · `악곡 상세 평가 로그아웃 - 1920px`(1440 · 1056 판은 끝만 `- 1440px` · `- 1056px`). 로그인 상태를 어디에 넣는지는 원문에 없음(미확인).

변수 컬렉션 · 모드 이름은 위 세 곳 모두 규칙이 없어(Pajamas 는 `Integrated components` 컬렉션 하나만) 후보에 넣지 않았다. 컬렉션 · 모드를 원문 그대로 옮길 수 있는 곳은 Primer(컬렉션 `base/color/dark` · `functional/size` · `mode`, 모드 `light` · `dark`)와 Figma SDS(컬렉션 원시값 · 역할 짝, 모드 `sds_light` · `sds_dark`)다.

## 묶음 제목 · 페이지 머리 모양 (2026-11-11 더함)

정리한 파일의 Header · Group cover 가 「실제 파일은 이렇게 만들지 않는다, 부제를 달지 않는다」 는 지적을 받아 모양만 따로 조사했다. 그림을 직접 열어 본 곳만 셌다. 숫자는 글에 적힌 값이 한 곳도 없어 모두 그림에서 잰 어림이다.

표본: 실제 팀 4곳 · 공식 1곳 · 템플릿 · 가이드 8곳, 모두 13곳(목표 15곳은 못 채움). 사용자가 준 예시(묶음 위 넓은 단색 띠 + 왼쪽 굵은 제목 한 줄)와 똑같은 꼴은 찾지 못했고, 가장 가까운 것은 한국어 가이드 2곳이라 근거 약함이다.

| 곳                              | 종류    | 묶음 제목 자리                    | 크기                                                                    | 들어가는 글                      | 색                   |
| ------------------------------- | ------- | --------------------------------- | ----------------------------------------------------------------------- | -------------------------------- | -------------------- |
| Kiwi.com Orbit                  | 실제 팀 | 묶음 왼쪽 표지(Group cover)       | 폭 ≈ 옆 모바일 화면, 높이 = 폭의 0.52–0.87배(행 높이만큼 길지 않음)     | 상태 배지 + 제목 + 설명 1–3줄    | 어두운 무채색        |
| Spotify Ways of Working         | 실제 팀 | 행 왼쪽 표지 타일                 | 옆 프레임과 같은 크기, 글자 ≈ 타일 높이의 13%                           | 제목 한 줄                       | 연한 파랑 단색       |
| Deliveroo(번역 글의 그림)       | 실제 팀 | 플로우 위 가로 띠                 | 띠 높이 ≈ 모바일 화면 폭의 0.45배, 글자 ≈ 띠 높이의 1/3                 | 제목 + 작은 「VERSION / DATE」   | 검정 · 연한 하늘색   |
| 팀스파르타                      | 실제 팀 | Figma 섹션 이름표만               | 기본                                                                    | 이름 + 담당자                    | 없음                 |
| Figma 도움말(섹션)              | 공식    | 섹션 이름표만                     | 기본                                                                    | 이름 + ready for dev             | 없음                 |
| Design Project Template         | 템플릿  | 묶음 위 가로 띠                   | 높이 = 폭의 0.14배, 글자 ≈ 띠 높이의 12%                                | 프로젝트 이름 + 제목 + 설명 3줄  | 어두운 남색          |
| 요즘IT 「디자인 핸드오프」      | 가이드  | 묶음 위 가로 띠(+ 왼쪽 세로 띠)   | 띠 높이 ≈ 1920 프레임 폭의 0.27배(약 510), 글자 약 140, 화면까지 약 390 | 제목 한 줄                       | 초록 · 파랑 단색     |
| 브런치 327roy                   | 가이드  | 섹션 안 위 가로 띠                | 못 잼                                                                   | 제목 한 줄                       | 초록 · 어두운 무채색 |
| Documentation & Annotation Kit  | 템플릿  | 전폭 가로 띠                      | 폭 : 높이 ≈ 10 : 1                                                      | 상태 칩 + 버전 + 제목            | 흰 면 + 색 줄        |
| Annotation Header(Ultimade)     | 템플릿  | 전폭 가로 띠                      | 폭 : 높이 ≈ 6 : 1                                                       | 경로 + 제목 + 설명 + 버전 · 상태 | 흰 면 + 보라 줄      |
| File Management Template V2     | 템플릿  | 열마다 위 어두운 띠               | 못 잼                                                                   | 미확인                           | 어두운 무채색        |
| Frame Organizer Kit             | 템플릿  | 묶음 띠 없음, 화면마다 위 제목 탭 | 화면 폭                                                                 | 제목                             | 흰색 · 초록          |
| 요즘IT 「개발자를 위한 피그마」 | 가이드  | 섹션 이름표만                     | 기본                                                                    | 이름                             | 없음                 |

패턴 집계(실제 팀 / 템플릿 · 가이드 · 공식): 위 가로 띠 + 제목만 0 / 2, 위 가로 띠 + 덧글 1 / 3, 왼쪽 표지 2 / 1, 섹션 이름표만 1 / 2, 부제 · 설명을 붙임 2 / 2, 상태 배지를 붙임 1 / 2. 제목만 쓰는 곳은 Spotify · 요즘IT 핸드오프 · 327roy 3곳이다.

미확인: Medium 글(403) · Shopify · GitLab · Uber · Airbnb 등의 캔버스 그림, 토스 · 당근 · 우아한형제들 같은 국내 팀 글, Figma 커뮤니티 템플릿의 화면 묶음 페이지(공개 뷰어가 첫 페이지만 보여 줌).

정리한 파일에 반영한 것(사용자 지시 「부제를 달지 않는다, 크게」 + 예시 그림): 요즘IT 핸드오프 꼴로 묶음 위 가로 띠에 제목 한 줄만 둔다. 띠 높이 500 · 글자 140 굵게 · 띠와 화면 사이 400(그림에서 잰 510 · 140 · 390 에 맞춤), 띠 폭 = 묶음 폭(최소 1920), 글은 예시 그림대로 왼쪽 정렬. 페이지 머리는 같은 꼴로 높이 720 · 글자 220 · 폭 = 가장 긴 묶음 폭으로 두었는데, 제목만 둔 페이지 머리의 치수 근거는 찾지 못해 이 값은 정리 세션이 정했다. 색은 새 색을 만들지 않고 「NosLog 토큰 · 지금 화면」 의 nl-surface-surface 를 그대로 썼다.
