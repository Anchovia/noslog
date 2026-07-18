# NosLog

NOSTALGIA 플레이 기록을 모아 보고, 악곡별 성과와 랭킹을 확인하는 비공식 팬 프로젝트입니다.

> NosLog는 KONAMI 및 공식 NOSTALGIA 서비스와 관련이 없습니다.

## 구성

- **홈**: 주요 메뉴와 사용자 랭킹
- **악곡**: 검색, 필터, 정렬, 난이도별 기록과 커뮤니티 평가
- **랭킹**: Basic 및 Recital 사용자 순위
- **서열표**: 레벨 상수별 악곡과 사용자 추천 구간
- **빙고**: 플레이 기록 기반 미션과 달성 현황
- **검정**: 과제곡, 합격 조건, 기록 시뮬레이션
- **프로필**: 베스트 성과, 최근 플레이, 랭크 분포
- **데이터 연동**: 북마클릿을 이용한 NOSTALGIA 기록 동기화
- **관리자**: 악곡, 서열표, 빙고, 검정, 사용자 데이터 관리

## 기술 스택

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4, Radix UI
- Prisma 6, Neon PostgreSQL
- Discord OAuth, iron-session
- Vercel Blob
- Vitest, ESLint, Prettier, Husky

## 로컬 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.example`을 복사해 `.env`를 만들고 실제 값을 입력합니다.

```powershell
Copy-Item .env.example .env
```

### 3. 데이터베이스 적용

```bash
npm run db:migrate:deploy
```

`npm install` 이후 Prisma Client는 자동으로 생성됩니다. 직접 다시 생성하려면 다음 명령을 사용합니다.

```bash
npx prisma generate
```

### 4. 개발 서버 실행

```bash
npm run dev
```

기본 주소는 `http://localhost:3000`입니다.

## 검사 명령

```bash
npm run typecheck
npm run lint
npm test
npm run build
```
