# 운영 DB 를 PlanetScale Postgres 서울로, 함수 리전을 서울로

- 상태: 유효
- 날짜: 2026-10-28
- 분야: 구조
- 고른 사람: 사용자(PS-5 · 서울 · 17.11 · 단일 노드 · 디스크 상한 10 GB 모두 사용자 선택)

## 맥락

Neon 무료 플랜의 compute 한도(프로젝트당 월 100 CU-hours)가 홈페이지 개편 작업 달에 90%를 넘었다. Vercel Pro 요금에 DB 유료 요금까지 더하지 않으려고 더 싼 곳을 찾았다. Neon 은 서울 · 도쿄 리전이 없어 함수와 DB 가 싱가포르에 있었다.

## 결정

- 운영 DB 는 PlanetScale Postgres `noslog` 한 개다. GCP asia-northeast3(서울) · Postgres 17.11 · Single node PS-5(1/16 vCPU · 512 MB) · 월 $5 · 디스크 최소 10 GB · 상한 10 GB.
- Vercel 함수 리전은 `icn1`(서울)이다(`vercel.json`).
- 앱은 `DATABASE_URL` 로 PgBouncer(6432)에 붙고, 배포 빌드의 `prisma migrate deploy` 는 `DATABASE_MIGRATION_URL`(직접 연결 5432)이 있으면 그쪽으로 돈다(`prisma.config.ts`). 최대 연결 수가 25 라서 함수가 직접 붙지 않게 한다.
- 개발 DB 는 Neon `noslog-dev` 에 둔다. 운영 Neon 은 이전 뒤에도 되돌리기용으로 남기고, 지우는 시점은 사용자가 정한다.
- 개인정보처리방침 7번의 DB 위탁처 · 리전과 서버 리전을 바꾼 판을 이전과 같은 날(2026-10-28) 시행한다(2026-09-26 판은 이전 버전으로 보관).

## 고르지 않은 안

- Neon Launch 유지 — 쓴 만큼 월 약 $11–19, 서울 · 도쿄 리전 없음
- Supabase Pro 서울 — 월 $25 로 지금보다 비쌈
- VPS 직접 운영(Oracle Always Free · Lightsail 서울) — 패치 · 백업 · 장애 대응을 직접 해야 하고, Oracle 은 SLA 가 없고 유휴 회수 · 계정 정지 보고가 있음
- AWS RDS · Azure · Lightsail 관리형 서울 — 월 $15–25

## 근거

- 조사: 출처 약 196곳(실제 서비스 사례 37건 · 가이드 45곳 · 공식 요금 59곳 · Oracle 회수 규칙 약 60곳). 비교 시안 https://claude.ai/artifact/E18QUZebLhDAkXK3dpWx1U
- 공식 값: PlanetScale `pricing.md?region=gcp-asia-northeast3` 에서 PS-5 non-HA $5 · HA $15, 다음 크기 PS-10(1/8 vCPU · 1 GB) $16. 백업 12시간마다 · 2일 보관 · PITR.
- 개발 데이터 시험(2026-10-28): 빈 DB 에 마이그레이션 86개 59초(5432) · 개발 덤프 3.2 MB 복원 72초 · 78개 표 행 수 일치 · 6432 로 운영 빌드 성공.
- 같은 빌드 · 캐시 없이 91페이지를 20개씩 동시에(로컬 한국): Neon p50 2.80초 · p95 8.02초 / PS-5 6432 p50 1.41초 · p95 3.90초. 오류 0, DB 연결 최대 11.
- 남은 한계: 운영 크기 데이터 · 실제 동기화 API · 레이팅 전원 재계산은 시험하지 않았다.

## 바뀌는 곳

- 문서: `README.md` 기술 스택 · 배포, `AGENTS.md` 운영 DB 정의, `docs/design/product-rules.md` 「데이터 보관과 운영자 정보」, `docs/code-style.md` 마이그레이션 주소, 이전 순서는 [운영 DB 이전](../operations/db-migration-planetscale.md)
- 코드: `vercel.json` · `prisma.config.ts` · `.env.example` · `lib/prisma-pg.ts` 주석
- 처리방침: `features/privacy/content/policyCopy.json` · `versions/2026-09-26.json` · `privacy-content.ts` · `tests/privacy-history.test.ts`
