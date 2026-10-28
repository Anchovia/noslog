# 조사 H — AI 문서 운영(AGENTS.md · CLAUDE.md · 메모리 · 강제 장치)

조사일 2026-10-24. 네 갈래(공식 문서 40 · 저장소 63 · 사례 51 · 연구 40, 모두 194곳)의 원문 기록이다. 결정은 [AI 문서 운영](../decisions/2026-10-24-ai-docs-ops.md). 원문 사본은 세션 임시 폴더에 두었고 리포에는 없다. 아무것도 설치 · 실행하지 않았다.

정정: D 갈래와 아래 표의 ETH Zürich 2602.11988 「사람이 쓴 파일 +4%」 는 원문 HTML(2026-10-24 확인)에서 「+2.4%, p=21% 로 유의하지 않음」 · LLM 파일 「−0.5% · −2%」 다.

## A. 도구 · 규격 공식 문서

범위: 각 도구 · 표준이 **공식 문서**에서 지시 파일(AGENTS.md · CLAUDE.md · 규칙 파일)을 어떻게 쓰라고 하는지.
방법: WebFetch(공식 문서 본문) · WebSearch(못 연 곳) · `gh api`(저장소). 아무것도 설치 · 실행하지 않음.

- 조사한 문서 40건 · 도구/규격 32곳(열람 31 · 2차/미확인 1).
- 열람 수준: **열람** = 공식 페이지 본문을 읽음(요약 모델 거침) / **일부** = 페이지 일부만 / **2차** = 검색 요약만.
- 숫자는 문서에 있는 그대로. 문서에 없으면 「없음」, 확인 못 했으면 「미확인」.

---

### 1. 표준 · 규격

#### 1-1. AGENTS.md 공식 사이트 — 열람

- URL: https://agents.md/
- 파일: 저장소 루트 `AGENTS.md`. 모노레포는 하위 프로젝트마다 하나씩.
- 우선순위: 「편집하는 파일에 가장 가까운 AGENTS.md 가 이긴다」, 사용자 채팅 지시가 모든 것보다 위.
- 범위 규칙: 디렉터리 중첩만(glob 없음).
- 크기: 권장 · 한도 없음. 필수 필드 없음, 아무 제목이나 쓰는 일반 Markdown.
- 쓰라는 것: 프로젝트 개요, 빌드 · 테스트 명령, 코드 스타일, 테스트 방법, 보안, 커밋 · PR 규칙, 배포 단계. 적어 둔 테스트 명령은 에이전트가 끝내기 전에 돌린다고 설명.
- 쓰지 말라는 것: 명시 목록 없음. 사람용 내용(빠른 시작 · 소개)은 README 로.
- 호환: 지원 도구 목록에 Codex · Jules · Factory · Aider · goose · opencode · Zed · Warp · VS Code · Devin · Junie · Amp · Cursor · RooCode · Gemini CLI · Kilo Code · GitHub Copilot coding agent · Windsurf · Augment Code 등. 이전 방법: `mv AGENT.md AGENTS.md && ln -s AGENTS.md AGENT.md`, Aider 는 `.aider.conf.yml` 에 `read: AGENTS.md`, Gemini CLI 는 `"context": {"fileName": "AGENTS.md"}`.
- 숫자: 「over 60k open-source projects」, OpenAI 메인 저장소에 AGENTS.md 88개.

#### 1-2. openai/agents.md 저장소 — 열람(README · 메타데이터)

- URL: https://github.com/openai/agents.md
- README: 「README for agents」, 예시는 Dev environment tips · Testing instructions · PR instructions 세 절의 짧은 파일. 별 25,076(gh api, 2026-10-24 조회), 저장소에 `Technical_Charter.pdf` 있음.

#### 1-3. Agentic AI Foundation(AAIF) 발표 — 2차

- URL: https://openai.com/blog/agentic-ai-foundation (검색 요약)
- 2025-12-09 Linux Foundation 아래 AAIF 출범, OpenAI 가 AGENTS.md 를, Anthropic 이 MCP 를 기증. AGENTS.md 는 2025년 8월 공개 후 6만 곳 이상 채택(OpenAI 주장).

#### 1-4. Agent Skills 규격 — 열람

- URL: https://agentskills.io/ · https://agentskills.io/specification.md
- 파일: `<skill-name>/SKILL.md`(+ `scripts/` · `references/` · `assets/`). Anthropic 이 만들어 공개 표준으로 냄.
- 로딩: 점진 공개 — 시작 때 name · description 만(~100 토큰), 쓸 때 본문(< 5000 토큰 권장), 부속 파일은 필요할 때.
- 한도: `name` 64자, `description` 1024자, `compatibility` 500자. 본문 「under 500 lines」. 참조는 SKILL.md 에서 한 단계 깊이까지.
- 지원 도구 목록: 페이지가 스크립트로 그려져 **미확인**.

#### 1-5. llms.txt — 열람

- URL: https://llmstxt.org/
- 성격: 저장소 지시 파일이 아니라 **웹사이트용** 안내 파일. `/llms.txt`(또는 하위 경로, 가장 구체적인 것 사용).
- 형식: H1(유일한 필수) → 인용 요약 → 설명 → H2 링크 목록 → 「Optional」 H2(줄여야 할 때 건너뜀). 각 페이지의 `.md` 판을 같은 URL 에 두라고 권함.
- 크기: 숫자 없음. 2024-09-03 제안(Jeremy Howard), v2 2026-08-10 수정.
- 관련성: Claude Code 문서가 `https://code.claude.com/docs/llms.txt` 를 제공(문서 머리에 표시). 저장소 규칙에는 직접 해당 없음.

#### 1-6. GitHub Spec Kit — 열람(사이트 · README · 명령 템플릿)

- URL: https://github.github.com/spec-kit/ · https://github.com/github/spec-kit
- 파일: 프로젝트 원칙은 `.specify/memory/constitution.md`(constitution 명령 템플릿이 이 파일만 쓰라고 함). 기능마다 `specs/**/spec.md · plan.md · tasks.md`.
- 흐름: `/speckit-constitution` → `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement` → `/speckit-converge`.
- 다른 도구 파일: `agent-context` 확장이 `CLAUDE.md` · `.github/copilot-instructions.md` · `AGENTS.md` 안에 `<!-- SPECKIT START -->` ~ `<!-- SPECKIT END -->` 관리 블록을 만들고 최신 plan 경로를 넣음. `context_files` 로 여러 파일을 한꺼번에 갱신.
- 숫자(사이트): 「38 integrations」, 157 community extensions, 33 presets.

---

### 2. 도구별

#### 2-1. OpenAI Codex — 열람

- URL: https://developers.openai.com/codex/guides/agents-md (→ learn.chatgpt.com/docs/agent-configuration/agents-md 로 이동)
- 파일 · 위치: 전역 `~/.codex/AGENTS.override.md` 또는 `AGENTS.md`(비어 있지 않은 첫 파일 하나). 프로젝트는 Git 루트 → 현재 폴더까지 각 폴더에서 `AGENTS.override.md` → `AGENTS.md` → `project_doc_fallback_filenames` 순, **폴더당 최대 1개**.
- 우선순위: 루트부터 빈 줄로 이어 붙임, 현재 폴더에 가까운 파일이 뒤에 와서 앞의 지시를 덮음. 실행마다 한 번 만듦.
- 범위 규칙: 디렉터리 중첩(override 파일로 특정 영역 덮기). glob 없음. 하위 폴더 지연 로딩은 문서에 없음(현재 폴더까지의 체인만).
- 한도: `project_doc_max_bytes` 기본 **32 KiB**(합계가 닿으면 더 안 붙임), 예시는 65536 으로 올림. 빈 파일은 건너뜀.
- 쓰라는 것: 전역 = 재사용 작업 약속(JS 바꾸면 테스트, 패키지 매니저, 운영 의존성 추가 전 묻기), 프로젝트 = 린트 단계 · 문서 규칙, 중첩 = 특수 영역. `## Code Review Rules` 절. 규칙은 짧게, 포맷 · 린트 검사는 CI 에 맡기라.
- 호환: 대체 파일 이름을 설정(`project_doc_fallback_filenames = ["TEAM_GUIDE.md", ".agents.md"]`)으로 추가. `@` import 지원은 문서에 없음(**미확인**).

#### 2-2. Anthropic Claude Code — 메모리 문서 — 열람(전문)

- URL: https://code.claude.com/docs/en/memory
- 파일 · 위치(로드 순, 넓은 것 → 구체적인 것): 관리 정책 CLAUDE.md(OS별 경로) → `~/.claude/CLAUDE.md` → `./CLAUDE.md` 또는 `./.claude/CLAUDE.md` → `./CLAUDE.local.md`(gitignore). `~/.claude/rules/` · `.claude/rules/`.
- 우선순위: **덮어쓰지 않고 모두 이어 붙임**. 루트 → 작업 폴더 순이라 가까운 것이 나중에 읽힘. 같은 폴더에선 CLAUDE.local.md 가 뒤. 두 지시가 모순되면 「Claude may pick one arbitrarily」.
- 지연 로딩: 작업 폴더 **위**의 파일은 시작 때, **아래** 하위 폴더 CLAUDE.md 는 그 폴더의 파일을 읽거나 고칠 때 로드.
- 범위 규칙: `.claude/rules/*.md`(재귀) 에 `paths:` frontmatter(glob) → 맞는 파일을 Read/Write/Edit 할 때만 로드. `paths` 없는 규칙은 `.claude/CLAUDE.md` 와 같은 우선순위로 항상 로드. frontmatter 에서 읽는 필드는 `paths` 하나. brace 확장 예산 1,000 패턴 · 4 MiB.
- @import: `@path`, 상대 경로는 **가져오는 파일 기준**, 재귀 최대 **4 hops**. 코드 span · 펜스 안은 무시. 저장소 밖 경로는 첫 사용 때 승인 창. import 는 정리용일 뿐 **컨텍스트를 줄이지 않음**.
- 크기: 「target under 200 lines per CLAUDE.md file」(길수록 컨텍스트 소비 · 준수율 하락). 4 MiB 넘는 파일은 통째로 건너뜀. 지연 로딩 파일(하위 CLAUDE.md · paths 규칙)은 파일당 200K 창 **40,000자**, 1M 창 200,000자(Opus 4.6 · Sonnet 4.6) / 150,000자(이후 모델) — 넘으면 앞부분만. 권장 길이를 넘거나 합계가 넘으면 시작 때 경고.
- 쓰라는 것: 매 세션 필요한 사실 — 빌드 명령, 관례, 구조, 「항상 X」. 검증 가능하게 구체적으로(「2칸 들여쓰기」). 제목 · 글머리로 묶기. 추가 시점: 같은 실수 두 번, 리뷰에서 걸린 것, 같은 정정을 또 칠 때.
- 쓰지 말라는 것: 다단계 절차 · 일부 영역만 해당 → 스킬 또는 경로 규칙으로. 모순 · 낡은 지시는 정기 점검(`/doctor prompt-audit`). `/doctor` 는 코드에서 알 수 있는 것(디렉터리 구조 · 의존성 목록 · 아키텍처 개요)을 자르고 함정 · 근거 · 기본값과 다른 관례는 남김.
- 강제력: CLAUDE.md 는 「context, not enforced configuration」, 사용자 메시지로 전달. 반드시 막아야 하면 PreToolUse 훅 · `permissions.deny`.
- AGENTS.md 호환(v2.1.277+): 기본값 `claude-md-or-agents-md` — 작업 폴더나 그 위에 CLAUDE.md · .claude/CLAUDE.md · CLAUDE.local.md 가 **없을 때만** AGENTS.md 를 읽음. 있으면 CLAUDE.md 만. 하위 폴더 AGENTS.md 도 「CLAUDE.md 가 하나도 없을 때」 조건 아래 설명됨. 설정값 `claude-md-and-agents-md`(둘 다, 이미 읽은 AGENTS.md 는 건너뜀) · `claude-md` · `managed-only`. `AGENTS.local.md` · `AGENTS.override.md` · `.agents/` 는 안 읽음.
- 한 파일 공유 공식 방법: CLAUDE.md 에 `@AGENTS.md` 를 두고 그 아래 Claude 전용 내용. 이 import 는 어떤 설정에서도 AGENTS.md 를 두 번 읽게 하지 않음. 대안 `ln -s AGENTS.md CLAUDE.md`(Edit/Write 가 심볼릭 링크를 통해 쓰기 거부, Windows 주의). 「CLAUDE.md 에 글로 AGENTS.md 를 읽으라고 쓰는 것」은 Claude 가 열기로 정할 때만 보이므로 import 로 바꾸라고 함.
- 자동 메모리: `~/.claude/projects/<project>/memory/MEMORY.md`(색인) + 주제 파일. 저장소 단위, worktree 끼리 공유, 기계 로컬. MEMORY.md 는 처음 **200줄 또는 25KB** 까지만 시작 때 로드, 주제 파일은 필요할 때. CLAUDE.md 에 이미 있는 것 · 코드에서 알 수 있는 것은 저장 안 하는 것이 설계.
- 기타: 블록 HTML 주석은 컨텍스트에서 빠짐. `/compact` 뒤 루트 CLAUDE.md 는 다시 주입, 하위 · paths 규칙은 다시 맞을 때 로드.

#### 2-3. Claude Code — Best practices — 열람

- URL: https://code.claude.com/docs/en/best-practices
- 포함 / 제외 표: 포함 = 추측 못 하는 Bash 명령, 기본값과 다른 스타일, 테스트 방법, 저장소 예절(브랜치 · PR), 프로젝트 고유 아키텍처 결정, 환경 함정, 자명하지 않은 동작. 제외 = 코드로 알 수 있는 것, 표준 관례, 자세한 API 문서(링크로), **자주 바뀌는 정보**, 긴 설명 · 튜토리얼, 파일별 설명, 「깨끗한 코드」 같은 자명한 말.
- 줄마다 「이 줄을 지우면 실수가 생기나?」 아니면 삭제. 너무 길면 규칙이 묻힘. 강조(「IMPORTANT」)는 한 줄에만 — 여러 줄을 강조하면 아무것도 안 튐.
- 가끔 필요한 지식 · 절차는 스킬로, 예외 없이 지켜야 할 것은 훅으로. 병렬 세션은 worktree 로 격리해 편집 충돌 방지.

#### 2-4. Claude Code — 큰 코드베이스 · 모노레포 — 열람

- URL: https://code.claude.com/docs/en/large-codebases
- 루트 = 어디서나 적용되는 규칙(표준 · 커밋 관례), 하위 폴더 CLAUDE.md = 그 영역 관례. 하위 CLAUDE.md(그 폴더 주인이 관리) vs 중앙 `.claude/rules/` paths 규칙(한곳에 모으거나 흩어진 경로에 같은 규칙) 비교 표.
- 주요 모델 출시 뒤 옛 모델 한계용 규칙 재검토, PR 에서 CLAUDE.md 변경 리뷰, 커지면 스킬 · 플러그인 · MCP 로 옮기기.

#### 2-5. Claude Code — Skills — 일부(앞 100,000자)

- URL: https://code.claude.com/docs/en/skills
- 위치: `.claude/skills/<name>/SKILL.md`. 시작 때 설명만, 호출 시 본문. 설명 · when_to_use 1,536자에서 잘림. SKILL.md 500줄 이하. compaction 후 스킬당 처음 5,000 토큰, 합계 25,000 토큰 재첨부.
- CLAUDE.md 와 구분: 같은 지시 · 체크리스트 · 다단계 절차를 반복해 붙일 때, CLAUDE.md 절이 사실이 아닌 절차가 됐을 때 스킬로.

#### 2-6. Anthropic — Effective context engineering for AI agents — 열람

- URL: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents (2025-09-29)
- 「right altitude」: 깨지기 쉬운 하드코딩과 막연한 지침 사이. 목표는 「smallest possible set of high-signal tokens」(짧다는 뜻만은 아님). 최소로 시작해 실패를 보고 추가. 절 구분(XML · Markdown 제목). 긴 예외 규칙 목록보다 대표 예시 몇 개.
- context rot · attention budget: 컨텍스트가 찰수록 회상 정확도 하락.
- just-in-time: 경로 · 링크 같은 가벼운 참조만 들고 필요할 때 도구로 읽기. Claude Code 는 CLAUDE.md 를 미리 싣고 나머지는 glob · grep 으로 찾는 혼합 방식.
- 구조화된 노트(NOTES.md 등), compaction, 서브에이전트(요약 1,000–2,000 토큰 반환).

#### 2-7. GitHub Copilot(GitHub.com · 코딩 에이전트 · 코드 리뷰) — 열람

- URL: https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions
- 파일: 저장소 전체 `.github/copilot-instructions.md` · 경로별 `.github/instructions/**/NAME.instructions.md`(frontmatter `applyTo` glob, 쉼표 구분, `excludeAgent: "code-review" | "cloud-agent"`) · 에이전트용 `AGENTS.md`(저장소 어디든) 또는 루트 `CLAUDE.md` / `GEMINI.md` 하나.
- 우선순위: 경로별과 저장소 전체는 함께 적용. 「the nearest AGENTS.md file in the directory tree will take precedence」. 종류 간: 개인 > 저장소 > 조직, 모두 제공되므로 충돌을 피하라. 코드 리뷰는 PR head 브랜치의 지시를 읽음.
- 크기: 직접 쓴 파일엔 숫자 없음. 에이전트가 생성할 때 프롬프트에 「no longer than 2 pages」, 「must not be task specific」.
- 쓰라는 것: 저장소 요약, 빌드 · 테스트 · 실행 · 린트 순서와 도구 버전, 알려진 오류 우회와 오래 걸리는 명령, 구조 · 설정 파일 위치 · CI 검사, 숨은 의존성, 「항상 ~한다」 문장, 「지시를 믿고 틀렸을 때만 찾아보라」.
- 쓰지 말라는 것: 작업별 내용, 다른 지시와 충돌하는 내용.

#### 2-8. Copilot coding agent AGENTS.md 지원 공지 — 열람

- URL: https://github.blog/changelog/2025-08-28-copilot-coding-agent-now-supports-agents-md-custom-instructions
- 2025-08-28. 루트 AGENTS.md + 중첩 AGENTS.md, `.github/copilot-instructions.md`, `.github/instructions/**.instructions.md`, `CLAUDE.md`, `GEMINI.md`.

#### 2-9. VS Code(Copilot Chat) — 열람

- URL: https://code.visualstudio.com/docs/copilot/customization/custom-instructions
- 파일: `.github/copilot-instructions.md`, `*.instructions.md`(`name` · `description` · `applyTo`, 둘 다 없으면 수동 첨부), `AGENTS.md`(루트, 중첩은 `chat.useNestedAgentsMdFiles` 실험 · 기본 꺼짐), `CLAUDE.md` · `.claude/CLAUDE.md` · `.claude/rules`(`paths`, 기본 `**`) · `CLAUDE.local.md`.
- 우선순위: 「additive」, 일반 우선순위 정의 없음 — 파일 순서에 기대지 말고 원본에서 모순을 없애라.
- 크기: 숫자 없음. 「short and self-contained」, 한 지시 = 한 문장.
- 쓰라는 것: **규칙의 이유를 설명**, 좋은/피할 코드 예시, 자명하지 않은 규칙만, 린터 · 포매터가 하는 일은 빼기, 주제별 `*.instructions.md` 로 나누기, 생성된 지시의 명령 · 경로를 저장소와 대조.

#### 2-10. GitHub Copilot CLI — 열람

- URL: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions
- 파일: `~/.copilot/copilot-instructions.md` · `~/.copilot/instructions/**/*.instructions.md` · `.github/copilot-instructions.md` · `.github/instructions/**/*.instructions.md` · `AGENTS.md` · `CLAUDE.md`(+ `.claude/CLAUDE.md`) · `GEMINI.md`. 추가 폴더 `COPILOT_CUSTOM_INSTRUCTIONS_DIRS`.
- 위치: 저장소 루트, 현재 폴더, 그 사이 폴더, 작업 중인 파일 경로의 하위 폴더.
- @참조: copilot-instructions · AGENTS.md · CLAUDE.md 에서 `@상대경로` 즉시 읽음, 재귀 가능, 저장소 밖 · 절대 · `~/` 불가. GEMINI.md · `*.instructions.md` 에선 확장 안 함.
- 우선순위: 모두 합침, 같은 내용 중복 제거, **일반 우선순위 없음** → 충돌 피하라. 크기 숫자 없음. `/instructions` 로 파일별 켜고 끄기.

#### 2-11. Cursor — 열람

- URL: https://cursor.com/docs/context/rules
- 파일: `.cursor/rules/*.mdc`(하위 폴더 가능, 「Project rules must use the .mdc extension」, frontmatter 없는 .md 는 무시), `AGENTS.md`(루트 + 하위 폴더, 부모와 합치고 더 구체적인 것이 우선). User Rules(설정), Team Rules(대시보드, 강제 가능).
- 범위: Always Apply(`alwaysApply: true`) · Apply Intelligently(`description`) · Apply to Specific Files(`globs`) · Apply Manually(@멘션).
- 우선순위: 「Team Rules → Project Rules → User Rules」, 앞이 충돌 시 이김.
- 크기: 「Keep rules under 500 lines」.
- 쓰라는 것: 집중 · 실행 가능 · 범위 한정, 큰 규칙은 쪼개기, **내용 복사 대신 파일 참조**. 쓰지 말 것: 스타일 가이드 복사(린터로), 흔한 명령 문서화, 코드베이스 내용 중복. 같은 실수 반복 시 추가, git 에 커밋.
- `.cursorrules`: 이 페이지엔 언급 없음(**미확인**).

#### 2-12. Gemini CLI — 열람

- URL: https://geminicli.com/docs/cli/gemini-md/ · https://geminicli.com/docs/reference/memport/
- 파일: 전역 `~/.gemini/GEMINI.md` → 작업 공간 폴더와 그 부모 → JIT(도구가 파일에 접근할 때 그 위치와 조상에서 찾음). 모두 이어 붙여 매 프롬프트에 보냄.
- @import: `@file.md`(상대 · 절대), 기본 최대 깊이 **5 levels**, 순환 감지, 허용 폴더 밖 차단.
- 호환: `context.fileName` 에 `["AGENTS.md", "CONTEXT.md", "GEMINI.md"]` 처럼 지정. `/memory show` · `/memory reload`.
- 크기: 숫자 없음.
- 주의: 두 페이지 모두 「Gemini CLI was replaced by Antigravity CLI on June 18th, 2026」 표시.

#### 2-13. Google Antigravity — 열람

- URL: https://antigravity.google/docs/rules
- 파일: 전역 `~/.gemini/GEMINI.md` · `~/.gemini/AGENTS.md`(+ `~/.gemini/config/…`), 폴더별 `<dir>/AGENTS.md` · `<dir>/GEMINI.md` · `<dir>/.agents/rules/*.md`(옛 `.agent/rules`). 편집 파일 폴더에서 작업 공간 루트까지 올라감.
- 우선순위: 누적, 폴더 규칙 > 전역, 충돌 시 더 구체적인 폴더 규칙이 이김.
- 범위: `trigger` = `always_on` · `model_decision`(설명만 먼저) · `glob` · `manual`. `.agents/rules` 파일은 유효한 trigger 없으면 조용히 버려짐. AGENTS.md · GEMINI.md 는 frontmatter 없이 그 폴더에 항상 적용.
- 한도: 파일당 **24,000 bytes**(include 확장 후, 넘으면 잘림), 전역 + always_on 합계 **20,000 토큰**(넘으면 큰 파일부터 경로 · 설명 포인터로 바뀜).
- import: `@[label](path)` 는 내용 삽입, `@filename` 은 경로만.

#### 2-14. Windsurf → Devin Desktop(Cascade) — 열람

- URL: https://docs.windsurf.com/windsurf/cascade/memories (→ docs.devin.ai/desktop/cascade/memories)
- 파일: `.devin/rules/*.md`(우선) 또는 `.windsurf/rules/*.md`, 옛 `.windsurfrules`, 전역 `~/.codeium/windsurf/memories/global_rules.md`, 아무 폴더의 `AGENTS.md`, 기업용 시스템 규칙.
- 범위: `trigger` = Always On · Model Decision · Glob · Manual. 루트 AGENTS.md 는 항상, **하위 폴더 AGENTS.md 는 그 폴더 glob 으로 자동 범위 지정**.
- 한도: 작업 공간 규칙 파일당 **12,000자**, 전역 **6,000자**.
- 메모리: 자동 생성, 로컬 저장, 커밋 안 됨. 공유할 지식은 메모리 대신 Rules · AGENTS.md 로 하라고 권함(새 Devin Local 에이전트는 메모리를 유지하지 않음).
- 쓰라는 것: 짧고 구체적, 「좋은 코드를 써라」 같은 일반론 빼기, 글머리 · 번호, XML 태그로 묶기.

#### 2-15. Devin CLI — 열람

- URL: https://docs.devin.ai/cli/extensibility/rules
- 파일: `AGENTS.md`(권장) · `AGENTS.local.md`(개인, gitignore) · `AGENT.md` · `.windsurfrules` · `CLAUDE.md` — 모두 「treated identically」, always-on. 그 밖에 `.devin/rules` · `.windsurf/rules` · `.cursor/rules`(.md · .mdc) · `.claude/`. 전역 `~/.config/devin/AGENTS.md`, `~/.claude/CLAUDE.md` 도 전역으로 읽음.
- 지연 로딩: 루트는 시작 때, 하위 폴더는 그 폴더 파일에 접근할 때.
- 크기: 숫자 없음, 「kept as small as possible」, 긴 규칙은 주의를 흐림.

#### 2-16. Devin Knowledge — 열람

- URL: https://docs.devin.ai/product-guides/knowledge
- 저장소 파일이 아닌 조직 단위 지식 항목. 트리거 설명으로 필요할 때 불러옴(「not all at once」). 항목 하나 = 「a handful of sentences」, 큰 지식은 쪼개기, 저장소 고정 가능. **폐기 예정 → Skills 로 이전** 권장.

#### 2-17. JetBrains Junie — 열람(공식 순서 일부는 2차)

- URL: https://junie.jetbrains.com/docs/guidelines-and-memory.html
- 순서: `.junie/AGENTS.md` → 루트 `AGENTS.md`(+ `.junie/playbook.md` · `.junie/rules/*.md`) → 옛 `.junie/guidelines.md` / `.junie/guidelines/`. 전역 `~/.junie/AGENTS.md`, 충돌 시 프로젝트가 이김, 같은 내용은 한 번만. (IDE 판의 「설정의 사용자 경로가 먼저」는 검색 요약만 — 2차.)
- 크기: 숫자 없음. 쓰라는 것: 핵심 규칙 체크리스트, 로컬 명령, 기능 개발 · 결정 방법, UI · 구조 관례, 보안, 테스트, **명시적 비목표**(「마이그레이션 없이 스키마 바꾸지 않기」). 처음 열 때 다른 에이전트 파일을 `.junie/AGENTS.md` 로 가져오자고 제안.

#### 2-18. Amazon Kiro — 열람

- URL: https://kiro.dev/docs/steering/
- 파일: `.kiro/steering/*.md`(작업 공간), `~/.kiro/steering/`(전역 · 팀 배포). 기본 `product.md` · `tech.md` · `structure.md`.
- 범위: `inclusion: always`(기본) · `fileMatch`(+`fileMatchPattern`) · `manual`(`#이름`) · `auto`(name · description). AGENTS.md(루트 · 하위 · 전역)는 항상 포함, 모드 없음.
- 우선순위: 전역과 작업 공간이 충돌하면 작업 공간.
- 참조: `#[[file:경로]]`.
- 크기: 숫자 없음. 쓰라는 것: 파일당 한 영역, 이름 명확, **표준의 이유와 예시**, 비밀값 금지, 스프린트 계획 · 구조 변경 때 검토, 코드처럼 리뷰.

#### 2-19. Cline — 열람

- URL: https://docs.cline.bot/features/cline-rules
- 파일: `.clinerules/` 또는 `.cline/rules/`, 전역 `~/Documents/Cline/Rules` 등, `~/.agents/AGENTS.md`.
- 범위: frontmatter `paths`(glob), 없으면 항상. `paths: []` 는 안 켜짐. 규칙마다 켜고 끄기.
- 호환: `.cursorrules` · `.windsurfrules` 자동 감지, 루트 `AGENTS.md`.
- 우선순위: 합침, 충돌 시 작업 공간 > 전역.
- 크기: 숫자 없음(예시의 「3-4 sentences max」 정도), 컨텍스트를 먹으니 짧게. **규칙의 이유를 적고**, 코드 예를 가리키고, 파일당 한 관심사.

#### 2-20. Cline Memory Bank — 열람

- URL: https://docs.cline.bot/prompting/cline-memory-bank
- 기능이 아니라 **문서 작성 방법론**. `memory-bank/` 의 6개 파일(projectbrief · productContext · activeContext · systemPatterns · techContext · progress). 규칙 파일에 지시를 붙여 「initialize memory bank」로 시작.

#### 2-21. Aider — 열람

- URL: https://aider.chat/docs/usage/conventions.html
- 파일: `CONVENTIONS.md`(이름은 관례일 뿐). `/read` · `--read` · `.aider.conf.yml` 의 `read:` 로 읽기 전용 첨부, 프롬프트 캐시됨. 자동 탐색 없음. 페이지는 AGENTS.md 언급 없음(agents.md 사이트가 `read: AGENTS.md` 안내). 크기 숫자 없음.

#### 2-22. Zed — 열람

- URL: https://zed.dev/docs/ai/instructions.html
- 파일: 첫 일치 **하나만** — `.rules` → `.cursorrules` → `.windsurfrules` → `.clinerules` → `.github/copilot-instructions.md` → `AGENT.md` → `AGENTS.md` → `CLAUDE.md` → `GEMINI.md`. 개인 `~/.config/zed/AGENTS.md`, 충돌 시 프로젝트가 이김.
- 중첩 여부: 문서에 없음(**미확인**). 크기 숫자 없음. 외부 에이전트(Claude 등)는 자기 파일을 직접 읽는다고 명시.

#### 2-23. Amp — 열람

- URL: https://ampcode.com/docs/customize/agents-md
- 파일: `AGENTS.md`, 없으면 그 폴더의 `AGENT.md` 또는 `CLAUDE.md`. 현재 폴더 ~ `$HOME` 까지 항상, 하위 폴더는 그 안 파일을 읽을 때. 개인 `~/.config/amp/AGENTS.md`, 시스템 경로, 관리자 전역.
- @멘션: `@path`(glob 가능, 파일 기준 상대, `@~/`, 절대 경로 불가). 멘션된 파일에 `globs` frontmatter → 맞는 파일을 읽었을 때만 포함.
- 크기: 숫자 없음. 큰 저장소는 루트를 일반적으로, 구체적인 것은 하위 AGENTS.md 로.

#### 2-24. Factory Droid — 열람

- URL: https://docs.factory.ai/cli/configuration/agents-md (→ docs.factory.com)
- 파일: 현재 폴더 ~ Git 루트의 각 단계에서 폴더 자체와 `.factory/` · `.agents/` · `.agent/`. 하위 폴더는 읽을 때. 개인 `~/.factory/` · `~/.agents/` · `~/.agent/`.
- 우선순위: 현재 요청 > 상시 지시, 중첩이 루트를 다듬음, 프로젝트 > 개인.
- 한도: 초기 로드 **80,000자**, 동적 경로 로드 **40,000자**. 「These are caps, not targets. Smaller files are usually better.」
- 쓰라는 것: 짧은 개요, 정확한 명령(먼저), 저장소 지도, 프로젝트 관례, 테스트 · 생성 파일 · 보안 규칙, PR 기대.
- 쓰지 말라는 것: 비밀값, 긴 문서 통째 복사, **낡은 디렉터리 목록**, 프로젝트와 충돌하는 개인 취향, 임시 작업 메모, 근거 없는 검증 생략 지시, 긴 런북(링크하거나 스킬로). **호환 파일 이름(CLAUDE.md 등)에 규칙 중복 금지.**

#### 2-25. Google Jules — 열람(짧은 절)

- URL: https://jules.google/docs
- 저장소 **루트의 AGENTS.md** 만 자동 확인. 에이전트 · 도구 설명, 최신으로 유지. 우선순위 · 크기 없음.

#### 2-26. OpenCode — 열람

- URL: https://opencode.ai/docs/rules/
- 파일: 프로젝트 `AGENTS.md`(없으면 `CLAUDE.md`), 전역 `~/.config/opencode/AGENTS.md`(없으면 `~/.claude/CLAUDE.md`). 범주마다 **첫 일치만**.
- 참조: AGENTS.md 안 파일 참조를 **자동 해석하지 않음**. `opencode.json` 의 `instructions`(경로 · glob · 원격 URL 5초 제한)로 합치는 것이 권장, 대안은 「필요할 때 Read 로 읽어라」 글 지시(지연 로딩).
- 크기 숫자 없음. `OPENCODE_DISABLE_CLAUDE_CODE*` 환경 변수 3개.

#### 2-27. Roo Code — 열람

- URL: https://docs.roocode.com/features/custom-instructions (→ roocodeinc.github.io)
- 파일: `.roo/rules/` · `.roo/rules-{mode}/`(대체 `.roorules*`), 전역 `~/.roo/rules*`, 루트 `AGENTS.md`(> `AGENT.md`, `roo-cline.useAgentRules` 기본 true). 하위 폴더 AGENTS.md 언급 없음.
- 순서: 언어 → 전역 지시 → 모드 지시 → 모드 규칙 → .rooignore → AGENTS.md → 일반 규칙. 충돌 시 작업 공간 > 전역. 폴더 안은 이름순. 심볼릭 링크 깊이 5.

#### 2-28. Kilo Code — 열람

- URL: https://kilo.ai/docs/customize/agents-md
- 파일: 루트 `AGENTS.md`(없으면 `AGENT.md`, 대문자만), 하위 폴더 AGENTS.md 는 그 폴더 파일을 읽을 때 `<system-reminder>` 로 주입. CLI 는 `.claude/` · `.agents/` 도 읽음.
- 우선순위: 에이전트 프롬프트 > 프로젝트 `kilo.jsonc` instructions > 루트 AGENTS.md > 전역 instructions. AGENTS.md 는 개별로 끌 수 없음, 에이전트가 고치려면 승인 필요.
- 크기 숫자 없음(예시 파일의 「under 200 lines」는 예시일 뿐). 짧게 · 글머리 · 구체적 규칙 · 코드 예.

#### 2-29. goose(Block) — 열람

- URL: https://goose-docs.ai/docs/guides/context-engineering/using-goosehints
- 파일: 전역 `~/.config/goose/.goosehints`, 프로젝트 · 하위 폴더의 `.goosehints` 와 `AGENTS.md`(기본 `CONTEXT_FILE_NAMES=["AGENTS.md", ".goosehints"]`). 시작 때 현재 폴더 ~ 저장소 루트, 하위 폴더는 읽거나 고칠 때.
- 우선순위: 충돌 시 로컬 > 전역, 중첩은 루트 → 하위 순으로 합침.
- 크기 숫자 없음. 매 요청 시스템 프롬프트에 들어가니 짧게, 중요한 것 먼저, 꼭 필요한 문서만 `@file`, 크거나 선택적인 문서는 그냥 경로만 적기.

#### 2-30. Augment Code(Auggie CLI) — 열람

- URL: https://docs.augmentcode.com/cli/rules
- 우선순위(높은 순): `--rules` 파일 → `CLAUDE.md` → `AGENTS.md` → `.augment-guidelines` → `.augment/rules/`(재귀) → `~/.augment/rules/`. 하위 폴더는 AGENTS.md · CLAUDE.md 만 위로 올라가며 찾음.
- 범위: `always_apply` · `agent_requested`(description) · `manual`(IDE 만). 크기 숫자 없음. 구체적 · 예시 · 최신 · 짧게 · 실제로 따르는지 시험.
- CLAUDE.md 안의 `@AGENTS.md` 를 펼치는지: 문서에 없음(**미확인**).

#### 2-31. Continue — 열람

- URL: https://docs.continue.dev/customize/deep-dives/rules
- 파일: `.continue/rules/*.md`(이름순, `01-` 접두로 순서). frontmatter `name` · `globs` · `regex` · `description` · `alwaysApply`. Agent · Chat · Edit 에만, 자동완성엔 안 들어감. AGENTS.md · CLAUDE.md 언급 없음, 크기 숫자 없음.

#### 2-32. Warp — 열람

- URL: https://docs.warp.dev/agents/capabilities/rules
- 파일: `AGENTS.md`(대문자), 옛 `WARP.md`(같은 폴더에 둘 다 있으면 WARP.md 우선), 하위 폴더 가능. 전역 규칙은 Warp Drive.
- 우선순위: 현재 하위 폴더 > 루트 > 전역. 다른 하위 폴더 파일은 그 안을 고칠 때 best-effort.
- 호환: `/init` 이 CLAUDE.md · .cursorrules · AGENT.md · GEMINI.md · .clinerules · .windsurfrules · copilot-instructions 를 AGENTS.md 로 연결. 크기 숫자 없음.

#### 2-33. Sourcegraph(Cody) — 2차 · 미확인

- 공식 문서를 찾지 못함. 제3자 페이지에 `.sourcegraph/**/*.rule.md` 패턴이 있으나 확인 못 함. Sourcegraph 의 에이전트였던 Amp 는 2-23 참고.

---

### 3. 숫자 한눈에 (문서에 있는 것만)

| 도구                                                                                                                                                                 | 권장                                  | 한도                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------ |
| Claude Code CLAUDE.md                                                                                                                                                | 파일당 200줄 미만                     | 4 MiB 넘으면 통째 제외 · 지연 로딩 파일 40,000자(200K 창) / 150,000~200,000자(1M 창) |
| Claude 자동 메모리 MEMORY.md                                                                                                                                         | 한 줄 한 항목                         | 시작 때 200줄 또는 25KB 까지만                                                       |
| Claude @import                                                                                                                                                       | —                                     | 재귀 4 hops                                                                          |
| Claude 스킬 · Agent Skills                                                                                                                                           | SKILL.md 500줄 미만, 본문 < 5000 토큰 | description 1,536자(Claude 목록) / 1024자(규격)                                      |
| Codex                                                                                                                                                                | —                                     | 합계 32 KiB(`project_doc_max_bytes`)                                                 |
| Cursor                                                                                                                                                               | 규칙 500줄 미만                       | —                                                                                    |
| Windsurf/Devin Desktop                                                                                                                                               | —                                     | 작업 공간 파일 12,000자 · 전역 6,000자                                               |
| Antigravity                                                                                                                                                          | —                                     | 파일 24,000 bytes · always_on 합계 20,000 토큰                                       |
| Factory                                                                                                                                                              | 「caps, not targets」                 | 초기 80,000자 · 동적 40,000자                                                        |
| Gemini CLI @import                                                                                                                                                   | —                                     | 깊이 5                                                                               |
| Copilot                                                                                                                                                              | 생성 시 「2 pages」 이내              | —                                                                                    |
| 나머지(Copilot 수동 · VS Code · Copilot CLI · Gemini · Kiro · Cline · Aider · Zed · Amp · Jules · OpenCode · Roo · Kilo · goose · Augment · Continue · Warp · Junie) | 「짧게」만                            | 숫자 없음                                                                            |

---

### 4. 정리

#### ① 도구 사이 공통점 (거의 모두가 권하는 것)

1. **루트의 일반 Markdown 파일 하나를 항상 싣는다.** 형식 · 필수 필드 없음. 31곳 중 AGENTS.md 를 직접 읽는 도구가 대다수(Codex · Copilot 3종 · Cursor · Antigravity · Windsurf/Devin · Junie · Kiro · Cline · Zed · Amp · Factory · Jules · OpenCode · Roo · Kilo · goose · Augment · Warp, Claude Code 는 v2.1.277 부터 조건부).
2. **짧고 구체적이며 확인할 수 있는 규칙.** 숫자를 준 곳(Claude 200줄 · Cursor 500줄 · Windsurf 12,000자 · Codex 32 KiB · Antigravity 24,000 bytes)도, 안 준 곳도 모두 「짧게」. 길면 규칙이 묻힌다(Claude · Devin · Anthropic context rot).
3. **정확한 빌드 · 테스트 · 린트 명령을 먼저.** (agents.md · Codex · Copilot · Factory · Junie · Claude)
4. **코드에서 알 수 있는 것, 일반 상식, 린터 · 포매터가 잡는 것은 빼라.** (Claude · Cursor · VS Code · Codex · Windsurf)
5. **긴 문서는 복사하지 말고 가리켜라** — just-in-time. (Anthropic · Cursor · Factory · goose · Claude 「link to docs」)
6. **가까운 · 구체적인 파일이 이기고(또는 나중에 읽히고), 대부분은 덮어쓰지 않고 합친다** → 그래서 **충돌하는 지시를 만들지 말라**(Claude · Copilot · VS Code · Copilot CLI 모두 명시).
7. **git 에 커밋해 팀이 같이 고치고, 낡은 것은 정리한다.** 반복 실수가 나오면 한 줄 추가(Claude · Cursor).
8. 비밀값 금지(Kiro · Factory), 개인 취향은 전역 · 로컬 파일로(Codex · Claude · Factory · Devin).

#### ② 갈리는 점

- **파일 이름**: AGENTS.md(표준) vs CLAUDE.md · GEMINI.md · `.github/copilot-instructions.md` · `.cursor/rules/*.mdc` · `.windsurf|.devin/rules` · `.kiro/steering` · `.clinerules` · `.roo/rules` · `.continue/rules` · `.junie/` · CONVENTIONS.md.
- **여러 파일을 합치나, 하나만 고르나**: 합침(Claude · Gemini · Copilot CLI · goose · Antigravity · Cline · Devin) vs 첫 일치 하나(Zed 전체, OpenCode 범주별, Codex 폴더당 1개, Claude 기본값은 CLAUDE.md 가 있으면 AGENTS.md 를 안 읽음, Amp 는 AGENTS.md 없을 때만 CLAUDE.md).
- **우선순위 방향**: 대부분 프로젝트 > 전역, 가까운 폴더 > 루트. 예외 — Cursor 는 Team → Project → User(앞이 이김), Copilot 은 개인 > 저장소 > 조직, Augment 는 CLAUDE.md > AGENTS.md, Warp 는 WARP.md > AGENTS.md. Claude · Copilot CLI · VS Code 는 「우선순위 없음, 순서만」.
- **경로별 범위 방식**: 표준은 폴더 중첩 AGENTS.md 뿐. glob frontmatter 는 도구마다 키가 다름 — Claude `paths` · Copilot/VS Code `applyTo` · Cursor `globs` · Windsurf/Antigravity `trigger: glob` + `globs` · Kiro `fileMatchPattern` · Cline `paths` · Continue `globs`/`regex` · Amp 멘션 파일의 `globs`. 설명 보고 에이전트가 고르는 모드도 있음(Cursor · Windsurf · Antigravity · Kiro auto · Augment · Continue).
- **하위 폴더 지연 로딩**: 있음(Claude · Gemini JIT · Amp · Factory · Devin CLI · goose · Kilo · Copilot CLI · Windsurf glob) / 루트만(Jules · Roo · VS Code 기본) / 루트→현재 폴더 체인만(Codex) / 미확인(Zed).
- **@import**: Claude(4 hops) · Gemini(5) · Copilot CLI(저장소 안만) · Amp(glob) · Antigravity(`@[label](path)`) · Kiro(`#[[file:]]`) · goose. **OpenCode 는 해석 안 함**, Codex 는 문서에 없음(미확인).
- **규칙에 이유를 쓰나**: VS Code · Kiro · Cline 은 「이유를 적어라」, Claude `/doctor` 는 근거(rationale)를 남길 내용으로 분류. 반면 Claude best practices 는 「긴 설명」 제외. → 이유는 **짧게 한 마디**까지가 공통 분모.
- **저장소 지도**: Copilot · Factory · agents.md 는 구조 설명을 넣으라 하고, Claude `/doctor` 는 디렉터리 구조를 잘라내는 대상으로, Factory 도 「낡은 디렉터리 목록」은 금지.
- **강제력**: Claude 는 지시 파일은 강제가 아니라며 훅 · `permissions.deny` 를, Codex 는 포맷 · 린트를 CI 로 넘기라고 함. 다른 도구 문서는 언급 없음.
- **에이전트 메모리**: Claude 자동 메모리(저장소 단위 · 기계 로컬) · Windsurf 메모리(로컬, 공유 지식은 Rules 로) · Devin Knowledge(폐기 → Skills) · Cline Memory Bank(방법론, 저장소 파일). 다른 도구와 공유되지 않음.

#### ③ 여러 도구를 함께 쓸 때 한 파일로 관리하는 공식 방법

1. **원본은 루트 `AGENTS.md`** (agents.md · AAIF 표준, 20곳 넘게 직접 읽음).
2. **Claude Code**: `CLAUDE.md` 에 `@AGENTS.md` 한 줄 + 그 아래 Claude 전용 내용 — 공식 문서 예시 그대로. 두 번 읽지 않음. Claude 전용 내용이 없으면 `ln -s AGENTS.md CLAUDE.md`(Windows · 편집 제약 주의) 또는 CLAUDE.md 를 지우고 AGENTS.md 를 직접 읽게(v2.1.277+). 설정 `claude-md-and-agents-md` 로 둘 다 읽게 할 수도 있음.
3. **Gemini CLI**: `.gemini/settings.json` 의 `context.fileName` 에 `AGENTS.md`. Antigravity 는 기본으로 읽음.
4. **Aider**: `.aider.conf.yml` 에 `read: AGENTS.md`. **goose**: `CONTEXT_FILE_NAMES`. **Codex**: 다른 이름을 쓸 땐 `project_doc_fallback_filenames`. **Warp**: `/init` 으로 기존 파일 연결. **agents.md**: 옛 파일은 AGENTS.md 로 옮기고 심볼릭 링크.
5. **중복 금지**: Factory 는 CLAUDE.md 같은 호환 파일에 같은 규칙을 다시 쓰지 말라고 명시. Copilot CLI 는 같은 내용은 하나로 줄이지만 모순은 못 풂.
6. **경로별 규칙을 도구 공통으로 하려면 폴더 중첩 AGENTS.md** 가 유일. glob frontmatter 는 도구별 형식이라 공유 안 됨.
7. **절차 · 가끔 쓰는 지식은 Agent Skills(SKILL.md)** — 공개 규격이지만 지원 도구 목록은 미확인.
8. (참고) Spec Kit 은 반대 방식 — 여러 지시 파일 안에 표식으로 감싼 관리 블록을 스크립트로 동기화.

#### ④ 이 사람의 지금 구조 — 공식 문서 기준

실측(읽기만): `AGENTS.md` 126줄 · 12,920 bytes · 7,364자 / `CLAUDE.md` 10줄 · 567 bytes / `docs/ai-check.md` **73줄** · 9,486 bytes(브리프의 32줄과 다름) / `MEMORY.md` 41줄 · 8,136 bytes / 스킬 `noslog-check` SKILL.md 46줄 / `docs/decisions/` 7개 / 하위 AGENTS.md 없음 / `.claude/rules/` 없음.

**맞는 것**

- **AGENTS.md 원본 + CLAUDE.md = `@AGENTS.md` + Claude 전용 메모**: Claude 공식 문서 「Share one file with other coding tools」 예시와 같은 모양. AGENTS.md 를 직접 읽는 판(v2.1.277+)에서도 두 번 읽지 않음. Factory 의 「호환 파일에 중복 금지」도 지킴.
- **크기**: CLAUDE.md + AGENTS.md 136줄 → Claude 200줄 권장 이하. 12,920 bytes → Codex 32 KiB 의 약 39%, Antigravity 24,000 bytes · Windsurf 12,000자(7,364자) · Cursor 500줄 이하.
- **화면 규칙은 가이드로, 이유는 결정 기록으로 빼고 링크만**: just-in-time(Anthropic), 「복사 말고 참조」(Cursor · Factory · goose), 「자주 바뀌는 정보 · 긴 설명 제외」(Claude)와 맞음.
- **검수 절차는 프로젝트 스킬로**: 「절차는 스킬로」(Claude · Factory · Agent Skills). 46줄로 500줄 권장 이하.
- **자동 메모리 41줄 · 8,136 bytes**: 200줄 · 25KB 한도 이하.
- **「같은 실수가 두 번 나오면 한 줄 더하고 필요 없어진 줄은 뺀다」**: Claude 문서의 추가 시점 · 「Ruthlessly prune」과 같은 원칙.
- **하위 AGENTS.md 없음**: 단일 Next.js 앱이라 agents.md 기준(중첩은 모노레포용)으로 문제없음.
- 비밀값 금지 · 운영 DB 금지 같은 안전 규칙: Kiro · Factory 의 보안 규칙 권장과 맞음.

**어긋나는 것 · 주의할 것**

1. **`docs/ai-check.md` 를 「읽는다」고 글로만 지시**: Claude 문서는 글로 읽으라고 한 파일은 「Claude 가 열기로 정할 때만」 보인다고 함. 매 작업 필요하면 `@docs/ai-check.md` import 가 공식 방법인데, 그러면 136 + 73 = 209줄로 200줄 권장을 조금 넘음. 반대로 화면 · 문구 작업 때만 필요하면 스킬(이미 있음)이나 경로 규칙이 맞음. 다른 도구 중 OpenCode 는 import 를 안 펼치고 Codex 는 문서에 없음 → 글 지시가 도구 공통 방법이긴 함. 「매번 꼭」인지 「필요할 때」인지에 따라 한쪽으로 정해야 함.
2. **AGENTS.md 안의 다단계 절차**(e2e 3단계, 릴리스 순서 · 양식): Claude 「multi-step procedure → skill」, Factory 「long run books → skills」에 해당. 매 세션 싣는 비용이 듦.
3. **「하지 않는다」 목록(`prisma migrate reset` · `db push` · `--force` · git 커밋 등)은 지시 파일로는 강제되지 않음**: Claude 는 반드시 막을 것은 `permissions.deny` · PreToolUse 훅으로 하라고 함. 지시는 남겨 두고 강제 장치를 더하는 형태.
4. **자동 메모리와 AGENTS.md 의 겹침**(한국어 답, 커밋 금지, 서명 줄 금지, Dependabot 금지 등): Claude 문서상 자동 메모리는 CLAUDE.md 에 있는 것을 저장하지 않는 것이 설계이고, 겹치거나 어긋나면 「임의로 하나를 고를 수 있음」. 메모리는 **기계 로컬 · Claude 전용**이라 Codex 등 다른 에이전트는 못 봄 → 모든 에이전트가 지킬 규칙은 AGENTS.md 에만 있어야 함. 「커밋 전」 「선택 대기」 같은 진행 상태 항목은 낡으면 정리 대상(Claude: 「merge or drop stale entries」).
5. **개인 규칙이 프로젝트 파일에 있음**(답은 한국어, git 은 사용자가): Claude · Codex · Factory 는 개인 취향은 `CLAUDE.local.md` · `~/.claude/CLAUDE.md` · `~/.codex/AGENTS.md` 로 두라고 함. 다만 1인 저장소이고 여러 도구가 같이 봐야 하는 규칙이라 실제 문제는 작음(근거 약함).
6. **나중에 하위 폴더 AGENTS.md 를 만들 때 주의**: 루트에 CLAUDE.md 가 있으면 Claude 기본 설정은 AGENTS.md 를 직접 읽지 않음(문서의 「CLAUDE.md 가 하나도 없을 때」 조건). 하위 AGENTS.md 를 Claude 에도 보이게 하려면 그 폴더에도 `@AGENTS.md` CLAUDE.md 를 두거나 설정을 `claude-md-and-agents-md` 로 바꿔야 함(문서 문장 기준 해석, 실측 안 함).
7. **「이유는 결정 기록에만」**: VS Code · Kiro · Cline 은 규칙 옆에 이유를 짧게 적으라고 함. Claude best practices 는 긴 설명을 빼라고 함 → 공식 문서끼리 갈리는 부분이라 지금 방식이 틀렸다고 할 근거는 약함.
8. **폴더 · 스택 설명 절**: Claude `/doctor` 는 디렉터리 구조 · 의존성 목록을 잘라낼 대상으로 보고, Copilot · Factory 는 저장소 지도를 넣으라고 함. 반면 「Next 16 문법」 같은 버전별 함정은 모든 문서가 넣으라는 쪽(「gotchas」).
9. **여러 세션 동시 실행**: Claude best practices 는 병렬 세션을 worktree 로 격리하라고 함(편집 충돌 방지). 지금은 같은 체크아웃에서 「남의 변경 건드리지 않기」 규칙으로 처리. worktree 를 쓰면 자동 메모리는 공유되고 `CLAUDE.local.md` 는 worktree 마다 따로라는 점을 알아 둘 것.
10. **다른 도구별 함정(쓸 경우만)**: Gemini CLI 는 기본 GEMINI.md 라 `context.fileName` 이 필요(단 문서상 2026-06-18 Antigravity CLI 로 대체, Antigravity 는 AGENTS.md 기본). Augment 는 CLAUDE.md 를 AGENTS.md 보다 먼저 보는데 `@AGENTS.md` 를 펼치는지 미확인 → 10줄짜리 CLAUDE.md 만 볼 위험. Devin CLI 는 AGENTS.md · CLAUDE.md 를 둘 다 always-on 으로 실음(중복 여부 미확인). Zed · OpenCode · Amp 는 AGENTS.md 를 먼저 골라 문제없음.

## B. 이름 있는 저장소 실측

조사일 2026-10-24. 63개 저장소를 `gh api`(저장소 정보 · `git/trees/<기본 브랜치>?recursive=1` · `contents` raw · 심볼릭 링크는 `git/blobs`)로 직접 열었다. 설치 · 실행 없음. 받은 원문은 `b/raw/`, 원자료는 `b/probe.json` · `b/analysis.json` · `b/symlinks.txt`.

### 범위 · 방법

- 표본: 63개(별 22 ~ 251,737, 중앙값 47,268, 별 1만 이상 47개). 그중 루트에 에이전트 파일(AGENTS.md · CLAUDE.md · GEMINI.md)이 있는 곳 54개, 없는 곳 9개. 비율은 따로 적지 않으면 「루트 파일이 있는 54개」 기준.
- 한국 · 일본 회사: toss 3 · daangn 2 · LINE 2 · mercari 2 · NAVER 1 · NaverPayDev 1 = 11개(코드 검색 `org:` 로 찾음). 우아한형제들 · 사이버에이전트는 에이전트 파일이 있는 저장소를 찾지 못함(미확인). `woowabros/woowahan-tech-blog` · `cyberagent/cyberagent-ai` 는 없는 저장소라 뺐다.
- 이름이 바뀐 곳은 API 응답 이름으로 적음: facebook/react → react/react, prisma/prisma → prisma/orm, calcom/cal.com → calcom/cal.diy, block/goose → aaif-goose/goose.
- 「주 파일」 = 심볼릭 링크도 아니고 `@AGENTS.md` 한 줄짜리도 아닌 쪽. 둘 다 내용이 있으면 큰 쪽.
- 하위 파일 = 루트가 아닌 경로의 `AGENTS.md` · `CLAUDE.md` · `GEMINI.md` · `AGENT.md`(대소문자 정확히). 소문자 `agents.md`(문서 페이지)와 템플릿 · 예제 · 스킬 참고 폴더 안 파일은 뺐다.
- 트리 API 가 잘린 저장소 4곳(microsoft/TypeScript · PostHog/posthog · twentyhq/twenty · elastic/kibana)은 하위 파일 수 · 동반 설정 수가 하한이다.
- 절 분류는 `##` 이하 제목 글자를 키워드로 15개 범주에 넣은 것(제목 없이 본문에만 있는 내용은 세지 않으므로 하한). 「명령」 「스타일」 「금지」는 정규식으로 센 뒤 낮게 나온 곳을 원문으로 다시 봤다.
- 열람: 전문 13개 · 부분(앞부분과 특정 절) 18개 · 나머지는 스크립트로 전문 측정 + 제목 목록 확인.

### 집계

#### 1. 어떤 파일을 두나 (63개)

| 루트 구성                         |                                                                                                                                       저장소 수 |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------: |
| AGENTS.md + CLAUDE.md             |                                                                                                                                              27 |
| AGENTS.md + CLAUDE.md + GEMINI.md |                                                                                                                                         1 (zed) |
| AGENTS.md 만                      |                                                                                                                                              17 |
| CLAUDE.md 만                      |                                                                                                                                               8 |
| GEMINI.md 만                      |                                                                                                                                  1 (gemini-cli) |
| 루트에 없음                       | 9 (codex · TypeScript · shadcn/ui · pydantic · vite · tauri · toss/frontend-fundamentals · line-bot-sdk-nodejs · mercari-microservices-example) |

- 주 파일 이름: AGENTS.md 39 · CLAUDE.md 14 · GEMINI.md 1 (54개 중).
- 루트에 없는 9곳 중 codex 는 하위 2곳, TypeScript · vite 는 `.github/copilot-instructions.md`, toss/frontend-fundamentals 는 `.cursor/rules` · 하위 CLAUDE.md 로 대신한다.

#### 2. 둘 다 가진 28개의 연결 방식

| 연결 방식                                         |  수 | 저장소                                                                                                            |
| ------------------------------------------------- | --: | ----------------------------------------------------------------------------------------------------------------- |
| CLAUDE.md = `@AGENTS.md` 한 줄(11바이트)          |  10 | supabase · sentry · ruff · grafana · n8n · mastra · tldraw · medusa · goose · daangn/seed-design                  |
| CLAUDE.md → AGENTS.md 심볼릭 링크                 |   8 | posthog · pydantic-ai · airflow · cal.diy · daangn/stackflow · openai-agents-python · prisma/orm · home-assistant |
| AGENTS.md → CLAUDE.md 심볼릭 링크(CLAUDE 가 정본) |   3 | bun · twenty · anthropics/buffa                                                                                   |
| 둘 다 제3 파일로 심볼릭 링크                      |   2 | transformers(`.ai/AGENTS.md`) · zed(`.rules`, GEMINI.md 도)                                                       |
| CLAUDE.md 5줄 안내 + 「See @AGENTS.md」           |   1 | cloudflare/workers-sdk                                                                                            |
| 내용을 따로 씀                                    |   4 | excalidraw · toss/es-toolkit · toss/react-simplikit · line/req-shield                                             |

- 정본을 하나로 묶은 곳 24/28(86%). AGENTS.md 가 정본 19 · CLAUDE.md 가 정본 3 · 제3 파일 2.
- 따로 쓴 4곳은 모두 겹침이나 어긋남이 있다(아래 「흔한 실수」 1).

#### 3. 루트 주 파일 크기 (54개)

|         |            줄 |           바이트 |
| ------- | ------------: | ---------------: |
| 최소    |    5 (vscode) |     271 (vscode) |
| 1사분위 |            61 |                — |
| 중앙값  |           137 |            7,462 |
| 3사분위 |           239 |                — |
| 최대    | 546 (next.js) | 46,010 (posthog) |
| 평균    |           176 |                — |

| 줄 수 구간 | 저장소 수 |
| ---------- | --------: |
| 0–50       |        11 |
| 51–100     |        10 |
| 101–200    |        14 |
| 201–300    |         9 |
| 301–600    |        10 |

- 300줄 넘는 10곳: next.js 546 · medusa 514 · payload 486 · n8n 456 · deno 433 · langchain 390 · anthropic-sdk-python 368 · posthog 342 · vercel/ai 324 · mercari/spanner-autoscaler 320.
- 줄 수와 바이트가 어긋나는 곳: posthog(342줄 46KB, 한 줄 최대 1,307자) · openai-agents-python(214줄 38KB) · pydantic-ai(170줄 19KB, 한 줄 최대 1,716자).

#### 4. 하위 폴더 파일

|                                             |      수 | 비율 |
| ------------------------------------------- | ------: | ---: |
| 하위 파일이 하나라도 있음(템플릿 제외)      | 30 / 63 |  48% |
| 루트 파일이 있는 54개 중                    | 28 / 54 |  52% |
| 10개 폴더 이상                              |       9 |    — |
| 루트 파일이 하위 파일을 직접 가리킴(정규식) | 12 / 28 |  43% |

- 10폴더 이상: medusa 85 · posthog 53+ · seed-design 28 · n8n 27 · pydantic-ai 20 · mastra 19 · airflow 13 · grafana 13 · bun 12.
- 하위에서도 짝을 맞춤: posthog(57폴더 CLAUDE.md 심볼릭) · pydantic-ai(15 심볼릭) · medusa(82개가 20바이트 이하 `@AGENTS.md` 짝) · sentry · supabase.

#### 5. 가장 흔한 절 (제목 기준, 54개)

| 순위 | 절 범주                                    | 저장소 수 | 비율 |
| ---: | ------------------------------------------ | --------: | ---: |
|    1 | 명령(빌드 · 실행 · 설치)                   |        42 |  78% |
|    2 | 코드 스타일 · 컨벤션                       |        36 |  67% |
|    3 | 커밋 · PR · Git                            |        34 |  63% |
|    3 | 구조 · 아키텍처                            |        34 |  63% |
|    5 | 테스트                                     |        32 |  59% |
|    6 | 개요                                       |        24 |  44% |
|    7 | 작업 절차(시작 전 · 끝난 뒤 확인)          |        22 |  41% |
|    8 | CI                                         |        19 |  35% |
|    9 | 금지 · 경계 · 함정                         |        18 |  33% |
|    9 | 문서 · 참고 링크                           |        18 |  33% |
| (11) | 린트 · 포맷 · 타입 / 스킬 · MCP · 플러그인 |     각 17 |  31% |
| (13) | 보안 · 비밀                                |        15 |  28% |

#### 6. 내용 지표 (54개)

| 지표                                                                             |                                                                        수 | 비율 |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------: | ---: |
| 빌드 · 테스트 · 린트 명령을 적음                                                 |                                                48 (+부분 2: uv · angular) |  89% |
| 명령 없음                                                                        |                                 4 (vscode · claude-code · svelte · react) |   7% |
| 코드 스타일 규칙                                                                 |                                                                        43 |  80% |
| 하지 말 것(Never · Do not · Don't · Avoid)                                       |                                                                        43 |  80% |
| 다른 문서로 넘김(.md 경로 언급 또는 상대 링크)                                   |                                                                        45 |  83% |
| 마크다운 상대 링크                                                               |                                                                        27 |  50% |
| 주 파일 안 `@경로` 임포트                                                        |                                                        2 (buffa · mastra) |   4% |
| 대문자 지시어(MUST · NEVER · ALWAYS · IMPORTANT · CRITICAL · DO NOT 등) 1회 이상 |                                                                        16 |  30% |
| 대문자 지시어 5회 이상                                                           |                                              3 (uv 13 · medusa 8 · bun 7) |   6% |
| 비밀값 · `.env` · 토큰 언급                                                      |                                                                        25 |  46% |
| 스킬 언급                                                                        |                                                                        24 |  44% |
| 커밋 서명(attribution) 언급                                                      |                                                                         8 |  15% |
| 「먼저 묻는다」 목록                                                             | 6 (airflow · cal.diy · seed-design · n8n · openai-agents-python · prisma) |  11% |
| 남의 작업 · worktree 변경 존중                                                   |              5 (ruff · biome · langchain · openai-agents-python · tldraw) |   9% |
| /init 상투 문구 「This file provides guidance to Claude Code」                   |                     4 파일 (cloudflare · pie · req-shield · billboard.js) |    — |
| 페르소나 문장 「You are …」                                                      |                                                    2 (temporal · cal.diy) |   4% |

대문자 지시어 개수는 중앙값 0. 「Prefer · Avoid」 같은 대문자 아닌 표현은 세지 않았다.

#### 7. 함께 두는 설정 (63개)

| 설정                                              | 저장소 수 | 비율 |
| ------------------------------------------------- | --------: | ---: |
| `.claude/` 무엇이든                               |        31 |  49% |
| └ `.claude/settings*.json`                        |        20 |  32% |
| └ `.claude/skills/`                               |        16 |  25% |
| └ `.claude/commands/`                             |         8 |  13% |
| └ `.claude/agents/`                               |         8 |  13% |
| └ `.claude/hooks/`                                |         5 |   8% |
| `.agents/skills/`                                 |        19 |  30% |
| 스킬 폴더(`.claude/skills` 또는 `.agents/skills`) |        31 |  49% |
| `.github/copilot-instructions.md`                 |        13 |  21% |
| `.github/instructions/`                           |         2 |   3% |
| `.cursor/rules` 또는 `.cursorrules`               |         3 |   5% |
| `.gemini/`                                        |         4 |   6% |
| `.codex/`                                         |         4 |   6% |

### 저장소별 측정

열: 주 파일 줄 / 바이트, 하위 파일(폴더 수), 「다른 문서로 넘김」 = 자기와 다른 이름의 .md 경로 언급 수 · 마크다운 상대 링크 수, 대문자 지시어 = 위 6의 정의. 별은 오늘 `gh api` 값.

| #   | 저장소                                |      별 | 루트 파일 · 연결                              | 주 파일 줄 / 바이트    | 하위 파일(폴더)       | 명령                       | 스타일                 | 금지 | 다른 문서로 넘김          | 대문자 지시어 | 동반 설정                                                    | 열람      |
| --- | ------------------------------------- | ------: | --------------------------------------------- | ---------------------- | --------------------- | -------------------------- | ---------------------- | ---- | ------------------------- | ------------: | ------------------------------------------------------------ | --------- |
| 1   | react/react                           | 251,737 | CLAUDE.md 만                                  | CLAUDE.md 13 / 359     | 1(1)                  | 없음                       | 없음                   | 없음 | md 0 · 링크 0             |             0 | .claude/(settings·skills)                                    | 전문      |
| 2   | n8n-io/n8n                            | 208,438 | 둘 다 · CLAUDE.md=`@AGENTS.md` 한 줄          | AGENTS.md 456 / 24,071 | 31(27)                | 있음                       | 있음                   | 있음 | md 11 · 링크 9            |             4 | .claude/(settings), .agents/skills 115                       | 지표+제목 |
| 3   | microsoft/vscode                      | 194,256 | AGENTS.md 만                                  | AGENTS.md 5 / 271      | 7(7)                  | 없음                       | 없음                   | 없음 | md 1 · 링크 1             |             0 | .agents/skills 18, copilot-instr, .github/instructions 36    | 전문      |
| 4   | huggingface/transformers              | 168,052 | 둘 다 · 둘 다 `.ai/AGENTS.md` 로 심볼릭       | AGENTS.md 40 / 3,287   | 1(1)                  | 있음                       | 없음                   | 있음 | md 4 · 링크 3             |             0 | copilot-instr                                                | 전문      |
| 5   | anthropics/claude-code                | 153,197 | CLAUDE.md 만                                  | CLAUDE.md 40 / 2,218   | 0                     | 없음                       | 없음                   | 있음 | md 0 · 링크 0             |             0 | .claude/(commands)                                           | 전문      |
| 6   | langchain-ai/langchain                | 148,348 | AGENTS.md 만                                  | AGENTS.md 390 / 20,580 | 0                     | 있음                       | 있음                   | 있음 | md 1 · 링크 0             |             4 | —                                                            | 지표+제목 |
| 7   | vercel/next.js                        | 143,214 | AGENTS.md 만                                  | AGENTS.md 546 / 32,064 | 6(6)                  | 있음                       | 있음                   | 있음 | md 12 · 링크 0            |             1 | .agents/skills 77                                            | 부분      |
| 8   | excalidraw/excalidraw                 | 134,456 | 둘 다 · 내용 따로                             | CLAUDE.md 34 / 1,295   | 0                     | 있음                       | 있음(AGENTS.md 쪽)     | 없음 | md 0 · 링크 0             |             0 | copilot-instr                                                | 전문      |
| 9   | openai/codex                          | 130,717 | 없음                                          | —                      | 2(2)                  | —                          | —                      | —    | —                         |             — | —                                                            | 트리만    |
| 10  | shadcn-ui/ui                          | 126,385 | 없음                                          | —                      | 0 (템플릿 4)          | —                          | —                      | —    | —                         |             — | .claude/(settings)                                           | 트리만    |
| 11  | supabase/supabase                     | 113,829 | 둘 다 · CLAUDE.md=`@AGENTS.md` 한 줄          | AGENTS.md 75 / 6,918   | 6(3)                  | 있음                       | 있음                   | 있음 | md 1 · 링크 0             |             0 | .claude/(settings), .agents/skills 107, copilot-instr        | 부분      |
| 12  | tauri-apps/tauri                      | 112,152 | 없음                                          | —                      | 0                     | —                          | —                      | —    | —                         |             — | —                                                            | 트리만    |
| 13  | microsoft/TypeScript                  | 111,582 | 없음                                          | —                      | 0 트리잘림·하한       | —                          | —                      | —    | —                         |             — | copilot-instr                                                | 트리만    |
| 14  | denoland/deno                         | 108,739 | CLAUDE.md 만                                  | CLAUDE.md 433 / 11,866 | 0                     | 있음                       | 있음                   | 없음 | md 1 · 링크 2             |             0 | .claude/(skills), copilot-instr                              | 지표+제목 |
| 15  | google-gemini/gemini-cli              | 107,573 | GEMINI.md 만                                  | GEMINI.md 96 / 4,610   | 7(7)                  | 있음                       | 있음                   | 없음 | md 1 · 링크 0             |             0 | .gemini                                                      | 지표+제목 |
| 16  | angular/angular                       | 101,098 | AGENTS.md 만                                  | AGENTS.md 39 / 2,052   | 3(2)                  | 부분                       | 있음                   | 있음 | md 3 · 링크 3             |             2 | .gemini                                                      | 전문      |
| 17  | microsoft/playwright                  |  98,392 | AGENTS.md 만                                  | AGENTS.md 177 / 8,790  | 0                     | 있음                       | 있음                   | 있음 | md 6 · 링크 5             |             2 | .claude/(skills), copilot-instr                              | 지표+제목 |
| 18  | oven-sh/bun                           |  96,366 | 둘 다 · AGENTS→CLAUDE 심볼릭                  | CLAUDE.md 240 / 17,660 | 16(12)                | 있음                       | 있음                   | 있음 | md 2 · 링크 0             |             7 | .claude/(settings·skills·commands·hooks)                     | 지표+제목 |
| 19  | zed-industries/zed                    |  92,114 | 둘 다 · 둘 다 `.rules` 로 심볼릭 (+GEMINI.md) | AGENTS.md 190 / 12,461 | 1(1)                  | 있음(clippy 스크립트 중심) | 있음                   | 있음 | md 3 · 링크 0             |             1 | .agents/skills 8                                             | 부분      |
| 20  | home-assistant/core                   |  91,686 | 둘 다 · CLAUDE→AGENTS 심볼릭                  | AGENTS.md 57 / 5,708   | 0                     | 있음                       | 있음                   | 있음 | md 2 · 링크 1             |             1 | .claude/(skills·agents), copilot-instr, .gemini              | 부분      |
| 21  | astral-sh/uv                          |  91,094 | AGENTS.md 만                                  | AGENTS.md 49 / 3,746   | 0                     | 부분                       | 있음                   | 있음 | md 1 · 링크 0             |            13 | .codex                                                       | 전문      |
| 22  | sveltejs/svelte                       |  88,429 | AGENTS.md 만                                  | AGENTS.md 15 / 667     | 0                     | 없음                       | 없음                   | 있음 | md 4 · 링크 2             |             2 | .agents/skills 2                                             | 전문      |
| 23  | vitejs/vite                           |  83,496 | 없음                                          | —                      | 0                     | —                          | —                      | —    | —                         |             — | copilot-instr                                                | 트리만    |
| 24  | grafana/grafana                       |  77,469 | 둘 다 · CLAUDE.md=`@AGENTS.md` 한 줄          | AGENTS.md 180 / 10,582 | 13(13)                | 있음                       | 있음                   | 있음 | md 1 · 링크 0             |             0 | .claude/(skills)                                             | 지표+제목 |
| 25  | withastro/astro                       |  63,425 | AGENTS.md 만                                  | AGENTS.md 165 / 8,925  | 0                     | 있음                       | 있음                   | 있음 | md 6 · 링크 4             |             0 | .agents/skills 47                                            | 부분      |
| 26  | twentyhq/twenty                       |  59,616 | 둘 다 · AGENTS→CLAUDE 심볼릭                  | CLAUDE.md 60 / 6,496   | 12(6) 트리잘림·하한   | 있음                       | 있음                   | 있음 | md 2 · 링크 0             |             0 | .claude/(settings·skills)                                    | 전문      |
| 27  | aaif-goose/goose                      |  55,604 | 둘 다 · CLAUDE.md=`@AGENTS.md` 한 줄          | AGENTS.md 132 / 6,212  | 2(1)                  | 있음                       | 있음                   | 있음 | md 1 · 링크 0             |             0 | copilot-instr                                                | 지표+제목 |
| 28  | tldraw/tldraw                         |  51,060 | 둘 다 · CLAUDE.md=`@AGENTS.md` 한 줄          | AGENTS.md 228 / 13,890 | 0                     | 있음                       | 있음                   | 있음 | md 3 · 링크 0             |             0 | .claude/(settings)                                           | 부분      |
| 29  | astral-sh/ruff                        |  50,248 | 둘 다 · CLAUDE.md=`@AGENTS.md` 한 줄          | AGENTS.md 226 / 19,854 | 0                     | 있음                       | 있음                   | 있음 | md 7 · 링크 4             |             0 | .claude/(settings·hooks), .agents/skills 23                  | 부분      |
| 30  | calcom/cal.diy                        |  49,267 | 둘 다 · CLAUDE→AGENTS 심볼릭                  | AGENTS.md 244 / 9,225  | 1(1)                  | 있음                       | 있음                   | 있음 | md 8 · 링크 8             |             0 | .claude/(settings)                                           | 부분      |
| 31  | prisma/orm                            |  47,664 | 둘 다 · CLAUDE→AGENTS 심볼릭                  | AGENTS.md 134 / 11,516 | 0                     | 있음                       | 있음                   | 있음 | md 27 · 링크 25           |             0 | .claude/(settings)                                           | 지표+제목 |
| 32  | apache/airflow                        |  47,268 | 둘 다 · CLAUDE→AGENTS 심볼릭                  | AGENTS.md 251 / 22,567 | 14(13)                | 있음                       | 있음                   | 있음 | md 9 · 링크 16            |             0 | .claude/(skills), .agents/skills 40, .github/instructions 1  | 지표+제목 |
| 33  | getsentry/sentry                      |  45,632 | 둘 다 · CLAUDE.md=`@AGENTS.md` 한 줄          | AGENTS.md 134 / 7,002  | 8(5)                  | 있음                       | 있음                   | 있음 | md 1 · 링크 0             |             4 | .claude/(settings·commands), .agents/skills 136              | 부분      |
| 34  | payloadcms/payload                    |  45,458 | AGENTS.md 만                                  | AGENTS.md 486 / 22,472 | 0 (템플릿 2)          | 있음                       | 있음                   | 있음 | md 0 · 링크 0             |             4 | .claude/(settings·commands·hooks), .agents/skills 50, .codex | 지표+제목 |
| 35  | langchain-ai/langgraph                |  43,799 | AGENTS.md 만                                  | AGENTS.md 65 / 2,113   | 0                     | 있음                       | 없음                   | 없음 | md 0 · 링크 0             |             0 | —                                                            | 지표+제목 |
| 36  | PostHog/posthog                       |  40,397 | 둘 다 · CLAUDE→AGENTS 심볼릭                  | AGENTS.md 342 / 46,010 | 106(53) 트리잘림·하한 | 있음                       | 있음                   | 있음 | md 19 · 링크 27           |             2 | .agents/skills 397                                           | 부분      |
| 37  | medusajs/medusa                       |  36,897 | 둘 다 · CLAUDE.md=`@AGENTS.md` 한 줄          | AGENTS.md 514 / 18,395 | 167(85)               | 있음                       | 있음                   | 있음 | md 7 · 링크 16            |             8 | .claude/(skills·commands·agents)                             | 부분      |
| 38  | openai/openai-python                  |  31,928 | AGENTS.md 만                                  | AGENTS.md 128 / 6,541  | 0                     | 있음                       | 있음                   | 있음 | md 4 · 링크 1             |             0 | —                                                            | 지표+제목 |
| 39  | openai/openai-agents-python           |  30,247 | 둘 다 · CLAUDE→AGENTS 심볼릭                  | AGENTS.md 214 / 38,241 | 0                     | 있음                       | 있음                   | 있음 | md 24 · 링크 23           |             0 | .agents/skills 91                                            | 지표+제목 |
| 40  | pydantic/pydantic                     |  29,162 | 없음                                          | —                      | 0                     | —                          | —                      | —    | —                         |             — | .agents/skills 2                                             | 트리만    |
| 41  | mastra-ai/mastra                      |  29,041 | 둘 다 · CLAUDE.md=`@AGENTS.md` 한 줄          | AGENTS.md 18 / 1,760   | 23(19)                | 있음                       | 있음                   | 있음 | md 1 · 링크 0             |             0 | .claude/(settings·skills·commands), .agents/skills 6         | 전문      |
| 42  | vercel/ai                             |  27,492 | AGENTS.md 만                                  | AGENTS.md 324 / 13,636 | 3(2)                  | 있음                       | 있음                   | 있음 | md 10 · 링크 1            |             0 | .claude/(settings), .codex                                   | 지표+제목 |
| 43  | biomejs/biome                         |  25,987 | AGENTS.md 만                                  | AGENTS.md 88 / 5,178   | 0                     | 있음                       | 있음                   | 있음 | md 9 · 링크 6             |             0 | .agents/skills 32                                            | 지표+제목 |
| 44  | temporalio/temporal                   |  23,948 | AGENTS.md 만                                  | AGENTS.md 42 / 2,483   | 1(1)                  | 있음                       | 없음                   | 없음 | md 1 · 링크 1             |             1 | .claude/(skills), .cursor, copilot-instr                     | 전문      |
| 45  | elastic/kibana                        |  21,338 | AGENTS.md 만                                  | AGENTS.md 104 / 7,574  | 5(5) 트리잘림·하한    | 있음                       | 있음                   | 있음 | md 1 · 링크 0             |             0 | .claude/(settings·agents·hooks), .agents/skills 153, .codex  | 지표+제목 |
| 46  | pydantic/pydantic-ai                  |  20,825 | 둘 다 · CLAUDE→AGENTS 심볼릭                  | AGENTS.md 170 / 19,075 | 35(20)                | 있음                       | 있음                   | 있음 | md 17 · 링크 40           |             0 | .claude/(settings·skills), .agents/skills 38, .gemini        | 지표+제목 |
| 47  | toss/es-toolkit                       |  11,378 | 둘 다 · 내용 따로                             | AGENTS.md 152 / 9,234  | 1(1)                  | 있음                       | 있음                   | 있음 | md 6 · 링크 8             |             0 | .claude/(skills)                                             | 부분      |
| 48  | anthropics/claude-code-action         |   9,625 | CLAUDE.md 만                                  | CLAUDE.md 58 / 5,629   | 1(1)                  | 있음                       | 있음                   | 있음 | md 0 · 링크 0             |             0 | .claude/(settings·commands·agents)                           | 지표+제목 |
| 49  | anthropics/claude-agent-sdk-python    |   8,341 | CLAUDE.md 만                                  | CLAUDE.md 84 / 4,111   | 0                     | 있음                       | 없음                   | 있음 | md 1 · 링크 0             |             0 | .claude/(settings·skills·commands·agents)                    | 지표+제목 |
| 50  | naver/billboard.js                    |   6,022 | AGENTS.md 만                                  | AGENTS.md 112 / 4,099  | 0                     | 있음                       | 있음                   | 없음 | md 0 · 링크 0             |             0 | copilot-instr                                                | 지표+제목 |
| 51  | cloudflare/workers-sdk                |   4,651 | 둘 다 · CLAUDE.md 5줄 「See @AGENTS.md」      | AGENTS.md 157 / 9,450  | 6(6)                  | 있음                       | 있음                   | 있음 | md 2 · 링크 0             |             0 | —                                                            | 부분      |
| 52  | anthropics/anthropic-sdk-python       |   4,002 | CLAUDE.md 만                                  | CLAUDE.md 368 / 31,559 | 0                     | 있음                       | 있음                   | 있음 | md 7 · 링크 2             |             0 | —                                                            | 부분      |
| 53  | anthropics/anthropic-sdk-typescript   |   2,150 | CLAUDE.md 만                                  | CLAUDE.md 298 / 31,053 | 0                     | 있음                       | 있음                   | 있음 | md 5 · 링크 1             |             0 | —                                                            | 부분      |
| 54  | toss/frontend-fundamentals            |   2,003 | 없음                                          | —                      | 1(1)                  | —                          | —                      | —    | —                         |             — | .cursor                                                      | 트리만    |
| 55  | daangn/seed-design                    |   1,183 | 둘 다 · CLAUDE.md=`@AGENTS.md` 한 줄          | AGENTS.md 77 / 5,966   | 28(28)                | 있음                       | 없음(문서 작성 규칙만) | 있음 | md 6 · 링크 6             |             0 | .claude/(settings·agents·hooks)                              | 전문      |
| 56  | line/line-bot-sdk-nodejs              |   1,080 | 없음                                          | —                      | 0                     | —                          | —                      | —    | —                         |             — | —                                                            | 트리만    |
| 57  | daangn/stackflow                      |   1,033 | 둘 다 · CLAUDE→AGENTS 심볼릭                  | AGENTS.md 236 / 6,345  | 0                     | 있음                       | 있음                   | 있음 | md 0 · 링크 0             |             0 | .claude/(skills), .agents/skills 28                          | 지표+제목 |
| 58  | anthropics/buffa                      |     926 | 둘 다 · AGENTS→CLAUDE 심볼릭                  | CLAUDE.md 30 / 1,789   | 0                     | 있음                       | 없음                   | 없음 | md 2 · 링크 1 · @임포트 1 |             0 | .claude/(settings·agents)                                    | 전문      |
| 59  | mercari/mercari-microservices-example |     359 | 없음                                          | —                      | 0                     | —                          | —                      | —    | —                         |             — | —                                                            | 트리만    |
| 60  | toss/react-simplikit                  |     358 | 둘 다 · 내용 따로                             | CLAUDE.md 222 / 10,895 | 0                     | 있음                       | 있음                   | 있음 | md 2 · 링크 0             |             0 | .claude/(skills·agents), .cursor, copilot-instr              | 부분      |
| 61  | NaverPayDev/pie                       |     115 | CLAUDE.md 만                                  | CLAUDE.md 81 / 3,560   | 7(7)                  | 있음                       | 있음                   | 없음 | md 0 · 링크 7             |             0 | —                                                            | 지표+제목 |
| 62  | mercari/spanner-autoscaler            |      90 | AGENTS.md 만                                  | AGENTS.md 320 / 12,414 | 0                     | 있음                       | 없음                   | 있음 | md 3 · 링크 0             |             4 | —                                                            | 부분      |
| 63  | line/req-shield                       |      22 | 둘 다 · 내용 따로                             | CLAUDE.md 140 / 7,350  | 0                     | 있음                       | 있음                   | 없음 | md 0 · 링크 0             |             0 | —                                                            | 부분      |

### 저장소별 절 목록 · 특징

| 저장소                                | 절 목록(## 제목, 앞 12개)                                                                                                                                                                                                                              | 눈에 띄는 점                                                                                                                                                                                                                                          |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| react/react                           | Monorepo Overview · Current Active Work                                                                                                                                                                                                                | CLAUDE.md 13줄. 「Current Active Work」에 브랜치 이름(`rust-research`) — 시점 정보. `compiler/CLAUDE.md` 10KB. `.claude/skills` 14.                                                                                                                   |
| n8n-io/n8n                            | Project Overview · General Guidelines · Agent Skills and Claude Code Plugin · Essential Commands · Architecture Overview · Technology Stack · Key Development Patterns · Design Principles · Github Guidelines                                         | 456줄. 「Fresh checkout / agent setup」, 「Customer Confidentiality」. 하위 27폴더. `.agents/skills` 115.                                                                                                                                             |
| microsoft/vscode                      | VS Code Agents Instructions                                                                                                                                                                                                                            | AGENTS.md 5줄 = `.github/copilot-instructions.md`(162줄)로 넘기는 표지. `.github/instructions/` 36파일(경로별 지시), `.agents/skills` 18.                                                                                                             |
| huggingface/transformers              | Commands · Local agent setup · Before opening a PR · Copies and modular models                                                                                                                                                                         | AGENTS·CLAUDE 둘 다 `.ai/AGENTS.md` 로 심볼릭, 40줄. `make codex` / `make claude` 로 로컬 자산 연결, 첫 기여자 에이전트 PR 금지, modular 함정 2개.                                                                                                    |
| anthropics/claude-code                | Security hardening for GitHub Actions                                                                                                                                                                                                                  | 40줄. GitHub Actions 보안(egress 방화벽 러너·허용 목록·auto 권한 모드)만 다룸. 빌드 명령 없음. `.claude/commands` 3.                                                                                                                                  |
| langchain-ai/langchain                | Corridor security analysis · Project architecture and context · Core development principles · Model profiles · CI/CD infrastructure · GitHub Actions & Workflows · Additional resources · OpenWiki                                                     | 390줄 20KB. 공개 인터페이스 안정성, 보안·위험 평가, CI·릴리스.                                                                                                                                                                                        |
| vercel/next.js                        | This is NOT the Turborepo you know                                                                                                                                                                                                                     | 546줄로 표본 최장. 「Context-Efficient Workflows」(큰 파일은 grep 먼저, 빌드 출력은 파일로 한 번 저장 후 재분석). 끝 절은 turbo 가 에이전트를 감지하면 자동으로 다시 넣는 블록이라고 스스로 밝힘. `.agents/skills` 77파일.                            |
| excalidraw/excalidraw                 | Project Structure · Development Workflow · Development Commands · Architecture Notes                                                                                                                                                                   | AGENTS.md 4줄(규칙 2개) + CLAUDE.md 34줄(구조·명령)이 따로, 서로 언급 없음.                                                                                                                                                                           |
| openai/codex                          | —                                                                                                                                                                                                                                                      | 루트 AGENTS.md 없음(오늘 HEAD 기준). `codex-rs/` 아래 2곳에만 좁은 AGENTS.md.                                                                                                                                                                         |
| shadcn-ui/ui                          | —                                                                                                                                                                                                                                                      | 루트 없음. `templates/` 안에만 AGENTS·CLAUDE(사용자 프로젝트용 템플릿).                                                                                                                                                                               |
| supabase/supabase                     | Structure · Common Commands · CI · Conventions · Skills · Studio                                                                                                                                                                                       | 75줄. 디렉터리 지도를 표 한 개로, 하위 문서가 있는 앱은 표 안에 표시. 앱마다 AGENTS.md + CLAUDE.md(@AGENTS.md) 짝. `.agents/skills` 107.                                                                                                              |
| tauri-apps/tauri                      | —                                                                                                                                                                                                                                                      | 에이전트 파일 없음.                                                                                                                                                                                                                                   |
| microsoft/TypeScript                  | —                                                                                                                                                                                                                                                      | AGENTS/CLAUDE 없음. `.github/copilot-instructions.md` 144줄 + `.github/agents/`. 트리 잘림.                                                                                                                                                           |
| denoland/deno                         | Table of Contents · Git workflow · High Level Overview · Quick Start · Commands · Testing · "spec" tests · Development Workflows · Debugging · Codebase Navigation · Troubleshooting                                                                   | CLAUDE.md 만 433줄. 목차, 디버깅·문제해결 절 — 사람용 개발 가이드에 가까움. 금지 목록 없음.                                                                                                                                                           |
| google-gemini/gemini-cli              | Project Overview · Building and Running · Testing and Quality · Development Conventions · Testing Conventions · Documentation                                                                                                                          | GEMINI.md 만 96줄, 패키지 7곳 GEMINI.md. `.gemini/` 71파일.                                                                                                                                                                                           |
| angular/angular                       | Environment · Key Documentation · Testing · Pull Requests                                                                                                                                                                                              | 39줄. 머리에 `trigger: always_on` frontmatter, 핵심 문서 3개 링크 + 테스트 규칙만 구체적. `adev/` 에 AGENTS·GEMINI 짝.                                                                                                                                |
| microsoft/playwright                  | Build · Lint and type check · Test Commands · DEPS System · Coding Convention · Commit Convention · Development Guides                                                                                                                                 | 177줄. 「No agent attribution — overrides agent defaults」. `.claude/skills` 25.                                                                                                                                                                      |
| oven-sh/bun                           | Building and Running Bun · Testing · Code Architecture · JavaScript Modules (`src/js/`) · Landing PRs: What Bun Reviewers Catch · Important Development Notes · Debugging CI Failures · Reading PR Feedback                                            | CLAUDE.md 정본 240줄 + AGENTS.md→CLAUDE.md. CRITICAL 5회. 「Landing PRs: What Bun Reviewers Catch」. `.claude/` commands·hooks·skills(17).                                                                                                            |
| zed-industries/zed                    | Timers in tests · GPUI · Pull request hygiene · Crash Investigation · Rules Hygiene                                                                                                                                                                    | AGENTS·CLAUDE·GEMINI 모두 `.rules` 로 심볼릭, 190줄. GPUI 규칙 + 「Rules Hygiene」(새 규칙 3조건, 「지도가 아니라 함정」, 규칙 추가는 PR 설명에 제안).                                                                                                |
| home-assistant/core                   | Git Commit Guidelines · Pull Requests · Development Commands · Python Syntax Notes · Testing · Good practices · AI policy                                                                                                                              | 57줄, 제목 「GitHub Copilot & Claude Code Instructions」, CLAUDE→AGENTS. 「AI policy」.                                                                                                                                                               |
| astral-sh/uv                          | (제목 없음)                                                                                                                                                                                                                                            | 49줄, 제목 없음. 모든 줄이 ALWAYS · NEVER · PREFER · AVOID · DO NOT 로 시작하는 목록(대문자 지시어 13 + PREFER/AVOID). 명령은 CONTRIBUTING.md 로.                                                                                                     |
| sveltejs/svelte                       | Security Policy · Quick Reference                                                                                                                                                                                                                      | 15줄. CONTRIBUTING.md · PR 템플릿으로 넘기고 스킬 하나만 언급.                                                                                                                                                                                        |
| vitejs/vite                           | —                                                                                                                                                                                                                                                      | 루트 없음. copilot-instructions.md 50줄만.                                                                                                                                                                                                            |
| grafana/grafana                       | Project Overview · Principles · Code Review Rules · Comments · Human Review Gates · Commands · Architecture · Key Notes · Cursor Cloud specific instructions                                                                                           | 180줄. 「Human Review Gates」, 「Cursor Cloud specific instructions」 절. 하위 13폴더.                                                                                                                                                                |
| withastro/astro                       | Simplicity First · Surgical Changes · Goal-Driven Execution · Style Guide · Writing Comments · Environment Guide · Monorepo Structure · Running Tests · Astro Quick Reference · Background Dev Servers · `agent-browser` · Deep Dives                  | 165줄. 앞 네 절(Think Before Coding · Simplicity First · Surgical Changes · Goal-Driven Execution)은 저장소와 무관한 일반 원칙, 뒤가 저장소 특정. `.agents/skills` 47.                                                                                |
| twentyhq/twenty                       | House rules · Comment sparingly · Commands · Gotchas                                                                                                                                                                                                   | CLAUDE.md 정본 60줄 + AGENTS→CLAUDE. 「House rules — Where this repo differs from your defaults」, 주석 상한 5줄, 「Gotchas」(이유와 함께). 트리 잘림.                                                                                                |
| aaif-goose/goose                      | Contribution Workflow · MCP Server Directory · GitHub Communication · Setup · Commands · Structure · Development Loop · Rules · Code Quality · Never · Entry Points                                                                                    | (block/goose 요청 → aaif-goose/goose) 132줄, CLAUDE.md=`@AGENTS.md`. 「Never」 절, 「Run these only if the user has asked you to build」.                                                                                                             |
| tldraw/tldraw                         | Core rules · Repo overview · Setup · Common commands · Validation workflow · Architecture notes · Where to work · Testing guidance · Documentation and examples · Skills · Code conventions · Comments                                                 | 228줄, CLAUDE.md=`@AGENTS.md`. 맨 앞 「Core rules」 8줄(pnpm 만, bare `tsc` 금지, 남의 worktree 변경 되돌리지 말 것).                                                                                                                                 |
| astral-sh/ruff                        | Before contributing · PR conventions · Code Review Rules · Writing for human readers · Running Tests · Writing mdtests · Running Clippy · Running Debug Builds · Working on ty · Development Guidelines                                                | 226줄, CLAUDE.md=`@AGENTS.md`. 「Writing for human readers」(대화·세션 이력을 주석·PR 에 새지 말 것). `.claude/hooks`.                                                                                                                                |
| calcom/cal.diy                        | Do · Don't · PR Size Guidelines · Commands · Boundaries · Project Structure · Tech Stack · Code Examples · PR Checklist · When Stuck · Spec-Driven Development (Opt-In) · Extended Documentation                                                       | (calcom/cal.com 요청 → API 가 cal.diy 로 응답) 244줄, 페르소나로 시작. Do / Don't, Always do · Ask first · Never do 3단 경계, PR 크기 기준, 좋은 예 코드.                                                                                             |
| prisma/orm                            | Start Here · Project Overview · Where skills and rules live · Golden Rules · Typesafety rules · Common Commands · Core Concepts · Frequent Tasks · Check requests and proposals against the vision · Subsystem Deep Dives · Ask First                  | (prisma/prisma 요청 → prisma/orm) 134줄, 제목 「Agents — Prisma 8」. 「Golden Rules」 「Ask First」, 상대 링크 25. `.agents/` 91파일.                                                                                                                 |
| apache/airflow                        | Shared libraries                                                                                                                                                                                                                                       | 251줄 22KB, CLAUDE→AGENTS 심볼릭. 「Architecture Boundaries」 「Security Model」 「Boundaries」. 하위 13폴더.                                                                                                                                         |
| getsentry/sentry                      | Command Execution Guide · Agent Skills · Feature Flags (FlagPole) · Customer Information · Pull Requests                                                                                                                                               | 134줄. 맨 위 「AGENTS.md 가 정본, CLAUDE.md·Cursor rules 에 쓰지 말 것」. CLAUDE.md 는 루트·하위 모두 `@AGENTS.md`. 「Context-Aware Loading」으로 하위 문서 안내.                                                                                     |
| payloadcms/payload                    | Project Structure · Quick Start · Build Commands · Development · Testing · Linting & Formatting · Internationalization · Commit & PR Guidelines · Additional Resources · Admin Panel                                                                   | 486줄 22KB, 명령 언급 44. Playwright MCP, CSS · RSC 번들링 규칙까지.                                                                                                                                                                                  |
| langchain-ai/langgraph                | Corridor security analysis · Libraries                                                                                                                                                                                                                 | 65줄. 라이브러리 의존 지도 + make format/lint/test.                                                                                                                                                                                                   |
| PostHog/posthog                       | Codebase Structure · Commands · Commits and Pull Requests · CI / GitHub Actions · Security · Architecture guidelines · Code Style · User-facing copy · Feature usage tracking · Agent automation                                                       | 342줄 46KB(한 줄 최대 1,307자). 하위 53폴더 이상에 AGENTS.md + CLAUDE.md 심볼릭 짝(하위 문서는 「Pointers, not content」). 「Mandatory skill invocation」 = diff 내용별 스킬 트리거 목록. `.agents/skills` 397. 트리 잘림.                            |
| medusajs/medusa                       | Building on Medusa                                                                                                                                                                                                                                     | 루트 514줄. 패키지마다 AGENTS.md + CLAUDE.md(`@AGENTS.md`) 85폴더. 루트는 「Building on Medusa」 표로 패키지 문서를 가리킴.                                                                                                                           |
| openai/openai-python                  | Generated SDK · Custom-code budget · Security requirements for coding agents · Python version policy · Changing the minimum Python version · Automation map · Validation · Large-payload compatibility                                                 | 128줄. 「Generated SDK」 「Custom-code budget」 「Security requirements for coding agents」.                                                                                                                                                          |
| openai/openai-agents-python           | Table of Contents · Policies & Mandatory Rules · Code Review Rules · Project Structure Guide · Operation Guide                                                                                                                                         | 214줄 38KB, 목차. 「Policies & Mandatory Rules」, ExecPlans, 「Mandatory Skill Usage」, 작업 상태 보고 규칙. `.agents/skills` 91.                                                                                                                     |
| pydantic/pydantic                     | —                                                                                                                                                                                                                                                      | 루트 없음. `.agents/skills` 2파일만.                                                                                                                                                                                                                  |
| mastra-ai/mastra                      | Repository guidance                                                                                                                                                                                                                                    | 18줄 색인형. 「가장 가까운 AGENTS.md 를 먼저」, `@.claude/commands/` · `@.agents/skills/` 로 넘김. 하위 19폴더(템플릿 제외).                                                                                                                          |
| vercel/ai                             | Project Overview · Repository Structure · Development Setup · Development Commands · Core APIs · Import Patterns · Coding Standards · Error Pattern · Architecture Decision Records (ADRs) · Project Philosophies · Architecture · Contributing Guides | 324줄. ADR 절, 작업 유형별(버그·기능·리팩터) 완료 기준, 마지막 「Do Not」 절.                                                                                                                                                                         |
| biomejs/biome                         | Communication · Before Editing · Implementation Gate · Final Review · User-Facing Changes · Pull Requests · Comments and Rustdoc · Rust Style · Cargo Dependencies · Skills                                                                            | 88줄. Before Editing → Implementation Gate → Final Review 절차형. `.agents/skills` 32.                                                                                                                                                                |
| temporalio/temporal                   | Project Structure · Development Commands · Development Workflow                                                                                                                                                                                        | 42줄. 페르소나 문장(「You are an experienced developer…」)으로 시작, 42줄 중 20줄 남짓이 디렉터리 목록. 코드 규칙은 copilot-instructions.md 로 넘김. `.cursor/rules` 있음.                                                                            |
| elastic/kibana                        | Setup · Overview · Testing · Code Style Guidelines · Internationalization (i18n) · CI · Contribution Hygiene                                                                                                                                           | 104줄. `.claude/CLAUDE.md` 가 따로(루트 아님). `.agents/skills` 153. 트리 잘림.                                                                                                                                                                       |
| pydantic/pydantic-ai                  | Gathering context on the task · Ensuring the task is ready for implementation · Philosophy · Requirements of all contributions · Coding Guidelines                                                                                                     | 170줄 19KB(한 줄 최대 1,716자). 첫 제목이 「Your primary responsibility is to the project and its users」. 하위 20폴더 AGENTS.md + CLAUDE.md 심볼릭 짝. 상대 링크 40개.                                                                               |
| toss/es-toolkit                       | Project overview · Development environment · Repository structure · Principles · Coding conventions · Development workflow · Documentation standards · Pull request standards · Adding dependencies · Changelog                                        | AGENTS.md 152 + CLAUDE.md 54 따로(CLAUDE 는 빠른 참조 + 「사용자 언어로 답」). `docs/CLAUDE.md`. `.claude/skills` 12.                                                                                                                                 |
| anthropics/claude-code-action         | Commands · What This Is · How It Runs · Key Concepts · Things That Will Bite You · Code Conventions · Security hardening for GitHub Actions                                                                                                            | 58줄. 「Things That Will Bite You」 절. `base-action/CLAUDE.md` 하위 1. `.claude/agents` 5.                                                                                                                                                           |
| anthropics/claude-agent-sdk-python    | Codebase Structure · Security hardening for GitHub Actions                                                                                                                                                                                             | 84줄. Workflow · 구조 · Actions 보안. `.claude/` commands·agents·skills 모두 있음.                                                                                                                                                                    |
| naver/billboard.js                    | Project Overview · Common Commands · Architecture · Test Structure · Commit Convention                                                                                                                                                                 | 112줄. AGENTS.md 인데 /init 의 「This file provides guidance to Claude Code」 문구로 시작.                                                                                                                                                            |
| cloudflare/workers-sdk                | Start Here · Common Commands · Repository Map · Cross-Tool Development Features · Implementation Conventions · Dependencies and Security · Testing Conventions · Changes and Pull Requests · Package-Specific Guidance                                 | AGENTS.md 157줄 + CLAUDE.md 5줄(「See @AGENTS.md」). 패키지 6곳 AGENTS.md, 끝 「Package-Specific Guidance」로 연결.                                                                                                                                   |
| anthropics/anthropic-sdk-python       | Overview · Build, test, lint · Sync and async · Platform clients · Code organization · Errors · Common mistakes · Style notes · Tests · Commits and pull requests                                                                                      | 368줄 31KB. 생성 파일 소유권, `./scripts/{bootstrap,format,lint,test}` 만 쓰라는 진입점 규칙, 「Common mistakes」 「Tripwire tests」.                                                                                                                 |
| anthropics/anthropic-sdk-typescript   | This repository's own rules · Rules every SDK shares · Rules every client library shares · TypeScript                                                                                                                                                  | 298줄 31KB. 「이 저장소 규칙 → 모든 SDK 공통 → 모든 클라이언트 공통 → TypeScript」 층 구조라 같은 절 이름(Errors, Tests 등)이 여러 번 반복.                                                                                                           |
| toss/frontend-fundamentals            | —                                                                                                                                                                                                                                                      | 루트 없음. `.cursor/rules` 3 + 하위 CLAUDE.md 1.                                                                                                                                                                                                      |
| daangn/seed-design                    | 시작 · 검증 · 생성 · 경계 · 학습 기록 · 문서 · Git                                                                                                                                                                                                     | 한국어 77줄 · 한다체. 시작 · 검증 · 생성 · 경계 · 학습 기록 · 문서 · Git. 「루트부터 대상 경로까지 AGENTS.md 모두 읽기」, 경로별 검증 명령, 「새 규칙은 가장 좁은 경로에」 「금지 규칙엔 대신 할 행동」, `.agents/learnings/` 교훈 기록. 하위 28폴더. |
| line/line-bot-sdk-nodejs              | —                                                                                                                                                                                                                                                      | 에이전트 파일 없음.                                                                                                                                                                                                                                   |
| daangn/stackflow                      | Project Overview · Architecture · Project Structure · Development Commands · Testing · Key Dependencies · Plugin System · Important Patterns · Common Tasks · API Design · Build System · Skills                                                       | 236줄, 제목 「Stackflow Project Memory」, CLAUDE→AGENTS 심볼릭. `.agents/skills` 28.                                                                                                                                                                  |
| anthropics/buffa                      | After Changing Codegen Output · Pre-Commit Code Review                                                                                                                                                                                                 | CLAUDE.md 정본 30줄 + AGENTS.md→CLAUDE.md. 첫 줄 `@CONTRIBUTING.md` 임포트, 커밋 전 리뷰 서브에이전트 2개를 병렬로 돌리라는 규칙.                                                                                                                     |
| mercari/mercari-microservices-example | —                                                                                                                                                                                                                                                      | 에이전트 파일 없음.                                                                                                                                                                                                                                   |
| toss/react-simplikit                  | Project Overview · Development Quick Start · Architecture Rules · File Structure Convention · Coding Standards · Testing · Documentation · Commit Convention · PR Checklist · Release Flow · Package Structure · package.json Convention               | AGENTS.md 165(「Tool-agnostic」) + CLAUDE.md 222(Claude 전용)로 나눴다고 적었지만 20자 넘는 줄 27개가 두 파일에 겹침. `.cursorrules` · copilot · `.claude/agents·skills` 모두.                                                                        |
| NaverPayDev/pie                       | Overview · Commands · Packages · Architecture · Conventions                                                                                                                                                                                            | CLAUDE.md 81줄(/init 상투 문구로 시작), 패키지 7곳 CLAUDE.md.                                                                                                                                                                                         |
| mercari/spanner-autoscaler            | Project Structure · Critical Rules · After Making Changes · CLI Commands Cheat Sheet · Testing & Development · Deployment Workflow · Distribution Options · References                                                                                 | 320줄. 대부분이 Kubebuilder 일반 안내(「CLI Commands Cheat Sheet」 「Distribution Options」 등) — 저장소 고유 내용은 적음.                                                                                                                            |
| line/req-shield                       | Project Overview · Core Architecture · Development Commands · Module Structure · Key Configuration Options · Testing Guidelines · Version Compatibility                                                                                                | AGENTS.md 28줄(「Repository Guidelines」) + CLAUDE.md 140줄(/init 상투 문구)이 따로. 20자 넘는 줄 중 겹침 1줄.                                                                                                                                        |

### 잘 쓴 예 5개

1. **daangn/seed-design** — 루트 77줄을 「시작 · 검증 · 생성 · 경계 · 학습 기록 · 문서 · Git」 일곱 절로 두고, 패키지 경로마다 돌릴 검증 명령을 한 줄씩 짝지었다. 「경계」는 먼저 물을 것과 묻지 않고 할 것을 나눈다. 「문서」 절에는 문서를 쓰는 규칙까지 있다: 새 규칙은 가장 좁은 경로의 AGENTS.md 에 두고 위에 반복하지 않는다, 코드로 알 수 있는 내용은 쓰지 않는다, 금지 규칙에는 대신 할 행동을 붙인다. 하위 28폴더가 이 규칙대로 나뉘고, CLAUDE.md 는 `@AGENTS.md` 한 줄이다.
2. **zed-industries/zed** — AGENTS · CLAUDE · GEMINI 세 이름을 모두 `.rules` 하나에 심볼릭 링크로 연결해 내용이 갈라질 수 없다. 「Rules Hygiene」 절이 규칙을 늘리는 기준을 정한다: 새 규칙은 「안 보이는 함정 · 두 번 이상 나옴 · 바로 행동할 수 있음」 세 조건을 모두 만족해야 하고, 아키텍처 설명은 금방 낡으니 넣지 말고(「traps to avoid, not maps to follow」), 작업 중에 바로 고치지 말고 PR 설명으로 제안하게 한다.
3. **twentyhq/twenty** — 60줄. 「House rules」를 「이 저장소가 너의 기본값과 다른 점」으로 한정했다. 「이미 있는 유틸을 다시 만드는 것이 AI 가 가장 자주 내는 결함」처럼 실제로 겪은 실수를 이름 붙여 적고, 「Gotchas」는 항목마다 이유를 붙였다(예: Nx 캐시가 낡은 통과를 줄 수 있으니 직접 tsgo 로 확인). 명령은 코드 블록 하나에 주석을 달아 모았다.
4. **huggingface/transformers** — 40줄로 짧고, AGENTS · CLAUDE 둘 다 `.ai/AGENTS.md` 로 링크했다. `make codex` / `make claude` 로 도구별 로컬 자산을 연결하는 방법, PR 전 중복 작업 확인 명령, modular 변환기의 함정 두 개(`attr = AttributeError()` 는 지우라는 지시 등)처럼 코드를 읽어서는 알기 어려운 것만 담았다.
5. **calcom/cal.diy** — 「Always do · Ask first · Never do」 3단 경계가 짧은 목록이라 바로 따를 수 있다(새 의존성 · 스키마 변경 · 전체 E2E 는 먼저 묻는다, `as any` 금지 등). PR 크기 기준과 좋은 예 코드(Prisma `select` 쿼리 등)를 함께 둔다. CLAUDE.md 는 심볼릭 링크다. 단, 첫 줄 페르소나 문장은 군더더기다.

함께 볼 만한 것: posthog 하위 문서의 「Pointers, not content」 방식 · 「Mandatory skill invocation」 트리거 목록, tldraw 맨 앞 「Core rules」 8줄, next.js 「Context-Efficient Workflows」, ruff 「Writing for human readers」.

### 흔한 실수 5개 (실제 예)

1. **두 파일을 따로 써서 갈라짐** — toss/react-simplikit 은 AGENTS.md 를 「Tool-agnostic」, CLAUDE.md 를 Claude 전용이라고 나눴지만, 20자 넘는 줄 27개가 두 파일에 똑같이 들어 있다. line/req-shield 는 AGENTS.md 28줄 · CLAUDE.md 140줄이 따로 만들어져 겹치는 줄이 1개뿐이다(도구마다 다른 내용을 본다). excalidraw 는 규칙 2개가 AGENTS.md 에만, 구조 · 명령이 CLAUDE.md 에만 있고 서로 언급하지 않는다.
2. **생성기의 틀을 그대로 둠** — /init 상투 문구 「This file provides guidance to Claude Code (claude.ai/code)…」가 4개 파일에 남아 있다. naver/billboard.js 는 그 문구가 AGENTS.md 안에 있다. mercari/spanner-autoscaler 의 320줄은 대부분 Kubebuilder 일반 안내(「CLI Commands Cheat Sheet」 「Distribution Options」)라 저장소 고유 내용이 적다.
3. **루트 파일이 너무 길거나 한 줄이 김** — next.js 546 · medusa 514 · payload 486 · n8n 456줄. posthog 는 342줄인데 46KB(한 줄 최대 1,307자), pydantic-ai 는 한 줄 최대 1,716자. 하위 폴더 파일을 잘 쓰는 저장소(medusa · posthog · n8n)도 루트는 길다.
4. **코드에서 알 수 있는 지도 · 일반론 · 페르소나** — temporal 은 42줄 중 20줄 남짓이 디렉터리 목록이고 「You are an experienced developer…」로 시작한다. astro 는 앞 네 절이 저장소와 상관없는 일반 원칙(Think Before Coding · Simplicity First 등)이다. zed 가 금지한 「지도」가 표본에서 흔하다(「구조 · 아키텍처」 절 63%).
5. **금방 낡는 정보와 자동 삽입 블록** — react/react 의 CLAUDE.md 는 13줄 중 「Current Active Work」에 특정 브랜치 이름을 적었다. next.js 는 맨 끝 절을 turbo 가 에이전트를 감지할 때 자동으로 다시 넣는다고 스스로 밝힌다. 사람이 고치지 않는 줄이 정본 파일에 섞인다.

참고(실수인지 판단은 다른 갈래 몫): astral-sh/uv 는 49줄 전체가 ALWAYS · NEVER · PREFER · AVOID · DO NOT 으로 시작하는 목록이다. 대문자 지시어는 표본의 30% 가 쓰지만 5회 넘게 쓰는 곳은 3곳뿐이다.

### 한계

- 하위 파일 수 · 동반 설정 수는 트리 API 가 잘린 4곳(TypeScript · posthog · twenty · kibana)에서 하한이다.
- 절 분류 · 명령 · 스타일 · 금지는 제목 · 정규식 기준이라 본문 속 내용을 놓칠 수 있다. 낮게 나온 곳은 원문을 다시 열어 고쳤다(excalidraw 스타일 · mastra 금지 · zed 명령).
- 표본은 별이 많은 저장소와 알려진 회사 위주라 일반 저장소 분포를 대표하지 않는다. 코드 검색(`filename:AGENTS.md path:/`) 상위 100개는 별순이 아니어서 표본으로 쓰지 않았다.
- 모두 오늘(2026-10-24) 기본 브랜치 HEAD 기준이다. 과거 이력은 보지 않았다.

## C. 회사 · 실무자 사례

조사일 2026-10-24. WebSearch · WebFetch 만 썼다(설치 · 실행 · 리포 쓰기 없음).
원문은 짧게 요약했고, 따옴표 인용은 짧은 말 몇 개만 남겼다. 숫자는 글에 적힌 그대로 옮겼다.

### 표본

| 묶음                  | 수     | 열람   | 일부 · 2차 |
| --------------------- | ------ | ------ | ---------- |
| 영미권 회사 · 팀 글   | 20     | 16     | 4          |
| 이름 있는 개인 실무자 | 5      | 5      | 0          |
| 한국 회사 기술 블로그 | 10     | 7      | 3          |
| 일본 회사 기술 블로그 | 16     | 15     | 1          |
| **합계**              | **51** | **43** | **8**      |

- 벤더 · 홍보 표시가 붙은 글은 5개(A1 · A14 · A15 · A17 · J16)다. 빼고 세면 46개다.
- J3(DeNA 勉強会)는 글 자체는 열람했지만, 내용은 Anthropic 엔지니어 발언을 옮긴 2차 보고다.

- 열람 수준: **열람** = 본문을 직접 읽음 / **일부** = 본문 일부 또는 목차 · 설명만 / **2차** = 원문을 못 열어서 다른 사람의 정리로 봄.
- 표시: **[벤더]** = 자기 제품 홍보 · 고객 사례, **[홍보]** = 회사 블로그지만 자기 제품 광고가 섞임. 이런 글의 숫자는 따로 표시했다.
- 못 열었거나 뺀 것은 맨 아래 「제외」에 적었다.
- 「측정」은 글에 집계 · 실험 결과가 있는 경우, 「경험담」은 체감 · 추정 · 발언인 경우다. 방법을 밝히지 않은 측정은 「측정(방법 미공개)」로 적었다.

---

### A. 영미권 회사 · 팀 (20)

#### A1. Anthropic — How Anthropic teams use Claude Code

- URL https://claude.com/blog/how-anthropic-teams-use-claude-code · 2025-07-24 · 열람 · [홍보]
- 관리: 지시 파일(CLAUDE.md), 문서(런북), 사람 검토.
- 방법: 인프라 팀은 Claude 가 CLAUDE.md 를 읽고 신규 인원에게 코드를 설명. 보안 팀은 흩어진 문서를 마크다운 런북으로 바꿔 디버깅 맥락으로 씀. 디자인 팀은 코드 → 테스트 → 반복 루프와 GitHub Actions PR 코멘트 자동화. 파일 구조 · 줄 수 · 갱신 규칙은 없음.
- 숫자(모두 경험담): 보안 디버깅 「3배 빨라짐」, 추론 팀 조사 1시간 → 10–20분(「80%」), 장애 때 20분 절약.
- 실패담: 없음. 일부 작업은 사람 검토가 거의 없었다고 스스로 적음.

#### A2. Anthropic(Boris Cherny) — Claude Code 만든 사람의 작업 방식(InfoQ 정리)

- URL https://www.infoq.com/news/2026/01/claude-code-creator-workflow/ · 2026-01-10 · 2차(원문은 2026-01 X 스레드)
- 관리: 지시 파일 · 명령 · 훅 · 권한 · 병렬 세션 · 검증.
- 방법: 팀마다 CLAUDE.md 하나를 git 에 두고 팀 전체가 고친다. Claude 가 실수하면 그걸 적는다. 동료 PR 에 Claude 를 태그해 배운 점을 CLAUDE.md 에 넣게 한다. 크기는 약 2.5k 토큰. `.claude/commands/` 에 commit · PR · 단순화 · 검증 명령을 둔다(`/commit-push-pr` 은 하루 수십 번). PostToolUse 훅으로 편집 뒤 포맷을 돌린다. `--dangerously-skip-permissions` 대신 `/permissions` 로 안전한 명령만 미리 허용한다. 로컬 세션 약 5개, 웹 세션 5–10개를 돌리고, 로컬 세션마다 git checkout 을 따로 둔다(브랜치 · worktree 가 아님). 세션의 10–20% 는 버린다. plan mode 로 계획을 확정한 뒤 자동 수락으로 넘긴다.
- 숫자: 검증 루프를 주면 품질 2–3배(경험담).
- 실패담: 따로 없음.

#### A3. Every — How to Use Claude Code Like the People Who Built It(Cat Wu · Boris Cherny)

- URL https://every.to/source-code/how-to-use-claude-code-like-the-people-who-built-it · 2025-10-29 · 2차(팟캐스트 정리 글)
- 관리: 공용 설정 · 명령 · 서브에이전트 리뷰 · 훅.
- 방법: 공용 `settings.json` 을 저장소에 둬서 모두 같은 허용 · 금지 목록을 쓴다. `/commit` · `/feature-dev`(명세 → 계획 → 할 일) · `/code-review` 명령. 리뷰는 서브에이전트 3개(스타일 · 이력 · 버그)가 찾고, 다른 5개가 반박해 오탐을 줄인다. Stop 훅으로 테스트를 돌려 실패하면 계속 고치게 한다. PR 1차는 Claude, 머지는 사람이 한다.
- 숫자: plan mode 로 복잡한 작업 성공률 2–3배(발언, 경험담).
- 주의: 한 번만 쓸 지시(버튼 색 하나 같은 것)를 상시 규칙으로 만들지 말 것.

#### A4. GitHub — How to write a great agents.md: Lessons from over 2,500 repositories

- URL https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/ · 2025-11-19 · 열람
- 관리: 지시 파일 내용 · 경계.
- 방법: 공개 agents.md 2,500개 이상을 봤다고 함(선정 · 분류 방법은 없음). 다룰 6가지는 명령 · 테스트 · 구조 · 코드 스타일 · git 흐름 · 경계. 실행 명령은 플래그까지 앞쪽에 둔다. 설명 문단보다 실제 코드 예시 하나가 낫다. 경계는 「항상 / 먼저 묻기 / 절대 안 함」 3단으로 쓴다. 범용 도우미 말고 좁은 에이전트 하나부터 시작한다. Copilot 이 초안을 쓰고 사람이 명령 · 경계를 고친다. 에이전트가 틀릴 때마다 내용을 더한다.
- 숫자: 표본 수 말고는 빈도 숫자가 없음.
- 실패 유형: 막연한 페르소나, 명령 없음, 경계 없음, 예시 없음, 범위가 너무 넓은 에이전트.

#### A5. Vercel — AGENTS.md outperforms skills in our agent evals

- URL https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals · 2026-01-27 · 열람
- 관리: 지시 파일과 스킬 비교 · 문서 색인.
- 방법: Next.js 16 의 새 API 문서를 두 방식으로 줬다. (1) 스킬로 줌, (2) AGENTS.md 에 압축한 문서 색인을 넣음.
- 숫자(측정, 자체 평가 · 표본 수와 모델은 미공개): 문서 없음 53%, 스킬 기본 53%, 스킬 + 쓰라는 지시 79%, AGENTS.md 색인 100%. 기본 상태에서는 56% 의 경우 스킬이 아예 불리지 않았다. 색인을 40KB → 8KB 로 줄여도 100% 를 유지했다.
- 주의: 스킬 결과는 지시 문구에 따라 크게 달랐다. 이유로는 에이전트가 「쓸지 말지」 고를 필요가 없다는 점을 꼽는다. 저자는 사용자가 직접 부르는 업그레이드 같은 작업에는 스킬이 맞을 수 있다고 본다.

#### A6. Stripe — Minions: Stripe's one-shot, end-to-end coding agents

- URL https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents · 2026-02-09 · 열람
- 관리: 규칙 파일 · 도구 · 격리 환경 · 테스트 · 사람 리뷰.
- 방법: Cursor · Claude Code 가 읽는 규칙 파일을 그대로 읽는다. 규칙은 거의 전부 하위 폴더에 걸린 조건부 규칙이다(전역 규칙은 규모가 커지면 버티지 못한다는 이유). 내부 MCP 「Toolshed」 에 도구가 400개 넘게 있고, 에이전트마다 고른 일부만 준다. 격리된 devbox 는 약 10초 만에 뜨고, 운영 · 인터넷과 끊겨 있어 권한 확인 없이 돌린다(worktree 오버헤드도 피함). push 때 린트를 5초 안에 돌리고, CI 는 최대 2회까지만 돌린다. 결과는 PR 템플릿에 맞춘 PR 로 나오고 엔지니어가 리뷰한다.
- 숫자: 주당 1,000개 넘는 PR 이 에이전트만으로 만들어져 머지됨(측정, 방법 미공개).
- 실패담: 실패율은 공개하지 않음. 완전히 맞지 않은 결과도 출발점으로는 쓸모 있다고 함.

#### A7. OpenAI — Harness engineering

- URL https://openai.com/index/harness-engineering/ · 2026-02-11(Ryan Lopopolo) · 2차(원문 403. Dale Seo 의 정리 https://daleseo.com/harness-engineering/ 와 검색 요약으로 봄)
- 관리: 지시 파일 · 문서 구조 · 기계 검증 · 정리 에이전트.
- 방법: AGENTS.md 는 백과사전이 아니라 목차이고, 1,000쪽짜리 설명서 대신 지도를 준다는 것이 초기 교훈. 2차 자료에 따르면 AGENTS.md 는 약 100줄이고 docs/ 아래 설계 문서 · 실행 계획 · 제품 명세를 가리킨다. 아키텍처 규칙은 구조 테스트와 린터로 기계 검증하고, 문서와 코드가 어긋나지 않는지 보는 정리 에이전트를 따로 둔다.
- 숫자(2차, 원문 확인 못 함): 빈 저장소에서 5개월 만에 약 100만 줄 · PR 1,500개, 엔지니어 3명, 1인당 하루 3.5 PR, 사람이 코드를 직접 쓰지 않음.
- 주의: docs/ 파일 이름은 2차 자료마다 다르다. 원문으로 확인하지 못함.

#### A8. Spotify — Background Coding Agents: Context Engineering (Honk, Part 2)

- URL https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2 · 2025-11-24(Max Charas · Marc Bruggmann) · 열람
- 관리: 프롬프트 · 도구 제한 · 검증.
- 방법: 원하는 끝 상태를 테스트로 정의하고, 「하지 말아야 할 때」를 먼저 적고, 예시 코드를 넣고, 한 번에 한 가지만 바꾼다. 세션이 끝나면 에이전트에게 프롬프트에 무엇이 빠졌는지 묻는다. 빌드 방법은 저장소 수천 개마다 달라서 AGENTS.md 류 파일이 아니라 MCP 「verify」 도구에 넣었다(포맷 · 린트 · 테스트 실행과 로그 요약). git 도구는 push 를 막고, bash 는 허용 목록만 쓴다. 코드 검색 · 문서 도구는 주지 않는다. 큰 고정 프롬프트를 버전 관리한다.
- 숫자: Claude Code 로 마이그레이션 약 50건(횟수). 머지율은 미공개.
- 실패담: 오픈소스 에이전트로는 머지할 만한 PR 이 안정적으로 나오지 않았다. 직접 만든 루프는 파일을 고르는 데 실패했고, 여러 파일에 걸친 변경은 턴이 모자랐다. 도구를 늘리면 예측이 어려워졌다. 프롬프트를 평가할 체계가 없어 저자들 말로 아직 「직감으로」 움직인다.

#### A9. Ramp — Why we built our own background agent(Inspect)

- URL https://builders.ramp.com/post/why-we-built-our-background-agent · 날짜 · 저자 미표기 · 열람
- 관리: 스킬 · 격리 환경 · 검증 · 사람 리뷰.
- 방법: 「Ramp 가 출시하는 방식」을 스킬에 담는다. 세션마다 개발 환경 전체가 든 샌드박스 VM 을 쓰고, 저장소 이미지는 30분마다 다시 만든다. 백엔드는 테스트 · 텔레메트리 · 기능 플래그로, 프론트는 전후 스크린샷으로 검증한다. PR 은 사용자 본인 토큰으로 열어서 자기 PR 을 자기가 승인할 수 없다.
- 숫자: 프론트 · 백엔드 저장소 머지 PR 의 약 30% 를 Inspect 가 씀(측정, 방법 미공개). 2차 자료에는 50% · 75% 도 나오는데, 시점이 다른 것으로 보인다.
- 교훈: 동기화가 끝날 때까지 편집을 막는다. 후속 지시는 실행 중에 끼워 넣지 말고 큐에 둔다. 채택은 강제하지 않는다.

#### A10. Intercom — Brian Scanlan 의 X 스레드 + Lenny's Newsletter 방송

- URL https://threadreaderapp.com/thread/2033978300003987527.html (2026-03-17, 열람) · https://www.lennysnewsletter.com/p/how-intercom-2xd-their-engineering (2026-04-20, 일부)
- 관리: 플러그인 · 스킬 · 훅 · 지시 파일 점검 · 텔레메트리 · 리뷰.
- 방법: 내부 플러그인 13개, 스킬 100개 이상. 훅으로 PR 흐름을 강제하고, 이미 머지된 브랜치 수정을 막고, 프롬프트 5번 뒤에는 권한 분석기를 제안한다. 매주 GitHub Action 이 CLAUDE.md 와 거기서 참조하는 파일의 사실관계를 확인한다. 이벤트 14종을 OpenTelemetry 로 Honeycomb 에 보낸다(프롬프트 본문은 수집하지 않는다고 함). SessionEnd 훅에서 Haiku 가 빈틈을 찾아 Slack 에 올리고, 미리 채운 이슈 링크를 붙인다. 흐름은 세션 → 빈틈 → 이슈 → 새 스킬. 리뷰 에이전트는 중요한 지적만 남긴다.
- 숫자: 개수 말고는 없음(스레드). 방송 소개에는 9개월 만에 R&D 1인당 머지 PR 2배, 엔지니어 100% 사용(측정 방법 미공개).
- 실패담: 없음. CLAUDE.md 점검을 「계속 배우는」 쪽으로 더 밀어야 한다고 함.

#### A11. Airbnb — Accelerating Large-Scale Test Migration with LLMs

- URL https://airbnb.tech/?p=366 · 날짜 미표기(2025-03 경, Charles Covey-Brandt) · 열람
- 관리: 맥락 고르기 · 단계별 검증 · 재시도.
- 방법: 파일마다 상태 기계로 진행한다(리팩터 → Jest → 린트 · tsc → 완료). 프롬프트는 4만–10만 토큰이고, 관련 파일을 최대 약 50개 넣는다(형제 테스트, import, 직접 쓴 예시, 이전 지침).
- 숫자(측정): 파일 약 3,500개. 수작업이면 1.5년으로 추정한 일을 6주에 끝냄. 첫 일괄 실행에서 4시간 만에 75%, 4일 조정 뒤 97%, 나머지 3% 는 약 1주 수작업. 어려운 파일은 50–100번 재시도.
- 교훈: 프롬프트 문구를 다듬기보다 관련 파일을 잘 고르는 것과 재시도가 더 효과적이었다. 마지막 남은 소수 파일은 손으로 하는 편이 빨랐다.

#### A12. Cloudflare — The AI engineering stack we built internally

- URL https://blog.cloudflare.com/internal-ai-engineering-stack/ · 2026-04-20(Scott Roe-Meschke · Rajesh Bhatia) · 열람
- 관리: 지시 파일 대량 생성 · 갱신 · 리뷰 에이전트 · 도구.
- 방법: 저장소 약 3,900개의 AGENTS.md 를 파이프라인으로 만든다(Backstage 메타데이터 + 언어 · 빌드 · 테스트 분석 + 사내 「Engineering Codex」 기준). 결과는 MR 로 올려 소유 팀이 검토한다. 파일은 짧게 두고 실행 · 테스트 · 린트 · 코드 탐색 · 규약(Codex 규칙 ID) · 경계(생성된 파일은 고치지 않기) · 의존성을 담는다. 유지는 AI 코드 리뷰어가 「이 변경이면 AGENTS.md 를 고쳐야 한다」고 표시해서 한다. 리뷰는 위험도에 따라 3단계로 나누고, 품질 · 보안 · 규약 · 문서 등 담당 에이전트가 나눠 본다.
- 숫자(측정): 활성 사용자 3,683명(R&D 의 93%). 주간 처리량 4주 평균 약 5,600 → 8,700 이상(무슨 지표인지 글에 분명하지 않음). GitLab MCP 도구 설명 약 1.5만 토큰을 도구 2개로 줄임.
- 실패담: 첫 생성은 여러 언어가 섞인 저장소에서 부정확했다. 낡은 AGENTS.md 는 없는 것보다 나쁠 수 있어서, 갱신용 피드백 루프를 따로 만들어야 했다.

#### A13. Uber — uReview

- URL https://www.uber.com/en-GB/blog/ureview/ · 2025-08-12(Sonal Mahajan 외) · 열람
- 관리: 리뷰 규칙 · 코멘트 품질 · 사람 피드백.
- 방법: 리뷰 담당을 셋으로 나눈다(버그 · 사내 규약 레지스트리 · 보안). 코멘트마다 신뢰도 점수를 매기고 기준 아래는 버린다. 비슷한 코멘트는 합치고, 개발자가 쓸모없다고 본 범주는 뺀다. 개발자가 코멘트마다 「유용 / 아님」을 누른다.
- 숫자(측정): diff 의 90% 이상 분석, 코멘트 75% 가 유용, 65% 이상 반영(사람 코멘트는 51%). 「주 1,500시간 절약」은 가정을 넣은 추정. 주간 diff 6.5만은 글 안에서 주 · 월이 섞여 있음.
- 실패담: 한 번에 묻는 프롬프트는 없는 문제를 지어내고 중복 코멘트를 냈다. 스타일 · 가독성 코멘트는 개발자가 싫어해서 뺐다. 소스만 보기 때문에 설계 · 스키마 문제는 못 잡는다.

#### A14. Coinbase — CEO 발언 · Cursor 고객 사례

- URL https://cointelegraph.com/news/coinbase-says-ai-writes-nearly-half-of-its-code · https://cursor.com/blog/coinbase · 2025 · 2차 · [벤더](Cursor 쪽)
- 관리: 사람 리뷰 원칙.
- 숫자: 코드의 40% 이상을 AI 가 씀(CEO 발언). 「PR 75% 를 에이전트가 만듦」은 Cursor 고객 사례 숫자.
- 주의: CEO 가 리뷰와 이해가 필요하고 모든 영역에 쓸 수는 없다고 함. 지시 파일 운영 내용은 없음.

#### A15. Factory — Introducing Agent Readiness

- URL https://factory.com/news/agent-readiness · 2026-01-20 · 열람 · [벤더]
- 관리: 저장소 준비도(문서 · 테스트 · 린트 등 8가지 영역).
- 방법: 60개 넘는 기준을 통과 · 실패로 매기는데 대부분 파일이 있는지만 본다. 5단계 중 3단계가 목표. AGENTS.md 는 자동 수정이 추가할 파일의 예로만 나온다.
- 숫자: 평가 편차 7% → 0.6%(저장소 9개, 자체 측정). 준비도와 에이전트 성공률의 관계는 측정하지 않음.

#### A16. HumanLayer — Writing a good CLAUDE.md

- URL https://www.humanlayer.dev/blog/writing-a-good-claude-md · 2025-11-25(Kyle) · 열람
- 관리: 지시 파일 길이 · 구조 · 작성 방식.
- 방법: 무엇(스택 · 구조) · 왜(목적) · 어떻게(빌드 · 테스트 · 검증 명령)만 쓴다. 거의 모든 작업에 해당하는 것만 넣는다. 나머지는 `agent_docs/running_tests.md` 같은 파일로 빼고 CLAUDE.md 에 한 줄 설명과 함께 목록만 둔다. 코드 조각 대신 `file:line` 포인터를 쓴다. 린트는 에이전트에게 시키지 말고 린터 · Stop 훅으로 돌린다. `/init` 같은 자동 생성은 쓰지 말고 한 줄씩 손으로 쓴다.
- 숫자: 300줄 미만이 통념이고 자사 파일은 60줄 미만(경험담). 지시 150–200개면 안정적으로 따른다는 것은 다른 연구를 인용한 것이고, 엄밀하지 않다고 스스로 밝힘.
- 실패담: Claude 가 CLAUDE.md 를 자주 무시한다. 원인으로 하네스가 넣는 「관련 있을 때만 쓰라」는 리마인더와, 불편할 때마다 덧붙인 땜질 지시가 쌓인 것을 꼽는다.

#### A17. Builder.io — How I use Claude Code (+ my best tips)

- URL https://www.builder.io/blog/claude-code · 2025-07-11(Steve Sewell) · 열람 · [홍보]
- 관리: 지시 파일 · 명령 · 훅 · 리뷰봇.
- 방법: CLAUDE.md 는 Claude 에게 만들게 하고 `#` 로 메모를 더한다. `.claude/commands/` 에 `.md` 로 명령을 만들고 `$ARGUMENTS` 를 쓴다. 편집 뒤 훅으로 Prettier · tsc 를 돌린다. 기본 리뷰봇 출력이 장황해서 버그 · 보안만 짧게 보고하도록 프롬프트를 고쳤다.
- 주의: 권한 확인을 끄고 쓴다(위험은 인정). 자사 제품 광고가 섞여 있다.

#### A18. Thoughtworks Technology Radar — AGENTS.md / Context engineering

- URL https://www.thoughtworks.com/radar/techniques/agents-md (Trial, 2025-11-05) · https://www.thoughtworks.com/radar/techniques/context-engineering (Adopt, 2026-04) · 열람
- 관리: 지시 파일 표준 · 맥락 설계.
- 내용: AGENTS.md 는 「에이전트용 README」 같은 공통 시작 파일이라 Trial. 맥락 설계는 Adopt 로 올렸고, 가벼운 색인으로 시작해 단계마다 필요한 것만 끌어오는 점진 공개(Trial)를 권한다. 원자료를 한꺼번에 넣으면 「context rot」 이 생긴다고 경고한다.
- 숫자: 없음. 컨설팅사 한 곳의 자문단 의견이다.

#### A19. Thoughtworks · martinfowler.com — Context Engineering for Coding Agents

- URL https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html · 2026-02-05(Birgitta Böckeler) · 열람
- 관리: 지시 파일 · 경로 규칙 · 스킬 · 서브에이전트 · 훅 · 플러그인.
- 방법: 맥락을 누가 불러오는지로 나눈다 — LLM(스킬 · MCP · 서브에이전트), 사람(명령), 에이전트 소프트웨어(CLAUDE.md · 훅). 가능한 한 작게 두고, 조금씩 키우고, 새 모델이 나오면 다시 본다. `/context` 로 무엇이 자리를 차지하는지 본다. 모르는 사람이 만든 큰 지시 묶음을 복사하지 않는다.
- 주의: 「통제의 착각」 — 결과는 여전히 확률적이고, 맥락 설계에는 단위 테스트가 없다. 숫자는 없음.

#### A20. Thoughtworks · martinfowler.com — Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl

- URL https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html · 2025-10-15(Böckeler) · 열람
- 관리: 명세 문서 · 기억 파일(constitution, steering).
- 방법: 세 수준으로 나눈다 — 명세 먼저(spec-first), 명세 유지(spec-anchored), 명세가 원본(spec-as-source). Kiro 의 기억 파일은 product.md · tech.md · structure.md. spec-kit 은 constitution → specify → plan → tasks 순서.
- 실패담(경험담): Kiro 는 작은 버그 하나를 사용자 스토리 4개와 수용 기준 16개로 키웠다. spec-kit 은 중간 크기 기능에도 과해서 끝내지 못했고, 반복되는 마크다운이 많아 리뷰가 고역이었다. 이미 있는 클래스를 다시 만들었고, constitution 을 지나치게 적용하기도 했다. 결론: 명세 먼저는 유용하지만, 파일이 많은 방식은 리뷰 과부하와 환각을 오히려 키울 수 있다.

### B. 이름 있는 개인 실무자 (5)

#### B1. Simon Willison — Embracing the parallel coding agent lifestyle

- URL https://simonwillison.net/2025/Oct/5/parallel-coding-agents/ · 2025-10-05 · 열람
- 관리: 병렬 세션 · 리뷰.
- 방법: Claude Code 와 Codex CLI 를 터미널 여러 개, 디렉터리 여러 곳에서 동시에 돌린다. worktree 대신 `/tmp` 에 새 checkout 을 만든다. 조사 · 코드 설명 · 작은 정비 · 명세를 자세히 준 작업만 병렬로 돌린다. 진짜 작업 전에 버릴 작업을 먼저 보내 까다로운 파일을 알아내는 「정찰」을 쓴다. LLM 이 쓴 코드 설명은 저장해 뒀다가 다음 프롬프트에 붙인다.
- 핵심: 병목은 리뷰다. 큰 변경은 한 번에 하나만 리뷰하고 들일 수 있다. 내가 쓴 명세에서 나온 코드가 리뷰하기 훨씬 쉽다. 지시 파일 이야기는 없음.

#### B2. Peter Steinberger — Just Talk To It

- URL https://steipete.me/posts/just-talk-to-it · 날짜 미표기(2025-10 경) · 열람
- 관리: 지시 파일 · 병렬 · 커밋 · 문서.
- 방법: Codex 3–8개를 대개 같은 폴더에서 돌린다(worktree · PR 은 써 보고 되돌림). 에이전트마다 자기가 고친 파일만 골라 커밋한다. AGENTS.md 는 약 800줄이고 대부분 Codex 가 썼다. 무언가 잘못되면 짧은 메모를 더하라고 시킨다. CLAUDE.md 는 심볼릭 링크. 특정 작업용 마크다운 문서를 많이 둔다. 기능 하나마다 같은 맥락에서 테스트를 쓰게 하고, 시간의 약 20% 를 리팩터에 쓴다.
- 거부하는 것: 대부분의 MCP(CLI 가 낫다), plan mode, 서브에이전트, 훅 · 플러그인(의지가 강한 모델은 우회한다), 명세 주도 개발, 범용 페르소나, 대문자 강조(GPT 계열은 오히려 나빠진다).
- 숫자: TypeScript 약 30만 줄, 월 약 $1k(경험담).

#### B3. Harper Reed — My LLM codegen workflow atm

- URL https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/ · 2025-02-16 · 열람
- 관리: 명세 · 계획 · 할 일 파일.
- 방법: 대화형 모델이 질문을 한 번에 하나씩 하게 해서 `spec.md` 를 만든다. 추론 모델로 `prompt_plan.md`(작은 단계별 프롬프트)와 `todo.md`(세션을 넘어 상태를 이어 가는 체크리스트)를 만든다. 기존 코드는 repomix 로 묶어 리뷰 · 빠진 테스트 목록을 받는다.
- 실패담: 진행이 이해를 앞지른다. 팀에서는 병렬 세션이 머지 충돌과 맥락 문제를 낳아 쓰기 어렵다.

#### B4. Armin Ronacher — Agentic Coding Recommendations

- URL https://lucumr.pocoo.org/2025/6/12/agentic-coding/ · 2025-06-12 · 열람
- 관리: 도구 · 명령 · 로그.
- 방법: 중요한 명령은 Makefile 에 둔다. 로그는 터미널과 파일 양쪽에 남겨 에이전트가 읽게 한다. 도구는 빠르고, 오류가 분명하고, 잘못 쓰기 어렵게 만든다. CLAUDE.md 예시는 한 줄(디버그 메일은 stdout 으로 나온다)뿐이다.
- 실패담: 에이전트가 이미 서버가 떠 있는데 `make dev` 를 또 돌려 포트가 겹쳤다 → pidfile 로 두 번째 실행을 막았다. 병렬 실행은 공유 상태(파일 · DB) 관리가 어렵다.

#### B5. Mitchell Hashimoto — My AI Adoption Journey

- URL https://mitchellh.com/writing/my-ai-adoption-journey · 2026-02-05 · 열람
- 관리: 지시 파일 · 스크립트 도구 · 백그라운드 에이전트.
- 방법: 에이전트가 실수하면 다시는 안 하게 고친다(「하네스 엔지니어링」). 방법은 둘이다. (1) AGENTS.md 에 한 줄 — Ghostty `src/inspector/AGENTS.md` 는 한 줄이 과거의 나쁜 행동 하나다. (2) 스크린샷 · 테스트 거르기 같은 스크립트를 만들고 AGENTS.md 에 적는다. 하루 끝 30분에 조사 에이전트를 돌린다. 에이전트는 여러 개보다 하나를 선호하고, 알림을 꺼서 사람이 확인 시점을 정한다.
- 숫자: 백그라운드 에이전트가 근무 시간의 10–20% 동안 돌고 있음(경험담).
- 실패담: 처음에는 에이전트 결과를 고치는 데 직접 하는 것보다 시간이 더 들었다.

### C. 한국 (10)

#### K1. 토스(토스페이먼츠) — Software 3.0 시대, Harness를 통한 조직 생산성 저점 높이기

- URL https://toss.tech/article/harness-for-team-productivity · 2026-02-26(김용성) · 열람
- 내용: 팀 린트 규칙 · 브랜치 전략 · 테스트 정책을 플러그인으로 묶어 배포하자는 구상과 `/new-feature` 시나리오. 구현 · 숫자는 없고, 글 스스로 「방향성」이라고 밝힘.
- 반응: 댓글에 글을 AI 가 쓴 것 같다, 추상적이라는 지적이 있음.

#### K2. 토스뱅크 — AI가 팀 규칙을 지키도록 하는 방법

- URL https://toss.tech/article/52631 · 2026-09-08(김경윤) · 열람
- 관리: 지시 파일 한계 · 훅 · 규칙 저장소 · 피드백.
- 방법: AGENTS.md 같은 전역 지침은 세션 초반에는 지켜지다가 길어지면 무시된다. 그래서 파일을 쓴 직후 훅이 방금 쓴 코드를 보고 관련 규칙만 넣는다. 규칙 파일은 `id` · `level` · 발동 조건(`file_pattern` · `code_regex` · `exclude_pattern`) · `context_injection` 으로 이뤄진다. 고르는 데는 AI 를 쓰지 않고 정규식만 쓴다. 한 번에 최대 2개, 같은 규칙은 세션당 1번만 넣는다. 끝내기 전에 `git diff` 전체로 최대 4개를 다시 본다. 언어별 공통 맥락은 세션 시작 때 넣는다. 규칙은 중앙 저장소에 두고 세션 시작 때 최신을 받아 온다. 발동 기록과 PR 리뷰 코멘트에서 새 규칙 후보를 찾는다.
- 숫자(측정): AI 로 관련성을 판정하게 했더니 요청당 약 10초가 늘어서 뺐다. 오탐 규칙이 21세션에서 발동했지만 코드 변경은 0건.
- 실패담: 정규식이 다른 문법에 걸리는 오탐과, 다른 반복 형태를 놓치는 누락. 코드 모양으로 판정하기 어려운 규칙은 상시 맥락으로 옮겼다. 댓글: 자동 모드의 Claude Code 가 Write/Edit 훅을 Bash 로 우회하는 일이 잦다는 경험담.

#### K3. 토스 — Skill 품질 관리를 위한 Rubric 설계와 시스템 구현

- URL https://toss.tech/article/skill-quality-rubric · 2026-06-08(조민규) · 열람
- 관리: 스킬 품질 · 리뷰 자동화.
- 방법: 6개 영역 30개 항목. 17개는 규칙 검사, 13개는 LLM 판정이고, BLOCKER 가 하나라도 있으면 F. GitHub Actions 가 PR 에서 바뀐 스킬만 평가해 코멘트를 남긴다. 같은 기준을 로컬 Claude Code 플러그인으로 PR 전에 스스로 확인할 수 있다. 사람 리뷰어는 의미 품질만 본다.
- 실패담: 호출 조건(WHEN)을 description 이 아니라 본문에 써서 스킬이 안 불렸다. 영어 「when」 정규식이 한국어 스킬을 대거 BLOCKER 로 잘못 잡아서 모델 판정으로 바꿨다. 본문 절반이 모델이 이미 아는 일반론인 스킬도 있었다.
- 숫자: 스킬 본문 4–5천 토큰을 1–2천으로 줄이면 호출 비용이 1/3 이하(추정).

#### K4. 우아한형제들 — 하네스 엔지니어링으로 팀 맞춤형 AI 환경 구축하기

- URL https://techblog.woowahan.com/26177/ · 2026-04-17(이재홍) · 열람
- 관리: 경로 규칙 · 스킬 · 전처리 스크립트.
- 방법: `.cursor/rules` 를 경로 조건부로 둔다(예 `src/queries/**/*.ts` 일 때만 React Query 규칙). `.cursor/skills` 에는 Swagger 타입 · 목 생성, 훅 · 테스트 생성, PR 작성, 리팩터를 둔다. 모델이 이미 아는 일반 지식은 빼고, 규칙(코드)과 스킬(작업 흐름)을 나눈다. Swagger 에서 필요한 메타데이터만 뽑아 넘기는 Node 전처리 스크립트를 쓴다.
- 숫자(측정): 입력 41,944 → 1,763 bytes 등 94.5–97.7% 감소, 탐색 호출 4회 → 1회. 작업당 약 6,800 토큰 절약은 환산 추정.

#### K5. 카카오페이 — SDD(spec-kit) 에이전트 코딩 실전기

- URL https://tech.kakaopay.com/post/ifkakao-agentic-coding/ · 2026-03-13(wayne) · 열람
- 관리: 명세 문서 · 사람 검토.
- 방법: constitution → specify ↔ clarify(질문 최대 5개) → plan → tasks → analyze → implement. 결과물을 손으로 고치지 말고 specify 로 돌아가 명세를 고친 뒤 AI 가 다시 만들게 한다(명세와 코드가 어긋나지 않게).
- 실패담: tasks 에 집중하다 constitution 을 지키지 않음. 명세에 있던 작업이 tasks 에서 빠짐. 단계가 많아 작은 작업에 맞지 않고, 문서가 많아 토큰을 많이 씀. 숫자는 없음(「크게 단축」).

#### K6. 당근 — 프롬프트 한 줄로 화면이 나오는 시대, '당근스러운 화면'을 만드는 법

- URL https://medium.com/daangn/ (검색 결과의 글) · 날짜 미확인 · 2차(검색 요약만)
- 내용: Mastra 하네스(Plan / Orchestra 모드)가 설계를 맡고 코드 작성은 Claude Agent SDK 에 넘긴다. 도구는 허용 목록만 열고, 디자인 시스템 SEED 규칙으로 검증해 최대 2번 스스로 고친다. 색은 시맨틱 토큰 이름으로만 지정한다.

#### K7. LINE NEXT — Claude Code Action: 조직 전반의 코드 품질을 지키는 AI 코드 리뷰 플랫폼화

- URL https://techblog.lycorp.co.jp/ko/building-ai-code-review-platform-with-claude-code-action · 날짜 미표기(2026-01 경, 이동원) · 열람
- 관리: 리뷰 프롬프트 중앙 관리.
- 방법: 중앙 저장소의 `configs/common/`(code-review · security-check · common.yml)과 `configs/{서비스}/` 를 합쳐 최종 프롬프트를 만든다. DevOps 팀이 관리하고, 서비스 팀은 이름과 분석 종류만 넘긴다.
- 숫자: 약 한 달 동안 저장소 32개, 호출 344회(측정 = 사용량). 품질 효과 숫자는 없음.
- 실패담: 사용자 코멘트가 설정보다 우선해 형식이 매번 달랐다 → 형식 지시를 위계 위로 올렸다. 포크 PR 오류.

#### K8. 오늘의집 — 반복되는 디자인 작업, 우리는 AI와 시스템을 만들기로 했다

- URL https://www.bucketplace.com/en/post/2026-08-13-반복되는-디자인-작업-우리는-ai와-시스템을-만들기로-했다/ · 2026-08-13(Leeji, 마케팅디자인팀) · 열람
- 관리: 지시 파일 · 공용 모듈.
- 방법: 디자이너들이 저장소 맨 위 CLAUDE.md 에 구조 원칙 · 공통 패턴(CSS 변수 색 · 글꼴, `shared/` 모듈 규칙)을 적어 누가 작업해도 같은 기준이 나오게 했다. 빌더마다 담당 디자이너가 있다. 숫자는 없음.

#### K9. 무신사 — AI한테 테스트 코드를 맡겼더니 커버리지가 8배 올랐다

- URL https://techblog.musinsa.com/ (검색 결과의 글) · 날짜 미확인 · 2차(본문 403, 검색 요약만)
- 내용: 규칙 문서를 주제별로 나눠 필요한 문서만 지정한다. 「프로덕션 코드 수정 금지」 제약으로 PR 리뷰 범위를 줄였다. 「8배」는 제목의 숫자이고 측정 방법은 확인하지 못함.

#### K10. 여기어때 — AI 코딩 에이전트에게 사고 과정을 설계하다 — /start부터 Agent Teams까지

- URL https://techblog.gccompany.co.kr/ (검색 결과의 글) · 날짜 미확인 · 2차(403, 검색 요약만)
- 내용: 규칙 원본은 `.claude/` 아래에 모으고 CLAUDE.md 를 들어가는 입구로 둔다. 프로젝트마다 CLAUDE.md 만 채운다. 세부는 미확인.

### D. 일본 (16)

#### J1. ZOZO — Claude Codeとの会話を、チームの記憶にする

- URL https://techblog.zozo.com/entry/memory-manager-context-reuse · 2026-09-10(和氣) · 열람
- 관리: 팀 기억(작업 맥락) 문서 · AI 작성 · 사람 병합.
- 방법: 정본은 마크다운이고 검색 색인은 SQLite 로 따로 둔다. 전용 Git 저장소를 각 저장소의 `.claude/memories` 가 심볼릭 링크로 가리킨다. 경로는 안건 → 직종 → 담당자 → 기능 → 단계(우려 · 사양 · 조사 · 설계 · 구현 · 리뷰 · 테스트). 담당자별 폴더는 여럿이 한 파일을 고칠 때 생기는 충돌을 막으려는 것. 사람은 「저장해」라고만 말하고, 스킬이 위치 · 이름 · 요약 · 태그를 정한다. 응답이 끝날 때마다 훅이 개인 브랜치로 커밋 · PR 하고, main 병합은 사람이 한다. 기억은 지우지 않고, 어긋나면 최신을 따르고, 참조한 코드가 바뀌면 낡았을 수 있다고 경고한다.
- 숫자(측정): 2개월 반 동안 약 800회 읽음(설명 1회 5–10분으로 환산한 67–133시간은 추정). 자동 회상은 「관련 기억이 있다」고 알리기만 했을 때 0%(110건 중), 「답하기 전에 떠올려라」로 바꾸자 65.4%(208건 중). 원하는 기억이 3위 안 68.9%, 결과 0건 2.7%.
- 실패담: 정리 · 중복 제거를 하니 저장 자체가 줄어서 「다 남기고 검색을 강화」로 바꿨다. 낡은 기억이 위로 뜨는 문제는 아직 남았다.

#### J2. DeNA — Claude Codeのハーネスを育てるアプリを作ってみた

- URL https://engineering.dena.com/blog/2026/07/claude-code-harness-app/ · 2026-07 · 열람
- 관리: 지시 파일 · 규칙 · 스킬 갱신 · 팀 공유.
- 방법: CLAUDE.md · rules · skills 는 써 놓고 방치되어 실제와 어긋난다는 문제의식. 사용 기록을 보고 AI 가 CLAUDE.md 수정 diff 를 제안하고 사람이 받아들이거나 거절한다. 기억 · 세션을 스킬로 만든다. 팀 카탈로그에 올릴 때는 개인정보를 검사한다. AI 변경은 자동 적용하지 않고, 쓰기 전에 백업한다.
- 숫자: 없음(긍정 반응만).

#### J3. DeNA — Claude Code 実践知見 — Anthropic エンジニア勉強会レポート

- URL https://engineering.dena.com/blog/2026/06/claude-code-study-report/ · 2026-06-23(渡邊) · 열람(내용은 Anthropic 엔지니어 발언의 2차 보고)
- 내용: Anthropic 사내 CLAUDE.md 는 수천 줄인 경우도 있고, 짧을수록 좋다는 생각은 오해라고 발언했다. 다만 너무 길면 정확도가 떨어지니 최상위와 기능별 파일로 나눈다. `/context` 로 확인한다. 스킬이 안 불리면 description 에 쓰는 상황을 구체적으로 적는다. 훅으로 비밀값 · 경로 접근을 막고, 권한은 `settings.json` 으로 중앙 관리한다. 사람 검토는 필수.

#### J4. Classmethod — 複数リポジトリでClaude Codeのルール・スキルを一元管理する

- URL https://dev.classmethod.jp/articles/async-claude-code-rules-and-skills/ · 2026-03-18(haruka) · 열람
- 관리: 여러 저장소 공통 규칙 · 스킬.
- 방법: `shared-rules-repo` 에 공통 rules · skills 를 두고, 각 저장소의 `.claude/rules` · `.claude/skills` 에서 상대 경로 심볼릭 링크를 건다. CLAUDE.md 에서 `@` 로 불러온다. SessionStart 훅이 `git pull --ff-only` 로 최신을 받는다. 공통에는 운영 지식(작업 관리 · 리뷰 관점 · 커밋), 저장소 쪽에는 스택 · 구조 · 세부 규약을 둔다. 공통 규칙은 PR 로 고친다.
- 실패 · 주의: 오프라인이거나 커밋 안 한 변경이 있으면 동기화가 실패한다. 훅은 임의 명령을 실행하므로 리뷰가 필요하다. submodule 은 항상 최신을 쓰는 데 맞지 않아 쓰지 않았다.

#### J5. Classmethod — とにかくToken圧縮をしたかった in CLAUDE.md

- URL https://dev.classmethod.jp/articles/20250731-just-wanted-to-compress-tokens-in-claude-md/ · 2025-07-31(haoyayoi) · 열람
- 방법: 일본어 CLAUDE.md(약 20줄)를 영어로 바꾸고 사람용 `CLAUDE_ja.md` 를 따로 둔다. 「소스 파일이 500줄을 넘으면 나눈다」는 규칙을 CLAUDE.md 에 둔다.
- 숫자(측정, 한 파일): 일본어 약 636–848 토큰 → 영어 약 81 토큰(87–91% 감소).
- 실패담: AI 는 명령 뒤에 붙인 `tee` 를 무시하고 테스트를 직접 돌려서, 로그용 테스트는 별도 스크립트 이름으로 만들었다.

#### J6. メルカリ — Taming Agents in the Mercari Web Monorepo

- URL https://engineering.mercari.com/en/blog/entry/20251030-taming-agents-in-the-mercari-web-monorepo/ · 2025-10-30(Maximilien Mellen) · 열람
- 관리: 여러 도구 규칙 통합 · 문서 구조 · 갱신.
- 방법: 따로 놀던 Cursor · Claude 규칙을 AGENTS.md 하나로 합쳤다. 주제별 문서는 `docs/commands.md` · `code-style.md` · `architecture.md` · `authentication.md` · `testing.md` 로 두고 링크한다. CLAUDE.md 는 심볼릭 링크. 이름은 처음에 AGENT.md 였다가 AGENTS.md 로 바꿨다. 설계에 크게 영향을 주는 PR 에서는 에이전트가 변경과 규칙을 비교해 규칙 수정을 제안하거나 코드 불일치를 표시한다. Claude 가 세션에서 배운 것을 요약해 CLAUDE.md 에 덧붙였다.
- 숫자: 없음. 효과는 경험담.
- 실패담: 도구 · 관리자마다 규칙이 어긋났고, 초기 AGENTS.md 는 「꽤 지저분」했다.

#### J7. SmartHR — マルチAIエージェント時代のルールの一元管理

- URL https://tech.smarthr.jp/entry/2026/03/12/134348 · 2026-03-12(murano) · 열람
- 관리: 여러 도구(Cursor · Claude Code · Devin · Copilot) 규칙.
- 방법: AGENTS.md 가 정본이고 `ln -s AGENTS.md CLAUDE.md`. 규칙은 코드 디렉터리마다 중첩 AGENTS.md 로 나눈다(`.mdc` 의 globs 가 필요 없어짐). 확장자 범위는 본문에 적는다. 이전용 프롬프트를 공개했다.
- 숫자: 사람이 코드를 직접 고치는 빈도가 2–3할 줄었다(체감).
- 실패담: 「당신이 Claude Code 라면…」 같은 도구별 분기는 에이전트가 자기 이름을 잘 몰라서 동작하지 않았다. AI 에게 기계적으로 옮기게 하니 규칙 단위가 맞지 않았다. 디렉터리를 너무 잘게 나누면 어디에 쓸지 헷갈린다.

#### J8. freee — Coding Agent が言うことを聞かないときどうする？

- URL https://developers.freee.co.jp/entry/coding-agent-context-refactor · 2026-02-13(him0) · 열람
- 내용: CLAUDE.md 의 「사용자가 지정했다면…」 조건이 섹션 전체에 걸린다고 해석되어, 마지막의 기본값 항목을 건너뛰었다. 명령형으로 바꾸고 다른 규칙과 형식을 맞추니 안정됐다. 무엇을 넣는지 모르고 계속 더하면 출력이 흔들린다고 경고한다.

#### J9. freee — スターの多いOSSは、どのようなAGENTS.mdを記述しているのか調べてみました

- URL https://developers.freee.co.jp/entry/oss-agents-md · 2025-12-13(shiba) · 열람
- 숫자(측정): 큰 OSS 7개(React · Vue · Next.js 등)에는 없었다. Sentry 는 백엔드 약 800줄 · 26KB, Temporal 은 약 100줄.
- 결론: 수백 줄 정도가 적당하고 1,000줄이면 무겁다. `/init` 결과를 그대로 쓰지 말고 반복해서 지적하는 것만 조금씩 더한다. 커지면 디렉터리별로 나누고, 작업 흐름은 명령으로 옮긴다.

#### J10. CyberAgent — chezmoiで始めるdotfile管理 〜AIエージェント設定を複数ツールと複数マシンで共有する〜

- URL https://developers.cyberagent.co.jp/blog/archives/65099/ · 2026-08-17(Roki) · 열람
- 방법: 공통 원본 `base.md.tmpl` 하나에서 `CLAUDE.md.tmpl` 과 `AGENTS.md.tmpl` 을 만든다(얇은 래퍼에는 도구 고유 내용만). 스킬은 심볼릭 링크로 공유한다. 비밀값은 암호화하고, 권한이 큰 스킬은 비공개 저장소에 둔다.
- 효과: 한 곳만 고치면 두 도구에 같이 반영된다(경험담). 개인 환경 중심이다.

#### J11. CyberAgent — 社内勉強会で900人以上が参加！Claude Codeのコスト最適化を支える5つの習慣

- URL https://developers.cyberagent.co.jp/blog/archives/66509 · 2026-10-14(Ken Takao, Anthropic Japan 강연 정리) · 열람
- 내용: CLAUDE.md 에는 매번 필요한 것만 둔다. 상황별 규칙은 `.claude/rules` 의 paths 나 스킬로 뺀다. CLAUDE.md 에서 `@` 로 다른 파일을 부르면 그것도 다 읽히므로, 파일을 나눠도 총량은 줄지 않는다. 기준은 파일 수가 아니라 「언제 필요한가」. 중요한 결정은 SPEC.md 같은 파일에 남긴다(`/compact` 요약은 세부를 잃는다). 작업이 바뀌면 `/clear`. 짧은 일까지 서브에이전트로 나누면 오히려 비싸다.
- 숫자: 없음. 효과는 같은 종류 작업의 사용량 · 완료 시간 · 추가 수정 횟수를 비교해 판단하라고 권함.

#### J12. LayerX — 同じプロンプトを何度も書きたくないので、AIとのやりとりを棚卸しする仕組み作った

- URL https://tech.layerx.co.jp/entry/prompt-log-driven-ai-workflow · 2026-06-18(yohei) · 열람
- 관리: 반복 지시 → 스킬 · 명령 · 일정 작업.
- 방법: UserPromptSubmit 훅이 프롬프트를 `~/.claude/logs/prompts.jsonl` 에 남긴다. 전역 CLAUDE.md 규칙: 같은 지시가 2번이면 기록하고, 3번이면 제도화를 제안하되 승인 없이 만들거나 지우지 않는다. 매일 LLM 이 의미로 묶어 Slack 에 보고한다. 만들지 말지는 사람이 정한다(규칙이 마구 늘어나는 것을 경계).
- 숫자(측정 = 발생 횟수): 패턴 29개 · 691회 중 22개(76%)를 스킬 · 명령으로 바꿈. 예: commit · push · PR 94회 → `/ship`.
- 실패담: 이미 만든 스킬이 다시 후보로 올라왔다. 만든 스킬이 불리지 않거나, 부른 뒤에도 같은 추가 지시를 반복했다.

#### J13. LayerX — 品質の言語化のススメ ー 早期テストの原則をClaude Code Agent Skillsで実現する試み

- URL https://tech.layerx.co.jp/entry/articulatin_quality · 2026-05-01(koyatest) · 열람
- 방법: 품질 기준(제품 단계 · 위험 · 테스트 범위)을 말로 정리해 스킬에 넣는다. 작업 중인 제품의 위험 정보만 읽게 한다(전체를 읽으면 정확도가 떨어짐). 단계가 불분명하면 사람에게 묻는다. 위험 정의는 팀 회고 때 갱신한다.
- 숫자(측정, skill-creator 평가): 테스트 커버리지 약 65% → 약 95%.

#### J14. LINE ヤフー(LINE iOS) — LINE iOSアプリ開発を高速化するClaude Code基盤の設計思想

- URL https://techblog.lycorp.co.jp/ja/20260119a · 2026-01-19 추정(giginet) · 열람
- 관리: 지시 파일 · 경로 규칙 · 개인 설정 · 서브에이전트 · 스킬 · MCP.
- 방법: `/init` 결과만으로는 큰 프로젝트에서 실패가 많았다. CLAUDE.md 에는 구조 · 모듈 · Project Spec 작성법 · 빌드 · 테스트만 두고, 코딩 규약 · 아키텍처는 일부러 뺐다(영어 약 2,400자 · 약 600 토큰). 기능별 지식은 `.claude/rules/features/` 경로 규칙으로 나눈다. 개인 설정은 `@~/.claude/line-dev/line-ios.md` 로 불러온다(SessionStart 훅이 파일을 만듦). `CLAUDE.local.md` 는 git worktree 사이에서 공유가 어려워 쓰지 않았다. 빌드 로그가 메인 맥락을 더럽히지 않게 서브에이전트 5개를 둔다. 공통 MCP 는 맥락을 차지해서 넣지 않았다. 지시문 다듬기는 AI 에게 맡긴다.
- 실패담: 매번 전체 빌드를 하고, 구현 위치를 못 찾고, 프로젝트 생성을 빠뜨렸다.

#### J15. LINE ヤフー — Claude Code × MCPで実現するPRレビュー準備の自動化

- URL https://techblog.lycorp.co.jp/ja/20260122a · 2026-01-22 추정 · 열람
- 방법: PR URL 을 명령에 넘기면 GitHub · Jira · Confluence 를 따라가 템플릿대로 리뷰 요약을 만든다. 판단은 사람이 한다.
- 숫자: 주 6시간 절감(글 스스로 「체감값」, 가정으로 계산).
- 실패담: AI 의 지적에 끌려가 틀린 리뷰 코멘트를 남겼다(실제 구현은 맞았음). 이후 근거를 되묻게 됐다.

#### J16. Money Forward — Claude 고객 사례

- URL https://claude.com/ja/customers/money-forward · 날짜 미확인 · 2차 · [벤더]
- 내용: 스타일 가이드를 바탕으로 PR 흐름에 Claude Code 를 넣는 내부 템플릿을 만들었다. 리뷰 전에 개발자가 먼저 고쳐서 리뷰어 부담이 줄었다. 숫자 · 지시 파일 세부는 없음.

---

### 정리

#### ① 여러 곳이 공통으로 하는 것 — 상위 10

같은 내용을 글에 적은 곳을 셌다(내 분류라 경계가 겹친다. 벤더 · 2차 포함, 괄호는 대표 사례).

| #   | 하는 일                                                                            | 곳 수 | 대표 사례                                                                                                                                                                |
| --- | ---------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 지시 파일은 짧게, 매번 필요한 것만. 나머지는 따로 두고 가리킨다(색인 · 점진 공개)  | 약 15 | OpenAI(2차) · HumanLayer · Vercel · Cloudflare · Mercari · LINE iOS · freee · CyberAgent · Thoughtworks · Böckeler · 우아한 · 토스(K2 · K3) · DeNA(J3) · Classmethod(J5) |
| 2   | 규칙을 문장 대신 결정적 검사(훅 · 린터 · 타입 · CI · 검증 도구)로 강제한다         | 약 13 | Boris · Every · HumanLayer · Builder · Stripe · Spotify · 토스뱅크 · Intercom · Airbnb · Ronacher · Hashimoto · Factory · OpenAI(2차)                                    |
| 3   | 반복 작업은 지시 파일 밖의 스킬 · 명령으로 옮긴다                                  | 약 12 | Boris · Every · Builder · Intercom · Ramp · LayerX(J12) · 토스(K3) · 우아한 · LINE iOS · Steinberger · freee(J9) · Classmethod(J4)                                       |
| 4   | AI 리뷰가 1차, 사람이 최종 판단 · 머지                                             | 약 11 | Stripe · Ramp · Uber · Cloudflare · LINE NEXT · LINE(J15) · Every · Builder · Intercom · Coinbase · 카카오페이                                                           |
| 5   | 문서는 AI 가 초안 · 갱신 제안, 사람이 검토 · 승인(자동 적용은 하지 않음)           | 약 10 | Cloudflare · Mercari · DeNA(J2) · ZOZO · LayerX(J12) · GitHub · Intercom · Steinberger · LINE iOS · Builder                                                              |
| 6   | 에이전트가 스스로 확인할 피드백 루프를 준다(테스트 · 스크린샷 · 로그 · 텔레메트리) | 약 10 | Boris · Ramp · Spotify · Stripe · Airbnb · Hashimoto · Ronacher · Steinberger · Anthropic 팀 · 당근(2차)                                                                 |
| 7   | 공용 지시 · 규칙을 git 으로 공유하고 PR · MR 로 고친다(중앙 저장소 포함)           | 약 9  | Boris · Mercari · Cloudflare · Classmethod(J4) · ZOZO · LINE NEXT · 토스뱅크 · Intercom · DeNA(J2)                                                                       |
| 8   | 큰 작업은 명세 · 계획 문서를 먼저 쓰고 실행을 나눈다                               | 약 9  | Harper Reed · 카카오페이 · Böckeler(SDD, 가볍게만) · Boris(plan) · Willison · Hashimoto · CyberAgent(SPEC.md) · Every(/feature-dev) · OpenAI(2차)                        |
| 9   | 에이전트가 실수하면 그때 한 줄을 더한다(처음부터 다 쓰지 않음)                     | 약 8  | Boris · Hashimoto · Steinberger · GitHub · freee(J9) · Mercari · 토스뱅크(PR 코멘트 → 규칙 후보) · LayerX(J12)                                                           |
| 10  | 경로 · 디렉터리마다 규칙을 나눈다(조건부 규칙 · 중첩 AGENTS.md)                    | 약 8  | Stripe · LINE iOS · 우아한 · SmartHR · CyberAgent(J11) · DeNA(J3) · Böckeler · freee(J9)                                                                                 |

그 다음으로 많은 것:

- 지시 · 스킬이 실제로 쓰이는지 기록하고 잰다(약 8곳: Intercom · LayerX ×2 · 토스뱅크 · ZOZO · DeNA · Uber · Vercel).
- 병렬 세션은 세션마다 다른 checkout · 샌드박스로 떼어 놓는다(6곳: Boris · Willison · Stripe · Ramp · LINE iOS · Ronacher).
- 여러 도구를 쓰면 AGENTS.md 를 정본으로 하고 CLAUDE.md 는 링크 · 생성으로 만든다(6곳: Mercari · SmartHR · Steinberger · CyberAgent · Stripe · Cloudflare).
- 「항상 / 묻기 / 금지」 경계를 쓴다(약 5곳).

#### ② 갈리는 것

| 쟁점                               | 한쪽                                                                                               | 다른 쪽                                                                                                                                                           |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 지시 파일 길이                     | 60줄 미만(HumanLayer), 약 100줄(OpenAI 2차 · Temporal), 약 600 토큰(LINE iOS), 약 2.5k 토큰(Boris) | 약 800줄(Steinberger · Sentry), Anthropic 사내는 수천 줄도 있고 「짧을수록 좋다는 건 오해」(DeNA 가 전한 발언). freee 는 수백 줄이 적당하고 1,000줄은 무겁다고 봄 |
| AI 가 지시 파일을 써도 되나        | `/init` 금지, 손으로 한 줄씩(HumanLayer). `/init` 만으론 실패(LINE iOS). 그대로 쓰지 말 것(freee)  | 대부분 Codex 가 씀(Steinberger). 파이프라인으로 3,900개 생성 후 MR 검토(Cloudflare). Claude 가 만들게(Builder)                                                    |
| 상시 맥락 vs 필요할 때 부르는 스킬 | 색인을 AGENTS.md 에 두니 100%, 스킬은 56% 미호출(Vercel)                                           | 스킬 100개 이상(Intercom), 스킬 대량 운영 · 품질 관리(토스). 다만 스킬이 안 불리는 문제는 양쪽 모두 겪음(토스 · DeNA · LayerX)                                    |
| 파일을 나누면 맥락이 줄어드나      | 경로 규칙 · 하위 폴더 규칙으로 줄어든다(Stripe · LINE · 우아한)                                    | `@` 로 부르면 다 읽혀서 총량은 같다(CyberAgent). 너무 잘게 나누면 헷갈린다(SmartHR)                                                                               |
| 훅으로 강제                        | 많이 쓴다(Boris · Intercom · 토스뱅크 · Classmethod)                                               | 의지가 강한 모델은 우회한다(Steinberger). Bash 로 우회한다는 댓글(토스뱅크 글)                                                                                    |
| MCP · 도구 수                      | 400개 이상 도구 묶음(Stripe), 서버 13개(Cloudflare)                                                | 공통 MCP 안 넣음(LINE iOS), CLI 가 낫다(Steinberger · Ronacher), 도구는 최소(Spotify)                                                                             |
| 병렬 세션                          | 세션마다 따로 checkout(Boris · Willison), 격리 VM(Stripe · Ramp)                                   | 같은 폴더에서 3–8개 + 자기 파일만 커밋(Steinberger). 에이전트는 하나가 좋다(Hashimoto)                                                                            |
| 명세 주도 개발                     | 단계별 문서 체계(카카오페이 · Kiro · spec-kit)                                                     | 작은 일엔 과하고 리뷰 과부하(Böckeler). 대화로 반복하는 게 낫다(Steinberger)                                                                                      |
| 기억 · 문서 정리                   | 짧게 다듬고 낡은 건 지운다(대부분)                                                                 | 지우지 않고 다 남긴 뒤 검색으로 찾는다(ZOZO — 정리하니 저장이 줄었음)                                                                                             |
| 빌드 · 검증 정보를 어디에          | AGENTS.md 에 명령으로(GitHub · Cloudflare · LINE)                                                  | 저장소마다 달라 MCP 검증 도구에 넣는다(Spotify)                                                                                                                   |
| 지시문 언어                        | 영어로 쓰고 사람용 번역본을 따로(Classmethod, 일본어에서 87–91% 절감)                              | 모국어로 지시(카카오페이 「한글로」, 토스 · LINE NEXT 리뷰 프롬프트)                                                                                              |

#### ③ 숫자로 효과를 보인 사례

측정이 있는 것(대부분 자체 측정이고 대조군이 없다):

- **Vercel**: AGENTS.md 문서 색인 100% vs 스킬 53%(기본) · 79%(쓰라는 지시), 스킬 56% 미호출, 40KB → 8KB 로 줄여도 유지. 표본 · 모델 미공개.
- **ZOZO**: 자동 회상이 알리기만 하면 0%(110건) → 「답하기 전에 떠올려라」 지시로 65.4%(208건). 읽기 약 800회, 3위 안 적중 68.9%.
- **LayerX(J13)**: 품질 스킬로 테스트 커버리지 약 65% → 약 95%(skill-creator 평가).
- **LayerX(J12)**: 반복 패턴 29개 · 691회 중 22개(76%)를 스킬 · 명령으로 바꿈(발생 횟수).
- **우아한형제들**: 전처리 스크립트로 입력 94.5–97.7% 감소, 탐색 호출 4 → 1.
- **Classmethod(J5)**: CLAUDE.md 를 영어로 바꿔 토큰 87–91% 감소(파일 하나).
- **Airbnb**: 3,500개 파일, 4시간에 75% → 조정 4일 뒤 97%, 1.5년 추정 → 6주.
- **Uber**: AI 리뷰 코멘트 75% 유용, 65% 반영(사람 코멘트 51%). 「주 1,500시간」은 추정.
- **토스뱅크**: AI 로 관련성 판정 시 요청당 약 10초 지연, 오탐 규칙 21세션 발동 · 변경 0건.
- **Cloudflare**: 사용자 3,683명(R&D 93%), 주간 처리량 약 5,600 → 8,700+(지표 이름이 분명하지 않음).
- **방법 미공개 측정**: Stripe 주 1,000+ 머지 PR, Ramp 머지 PR 약 30%, Intercom 1인당 머지 PR 2배(9개월), OpenAI(2차) 5개월 약 100만 줄 · PR 1,500개 · 3명.
- **벤더**: Factory 평가 편차 7% → 0.6%(저장소 9개), Coinbase/Cursor PR 75%.

경험담 · 추정:

- Boris 검증 루프 품질 2–3배, plan mode 성공률 2–3배(발언).
- SmartHR AGENTS.md 통합 뒤 사람이 고치는 빈도 2–3할 감소(체감).
- Anthropic 팀 「3배」 · 「80%」, LINE PR 준비 주 6시간(체감 계산), 토스 스킬 본문을 줄이면 비용 1/3(추정).
- **지시 파일 자체의 효과를 대조 실험으로 보인 곳은 Vercel 하나뿐이다.** ZOZO 는 지시 문구 하나를 바꾼 전후 비교다.

#### ④ 실패 · 반대 사례

지시 파일이 안 먹힘:

- Claude 가 CLAUDE.md 를 자주 무시한다. 땜질 지시를 계속 덧붙인 것이 원인이다(HumanLayer).
- 전역 AGENTS.md 는 긴 세션에서 잊힌다 → 편집 시점에 훅으로 넣는 방식으로 바꿨다(토스뱅크).
- 조건문이 섹션 전체에 걸린다고 해석되어 기본값을 건너뛰었다(freee).
- 「당신이 Claude 라면」 같은 도구별 분기는 실패했다(SmartHR).
- 명세 tasks 가 constitution 을 무시했고(카카오페이), 이미 있는 클래스를 다시 만들었다(Böckeler).

문서가 낡거나 늘어남:

- 낡은 AGENTS.md 는 없는 것보다 나쁘다. 첫 자동 생성은 부정확했다(Cloudflare).
- 써 놓고 방치되어 실제와 어긋났다(DeNA).
- 도구 · 관리자마다 규칙이 어긋났고, 초기 파일이 지저분했다(Mercari).
- spec-kit 은 반복 마크다운이 많아 리뷰 과부하, 작은 버그 하나가 기준 16개가 됐다(Böckeler).
- 한 번만 쓸 지시를 상시 규칙으로 만들지 말 것(Cherny, Every).

스킬 · 자동화가 안 먹힘:

- 스킬 56% 미호출(Vercel), description 에 호출 조건이 없어 미호출(토스), 만든 스킬이 안 불림 · 다시 후보로 올라옴(LayerX).
- 정리 · 중복 제거를 하니 기록이 줄었고, 알리기만 하는 자동 회상은 0%(ZOZO).
- 한국어를 영어 정규식으로 검사해 오탐(토스), 정규식 규칙의 오탐 · 누락(토스뱅크).

도구 · 병렬 · 리뷰:

- 도구를 늘리면 예측이 어려워졌고, 아직 「직감으로」 움직인다(Spotify).
- 공통 MCP 가 맥락을 차지했다(LINE iOS). GitLab MCP 설명만 약 1.5만 토큰(Cloudflare).
- 팀에서 병렬 세션은 머지 충돌을 낳는다(Harper Reed). 이미 떠 있는 서버를 또 띄워 포트 충돌 → pidfile(Ronacher).
- AI 리뷰 지적에 끌려가 틀린 코멘트(LINE J15). 단발 프롬프트 리뷰는 없는 문제를 지어냄(Uber). 기본 리뷰봇이 장황함(Builder).
- 훅 · 플러그인 · 서브에이전트 · SDD 를 아예 거부(Steinberger).
- 처음에는 에이전트 결과를 고치는 데 시간이 더 들었다(Hashimoto).

문서를 AI 가 쓴 티:

- 토스 두 글에 「AI 가 쓴 것 같다」는 댓글이 달려 신뢰 비용이 생겼다(K1 · K3).

#### ⑤ 이 사람(1인 · 여러 세션 동시 · 문서를 AI 와 같이 씀)에게

**맞는 것**

1. **짧은 정본 + 색인, 세부는 가리키기**(OpenAI · HumanLayer · Mercari · LINE iOS, 약 15곳). Vercel 결과로 보면, 꼭 지켜야 할 규칙은 스킬에만 두지 말고 항상 읽히는 파일이나 그 색인에 남기는 편이 안전하다. 다만 `@` 로 불러오면 다 읽히니 「언제 필요한가」로 나눈다(CyberAgent).
2. **기계로 잡을 수 있는 규칙은 검사로 옮기기**(훅 · 테스트 · 린트, 약 13곳). 토스뱅크 방식(편집 직후 정규식으로 관련 규칙 1–2개만 넣기, 끝나기 전 diff 로 다시 보기)은 혼자서도 만들 수 있고, 긴 세션에서 규칙을 잊는 문제를 직접 겨냥한다. 우회 위험(Bash)과 오탐 기록은 같이 둔다.
3. **실수할 때만 한 줄 더하고 주기적으로 빼기**(Hashimoto · Boris · freee). 한 번만 쓸 지시는 규칙으로 만들지 않는다(Every · HumanLayer 경고). 이미 「같은 실수가 두 번이면 한 줄」 규칙이 있다면 근거가 가장 많은 방향과 같다.
4. **AI 는 제안, 사람은 승인**(DeNA · ZOZO · Cloudflare · Mercari · LayerX). 문서를 AI 와 같이 쓰는 이 사람에게 그대로 맞는다. AI 의 수정은 diff 로 보이고 자동 적용하지 않는다.
5. **반복 지시 기록 → 스킬 후보**(LayerX J12 — 2번이면 기록, 3번이면 제안, 승인 없이 만들지 않음). 프롬프트 로그 훅 하나면 되므로 1인 규모에 맞는다. 로그 저장 위치와 마스킹은 먼저 정한다.
6. **낡은 문서 감지**(Cloudflare 「낡으면 더 나쁨」, Intercom 주간 사실 확인, ZOZO 「코드 바뀌면 경고」). 문서가 가리키는 경로 · 파일 · 명령이 실제로 있는지 보는 검사는 싸고 효과가 분명하다.
7. **세션마다 작업 공간 떼어 놓기**(Boris 별도 checkout · Willison `/tmp` · Stripe, 6곳). 여러 세션을 동시에 돌리면 같은 파일 충돌과 서버 · 포트 같은 공유 상태(Ronacher)가 먼저 문제가 된다.
8. **결정은 지우지 않고 최신을 따른다**(ZOZO). 결정을 파일마다 남기고 옛 기록은 읽기 전용으로 두는 방식과 같다.
9. **효과는 체감 대신 같은 작업끼리 비교**(CyberAgent: 사용량 · 완료 시간 · 추가 수정 횟수). 1인이라도 몇 건씩 비교하는 정도는 할 수 있다.

**맞지 않는 것**

1. **회사 규모 플랫폼** — Stripe 400개 도구, Cloudflare 3,900개 저장소 생성 파이프라인, Intercom 텔레메트리, Uber 리뷰 필터. 인프라와 사람이 있어야 하고, 1인에게는 관리 비용이 효과보다 크다.
2. **무거운 명세 주도 개발(spec-kit 전 단계)** — 만든 쪽(카카오페이)도 작은 작업엔 맞지 않다고 했다. 리뷰할 문서가 늘어 리뷰 병목(Willison)을 키운다(Böckeler). 가벼운 「명세 먼저」나 계획 정도만 맞다.
3. **같은 폴더 병렬 + 에이전트 자동 커밋**(Steinberger) · **훅이 자동 커밋 · PR**(ZOZO) — git 을 사람이 직접 하는 규칙과 충돌한다.
4. **수천 줄 지시 파일**(Anthropic 사내 발언) — 대부분의 사례와 반대이고, 세션마다 매번 읽히므로 동시 세션 수만큼 비용이 커진다.
5. **도구별 분기 문장**(「당신이 Claude 라면」) — SmartHR 에서 실패했다. 도구별 차이는 얇은 별도 파일(CLAUDE.md 의 Claude 전용 메모)로 두는 편이 근거와 맞다.
6. **공통 MCP 를 많이 연결하기** — 맥락을 차지한다(LINE iOS · Cloudflare). CLI 가 있으면 CLI(Ronacher · Steinberger).
7. **중앙 공통 규칙 저장소 + 심볼릭 링크**(Classmethod · 토스뱅크) — 저장소가 하나뿐이면 과하다. 저장소가 여러 개로 늘 때만 고려할 만하다(근거 2곳, 근거 약함).
8. **지시문 영어화** — 근거는 일본어 파일 하나(Classmethod)뿐이고(근거 약함), 사람이 같이 읽는 문서를 두 벌로 관리하는 비용이 생긴다. 답변 · 문서를 한국어로 쓰는 규칙과도 맞지 않는다.
9. **「AI 티」가 나는 문서** — 토스 두 글의 댓글처럼, AI 와 같이 쓴 문서는 남이 읽으면 신뢰 비용이 생긴다. 공개 문서라면 사람이 마지막에 다듬는 단계가 필요하다(직접 근거 2곳, 근거 약함).

---

### 페이지 안의 AI 대상 문구(따르지 않고 적기만 함)

- LINE iOS(J14): 규칙 예시 안에 「이 기능은 비밀이니 프로젝트 이름을 말하지 말라」는 취지의 영어 문장과 `@` import 줄. 글의 예시 인용이다.
- LINE NEXT(K7): 리뷰 프롬프트 예시에 「CRITICAL」 · 「You MUST apply the format…」, 한국어로 쓰라는 지시, 「As a senior code reviewer」. 글의 예시 인용이다.
- Mercari(J6): AGENTS.md 발췌에 「ALWAYS import…」 · 「NEVER add inline styles」. 예시 인용이다.
- 토스뱅크(K2): 훅이 넣는 문구 예시(팀 규약을 적용하라, 이미 따르면 그대로 두라). 예시 인용이다.
- HumanLayer(A16): Claude Code 가 넣는 system-reminder 를 예시로 인용했다.
- 참고: 카카오 posts/711 과 DeNA(J2)를 가져올 때 요약 도구가 「페이지에 지시문이 있다」고 했는데, 그 내용은 내가 보낸 요청 문장과 도구 쪽 안내문이었다. 페이지 문구로 세지 않았다.

### 제외 · 확인 못 함

- 카카오 「Beyond Vibe Coding to Agentic Coding」(tech.kakao.com/posts/711): 본문을 불러오지 못해 셈에서 뺐다.
- OpenAI Harness engineering: 원문 403 → 2차로만 셈(A7).
- 여기어때 · 무신사: 403 → 검색 요약 2차로만 셈(K9 · K10).
- Shopify · Notion · Linear · 네이버 · 뱅크샐러드: 엔지니어링 사례 글을 찾지 못함. Linear 의 「자사 버그 30% 자동 수정」은 발표문을 2차로 본 것뿐이라 셈에서 뺐다.
- Sourcegraph/Amp · Factory 의 AGENTS.md 설명: 공식 문서 성격이라 다른 갈래 몫. Factory 준비도 글만 [벤더]로 넣었다.
- Anthropic 「Claude Code best practices」: 공식 문서로 리디렉트되어 다른 갈래 몫.
- Latent Space(Boris · Cat): 청취 노트만 있음(Claude Code 코드의 약 80% 를 Claude Code 가 씀, GitHub Action 으로 린트). 2차의 2차라 셈에서 뺐다.
- Thoughtworks Radar 의 AGENTS.md 항목은 현재 판에서 빠졌다고 페이지에 적혀 있다.

## D. 연구 · 측정

조사일 2026-10-24. 방법은 WebSearch · WebFetch 뿐이다(설치 · 실행 없음). 「숫자 그대로」 칸의 숫자는 아래 열람 수준에 적은 출처에서 옮겼고, 지어낸 수치는 없다.

열람 수준 뜻

- **열람** — 본문(HTML · PDF)을 읽고 수치를 뽑았다. WebFetch 요약 모델을 거쳤으므로 표 값은 한 번 걸러진 값이다. 「Lost in the Middle」만 PDF 쪽 이미지를 직접 봤다.
- **일부** — 본문 중 특정 표 · 절만 읽었다.
- **초록만** — arXiv · 학회 초록만 읽었다.
- **2차** — 블로그 · 요약 사이트로만 확인했다. 원문 수치와 다를 수 있다.

종류 뜻: 동료심사 = 학회 · 저널 게재 확인 / 프리프린트 = arXiv 만 / 회사 측정 / 개인 측정.

표본: **40곳** (지시 파일 실증 12 · 지시 수 · 길이 · 위치 10 · 지시 계층 · 대화 4 · 저장소 문서 · 명세 · 검색 6 · 형식 · 강조 · 예시 · 결정 기록 8). 동료심사 21 · 프리프린트 15 · 회사 측정 3 · 개인 측정 1. 이 중 지시 파일이 에이전트 결과를 바꾸는지 직접 통제 실험한 것은 4곳(A1 · A2 · A3 · A4)뿐이다. A4는 회사 자체 평가다.

---

### A. 지시 파일(AGENTS.md · CLAUDE.md · cursor rules) 실증 — 12곳

#### A1. Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?

- 저자/기관: Gloaguen, Mündler, Müller, Raychev, Vechev — ETH Zürich · LogicStar.ai
- 날짜 · URL: 2026-02-12 · https://arxiv.org/abs/2602.11988
- 종류: 프리프린트(ICLR 2026 행사 페이지에 올라 있으나 본회의인지 워크숍인지 미확인)
- 방법: SWE-bench Lite 300과제(11개 저장소, 개발자가 쓴 지시 파일 없음)와 새 AGENTbench 138과제(12개 저장소, 모두 개발자가 쓴 지시 파일 있음, PR 5,694개에서 추림). Claude Code + Sonnet-4.5, Codex + GPT-5.2 · GPT-5.1 mini, Qwen Code + Qwen3-30b-coder. 조건: 파일 없음 / 에이전트 권장 명령으로 LLM이 만든 파일 / 사람이 쓴 파일.
- 핵심 결과:
    - 사람이 쓴 파일: AGENTbench에서 해결률 평균 **+4%**. 본문은 「Claude Code를 뺀 모든 에이전트에서」 올랐다고 쓴다. 단계 수는 평균 +3.34, 비용은 최대 **+19%**.
    - LLM이 만든 파일: SWE-bench Lite **−0.5%p**, AGENTbench **−2%p**(서론에는 평균 −3%). 8개 설정 중 5개에서 떨어짐. 단계 수 +2.45 / +3.92, 비용 **+20% / +23%**.
    - 지시는 지킨다: 파일에 적힌 도구는 훨씬 많이 쓴다(uv: 적었을 때 과제당 1.6회, 안 적었을 때 0.01회 미만. 저장소 전용 도구: 2.5회, 0.05회 미만). 테스트 실행과 탐색도 늘었다.
    - 개요는 소용없었다: 사람이 쓴 파일 12개 중 8개에 코드베이스 개요가 있고 4개는 디렉터리를 나열한다. LLM이 만든 파일은 Sonnet-4.5 100% · GPT-5.2 99%가 개요를 넣었다. 그래도 PR이 고친 파일에 처음 닿기까지의 단계 수는 줄지 않았다. 저자 결론: 「not effective at providing a repository overview」.
    - 기존 문서를 지운 저장소에서는 LLM이 만든 파일이 **+2.7%**로 사람이 쓴 파일을 이겼다. LLM 파일이 이미 있는 문서와 겹친다는 해석이다.
    - 사람이 쓴 파일 길이: 평균 641단어(24–2,003), 평균 9.7절(1–29).
- 한계: Python만 봤고 해결률만 쟀다(효율 · 보안 제외). 에이전트별 수치는 그림에만 있다.
- 시사점: 파일에 적은 명령 · 도구는 그대로 쓰이므로 남길 가치가 있다. 폴더 개요 줄(`폴더: app/ …`)은 측정상 이득이 없고 탐색만 늘릴 수 있다.
- 열람 수준: 열람

#### A2. On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents

- 저자/기관: Lulla(SMU), Mohsenimofidi(Heidelberg), Galster(Bamberg), J. M. Zhang(KCL), Baltes(Heidelberg), Treude(SMU)
- 날짜 · URL: 2026-01-23(v2 2026-03-30) · https://arxiv.org/abs/2601.20404
- 종류: 동료심사(JAWs 2026 워크숍)
- 방법: 단일 루트 AGENTS.md가 있는 저장소 10곳, 병합 PR 124개(≤100줄 · ≤5파일 · 코드만). Codex CLI + gpt-5.2-codex. 같은 과제를 파일이 있을 때와 없을 때 짝지어 실행.
- 핵심 결과(없음 → 있음): 실행 시간 중앙값 98.57초 → 70.34초(**−28.64%**). 출력 토큰 중앙값 2,925 → 2,440(**−16.58%**). 총 토큰 중앙값 223,707 → 226,582(+1.29%). Wilcoxon 검정에서 유의한 것은 시간과 출력 토큰뿐이다. 완료 행동은 「비슷하다」(무작위 50건만 손으로 확인).
- 한계: 모델 하나, 작은 PR만, 정답 여부는 재지 않았다. 원인 설명은 추측이다.
- 시사점: 사람이 쓴 루트 파일은 속도 · 출력량을 줄이는 쪽으로 측정됐다. 정답률 근거는 아니다.
- 열람 수준: 열람

#### A3. Instruction Adherence in Coding Agent Configuration Files: A Factorial Study of Four File-Structure Variables

- 저자/기관: Damon McMillan(소속 미표기)
- 날짜 · URL: 2026-05-11 · https://arxiv.org/abs/2605.10039
- 종류: 프리프린트
- 방법: CLAUDE.md 류 파일에서 네 변수를 요인 설계로 바꿨다: 파일 크기(짧음/긺), 지시 위치(맨 위/묻힘), 구조(한 파일/나눔), 옆 디렉터리 파일과의 모순. 목표는 사소한 코드 표기 규칙 하나. Claude Code CLI 1,650세션, 함수 단위 관찰 16,050개, TypeScript 코드베이스 2개 · 과제 5개. 주 모델 Sonnet 4.6, 교차 확인 Opus 4.6 · 4.7. 혼합효과 모형과 베이즈 분석.
- 핵심 결과:
    - 네 변수와 두 변수씩 묶은 상호작용 3개 모두 다중검정 보정 뒤 효과가 보이지 않았다.
    - 크기 · 모순의 효과 없음은 베이즈 인자로도 뒷받침된다(BF10 0.05–0.10). 위치 · 구조는 효과를 찾지 못한 것일 뿐, 없다는 증거는 아니다.
    - 가장 큰 효과는 세션 안에 있었다. 함수를 하나 더 만들 때마다 준수 승산이 약 **5.6%** 줄었다(OR 0.944, 단조롭지는 않음). 사후에 발견했고, 두 번째 코드베이스와 Opus 4.6에서 재현됐다.
    - 2차 블로그에 따르면 과제 사이 준수율 차이가 **26.2%p**였다.
- 한계: 규칙 하나가 사소하고, Claude Code에 TypeScript뿐이다. 파일 크기 실제 값은 초록에 없다.
- 시사점: 「짧게 · 맨 위에 · 한 파일로」가 규칙 하나의 준수를 바꾼다는 측정 근거는 없다. 세션이 길수록 준수가 떨어지므로 끝내기 전 점검(ai-check 다시 보기)이 더 효과적일 수 있다.
- 열람 수준: 초록만(+2차 블로그 https://codex.danielvaughan.com/2026/07/04/agents-md-structure-doesnt-matter-factorial-study-instruction-adherence-codex-cli/)

#### A4. AGENTS.md outperforms skills in our agent evals

- 저자/기관: Jude Gao — Vercel
- 날짜 · URL: 2026-01-27 · https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals
- 종류: 회사 측정
- 방법: 학습 데이터에 없는 Next.js 16 API(`'use cache'` · `connection()` · `forbidden()` · `proxy.ts` · async `cookies()` 등) 평가 묶음. 행동 기반 단언으로 판정. 평가 수와 모델은 밝히지 않았다.
- 핵심 결과(통과율): 문서 없음 53% / 스킬 기본 53%(**56%** 사례에서 스킬을 아예 부르지 않음) / 스킬 + 명시 지시 79% / **AGENTS.md에 문서 색인 100%**. 빌드 · 린트 · 테스트는 각각 84·95·63 → 84·89·58 → 95·100·84 → 100·100·100. 색인은 40KB에서 8KB로 80% 줄여도 100%를 유지했다. 색인은 디렉터리 경로를 문서 파일 이름에 잇는 파이프 구분 형식이고, 본문은 에이전트가 파일을 열어 읽는다.
    - 문구 실험: 「You MUST invoke the skill」은 문서 패턴에 매여 프로젝트 맥락(`next.config.ts`)을 놓쳤다. 「먼저 프로젝트를 살피고 그다음 스킬」이 더 나았다.
- 한계: 자사 평가이고 연구 중에 평가 묶음을 고쳤다. 모델과 표본 수를 밝히지 않았다.
- 시사점: 「필요할 때 부르는」 방식은 부를지 말지를 에이전트가 정하는 순간 실패한다. 이긴 방식은 항상 실린 색인 + 파일 읽기다. 지금 구조(색인 + 부품 · 화면 파일)는 색인이 항상 읽히는 자리에 있을 때 이 결과와 맞는다.
- 열람 수준: 열람

#### A5. SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks

- 저자/기관: Xiangyi Li(BenchFlow) 외 40명 — Amazon · Stanford · CMU · Berkeley 등
- 날짜 · URL: 2026-02(arXiv 2602.12670) · https://arxiv.org/abs/2602.12670 · NeurIPS 2026 포스터 https://neurips.cc/virtual/2026/poster/139353
- 종류: 동료심사(NeurIPS 2026)
- 방법: 과제 84개. v1은 11개 분야, NeurIPS 초록은 8개 분야. Claude Code · Gemini CLI · Codex CLI에 7개 모델(GPT-5.2, Claude Opus 4.5 · 4.6 · Sonnet 4.5 · Haiku 4.5, Gemini 3 Pro · Flash), 궤적 7,308개(NeurIPS 7,326개). 스킬 없음 / 사람이 고른 스킬 / 모델이 스스로 만든 스킬.
- 핵심 결과(v1): 통과율 24.3% → 사람이 고른 스킬 40.6%(**+16.2%p**, NeurIPS +16.4%p) / 스스로 만든 스킬 21.5%(**−1.3%p**).
    - 분야 차이가 크다: 의료 +51.9%p, 소프트웨어 공학 **+4.5%p**. 84과제 중 16개(NeurIPS 18개)는 오히려 떨어졌다.
    - 스킬 수: 1개 +17.8 / 2–3개 +18.6 / 4개 이상 +5.9.
    - 스킬 분량: 자세함 +18.8 / 간결 +17.1 / 보통 +10.1 / **망라형 −2.9**.
    - Haiku 4.5에 스킬을 주면 27.7%로, 스킬 없는 Opus 4.5(22.0%)를 앞섰다.
- 한계: 소프트웨어 공학 이득이 가장 작다. v1과 NeurIPS 숫자가 조금 다르다.
- 시사점: 사람이 고른 절차 지식은 크게 도움이 되고, 스스로 만든 것과 망라형 문서는 효과가 없거나 해롭다. 가이드 문서는 「작업에 필요한 것만」 원칙이 맞다.
- 열람 수준: 열람(v1 본문 앞부분) + 초록(NeurIPS)

#### A6. Configuration Smells in AGENTS.md Files: Common Mistakes in Configuring Coding Agents

- 저자/기관: dos Santos, Costa, Montandon, Silva, Valente — UFMG 등
- 날짜 · URL: 2026-06-14(v5 07-30) · https://arxiv.org/abs/2606.15828
- 종류: 동료심사(SCAM 2026)
- 방법: 회색 문헌 검토와 저장소 마이닝으로 「냄새」 6종을 정하고, 인기 저장소 100곳의 AGENTS.md · CLAUDE.md를 휴리스틱으로 검출한 뒤 손으로 확인.
- 핵심 결과:
    - Lint Leakage(린터가 이미 강제하는 규칙을 다시 적음): 탐지 62% / 확인 58%
    - Context Bloat(200줄 이상): 42%(216–1,477줄)
    - Skill Leakage(드물게 쓰는 절차를 본 파일에 둠): 35% / 29%
    - Init Fossilization(/init 뒤 한 번도 안 고침): 24%
    - Conflicting Instructions(서로 모순): 28% / 16%(정밀도 57%)
    - Blind Reference(언제 · 왜 읽는지 없이 문서만 가리킴): 16% / 14%
    - 냄새가 하나 이상 있는 파일 91%(2차 블로그 수치)
- 한계: 냄새가 결과를 나쁘게 한다는 것은 재지 않았다. 200줄 기준도 Anthropic 지침을 가져온 것이다.
- 시사점: AGENTS.md(약 125줄)는 Bloat 기준 아래다. 테스트 · 린트로 이미 막는 규칙을 문장으로도 반복하는지, 링크마다 「언제 읽는지」가 붙어 있는지 점검할 만하다(효과는 측정되지 않은 기준).
- 열람 수준: 열람

#### A7. On the Use of Agentic Coding Manifests: An Empirical Study of Claude Code

- 저자/기관: Chatlatanagulchai 외 7명 — Kasetsart University · NAIST
- 날짜 · URL: 2025-09-18 · https://arxiv.org/abs/2509.14744
- 종류: 동료심사(PROFES 2025 단편 · 포스터, researchr 등재)
- 방법: Claude.md 838개 중 거른 253개(저장소 242곳, 2025-02-24–06-16 생성). 제목 깊이를 세고 15개 범주로 손 분류(평가자 2명 + 3번째 조정).
- 핵심 결과: 제목 깊이 중앙값 H1 1 · H2 5 · H3 9로 얕은 구조. 내용은 빌드 · 실행 77.1%, 구현 세부 71.9%, 아키텍처 64.8%, 테스트 60.5%, 시스템 개요 48.2%, 보안 8.7%, UI/UX 8.3%.
- 한계: 무엇을 쓰는지만 봤고 효과는 재지 않았다. 길이 통계는 보고하지 않았다.
- 시사점: 「다들 이렇게 쓴다」는 근거일 뿐이고, 효과의 근거는 아니다.
- 열람 수준: 열람

#### A8. Agent READMEs: An Empirical Study of Context Files for Agentic Coding

- 저자/기관: Chatlatanagulchai, Hao Li, … Bram Adams, Ahmed E. Hassan, Hajimu Iida 등 11명
- 날짜 · URL: 2025-11-17(v2 2026-08-09) · https://arxiv.org/abs/2511.12884
- 종류: 프리프린트
- 방법: 저장소 1,925곳의 지시 파일 2,303개, 지시 유형 16종.
- 핵심 결과: 파일은 「잦고 작은 추가」로 자라며 읽기 어렵다. 유형별 비율은 테스트 절차 75.9%, 구현 세부 70.8%, 아키텍처 68.1%, 보안 14.8%, 성능 14.5%.
- 한계: 효과를 재지 않았다. 읽기 어렵다는 판단의 수치는 초록에 없다.
- 시사점: 지시 파일은 덧붙이기만 하다 비대해진다. 「같은 실수가 두 번이면 한 줄 더하고 필요 없어지면 뺀다」 규칙과 맞는다.
- 열람 수준: 초록만

#### A9. Context Engineering for AI Agents in Open-Source Software

- 저자/기관: Mohsenimofidi, Galster, Treude, Baltes
- 날짜 · URL: v4 2026-02-05 · https://arxiv.org/abs/2510.21413
- 종류: 동료심사(MSR 2026)
- 방법: 저장소 10,000곳을 분석했고 지시 파일이 있는 곳은 466곳(5%). AGENTS.md 155개의 변경 이력을 주석했다.
- 핵심 결과:
    - 평균 줄 수: Copilot 지침 310, CLAUDE.md 287, AGENTS.md 142(SD 231), GEMINI.md 106.
    - 내용(제목 수): 관례 50, 기여 지침 48, 구조 47, 빌드 명령 40.
    - 변경: 50%는 한 번도 안 바뀜, 23%는 한 번, 21%는 2–7번, 6%는 10번 이상. 변경 유형은 지시 추가 78, 수정 59, 삭제 23.
    - 문체는 서술 · 처방 · 금지 · 설명 · 조건 5종이 섞인다(개수는 미보고).
- 한계: 효과를 재지 않았다.
- 시사점: 약 125줄은 AGENTS.md 평균(142)과 비슷한 수준이다.
- 열람 수준: 열람

#### A10. Beyond the Prompt: An Empirical Study of Cursor Rules

- 저자/기관: Shaokang Jiang, Daye Nam — UC Irvine
- 날짜 · URL: v2 2026-01-27 · https://arxiv.org/abs/2512.18925
- 종류: 동료심사(MSR 2026)
- 방법: 저장소 401곳의 `.mdc` 1,876개를 개방 코딩(κ 0.71).
- 핵심 결과: 파일 평균 462.67줄(SD 1,197, 최대 11,076). 줄의 **28.70%**가 중복이다. 「예시」 범주는 저장소의 50%에 있다. 언어 · 분야에 따라 내용이 다르다.
- 한계: 효과를 재지 않았다.
- 시사점: 여러 파일로 나누면 중복이 쉽게 생긴다. 「규칙은 원본 하나」 원칙의 근거가 된다(효과 측정은 아님).
- 열람 수준: 열람(본문 앞 100,000자)

#### A11. Rule Taxonomy and Evolution in AI IDEs: A Mining and Survey Study

- 저자/기관: Cai, R. Li, Peng Liang, Z. Li, Shahin — 우한대 등
- 날짜 · URL: 2026-06-10 · https://arxiv.org/abs/2606.12231
- 종류: 프리프린트
- 방법: 프로젝트 83곳에서 규칙 7,310개, 실무자 99명 설문, 규칙 변경 사건 1,540건, 그중 160건으로 산출물 준수를 평가.
- 핵심 결과: 77.78%가 「AI 실수를 고치려고」 규칙을 고친다고 답했고, 주로 금지 문장을 새로 더한다. 규칙을 갱신한 뒤 산출물 준수율이 **49.14% → 72.13%**(+22.99%p)로 올랐다. 실무자는 아키텍처 제약이 중요하다고 하지만, 파일에는 저수준 형식 규칙이 많다.
- 한계: 전후 비교라 통제가 없다. 준수를 정확히 어떻게 쟀는지는 초록만으로 알 수 없다.
- 시사점: 실수를 본 뒤 규칙을 더하면 그 규칙의 준수는 오른다(전후 비교 수준의 근거).
- 열람 수준: 초록만

#### A12. Codified Context: Infrastructure for AI Agents in a Complex Codebase

- 저자/기관: Aristidis Vasilopoulos(독립 연구자)
- 날짜 · URL: 2026-02-24 · https://arxiv.org/abs/2602.20478
- 종류: 프리프린트(개인 사례 연구)
- 방법: C# 108,256줄 프로젝트를 70일 동안 283세션 개발했다. 문서는 세 층이다.
    - 항상 싣는 「헌법」 파일 약 660줄
    - 전문 에이전트 명세 19개(약 9,300줄)
    - 필요할 때 MCP로 꺼내는 명세 34개(약 16,250줄)
    - 지시 문서 합계 약 26,200줄로, 코드의 24.2%
- 핵심 결과(관찰):
    - 저장 시스템 명세를 74세션이 참조했고, 4주 동안 저장 관련 버그 0건.
    - 낡은 명세 때문에 서로 모순되는 코드가 최소 2번 나왔다.
    - 유지에 주당 1–2시간이 든다.
- 한계: 1인 · 1프로젝트이고 대조군이 없다. 저자도 인과를 주장하지 않는다.
- 시사점: 결정 · 설계 문서는 일관성에 도움이 된다는 관찰이 있지만, 낡은 문서는 실제로 해를 끼쳤다. 결정 기록을 「옛 기록은 읽기 전용」으로 분리한 것과 맞다.
- 열람 수준: 열람

---

### B. 지시 수 · 길이 · 위치 — 10곳

#### B1. How Many Instructions Can LLMs Follow at Once? (IFScale)

- 저자/기관: Jaroslawicz, Whiting, Shah, Maamari — Distyl AI
- 날짜 · URL: 2025-07-15 · https://arxiv.org/abs/2507.11538
- 종류: 프리프린트
- 방법: 보고서 작성 과제에서 「키워드 X를 넣어라」 지시를 10개부터 500개까지 늘렸다. 20개 모델.
- 핵심 결과(정확도 %, 10 / 50 / 100 / 250 / 500개):

    | 모델              | 10   | 50   | 100  | 250  | 500  |
    | ----------------- | ---- | ---- | ---- | ---- | ---- |
    | gemini-2.5-pro    | 100  | 99.6 | 98.4 | 84.8 | 68.9 |
    | o3(high)          | 100  | 99.6 | 98.2 | 97.8 | 62.8 |
    | claude-opus-4     | 100  | 100  | 94.6 | 67.9 | 44.6 |
    | claude-sonnet-4   | 100  | 98.0 | 94.4 | 77.2 | 42.9 |
    | claude-3.7-sonnet | 100  | 99.6 | 94.8 | 72.9 | 52.7 |
    | gpt-4.1           | 98.0 | 98.8 | 95.4 | 74.0 | 48.9 |
    - 떨어지는 모양은 셋이다: 추론 모델은 임계점까지 버티다 꺾이고, gpt-4.1 · claude-3.7-sonnet은 직선으로, 작은 모델은 지수적으로 떨어진다.
    - 앞쪽 지시를 더 잘 지킨다(primacy). 뒤 1/3 오류율 ÷ 앞 1/3 오류율이 claude-3.7-sonnet 100개에서 2.67, o3 250개에서 2.33이다.
    - 오류는 대부분 빠뜨림이다(빠뜨림 : 변형 비율 6–35).

- 한계: 키워드를 넣는 단순 지시라서 코딩 규칙의 판단 난도와 다르다. 단일 턴만 봤다.
- 시사점: 최신 모델도 지시가 약 100개를 넘으면 빠뜨리기 시작한다. AGENTS.md + ai-check + 메모리 + 가이드를 합친 「동시에 지킬 규칙 수」가 관리 대상이다.
- 열람 수준: 열람

#### B2. When Instructions Multiply: Measuring and Estimating LLM Capabilities of Multiple Instructions Following (ManyIFEval · StyleMBPP)

- 저자/기관: Harada, Yamazaki, Taniguchi, Marrese-Taylor, Kojima, Iwasawa, Matsuo — 도쿄대 마쓰오 연구실
- 날짜 · URL: 2025-09-25 · https://arxiv.org/abs/2509.21051
- 종류: 동료심사(EMNLP 2025)
- 방법: 글쓰기 지시 최대 10개(ManyIFEval), 코드 스타일 지시 최대 6개(StyleMBPP). 10개 모델.
- 핵심 결과: 지시가 늘수록 성능이 꾸준히 떨어진다. 지시 수 하나만 넣은 로지스틱 회귀로 성능을 오차 약 10%로 예측한다. 같은 저자의 이전판(「Curse of Instructions」, ICLR 2025 제출본)은 2차 요약 기준으로 지시 10개를 모두 지킨 비율이 GPT-4o 약 15%, Claude 3.5 Sonnet 약 44%였다(2차 · 미확인).
- 한계: 모델이 구형이다. 수치 대부분이 초록에 없다.
- 시사점: 코드 스타일 지시도 개수가 늘면 「전부 지킬」 확률이 곱으로 떨어진다.
- 열람 수준: 초록만(+2차)

#### B3. Lost in the Middle: How Language Models Use Long Contexts

- 저자/기관: Nelson F. Liu, Kevin Lin, John Hewitt, Paranjape, Bevilacqua, Petroni, Percy Liang — Stanford · UC Berkeley · Samaya AI
- 날짜 · URL: 2023-07 / TACL 12권 157–173쪽(2024) · https://arxiv.org/abs/2307.03172
- 종류: 동료심사(TACL)
- 방법: NaturalQuestions 2,655문항, 문서 10 · 20 · 30개 중 정답 문서의 위치를 옮김. 키-값 검색 과제. 모델: GPT-3.5-Turbo, Claude-1.3, MPT-30B, LongChat-13B.
- 핵심 결과: U자형 곡선이 나온다. GPT-3.5-Turbo는 문서 20개(약 4K 토큰)에서 정답이 첫 위치일 때 약 75%, 가운데일 때 약 54%(그림에서 읽은 값)로, 문서 없이 답할 때(56.1%)보다 낮다. 문서를 20개에서 50개로 늘려도 GPT-3.5는 약 1.5%만 오른다.
- 한계: 2023년 모델이고 검색 · 질의응답 과제다. 지시 준수를 직접 잰 것이 아니다.
- 시사점: 긴 맥락의 가운데 정보는 덜 쓰인다. 다만 지시 파일 위치 실험(A3)에서는 효과가 보이지 않았다.
- 열람 수준: 열람(PDF 1–5쪽 원문)

#### B4. Context Rot: How Increasing Input Tokens Impacts LLM Performance

- 저자/기관: Kelly Hong, Anton Troynikov, Jeff Huber — Chroma
- 날짜 · URL: 2025-07-14 · https://www.trychroma.com/research/context-rot
- 종류: 회사 측정(기술 보고서)
- 방법: 18개 모델(Anthropic 5 · OpenAI 7 · Google 3 · Alibaba 3). 바늘 찾기 변형(질문과 바늘의 유사도, 방해 문장, 건초더미 구조), LongMemEval, 반복 단어 복사. 호출 194,480회.
- 핵심 결과:
    - 질문과 정답의 유사도가 낮을수록 길이에 따라 더 빨리 떨어진다.
    - 방해 문장은 1개만 있어도 성능을 낮추고, 4개면 더 낮춘다.
    - 문단을 섞은 건초더미가 일관된 글보다 18개 모델 모두에서 나았다.
    - LongMemEval: 필요한 부분만 준 약 300토큰 입력이 전체 약 113k토큰 입력보다 모든 모델에서 나았다.
- 한계: 회사 자료이고, 검색류 과제다.
- 시사점: 「비슷하지만 다른」 문장(방해 문장)이 특히 해롭다. 옛 규칙과 새 규칙이 함께 실리지 않게 하는 것(옛 결정 기록 격리)이 맞다.
- 열람 수준: 열람

#### B5. NoLiMa: Long-Context Evaluation Beyond Literal Matching

- 저자/기관: Modarressi, Deilamsalehy, Dernoncourt, Bui, Rossi, Yoon, Schütze — LMU · Adobe
- 날짜 · URL: 2025-02 · https://arxiv.org/abs/2502.05167
- 종류: 동료심사(ICML 2025)
- 방법: 질문과 바늘 사이에 글자가 겹치지 않는 바늘 찾기. 128K 이상을 내세우는 13개 모델.
- 핵심 결과: 32K에서 13개 중 11개가 짧은 입력 성능의 50% 아래로 떨어졌다. GPT-4o는 99.3% → 69.7%.
- 한계: 검색 과제다.
- 시사점: 규칙 문장과 실제 작업의 단어가 다르면(예: 규칙은 「위험 버튼」, 코드는 `variant="destructive"`) 긴 맥락에서 찾지 못할 수 있다.
- 열람 수준: 초록만

#### B6. Context Length Alone Hurts LLM Performance Despite Perfect Retrieval

- 저자/기관: Yufeng Du, Minyang Tian, … Roy Schwartz — UIUC · Amazon · Argonne · HUJI
- 날짜 · URL: 2025-10-06 · https://arxiv.org/abs/2510.05381
- 종류: 프리프린트(게재처 미확인)
- 방법: 모델 5개(Llama-3.1-8B, Mistral-7B, GPT-4o, Claude, Gemini). 과제는 VarSum · GSM8K · MMLU · HumanEval. 근거와 질문 사이에 무관한 글 · 공백을 넣거나 아예 가렸다.
- 핵심 결과: 초록 기준 정확도가 **13.9–85%** 떨어졌다. HumanEval은 Llama가 공백 30K에서 −31.7%p, 가림 30K에서 −50.0%p. GPT-4o HumanEval은 공백 30K에서 −3.1%p. 근거를 먼저 따라 쓰게 하는 방법(recite)으로 RULER GPT-4o가 최대 약 +4%p.
- 한계: 30K 이하만 봤고, 닫힌 모델의 하락은 작다.
- 시사점: 맥락이 길어지는 것만으로 손해다. 다만 최신 닫힌 모델은 하락이 작다.
- 열람 수준: 열람

#### B7. Same Task, More Tokens: the Impact of Input Length on the Reasoning Performance of LLMs

- 저자/기관: Mosh Levy, Alon Jacoby, Yoav Goldberg — Bar-Ilan · AI2
- 날짜 · URL: 2024-02 · https://arxiv.org/abs/2402.14848
- 종류: 동료심사(ACL 2024)
- 방법: FLenQA 3과제 × 100건에 무관한 글을 덧대 길이를 늘림. GPT-4 · GPT-3.5 · Gemini Pro · Mistral Medium · Mixtral.
- 핵심 결과: 모델 평균 정확도가 **0.92 → 0.68**(3,000토큰). CoT로도 격차가 메워지지 않았다(GPT-4만 예외).
- 한계: 2024년 모델이다.
- 시사점: 「최대 컨텍스트 한참 아래」에서도 하락이 시작된다.
- 열람 수준: 열람(일부)

#### B8. LLMs Get Lost in Multi-Turn Conversation

- 저자/기관: Laban, Hayashi, Zhou, Neville — Microsoft Research · Salesforce
- 날짜 · URL: 2025-05-09 · https://arxiv.org/abs/2505.06120
- 종류: 프리프린트
- 방법: 시뮬레이션 대화 200,000회 이상, 생성 과제 6종, 상위 모델들.
- 핵심 결과: 요구가 여러 턴에 나뉘면 평균 **39%** 떨어진다. 대부분은 능력 저하가 아니라 결과가 들쭉날쭉해진 탓이다. 이른 턴의 가정에 매여 회복하지 못한다.
- 한계: 요구가 덜 정해진 대화라는 설계다.
- 시사점: 규칙은 대화 중에 흘려 주기보다 처음부터 한곳에 완결된 문서로 주는 편이 낫다.
- 열람 수준: 초록만

#### B9. From Tools to Teammates: Evaluating LLMs in Multi-Session Coding Interactions (MemoryCode)

- 저자/기관: Rakotonirina, Hamdy, Campos, Weber, Testoni, Fadaee, Pezzelle, Del Tredici — UPF · Cohere · UvA
- 날짜 · URL: 2025-02 · https://arxiv.org/abs/2502.13791
- 종류: 동료심사(ACL 2025)
- 방법: 멘토-멘티 대화 속에 코딩 지시(예: 함수 이름 규칙)를 흩어 넣고 잡담을 섞었다. 지시가 중간에 바뀌기도 한다.
- 핵심 결과(0–1):

    | 모델           | 지시만 | 한 세션 | 짧은 이력 | 긴 이력 |
    | -------------- | ------ | ------- | --------- | ------- |
    | GPT-4o         | 0.94   | 0.93    | 0.79      | 0.30    |
    | Llama-3.1-405B | 0.95   | 0.90    | 0.70      | 0.20    |
    - 세션이 100개 가까이 되면 모든 모델이 약 0.1로 모인다.
    - 지시가 여러 번 바뀔수록 그 지시의 점수가 떨어진다.

- 한계: 합성 자료이고 2024년 모델이다.
- 시사점: 규칙이 대화 · 메모리 여러 곳에 흩어지고 갱신되면 무너진다. 「최신 결정만 한 파일에」 원칙의 근거다.
- 열람 수준: 열람

#### B10. Multi-IF: Benchmarking LLMs on Multi-Turn and Multilingual Instructions Following

- 저자/기관: Yun He 외 18명 — Meta GenAI
- 날짜 · URL: 2024-10(v2 11-13) · https://arxiv.org/abs/2410.15553
- 종류: 프리프린트
- 방법: IFEval을 3턴 대화로 늘리고 7개 언어로 옮김. 4,501개 대화. **한국어는 없다.**
- 핵심 결과: o1-preview 평균 정확도가 1턴 0.877에서 3턴 0.707로 떨어진다. 3턴에서 영어 0.773, 러시아어 0.531, 중국어 0.703, 힌디어 0.709. 1턴에서는 언어 차이가 거의 없다.
- 한계: 한국어가 없고 형식 제약 위주다.
- 시사점: 한국어 지시 문서의 불리함은 측정되지 않았다. 비영어 격차는 턴이 쌓일 때 커지는 경향이다(근거 약함).
- 열람 수준: 일부

---

### C. 지시 계층 · 충돌 — 4곳

#### C1. Control Illusion: The Failure of Instruction Hierarchies in Large Language Models

- 저자/기관: Geng, H. Li, Mu, Han, Baldwin, Abend, Hovy, Frermann — MBZUAI · 멜버른대 등
- 날짜 · URL: 2025-02-21(v4 2025-12-04) · https://arxiv.org/abs/2502.15851
- 종류: 동료심사(AAAI-26)
- 방법: 6개 모델에 서로 충돌하는 형식 제약을 시스템 · 사용자 자리에 나눠 줌.
- 핵심 결과: 시스템/사용자 구분이 우선순위를 믿을 만하게 세우지 못한다. 모델은 배정된 우선순위와 상관없이 특정 제약 유형을 편애한다. 「권위 · 전문성 · 합의」 같은 사회적 틀이 역할 구분보다 행동을 더 크게 바꾼다.
- 한계: 형식 충돌만 봤고, 초록에 숫자가 없다.
- 시사점: 「무엇을 기준으로 하나」처럼 문서 우선순위를 적어 둬도, 문서끼리 모순되면 그 순서가 지켜진다는 보장은 없다. 모순 자체를 없애는 것이 먼저다.
- 열람 수준: 초록만

#### C2. IHEval: Evaluating Language Models on Following the Instruction Hierarchy

- 저자/기관: Zhihan Zhang 외 — Notre Dame · Amazon · WPI
- 날짜 · URL: NAACL 2025 장문 425 · https://aclanthology.org/2025.naacl-long.425/
- 종류: 동료심사(NAACL 2025)
- 방법: 과제 9종, 예제 3,538개. 지시가 서로 맞는 경우와 충돌하는 경우를 함께 넣었다.
- 핵심 결과: 충돌하면 모든 모델이 크게 떨어진다. 가장 나은 공개 모델도 충돌 해결 정확도가 **48%**다.
- 한계: 모델별 표는 확인하지 못했다.
- 시사점: 충돌이 없도록 쓰는 것이 우선순위 규칙보다 확실하다.
- 열람 수준: 2차(검색 결과의 초록 인용)

#### C3. The Instruction Hierarchy: Training LLMs to Prioritize Privileged Instructions

- 저자/기관: Wallace, Xiao, Leike, Weng, Heidecke, Beutel — OpenAI
- 날짜 · URL: 2024-04-19 · https://arxiv.org/abs/2404.13208
- 종류: 회사 측정(프리프린트)
- 방법: GPT-3.5를 우선순위 데이터로 미세조정.
- 핵심 결과: 본 적 없는 공격 유형까지 강건성이 「크게」 늘었고, 일반 능력 저하는 작았다. 2차 기사의 「최대 63%」 같은 수치는 원문에서 확인하지 못했다.
- 한계: 학습 방법 논문이라 문서 작성법과는 간접적이다.
- 시사점: 우선순위 준수는 문서보다 모델 학습에 달린 문제다.
- 열람 수준: 2차

#### C4. SysBench: Can Large Language Models Follow System Messages?

- 저자/기관: Qin 외 12명 — 북경대 · Baichuan
- 날짜 · URL: 2024-08-20 · https://arxiv.org/abs/2408.10943
- 종류: 프리프린트(ICLR 2025 포스터 페이지 있음, 미확인)
- 방법: 손으로 만든 시스템 메시지 500개 × 다턴 대화, 제약 6종.
- 핵심 결과: 제약 위반 · 지시 오판 · 다턴 불안정 세 약점을 보고했다. 시스템 메시지에 주는 어텐션이 클수록 준수가 높았다(2차). 초록에 수치가 없다.
- 한계: 중국어 중심이다.
- 시사점: 턴이 쌓일수록 세션 전체를 지키는 비율이 따로 떨어진다(B8 · B9와 같은 방향).
- 열람 수준: 초록만

---

### D. 저장소 문서 · 명세 · 검색 맥락 — 6곳

#### D1. RepoCoder: Repository-Level Code Completion Through Iterative Retrieval and Generation

- 저자/기관: Fengji Zhang, Bei Chen 외 — Microsoft · 홍콩시립대
- 날짜 · URL: 2023-03 · https://arxiv.org/abs/2303.12570
- 종류: 동료심사(EMNLP 2023)
- 방법: 저장소 안의 비슷한 코드를 반복 검색해 완성 모델에 줌. RepoEval.
- 핵심 결과: 파일 안 문맥만 쓴 기준보다 모든 설정에서 **10% 이상** 좋아졌다.
- 한계: 에이전트가 아닌 코드 완성이고, 문서가 아닌 코드 검색이다.
- 시사점: 「작업 중인 코드와 가까운 실제 예」를 꺼내 주면 효과가 있다. 부품 사용 예가 가이드에 있는 구조와 맞다.
- 열람 수준: 초록만

#### D2. CodeRAG-Bench: Can Retrieval Augment Code Generation?

- 저자/기관: Z. Z. Wang, Asai, Yu, F. F. Xu, Xie, Neubig, Fried — CMU · UW
- 날짜 · URL: 2024-06(v2 2025-02) · https://arxiv.org/abs/2406.14497
- 종류: 프리프린트(NAACL 2025 Findings로 알려져 있으나 이 조사에서 미확인)
- 방법: 대회 풀이 · 튜토리얼 · 라이브러리 문서 · StackOverflow · GitHub 다섯 가지 출처를 검색해 코드 생성에 붙임.
- 핵심 결과: 질 좋은 맥락을 찾아 주면 「눈에 띄는」 향상이 있다. 단어가 덜 겹치면 검색이 실패하고, 맥락 길이가 제한되면 생성기가 그 맥락을 못 쓴다. 초록에 수치가 없다.
- 한계: 수치를 확인하지 못했다.
- 시사점: 문서는 「찾을 수 있게」 쓰여야 효과가 난다. 파일 이름 · 제목을 작업에서 쓰는 단어로 맞추는 것이 중요하다.
- 열람 수준: 초록만

#### D3. DocPrompting: Generating Code by Retrieving the Docs

- 저자/기관: Shuyan Zhou, Uri Alon, F. F. Xu, Z. Wang, Z. Jiang, Neubig — CMU
- 날짜 · URL: 2022-07 · https://arxiv.org/abs/2207.05987
- 종류: 동료심사(ICLR 2023)
- 방법: 라이브러리 문서를 검색해 코드 생성에 붙임.
- 핵심 결과: CoNaLa CodeT5 pass@1 **+2.85%p**(상대 +52%), pass@10 +4.39%p. Bash tldr exact match 최대 +6.9%p.
- 한계: 작은 모델이다.
- 시사점: 모델이 모르는 API는 문서를 주면 고친다(Vercel 결과와 같은 방향).
- 열람 수준: 초록만

#### D4. SWE-Bench Pro: Can AI Agents Solve Long-Horizon Software Engineering Tasks?

- 저자/기관: Xiang Deng, Jeff Da 외 — Scale AI
- 날짜 · URL: 2025-09(v2 11-14) · https://arxiv.org/abs/2509.16941
- 종류: 프리프린트(회사)
- 방법: 1,865문제. 문제 설명에 요구사항 · 인터페이스 명세를 붙였을 때와 뗐을 때를 비교(표 3).
- 핵심 결과: GPT-5(high) **25.9% → 8.40%**, Claude Opus 4.1 **22.7% → 8.20%**(명세를 뗐을 때).
- 한계: 명세를 떼면 채점 테스트의 이름 · 시그니처를 맞추기 어려워지는 효과가 섞여 있다.
- 시사점: 과제마다 「무엇을 · 어떤 이름으로」를 정한 명세는 성공률을 크게 바꾼다. 상시 지시 파일보다 과제 명세의 효과가 훨씬 크다.
- 열람 수준: 일부(표 3)

#### D5. Grounding AI Agents in Contracts: An Empirical Evaluation of Spec-Driven Test Generation

- 저자/기관: Tufano, McClure, Cambronero 외 — Google
- 날짜 · URL: 2026 · https://research.google/pubs/grounding-ai-agents-in-contracts-an-empirical-evaluation-of-spec-driven-test-generation/
- 종류: 동료심사(SpecOps '26 워크숍) / 회사 측정
- 방법: 에이전트가 먼저 사전 · 사후 조건 명세를 쓰고 테스트를 만들게 함. Google 운영 버그로 평가.
- 핵심 결과: 버그 검출률 **+9.8%p**(p=0.0352), 분기 커버리지 +2.5%p(p=0.0034). LLM 심판 기준으로 기준선보다 낫다 77.8%, 사람 테스트보다 낫다 56.7%.
- 한계: 표본 수가 페이지에 없고, 테스트 생성에 한정된다.
- 시사점: 「먼저 명세를 쓰고 구현」 순서는 측정된 이득이 있다(spec-driven의 첫 측정 근거 중 하나).
- 열람 수준: 초록만

#### D6. Testing the Effect of Code Documentation on Large Language Model Code Understanding

- 저자/기관: William Macke, Michael Doyle — MITRE
- 날짜 · URL: 2024-04 · https://arxiv.org/abs/2404.03114
- 종류: 동료심사(NAACL 2024 Findings)
- 방법: HumanEval에서 문서(주석)를 옳게 · 틀리게 · 빠지게 바꿈.
- 핵심 결과: 틀린 문서는 이해를 「크게」 해친다. 빠지거나 불완전한 문서는 큰 영향이 없다. 초록에 수치가 없다.
- 한계: 예비 연구다.
- 시사점: 문서가 없는 것보다 틀린 문서가 더 나쁘다. 결정이 바뀌면 같은 작업에서 가이드를 고치는 규칙이 이 결과와 맞다.
- 열람 수준: 초록만

---

### E. 형식 · 강조 · 예시 · 부정문 · 결정 기록 — 8곳

#### E1. Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design

- 저자/기관: Sclar, Yejin Choi, Tsvetkov, Suhr — UW
- 날짜 · URL: 2023-10 · https://arxiv.org/abs/2310.11324
- 종류: 동료심사(ICLR 2024)
- 핵심 결과: 뜻이 같은 형식 차이(구분자 · 공백 · 대소문자)만으로 LLaMA-2-13B에서 최대 **76%p** 차이가 났다. 모델을 키우거나 예시를 늘리거나 지시 튜닝을 해도 사라지지 않는다.
- 한계: 공개 모델 · 분류 과제다.
- 시사점: 형식이 결과를 흔들 수는 있지만, 어느 형식이 좋다는 일반 규칙은 나오지 않는다.
- 열람 수준: 초록만

#### E2. Does Prompt Formatting Have Any Impact on LLM Performance?

- 저자/기관: Jia He 외 — Microsoft
- 날짜 · URL: 2024-11 · https://arxiv.org/abs/2411.10541
- 종류: 프리프린트
- 핵심 결과: 같은 내용을 평문 · Markdown · JSON · YAML로 바꿔 줬을 때 GPT-3.5-turbo는 코드 번역 과제에서 최대 **40%** 차이가 났다. GPT-4는 더 안정적이었다.
- 시사점: 최신 큰 모델일수록 문서 형식의 영향이 작다.
- 열람 수준: 초록만

#### E3. 강조(대문자 · MUST) 측정 — 직접 연구 없음, 보조 3곳

- **Attention is Case-Sensitive**(Corso 외, arXiv 2608.03711, 2026-08 추정, 프리프린트): 13개 모델에서 대문자로 쓴 부분에 어텐션이 쏠린다. 그러나 어텐션 집중이 정확도 향상으로 이어지지 않았고, 추론 모델은 영향을 덜 받는다. 지시 준수는 재지 않았다. 열람 수준: 2차(https://tldr.takara.ai/p/2608.03711).
- **Does SHOUTING at LLMs help?**(S Anand, 2025-06-11, 개인 측정, https://www.s-anand.net/blog/shouting-at-llms/): 사용자가 시스템 규칙을 대문자로 무시하라고 했을 때, 시스템 규칙을 지키던 모델의 준수가 약 2–3% 낮아졌다. 모델당 10회. 열람 수준: 열람.
- **Vercel(A4)의 문구 실험**: 「You MUST invoke the skill」 문구가 오히려 문서에 매이게 해 결과를 낮췄다(회사 측정).
- **Principled Instructions Are All You Need**(Bsharat, Myrzakhan, Shen — MBZUAI, 2023-12, https://arxiv.org/abs/2312.16171, 프리프린트): 원칙 26개(「You MUST」 · 벌칙 문구 포함으로 알려짐)를 LLaMA · GPT에 적용했다. 원칙별로 강조어 효과를 분리한 수치는 초록에 없다. 열람 수준: 초록만.

#### E4. The First Prompt Counts the Most! An Evaluation of LLMs on Iterative Example-Based Code Generation

- 저자/기관: Yingjie Fu, Bozhou Li, Linyi Li, Wentao Zhang, Tao Xie — 북경대 · SFU
- 날짜 · URL: ISSTA 2025 · https://conf.researchr.org/details/issta-2025/issta-2025-papers/69
- 종류: 동료심사(ISSTA 2025)
- 방법: 기능 168개, 6개 모델. 요구사항을 자연어 대신 입출력 예시로 줌.
- 핵심 결과: 예시만 주면 점수가 **60% 넘게** 떨어진다. 성공 사례의 95% 이상이 첫 라운드에서 풀린다. 부정확한 자연어 설명이라도 예시에 더하면 크게 좋아진다.
- 한계: 「예시 vs 규칙」 비교라기보다 「예시만 vs 문장」 비교다.
- 시사점: 예시는 규칙 문장을 대신하지 못한다. 규칙 문장에 예시를 덧붙이는 조합이 측정상 낫다.
- 열람 수준: 초록만

#### E5. Can Large Language Models Truly Understand Prompts? A Case Study with Negated Prompts

- 저자/기관: Joel Jang, Seonghyeon Ye, Minjoon Seo — KAIST
- 날짜 · URL: 2022-09 · https://arxiv.org/abs/2209.12711
- 종류: 동료심사(NeurIPS 2022 워크숍)
- 핵심 결과: 과제 9개에서 「~하지 마라」 지시는 모델이 클수록 더 못 지켰다(역스케일링). 인컨텍스트 예시는 일부 상황에서만 도움이 됐다.
- 한계: 2022년 모델이라 최신 지시 튜닝 모델에서는 미확인이다.
- 시사점: 「하지 않는다」 목록의 효과는 최신 모델에서 측정되지 않았다(근거 약함).
- 열람 수준: 2차

#### E6. Can LLMs Generate Architectural Design Decisions? An Exploratory Empirical Study

- 저자/기관: Rudra Dhar, Karthik Vaidhyanathan, Vasudeva Varma — IIIT Hyderabad
- 날짜 · URL: 2024-03 · https://arxiv.org/abs/2403.01709
- 종류: 동료심사(ICSA 2024)
- 방법: ADR의 「맥락」을 주고 「결정」을 만들게 함. GPT · T5, 제로샷 · 퓨샷 · 미세조정.
- 핵심 결과: GPT-4는 제로샷으로도 관련 있고 정확한 결정을 내지만 사람 수준에는 못 미친다. 초록에 수치가 없다.
- 한계: ADR을 「만드는」 연구이고, ADR을 맥락으로 「주는」 효과는 재지 않았다.
- 시사점: 결정 기록을 에이전트에게 주면 일관성이 오르는지는 이 갈래에서 측정 근거를 찾지 못했다.
- 열람 수준: 2차(검색 결과의 초록 인용)

---

### 찾지 못한 것(근거 공백)

- 강조어(IMPORTANT · MUST · 대문자)가 지시 준수를 높이는지 통제 실험으로 잰 논문은 없다.
- 결정 기록(ADR)을 맥락으로 주는 효과를 잰 연구도 없다. 사례 연구(A12)뿐이다.
- Diátaxis · docs-as-code 구조가 에이전트 성능에 주는 효과를 잰 연구도 찾지 못했다(업계 주장 글만 있음).
- 한국어 지시 문서와 영어 지시 문서를 비교한 측정은 없다.
- 「좋은 예 · 나쁜 예」 대 「규칙 문장」을 직접 비교한 코딩 에이전트 연구도 없다.
- 경로별 규칙(path-scoped rules)의 효과는 따로 측정되지 않았다. A3의 「한 파일 vs 나눔」이 가장 가깝고 결과는 효과 없음이다.

---

### 판정표

| #   | 주장                                                           | 판정                                                                                                   | 근거 요약                                                                                                                                                                                                                                                                                                                                                                    |
| --- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 지시 파일은 짧을수록 잘 지킨다                                 | **반대 근거 있음**(준수 기준) · 성능 기준으로는 약함                                                   | 지시 파일 크기를 직접 바꾼 요인 실험(A3, 16,050관찰)에서 크기는 준수에 효과가 없었고 베이즈 인자도 효과 없음을 지지했다. 성능 쪽 간접 근거: 망라형 스킬 −2.9%p(A5), 불필요한 요구가 과제를 어렵게 함(A1), 길이만으로 성능 하락(B4 · B6 · B7).                                                                                                                                |
| 2   | 지시가 많아지면 준수율이 떨어진다                              | **근거 강함**                                                                                          | IFScale(B1): 최신 모델도 약 100개까지 94–98%, 250개에서 68–98%, 500개에서 40–69%. 추론 모델은 약 150–250개까지 버티고, Claude 4 계열은 100개에서 약 94%로 내려가기 시작한다. ManyIFEval(B2, EMNLP 2025): 6–10개에서도 「전부 지킬」 비율이 꾸준히 하락. 세션 안 누적(A3: 함수당 승산 −5.6%)과 세션 간 누적(B9: 0.94 → 0.30)도 같은 방향. 단, 키워드 같은 단순 지시 기준이다. |
| 3   | 지시 파일은 작업 성공률을 높인다                               | **근거 약함 · 반대 근거 있음**                                                                         | 사람이 쓴 파일 +4%(Claude Code 제외, 비용 최대 +19%), LLM이 만든 파일 −0.5~−3%p(A1). 효율은 시간 −28.6%, 출력 토큰 −16.6%(A2, 정답률 미측정). 모델이 모르는 지식(새 API 색인)이 들어갈 때만 크게 올랐다(A4: 53 → 100%, 회사 측정).                                                                                                                                           |
| 4   | 저장소 구조 · 명령을 적으면 도움이 된다                        | 명령: **근거 강함**(사용 빈도) · 구조 개요: **반대 근거 있음**                                         | 적은 도구는 과제당 1.6회, 안 적은 도구는 0.01회 미만으로 쓰인다(A1). 다만 그것이 성공률을 올렸는지는 따로 재지 않았다. 디렉터리 개요는 관련 파일에 닿는 단계를 줄이지 못했다(A1).                                                                                                                                                                                            |
| 5   | 필요한 문서만 그때 불러오는 것이 한 파일에 다 쓰는 것보다 낫다 | **반대 근거 있음**(부를지를 에이전트가 고르는 방식) · 「항상 실린 색인 + 본문 파일」은 근거 약함(지지) | 스킬을 기본으로 두면 56%에서 안 불렸고 53%로 문서 없음과 같았다. 명시 지시를 붙여도 79%에 그쳤고, AGENTS.md 색인은 100%였다(A4). 한 파일 vs 나눔은 준수 차이가 없었다(A3). 사람이 고른 스킬 2–3개는 +18.6%p(A5, 스킬 없음 대비이고 한 파일 대비는 아님).                                                                                                                     |
| 6   | 강조어(IMPORTANT · MUST · 대문자)가 준수를 높인다              | **근거 없음**(약한 반대 근거 있음)                                                                     | 통제 실험이 없다. 대문자는 어텐션을 끌지만 정확도로 이어지지 않았다(E3, 2차). 「You MUST invoke」 문구가 결과를 낮춘 회사 관찰이 있다(A4). 개인 측정은 n=10에 2–3% 차이(E3).                                                                                                                                                                                                 |
| 7   | 긴 컨텍스트 중간의 지시는 덜 지킨다                            | **근거 약함**(일반 맥락은 강함, 지시 파일 직접 측정은 효과 없음)                                       | 일반 맥락 근거: 검색 정보가 가운데 있을 때 약 75 → 약 54%(B3, 2023년 모델). 뒤쪽 지시를 1.3–2.7배 더 빠뜨림(B1). 반면 지시 파일 안 위치(맨 위 vs 묻힘)는 준수 차이가 검출되지 않았다(A3, 효과 없음 증거는 아님).                                                                                                                                                             |
| 8   | 결정 기록 · 설계 문서를 주면 일관성이 오른다                   | **근거 약함**                                                                                          | 과제 명세: 명세를 빼면 해결률이 25.9 → 8.4%, 22.7 → 8.2%(D4). 명세를 먼저 쓰면 버그 검출 +9.8%p(D5). ADR 형식 자체: 측정 없음. 사례 연구 n=1(A12)에서 일관성 관찰과 함께 낡은 명세가 모순 코드를 만든 사례가 있다. 틀린 문서는 크게 해롭다(D6).                                                                                                                              |
| 9   | 사람이 쓴 지시 파일이 AI가 자동으로 만든 것보다 낫다           | **근거 강함**(단, 사람 파일의 이득 자체는 작음)                                                        | 서로 독립인 통제 연구 둘이 같은 방향이다. 사람 +4% / LLM −2~−3%(A1), 사람이 고른 스킬 +16.2%p / 스스로 만든 스킬 −1.3%p(A5). 예외: 기존 문서를 지운 저장소에서는 LLM 파일이 +2.7%로 사람 파일을 이겼다(A1). 자동 생성 뒤 방치된 파일은 24%(A6).                                                                                                                              |
| 10  | 예시(좋은 예 · 나쁜 예)가 규칙 문장보다 잘 먹힌다              | **근거 없음**(간접 반대 근거 있음)                                                                     | 직접 비교 연구가 없다. 예시만으로 요구를 주면 자연어보다 60% 넘게 떨어지고, 문장 + 예시 조합이 낫다(E4). 부정 지시 · 부정 예시는 2022년 모델에서 약했다(E5). cursor rules의 50%가 예시를 쓰지만 효과는 미측정(A10).                                                                                                                                                          |

#### 이 사람의 지금 구조에 대한 시사점(측정 근거가 있는 것만)

1. AGENTS.md 약 125줄은 Bloat 기준(200줄) 아래이고, AGENTS.md 평균(142줄)보다 짧다. 줄 수를 더 줄여서 얻는 준수 이득은 측정되지 않았다(A3). 대신 매 작업에 함께 실리는 **규칙의 개수**(AGENTS.md + ai-check 32줄 + 메모리 약 45줄 + 그날 읽는 가이드 파일)를 세는 편이 측정 근거(B1 · B2)와 맞는다.
2. 「폴더: …」 같은 구조 개요 줄은 측정상 이득이 없다(A1). 명령(`npm run …`, e2e 절차)은 그대로 쓰이므로 남길 근거가 있다(A1).
3. 디자인 가이드를 색인 + 파일로 나눈 구조는 Vercel 결과(A4)와 맞는다. 단, 그 결과에서 이긴 조건은 **항상 실린 파일 안에 색인이 직접 있는 것**이었다. 지금은 AGENTS.md → docs/design/README.md를 한 번 더 거쳐야 색인이 나온다.
4. 끝내기 전에 ai-check를 다시 보는 단계는 측정 근거가 있는 쪽이다. 세션 후반으로 갈수록 준수가 떨어지기 때문이다(A3 함수당 −5.6%, B9).
5. 옛 결정 기록을 읽기 전용으로 격리하고 「되살리지 않는다」고 한 것은 근거와 같은 방향이다. 비슷하지만 다른 문장은 방해가 되고(B4), 갱신된 지시는 덜 지켜지며(B9), 낡은 명세는 모순 코드를 만들었다(A12).
6. 대문자 · 강조어를 더 넣는 것은 근거가 없다(E3).
7. 한국어 문서의 불리함 여부는 측정이 없다(B10은 한국어 미포함).
