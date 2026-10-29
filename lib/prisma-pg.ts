// Prisma 7 pg 어댑터 연결 옵션(2026-10-16 D10) — 앱(lib/db.ts) · DB 테스트가 같이 쓴다. prisma/script-env.mjs 도 같은 값.
// 세션 시간대를 UTC 로 고정한다: adapter-pg 7.10 은 timestamptz 글자의 시차(+09 등)를 +00:00 으로 바꿔 읽어,
// DB 기본 시간대가 UTC 가 아니면(로컬 Postgres 의 Asia/Seoul) 시각이 그만큼 밀린다. 운영 PlanetScale · 개발 Neon 은 원래 UTC
export const PRISMA_PG_SESSION_OPTIONS = "-c TimeZone=UTC";

// 점검 중(MAINTENANCE_MODE=true)에는 연결을 읽기 전용으로 연다 — 점검 화면을 비켜 온 서버 액션 · 관리자 화면 · cron 도
// 덤프 뒤 옛 DB 에 쓰지 못한다. 원시 SQL 까지 Postgres 가 거절한다
export function prismaPgSessionOptions(maintenance: boolean) {
    return maintenance
        ? `${PRISMA_PG_SESSION_OPTIONS} -c default_transaction_read_only=on`
        : PRISMA_PG_SESSION_OPTIONS;
}
