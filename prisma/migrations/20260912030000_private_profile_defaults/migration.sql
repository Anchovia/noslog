-- 새 가입자는 공개 설정 5개가 모두 꺼진 상태로 시작한다(2026-09-12 사용자 결정).
-- 기본값만 바꾸고 기존 사용자의 값은 건드리지 않는다.
ALTER TABLE "User"
ALTER COLUMN "hide_nostalgia_name" SET DEFAULT true,
ALTER COLUMN "hide_discord_name" SET DEFAULT true,
ALTER COLUMN "hide_play_count" SET DEFAULT true,
ALTER COLUMN "hide_preferred_arcade" SET DEFAULT true,
ALTER COLUMN "hide_play_activity" SET DEFAULT true;
