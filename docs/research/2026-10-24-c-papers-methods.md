# 조사 C — 결정 기록 · 문서 체계 · 디자인 시스템 · 사용성 · 구현 근거

조사일 2026-10-24. 표기: **[열람]** = 원문 페이지를 실제로 열어 확인 · **[검색만]** = 검색 결과 요약 · 서지만 확인(본문 미확인) · **[실패]** = 열기 실패(403/404/JS 전용) → 해당 주장은 「미확인」.
형식: 제목 · 저자/기관 · 연도 · URL / 핵심 주장(2줄) / 우리 문서에 쓸 점(1줄).

집계: 항목 94건 · 원문(또는 미러 · 공식 대체 페이지) 열람 84건 · 검색만 5건 · 열기 실패 5건(실패 건은 검색 요약만, 「미확인」).
학술 논문 중 열람: Fitts 1954 · Wagemans 2012 · Lethbridge 2003 · Lamine 2022 · Tan 2023 · Baltes 2024 · Zhang 2025 · Chatlatanagulchai 2025 · Gloaguen 2026 · Lulla 2026 · Nogueira 2026 · Silva 2026 · Bhat 2026 (13편).

---

## 1. 결정 기록 방법

### 1-1. Documenting Architecture Decisions — Michael Nygard(Cognitect) · 2011 [열람]

https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions

- 기록 하나 = 제목 · 맥락 · 결정(“We will…”) · 상태(proposed/accepted/deprecated/superseded) · 결과. 번호는 연번, 재사용하지 않음, 길이는 1–2쪽.
- 뒤집힌 결정은 지우지 않고 superseded 로 표시해 남긴다. “Large documents are never kept up to date.”
- 우리: 200KB 단일 로그는 Nygard 가 말한 「갱신되지 않는 큰 문서」 그 자체 — 결정 1건을 짧은 단위로 쪼개는 근거.

### 1-2. adr.github.io — ADR GitHub 조직 · 상시 [열람]

https://adr.github.io/

- ADR = 아키텍처상 중요한 결정 1건 + 이유 · 트레이드오프 · 결과. 여러 ADR 의 모음이 decision log.
- 같은 방식을 설계 · 기타 결정으로 넓힐 수 있다고 명시. 템플릿 비교(WICSA 2015) 링크.
- 우리: 「디자인 결정」 도 ADR 형식을 그대로 쓸 수 있다는 1차 근거.

### 1-3. MADR (Markdown Any Decision Records) 4.0.0 — adr 조직(Kopp · Zimmermann 외) · 2024-09-17 [열람]

https://adr.github.io/madr/

- 필드: 제목 · 맥락/문제 · 결정 동인 · 고려한 안 · 결정 결과 · 결과(Good/Bad) · 확인 방법 · 안별 장단점. 앞머리 YAML 에 status(proposed/rejected/accepted/deprecated/“superseded by ADR-0123”) · date · decision-makers.
- 파일 이름 `NNNN-title-with-dashes.md`, `docs/decisions/` 에 결정 1건 = 파일 1개, 큰 프로젝트는 하위 폴더별 번호.
- 우리: “Confirmation(확인 방법)” 칸 = 우리 테스트 기대값 · 실측 절차를 결정에 묶는 칸으로 쓰기 좋다.

### 1-4. Y-statements — Olaf Zimmermann(블로그) / Zdun · Capilla · Tran · Zimmermann, “Sustainable Architectural Design Decisions”, IEEE Software 30(6) · 2013 [실패 → 검색만]

https://medium.com/olzzio/y-statements-10eb07b5a177 (403) · https://eprints.cs.univie.ac.at/3775

- (검색 요약) 결정을 “In the context of…, facing…, we decided for… and neglected…, to achieve…, accepting that…” 한 문장으로 쓰는 형식. SATURN 2012 발표 · IEEE Software 2013 논문에서 공개.
- 템플릿 본문 문구는 원문 미확인. 논문 서지(DOI 10.1109/MS.2013.97)만 확인.
- 우리: 결정 색인 표의 「한 줄 요약」 칸 형식으로 쓸 만함(원문 미확인이므로 인용은 서지만).

### 1-5. Lightweight Architecture Decision Records — ThoughtWorks Technology Radar · 2016 Trial → 2017-11 · 2018-05 Adopt [열람]

https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records

- 2016 Trial, 2017-11 · 2018-05 Adopt.
- 위키 · 웹사이트가 아니라 소스 관리(코드 옆)에 두어 코드와 함께 버전 관리하라.
- 우리: 결정 기록은 리포 안 md 로 유지(지금처럼), 외부 도구로 옮기지 않는다.

### 1-6. Rust RFC process — rust-lang/rfcs · 상시 [열람]

https://github.com/rust-lang/rfcs

- 큰 변경만 RFC. PR 로 올리고 FCP(10일) 후 merge/close/postpone. 파일 번호는 PR 번호로 정한다(미리 번호를 잡지 않음).
- 수락된 RFC 는 원칙적으로 크게 고치지 않는다 — 아주 작은 수정만 후속 PR, 큰 변경은 새 RFC + 원문에 메모.
- 우리: 번호를 미리 잡지 않고 PR/작업 ID 로 정하는 방식 = 동시 세션 번호 충돌 회피 근거.

### 1-7. PEP 1 — Python Steering Council / PEP editors · 2000~ (상시 갱신) [열람]

https://peps.python.org/pep-0001/

- 상태 Superseded, 헤더 `Superseded-By:` ↔ 새 PEP 의 `Replaces:`. Accepted/Final/Rejected/Superseded 이후엔 실질 수정 안 함.
- 결론이 난 PEP 는 「역사 기록」이고 현재 동작의 정본은 Language/Library Reference 등 다른 문서.
- 우리: 「결정 기록 = 역사」, 「가이드 = 현재 정본」 을 분리하는 가장 직접적 근거.

### 1-8. React RFCs — reactjs/rfcs (Meta React 팀) · 상시 [열람]

https://github.com/reactjs/rfcs

- 큰 변경만 RFC, 3일 FCP 후 merge 되면 “active”. 구현 · 우선순위 보장은 아님.
- active RFC 는 후속 PR 로 계속 고쳐 최종 설계와 대략 맞춘다(Rust · PEP 와 반대).
- 우리: 「수락 후 불변」 이 유일한 관행은 아니라는 반례 — 어느 쪽을 택할지 명시해야 함.

### 1-9. RFC 7322 RFC Style Guide §4.1.4 Updates/Obsoletes — RFC Editor(H. Flanagan, S. Ginoza) · 2014 [열람]

https://www.rfc-editor.org/rfc/rfc7322.html

- 새 RFC 가 옛 RFC 를 갱신 · 폐기하면 첫 쪽 헤더에 `Updates: nnnn` / `Obsoletes: nnnn` 를 적는다(이 문서 자체가 Obsoletes: 2223).
- 출판된 RFC 본문은 바꾸지 않고 정정은 errata, 대체는 새 RFC 로(본문 수정 금지는 이 문서에 명시돼 있지 않아 「추정」).
- 우리: 「갱신(부분)」 과 「폐기(전체)」 두 관계를 구분해 헤더에 적는 방식.

### 1-10. When Should I Write an Architecture Decision Record — Josef Blake, Spotify Engineering · 2020-04-14 [열람]

https://engineering.atspotify.com/2020/04/when-should-i-write-an-architecture-decision-record

- “거의 항상” 쓴다. 문서화 안 된 채 표준이 된 결정은 역으로(backfill) 쓴다. 큰 건은 RFC → 결론 나면 ADR.
- 이점: 온보딩 · 소유권 이관 · 팀 간 정렬. superseding · 저장 위치는 다루지 않음.
- 우리: 지금 가이드에 이유 없이 박힌 규칙은 backfill 대상.

### 1-11. Primer React ADRs — GitHub(Primer 디자인 시스템) · 2021~ [열람]

https://github.com/primer/react/tree/main/contributor-docs/adrs · adr-010 원문 열람

- 디자인 시스템 저장소에 `adr-NNN-slug.md` 26개(타입스크립트 · CSS layers · 반응형 값 · 접근성 live region 등). adr-010 은 “Approved ✅ / Adopted ✅” 상태 표기.
- 번호 022 가 두 개(adr-022-css-layer-names, adr-022-styled-react) — 병렬 작성 시 연번 충돌이 실제로 생김.
- 우리: 디자인 시스템이 ADR 을 쓰는 실사례이자, 연번 충돌 실례.

### 1-12. ADR process — AWS Prescriptive Guidance · 2022경(페이지 날짜 미표기) [열람]

https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html

- ADR 은 수락(또는 거절)되면 불변. 바꾸려면 새 ADR 을 만들어 검토 · 수락하고 옛 것을 Superseded 로.
- 거절도 이유를 남겨 같은 논의 반복을 막는다. 코드 리뷰에서 ADR 위반을 링크로 지적.
- 우리: 「반려된 안」 도 기록에 남기면(예: 반려된 로고 · 카드 시안) 재제안이 줄어든다.

### 1-13. Maintain an ADR — Microsoft Azure Well-Architected · 2026-04-10 [열람]

https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record

- “append-only log. Don’t go back and edit accepted records.” 바뀌면 새 기록이 대체하고 둘을 링크.
- “Avoid making decision records design guides” — 결정은 짧고 단독으로 읽혀야 하며, 상세는 링크로.
- 우리: 결정 기록과 디자인 가이드를 섞지 말라는 명시적 문장 — 지금 두 문서가 서로를 반복하는 문제의 처방.

### 1-14. Keep a Changelog 1.1.0 — Olivier Lacan · 2023 [열람]

https://keepachangelog.com/en/1.1.0/

- 사람을 위한 변경 기록. 최신이 위, 날짜, 종류별(Added/Changed/Deprecated/Removed/Fixed/Security), 맨 위 Unreleased.
- 버전마다 항목, 링크 가능한 구조.
- 우리: 「Deprecated / Removed」 를 결정 상태와 별도로 가이드 변경 기록에 쓰면 폐기 규칙 추적이 쉬움.

### 1-15. Semantic Versioning 2.0.0 — Tom Preston-Werner · 2013 [열람]

https://semver.org/

- 출판된 버전의 내용은 바꾸면 안 된다(MUST NOT). 고칠 건 새 버전으로.
- 폐기: 문서 갱신 → 폐기 표시한 minor → 다음 major 에서 제거.
- 우리: 가이드 규칙 폐기도 「표시 → 유예 → 제거」 3단계로.

### 1-16. Architecture decision records overview — Google Cloud Architecture Center · 날짜 미표기 [열람]

https://docs.cloud.google.com/architecture/architecture-decision-records

- 코드 가까이(같은 VCS, md) 둔다. 위키에 미러는 가능.
- 결정을 바꾸면 이전 결정과 바꾼 이유를 기록해 이력 보존.
- 우리: 1-5 · 1-13 과 같은 결론(리포 안, 이력 보존).

### 1-17. architecture-decision-record — Joel Parker Henderson(GitHub) · 상시 [열람]

https://github.com/joelparkerhenderson/architecture-decision-record

- 이상은 불변이지만 “실무에선 가변이 더 잘 됐다” — 새 사실은 날짜를 달아 기존 ADR 에 덧붙이고, 결정이 바뀌면 새 ADR.
- 폴더 이름을 “decisions” 로 하면 더 넓은 결정이 기록된다. 결정마다 담당자 · 연 1회 검토 · 한 달 뒤 결과 점검.
- 우리: 「날짜 붙인 보충」 과 「새 결정」 의 경계를 정하는 실무 기준.

### 1-18. adr-tools — Nat Pryce · 2016~ [열람]

https://github.com/npryce/adr-tools

- `adr new -s 9 제목` 이 새 ADR 을 만들고 9번의 상태를 자동으로 “superseded by” 로 바꾼다.
- ADR 하나 = md 파일 하나, 번호 자동.
- 우리: 대체 링크 양방향 갱신을 사람 · 에이전트 기억에 맡기지 말고 스크립트/검사로 강제할 수 있다는 근거.

### 1-19. Design Decision Log — Microsoft Code-With Engineering Playbook · 상시 [열람]

https://microsoft.github.io/code-with-engineering-playbook/design/design-reviews/decision-log/

- 결정 상세는 ADR 파일 각각, `decision-log.md` 는 요약 표(색인)로 함께 쓴다.
- 여러 사람이 동시에 ADR 을 시작하면 연번이 충돌하므로 작업 항목 ID 를 번호로 쓰라.
- 우리: 「색인 표 1개 + 결정 파일 여러 개」 구조와 동시 세션 번호 충돌 대책.

### 1-20. Design system decision records — ThoughtWorks Technology Radar · 2023-09 Assess [열람]

https://www.thoughtworks.com/radar/techniques/design-system-decision-records

- ADR 형식을 디자인 시스템 결정(근거 · 리서치 · 실험 결과)에 적용.
- 온보딩 시간 단축 · 대화 진척 · 같은 디자인 시스템을 쓰는 작업 흐름 정렬. 현재 판엔 없음(Assess 에서 멈춤).
- 우리: 「디자인 결정 기록」 의 공식적 이름과 사례. 단 Assess 라 근거 강도는 중간.

### 1-21. Capturing your design system decisions — zeroheight · 날짜 미상 [실패 → 검색만]

https://zeroheight.com/?p=6962 (홈으로 리디렉트)

- (검색 요약) 제목 · 상태 · 날짜 · 작성자 · 맥락 · 결정 · 결과 · compliance 칸, 토큰 결정 예시.
- 본문 미확인.
- 우리: 참고만(미확인).

### 1-22. One Size Fits All? An Empirical Comparison of ADR Templates — Nogueira · Silva · Conte · 2026-04 (arXiv 2604.27333) [열람]

https://arxiv.org/abs/2604.27333

- Tyree/Akerman · Nygard · arc42 · Y-statement · MADR 5종을 비교, 전문가 선별에서 Nygard · MADR 상위, 학생 실험에선 Nygard 가 종합 점수 우세.
- Nygard 는 간결 · 객관, MADR 은 구조적 상세로 선호.
- 우리: 결정 기록 형식은 Nygard 최소형 + 필요 시 MADR 칸 추가가 합리적(단 피험자 학생 · 동료 심사 전).

### 1-23. Architecture Decisions: Demystifying Architecture — Jeff Tyree · Art Akerman, IEEE Software 22(2) · 2005 [검색만]

https://ieeexplore.ieee.org/document/1407822

- 주요 결정을 명시적으로 문서화하면 이유가 모든 이해관계자에게 투명해진다(초록).
- 템플릿 칸 상세는 미확인.
- 우리: ADR 계보의 출발점 인용용(본문 미확인).

### 1-24. Software Architecture as a Set of Architectural Design Decisions — Jansen · Bosch, WICSA · 2005 [검색만]

(원문 미열람, 인용 출처 https://arxiv.org/pdf/1704.04798 검색 요약)

- 결정 이유가 머릿속에만 있으면 사라진다(knowledge vaporization) → 유지 비용 증가 · 아키텍처 침식.
- 이후 ISO/IEC/IEEE 42010 에 반영(2차 출처).
- 우리: 「대화 · 세션에서만 내린 결정」 이 증발하는 문제의 학술 용어.

---

## 2. 문서 체계

### 2-1. Diátaxis — Daniele Procida · 2017~ [열람: start-here · colophon]

https://diataxis.fr/start-here/ · https://diataxis.fr/colophon/

- 문서는 튜토리얼 · 방법 안내 · 참조 · 설명 넷이고, 축은 행동↔인지 · 학습↔작업. “경계를 넘거나 흐리는 것이 수많은 문서 문제의 핵심.”
- 참조는 중립적 사실만, 설명(왜)은 따로. 작가는 Procida(Divio 시절 2014–2021 초판).
- 우리: 가이드 = 참조(토큰 · 부품 규격) + 방법(확인 절차), 결정 기록 = 설명. 섞인 160KB 를 이 축으로 자른다.

### 2-2. The documentation system — Divio · 2017~ [열람]

https://docs.divio.com/documentation-system/

- 같은 4분류(튜토리얼 · how-to · 참조 · 설명), 각각 다른 쓰기 방식.
- 페이지 머리에 David Laing 의 인용 “The Grand Unified Theory of Documentation”. 페이지 자체엔 저자 표기 없음(Procida 원작임은 Diátaxis colophon 기준).
- 우리: 2-1 의 전신. 인용 시 Diátaxis 를 쓴다.

### 2-3. Documentation Best Practices — Google styleguide(docguide) · 상시 [열람]

https://google.github.io/styleguide/docguide/best_practices.html

- Minimum viable documentation: 작고 정확한 문서가 크고 방치된 문서보다 낫다, “alive but frequently trimmed”.
- 문서는 코드와 같은 CL 에서 갱신. 죽은 문서는 지운다(애매하면 삭제, 기록에서 복구 가능). 중복 작성 말고 링크.
- 우리: 폐기 규칙은 가이드에서 지우고 git 기록에 맡긴다(결정 기록에는 superseded 로 남김).

### 2-4. Google developer documentation style guide — Highlights · Google · 상시 [열람]

https://developers.google.com/style/highlights

- 2인칭 · 능동태, 문장형 대소문자 제목, 순서는 번호 목록 · 그 외 글머리, 짝 데이터는 설명 목록.
- 코드는 코드 글꼴, UI 는 굵게, 명확한 날짜 형식.
- 우리: 문체 규칙은 별도 짧은 문서로(가이드 본문과 분리).

### 2-5. Microsoft Writing Style Guide — Top 10 tips · Microsoft · 2026-07 [열람]

https://learn.microsoft.com/en-us/style-guide/top-10-tips-style-voice

- “Shorter is always better.” 중요한 것을 앞에, 키워드 먼저(스캔), 필요한 만큼만.
- 문장은 동사로 시작, “there is” 같은 약한 표현 제거.
- 우리: 규칙 한 줄은 「무엇을 한다/안 한다」 동사로 시작 — 에이전트가 따르기 쉬움.

### 2-6. Docs as Code — Write the Docs · 상시 [열람]

https://www.writethedocs.org/guide/docs-as-code/

- 문서를 코드와 같은 도구로: 이슈 트래커 · Git · 일반 텍스트 마크업 · 코드 리뷰 · 자동 테스트.
- 문서 없는 기능은 병합을 막을 수 있다.
- 우리: 가이드 · 결정 변경도 PR 리뷰 · 자동 검사(prettier · 링크 · 토큰 존재 검사) 대상.

### 2-7. GitLab Handbook (handbook-first / SSOT) — GitLab · 상시 [실패: 내비만 수신] + GitLab docs [열람]

https://handbook.gitlab.com/handbook/company/culture/all-remote/handbook-first/ (본문 미수신) · https://docs.gitlab.com/development/documentation/ (열람)

- (열람) “The GitLab documentation is the single source of truth (SSoT)” — 설정 · 사용 · 문제 해결의 정본은 문서.
- (검색 요약, 미확인) 핸드북에 먼저 쓰고 그다음 공지, 중복 정본 방지.
- 우리: 한 사실의 정본은 한 곳. handbook-first 세부 문구는 미확인.

### 2-8. Docs for Developers — Bhatti · Corleissen · Lambourne · Nuñez · Waterhouse, Apress · 2021(2판은 AI 내용 추가) [열람: 책 사이트]

https://docsfordevelopers.com/

- 가상의 팀이 제품을 내며 문서를 만들고 · 측정하고 · 유지하는 흐름으로 구성.
- 목차 · 유지/폐기 장 본문은 미확인.
- 우리: 「측정 · 유지」 가 문서 수명의 일부라는 근거(세부 미확인).

### 2-9. llms.txt — Jeremy Howard(Answer.AI) · 2024-09-03(v2 2026-08) [열람]

https://llmstxt.org/

- 에이전트용 짧은 색인 md: H1 이름(필수) · 인용 요약 · H2 링크 목록 · “Optional” 절(생략 가능).
- 작은 파일을 먼저 읽고 필요할 때만 링크를 따라가게.
- 우리: AGENTS.md · 가이드 README 를 「색인 + 링크」 로 두고 본문은 필요할 때만 읽히는 구조의 형식 근거.

### 2-10. AGENTS.md — Agentic AI Foundation(Linux Foundation), OpenAI 등 공동 · 2025~ [열람]

https://agents.md/

- 에이전트용 README. 권장 내용: 개요 · 빌드/테스트 명령 · 코드 스타일 · 테스트 · 보안 · PR 규칙. 필수 칸 없음.
- 하위 폴더마다 둘 수 있고 가장 가까운 파일이 우선, 채팅 지시가 모든 파일보다 우선. 6만+ 저장소.
- 우리: 공통 규칙은 루트, 영역 규칙(예: 채보 에디터 · admin)은 해당 폴더 AGENTS.md 로 나누는 근거.

### 2-11. How Claude remembers your project (CLAUDE.md) — Anthropic Claude Code docs · 2026 [열람]

https://code.claude.com/docs/en/memory

- “target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence.” @import 는 정리용일 뿐 컨텍스트 비용을 줄이지 않는다.
- 두 지시가 모순되면 “Claude may pick one arbitrarily” → 주기적으로 모순 · 낡은 지시 제거(/doctor prompt-audit). 영역 규칙은 `.claude/rules/` 의 paths 범위 규칙으로.
- 우리: AGENTS.md 에서 160KB 가이드를 통째 import 하면 안 된다 · 모순 제거가 곧 준수율 문제라는 공식 근거.

### 2-12. Best practices for Claude Code — Anthropic · 2026 [열람]

https://code.claude.com/docs/en/best-practices

- 한 줄마다 “지우면 Claude 가 실수하나?” 를 묻고 아니면 삭제. 코드로 알 수 있는 것 · 자주 바뀌는 정보 · 긴 설명은 넣지 않는다. 과도한 CLAUDE.md 는 규칙을 묻히게 한다.
- 꼭 지켜야 하는 것은 hook(결정적), 가끔 필요한 지식은 skill. 병렬 세션은 worktree 로 격리해 편집 충돌 방지.
- 우리: 「반드시」 규칙(시크릿 · 운영 DB · git 금지)은 문서보다 hook/권한으로, 디자인 세부는 필요 시 읽는 문서로.

### 2-13. Custom instructions with AGENTS.md — OpenAI Codex docs · 2026 [열람]

https://learn.chatgpt.com/docs/agent-configuration/agents-md

- 전역 → 루트 → 현재 폴더 순으로 이어 붙이고, 가까운 파일이 나중에 와서 우선. 같은 층의 `AGENTS.override.md` 가 우선.
- 합계 상한 `project_doc_max_bytes` 기본 32 KiB, 넘으면 잘림 → 하위 폴더로 나누라.
- 우리: 지시 파일 총량 상한(32KiB)이라는 구체 수치 — 160KB 가이드는 지시 파일이 될 수 없다.

### 2-14. Effective context engineering for AI agents — Anthropic Engineering · 2025-09-29 [열람]

https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

- 컨텍스트가 길수록 회상 정확도가 떨어진다(context rot). 원하는 결과를 낼 최소 고신호 토큰.
- 다 미리 싣지 말고 경로 · 식별자만 두고 필요할 때 읽게(just-in-time). 긴 작업은 외부 노트에 구조적으로 기록.
- 우리: 가이드는 「색인 → 필요한 절만 읽기」 구조여야 한다는 근거.

---

## 3. 디자인 시스템 이론

### 3-1. Atomic Design ch.2 — Brad Frost · 2016 [열람]

https://atomicdesign.bradfrost.com/chapter-2/

- 원자 · 분자 · 유기체 · 템플릿 · 페이지 5단계.
- “atomic design is not a linear process” — 전체와 부분을 동시에 보는 사고 모델.
- 우리: 가이드 층(토큰 → 부품 → 패턴 → 페이지 규칙) 나누기의 표준 어휘.

### 3-2. The Design System Ecosystem — Brad Frost · 2023-09-21 [열람]

https://bradfrost.com/blog/post/the-design-system-ecosystem/

- 핵심 시스템(토큰 · 아이콘 · 공용 부품) / 제품별 recipe / 일회성 snowflake. 문서는 Storybook(코드 부품) + 참조 사이트로 분산.
- 대부분 층은 선택, Gall 의 법칙대로 점진 성장.
- 우리: `components/ui`(core) · `features/*/components`(recipe) 구분을 가이드 구조에 그대로 반영.

### 3-3. Tokens in Design Systems — Nathan Curtis(EightShapes) · 2016경 [열람: readmedium 미러, Medium 원문 403]

https://readmedium.com/tokens-in-design-systems-25dd82d58421

- 옵션(쓸 수 있는 값) → 결정(맥락에 적용) 순서로 정리. 변수만으로는 “무엇을 고를지” 를 답하지 못함.
- 10가지 팁: 큐레이터가 관리, 세 번 쓰이면 토큰 후보, 토큰 데이터에서 문서를 생성하라.
- 우리: 토큰 표는 손으로 쓴 가이드가 아니라 tokens.css 에서 생성/참조해야 이중 정본이 안 생긴다.

### 3-4. Defining Design System Contributions — Nathan Curtis · 날짜 미표기 [열람: 미러]

https://readmedium.com/defining-design-system-contributions-eb48e00e8898

- 기여 크기: 수정 · 작은 개선 · 큰 개선 · 새 기능. 단계 propose → design → code → doc → release.
- 작은 건 빠르게 일부 단계만, 큰 건 전 단계 · 중앙 팀이 더 깊이 관여.
- 우리: 에이전트 작업도 크기별 절차를 다르게(오타/값 수정은 바로, 새 부품 · 토큰은 시안 → 결정 기록).

### 3-5. Documenting Components — Nathan Curtis · 날짜 미표기 [열람: 미러]

https://readmedium.com/documenting-components-9fe59b80c015

- 부품 문서 순서: 소개 → 예시(코드 렌더) → 디자인 지침(쓰임 · Do/Don’t) → 코드 참조(props).
- 디자인 · 코드 문서를 분리하면 이름 · 기능이 어긋날 위험 → 한 페이지에 엮으면 단일 정본(대신 길어짐). 부품마다 같은 순서.
- 우리: 부품 절은 `docs/ui` + Storybook 하나로 합치고 가이드에 반복하지 않는다.

### 3-6. Design Systems — Alla Kholmatova, Smashing Magazine · 2017 [열람: 책 소개]

https://www.smashingmagazine.com/design-systems-book/

- 기능 패턴(버튼 · 폼) vs 지각 패턴(색 · 글꼴 · 아이콘), 공유 언어.
- 시스템은 제품과 함께 진화해야 하며 낡고 비대해지지 않게 유지 과정이 필요.
- 우리: 엄격/느슨 · 중앙/분산 구분 장은 책 소개에 없어 미확인.

### 3-7. Design Tokens Format Module 2025.10 (첫 안정판) — W3C Design Tokens Community Group · 2025-10-28 [열람]

https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/

- 2025.10 = 첫 안정판. 벤더 중립 포맷, 테마(라이트/다크 · 접근성 · 브랜드), Display P3 · OKLCH, 별칭 · 상속.
- W3C Community Group 보고서 — W3C 정식 표준(Recommendation)은 아님.
- 우리: 「안정판 있음」 은 사실이나 표준 지위는 CG 수준. 우리 tokens.css 를 이 형식으로 바꿀 의무는 없음.

### 3-8. Design Tokens Format Module (draft) — DTCG · 2026-09-08 초안 [열람]

https://www.designtokens.org/tr/drafts/format/

- 토큰 = `$value` 필수 + `$type` · `$description` · `$deprecated`(true 또는 이유 문자열). 별칭 `{group.token}`.
- 이 초안은 구현하지 말라고 명시, 최신 공개판은 2025.10.
- 우리: 토큰에 「폐기 + 이유」 를 데이터로 붙이는 `$deprecated` 개념 — 폐기 토큰을 가이드 산문이 아니라 토큰 옆에 표기.

### 3-9. Smashing Podcast Ep.3 — What Are Design Tokens? — Jina Anne · Drew McLellan · 2019-11-19 [열람]

https://smashingmagazine.com/2019/11/smashing-podcast-episode-3/

- 토큰 = 시각 결정에 붙인 이름, 값 아닌 목적으로 이름 짓기. Salesforce 에서 YAML 하나로 스타일가이드와 Sass 를 생성한 데서 출발(Theo).
- 토큰 세트가 정본, 한 번 고치면 모든 플랫폼에 전파. 단 모든 프로젝트에 필요한 건 아님.
- 우리: 「토큰 파일 = 정본, 문서는 파생」.

### 3-10. Salesforce Styling Hooks — Salesforce Developers · 상시 [실패(403) → 검색만]

https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/styling_hooks.htm

- (검색 요약) 디자인 토큰을 동결하고 CSS 사용자 속성(global styling hooks, `--slds-g-*`)으로 이전, LWC API 61 이후 토큰 갱신 없음.
- 전역/별칭/부품 3계층 설명은 확인 못 함(미확인).
- 우리: 큰 시스템도 토큰 체계를 「폐기 → 대체」 로 옮긴다는 사례(세부 미확인).

### 3-11. Design Systems Handbook — Suarez · Anne · Sylor-Miller · Mounter · Stanfield, InVision DesignBetter · 2017 [열람: 소개 페이지, 본문 유료]

https://designbetterpodcast.com/p/design-systems-handbook

- 7장: 소개 · 설계 · 구축 · 실무 적용 · 확장(거버넌스) · 미래(토큰) · 부록.
- 문서 · 거버넌스 구체 조언은 유료 본문이라 미확인.
- 우리: 장 구성만 참고.

### 3-12. Design Systems Survey 2022 (5판) — Sparkbox · 2022 [열람]

https://designsystemssurvey.sparkbox.com/

- 구독자 39% 「문서가 부실」 이 최대 난제, 35% 「무엇이 낡았고 · 고장났고 · 곧 나오는지 불분명」. 상위 패턴의 이유가 문서에 없어 쓸지 말지 판단이 어렵다는 응답.
- 거버넌스 · 로드맵 있음 44%, 기여 절차 없음 36%. 성공한 시스템은 「무엇을 추가 · 갱신 · 제거할지 결정하는 관행」 78%.
- 우리: 「폐기된 규칙이 섞여 무엇이 현재인지 모름」 이 업계 공통 1–2위 문제라는 수치.

### 3-13. Design Systems Report 2025 — zeroheight · 2025 [열람]

https://zeroheight.com/how-we-document

- 294명. 토큰 도입 56% → 84%. 68% 가 여러 곳에 문서화, UI 패턴 문서화 64% 뿐.
- AI 는 문서 작성이 최다 용도지만 핵심 지침 작성엔 부적합, 템플릿 · 요약에 적합하다는 평가. 가벼운 「딱 필요한 만큼」 거버넌스가 잘 됨.
- 우리: 「여러 곳 문서화」 가 다수 현실이지만 그게 충돌 원인 — 정본 지정이 필요.

### 3-14. Design Systems 101 — Therese Fessenden, NN/g · 2021-04-11(검토 2026-08) [열람]

https://www.nngroup.com/articles/design-systems-101/

- 디자인 시스템 = 스타일 가이드 + 부품 라이브러리 + 패턴 라이브러리.
- 사용 지침이 없으면 일관성 없이 적용된다. 최소 유지 인력 제시(근거 데이터 없음).
- 우리: 가이드 3분할(스타일 · 부품 · 패턴)의 일반 어휘.

---

## 4. 사용성 · 시각 근거

### 4-1. 10 Usability Heuristics — Jakob Nielsen, NN/g · 1994(검토 2024-01-30) [열람]

https://www.nngroup.com/articles/ten-usability-heuristics/

- #4 일관성과 표준(제품 내 · 플랫폼 관례), #8 미적 · 미니멀(덜 필요한 내용 제거).
- #10 도움말은 찾기 쉽고 과업 중심 · 간결하게.
- 우리: 규칙 문서도 #10 그대로 — 과업(「페이지를 만들 때」) 단위로 찾게.

### 4-2. Cards: UI-Component Definition — Page Laubheimer, NN/g · 2016-11-06 [열람]

https://www.nngroup.com/articles/cards-component/

- 카드는 이질적 내용 · 둘러보기에 적합, 동질 항목 · 검색 · 비교엔 목록이 낫다(“less scannable than lists”).
- 비교할 항목은 일관된 구조로.
- 우리: 기록 · 랭킹(동질 · 비교) 화면의 목록 우선 규칙 근거.

### 4-3. Data Tables: Four Major User Tasks — Page Laubheimer, NN/g · 2022-04-03 [열람]

https://www.nngroup.com/articles/data-tables/

- 화면보다 큰 표는 머리 행 · 열 고정, 정렬 쉽게, 줄무늬 · 행 강조로 위치 유지.
- 첫 열은 사람이 읽는 식별자, 관련 열은 붙여 둔다. 정렬 · 밀도 상세 수치는 없음.
- 우리: 랭킹 표 규칙의 근거(정렬 · 밀도 수치는 이 글에 없음).

### 4-4. How to Make Navigation (Even a Hamburger) Discoverable on Mobile — Pernice · Budiu, NN/g · 2016-07-24 [열람]

https://www.nngroup.com/articles/find-navigation-mobile-even-hamburger/

- 179명. 숨긴 내비는 데스크톱 · 모바일 모두 경험을 낮추나 모바일은 덜하다. 보이는+숨긴 조합이 최선.
- 숨길 거면 로고와 구분 · 눌러질 듯 · 대비 높은 라벨.
- 우리: 폰 우선 하단 내비 · 메뉴 규칙의 근거.

### 4-5. Visual Hierarchy in UX — Kelley Gordon, NN/g · 2021-01-17 [열람]

https://www.nngroup.com/articles/visual-hierarchy-ux-definition/

- 도구: 색 · 대비, 크기, 묶기(근접 · 공통 영역). 크기 3단 이하, 큰 요소 2개 이하, 대비 처리 3종 이하 권장.
- squint test 로 검증, 컨테이너는 아껴 쓴다.
- 우리: 가이드의 위계 규칙(글자 크기 단계 · 카드 남용 금지)에 대는 실무 기준.

### 4-6. UX Debt — Anna Kaley, NN/g · 2018-11-11 [열람]

https://www.nngroup.com/articles/ux-debt/

- UX 부채 = 빠르고 쉬운 해법이 남긴 경험 문제의 누적. 원인에 스타일 가이드 무시 · 약한 문서화 · 의도치 않은 UI 불일치.
- 목록화 → 영향 · 빈도로 점수화 → 스프린트마다 일부 상환.
- 우리: 「가이드와 코드가 어긋난 곳」 을 부채 목록으로 관리하는 방식.

### 4-7. Laws of UX — Jon Yablonski · 상시 [열람: 목록]

https://lawsofux.com/

- 30개 법칙(피츠 · 힉 · 근접 · 공통 영역 · 유사성 · 밀러 · 제이콥 · 테슬러 등).
- 저자 · 출처 페이지는 404 로 확인 못 함(저자명은 일반 지식, 미확인).
- 우리: 용어 사전 용도로만. 근거는 원 논문으로 댄다.

### 4-8. The Information Capacity of the Human Motor System… — Paul M. Fitts, J. Exp. Psychol. 47(6) 381–391 · 1954 [열람: APA 재수록 PDF]

https://www.cs.princeton.edu/courses/archive/fall08/cos436/FittsJEP1954.pdf

- 왕복 두드리기 실험(16명, 표적 폭 0.25–2in · 거리 2–16in): 난이도 지수 Id = log2(2A/W) 에 비례해 시간이 늘고 정보 처리율은 대략 일정.
- 운동계의 채널 용량은 진폭 · 허용 오차와 무관하게 일정하다는 가설을 검증.
- 우리: 터치 표적 크기 · 거리 규칙의 원 근거(WCAG 2.5.8 과 함께).

### 4-9. On the Rate of Gain of Information — W. E. Hick, Q. J. Exp. Psychol. 4(1) 11–26 · 1952 [검색만]

https://journals.sagepub.com/doi/10.1080/17470215208416600

- (2차 요약) 선택지 수의 로그에 비례해 반응 시간 증가.
- 원문 미열람(유료) — 수치 미확인.
- 우리: 탭 · 필터 수를 줄이는 근거로 쓰되 2차 출처임을 밝힌다.

### 4-10. A Century of Gestalt Psychology in Visual Perception I — Wagemans 외, Psychological Bulletin 138(6) · 2012 [열람]

https://pmc.ncbi.nlm.nih.gov/articles/PMC3482144/

- 근접 · 유사성 · 공통 운명 · 연결성 · 공통 영역(Palmer 1992)은 실험 근거가 강하고 근접과 유사성은 가산적으로 결합.
- 균일 연결성의 기초성 등 일부는 논쟁 중.
- 우리: 간격 · 묶음 규칙(공통 영역 = 카드/면, 근접 = 간격 토큰)의 학술 근거.

### 4-11. WCAG 2.2 — W3C Recommendation · 2024-12-12 [열람] + Understanding 2.5.8 [열람]

https://www.w3.org/TR/WCAG22/ · https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

- 1.4.3 글자 4.5:1(큰 글자 3:1), 1.4.11 비텍스트 3:1, 2.4.11 포커스 가림 금지(신규).
- 2.5.8 표적 최소 24×24 CSS px(간격 · 동등 · 인라인 · UA · 필수 예외).
- 우리: 대비 · 표적 규칙의 규범적 기준은 여전히 WCAG 2.2.

### 4-12. WCAG 3.0 Working Draft — W3C · 2026-09-10 [열람]

https://www.w3.org/TR/wcag-3.0/

- 대비 측정법은 “to be determined”, APCA 언급 없음.
- 크기 · 굵기 요소가 들어갈 것으로 가정.
- 우리: APCA 를 「WCAG 3 기준」 이라 부르면 틀림 — 가이드에서 그런 표현 금지.

### 4-13. SAPC-APCA — Myndex Research(Andrew Somers) · 상시 [열람]

https://github.com/Myndex/SAPC-APCA

- 자체 발광 화면용 지각 대비 예측 알고리즘, WCAG 3 를 겨냥.
- 판독 기준(Bronze/Silver/Gold)은 W3C 가 아닌 비영리 단체의 초안. Lc 수치는 이 페이지에 없음.
- 우리: 다크 테마 보조 지표로만, 규범은 WCAG 2.2.

### 4-14. Mobile UX benchmark — Baymard Institute · 2024-05(갱신 2026-07) [열람]

https://baymard.com/blog/mobile-ux-ecommerce

- 150+ 모바일 사이트 · 71,000+ 요소 평가, 약 75% 「보통」. 450+ 모바일 가이드라인.
- 현재 카테고리 강조, 적용된 필터를 목록 위에 표시 등.
- 우리: 필터 칩 · 현재 위치 표시 규칙의 대규모 근거(전자상거래 맥락 주의).

### 4-15. Expressive Design: Google’s UX Research (M3 Expressive) — Google Design · 2025(추정) [열람]

https://design.google/library/expressive-material-design-google-research

- 46개 연구 · 18,000+명, 핵심 요소를 최대 4배 빨리 찾음, 18–24세 선호 최대 87%.
- 관례를 깨면(목록 없앤 재생목록, 라벨 없는 아이콘) 사용성 하락, 은행 같은 맥락엔 부적합. 자사 연구 · 세부 표본 미공개.
- 우리: 「표현성」 근거로 쓸 땐 관례 파괴 금지 조건을 함께 인용.

### 4-16. Understanding and Supporting the Design Systems Practice — Yassine Lamine · Jinghui Cheng · 2022 (arXiv 2205.10713, EMSE) [열람]

https://arxiv.org/abs/2205.10713

- 경험 많은 실무자 9명 인터뷰: 안정된 설계 지식과 제품별 유연성 사이 진화가 어렵다.
- 리더들은 제품에서 부품을 끌어올리는 상향식 생성 · 유지를 선호.
- 우리: 「규칙을 위에서 다 정하기」 보다 실제 화면에서 반복된 것을 공용으로 승격하는 흐름(Frost recipe 와 같은 결론).

### 4-17. How Software Engineers Use Documentation: The State of the Practice — Lethbridge · Singer · Forward, IEEE Software · 2003 [열람: PDF]

https://courses.cs.duke.edu//cps196.1/fall11/classwork/Lethbridge-Singer-Forward-2003.pdf

- 문서는 갱신되지 않는 경우가 많고(“always outdated” 동의 68%), 문서가 너무 많고 상당 부분 신뢰할 수 없다.
- 그래도 낡은 문서도 유용(81%). 추상적인 아키텍처 문서일수록 오래 유효, 코드에 가까울수록 정확해야 쓰인다.
- 우리: 「이유 · 원칙」 문서는 오래 가고 「값 · 수치」 문서는 금방 낡는다 → 값은 코드가 정본.

### 4-18. Software Documentation Issues Unveiled — Aghajani 외, ICSE 2019 [검색만]

https://2019.icse-conferences.org/details/icse-2019-Technical-Papers/49/Software-Documentation-Issues-Unveiled

- 878개 산출물 분석으로 문서 문제 분류 체계(정보 내용의 정확성 · 최신성 등).
- 원문 미열람, 분류 세부 미확인.
- 우리: 문서 부패 분류의 표준 인용(세부 미확인).

### 4-19. Software Documentation: The Practitioners’ Perspective — Aghajani 외, ICSE 2020 [실패(403) → 검색만]

https://www.inf.usi.ch/faculty/lanza/PUBS/P/Agha2020a.pdf

- 실무자 146명 설문으로 문서 문제의 중요도와 과업별 문서 유형 조사.
- 결과 수치 미확인.
- 우리: 인용 시 서지만.

### 4-20. A Large-Scale Empirical Study on Code-Comment Inconsistencies — Wen · Nagy · Bavota · Lanza, ICPC 2019 [검색만]

https://www.inf.usi.ch/faculty/lanza/PUBS/P/Wen2019a.pdf

- 1,500개 시스템 · 13억 AST 변경에서 코드 변경이 주석 갱신을 얼마나 유발하는지 조사, 불일치 분류.
- 수치 결론 미확인.
- 우리: 「코드 바뀌면 설명이 따라가지 않는다」 의 대규모 근거(세부 미확인).

### 4-21. Detecting Outdated Code Element References in Software Repository Documentation — Tan · Wagner · Treude, EMSE · 2024(arXiv 2212.01479) / Wait, wasn’t that code here before? — 같은 저자 · 2023 (arXiv 2307.04291) [후자 열람, 전자 검색만]

https://arxiv.org/abs/2307.04291

- 상위 1,000 GitHub 프로젝트의 4분의 1 이상이 이미 지워진 코드 요소를 문서에서 참조.
- PR 마다 GitHub Actions 로 낡은 참조를 검사하는 도구.
- 우리: 가이드에 적힌 클래스 · 토큰 · 파일 이름이 실제로 존재하는지 CI/테스트로 검사하자는 근거.

### 4-22. UX Debt: Developers Borrow While Users Pay — Baltes · Dashuber, CHASE 2024 (arXiv 2104.06908) [열람]

https://arxiv.org/abs/2104.06908

- UX 부채 = 개발 속도를 위해 사용자 효율을 빌림. 코드 · 아키텍처 · 프로세스 중심 3종.
- 전문가 설문에서 코드 · 프로세스 중심이 가장 지지됨.
- 우리: 「design debt」 의 학술 대응어는 UX debt — 가이드 용어로 쓸 때 이 정의.

### 4-23. Who is to Blame: …Designer-Developer Collaboration — Zhang · Zhang · Cheng · Zhou · 2025 (arXiv 2501.11748) [열람]

https://arxiv.org/abs/2501.11748

- 2004년 이후 45편 체계적 문헌 검토 → 협업 난제 3가지 · 모범 관행 2범주.
- 초록엔 디자인 시스템 · 문서 직접 언급 없음.
- 우리: 디자이너↔개발자 인계 문제 일반 근거(세부 미확인).

### 4-24. Design-System-Aware Development with AI — Silva · Rocha · Davila · Pinto, SBES Industry 2026 (arXiv 2607.13156) [열람]

https://arxiv.org/abs/2607.13156

- 대기업 통제 실험: DS 인지 AI 보조가 납기 46.7–69.4% 단축, 완성도 상승 · 편차 감소.
- AI 에 DS 지식을 어떻게 줬는지는 초록에 없음.
- 우리: 에이전트에게 디자인 시스템을 「구조화해서」 주면 효과가 있다는 근거(방식 미확인).

### 4-25. “A Second Set of Eyes”: Software Documentation Review — Bhat · Arawjo · Shrivastava · Guo, GROUP 2027 (arXiv 2608.26232) · 2026 [열람]

https://arxiv.org/abs/2608.26232

- 테크니컬 라이터 31명: 자체 · 기술 · 편집 · 실사용 · 게시 후 피드백 5단계 검토.
- 전문 검토자 확보 · 개발 일정 · 문서용이 아닌 도구가 난제.
- 우리: 문서 변경에도 「기술 검토(코드와 맞나)」 와 「편집 검토(중복 · 모순)」 를 나눠 거치게.

### 4-26. On the Use of Agentic Coding Manifests: An Empirical Study of Claude Code — Chatlatanagulchai 외 · 2025-09 (arXiv 2509.14744) [열람]

https://arxiv.org/abs/2509.14744

- 242개 저장소의 CLAUDE.md 253개: 얕은 구조(제목 하나 + 하위 절 몇 개).
- 내용은 실행 명령 · 구현 메모 · 상위 아키텍처 중심.
- 우리: 지시 파일은 얕고 명령 중심이 일반형.

### 4-27. Evaluating AGENTS.md — Gloaguen · Mündler-Sasahara · Müller · Raychev · Vechev(ETH) · 2026 (arXiv 2602.11988, ICLR 2026) [열람]

https://arxiv.org/abs/2602.11988

- 컨텍스트 파일이 과제 성공률을 대체로 올리지 않고 추론 비용을 평균 20% 넘게 올림. 저장소 개요는 도움이 안 됨.
- 에이전트는 지시를 잘 따르므로 「비표준 관행」 지정에만 쓰라.
- 우리: AGENTS.md 에 개요 · 설명을 늘리지 말고 「코드로 알 수 없는 규칙」 만.

### 4-28. On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents — Lulla · Mohsenimofidi · Galster · Zhang · Baltes · Treude · 2026 (arXiv 2601.20404) [열람]

https://arxiv.org/abs/2601.20404

- 10개 저장소 · 124 PR: AGENTS.md 있으면 중앙 실행 시간 28.64% · 출력 토큰 16.58% 감소, 완료율 비슷.
- 저장소 단위 지시의 효과는 아직 연구 초기.
- 우리: 4-27 과 결론이 엇갈림 — 「짧고 구체적인」 파일만 이득이라는 공통 해석.

---

## 5. 구현 · 코드 쪽

### 5-1. CUBE CSS — Andy Bell · 2020~ [열람]

https://cube.fyi/

- Composition · Utility · Block · Exception. 단순 · 실용 · 일관, 매체(CSS 캐스케이드)와 함께 일한다.
- 저자명은 페이지에 없음(일반 지식, 미확인).
- 우리: 공용 스타일 → 레이아웃 조합 → 유틸 → 블록 → 예외 순서가 가이드 「예외는 예외 층에만」 규칙과 대응.

### 5-2. ITCSS — Harry Roberts(설명: Xfive) · 2016경 [열람]

https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/

- Settings → Tools → Generic → Elements → Objects → Components → Utilities. 아래로 갈수록 명시성 · 특이성 증가, 영향 범위 감소.
- 모든 층이 필요하진 않지만 순서는 지킨다.
- 우리: tokens.css(Settings) → foundation.css(Generic/Elements) → 공용 부품 → 페이지 css 순서를 가이드에 명문화.

### 5-3. Every Layout — Axioms — Heydon Pickering · Andy Bell · 2019~ [열람]

https://every-layout.dev/rudiments/axioms/

- 공리(예: 「measure 는 60ch 를 넘지 않는다」)를 예외 없이 전역에 적용, `--measure` 같은 사용자 속성으로.
- “the browser’s mentor, rather than its micro-manager.”
- 우리: 가이드 규칙을 「값 나열」 이 아니라 소수의 공리 + 토큰으로 쓰는 문체 근거.

### 5-4. Theme variables — Tailwind CSS v4 docs · 2025~ [열람]

https://tailwindcss.com/docs/theme

- `@theme` 변수는 유틸 생성, `:root` 는 생성 안 함. 네임스페이스(`--color-*` 등)별 유틸.
- `--*: initial` 로 기본 테마 제거해 자체 토큰만 유틸로, 공유 파일로 import.
- 우리: 「nl 별칭만 · 기본 스케일 금지」 규칙을 문서가 아니라 `--*: initial` 로 코드에서 강제 가능(현재 설정 여부는 리포 확인 필요).

### 5-5. Next.js Docs 구조 — Vercel · 2026-05 [열람]

https://nextjs.org/docs

- Getting Started(튜토리얼) · Guides(용도별) · API Reference(참조) 3분할 + llms.txt 색인.
- 라우터별(App/Pages) 판을 위에서 전환.
- 우리: Diátaxis 를 실제 대형 프레임워크가 단순화해 쓴 형태 — 우리도 3분할이면 충분.

### 5-6. You Might Not Need an Effect — React docs(react.dev) · 2023~ [열람]

https://react.dev/learn/you-might-not-need-an-effect

- Effect 는 외부 시스템 동기화용 탈출구. 그 외는 렌더 중 계산 · 이벤트 핸들러로.
- 「🔴 피하라 / ✅ 이렇게」 짝 예시 + 요약 + 연습 문제 형식의 원칙 문서.
- 우리: 가이드 규칙 절의 모범 형식 — 원칙 한 줄 + 나쁜 예/좋은 예 짝.

### 5-7. The Standard of Code Review — Google eng-practices · 상시 [열람]

https://google.github.io/eng-practices/review/reviewer/standard.html

- 완벽하지 않아도 전체 코드 건강을 개선하면 승인. 스타일은 스타일 가이드가 최종 권위, 그 밖은 개인 취향.
- 설계는 원칙 · 데이터가 의견보다 우선.
- 우리: 「가이드에 없는 것은 취향」 → 가이드에 없는 시각 결정을 만들지 않는다는 AGENTS 규칙과 정합.

### 5-8. The Rule of Least Power — Tim Berners-Lee · Noah Mendelsohn, W3C TAG Finding · 2006-02-23 [열람]

https://www.w3.org/2001/tag/doc/leastPower.html

- 목적에 맞는 가장 덜 강력한 언어를 쓰라 — 선언적일수록 분석 · 재사용 · 보안이 쉽다.
- 실용적 절충은 인정.
- 우리: 규칙은 산문보다 선언적 데이터(토큰 · 린트 규칙 · 테스트)로 표현하는 쪽을 우선.

### 5-9. gitattributes — merge=union — Git 공식 문서 · 상시 [열람]

https://git-scm.com/docs/gitattributes

- union 드라이버는 충돌 표시 대신 양쪽 줄을 모두 남김.
- “added lines in random order … Do not use this if you do not understand the implications.”
- 우리: 덧붙이기만 하는 로그 파일의 병합 충돌을 줄일 수 있으나 순서가 섞여 날짜순 로그에는 위험.

### 5-10. towncrier — Twisted 프로젝트 · 상시 [열람]

https://towncrier.readthedocs.io/en/stable/

- 변경마다 작은 「news fragment」 파일을 따로 만들고 릴리스 때 합친다.
- 하나의 공유 changelog 를 여럿이 고치지 않아 병합 충돌이 생기지 않음.
- 우리: 결정 기록도 「1건 = 파일 1개」 로 쓰면 동시 세션 충돌이 구조적으로 사라진다.

### 5-11. About code owners — GitHub Docs · 상시 [열람]

https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners

- 파일 · 경로별 책임자 지정, PR 시 자동 리뷰 요청. 여러 패턴이 맞으면 마지막 패턴이 우선.
- 기본 브랜치의 CODEOWNERS 를 읽음.
- 우리: 1인 저장소라 리뷰어는 사용자뿐이지만 「어느 문서가 어느 영역의 정본인가」 를 경로 표로 밝히는 형식으로 차용.

### 5-12. Don’t Build Multi-Agents — Walden Yan, Cognition · 2025-06-12 [열람]

https://cognition.com/blog/dont-build-multi-agents

- 원칙: 맥락 전체를 공유하라, 행동은 암묵적 결정을 담는다 — “Conflicting decisions carry bad results.”
- 병렬 하위 에이전트는 서로 다른 가정으로 일관성 없는 결과(플래피버드 예).
- 우리: 여러 세션이 같은 가이드를 각자 고치면 「암묵적 결정 충돌」 이 생긴다는 직접 근거.

### 5-13. How we built our multi-agent research system — Anthropic Engineering · 2025-06-13 [열람]

https://www.anthropic.com/engineering/multi-agent-research-system

- 하위 에이전트마다 목표 · 출력 형식 · 경계를 명확히 — 없으면 중복 · 누락. 결과는 파일로 남기고 참조만 전달.
- 공유 맥락이 필요하거나 의존이 많은 일(대부분의 코딩)엔 다중 에이전트가 부적합.
- 우리: 문서 편집 작업은 「영역 경계」 를 정해 나눠야 하고, 공유 문서 대량 수정은 한 세션이 맡는 게 낫다.

### 5-14. Material 3 Design tokens — Google · 상시 [실패: JS 전용 페이지]

https://m3.material.io/foundations/design-tokens/overview

- 본문을 받지 못함 — reference/system/component 3계층 설명은 미확인.
- 우리: 인용하지 않는다.

---

## 부록: 열람 실패 · 미확인 목록

- Zimmermann Y-statements(Medium 403) — 형식 문구 미확인.
- Nathan Curtis Medium 원문(403) — readmedium 미러로 대체 열람, 날짜 미확인.
- GitLab handbook handbook-first · values(본문 미수신) — SSOT 는 docs.gitlab.com 으로만 확인.
- Salesforce styling hooks(403) — 3계층 구조 미확인.
- zeroheight DSDR 글(홈으로 리디렉트) — 템플릿 미확인.
- Material 3 tokens(JS 전용) — 미확인.
- Hick 1952 · Aghajani 2019/2020 · Wen 2019 · Tyree/Akerman 2005 · Jansen/Bosch 2005 — 서지만 확인, 본문 수치 미확인.
- Laws of UX 저자 · CUBE CSS 저자 — 페이지에 표기 없음(일반 지식, 미확인).
