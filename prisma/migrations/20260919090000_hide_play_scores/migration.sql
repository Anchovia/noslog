-- 플레이 점수 비공개 설정(기본 공개)
ALTER TABLE "User" ADD COLUMN "hide_play_scores" BOOLEAN NOT NULL DEFAULT false;
